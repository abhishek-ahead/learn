<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: AdminSettingsController.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_AdminSettingsController extends Core_Controller_Action_Admin
{

  public function indexAction() {

    $db = Engine_Db_Table::getDefaultAdapter();

    $this->view->navigation = $navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_main_settings');
    
    $table_exist = $db->query('SHOW TABLES LIKE \'engine4_booking_appointments\'')->fetch();
    if($table_exist) {
      Engine_Api::_()->getApi('settings', 'core')->setSetting('booking.pluginactivated', 1);
    }

    $this->view->form = $form = new Booking_Form_Admin_Global();
    if (!Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.levelsettings')) { //install on first time
      $this->getDefaultSettings();
      Engine_Api::_()->getApi('settings', 'core')->setSetting('booking.levelsettings', 1); //set 1 if not available
    }
    if ($this->getRequest()->isPost() && $form->isValid($this->_getAllParams())) {
      $values = $form->getValues();
      include_once APPLICATION_PATH . "/application/modules/Booking/controllers/License.php";
      if (Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.pluginactivated')) {
        foreach ($values as $key => $value) {
          if($value != ''){
            if ($key == "booking_paymode")
              $db->query("UPDATE `engine4_core_menuitems` SET `enabled` = " . $value . " WHERE `engine4_core_menuitems`.`name` = 'booking_admin_manageorders' AND `engine4_core_menuitems`.`module` = 'booking'");
            Engine_Api::_()->getApi('settings', 'core')->setSetting($key, $value);
          }
        }
        $form->addNotice('Your changes have been saved.');
        if($error)
          $this->_helper->redirector->gotoRoute(array());
      }
    }
  }

  public function levelAction()
  {
    $this->view->navigation = $navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_main_level');
    // Get level id
    if (null !== ($id = $this->_getParam('id'))) {
      $level = Engine_Api::_()->getItem('authorization_level', $id);
    } else {
      $level = Engine_Api::_()->getItemTable('authorization_level')->getDefaultLevel();
    }
    if (!$level instanceof Authorization_Model_Level) {
      throw new Engine_Exception('missing level');
    }
    $level_id = $id = $level->level_id;
    // Make form
    $this->view->form = $form = new Booking_Form_Admin_Settings_Level(array(
      'public' => (in_array($level->type, array('public'))),
      'moderator' => (in_array($level->type, array('admin', 'moderator'))),
    ));
    $form->level_id->setValue($level_id);
    $permissionsTable = Engine_Api::_()->getDbtable('permissions', 'authorization');
    $valuesForm = $permissionsTable->getAllowed('booking', $level_id, array_keys($form->getValues()));
    $form->populate($valuesForm);
    if (!$this->getRequest()->isPost()) {
      return;
    }
    // Check validitiy
    if (!$form->isValid($this->getRequest()->getPost())) {
      return;
    }
    // Process
    $values = $form->getValues();
    $db = $permissionsTable->getAdapter();
    $db->beginTransaction();
    try {
      if ($level->type != 'public') {
        // Set permissions
        $values['auth_comment'] = (array)$values['auth_comment'];
        $values['auth_photo'] = (array)$values['auth_photo'];
        $values['auth_view'] = (array)$values['auth_view'];
      }
      //view and auth view permission for item professional and booking
      $nonBooleanSettings = $form->nonBooleanFields();
      $permissionsTable->setAllowed('booking', $level_id, $values, '',$nonBooleanSettings);
      $professionalValues["view"] = $form->profview->getValue();
      $professionalValues["like"] = $form->servview->getValue();
      $professionalValues["comment"] = $form->comment->getValue();
      $professionalValues["auth_view"] = ["everyone", "owner_network", "owner_member_member", "owner_member", "owner"];
      $permissionsTable->setAllowed('professional', $level_id, $professionalValues);
      $permissionsTable->setAllowed('booking_service', $level_id, $professionalValues);
      $permissionsTable->setAllowed('booking_review', $level_id, $professionalValues);
      $permissionsTable->setAllowed('booking_like', $level_id, $professionalValues);
      $permissionsTable->setAllowed('booking_follow', $level_id, $professionalValues);
      $permissionsTable->setAllowed('bookingfavourite', $level_id, $professionalValues);
      $permissionsTable->setAllowed('servicelike', $level_id, $professionalValues);
      $permissionsTable->setAllowed('servicefavourite', $level_id, $professionalValues);
      // Commit
      $db->commit();
    } catch (Exception $e) {
      $db->rollBack();
      throw $e;
    }
    $form->addNotice('Your changes have been saved.');
  }

  public function appointmentAction()
  {
    $this->view->navigation = $navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_main_appointments');
    $this->view->appointment = $appointment = new Booking_Form_Admin_Settings_Appointment();
    $this->view->getAllAppointmentsPaginator = $getAllAppointmentsPaginator = Engine_Api::_()->getDbtable('appointments', 'booking')->getAllAppointmentsPaginator();
  }

  public function durationsAction()
  {
    //$this->view->navigation = $navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_main_durations');
    //$this->view->appointment = $appointment = new Booking_Form_Admin_Settings_Appointment();
  }

  public function manageDashboardsAction()
  {

    // $this->view->navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'sesevent_admin_main_managedashboards');

    // $this->view->storage = Engine_Api::_()->storage();
    // $this->view->paginator = Engine_Api::_()->getDbtable('dashboards', 'sesevent')->getDashboardsItems();
  }
  public function supportAction()
  {

    $this->view->navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_main_support');
  }

  public function gatewaysAction()
  {
    //$this->view->navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_main_gateways');
  }

  public function managecurrencysAction()
  {
    //$this->view->navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_main_managecurrencys');
  }

  public function paymentsmadesAction()
  {
    //$this->view->navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_main_paymentsmades');
  }

  public function paymentsAction()
  {
    //$this->view->navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_main_payments');
  }

  public function getDefaultSettings()
  {
    //Default Privacy Set Work
    $permissionsTable = Engine_Api::_()->getDbTable('permissions', 'authorization');
    foreach (Engine_Api::_()->getDbTable('levels', 'authorization')->fetchAll() as $level) {
      $level_id = $id = $level->level_id;
      $form = new Booking_Form_Admin_Settings_Level(array(
        'public' => (in_array($level->type, array('public'))),
        'moderator' => (in_array($level->type, array('admin', 'moderator'))),
      ));
      $values = $form->getValues();
      $valuesForm = $permissionsTable->getAllowed('booking', $level->level_id, array_keys($form->getValues()));
      $form->populate($valuesForm);
      if ($form->defattribut)
        $form->defattribut->setValue(0);
      $db = $permissionsTable->getAdapter();
      $db->beginTransaction();
      try {
        if ($level->type != 'public') {
          // Set permissions
          $values['auth_comment'] = (array)$values['auth_comment'];
          $values['auth_photo'] = (array)$values['auth_photo'];
          $values['auth_view'] = (array)$values['auth_view'];
        }
        //view and auth view permission for item professional and booking
        $permissionsTable->setAllowed('booking', $level_id, $values);
        if ($level->type != 'public') {
          $professionalValues["view"] = $form->professional->getValue();
          $professionalValues["like"] = $form->professional->getValue();
          $professionalValues["auth_view"] = ["everyone", "owner_network", "owner_member_member", "owner_member", "owner"];
          $permissionsTable->setAllowed('professional', $level_id, $professionalValues);
          $permissionsTable->setAllowed('booking_service', $level_id, $professionalValues);
          $permissionsTable->setAllowed('booking_review', $level_id, $professionalValues);
          $permissionsTable->setAllowed('booking_like', $level_id, $professionalValues);
          $permissionsTable->setAllowed('booking_follow', $level_id, $professionalValues);
          $permissionsTable->setAllowed('bookingfavourite', $level_id, $professionalValues);
          $permissionsTable->setAllowed('servicelike', $level_id, $professionalValues);
          $permissionsTable->setAllowed('servicefavourite', $level_id, $professionalValues);
        }
        // Commit
        $db->commit();
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    }
  }
}
