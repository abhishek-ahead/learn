<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Actors.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Activity_Model_Helper_Actors extends Activity_Model_Helper_Abstract {

  public function direct($subject, $object = false, $separator = ' &rarr; ') {
  
    $pageSubject = Engine_Api::_()->core()->hasSubject() ? Engine_Api::_()->core()->getSubject() : null;

    $subject = $this->_getItem($subject, false);
    $object = $this->_getItem($object, false);
    
    // Check to make sure we have an item
    if( !($subject instanceof Core_Model_Item_Abstract) || !($object instanceof Core_Model_Item_Abstract) )
    {
      return false;
    }
    
    $attribs = array('class' => 'feed_item_username core_tooltip');
    if($subject->getGuid() == $object->getGuid()){
      return $subject->toString(array_merge($attribs,array('data-src'=>$subject->getGuid())));
    }else if( null === $pageSubject ) {
      return $subject->toString(array_merge($attribs,array('data-src'=>$subject->getGuid()))) . $separator . $object->toString(array_merge($attribs,array('data-src'=>$object->getGuid())));
    } else if( $pageSubject->isSelf($subject) ) {
      return $subject->toString(array_merge($attribs,array('data-src'=>$subject->getGuid()))) . $separator . $object->toString(array_merge($attribs,array('data-src'=>$object->getGuid())));
    } else if( $pageSubject->isSelf($object) ) {
      return $subject->toString(array_merge($attribs,array('data-src'=>$subject->getGuid())));
    } else {
      return $subject->toString(array_merge($attribs,array('data-src'=>$subject->getGuid()))) . $separator . $object->toString(array_merge($attribs,array('data-src'=>$object->getGuid())));
    }
  }
}
