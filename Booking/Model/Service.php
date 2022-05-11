<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Service.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */

class Booking_Model_Service extends Core_Model_Item_Abstract
{

  protected $_searchTriggers = false;

  public function getTitle()
  {
    return $this->name;
  }

  public function getRichContent($view = false, $params = array())
  {
    $serviceEmbedded = '';
    if (!$view) {
      $desc = strip_tags($this->description);
      $desc = "<div class='sesevent_feed_desc'>" . (Engine_String::strlen($desc) > 255 ? Engine_String::substr($desc, 0, 255) . '...' : $desc) . "</div>";
      $view = Zend_Registry::get('Zend_View');
      $view->service = $this;
      $serviceEmbedded = $view->render('application/modules/Booking/views/scripts/_feedService.tpl');
    }
    return $serviceEmbedded;
  }

  public function getServiceProfessionalName(){
    $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($this->user_id);
    return $professional->name;
  }

  function getHref($params = array())
  {
    $params = array_merge(array(
      'route' => 'service_profile',
      'reset' => true,
      'service_id' => $this->service_id,
      //'name' => $this->name
    ), $params);
    $route = $params['route'];
    $reset = $params['reset'];
    unset($params['route']);
    unset($params['reset']);
    $route = Zend_Controller_Front::getInstance()->getRouter()->assemble($params, $route, $reset);
    return $route;
  }
  public function setPhoto($photo)
  {
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
      ->resize(400, 400)
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
    if ($this->file_id) {
      return parent::getPhotoUrl($type);
    }
    //return $this->getOwner()->getPhotoUrl($type);
  }

  protected function _delete()
  {
    if ($this->_disableHooks)
      return;
    $servicefavouritetable = Engine_Api::_()->getDbTable('servicefavourites', 'booking');
    $allservicefavouritesSelect = $servicefavouritetable->getAllServicefavourites($this->getIdentity());
    $allservicefavourites = $servicefavouritetable->fetchAll($allservicefavouritesSelect);
    foreach ($allservicefavourites as $servicefavourites) {
      $servicefavourites->delete();
    }

    $serviceliketable = Engine_Api::_()->getDbTable('servicelikes', 'booking');
    $allservicelikesSelect = $serviceliketable->getAllServicelikes($this->getIdentity());
    $allservicelikes = $serviceliketable->fetchAll($allservicelikesSelect);
    foreach ($allservicelikes as $servicelikes) {
      $servicelikes->delete();
    }
    parent::_delete();
  }

  // Interfaces

  /**
   * Gets a proxy object for the comment handler
   *
   * @return Engine_ProxyObject
   **/
  public function comments()
  {
    return new Engine_ProxyObject($this, Engine_Api::_()->getDbtable('comments', 'core'));
  }


  /**
   * Gets a proxy object for the like handler
   *
   * @return Engine_ProxyObject
   **/
  public function likes()
  {
    return new Engine_ProxyObject($this, Engine_Api::_()->getDbtable('likes', 'core'));
  }

  /**
   * Gets a proxy object for the tags handler
   *
   * @return Engine_ProxyObject
   **/
  public function tags()
  {
    return new Engine_ProxyObject($this, Engine_Api::_()->getDbtable('tags', 'core'));
  }
}
