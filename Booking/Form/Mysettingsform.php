<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Mysettingsform.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Mysettingsform extends Engine_Form {

  public function init() {
    $this->setTitle('My Settings')->setDescription('Settings');

    $this->addElement('Text', 'settings_name', array(
        'label' => 'Name'
    ));

    $this->addElement('Text', 'settings_location', array(
        'label' => 'Location'
    ));

    $this->addElement('File', 'settings_photo', array(
        'label' => 'Photo',
    ));
    $this->settings_photo->addValidator('Extension', false, 'jpg,png,gif,jpeg');

    $this->addElement('Button', 'reset', array(
        'label' => 'Cancel',
        'type' => 'reset',
        'ignore' => true,
    ));

    $this->addElement('Button', 'submit', array(
        'label' => 'Save',
        'type' => 'submit',
        'ignore' => true,
        'decorators' => array(
            'ViewHelper',
        ),
    ));
  }

}

?>