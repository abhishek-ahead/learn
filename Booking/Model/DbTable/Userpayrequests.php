<?php

class Booking_Model_DbTable_Userpayrequests extends Engine_Db_Table {

  protected $_name = 'booking_userpayrequests';
  protected $_rowClass = "Booking_Model_Userpayrequest";

  public function getPaymentRequests($params = array()) {
    $tabeleName = $this->info('name');
    $select = $this->select()->from($tabeleName);
    if (isset($params['professional_id']))
      $select->where('professional_id =?', $params['professional_id']);
		if(isset($params['isPending']) && $params['isPending']){
			$select->where('state =?', 'pending');
		}else{
    if (isset($params['state']) && $params['state'] == 'complete')
      $select->where('state =?', $params['state']);
		}
		$select->order('userpayrequest_id DESC');
    $select->where('is_delete	= ?', '0');
    return $this->fetchAll($select);
  }
}
