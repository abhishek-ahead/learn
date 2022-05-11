<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Professional.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */

class Booking_Model_Professional extends Core_Model_Item_Abstract {

    protected $_searchTriggers = false;
    protected $_type = 'professional';
    
    public function getTitle() {
        return $this->name;
    }
            
    function getHref($params = array()){
      $params = array_merge(array(
          'route' => 'professional_profile',
          'reset' => true,
          'professional_id' => $this->professional_id,
          'name'=>  str_replace(" ","", $this->name)
              ), $params);
      $route = $params['route'];
      $reset = $params['reset'];
      unset($params['route']);
      unset($params['reset']);
      $route = Zend_Controller_Front::getInstance()->getRouter()->assemble($params, $route, $reset);
      return $route;
    }
    
  	public function setPhoto($photo) {
      if ($photo instanceof Zend_Form_Element_File) {
      $file = $photo->getFileName();
      $fileName = $file;
    } else if ($photo instanceof Storage_Model_File) {
      $file = $photo->temporary();
      $fileName = $photo->name;
    } else if ($photo instanceof Core_Model_Item_Abstract && !empty($photo->file_id)) {
      $tmpRow = Engine_Api::_()->getItem('storage_file', $photo->file_id);
      $file = $tmpRow->temporary();
      $fileName = $tmpRow->name;
    } else if (is_array($photo) && !empty($photo['tmp_name'])) {
      $file = $photo['tmp_name'];
      $fileName = $photo['name'];
    } else if (is_string($photo) && file_exists($photo)) {
      $file = $photo;
      $fileName = $photo;
    } else {
      throw new Exception('invalid argument passed to setPhoto');
    }
    if (!$fileName) {
      $fileName = basename($file);
    }
    
    
    $name = basename($fileName);
    $path = APPLICATION_PATH . DIRECTORY_SEPARATOR . 'temporary';
    $params = array(
      'parent_type' => $this->getType(),
        'parent_id' => $this->getIdentity(),
        //'user_id' => Engine_Api::_()->user()->getViewer()->getIdentity(),
       // 'name' => $fileName,
    );

    // Save
    $storage = Engine_Api::_()->storage();

    // Resize image (main)
    $image = Engine_Image::factory();
    $image->open($file)
      ->resize(720, 720)
      ->write($path . '/m_' . $name)
      ->destroy();

    // Resize image (profile)
    $image = Engine_Image::factory();
    $image->open($file)
      ->resize(200, 400)
      ->write($path . '/p_' . $name)
      ->destroy();

    // Resize image (normal)
    $image = Engine_Image::factory();
    $image->open($file)
      ->resize(140, 160)
      ->write($path . '/in_' . $name)
      ->destroy();

    // Resize image (icon)
    $image = Engine_Image::factory();
    $image->open($file);

    $size = min($image->height, $image->width);
    $x = ($image->width - $size) / 2;
    $y = ($image->height - $size) / 2;

    $image->resample($x, $y, $size, $size, 48, 48)
      ->write($path . '/is_' . $name)
      ->destroy();

    // Store
    $iMain = $storage->create($path . '/m_' . $name, $params);
    $iProfile = $storage->create($path . '/p_' . $name, $params);
    $iIconNormal = $storage->create($path . '/in_' . $name, $params);
    $iSquare = $storage->create($path . '/is_' . $name, $params);
    

    $iMain->bridge($iProfile, 'thumb.profile');
    $iMain->bridge($iIconNormal, 'thumb.normal');
    $iMain->bridge($iSquare, 'thumb.icon');

    // Remove temp files
    @unlink($path . '/p_' . $name);
    @unlink($path . '/m_' . $name);
    @unlink($path . '/in_' . $name);
    @unlink($path . '/is_' . $name);

    return $iMain->file_id;
  }
  
  public function getPhotoUrl($type = null)
  {
    if( $this->file_id ) {
      return parent::getPhotoUrl($type);
    }
    //return $this->getOwner()->getPhotoUrl($type);
  }
  
//   public function getPhotoUrl($type = NULL) {
//    $photo_id = $this->$type;
//    if ($photo_id) {
//      $file = Engine_Api::_()->getItemTable('storage_file')->getFile($photo_id, '');
//      return $file->map();
//    }
//  }
  
  protected function _delete() {
    if ($this->_disableHooks)
      return;
      
      $db = Engine_Db_Table::getDefaultAdapter();
      $viewer = Engine_Api::_()->user()->getViewer();
      
      $servicetable = Engine_Api::_()->getDbTable('services', 'booking');
      $allservicesSelect = $servicetable->getAllProfessionalServices();
      $allservices = $servicetable->fetchAll($allservicesSelect);
      foreach ($allservices as $services) {
        $services->delete();
      }
      
      $appointmenttable = Engine_Api::_()->getDbTable('appointments', 'booking');
      $allappointmentsSelect = $appointmenttable->getAllProfessionalAppointments();
      $allappointments = $appointmenttable->fetchAll($allappointmentsSelect);
      foreach ($allappointments as $appointments) {
        $appointments->delete();
      }
      
      $db->query("DELETE FROM engine4_booking_appointments WHERE user_id = " . $viewer->getIdentity());
      
      $db->query("DELETE FROM engine4_booking_professionalratings WHERE user_id = " . $viewer->getIdentity());
      
      $db->query("DELETE FROM engine4_booking_likes WHERE user_id = " . $viewer->getIdentity() . " OR professional_id = ". $this->getIdentity());
      
      $db->query("DELETE FROM engine4_booking_follows WHERE user_id = " . $viewer->getIdentity(). " OR professional_id = ". $this->getIdentity());
      
      $db->query("DELETE FROM engine4_booking_favourites WHERE user_id = " . $viewer->getIdentity() . " OR professional_id = ". $this->getIdentity());
      
      $db->query("DELETE FROM engine4_booking_reviews WHERE user_id = " . $viewer->getIdentity());
      
      $db->query("DELETE FROM engine4_booking_servicefavourites WHERE user_id = " . $viewer->getIdentity());
      
      $db->query("DELETE FROM engine4_booking_servicelikes WHERE user_id = " . $viewer->getIdentity());
      
      $db->query("DELETE FROM engine4_booking_settingdurations WHERE user_id = " . $viewer->getIdentity());
      
      $db->query("DELETE FROM engine4_booking_settings WHERE user_id = " . $viewer->getIdentity());  
      
      $db->query("DELETE FROM engine4_booking_settingservices WHERE user_id = " . $viewer->getIdentity());
      
    parent::_delete();
  }
    
  // Interfaces

  /**
   * Gets a proxy object for the comment handler
   *
   * @return Engine_ProxyObject
   **/
  public function comments() {
    return new Engine_ProxyObject($this, Engine_Api::_()->getDbtable('comments', 'core'));
  }


  /**
   * Gets a proxy object for the like handler
   *
   * @return Engine_ProxyObject
   **/
  public function likes() {
    return new Engine_ProxyObject($this, Engine_Api::_()->getDbtable('likes', 'core'));
  }

  /**
   * Gets a proxy object for the tags handler
   *
   * @return Engine_ProxyObject
   **/
  public function tags() {
    return new Engine_ProxyObject($this, Engine_Api::_()->getDbtable('tags', 'core'));
  }
  
}
