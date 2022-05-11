<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: content.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */

return array(
    //
    array(
      'title' => 'SNS - Booking & Appointments Plugin - Appointments page',
      'description' => 'This widget displays all the given,taken,rejected,cancelled & completed appointments.',
      'category' => 'SNS - Booking & Appointments',
      'type' => 'widget',
      'name' => 'booking.appointments',
      'autoEdit' => true,
      'requirements' => array(
          'no-subject',
      ),
      'adminForm' => 'Booking_Form_Admin_AppointmentSettings'
    ),
    //
    array(
      'title' => 'SNS - Booking & Appointments Plugin - Booking Menus',
      'description' => 'This widget display the menu of booking & appointments plugin',
      'category' => 'SNS - Booking & Appointments',
      'type' => 'widget',
      'name' => 'booking.browse-menu',
    ),  
    array(
      'title' => 'SNS - Booking & Appointments Plugin - Service Booking',
      'description' => 'This widget display all the booking slots.',
      'category' => 'SNS - Booking & Appointments',
      'type' => 'widget',
      'name' => 'booking.book-services',
    ), 
    array(
      'title' => 'SNS - Booking & Appointments Plugin - Expert Dashboard',
      'description' => 'This widget displays all the setting which a professional can manage.',
      'category' => 'SNS - Booking & Appointments',
      'type' => 'widget',
      'name' => 'booking.expert-dashboard',
    ),
    //
    array(
      'title' => 'SNS - Booking & Appointments Plugin - Browse Services',
      'description' => 'Display all services on your website. The recommended page for this widget is "SNS - Booking & Appointments plugin- Browse Services Page',
      'category' => 'SNS - Booking & Appointments',
      'type' => 'widget',
      'name' => 'booking.browse-services',
      'autoEdit' => true,
      'adminForm' => 'Booking_Form_Admin_Browseservicesettings'
    ),
    //
    array(
      'title' => 'SNS - Booking & Appointments Plugin - Expert Profile',
      'description' => 'This widget display the information of professional on it’s view page',
      'category' => 'SNS - Booking & Appointments',
      'type' => 'widget',
      'name' => 'booking.expert-profile',
      'autoEdit' => false,
      'autoEdit' => true,
      'adminForm' => 'Booking_Form_Admin_Profileprofessionalsettings'
    ),
    //
    array(
      'title' => 'SNS - Booking & Appointments Plugin - Professional Search',
      'description' => 'This widget are the used to search professionals',
      'category' => 'SNS - Booking & Appointments',
      'type' => 'widget',
      'name' => 'booking.professional-search',
      'autoEdit' => true,
      'adminForm' => array(
        'elements' => array(
          array(
            'Select',
            'view_type',
            array(
              'label' => "Choose the Placement Type.",
              'multiOptions' => array(
                'horizontal' => 'Horizontal',
                'vertical' => 'Vertical'
              ),
              'value' => 'vertical',
            )
          ),
          array(
            'MultiCheckbox',
            'search_type',
            array(
              'label' => "Choose options to be shown in “Browse By” search fields.",
              'multiOptions' =>array('professionalName' => 'Show \'Professional Name\' search field?', 'serviceName' => 'Show \'Service Name\' search field?','rating' => 'Show \'Rating\' search field?','availability'=>'Show \'Availability\' search field?','location'=>'Show \'Location\' search field?','category' => 'Show \'Category\' search field?'), 
            )
          ),
        )
      )
    ),
    //
    array(
      'title' => 'SNS - Booking & Appointments Plugin - Services Search',
      'description' => 'This widget are the used to search professionals',
      'category' => 'SNS - Booking & Appointments',
      'type' => 'widget',
      'name' => 'booking.service-search',
      'autoEdit' => true,
      'adminForm' => array(
        'elements' => array(
          array(
            'Select',
            'view_type',
            array(
              'label' => "Choose the Placement Type.",
              'multiOptions' => array(
                'horizontal' => 'Horizontal',
                'vertical' => 'Vertical'
              ),
              'value' => 'vertical',
            )
          ),
          array(
            'MultiCheckbox',
            'search_type',
            array(
              'label' => "Choose options to be shown in “Browse By” search fields.",
              'multiOptions' =>array('professionalName' => 'Show \'Professional Name\' search field?', 'serviceName' => 'Show \'Service Name\' search field?','price' => 'Show \'Price\' search field?' ,'category' => 'Show \'Category\' search field?'),
            )
          ),
        )
      )
    ),
    
    array(
      'title' => 'SNS - Booking & Appointments Plugin - Browse Professionals',
      'description' => 'Display all professionals on your website. The recommended page for this widget is "SNS - Booking & Appointments plugin- Browse Professionals Page".',
      'category' => 'SNS - Booking & Appointments',
      'type' => 'widget',
      'name' => 'booking.professionals',
      'autoEdit' => true,
      'adminForm' => 'Booking_Form_Admin_Browseprofessionalsettings',
    ),
    array(
      'title' => 'SNS - Booking & Appointments Plugin - Service View',
      'description' => 'This widget displays the information of services on it\'s view page.',
      'category' => 'SNS - Booking & Appointments',
      'type' => 'widget',
      'name' => 'booking.service-view',
      'autoEdit' => false,
    ), 
    
    array(
      'title' => 'SNS - Booking & Appointments Plugin - Breadcrumb View',
      'description' => 'This widget Display Breadcrumb on professional / services view page',
      'category' => 'SNS - Booking & Appointments',
      'type' => 'widget',
      'name' => 'booking.breadcrumb',
      'autoEdit' => false,
    ), 
//     array(
//      'title' => 'SNS - Booking & Appointments Plugin - Payment Tabs',
//      'description' => '',
//      'category' => 'Booking',
//      'type' => 'widget',
//      'name' => 'booking.tabbed-events',
//      'autoEdit' => false,
//    ), 
//    array(
//      'title' => 'SNS - Booking & Appointments Plugin - My Settings',
//      'description' => '',
//      'category' => 'Booking',
//      'type' => 'widget',
//      'name' => 'booking.my-settings',
//      'autoEdit' => false,
//    ),
    
//      array(
//      'title' => 'SNS - Booking & Appointments Plugin - Booking Popup',
//      'description' => '',
//      'category' => 'Booking',
//      'type' => 'widget',
//      'name' => 'booking.booking-popup',
//      'autoEdit' => false,
//    ),
//      array(
//      'title' => 'SNS - Booking & Appointments Plugin - My Appointment Calendar',
//      'description' => '',
//      'category' => 'Booking',
//      'type' => 'widget',
//      'name' => 'booking.my-appointment-calendar',
//      'autoEdit' => false,
//    ),
//      array(
//      'title' => 'SNS - Booking & Appointments Plugin - My Appointment',
//      'description' => '',
//      'category' => 'Booking',
//      'type' => 'widget',
//      'name' => 'booking.my-appointment',
//      'autoEdit' => false,
//    ),
//      array(
//      'title' => 'SNS - Booking & Appointments Plugin - Expert Profile Portfolio',
//      'description' => '',
//      'category' => 'Booking',
//      'type' => 'widget',
//      'name' => 'booking.expert-profile-portfolio',
//      'autoEdit' => false,
//    ),
      array(
        'title' => 'SNS - Booking & Appointments Plugin - Profile Services',
        'description' => 'This widget displays professional services on its profile page',
        'category' => 'SNS - Booking & Appointments',
        'type' => 'widget',
        'name' => 'booking.profile-services',
        'autoEdit' => true,
        'adminForm' => 'Booking_Form_Admin_Profileservicessettings',
    ),
    array(
      'title' => 'SNS - Booking & Appointments Plugin - Professional Reviews',
      'description' => 'The recommended page for this widget is "SNS - Booking & Appointments Plugin - Professional View Page" & displays Reviews of Professionals.',
      'category' => 'SNS - Booking & Appointments',
      'type' => 'widget',
      'name' => 'booking.professional-reviews',
      'autoEdit' => true,
    )
) ?>
