<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Buysell.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Activity_Model_Buysell extends Core_Model_Item_Abstract {

  protected $_searchTriggers = false;
  public function getMediaType(){
    return 'post';
  }
  
  public function getHref(){
    $action = Engine_Api::_()->getItem('activity_action',$this->action_id);
    if(!$action)
      return 'javascript:;';
    return  $action->getHref();
  }
}
