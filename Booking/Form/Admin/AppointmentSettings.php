<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: AppointmentSettings.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Admin_AppointmentSettings extends Engine_Form {

  public function init() {
    $this->addElement('Radio', "tabOption", array(
      'label' => 'Show Tab Type?',
      'multiOptions' => array(
        'default' => 'Default',
        'advance' => 'Advanced',
        'filter' => 'Filter',
        'vertical' => 'Vertical',
      ),
      'value' => 'advance',
    ));

    $this->addElement('MultiCheckbox', "search_type", array(
      'label' => "Choose from below the tab that you want to show in this widget.",
      'multiOptions' => array(
        'given' => 'Given Appointments',
        'taken' => 'Taken Appointments',
        'cancelled' => 'Cancelled Appointments',
        'completed' => 'Completed Appointments',
        'reject' => 'Rejected Appointments',
      ),
    ));

    $this->addElement('Text', "limit_data", array(
      'label' => 'count (number of Appointments to show).',
      'value' => 20,
      'validators' => array(
        array('Int', true),
        array('GreaterThan', true, array(0)),
      )
    ));

    $this->addElement('Text', "limit_data", array(
      'label' => 'count (number of Appointments to show).',
      'value' => 20,
      'validators' => array(
        array('Int', true),
        array('GreaterThan', true, array(0)),
      )
    ));

    $this->addElement('Radio', "pagging", array(
      'label' => "Do you want the Professional to be auto-loaded when users scroll down the page?",
      'multiOptions' => array(
        'auto_load' => 'Yes, Auto Load.',
        'button' => 'No, show \'View more\' link.',
        'pagging' => 'No, show \'Pagination\'.'
      ),
      'value' => 'auto_load',
    ));
  }

}
