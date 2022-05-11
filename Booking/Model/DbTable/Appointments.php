<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Appointments.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Model_DbTable_Appointments extends Engine_Db_Table {

  protected $_rowClass = "Booking_Model_Appointment";

   public function getAppointmentPaginator($params = array())
  {
    return Zend_Paginator::factory($this->getAppointmentSelect($params));
  }

  public function getAppointmentSelect($params = array())
  {
    // print_r($params);die;
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $currentTime = date('Y-m-d H:i:s');
    $appointmentTableName = $this->info('name');
    $select = $this->select()->setIntegrityCheck(false);
    $select->where($appointmentTableName . '.action =?', $params['type']);
    //echo $select;die;
    if($params['tab']== "taken" && $params['isProfessionalInAppointments'])
      $select->where($appointmentTableName . '.given =?', (isset($params['isProfessional']) ? $params['isProfessionalInAppointments'] : $viewerId) );

    if (isset($params['fetchAll'])) {
      return $this->fetchAll($select);
    } else {
      return $select;

    }
  }

  public function getAppointments($param = array()) {
    $params['id'] = Engine_Api::_()->user()->getViewer()->getIdentity();
    $select = $this->select()
      ->from($this->info('name'), array('*'))
      ->where("professional_id ='" . $params['id'] . "' OR user_id='" . $params['id'] . "'")
      ->where("action =?", $param['type'])
      ->order("appointment_id desc");
    $data = $this->fetchAll($select);
    return $data;
  }

  public function isProfessionalInAppointments() {
    $params['id'] = Engine_Api::_()->user()->getViewer()->getIdentity();
    $select = $this->select();
    $select->from($this->info('name'), array('professional_id'));
    $select->where('professional_id =?', $params['id']);
    return $this->fetchRow($select);
  }

  public function isDateInAppointments($params = array()) {
    $select = $this->select();
    $select->from($this->info('name'), array('date', 'professionaltime', 'serviceendtime'));
    $select->where('professional_id =?', $params['professional_id']);
    if (!empty($params['date']))
      $select->where('date =?', $params['date']);
    $select->where('action =?', '0');
    return $this->fetchAll($select);
  }

  public function isServiceInAppointments($params = array()) {
    $select = $this->select();
    $select->from($this->info('name'), array('service_id'));
    $select->where('professional_id =?', $params['professional_id']);
    $select->where('service_id =?', $params['service_id']);
    $select->where('action =?', '0');
    return $this->fetchRow($select);
  }

  public function getAllAppointmentsPaginator() {
    return Zend_Paginator::factory($this->select());
  }

  public function getAllProfessionalAppointments() {
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $select = $this->select();
    $select->from($this->info('name'));
    $select->where('professional_id =?', $viewerId);
    return $select;
  }

  //booking payment
  public function getAppointmentDetails($params = array())
  {
    return $this->fetchAll($this->select()
      ->where('order_id = ? ', $params['order_id'])
      ->where('professional_id = ? ', $params['professional_id'])
      ->where('user_id =?', $params['user_id'])
    );
  }

  //update appointment state booking->plugin->gateway->paypal:204
  public function updateTicketOrderState($params = array()){
		if(empty($params['state']) || empty($params['order_id']))
      return;
		$this->update(
        array('state' => $params['state']),
				array('order_id =?' => $params['order_id'])
     );
		 return true;
  }

  public function getAppointmentId($params = array())
  {
    return $this->select()
      ->from($this->info('name'), array('ticket_id'))
      ->where('order_id =?', $params['order_id'])
      ->query()
      ->fetchColumn();
  }

  //Order - successAction.
  public function getAllOrderServices($orderId = 0)
  {
    $select = $this->select()->from($this->info('name'),array('service_id'))->where('state =?', 'complete')->where('order_id =?',$orderId);
    return $this->fetchAll($select);
  }
}
