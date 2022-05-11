<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Professionals.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Model_DbTable_Professionals extends Engine_Db_Table {

  protected $_rowClass = "Booking_Model_Professional";

  public function getProfessioanlId($viewerId)
  { 
    $select = $this->select();
    $select->from($this->info('name'), array('*'));
    $select->where('user_id =?', $viewerId);
    //echo $select;die;
    return $this->fetchRow($select);

  }
  public function getMediaType() {
    return 'professional';
  }
  public function getShortType()
  {
    return 'professional';
  }

  public function isProfessional($professionalViewID = NULL) {
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $select = $this->select();
    if (!empty($professionalViewID)) {
      $select->where('professional_id =?', $professionalViewID);
    } else {
      $select->where('user_id =?', $viewerId);
      $select->where('is_deleted =?', 0);
    }
    return $this->fetchRow($select);
  }

  public function getProfessionalPaginator($params = array()) {
    return Zend_Paginator::factory($this->getProfessionalSelect($params));
  }

  public function getProfessionalSelect($params = array()) {
    
    $tableName = $this->info('name');
    $tableLocationName = Engine_Api::_()->getDbTable('locations', 'sesbasic')->info('name');
    $select = $this->select()->setIntegrityCheck(false)->from($tableName);
    $serviceTable = Engine_Api::_()->getItemTable('booking_service');
    $serviceTableName = $serviceTable->info('name');
    $settingsTable = Engine_Api::_()->getItemTable('booking_settings');
    $settingsTableName = $settingsTable->info('name');

    if (isset($params['professionalName']) && !empty($params['professionalName'])) {
      $select->where($tableName . '.name LIKE ?', '%' . $params['professionalName'] . '%');
    }
    if (isset($params['serviceName']) && !empty($params['serviceName'])) {
      $select->join($serviceTableName, $serviceTableName . '.user_id = ' . $tableName . '.user_id', null)
        ->where($serviceTableName . '.name LIKE ?', '%' . $params['serviceName'] . '%');
      $select->where($tableName . ".active = ?", 1)->where($serviceTableName . ".active = ?", 1)
        ->group($tableName . ".professional_id");
    }
    if (empty($params)) {
      $select->where("active = ?", 1);
    }
    
    //Location Based search
    if(Engine_Api::_()->getDbtable('modules', 'core')->isModuleEnabled('seslocation') && Engine_Api::_()->getApi('settings', 'core')->getSetting('seslocationenable', 1) && empty($params['lat']) && !empty($_COOKIE['sesbasic_location_data'])) {
      $params['location'] = $_COOKIE['sesbasic_location_data'];
      $params['lat'] = $_COOKIE['sesbasic_location_lat'];
      $params['lng'] = $_COOKIE['sesbasic_location_lng'];
      $params['miles'] = Engine_Api::_()->getApi('settings', 'core')->getSetting('seslocation.searchmiles', 50);
    }
    
    if (isset($params['lat']) && isset($params['miles']) && $params['miles'] != 0 && isset($params['lng']) && $params['lat'] != '' && $params['lng'] != '' && ((isset($params['location']) && $params['location'] != ''))) {
      $origLat = $lat = $params['lat'];
      $origLon = $long = $params['lng'];
      if (Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.search.type', 1) == 1) {
        $searchType = 3956;
      } else
        $searchType = 6371;
      //This is the maximum distance (in miles) away from $origLat, $origLon in which to search
      $dist = $params['miles'];

      $select->joinLeft($tableLocationName, $tableLocationName . '.resource_id = ' . $tableName . '.professional_id AND ' . $tableLocationName . '.resource_type = "professional" ', array('lat', 'lng', 'distance' => new Zend_Db_Expr($searchType . " * 2 * ASIN(SQRT( POWER(SIN(($lat - lat) *  pi()/180 / 2), 2) +COS($lat * pi()/180) * COS(lat * pi()/180) * POWER(SIN(($long - lng) * pi()/180 / 2), 2) ))")));

      $rectLong1 = $long - $dist / abs(cos(deg2rad($lat)) * 69);
      $rectLong2 = $long + $dist / abs(cos(deg2rad($lat)) * 69);
      $rectLat1 = $lat - ($dist / 69);
      $rectLat2 = $lat + ($dist / 69);

      $select->where($tableLocationName . ".lng between $rectLong1 AND $rectLong2  and " . $tableLocationName . ".lat between $rectLat1 AND $rectLat2");

      $select->order('distance');
      $select->having("distance < $dist");
    }
    
    
    
    if (isset($params['rating']) && !empty($params['rating'])) {
      if ($params['rating'] == 5)
        $select->where($tableName . '.rating <= ?', 5)->order($tableName . '.rating DESC');
      if ($params['rating'] == 1)
        $select->where($tableName . '.rating <= ?', 5)->order($tableName . '.rating ASC');
    }
    if (isset($params['location']) && !empty($params['location']) && !Engine_Api::_()->getApi('settings', 'core')->getSetting('enableglocation', 1)) {
      $select->where($tableName . '.location LIKE ?', '%' . $params['location'] . '%');
    }
    if (!empty($params['category_id'])) {
      $select->join($serviceTableName, $serviceTableName . '.user_id = ' . $tableName . '.user_id', null)
      ->where($serviceTableName . '.category_id =?', $params['category_id']);
    }
    if (!empty($params['subcat_id'])) {
      $select->join($serviceTableName, $serviceTableName . '.user_id = ' . $tableName . '.user_id', null)
      ->where($serviceTableName . '.subcat_id =?', $params['subcat_id']);
    }
    if (!empty($params['subsubcat_id'])) {
      $select->join($serviceTableName, $serviceTableName . '.user_id = ' . $tableName . '.user_id', null)
      ->where($serviceTableName . '.subsubcat_id =?', $params['subsubcat_id']);
    }
    if(isset($params['isProfessionalSearch'])){
      $select->where($tableName . '.available = ?', 1);
    }
    if (!empty($params['availability'])) {
      $time = strtotime($params['availability']);
      $newformat = date('l',$time);
      $dayNum = (array_search($newformat, array_flip(array("Monday" => 1, "Tuesday" => 2, "Wednesday" => 3, "Thursday" => 4, "Friday" => 5, "Saturday" => 6, "Sunday" => 7))));
      $select->join($settingsTableName, $settingsTableName . '.user_id = ' . $tableName . '.user_id', null)
      ->where($settingsTableName . '.day =?', $dayNum)
      ->where($settingsTableName . '.offday =?', 0);
    }
    $select->where($tableName . '.is_deleted =?', 0);

    return $select;
  }

  public function getProfessionalAvailable($viewerId = 0) {
    $select = $this->select();
    $select->from($this->info('name'), array('professional_id','is_deleted'));
    $select->where('user_id =?', $viewerId);
    return $this->fetchRow($select);
  }

  public function getAllProfessionals($params = array()) {
  
    $tableLocationName = Engine_Api::_()->getDbTable('locations', 'sesbasic')->info('name');
    
    $select = $this->select();
    if (!empty($params['name'])) {
      $select->where("name LIKE '%" . $params['name'] . "%'");
    }
    if (!empty($params['designation'])) {
      $select->where("designation LIKE '%" . $params['designation'] . "%'");
    }
    if (!empty($params['location'])) {
      $select->where("location LIKE '%" . $params['location'] . "%'");
    }
    if (!empty($params['timezone'])) {
      $select->where("timezone LIKE '%" . $params['timezone'] . "%'");
    }
    $bookingtable = $this->info("name");
    
    //Location Based search
    if(Engine_Api::_()->getDbtable('modules', 'core')->isModuleEnabled('seslocation') && Engine_Api::_()->getApi('settings', 'core')->getSetting('seslocationenable', 1) && empty($params['lat']) && !empty($_COOKIE['sesbasic_location_data'])) {
      $params['location'] = $_COOKIE['sesbasic_location_data'];
      $params['lat'] = $_COOKIE['sesbasic_location_lat'];
      $params['lng'] = $_COOKIE['sesbasic_location_lng'];
      $params['miles'] = Engine_Api::_()->getApi('settings', 'core')->getSetting('seslocation.searchmiles', 50);
    }
    
    if (isset($params['lat']) && isset($params['miles']) && $params['miles'] != 0 && isset($params['lng']) && $params['lat'] != '' && $params['lng'] != '' && ((isset($params['location']) && $params['location'] != ''))) {
      $origLat = $lat = $params['lat'];
      $origLon = $long = $params['lng'];
      if (Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.search.type', 1) == 1) {
        $searchType = 3956;
      } else
        $searchType = 6371;
      //This is the maximum distance (in miles) away from $origLat, $origLon in which to search
      $dist = $params['miles'];

      $select->joinLeft($tableLocationName, $tableLocationName . '.resource_id = ' . $bookingtable . '.professional_id AND ' . $tableLocationName . '.resource_type = "professional" ', array('lat', 'lng', 'distance' => new Zend_Db_Expr($searchType . " * 2 * ASIN(SQRT( POWER(SIN(($lat - lat) *  pi()/180 / 2), 2) +COS($lat * pi()/180) * COS(lat * pi()/180) * POWER(SIN(($long - lng) * pi()/180 / 2), 2) ))")));

      $rectLong1 = $long - $dist / abs(cos(deg2rad($lat)) * 69);
      $rectLong2 = $long + $dist / abs(cos(deg2rad($lat)) * 69);
      $rectLat1 = $lat - ($dist / 69);
      $rectLat2 = $lat + ($dist / 69);

      $select->where($tableLocationName . ".lng between $rectLong1 AND $rectLong2  and " . $tableLocationName . ".lat between $rectLat1 AND $rectLat2");


      $select->order('distance');
      $select->having("distance < $dist");
    }
    $select->order('professional_id DESC');
    $paginator = Zend_Paginator::factory($select);
    $paginator->setCurrentPageNumber($params['page']);
    $paginator->setItemCountPerPage($params['limit']);
    return $paginator;
  }

}
