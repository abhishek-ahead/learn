<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: AdminReviewController.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */

class Booking_AdminReviewController extends Core_Controller_Action_Admin {

  public function reviewSettingsAction() {
    $this->view->navigation = $navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_main_reviewsetting');
    $this->view->subNavigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main_reviewsetting', array(), 'booking_admin_main_servicerev');
    $this->view->form = $form = new Booking_Form_Admin_Review_ReviewSettings();

    if( $this->getRequest()->isPost() && $form->isValid($this->_getAllParams()) )
    {
      $values = $form->getValues();
      foreach ($values as $key => $value){
        Engine_Api::_()->getApi('settings', 'core')->setSetting($key, $value);
      }
      $form->addNotice('Your changes have been saved.');
    }
  }

  public function reviewSettingProfessionalsAction() {
    $this->view->navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_main_reviewsetting');
    $this->view->subNavigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main_reviewsetting', array(), 'booking_admin_main_professionalrev');
    $this->view->form = $form = new Booking_Form_Admin_Review_ProfessioanlReviewSettings();
    if( $this->getRequest()->isPost() && $form->isValid($this->_getAllParams()) )
    {
      $values = $form->getValues();
      foreach ($values as $key => $value){
        Engine_Api::_()->getApi('settings', 'core')->setSetting($key, $value);
      }
      $form->addNotice('Your changes have been saved.');
    }
  }

}
