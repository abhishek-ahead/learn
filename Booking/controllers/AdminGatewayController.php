<?php

class Booking_AdminGatewayController extends Core_Controller_Action_Admin {

  public function indexAction() {
    $this->_redirect('admin/payment/gateway');
  }
}
