<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Professionals.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Admin_Settings_Professionals extends Engine_Form {

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

    $service = new Zend_Form_Element_Text('name');
    $service
      ->setLabel('Professional Name')
      ->clearDecorators()
      ->addDecorator('ViewHelper')
      ->addDecorator('Label', array('tag' => null, 'placement' => 'PREPEND'))
      ->addDecorator('HtmlTag', array('tag' => 'div'));

    $provider = new Zend_Form_Element_Text('designation');
    $provider
      ->setLabel('Designation')
      ->clearDecorators()
      ->addDecorator('ViewHelper')
      ->addDecorator('Label', array('tag' => null, 'placement' => 'PREPEND'))
      ->addDecorator('HtmlTag', array('tag' => 'div'));

    $location = new Zend_Form_Element_Text('location');
    $location
      ->setLabel('Location')
      ->clearDecorators()
      ->addDecorator('ViewHelper')
      ->addDecorator('Label', array('tag' => null, 'placement' => 'PREPEND'))
      ->addDecorator('HtmlTag', array('tag' => 'div'));

    $apitimezoneArray = array(
      '' => '',
      'US/Pacific' => '(UTC-8) Pacific Time (US & Canada)',
      'US/Mountain' => '(UTC-7) Mountain Time (US & Canada)',
      'US/Central' => '(UTC-6) Central Time (US & Canada)',
      'US/Eastern' => '(UTC-5) Eastern Time (US & Canada)',
      'America/Halifax' => '(UTC-4)  Atlantic Time (Canada)',
      'America/Anchorage' => '(UTC-9)  Alaska (US & Canada)',
      'Pacific/Honolulu' => '(UTC-10) Hawaii (US)',
      'Pacific/Samoa' => '(UTC-11) Midway Island, Samoa',
      'Etc/GMT-12' => '(UTC-12) Eniwetok, Kwajalein',
      'Canada/Newfoundland' => '(UTC-3:30) Canada/Newfoundland',
      'America/Buenos_Aires' => '(UTC-3) Brasilia, Buenos Aires, Georgetown',
      'Atlantic/South_Georgia' => '(UTC-2) Mid-Atlantic',
      'Atlantic/Azores' => '(UTC-1) Azores, Cape Verde Is.',
      'Europe/London' => 'Greenwich Mean Time (Lisbon, London)',
      'Europe/Berlin' => '(UTC+1) Amsterdam, Berlin, Paris, Rome, Madrid',
      'Europe/Athens' => '(UTC+2) Athens, Helsinki, Istanbul, Cairo, E. Europe',
      'Europe/Moscow' => '(UTC+3) Baghdad, Kuwait, Nairobi, Moscow',
      'Iran' => '(UTC+3:30) Tehran',
      'Asia/Dubai' => '(UTC+4) Abu Dhabi, Kazan, Muscat',
      'Asia/Kabul' => '(UTC+4:30) Kabul',
      'Asia/Yekaterinburg' => '(UTC+5) Islamabad, Karachi, Tashkent',
      'Asia/Calcutta' => '(UTC+5:30) Bombay, Calcutta, New Delhi',
      'Asia/Katmandu' => '(UTC+5:45) Nepal',
      'Asia/Omsk' => '(UTC+6) Almaty, Dhaka',
      'Indian/Cocos' => '(UTC+6:30) Cocos Islands, Yangon',
      'Asia/Krasnoyarsk' => '(UTC+7) Bangkok, Jakarta, Hanoi',
      'Asia/Hong_Kong' => '(UTC+8) Beijing, Hong Kong, Singapore, Taipei',
      'Asia/Tokyo' => '(UTC+9) Tokyo, Osaka, Sapporto, Seoul, Yakutsk',
      'Australia/Adelaide' => '(UTC+9:30) Adelaide, Darwin',
      'Australia/Sydney' => '(UTC+10) Brisbane, Melbourne, Sydney, Guam',
      'Asia/Magadan' => '(UTC+11) Magadan, Solomon Is., New Caledonia',
      'Pacific/Auckland' => '(UTC+12) Fiji, Kamchatka, Marshall Is., Wellington',
    );

    $timezone = new Zend_Form_Element_Select('timezone');
    $timezone
      ->setLabel('Select Time Zone')
      ->clearDecorators()
      ->addDecorator('ViewHelper')
      ->addDecorator('Label', array('tag' => null, 'placement' => 'PREPEND'))
      ->addDecorator('HtmlTag', array('tag' => 'div'))
      ->setMultiOptions($apitimezoneArray)
      ->setValue('');

    $submit = new Zend_Form_Element_Button('search', array('type' => 'submit'));
    $submit
      ->setLabel('Search')
      ->clearDecorators()
      ->addDecorator('ViewHelper')
      ->addDecorator('HtmlTag', array('tag' => 'div', 'class' => 'buttons'))
      ->addDecorator('HtmlTag2', array('tag' => 'div'));

    $arrayItem = array();
    $arrayItem = !empty($service) ? array_merge($arrayItem, array($service)) : '';
    $arrayItem = !empty($provider) ? array_merge($arrayItem, array($provider)) : '';
    $arrayItem = !empty($location) ? array_merge($arrayItem, array($location)) : '';
    $arrayItem = !empty($timezone) ? array_merge($arrayItem, array($timezone)) : '';
    $arrayItem = !empty($submit) ? array_merge($arrayItem, array($submit)) : '';
    $this->addElements($arrayItem);
  }

}
