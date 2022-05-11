<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Appointment.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Admin_Settings_Appointment extends Authorization_Form_Admin_Level_Abstract {

  public function init() {
    $this
      ->clearDecorators()
      ->addDecorator('FormElements')
      ->addDecorator('Form')
      ->addDecorator('HtmlTag', array('tag' => 'div', 'class' => 'search'))
      ->addDecorator('HtmlTag2', array('tag' => 'div', 'class' => 'clear'));

    $this
      ->setAttribs(array(
        'id' => 'filter_form',
        'class' => 'global_form_box',
      ))
      ->setMethod('POST');

    $appointment = new Zend_Form_Element_Text('appointment');
    $appointment
      ->setLabel('Appointment Title')
      ->clearDecorators()
      ->addDecorator('ViewHelper')
      ->addDecorator('Label', array('tag' => null, 'placement' => 'PREPEND'))
      ->addDecorator('HtmlTag', array('tag' => 'div'));

    $ownername = new Zend_Form_Element_Text('ownername');
    $ownername
      ->setLabel('Owner Name')
      ->clearDecorators()
      ->addDecorator('ViewHelper')
      ->addDecorator('Label', array('tag' => null, 'placement' => 'PREPEND'))
      ->addDecorator('HtmlTag', array('tag' => 'div'));

    $clientname = new Zend_Form_Element_Text('clientname');
    $clientname
      ->setLabel('Client Name')
      ->clearDecorators()
      ->addDecorator('ViewHelper')
      ->addDecorator('Label', array('tag' => null, 'placement' => 'PREPEND'))
      ->addDecorator('HtmlTag', array('tag' => 'div'));

    $year = new Zend_Form_Element_Select('year');
    $year
      ->setLabel('Select a Date YYYY')
      ->clearDecorators()
      ->addDecorator('ViewHelper')
      ->addDecorator('Label', array('tag' => null, 'placement' => 'PREPEND'))
      ->addDecorator('HtmlTag', array('tag' => 'div'))
      ->setMultiOptions(array(
        '' => '',
        '2000' => '2000',
        '2001' => '2001',
      ))
      ->setValue('');


    $month = new Zend_Form_Element_Select('month');
    $month
      ->setLabel('Month')
      ->clearDecorators()
      ->addDecorator('ViewHelper')
      ->addDecorator('Label', array('tag' => null, 'placement' => 'PREPEND'))
      ->addDecorator('HtmlTag', array('tag' => 'div'))
      ->setMultiOptions(array(
        '' => '',
        '01' => '01',
        '02' => '02',
      ))
      ->setValue('');

    $day = new Zend_Form_Element_Select('day');
    $day
      ->setLabel('Date')
      ->clearDecorators()
      ->addDecorator('ViewHelper')
      ->addDecorator('Label', array('tag' => null, 'placement' => 'PREPEND'))
      ->addDecorator('HtmlTag', array('tag' => 'div'))
      ->setMultiOptions(array(
        '' => '',
        '01' => '01',
        '02' => '02',
      ))
      ->setValue('');

    $service = new Zend_Form_Element_Text('service');
    $service
      ->setLabel('Service')
      ->clearDecorators()
      ->addDecorator('ViewHelper')
      ->addDecorator('Label', array('tag' => null, 'placement' => 'PREPEND'))
      ->addDecorator('HtmlTag', array('tag' => 'div'));

    $status = new Zend_Form_Element_Select('status');
    $status
      ->setLabel('Status')
      ->clearDecorators()
      ->addDecorator('ViewHelper')
      ->addDecorator('Label', array('tag' => null, 'placement' => 'PREPEND'))
      ->addDecorator('HtmlTag', array('tag' => 'div'))
      ->setMultiOptions(array(
        '' => '',
        '1' => 'Yes',
        '0' => 'No',
      ))
      ->setValue('');

    $submit = new Zend_Form_Element_Button('search', array('type' => 'submit'));
    $submit
      ->setLabel('Search')
      ->clearDecorators()
      ->addDecorator('ViewHelper')
      ->addDecorator('HtmlTag', array('tag' => 'div', 'class' => 'buttons'))
      ->addDecorator('HtmlTag2', array('tag' => 'div'));

    $arrayItem = array();
    $arrayItem = !empty($appointment) ? array_merge($arrayItem, array($appointment)) : '';
    $arrayItem = !empty($ownername) ? array_merge($arrayItem, array($ownername)) : '';
    $arrayItem = !empty($clientname) ? array_merge($arrayItem, array($clientname)) : '';
    $arrayItem = !empty($year) ? array_merge($arrayItem, array($year)) : '';
    $arrayItem = !empty($month) ? array_merge($arrayItem, array($month)) : '';
    $arrayItem = !empty($year) ? array_merge($arrayItem, array($year)) : '';
    $arrayItem = !empty($day) ? array_merge($arrayItem, array($day)) : '';
    $arrayItem = !empty($status) ? array_merge($arrayItem, array($status)) : '';
    $arrayItem = !empty($submit) ? array_merge($arrayItem, array($submit)) : '';
    $this->addElements($arrayItem);
  }

}
