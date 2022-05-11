<?php
class Booking_Form_Payment_Stripe extends Sesadvpmnt_Form_Admin_Settings_Stripe
{
  public function init()
  {
    parent::init();

    $this->setAttrib('id', 'booking_ajax_form_submit');

    $this->addElement('Hidden', 'gateway_type', array(
      'value' => 'stripe'
    ));
    
  }
}
