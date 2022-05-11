<?php

class Booking_Model_DbTable_Remainingpayments extends Engine_Db_Table {

  protected $_name = 'booking_remainingpayments';

  public function getProfessionalRemainingAmount($params = array()) {
  
    $tabeleName = $this->info('name');
    $select = $this->select()->from($tabeleName);
    if(isset($params['professional_id']))
      $select->where('professional_id =?',$params['professional_id']);	 
    return $this->FetchRow($select);
	}
}
