<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Level.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Admin_Settings_Level extends Authorization_Form_Admin_Level_Abstract
{

  public function init()
  {

    parent::init();

    $this->setTitle('Member Level Settings')->setDescription('These settings are applied on a per member level basis. Start by selecting the member level you want to modify, then adjust the settings for that level below.');

    // Element: professional view
    $this->addElement('Radio', 'profview', array(
      'label' => 'Allow Viewing of professional?',
      'description' => 'Do you want to allow members to view professional? If set to no, some other settings on this page may not apply.',
      'multiOptions' => array(
        1 => 'Yes, allow members to view professional.',
        0 => 'No, do not allow professional to be viewed.',
      ),
      'value' => 1,
    ));

    // Element: service view
    $this->addElement('Radio', 'servview', array(
      'label' => 'Allow Viewing of Services?',
      'description' => 'Do you want to allow members to view services? If set to no, some other settings on this page may not apply.',
      'multiOptions' => array(
        1 => 'Yes, allow members to view services.',
        0 => 'No, do not allow services to be viewed.',
      ),
      'value' => 1,
    ));

    if (!$this->isPublic()) {

      // Element: view
      $this->addElement('Radio', 'professional', array(
        'label' => 'Allow Become Professional?',
        'description' => 'Do you want to let users become professional? If set to no, some other settings on this page may not apply.',
        'multiOptions' => array(
          1 => 'Yes, allow members to become professional.',
          0 => 'No, do not allow members to become professional.',
        ),
        'value' => 1,
      ));

      $this->addElement('Radio', 'servedit', array(
        'label' => 'Allow Editing of Services?',
        'description' => 'Do you want to let members edit Services?',
        'multiOptions' => array(
          1 => "Yes, allow  members to edit their own services.",
          0 => "No, do not allow services to be edited.",
        ),
        'value' => 1,
      ));
      
      // Element: delete
      $this->addElement('Radio', 'servdelete', array(
        'label' => 'Allow Deletion of Services?',
        'description' => 'Do you want to let members delete Services? If set to no, some other settings on this page may not apply.',
        'multiOptions' => array(
          1 => 'Yes, allow members to delete their own services.',
          0 => 'No, do not allow members to delete their services.',
        ),
        'value' => 1,
      ));
      
      $this->addElement('Radio', 'comment', array(
          'label' => 'Allow Commenting on Services?',
          'description' => 'Do you want to let members of this level comment on Services?',
          'multiOptions' => array(
              1 => 'Yes, allow members to comment on Services.',
              0 => 'No, do not allow members to comment on Services.',
          ),
          'value' => 1,
      ));

      $this->addElement('Radio', 'profapprove', array(
        'description' => 'Do you want professional by members of this level to be auto-approved?',
        'label' => ' Auto Approve Professional',
        'multiOptions' => array(
          1 => 'Yes, auto-approve Professional.',
          0 => 'No, do not auto-approve Professional.'
        ),
        'value' => 1,
      ));

      $this->addElement('Radio', 'servapprove', array(
        'description' => 'Do you want service created by members of this level to be auto-approved?',
        'label' => ' Auto Approve Service',
        'multiOptions' => array(
          1 => 'Yes, auto-approve Service.',
          0 => 'No, do not auto-approve Service.'
        ),
        'value' => 1,
      ));

      // Element: professional view
      $this->addElement('Radio', 'bookservice', array(
        'label' => 'Allow member To Book Service?',
        'description' => 'Do you want to allow members to Book Service? If set to no, some other settings on this page may not apply.',
        'multiOptions' => array(
          1 => 'Yes, allow members to book service',
          0 => 'No, do not allow to be book service.',
        ),
        'value' => 1,
      ));

      // //Online and offline payment.
      // $this->addElement('Radio', 'paymode', array(
      //   'label' => 'Allow online payment?',
      //   'description' => 'Do you want to allow members to pay online for booking services? If set to no, some other settings on this page may not apply.',
      //   'multiOptions' => array(
      //     1 => 'Yes, allow members to pay online.',
      //     0 => 'No, do not allow to be pay online.',
      //   ),
      //   'value' => 1,
      // ));

      $this->addElement('Text', 'servicemax', array(
        'label' => 'Maximum Allowed services',
        'description' => 'Enter the maximum number of services a professional can create. The field must contain an integer, use zero for unlimited.',
        'validators' => array(
          array('Int', true),
          new Engine_Validate_AtLeast(0),
        ),
        'value' => 0
      ));

      //commission
      $this->addElement('Select', 'admin_commission', array(
        'label' => 'Unit for Commission',
        'description' => 'Choose the unit for admin commission which you will get on the Services.',
        'multiOptions' => array(
          1 => 'Percentage',
          2 => 'Fixed'
        ),
        'allowEmpty' => false,
        'required' => true,
        'value' => 1,
      ));

      $this->addElement('Text', "commission_value", array(
        'label' => 'Commission Value',
        'description' => "Enter the value for commission according to the unit chosen in above setting. [If you have chosen Percentage, then value should be in range 1 to 100.]",
        'allowEmpty' => true,
        'required' => false,
        'value' => 1,
      ));

      $this->addElement('Text', "threshold_amount", array(
        'label' => 'Threshold Amount for Releasing Payment',
        'description' => "Enter the threshold amount which will be required before making request for releasing payment from admins.",
        'allowEmpty' => false,
        'required' => true,
        'value' => 100,
      ));
    }
  }
}
