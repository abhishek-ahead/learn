<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Global.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Admin_Global extends Engine_Form
{

  public function init()
  {

    $settings = Engine_Api::_()->getApi('settings', 'core');
    $this->setTitle('Global Settings')->setDescription('These settings affect all members in your community.');
        
    $view = Zend_Registry::isRegistered('Zend_View') ? Zend_Registry::get('Zend_View') : null;
    $supportTicket = '<a href="https://socialnetworking.solutions/tickets" target="_blank">Support Ticket</a>';
    $sesSite = '<a href="https://socialnetworking.solutions" target="_blank">SocialNetworking.Solutions website</a>';
    $descriptionLicense = sprintf('Enter your license key that is provided to you when you purchased this plugin. If you do not know your license key, please drop us a line from the %s section on %s. (Key Format: XXXX-XXXX-XXXX-XXXX)',$supportTicket,$sesSite);

    $this->addElement('Text', "booking_licensekey", array(
        'label' => 'Enter License key',
        'description' => $descriptionLicense,
        'allowEmpty' => false,
        'required' => true,
        'value' => $settings->getSetting('booking.licensekey'),
    ));
    $this->getElement('booking_licensekey')->getDecorator('Description')->setOptions(array('placement' => 'PREPEND', 'escape' => false));


    if ($settings->getSetting('booking.pluginactivated')) {
  
      $this->addElement('Text', 'booking_bookings_manifest', array(
        'label' => 'Plural "bookings" Text in URL',
        'description' => 'Enter the text which you want to show in place of "bookings" in the URLs of this plugin.',
        'value' => $settings->getSetting('booking_bookings_manifest', 'bookings'),
      ));

      $this->addElement('Text', 'booking_booking_manifest', array(
        'label' => 'Singular "booking" Text in URL',
        'description' => 'Enter the text which you want to show in place of "booking" in the URLs of this plugin.',
        'value' => $settings->getSetting('booking_booking_manifest', 'booking'),
      ));

      // $this->addElement('Radio', 'booking_enable_location', array(
      //   'label' => 'Enable Location',
      //   'description' => 'Do you want to enable location for professionals on your website?',
      //   'multiOptions' => array(
      //     '1' => 'Yes',
      //     '0' => 'No',
      //   ),
      //   'value' => $settings->getSetting('booking_enable_location', 1),
      // ));


      $this->addElement('Radio', "booking_location_isrequired", array(
        'label' => 'Enable Location',
        'description' => "Do you want to enable Location field when professional create or edit?",
        'multiOptions' => array(
          '1' => 'Yes',
          '0' => 'No',
        ),
        'value' => $settings->getSetting('booking.location.isrequired', 1),
      ));

      //user gateway for booking and sponsorship
      // Gateways
      $gatewayTable = Engine_Api::_()->getDbtable('gateways', 'payment');
      $gatewaySelect = $gatewayTable->select()
        ->where('enabled = ?', 1);
      $gateways = $gatewayTable->fetchAll($gatewaySelect);
      $gatewayPlugins = array();
      foreach ($gateways as $gateway) {
        $gatewayPlugins[] = array(
          'gateway' => $gateway,
          'plugin' => $gateway->getGateway(),
        );
      }

      $this->addElement('Radio', 'booking_category_enable', array(
        'label' => 'Make Service Categories Mandatory',
        'description' => ' Do you want to make category field mandatory when users create or edit their services?',
        'multiOptions' => array(
          1 => 'Yes',
          0 => 'No'
        ),
        'value' => $settings->getSetting('booking.category.enable', 1),
      ));

      $this->addElement('Radio', "booking_allow_share", array(
        'label' => 'Allow to share Professionals',
        'description' => "Do you want to allow users to share Professionals of your website inside on your website and outside on other social networking sites",
        'multiOptions' => array(
          '2' => 'Yes, allow sharing on this site and on social networking sites both.',
          '1' => ' Yes, allow sharing on this site and do not allow sharing on other Social sites.',
          '0' => 'No, do not allow sharing of Professionals.',
        ),
        'value' => $settings->getSetting('booking.allow.share', 1),
      ));

      $this->addElement('Radio', 'booking_service_fav', array(
        'label' => 'Allow to Favourite Services.',
        'description' => 'Do you want to allow the members to add the Services to Favorites?',
        'multiOptions' => array(
          1 => 'Yes',
          0 => 'No'
        ),
        'value' => $settings->getSetting('booking.service.fav', 1),
      ));

      $this->addElement('Radio', 'booking_prof_like', array(
        'label' => 'Allow to Like Professionals.',
        'description' => 'Do you want to allow the members to like the professionals?',
        'multiOptions' => array(
          1 => 'Yes',
          0 => 'No'
        ),
        'value' => $settings->getSetting('booking.prof.like', 1),
      ));

      $this->addElement('Radio', 'booking_prof_fav', array(
        'label' => 'Allow to Favourite Professionals.',
        'description' => 'Do you want to allow the members to favourite professionals ?',
        'multiOptions' => array(
          1 => 'Yes',
          0 => 'No'
        ),
        'value' => $settings->getSetting('booking.prof.fav', 1),
      ));

      $this->addElement('Radio', 'booking_prof_follow', array(
        'label' => 'Allow to Follow Professionals.',
        'description' => 'Do you want to allow the members to follow professionals ?',
        'multiOptions' => array(
          1 => 'Yes',
          0 => 'No'
        ),
        'value' => $settings->getSetting('booking.prof.follow', 1),
      ));

      $this->addElement('Radio', 'booking_prof_report', array(
        'label' => 'Allow to Report.',
        'description' => 'Do you want to allow users to report against Professional on your website?',
        'multiOptions' => array(
          1 => 'Yes',
          0 => 'No'
        ),
        'value' => $settings->getSetting('booking.prof.report', 1),
      ));

      //Online and offline payment.
      $this->addElement('Radio', 'booking_paymode', array(
        'label' => 'Allow online payment?',
        'description' => 'Do you want to allow pay online for booking services?',
        'multiOptions' => array(
          1 => 'Yes, allow members to pay online.',
          0 => 'No, do not allow to be pay online.',
        ),
        'value' => $settings->getSetting('booking.paymode', 1),
      ));

      $this->addElement('Select', 'booking_allow_for', array(
        'label' => 'Professional book service for',
        'multiOptions' => array('1' => 'Everyone', '0' => 'Friends Only'),
        'value' => $settings->getSetting('booking.allow.for', 1),
      ));

      $this->addElement('Button', 'submit', array(
        'label' => 'Save Changes',
        'type' => 'submit',
        'ignore' => true
      ));
    } else {
      $this->addElement('Button', 'submit', array(
        'label' => 'Activate Your Plugin',
        'type' => 'submit',
        'ignore' => true
      ));
    }
  }
}
