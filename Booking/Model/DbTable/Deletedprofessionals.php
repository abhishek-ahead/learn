<?php

class Booking_Model_DbTable_Deletedprofessionals extends Engine_Db_Table
{
  protected $_rowClass = 'Booking_Model_Deletedprofessional';

  public function getUnactiveProfessionals($user_id) {
  
    return $this->select()
      ->from($this,array('user_id'))
      ->where('user_id = ?', $user_id)
      ->query()
      ->fetchColumn();
  }

}