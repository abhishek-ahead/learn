<?php

class Booking_DashboardController extends Core_Controller_Action_Standard
{

  public function init()
  {
    // if (!$this->_helper->requireAuth()->setAuthParams('sesevent_event', null, 'view')->isValid())
    //   return;
    // if (!$this->_helper->requireUser->isValid())
    //   return;
    // $viewer = Engine_Api::_()->user()->getViewer();
    if ($this->_getParam('professional_id', null))
      $user_id = $this->_getParam('professional_id', null);
    else
      $user_id = $viewer = Engine_Api::_()->user()->getViewer()->getIdentity();
    $this->view->professional = $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($user_id);
    if ($professional->professional_id) {
      Engine_Api::_()->core()->setSubject($professional);
    } else {
      return $this->_forward('requireauth', 'error', 'core');
    }
  }

  public function accountDetailsAction()
  {
    $is_ajax = $this->view->is_ajax = $this->_getParam('is_ajax', null) ? $this->_getParam('is_ajax') : false;
    $is_ajax_content = $this->view->is_ajax_content = $this->_getParam('is_ajax_content', null) ? $this->_getParam('is_ajax_content') : false;
    $viewer = Engine_Api::_()->user()->getViewer();
    $gateway_type = $this->view->gateway_type = $this->_getParam('gateway_type', "paypal");
    $this->view->event = $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($viewer->getIdentity());
    $userGateway = Engine_Api::_()->getDbtable('usergateways', 'booking')->getUserGateway(array('professional_id' => $professional->professional_id, 'gateway_type' => $gateway_type, 'enabled' => true));
    $settings = Engine_Api::_()->getApi('settings', 'core');
    $userGatewayEnable = $settings->getSetting('sesevent.userGateway', 'paypal');
    if ($gateway_type == "paypal") {
      $this->view->form = $form = new Booking_Form_Payment_PayPal();
      $gatewayTitle = 'Paypal';
      $gatewayClass = 'Booking_Plugin_Gateway_Booking_PayPal';
    } else if ($gateway_type == "stripe") {
      $userGatewayEnable = 'stripe';
      $this->view->form = $form = new Booking_Form_Payment_Stripe();
      $gatewayTitle = 'Stripe';
      $gatewayClass = 'Booking_Plugin_Gateway_Booking_Stripe';
    } else if ($gateway_type == "paytm") {
      $userGatewayEnable = 'paytm';
      $this->view->form = $form = new Booking_Form_Payment_Paytm();
      $gatewayTitle = 'Paytm';
      $gatewayClass = 'Booking_Plugin_Gateway_Booking_Paytm';
    }

    if (count($userGateway)) {
      $form->populate($userGateway->toArray());
      if (is_array($userGateway['config'])) {
        $form->populate($userGateway['config']);
      }
    }
    if (!$this->getRequest()->isPost())
      return;
    // Not post/invalid
    if (!$this->getRequest()->isPost() || $is_ajax_content)
      return;
    if (!$form->isValid($this->getRequest()->getPost()) || $is_ajax_content)
      return;
    // Process
    $values = $form->getValues();
    $enabled = (bool)$values['enabled'];
    unset($values['enabled']);
    $db = Engine_Db_Table::getDefaultAdapter();
    $db->beginTransaction();
    $userGatewayTable = Engine_Api::_()->getDbtable('usergateways', 'booking');
    // insert data to table if not exists
    try {
      if (!count($userGateway)) {
        $gatewayObject = $userGatewayTable->createRow();
        $gatewayObject->professional_id = $professional->professional_id;
        $gatewayObject->user_id = $viewer->getIdentity();
        $gatewayObject->title = $gatewayTitle;
        $gatewayObject->plugin = $gatewayClass;
        $gatewayObject->test_mode = isset($values['test_mode']) ? $values['test_mode'] : 1;
        $gatewayObject->gateway_type = $gateway_type;
        $gatewayObject->save();
      } else {
        $gatewayObject = Engine_Api::_()->getItem("booking_usergateway", $userGateway['usergateway_id']);
        $gatewayObject->test_mode = isset($values['test_mode']) ? $values['test_mode'] : 1;
      }
      $db->commit();
    } catch (Exception $e) {
      echo $e->getMessage();
    }
    // Validate gateway config
    if ($enabled) {
      $gatewayObjectObj = $gatewayObject->getGateway($userGateway->plugin);
      try {
        $gatewayObjectObj->setConfig($values);
        $response = $gatewayObjectObj->test();
      } catch (Exception $e) {
        $enabled = false;
        $form->populate(array('enabled' => false));
        $form->addError(sprintf('Gateway login failed. Please double check ' .
          'your connection information. The gateway has been disabled. ' .
          'The message was: [%2$d] %1$s', $e->getMessage(), $e->getCode()));
      }
    } else {
      $form->addError('Gateway is currently disabled.');
    }
    // Process
    $message = null;
    try {
      $values = $gatewayObject->getPlugin()->processAdminGatewayForm($values);
    } catch (Exception $e) {
      $message = $e->getMessage();
      $values = null;
    }
    if (null !== $values) {
      $gatewayObject->setFromArray(array(
        'enabled' => $enabled,
        'config' => $values,
      ));
      $gatewayObject->save();
      $form->addNotice('Changes saved.');
    } else {
      $form->addError($message);
    }
  }

  //get payment to admin information
  public function paymentRequestsAction()
  {
    $is_ajax = $this->view->is_ajax = $this->_getParam('is_ajax', null) ? $this->_getParam('is_ajax') : false;
    $is_ajax_content = $this->view->is_ajax_content = $this->_getParam('is_ajax_content', null) ? $this->_getParam('is_ajax_content') : false;
    $this->view->professional = $professional = Engine_Api::_()->core()->getSubject();
    $viewer = Engine_Api::_()->user()->getViewer();
    $this->view->thresholdAmount = Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'threshold_amount');
    //get total amount of professional.
    $this->view->userGateway = Engine_Api::_()->getDbtable('usergateways', 'booking')->getUserGateway(array('professional_id' => $professional->professional_id, 'user_id' => $viewer->user_id));
    $this->view->orderDetails = Engine_Api::_()->getDbtable('orders', 'booking')->getProfessionalStats(array('professional_id' => $professional->user_id));
    //get ramaining amount
    $remainingAmount = Engine_Api::_()->getDbtable('remainingpayments', 'booking')->getProfessionalRemainingAmount(array('professional_id' => $professional->user_id));
    if (!$remainingAmount) {
      $this->view->remainingAmount = 0;
    } else
      $this->view->remainingAmount = $remainingAmount->remaining_payment;
    $this->view->isAlreadyRequests = Engine_Api::_()->getDbtable('userpayrequests', 'booking')->getPaymentRequests(array('professional_id' => $professional->user_id, 'isPending' => true));
    $this->view->paymentRequests = Engine_Api::_()->getDbtable('userpayrequests', 'booking')->getPaymentRequests(array('professional_id' => $professional->user_id, 'isPending' => true));
  }

  public function paymentRequestAction()
  {
    $is_ajax = $this->view->is_ajax = $this->_getParam('is_ajax', null) ? $this->_getParam('is_ajax') : false;
    $is_ajax_content = $this->view->is_ajax_content = $this->_getParam('is_ajax_content', null) ? $this->_getParam('is_ajax_content') : false;
    $this->view->event = $professional = Engine_Api::_()->core()->getSubject();
    // $viewer = Engine_Api::_()->user()->getViewer();
    // if (!($this->_helper->requireAuth()->setAuthParams(null, null, 'edit')->isValid() || $professional->isOwner($viewer)))
    //   return;
    $viewer = Engine_Api::_()->user()->getViewer();
    $this->view->thresholdAmount = $thresholdAmount = Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'threshold_amount');
    //get remaining amount
    $remainingAmount = Engine_Api::_()->getDbtable('remainingpayments', 'booking')->getProfessionalRemainingAmount(array('professional_id' => $professional->user_id));
    if (!$remainingAmount) {
      $this->view->remainingAmount = 0;
    } else {
      $this->view->remainingAmount = $remainingAmount->remaining_payment;
    }
    $defaultCurrency = Engine_Api::_()->booking()->defaultCurrency();
    $orderDetails = Engine_Api::_()->getDbtable('orders', 'booking')->getProfessionalStats(array('professional_id' => $professional->user_id));
    $this->view->form = $form = new Booking_Form_Dashboard_Paymentrequest();
    $value = array();
    $value['total_amount'] = Engine_Api::_()->booking()->getCurrencyPrice($orderDetails['totalAmountSale'], $defaultCurrency);
    $value['total_tax_amount'] = Engine_Api::_()->booking()->getCurrencyPrice($orderDetails['totalTaxAmount'], $defaultCurrency);
    $value['total_commission_amount'] = Engine_Api::_()->booking()->getCurrencyPrice($orderDetails['commission_amount'], $defaultCurrency);
    $value['remaining_amount'] = Engine_Api::_()->booking()->getCurrencyPrice($remainingAmount->remaining_payment, $defaultCurrency);
    $value['requested_amount'] = round($remainingAmount->remaining_payment, 2);
    //set value to form
    if ($this->_getParam('id', false)) {
      $item = Engine_Api::_()->getItem('booking_userpayrequest', $this->_getParam('id'));
      if ($item) {
        $itemValue = $item->toArray();
        $value = array_merge($itemValue, $value);
      } else {
        return $this->_forward('requireauth', 'error', 'core');
      }
    }
    if (empty($_POST))
      $form->populate($value);

    if (!$this->getRequest()->isPost())
      return;
    if (!$form->isValid($this->getRequest()->getPost()))
      return;
    if (@round($thresholdAmount, 2) > @round($remainingAmount->remaining_payment, 2) && empty($_POST)) {
      $this->view->message = 'Remaining amount is less than Threshold amount.';
      $this->view->errorMessage = true;
      return;
    } else if (isset($_POST['requested_amount']) && @round($_POST['requested_amount'], 2) > @round($remainingAmount->remaining_payment, 2)) {
      $form->addError('Requested amount must be less than or equal to remaining amount.');
      return;
    } else if (isset($_POST['requested_amount']) && @round($thresholdAmount) > @round($_POST['requested_amount'], 2)) {
      $form->addError('Requested amount must be greater than or equal to threshold amount.');
      return;
    }

    $db = Engine_Api::_()->getDbtable('userpayrequests', 'booking')->getAdapter();
    $db->beginTransaction();
    try {
      $tableOrder = Engine_Api::_()->getDbtable('userpayrequests', 'booking');
      if (isset($itemValue))
        $order = $item;
      else
        $order = $tableOrder->createRow();
      $order->requested_amount = round($_POST['requested_amount'], 2);
      $order->user_message = $_POST['user_message'];
      $order->professional_id = $professional->user_id;
      $order->owner_id = $viewer->getIdentity();
      $order->user_message = $_POST['user_message'];
      $order->creation_date = date('Y-m-d h:i:s');
      $order->currency_symbol = $defaultCurrency;
      $settings = Engine_Api::_()->getApi('settings', 'core');
      $userGatewayEnable = $settings->getSetting('booking.userGateway', 'paypal');
      $order->save();
      $db->commit();

      //Payment request mail send to admin
      $getAdminnSuperAdmins = Engine_Api::_()->booking()->getAdminSuperAdmins();
      foreach ($getAdminnSuperAdmins as $getAdminnSuperAdmin) {
        $user = Engine_Api::_()->getItem('user', $getAdminnSuperAdmin['user_id']);
        $defaultCurrency = Engine_Api::_()->booking()->defaultCurrency();
        $adminManagePaymentUrl= '<a href="'.$this->view-> url(array('module' => 'booking', 'controller' => 'manage-orders',"action"=>'approve','professional_id'=>$professional->user_id,'id'=>$order->getIdentity()),'admin_default',true).'"></a>';
        Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($user, $viewer, $professional, 'booking_profpayment_request',array('requestAmount' => Engine_Api::_()->booking()->getCurrencyPrice(round($_POST['requested_amount'], 2),$defaultCurrency),'adminApproveUrl'=>$adminManagePaymentUrl));
        Engine_Api::_()->getApi('mail', 'core')->sendSystem(
          $user,
          'booking_profpayment_request',
          array(
            'host' => $_SERVER['HTTP_HOST'],
            'professional_name' => $professional->name,
            'queue' => false,
            'recipient_title' => $viewer->displayname,
            'object_link' => $professional->getHref(),
          )
        );
      }

      $this->view->status = true;
      $this->view->message = Zend_Registry::get('Zend_Translate')->_('Payment request send successfully.');
      return $this->_forward('success', 'utility', 'core', array(
        'smoothboxClose' => 10,
        'parentRefresh' => 10,
        'messages' => array($this->view->message)
      ));
    } catch (Exception $e) {
      $db->rollBack();
      throw $e;
    }
  }

  //delete payment request
  public function deletePaymentAction()
  {
    $this->view->professional = $professional = Engine_Api::_()->core()->getSubject();
    $paymnetReq = Engine_Api::_()->getItem('booking_userpayrequest', $this->getRequest()->getParam('id'));

    // $viewer = Engine_Api::_()->user()->getViewer();
    // if (!$this->_helper->requireAuth()->setAuthParams($professional, null, 'delete')->isValid())
    //   return;

    // In smoothbox
    $this->_helper->layout->setLayout('default-simple');

    // Make form
    $this->view->form = $form = new Sesbasic_Form_Delete();
    $form->setTitle('Delete Payment Request?');
    $form->setDescription('Are you sure that you want to delete this payment request? It will not be recoverable after being deleted.');
    $form->submit->setLabel('Delete');

    if (!$paymnetReq) {
      $this->view->status = false;
      $this->view->error = Zend_Registry::get('Zend_Translate')->_("Paymnet request doesn't exists or not authorized to delete");
      return;
    }

    if (!$this->getRequest()->isPost()) {
      $this->view->status = false;
      $this->view->error = Zend_Registry::get('Zend_Translate')->_('Invalid request method');
      return;
    }

    $db = $paymnetReq->getTable()->getAdapter();
    $db->beginTransaction();

    try {
      $paymnetReq->delete();
      $db->commit();
    } catch (Exception $e) {
      $db->rollBack();
      throw $e;
    }

    $this->view->status = true;
    $this->view->message = Zend_Registry::get('Zend_Translate')->_('Payment Request has been deleted.');
    return $this->_forward('success', 'utility', 'core', array(
      'smoothboxClose' => 10,
      'parentRefresh' => 10,
      'messages' => array($this->view->message)
    ));
  }

  //get paymnet detail
  public function detailPaymentAction()
  {
    $this->view->professional = $professional = Engine_Api::_()->core()->getSubject();
    $this->view->item = $paymnetReq = Engine_Api::_()->getItem('booking_userpayrequest', $this->getRequest()->getParam('id'));
    $this->view->viewer = Engine_Api::_()->user()->getViewer();
    // if (!$this->_helper->requireAuth()->setAuthParams($professional, null, 'edit')->isValid())
    //   return;

    if (!$paymnetReq) {
      $this->view->status = false;
      $this->view->error = Zend_Registry::get('Zend_Translate')->_("Paymnet request doesn't exists or not authorized to delete");
      return;
    }
  }

  public function paymentTransactionAction()
  {

    $is_ajax = $this->view->is_ajax = $this->_getParam('is_ajax', null) ? $this->_getParam('is_ajax') : false;

    $is_ajax_content = $this->view->is_ajax_content = $this->_getParam('is_ajax_content', null) ? $this->_getParam('is_ajax_content') : false;

    $this->view->professional = $professional = Engine_Api::_()->core()->getSubject();

    $viewer = Engine_Api::_()->user()->getViewer();
    // if (!Engine_Api::_()->getDbtable('modules', 'core')->isModuleEnabled('seseventticket') || !Engine_Api::_()->getApi('settings', 'core')->getSetting('seseventticket.pluginactivated')) {
    //   return $this->_forward('notfound', 'error', 'core');
    // }
    // if (!($this->_helper->requireAuth()->setAuthParams(null, null, 'edit')->isValid() || $event->isOwner($viewer)))
    //   return;

    $this->view->paymentRequests = Engine_Api::_()->getDbtable('userpayrequests', 'booking')->getPaymentRequests(array('professional_id' => $professional->user_id, 'state' => 'complete'));
  }

  public function mySettingsAction()
  {
    $is_ajax = $this->view->is_ajax = $this->_getParam('is_ajax', null) ? $this->_getParam('is_ajax') : false;
    $is_ajax_content = $this->view->is_ajax_content = $this->_getParam('is_ajax_content', null) ? $this->_getParam('is_ajax_content') : false;
    $professional = Engine_Api::_()->core()->getSubject();
    $professionalTable = Engine_Api::_()->getDbtable('professionals', 'booking');
    $professionalData = $professionalTable->select()->from($professionalTable->info('name'), array('*'))->where("user_id =?", $professional->user_id);
    $this->view->data = $data = $professionalTable->fetchRow($professionalData);
    $this->view->professionalItemId = $data['professional_id'];
    if (!$data->file_id) :
      $imgSrc = Zend_Registry::get('StaticBaseUrl') . "application/modules/Booking/externals/images/nophoto_user_thumb_profile.png";
    else :
      $imgSrc = Engine_Api::_()->storage()->get($data->file_id, '')->getPhotoUrl('thumb.profile');
    endif;
    $this->view->settings = $settingsForm = new Booking_Form_EditProfessional(array("updatePro" => $data['location'], "imgSrc" => $imgSrc));
    $settingsForm->populate($data->toArray());

    if (!$this->getRequest()->isPost())
      return;
    // Not post/invalid
    if (!$this->getRequest()->isPost() || $is_ajax_content)
      return;
    if (!$settingsForm->isValid($this->getRequest()->getPost()) || $is_ajax_content)
      return;
    $values = $settingsForm->getValues();
    $professionalDbItem = Engine_Api::_()->getItem('professional', $data['professional_id']);
    $professionalDbItem->available = $values["available"];
    $professionalDbItem->name = $_POST['name'];
    $professionalDbItem->designation = $_POST['designation'];
    $professionalDbItem->location = $_POST['location'];
    $professionalDbItem->country_code = $_POST['country_code'];
    $professionalDbItem->phone_number = $_POST['phone_number'];
    $professionalDbItem->timezone = $_POST['timezone'];
    $professionalDbItem->description = $_POST['description'];
    if (!empty($_FILES["file_id"]['name']) && !empty($_FILES["file_id"]['size'])) {
      $professionalDbItem->file_id =   $professionalDbItem->setPhoto($settingsForm->file_id);
    }
    $professionalDbItem->save();
  }
}
