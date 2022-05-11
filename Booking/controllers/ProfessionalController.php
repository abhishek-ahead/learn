<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: ProfessionalController.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_ProfessionalController extends Core_Controller_Action_Standard
{
  public function init()
  {
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $levelId = ($viewerId) ? $viewer->level_id : Engine_Api::_()->getDbtable('levels', 'authorization')->getPublicLevel()->level_id;
    if (!Engine_Api::_()->authorization()->getPermission($levelId, 'booking', 'profview'))
      return $this->_forward('requireauth', 'error', 'core');
    // @todo this may not work with some of the content stuff in here, double-check
    $subject = null;
    if (!Engine_Api::_()->core()->hasSubject() && ($id = $this->_getParam('professional_id'))) {
      $professional_id = $this->_getParam('professional_id');
      if ($professional_id) {
        $professional = Engine_Api::_()->getItem('professional', $professional_id);
        if ($professional)
          Engine_Api::_()->core()->setSubject($professional);
        else
          return $this->_forward('requireauth', 'error', 'core');
      } else
        return $this->_forward('requireauth', 'error', 'core');
    }
  }
  public function indexAction()
  {
    // if (Engine_Api::_()->core()->getSubject()->active == 0 && Engine_Api::_()->user()->getViewer()->getIdentity() == Engine_Api::_()->core()->getSubject()->user_id) { }
    if (Engine_Api::_()->core()->getSubject()->active == 0 && Engine_Api::_()->user()->getViewer()->getIdentity() != Engine_Api::_()->core()->getSubject()->user_id)
      return $this->_forward('requireauth', 'error', 'core');
    $this->_helper->content->setEnabled();
  }
}
