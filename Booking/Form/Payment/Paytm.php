<?php
class Booking_Form_Payment_Paytm extends Epaytm_Form_Admin_Settings_Paytm
{
  public function init()
  {
    parent::init();

    $this->setAttrib('id', 'booking_ajax_form_submit');

    $this->addElement('Hidden', 'gateway_type', array(
      'value' => 'paytm'
    ));
  }
}