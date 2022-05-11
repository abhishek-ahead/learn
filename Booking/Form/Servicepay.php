<?php


class Booking_Form_Servicepay extends Engine_Form {

  public function init() {
    $professional_id = Zend_Controller_Front::getInstance()->getRequest()->getParam('professional_id', null);
    $servicetotal = Zend_Controller_Front::getInstance()->getRequest()->getParam('servicetotal', null);
    $gateway_id = Zend_Controller_Front::getInstance()->getRequest()->getParam('gateway_id', null);
    $paymentGateways = Engine_Api::_()->booking()->checkPaymentGatewayEnable();
    $this->setTitle('Paying Amount')
          ->setDescription('Verify Total Amount.')
          ->setAttrib('name', 'booking_servicepay')
          ->setAction(Zend_Controller_Front::getInstance()->getRouter()->assemble(array()))
          ->setMethod('POST');

    $this->addElement('Dummy', 'price', array(
      'content' => '<label>Please verify total service paying amount.</label><br>'.
      "Total service Amount: ".Engine_Api::_()->booking()->getCurrencyPrice($servicetotal).
      '<input type="hidden" name="price" value="'.$servicetotal.'" />'
    ));

    if(!$paymentGateways['noPaymentGatewayEnableByAdmin']) {
        $this->addElement('Radio', 'payment_type', array(
            'label' => 'Pay with',
            'description' => "Select Gateway",
            'multiOptions' =>$paymentGateways['methods'],
        ));
    }
    $this->addElement('Button', 'submit', array(
      'label' => 'Pay',
      'type' => 'submit',
      'onclick' => 'this.form.submit();',
    ));
  }
}
