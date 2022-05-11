<?php
class Booking_Form_Payment_PayPal extends Engine_Form
{
  public function init()
  {
    parent::init();
    $this->setTitle('Payment Gateway Details');
    $description = $this->getTranslator()->translate('Below, enter your PayPal Account details which will be used for receiving the payments for your service ordered on this website.');
    $this->setDescription($description)->setAttrib('id', 'booking_ajax_form_submit');
    // Decorators
    $this->loadDefaultDecorators();
    $this->getDecorator('Description')->setOption('escape', false);
    // Elements
    $this->addElement('Text', 'username', array(
      'label' => 'API Username',
      'filters' => array(
       new Zend_Filter_StringTrim(),
      ),
    ));
    $this->addElement('Text', 'password', array(
      'label' => 'API Password',
      'filters' => array(
       new Zend_Filter_StringTrim(),
      ),
    ));
    $this->addElement('Text', 'signature', array(
      'label' => 'API Signature',
      'filters' => array(
       new Zend_Filter_StringTrim(),
      ),
    ));
    $this->addElement('Hidden', 'gateway_type', array(
      'value' => "paypal"
    ));
		 // Element: enabled
    $this->addElement('Radio', 'enabled', array(
      'label' => 'Enabled?',
      'multiOptions' => array(
        '1' => 'Yes',
        '0' => 'No',
      ),
      'order' => 10000,
    ));
		// Element: execute
    $this->addElement('Button', 'execute', array(
      'label' => 'Save Changes',
      'type' => 'submit',
      'order' => 10001,
      'ignore' => true,
    ));
  }
}