<?php
class Booking_Plugin_Core extends Zend_Controller_Plugin_Abstract  {

function onUserDeleteBefore($event){
    $payload = $event->getPayload();
    if ($payload instanceof User_Model_User) {
      $user_id = $payload->getIdentity();
      $table = Engine_Api::_()->getDbTable('professionals','booking');
      $select = $table->select()->where('user_id =?',$user_id);
      $items = $table->fetchAll($select);
      foreach($items as $item){
        $item->delete();  
      }
    }
  }
}