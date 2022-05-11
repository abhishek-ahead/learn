<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Add.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Admin_Duration_Add extends Authorization_Form_Admin_Level_Abstract {

  public function init() {
    $this->setTitle('Add Duration');
    $this->setMethod('POST');

    $this->addElement('Text', 'durations', array(
      'label' => 'Minutes / Hours in number',
      'allowEmpty' => false,
      'required' => true,
    ));

    $this->addElement('Select', 'type', array(
      'label' => 'Duration',
      'multiOptions' => array("h" => "Hour", "m" => "Minutes"),
    ));

    $this->addElement('Button', 'button', array(
      'type' => 'submit',
      'label' => 'Add Duration',
      'ignore' => true,
      'decorators' => array('ViewHelper')
    ));

    $this->addElement('Cancel', 'cancel', array(
      'label' => 'Cancel',
      'link' => true,
      'prependText' => ' or ',
      'onclick' => 'javascript:parent.Smoothbox.close()',
      'decorators' => array(
        'ViewHelper',
      ),
    ));
    $this->addDisplayGroup(array('button', 'cancel'), 'buttons');
  }

}
