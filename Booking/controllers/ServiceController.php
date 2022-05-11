<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: ServiceController.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_ServiceController extends Core_Controller_Action_Standard
{
  public function init()
  {
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $levelId = ($viewerId) ? $viewer->level_id : Engine_Api::_()->getDbtable('levels', 'authorization')->getPublicLevel()->level_id;
    if (!Engine_Api::_()->authorization()->getPermission($levelId, 'booking', 'servview'))
      return $this->_forward('requireauth', 'error', 'core');
    // @todo this may not work with some of the content stuff in here, double-check
    $subject = null;
    if (
      !Engine_Api::_()->core()->hasSubject() && ($id = $this->_getParam('service_id'))
    ) {
      $service_id = $this->_getParam('service_id');
      if ($service_id) {
        $service = Engine_Api::_()->getItem('booking_service', $service_id);
        if ($service)
          Engine_Api::_()->core()->setSubject($service);
        else
          return $this->_forward('requireauth', 'error', 'core');
      } else
        return $this->_forward('requireauth', 'error', 'core');
    }
  }
  public function indexAction()
  {
    $this->_helper->content->setEnabled();
  }
}
