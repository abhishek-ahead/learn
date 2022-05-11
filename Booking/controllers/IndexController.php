<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: IndexController.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_IndexController extends Core_Controller_Action_Standard
{

  public function init()
  { }

  public function indexAction()
  {
    $this->_helper->content->setEnabled();
  }

  public function servicesAction()
  {
    $this->_helper->content->setEnabled();
  }

  public function enabledmeAction()
  {
    $professional_id = $this->_getParam("professional_id");
    $professional = Engine_Api::_()->getItem('professional', $professional_id);
    $this->_helper->layout->setLayout('default-simple');
    $this->view->form = $form = new Sesbasic_Form_Delete();
    $form->setTitle('Become normal user?');
    $form->setDescription('Are you sure that you want to become a normal user if you save this setting it will delete your professional profile and service as well?');
    $form->submit->setLabel('Make change');
    if ($this->getRequest()->isPost()) {
      $db = $professional->getTable()->getAdapter();
      $db->beginTransaction();
      try {
        $deletedProfessionalsdb = Engine_Api::_()->getDbTable('professionals', 'booking')->getAdapter();
        $deletedProfessionalsdb->beginTransaction();
        $deletedProfessionalsdb->commit();
        $deletedProfessionalsTable = Engine_Api::_()->getDbTable('deletedprofessionals', 'booking');
        $deletedProfessionals = $deletedProfessionalsTable->createRow();
        $formValues['user_id'] = $professional->user_id;
        $deletedProfessionals->setFromArray($formValues);
        $deletedProfessionals->save();
        $professional->is_deleted = 1;
        $professional->save();
        $deletedProfessionalsdb->commit();
        $db->commit();
        $this->view->message = Zend_Registry::get('Zend_Translate')->_('The selected review has been deleted.');
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
      return $this->_forward('success', 'utility', 'core', array(
        'parentRedirect' => Zend_Controller_Front::getInstance()->getRouter()->assemble(array('module' => 'booking', 'controller' => 'index', 'action' => 'index'), 'booking_general', true),
        'messages' => array('you have successfully deleted your profile')
      ));
    }
  }

  public function deleteAction()
  {
    $review_id = $this->_getParam("review_id");
    $reviews = Engine_Api::_()->getItem('booking_review', $review_id);
    $this->_helper->layout->setLayout('default-simple');
    $this->view->form = $form = new Sesbasic_Form_Delete();
    $form->setTitle('Delete Review?');
    $form->setDescription('Are you sure that you want to delete this review? It will not be recoverable after being deleted.');
    $form->submit->setLabel('Delete');
    if ($this->getRequest()->isPost()) {
      $db = $reviews->getTable()->getAdapter();
      $db->beginTransaction();
      try {
        $reviews->delete();
        $db->commit();
        $this->view->message = Zend_Registry::get('Zend_Translate')->_('The selected review has been deleted.');
        return $this->_forward('success', 'utility', 'core', array(
          'smoothboxClose' => 10,
          'parentRefresh' => 10,
          'messages' => array('Review delete successfully.')
        ));
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    }
  }

  public function serviceReviewAction()
  {
    $formValues = array();
    $this->_helper->layout->setLayout('default-simple');
    $serviceId = $this->_getParam("service_id");
    $review_id = $this->_getParam("review_id");
    $this->view->viewerId = $viewerId = Engine_Api::_()->user()->getViewer()->getIdentity();
    $this->view->form = $form = new Booking_Form_Review_Create();
    if ($review_id) {
      $reviews = Engine_Api::_()->getItem('booking_review', $review_id);
      $form->populate($reviews->toArray());
      $form->rate_value->setValue($reviews['rating']);
      $form->submit->setLabel('Save Changes');
      $form->setTitle('Edit reviews');
    }

    if ($this->getRequest()->isPost() && $form->isValid($this->_getAllParams())) {
      $db = Engine_Api::_()->getDbTable('reviews', 'booking')->getAdapter();
      $db->beginTransaction();
      try {
        $formValues = $form->getValues();
        $reviewsTable = Engine_Api::_()->getDbTable('reviews', 'booking');
        if (!$review_id) {
          $reviews = $reviewsTable->createRow();
          $formValues['rating'] = $formValues['rate_value'];
          $formValues['module_name'] = 'booking';
          $formValues['service_id'] = $serviceId;
          $formValues['user_id'] = $viewerId;
          $reviews->setFromArray($formValues);
        } else {
          $reviews->rating = $formValues['rate_value'];
          $reviews->title = $formValues['title'];
          $reviews->pros = $formValues['pros'];
          $reviews->cons = $formValues['cons'];
          $reviews->description = $formValues['description'];
          $reviews->recommended = $formValues['recommended'];
        }
        $reviews->save();
        $db->commit();
        return $this->_forward('success', 'utility', 'core', array(
          'smoothboxClose' => 10,
          'parentRefresh' => 10,
          'messages' => array('Review post successfully.')
        ));
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    }
  }

  public function professionalsAction()
  {
    $this->_helper->content->setEnabled();
  }

  public function composeAction()
  {
    // $type = $this->_getParam('type');
    $id = $this->_getParam('id');
    $professionalName = $this->_getParam("professional");
    $this->view->form = $form = new Booking_Form_Compose(array("professionalName" => $professionalName));
    if ($this->getRequest()->isPost() && $form->isValid($this->_getAllParams())) {
      // $attachment = Engine_Api::_()->getItem($type, $id);
      $values = $form->getValues();
      $recipient = Engine_Api::_()->getItem('user', $id);
      $viewer = Engine_Api::_()->user()->getViewer();
      $conversation = Engine_Api::_()->getItemTable('messages_conversation')->send($viewer, $recipient,$values['title'],$values['body']);
      return $this->_forward('success', 'utility', 'core', array(
        'smoothboxClose' => true,
        'format' => 'smoothbox',
        'messages' => array("Sending message to Professional {$professionalName} is done you will get response soon.")
      ));
    }
  }

  public function bookservicesAction()
  {
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $levelId = ($viewerId) ? $viewer->level_id : Engine_Api::_()->getDbtable('levels', 'authorization')->getPublicLevel()->level_id;
    $professionalID = Zend_Controller_Front::getInstance()->getRequest()->getParam("professional");
    $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($professionalID);
    if(empty($professional))
      return $this->_forward('notfound', 'error', 'core');
    if (!Engine_Api::_()->authorization()->getPermission($levelId, 'booking', 'bookservice'))
      return $this->_forward('requireauth', 'error', 'core');
    // $ifUserGatewayAvailable = Engine_Api::_()->getDbTable('usergateways', 'booking')->getUserGateway(array("professional_id"=> $professional->professional_id));
    // $userSelected = Engine_Api::_()->getItem('user',$professional->user_id);
    // if (Engine_Api::_()->authorization()->getPermission($userSelected->level_id, 'booking', 'paymod'))
    //   if (!$ifUserGatewayAvailable) // if professional have not save his payment details.
    //     return $this->_helper->redirector->gotoRoute(array('action' => 'no-gateway'));
    Engine_Api::_()->booking()->removeIncompleteAppointments_Orders($viewer->getIdentity());
    $this->_helper->content->setEnabled();
  }

  public function appointmentsAction()
  {
    $this->_helper->content->setEnabled();
  }

  public function appointmentAction()
  {
    $this->_helper->layout->setLayout('admin-simple');
    $this->view->actionType = (
      (!empty($this->_getParam("accept")) ? "Accepting User Service Request. This will change service request ('Mark as to be Completed till date')" : (!empty($this->_getParam("completed")) ? "Service completed successfully" : (!empty($this->_getParam("reject")) ? "Reject User Service Request" : (!empty($this->_getParam("block")) ? "Block this user" : (!empty($this->_getParam("unblock")) ? "Un-Block this user" : (!empty($this->_getParam("cancel")) ? "Cancel User Service Request" : "")))))));
    $accept = $this->_getParam('accept');
    $completed = $this->_getParam('completed');
    $reject = $this->_getParam('reject');
    $block = $this->_getParam('block');
    $cancel = $this->_getParam('cancel');
    $unblock = $this->_getParam('unblock');
    if ($this->getRequest()->isPost()) {
      if ($accept) {
        $appointment = Engine_Api::_()->getItem('booking_appointment', $accept);
        $appointment->saveas = 1;
        $appointment->state = "complete";
        if ($appointment->professional_id == $appointment->given) {
          //user accept request if professional book appointment for user.
          //send to professional
          $viewer = Engine_Api::_()->user()->getViewer();
          $object_id = Engine_Api::_()->getItem('user', $appointment->professional_id);
          $appointmentUrl = '<a href='."{$this->view->url(array('action'=>'appointments'),'booking_general',true)}#given".'>'.$viewer->displayname.'</a>';
          Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($object_id, $viewer, $viewer, 'booking_profacceptuserreq',array('appointmentUrl'=>$appointmentUrl));
          Engine_Api::_()->getApi('mail', 'core')->sendSystem(
            $object_id,
            'booking_profacceptuserreq',
            array(
              'host' => $_SERVER['HTTP_HOST'],
              'professional_name' => $object_id->displayname,
              'queue' => false,
              'recipient_title' => $viewer->displayname,
            )
          );
        } else {
          //professional accept request if someone has book professional serivce.
          //send to user
          $viewer = Engine_Api::_()->user()->getViewer();
          $object_id = Engine_Api::_()->getItem('user', $appointment->user_id);
          $servicename = Engine_Api::_()->getItem('booking_service', $appointment->service_id);
          $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId( $appointment->professional_id); 
          $appointmentUrl = '<a href='."{$this->view->url(array('action'=>'appointments'),'booking_general',true)}#taken".'>'.$professional->name.'</a>';
          Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($object_id, $viewer, $viewer, 'booking_useracceptprofreq',array('appointmentUrl'=>$appointmentUrl));
          $var = Engine_Api::_()->getApi('mail', 'core')->sendSystem(
            $object_id,
            'booking_useracceptprofreq',
            array(
              'host' => $_SERVER['HTTP_HOST'],
              'member_name' => $object_id->displayname,
              'queue' => false,
              'recipient_title' => $viewer->displayname,
              'object_link' => $servicename->getHref(),
            )
          );
        }
      }
      if ($completed) {
        $appointment = Engine_Api::_()->getItem('booking_appointment', $completed);
        $appointment->action = "completed";
      }
      if ($reject) {
        $appointment = Engine_Api::_()->getItem('booking_appointment', $reject);
        $appointment->action = "reject";
        if ($appointment->professional_id == $appointment->given) {
          //user accept request if professional book appointment for user.
          //send to professional
          $viewer = Engine_Api::_()->user()->getViewer();
          $object_id = Engine_Api::_()->getItem('user', $appointment->professional_id);
          $appointmentUrl = '<a href='."{$this->view->url(array('action'=>'appointments'),'booking_general',true)}#reject".'>'.$viewer->displayname.'</a>';
          Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($object_id, $viewer, $viewer, 'booking_profrejectuserreq',array('appointmentUrl'=>$appointmentUrl));
          Engine_Api::_()->getApi('mail', 'core')->sendSystem(
            $object_id,
            'booking_profrejectuserreq',
            array(
              'host' => $_SERVER['HTTP_HOST'],
              'professional_name' => $object_id->displayname,
              'queue' => false,
              'recipient_title' => $viewer->displayname,
            )
          );
        } else {
          //professional reject request if someone has book professional serivce.
          //send to user
          $viewer = Engine_Api::_()->user()->getViewer();
          $object_id = Engine_Api::_()->getItem('user', $appointment->user_id);
          $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($appointment->professional_id); 
          $appointmentUrl = '<a href='."{$this->view->url(array('action'=>'appointments'),'booking_general',true)}#reject".'>'.$professional->name.'</a>';
          Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($object_id, $viewer, $viewer, 'booking_userrejectprofreq',array('appointmentUrl'=>$appointmentUrl));
          Engine_Api::_()->getApi('mail', 'core')->sendSystem(
            $object_id,
            'booking_userrejectprofreq',
            array(
              'host' => $_SERVER['HTTP_HOST'],
              'member_name' => $object_id->displayname,
              'queue' => false,
              'recipient_title' => $viewer->displayname,
            )
          );
        }
      }
      if ($block) {
        $appointment = Engine_Api::_()->getItem('booking_appointment', $block);
        $appointment->block = 1;
      }
      if ($cancel) {
        //user accept request if professional book appointment for user.
        $appointment = Engine_Api::_()->getItem('booking_appointment', $cancel);
        $appointment->action = "cancelled";
        if ($appointment->professional_id == $appointment->given) {
          $viewer = Engine_Api::_()->user()->getViewer();
          $object_id = Engine_Api::_()->getItem('user', $appointment->user_id);
          $appointmentUrl = '<a href='."{$this->view->url(array('action'=>'appointments'),'booking_general',true)}#cancelled".'>'.$viewer->displayname.'</a>';
          Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($object_id, $viewer, $viewer, 'booking_profcanceluserreq',array('appointmentUrl'=>$appointmentUrl));
          Engine_Api::_()->getApi('mail', 'core')->sendSystem(
            $object_id,
            'booking_profcanceluserreq',
            array(
              'host' => $_SERVER['HTTP_HOST'],
              'professional_name' => $object_id->displayname,
              'queue' => false,
              'recipient_title' => $viewer->displayname,
            )
          );
        } else {
          //professional reject request if someone has book his serivces.
          $viewer = Engine_Api::_()->user()->getViewer();
          $object_id = Engine_Api::_()->getItem('user', $appointment->professional_id);
          $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($appointment->professional_id); 
          $appointmentUrl = '<a href='."{$this->view->url(array('action'=>'appointments'),'booking_general',true)}#cancelled".'>'.$professional->name.'</a>';
          Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($object_id, $viewer, $viewer, 'booking_usercancelprofreq');
          Engine_Api::_()->getApi('mail', 'core')->sendSystem(
            $object_id,
            'booking_usercancelprofreq',
            array(
              'host' => $_SERVER['HTTP_HOST'],
              'member_name' => $object_id->displayname,
              'queue' => false,
              'recipient_title' => $viewer->displayname,
            )
          );
        }
      }
      if ($unblock) {
        $appointment = Engine_Api::_()->getItem('booking_appointment', $unblock);
        $appointment->block = 0;
      }
      $appointment->save();
      if ($accept) {
        if ($appointment->professional_id == $appointment->given) {
          $settings = Engine_Api::_()->getApi('settings', 'core');
          if($settings->getSetting('booking.allow.for', 1))
          return $this->_forward('success', 'utility', 'core', array(
            'parentRedirect' => Zend_Controller_Front::getInstance()->getRouter()->assemble(array('module' => 'booking', 'controller' => 'order', 'action' => 'index', 'professional_id' => $this->_getParam("professional_id"), 'order_id' => $this->_getParam("order_id")), 'default', true),
            'messages' => array('Wait redirect to payment gateway.')
          ));
        }
      }
      return $this->_forward('success', 'utility', 'core', array(
        'smoothboxClose' => 10,
        'parentRefresh' => 10,
        'messages' => array('You have successfully delete client.')
      ));
    }
  }

  public function createProfessionalAction()
  {
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $deletedProfessionalsTable = Engine_Api::_()->getDbTable('deletedprofessionals', 'booking')->getUnactiveProfessionals($viewerId);
    if($viewerId == $deletedProfessionalsTable){
      $this->renderScript('_professional-reenable.tpl');
    }
    $this->view->form = $form = new Booking_Form_Becomeprofessional();
    if ($this->getRequest()->isPost() && $form->isValid($this->_getAllParams())) {
      $formValues = $form->getValues();
      $db = Engine_Api::_()->getDbTable('professionals', 'booking')->getAdapter();
      $db->beginTransaction();
      try {
        $professionalsTable = Engine_Api::_()->getDbTable('professionals', 'booking');
        $professionals = $professionalsTable->createRow();
        $formValues['user_id'] = $viewerId;
        $formValues['available'] = 1;
        if (Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'profapprove'))
          $formValues['active'] = 1;
        $professionals->setFromArray($formValues);
        $professionals->save();
        if (!empty($_FILES["file_id"]['name']) && !empty($_FILES["file_id"]['size'])) {
          $professionals->file_id = $professionals->setPhoto($form->file_id);
        }
        $professionals->save();
        $db->commit();

        /* save location of professional in sesbasic_location table */
        if (!empty($formValues['location'])) {
          //location not empty
          $sesbasiclocationTable = Engine_Api::_()->getDbTable('locations', 'sesbasic');
          $dbsesbasiclocation = $sesbasiclocationTable->getAdapter();
          $dbsesbasiclocation->beginTransaction();
          $sesbasiclocation = $sesbasiclocationTable->createRow();
          $locationValues['resource_id'] = $professionals->getIdentity();
          $locationValues['lat'] = $formValues['lat'];
          $locationValues['lng'] = $formValues['lng'];
          $locationValues['resource_type'] = 'professional';
          $sesbasiclocation->setFromArray($locationValues);
          $sesbasiclocation->save();
          $dbsesbasiclocation->commit();
        }
        /* end sesbasic_location Transaction */

        //set authorization member who become professional                
        $auth = Engine_Api::_()->authorization()->context;
        $roles = array('owner', 'member', 'owner_member', 'owner_member_member', 'owner_network', 'registered', 'everyone');
        if (empty($values['auth_view'])) {
          $values['view'] = 'everyone';
        }
        $viewMax = array_search($values['view'], $roles);

        foreach ($roles as $i => $role) {
          //item type professional
          $auth->setAllowed($professionals, $role, 'view', ($i <= $viewMax));
        }
        //end authorization
        // if member setting are "No" selected then notification and mail go from this end.
        if (Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'profapprove') == 0) {
          //notifcation & mail for admin approval
          $getAdminnSuperAdmins = Engine_Api::_()->booking()->getAdminSuperAdmins();
          foreach ($getAdminnSuperAdmins as $getAdminnSuperAdmin) {
            $user = Engine_Api::_()->getItem('user', $getAdminnSuperAdmin['user_id']);
            Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($user, $viewer, $professionals, 'booking_adminprofapl');
            Engine_Api::_()->getApi('mail', 'core')->sendSystem(
              $user,
              'booking_adminprofapl',
              array(
                'host' => $_SERVER['HTTP_HOST'],
                'professional_name' => $professionals->name,
                'queue' => false,
                'recipient_title' => $viewer->displayname,
                'object_link' => $professionals->getHref(),
              )
            );
          }
          //end notifcation & mail
        }
        // if member setting are "yes" selected then notification and mail go from this end.
        if (Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'profapprove') == 1) {
          //notifcation & mail for admin approval 
          $getAdminnSuperAdmins = Engine_Api::_()->booking()->getAdminSuperAdmins();
          foreach ($getAdminnSuperAdmins as $getAdminnSuperAdmin) {
            $user = Engine_Api::_()->getItem('user', $getAdminnSuperAdmin['user_id']);
            Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($user, $viewer, $professionals, 'booking_profautoapl');
            Engine_Api::_()->getApi('mail', 'core')->sendSystem(
              $user,
              'booking_profautoapl',
              array(
                'host' => $_SERVER['HTTP_HOST'],
                'professional_name' => $professionals->name,
                'queue' => false,
                'recipient_title' => $viewer->displayname,
                'object_link' => $professionals->getHref(),
              )
            );
          }
          //end notifcation & mail
        }

        return $this->_forward('success', 'utility', 'core', array(
          'parentRedirect' => Zend_Controller_Front::getInstance()->getRouter()->assemble(array('professional_id' => $professionals->getIdentity()), 'professional_profile', true),
          'messages' => array(Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'profapprove')
            ? 'Your professional profile saved successfully'
            : 'Your professional profile saved successfully. Wait for admin approval.')
        ));
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    }
  }

  public function professionalEnableAction()
  {
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $db = Engine_Db_Table::getDefaultAdapter();
    $db->query("DELETE FROM `engine4_booking_deletedprofessionals` WHERE `engine4_booking_deletedprofessionals`.`user_id` = " . $viewerId );
    $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($viewerId);
    $professional = Engine_Api::_()->getItem('professional',$professional->professional_id);
    if($professional){
      $professional->is_deleted = 0;
      $professional->save();
    }
    return $this->_forward('success', 'utility', 'core', array(
      'parentRedirect' => Zend_Controller_Front::getInstance()->getRouter()->assemble(array('route' => 'default','module' => 'booking', 'controller' => 'index', 'action' => 'settings'),'booking_general',true),
      'messages' => array($this->view->translate('You have successfully enabled your Professional profile.'))
    ));
  }

  public function settingsAction()
  {
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $levelId = ($viewerId) ? $viewer->level_id : Engine_Api::_()->getDbtable('levels', 'authorization')->getPublicLevel()->level_id;
    if ($levelId == 5)
      return $this->_forward('notfound', 'error', 'core');
    $this->_helper->content->setEnabled();
  }

  public function createServiceAction()
  {
    $viewer = Engine_Api::_()->user()->getViewer();
    $service_id = $this->_getParam('service_id');
    $user_id = $this->_getParam('user_id');
    $this->_helper->layout->setLayout('default-simple');
    $this->view->form = $form = new Booking_Form_Service();
    if ($service_id) {
      $db = Zend_Db_Table_Abstract::getDefaultAdapter();
      $service = Engine_Api::_()->getItem('booking_service', $service_id);
      $form->populate($service->toArray());
      $form->file_id->setRequired(false);
      $form->submit->setLabel('Save Changes');
      $form->setTitle('Edit Service');
    }
    if (isset($service->category_id) && $service->category_id != 0)
      $this->view->category_id = $service->category_id;
    else if (isset($_POST['category_id']) && $_POST['category_id'] != 0)
      $this->view->category_id = $_POST['category_id'];
    else
      $this->view->category_id = 0;
    if (isset($service->subsubcat_id) && $service->subsubcat_id != 0)
      $this->view->subsubcat_id = $service->subsubcat_id;
    else if (isset($_POST['subsubcat_id']) && $_POST['subsubcat_id'] != 0)
      $this->view->subsubcat_id = $_POST['subsubcat_id'];
    else
      $this->view->subsubcat_id = 0;
    if (isset($service->subcat_id) && $service->subcat_id != 0)
      $this->view->subcat_id = $service->subcat_id;
    else if (isset($_POST['subcat_id']) && $_POST['subcat_id'] != 0)
      $this->view->subcat_id = $_POST['subcat_id'];
    else
      $this->view->subcat_id = 0;
    if ($this->getRequest()->isPost() && $form->isValid($this->_getAllParams())) {
      if (!Engine_Api::_()->booking()->isValidFloatAndIntegerValue($_POST["price"])) {
        $form->addError("Please enter valid price.");
        return;
      }
      if (empty($_FILES['file_id']['name'])) {
        $form->addError('Please upload photo - it is required.');
        return;
      }
      $values = $form->getValues();
      $db = Engine_Api::_()->getDbTable('services', 'booking')->getAdapter();
      $db->beginTransaction();
      try {
        $viewerId = $viewer->getIdentity();
        $settingsTable = Engine_Api::_()->getDbTable('services', 'booking');
        if (!$service_id) {
          $service = $settingsTable->createRow();
        }
        $values['price'] = round($values['price'], 2);
        if ($user_id)
          $viewerId = $user_id;
        $values['user_id'] = $viewerId;
        if (Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'servapprove'))
          $values['active'] = 1;
        if($service_id)
          $values['file_id'] = $service->file_id;
        $service->setFromArray($values);
        $service->save();
        if (!empty($_FILES["file_id"]['name']) && !empty($_FILES["file_id"]['size'])) {
          $service->file_id = $service->setPhoto($form->file_id);
        }
        $service->save();
        $db->commit();

        //set authorization on service created by professional
        $auth = Engine_Api::_()->authorization()->context;
        $roles = array('owner', 'member', 'owner_member', 'owner_member_member', 'owner_network', 'registered', 'everyone');
        if (empty($values['auth_view'])) {
          $values['view'] = 'everyone';
        }
        $viewMax = array_search($values['view'], $roles);

        foreach ($roles as $i => $role) {
          //item type booking_service
          $auth->setAllowed($service, $role, 'view', ($i <= $viewMax));
        }
        //end authorization
        // if member setting for autoapprove set it no. then notification, mail and feeds goes this side.
        if (Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'servapprove') == 0) {
          //notifcation for approval by admin
          $getAdminSuperAdmins = Engine_Api::_()->booking()->getAdminSuperAdmins();
          foreach ($getAdminSuperAdmins as $getAdminSuperAdmin) {
            $user = Engine_Api::_()->getItem('user', $getAdminSuperAdmin['user_id']);
            $serviceName= '<a href="'.$this->view-> url(array('module' => 'booking', 'controller' => 'services',"action"=>'enabled','id'=>$service->getIdentity()),'admin_default',true).'">'.$service->getTitle().'</a>';
            Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($user, $viewer, $service, 'booking_adminserapl',array('servicename' => $serviceName));
            Engine_Api::_()->getApi('mail', 'core')->sendSystem(
              $user,
              'booking_adminserapl',
              array(
                'host' => $_SERVER['HTTP_HOST'],
                'service_name' => $service->name,
                'professional_name' => $service->getServiceProfessionalName(),
                'queue' => false,
                'recipient_title' => $viewer->displayname,
                'object_link' => $service->getHref(),
              )
            );
          }
          //end notifcation
        }

        // if member setting for autoapprove set it Yes. then notification, mail and feeds goes this side.
        if (Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'servapprove') == 1) {
          $getAdminSuperAdmins = Engine_Api::_()->booking()->getAdminSuperAdmins();
          foreach ($getAdminSuperAdmins as $getAdminSuperAdmin) {
            $user = Engine_Api::_()->getItem('user', $getAdminSuperAdmin['user_id']);
            Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($user, $viewer, $service, 'booking_servautoapl');
            Engine_Api::_()->getApi('mail', 'core')->sendSystem(
              $user,
              'booking_servautoapl',
              array(
                'host' => $_SERVER['HTTP_HOST'],
                'service_name' => $service->name,
                'professional_name' => $service->getServiceProfessionalName(),
                'queue' => false,
                'recipient_title' => $viewer->displayname,
                'object_link' => $service->getHref(),
              )
            );
          }
          //activity feed
          $activityApi = Engine_Api::_()->getDbtable('actions', 'activity');
          $action = $activityApi->addActivity($viewer, $service, 'booking_pro_serv_cre');
          if ($action)
            $activityApi->attachActivity($action, $service);
          //end activity feed
        }

        return $this->_forward('success', 'utility', 'core', array(
          'smoothboxClose' => true,
          'parentRefresh' => true,
          'format' => 'smoothbox',
          'messages' => array((Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'servapprove')) ? 'Service created successfully.' : 'Your service is waiting for approval')
        ));
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    }
  }

  public function deleteServiceAction()
  {
    $this->_helper->layout->setLayout('admin-simple');
    if($this->_getParam('service_id') && $this->_getParam('professional_id')){
      $dateInAppointments=Engine_Api::_()->getDbtable('appointments', 'booking')->isServiceInAppointments(array("professional_id"=>$this->_getParam('professional_id'),"service_id"=>$this->_getParam('service_id')));
      if($dateInAppointments['service_id']){
        $this->view->dateInAppointments = true;
      }
    }
    if ($this->getRequest()->isPost()) {
      $service = Engine_Api::_()->getItem('booking_service', $this->_getParam('service_id'));
      $service->delete();
      return $this->_forward('success', 'utility', 'core', array(
        'smoothboxClose' => 10,
        'parentRefresh' => 10,
        'messages' => array('You have successfully delete service.')
      ));
    }
  }

  public function contactAction()
  {
    $this->view->contact = $this->_getParam("contact");
    $this->_helper->layout->setLayout('default-simple');
  }

  //Get user paypal account details which he recived payment from admin
  public function accountDetailsAction()
  {
    //Set up navigation
    $this->view->form = $form = new Sesbasic_Form_PayPal();
  }
  
  function reviewVotesAction() {
    if (Engine_Api::_()->user()->getViewer()->getIdentity() == 0) {
      echo json_encode(array('status' => 'false', 'error' => 'Login'));
      die;
    }
    $item_id = $this->_getParam('id');
    $type = $this->_getParam('type');
    if (intval($item_id) == 0 || ($type != 1 && $type != 2 && $type != 3)) {
      echo json_encode(array('status' => 'false', 'error' => 'Invalid argument supplied.'));
      die;
    }
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewer_id = $viewer->getIdentity();
    $itemTable = Engine_Api::_()->getItemTable('booking_profreview');
    $tableVotes = Engine_Api::_()->getDbtable('reviewvotes', 'booking');
    $tableMainVotes = $tableVotes->info('name');
    $review = Engine_Api::_()->getItem('booking_profreview',$item_id);
    $select = $tableVotes->select()
    ->from($tableMainVotes)
    ->where('profreview_id = ?', $item_id)
    ->where('user_id = ?', $viewer_id)
    ->where('type =?', $type);
    $result = $tableVotes->fetchRow($select);
    if ($type == 1)
      $votesTitle = 'useful_count';
    else if ($type == 2)
      $votesTitle = 'funny_count';
    else
      $votesTitle = 'cool_count';

    if (count($result) > 0) {
            //delete
      $db = $result->getTable()->getAdapter();
      $db->beginTransaction();
      try {
        $result->delete();
        $itemTable->update(array($votesTitle => new Zend_Db_Expr($votesTitle . ' - 1')), array('profreview_id = ?' => $item_id));
        $db->commit();
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
      $selectReview = $itemTable->select()->where('profreview_id =?', $item_id);
      $review = $itemTable->fetchRow($selectReview);
      echo json_encode(array('status' => 'true', 'error' => '', 'condition' => 'reduced', 'count' => $review->{$votesTitle}));
      die;
    } else {
            //update
      $db = Engine_Api::_()->getDbTable('reviewvotes', 'booking')->getAdapter();
      $db->beginTransaction();
      try {
        $votereview = $tableVotes->createRow();
        $votereview->user_id = $viewer_id;
        $votereview->profreview_id = $item_id;
        $votereview->type = $type;
        $votereview->save();
        $itemTable->update(array($votesTitle => new Zend_Db_Expr($votesTitle . ' + 1')), array('profreview_id = ?' => $item_id));
        //Commit
        $db->commit();
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
      //Send notification and activity feed work.
      $selectReview = $itemTable->select()->where('profreview_id =?', $item_id);
      $review = $itemTable->fetchRow($selectReview);
      echo json_encode(array('status' => 'true', 'error' => '', 'condition' => 'increment', 'count' => $review->{$votesTitle}));
      die;
    }
  }
}
