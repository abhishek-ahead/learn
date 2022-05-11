<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Profileservicessettings.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Admin_Profileservicessettings extends Engine_Form {

  public function init() {
    $this->setTitle('SNS - Booking & Appointments Plugin - Profile Services')->setDescription('This widget displays professional services on its profile page');

    $this->addElement('MultiCheckbox', "show_criteria", array(
      'label' => "Choose from below the details that you want to show for Services in this widget.",
      'multiOptions' => array(
        'serviceimage' => 'Service Image',
        'servicename' => 'Service Name',
        'price' => 'Service price',
        'minute' => 'Service durations',
        'like' => 'Like button',
        'favourite' => 'Favourite button',
        'likecount' => 'Like counts',
        'favouritecount' => 'Favourite counts',
        'bookbutton' => 'Show Service view button',
      ),
      'escape' => false,
    ));

    $this->addElement('Text', "limit_data", array(
      'label' => 'count (number of services to show).',
      'value' => 20,
      'validators' => array(
        array('Int', true),
        array('GreaterThan', true, array(0)),
      )
    ));
    $this->addElement('Radio', "pagging", array(
      'label' => "Do you want the services to be auto-loaded when users scroll down the page?",
      'multiOptions' => array(
        'auto_load' => 'Yes, Auto Load.',
        'button' => 'No, show \'View more\' link.',
        'pagging' => 'No, show \'Pagination\'.'
      ),
      'value' => 'auto_load',
    ));
    $this->addElement('Text', "title_truncation", array(
      'label' => 'Enter service title truncation limit.',
      'value' => 45,
      'validators' => array(
        array('Int', true),
        array('GreaterThan', true, array(0)),
      )
    ));

    $this->addElement('Text', "height", array(
      'label' => 'Enter the height of one photo block (in pixels).',
      'value' => '160',
      'validators' => array(
        array('Int', true),
        array('GreaterThan', true, array(0)),
      )
    ));
    $this->addElement('Text', "width", array(
      'label' => 'Enter the width of one photo block (in pixels).',
      'value' => '140',
      'validators' => array(
        array('Int', true),
        array('GreaterThan', true, array(0)),
      )
    ));
  }

}
