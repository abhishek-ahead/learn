<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    Activity
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: Bootstrap.php 9747 2012-07-26 02:08:08Z john $
 * @author     John
 */

/**
 * @category   Application_Core
 * @package    Activity
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 */
class Activity_Bootstrap extends Engine_Application_Bootstrap_Abstract
{

  public function __construct($application)
  {

    parent::__construct($application);

    $this->initViewHelperPath();

    $front = Zend_Controller_Front::getInstance();
    $front->registerPlugin(new Activity_Plugin_Core);

    //Emotions Load
    $view = Zend_Registry::isRegistered('Zend_View') ? Zend_Registry::get('Zend_View') : null;
    $script = "var chatEmotions = " . Engine_Api::_()->activity()->getEmoticons('', '', true) . ";";
    $view->headScript()->appendScript($script);
  }
}
