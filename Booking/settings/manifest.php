<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: manifest.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */


$module1 = null;
$controller = null;
$action = null;
$request = Zend_Controller_Front::getInstance()->getRequest();
if (!empty($request)) {
  $module1 = $request->getModuleName();
  $action = $request->getActionName();
  $controller = $request->getControllerName();
}
if (empty($request) || !($module1 == 'default' && (strpos($_SERVER['REQUEST_URI'], '/install/') !== false))) {
  $setting = Engine_Api::_()->getApi('settings', 'core');
  $bookingsRoute = $setting->getSetting('booking_bookings_manifest', 'bookings');
  $bookingRoute = $setting->getSetting('booking_booking_manifest', 'booking');
}

return array(
  'package' =>
  array(
    'type' => 'module',
    'name' => 'booking',
	//'sku' => 'booking',
    'version' => '5.7.1',
	'dependencies' => array(
            array(
                'type' => 'module',
                'name' => 'core',
                'minVersion' => '5.0.0',
            ),
        ),
    'path' => 'application/modules/Booking',
    'title' => 'SNS - Booking & Appointments Plugin',
    'description' => 'SNS - Booking & Appointments Plugin',
    'author' => '<a href="https://socialnetworking.solutions" style="text-decoration:underline;" target="_blank">SocialNetworking.Solutions</a>',
    'callback' => array(
      'path' => 'application/modules/Booking/settings/install.php',
      'class' => 'Booking_Installer',
    ),
    'actions' =>
    array(
      0 => 'install',
      1 => 'upgrade',
      2 => 'refresh',
      3 => 'enable',
      4 => 'disable',
    ),
    'directories' =>
    array(
      0 => 'application/modules/Booking',
    ),
    'files' => array(
      'application/languages/en/booking.csv',
    ),
  ),
  // Hooks ---------------------------------------------------------------------
  'hooks' => array(
    array(
      'event' => 'onUserDeleteBefore',
      'resource' => 'Booking_Plugin_Core'
    ),
  ),
  'items' =>
  array(
    'booking',
    'booking_service',
    'booking_category',
    'booking_settings',
    'booking_settingdurations',
    'booking_settingservices',
    'booking_durations',
    'professional',
    'booking_review',
    'booking_like',
    'booking_follow',
    'bookingfavourite',
    'servicelike',
    'servicefavourite',
    'booking_appointment',
    'booking_gateway',
    'booking_order',
    'booking_usergateway',
    'booking_userpayrequest',
    'booking_profreview',
  ),
  'routes' => array(
    'booking_general' => array(
      'route' => $bookingsRoute . '/:action/*',
      'defaults' => array(
        'module' => 'booking',
        'controller' => 'index',
        'action' => 'index',
      ),
    ),

    'booking_order' => array(
      'route' => $bookingsRoute . '/order/:action/:professional_id/*',
      'defaults' => array(
        'module' => 'booking',
        'controller' => 'order',
        'action' => 'index',
      ),
      'reqs' => array(
        'action' => '(index|checkout|process|return|finish|success|view|print-ticket|free-order|print-invoice|checkorder|email-ticket)',
      )
    ),

    'booking_dashboard' => array(
      'route' => $bookingsRoute.'/dashboard/:action/:professional_id/*',
      'defaults' => array(
        'module' => 'booking',
        'controller' => 'dashboard',
        'action' => 'edit',
      ),
      'reqs' => array(
        'action' => '(edit|edit-photo|remove-photo|contact-information|edit-location|manage-photos|upload|announcements|post-announcement|edit-announcement|delete-announcement|currency-converter|view-doners|account-details|payment-requests|payment-transaction|payment-request|detail-payment|delete-payment|payment-transaction|donations-stats|donations-reports|overview|announcement|seo|advertise-crowdfunding|backgroundphoto|style|remove-backgroundphoto|manage-team|rewards|post-reward|edit-reward|delete-reward|design)',
      )
    ),

    'professionalreview_view' => array(
      'route' => $bookingRoute.'/reviews/:action/:profreview_id/:slug',
      'defaults' => array(
        'module' => 'booking',
        'controller' => 'review',
        'action' => 'view',
        'slug' => ''
      ),
      'reqs' => array(
        'action' => '(edit|view|delete|edit-review)',
        'profreview_id' => '\d+'
      )
    ),

    'service_profile' => array(
      'route' => $bookingRoute . '/service/:service_id/*',
      'defaults' => array(
        'module' => 'booking',
        'controller' => 'service',
        'action' => 'index',
      ),
    ),

    'professional_profile' => array(
      'route' => $bookingRoute . '/professional/:professional_id/*',
      'defaults' => array(
        'module' => 'booking',
        'controller' => 'professional',
        'action' => 'index',
      ),
    ),
  ),
);
