<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Services.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */

class Booking_Model_DbTable_Services extends Engine_Db_Table
{

  protected $_rowClass = "Booking_Model_Service";

  function getServices($params = array())
  {
    $select = $this->select();
    if (!empty($params['user_id']))
      $select->where('user_id =?', $params['user_id']);

    if (empty($params['manage']))
      $select->where('active =?', 1);

    if (!empty($params['service_id'])) {
      $select->where('service_id =?', $params['service_id']);
      return $this->fetchRow($select);
    }
    $select->order('service_id DESC');
    return $this->fetchAll($select);
  }

  public function getMainServices($params = array())
  {
    $bookingServicesTableName = $this->info('name');
    $professionalTableName = Engine_Api::_()->getItemTable('professional')->info('name');
    $select = $this->select()
      ->from($bookingServicesTableName, array("*"))
      ->setIntegrityCheck(false)
      ->where($bookingServicesTableName . '.active =?', 1)
      ->where($professionalTableName . '.active =?', 1)
      ->where($professionalTableName . '.is_deleted =?', 0)
      ->joinLeft($professionalTableName, "$bookingServicesTableName.user_id = $professionalTableName.user_id", 'name as Professional_name')
      ->order('service_id DESC');
    if (!empty($params['servicename'])) {
      $select->where($bookingServicesTableName . '.name LIKE ?', '%' . $params['servicename'] . '%');
    }
    if (!empty($params['price'])) {
      $select->where($bookingServicesTableName . '.price =?', $params['price']);
    }
    if (!empty($params['category_id'])) {
      $select->where($bookingServicesTableName . '.category_id =?', $params['category_id']);
    }
    if (!empty($params['subcat_id'])) {
      $select->where($bookingServicesTableName . '.subcat_id =?', $params['subcat_id']);
    }
    if (!empty($params['subsubcat_id'])) {
      $select->where($bookingServicesTableName . '.subsubcat_id =?', $params['subsubcat_id']);
    }
    if (!empty($params['professional'])) {
      $select->where($professionalTableName . '.name LIKE ?', '%' . $params['professional'] . '%');
    }
    if (!empty($params['isService'])) {
      // $select = $this->select();
    }
    if (!empty($params['limit'])) {
      $select->limit($params['limit']);
    }
    if (!empty($params['viewerId'])) {
      $select = $this->select()->where("user_id =?",$params['viewerId']);
    }
    $select->order('service_id DESC');
    if (!isset($params['widgetname']) && $params['widgetname'] != 'browseservices')
      return $this->fetchAll($select);
    elseif (isset($params['widgetname']) && $params['widgetname'] == 'browseservices')
      return $select;
  }

  public function servicePaginator($params = array())
  {
    return Zend_Paginator::factory($this->getMainServices($params));
  }

  public function getServicePaginator($params = array())
  {
    return Zend_Paginator::factory($this->getServiceSelect($params));
  }
  public function getServiceSelect($params = array())
  {
    $select = $this->select();
    return $select;
  }

  public  function getSelectiveService($param = array(), $professionalId)
  {
    $select = $this->select();
    $select->where("service_id IN (?)", $param);
    $select->where("user_id = ?", $professionalId);
    return $this->fetchAll($select);
  }

  public function servicesAvailabel($viewerId)
  {
    $action = false;
    $select = $this->select()
      ->from($this->info('name'), array('*'))
      ->where('active = ?', 1)
      ->where('user_id = ?', $viewerId);
    $data = $this->fetchAll($select);
    foreach ($data as $key => $value) {
      $action = true;
    }
    return $action;
  }

  public function getAllProfessionalServices()
  {
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $table = Engine_Api::_()->getItemTable('booking_service');
    $tableName = $table->info('name');

    $select = $table
      ->select()
      ->from($tableName)
      ->where('user_id = ?', $viewerId);
    return $select;
  }

  public function coutServices()
  {
    $viewer = Engine_Api::_()->user()->getViewer();
    $select = $this->select()
      ->from($this->info('name'), array('totalservices' => new Zend_Db_Expr('COUNT(*)')))
      ->where('user_id = ?', $viewer->getIdentity())
      ->query()
      ->fetchColumn();
    return $select;
  }

  /**
   * Gets a proxy object for the tags handler
   *
   * @return Engine_ProxyObject
   * */
  public function tags()
  {
    return new Engine_ProxyObject($this, Engine_Api::_()->getDbtable('tags', 'core'));
  }

  /**
   * Gets a proxy object for the comment handler
   *
   * @return Engine_ProxyObject
   * */
  public function comments()
  {
    return new Engine_ProxyObject($this, Engine_Api::_()->getDbtable('comments', 'core'));
  }

  /**
   * Gets a proxy object for the like handler
   *
   * @return Engine_ProxyObject
   * */
  public function likes()
  {
    return new Engine_ProxyObject($this, Engine_Api::_()->getDbtable('likes', 'core'));
  }

  /**
   * Get a generic media type. Values:
   * entry
   *
   * @return string
   */
  public function getMediaType()
  {
    return "entry";
  }
}
