<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Sescrowdfunding
 * @package    Sescrowdfunding
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: AdminManageOrdersController.php  2019-01-08 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */

class Booking_AdminManageOrdersController extends Core_Controller_Action_Admin
{

  public function indexAction()
  {

    $settings = Engine_Api::_()->getApi('settings', 'core');
    if(!$settings->getSetting('booking.paymode'))
      return $this->_forward('notfound', 'error', 'core');
    $this->view->navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_manageorders');
    $this->view->subNavigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_manageorders', array(), 'booking_admin_main_manageordersub');

    $this->view->formFilter = $formFilter = new Booking_Form_Admin_Filterpaymentorder();
    $values = array();
    if ($formFilter->isValid($this->_getAllParams()))
      $values = $formFilter->getValues();
    $paymentTable = Engine_Api::_()->getItemTable('booking_userpayrequest');
    $paymentTableName = $paymentTable->info('name');
    $professionalTableName = Engine_Api::_()->getItemTable('professional')->info('name');
    $tableUserName = Engine_Api::_()->getItemTable('user')->info('name');
    $select = $paymentTable->select()
      ->from($paymentTableName)
      ->where('state =?', 'pending')
      ->setIntegrityCheck(false)
      ->joinLeft($professionalTableName, "$paymentTableName.owner_id = $professionalTableName.user_id", 'name')
      ->where($professionalTableName . '.user_id !=?', '')
      ->joinLeft($tableUserName, "$paymentTableName.owner_id = $tableUserName.user_id", 'username')
      ->order('creation_date DESC');

    if (!empty($_GET['owner_name']))
      $select->where($tableUserName . '.displayname LIKE ?', '%' . $_GET['owner_name'] . '%');
    if (!empty($_GET['creation_date']))
      $select->where($paymentTableName . '.creation_date LIKE ?', $_GET['creation_date'] . '%');
    // if (!empty($_GET['event']))
    //   $select->where($professionalTableName . '.title LIKE ?', '%' . $_GET['event'] . '%');
    if (!empty($_GET['amount']))
      $select->where($paymentTableName . '.requested_amount LIKE ?', '%' . $_GET['amount'] . '%');

    $paginator = Zend_Paginator::factory($select);
    $this->view->paginator = $paginator;
    $paginator->setItemCountPerPage(100);
    $paginator->setCurrentPageNumber($this->_getParam('page', 1));
  }

  public function approveAction()
  {
    // $this->view->professional = $professional = Engine_Api::_()->getItem('professional', $this->getRequest()->getParam('professional_id'));
    $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($this->getRequest()->getParam('professional_id'));
    if (!$professional) {
      return $this->_forward('requireauth', 'error', 'core');
    }
    $paymnetReq = Engine_Api::_()->getItem('booking_userpayrequest', $this->getRequest()->getParam('id'));
    // In smoothbox
    $this->_helper->layout->setLayout('admin-simple');
    $gateway_enable = Engine_Api::_()->getDbtable('usergateways', 'booking')->getUserGateway(array('professional_id' => $professional->professional_id));
    if (empty($gateway_enable)) {
      $this->view->disable_gateway = true;
    } else {
      $this->view->disable_gateway = false;
      // Make form
      $this->view->form = $form = new Booking_Form_Admin_Payment_Approve(array('professionalId'=>$professional->professional_id));
      $defaultCurrency = Engine_Api::_()->booking()->defaultCurrency();
      $remainingAmount  =  Engine_Api::_()->getDbtable('remainingpayments', 'booking')->getProfessionalRemainingAmount(array('professional_id' => $professional->user_id));
      $orderDetails  =  Engine_Api::_()->getDbtable('orders', 'booking')->getProfessionalStats(array('professional_id' => $professional->user_id));
      $value = array();
      $value['total_amount'] = Engine_Api::_()->booking()->getCurrencyPrice($orderDetails['totalAmountSale'], $defaultCurrency);
      $value['total_tax_amount'] = Engine_Api::_()->booking()->getCurrencyPrice($orderDetails['totalTaxAmount'], $defaultCurrency);
      $value['total_commission_amount'] = Engine_Api::_()->booking()->getCurrencyPrice($orderDetails['commission_amount'], $defaultCurrency);
      $value['remaining_amount'] = Engine_Api::_()->booking()->getCurrencyPrice($remainingAmount->remaining_payment, $defaultCurrency);
      //set value to form
      if ($this->_getParam('id', false)) {
        $item = Engine_Api::_()->getItem('booking_userpayrequest', $this->_getParam('id'));
        if ($item) {
          $itemValue = $item->toArray();
          $value = array_merge($itemValue, $value);
          $value['requested_amount'] = Engine_Api::_()->booking()->getCurrencyPrice($itemValue['requested_amount'], $defaultCurrency);
          $value['release_amount'] = $itemValue['requested_amount'];
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
      if ($item->requested_amount < @round($_POST['release_amount'], 2)) {
        $form->addError('Release amount must be less than or equal to requested amount.');
        return;
      }
      $db = Engine_Api::_()->getDbtable('userpayrequests', 'booking')->getAdapter();
      $db->beginTransaction();
      try {
        $tableOrder = Engine_Api::_()->getDbtable('userpayrequests', 'booking');
        $order = $item;
        $order->release_amount = @round($_POST['release_amount'], 2);
        $order->admin_message = $_POST['admin_message'];
        $order->release_date   = date('Y-m-d h:i:s');
        $order->save();

        //Notification work
        $viewer = Engine_Api::_()->user()->getViewer();
        $owner = $professional->getOwner();
        Engine_Api::_()->getDbtable('notifications', 'activity')->addNotification($owner, $viewer, $professional, 'booking_professionalpayment_adminpaymentapprove', array());

        //Payment approve mail send to professional
        Engine_Api::_()->getApi('mail', 'core')->sendSystem($owner, 'booking_professionalpayment_adminrequestapproved', array('professional_name' => $professional->name, 'object_link' => $professional->getHref(), 'host' => $_SERVER['HTTP_HOST']));

        $db->commit();
        $session = new Zend_Session_Namespace();
        $session->payment_request_id = $order->userpayrequest_id;
        $this->view->status = true;
        $this->view->message = Zend_Registry::get('Zend_Translate')->_('Processing...');
        return $this->_forward('success', 'utility', 'core', array(
          'parentRedirect' => Zend_Controller_Front::getInstance()->getRouter()->assemble(array('route' => 'default','module' => 'booking', 'controller' => 'manage-orders', 'action' => 'process','gateway_id'=>$_POST['gateway_id']),'admin_default',true),
          'messages' => array($this->view->message)
        ));
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    }
  }

  public function processAction()
  {
    $session = new Zend_Session_Namespace();
    $viewer = Engine_Api::_()->user()->getViewer();
    if (!$session->payment_request_id)
      return $this->_forward('requireauth', 'error', 'core');
    $item = Engine_Api::_()->getItem('booking_userpayrequest', $session->payment_request_id);
    $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($item->owner_id);
    // Get gateway
    $gatewayId = $this->_getParam('gateway_id', null); 
		$gateway = Engine_Api::_()->getItem('booking_usergateway',$gatewayId);
    if (
      !$gatewayId ||
      !($gateway) ||
      !($gateway->enabled)
    ) {
      return $this->_helper->redirector->gotoRoute(array(), 'admin_default', true);
    }
    $this->view->gateway = $gateway;
    $this->view->gatewayPlugin = $gatewayPlugin = $gateway->getGateway();
    $plugin = $gateway->getPlugin();
    $ordersTable = Engine_Api::_()->getDbtable('orders', 'payment');
    // Process
    $ordersTable->insert(array(
      'user_id' => $viewer->getIdentity(),
      'gateway_id' => $gatewayId,
      'state' => 'pending',
      'creation_date' => new Zend_Db_Expr('NOW()'),
      'source_type' => 'booking_userpayrequest',
      'source_id' => $item->userpayrequest_id,
    ));
    $session = new Zend_Session_Namespace();
    $session->booking_order_id = $order_id = $ordersTable->getAdapter()->lastInsertId();
    $session->booking_item_id = $item->getIdentity();
    // Prepare host info
    $schema = 'http://';
    if (!empty($_ENV["HTTPS"]) && 'on' == strtolower($_ENV["HTTPS"])) {
      $schema = 'https://';
    }
    $host = $_SERVER['HTTP_HOST'];
    // Prepare transaction
    $params = array();
    $params['language'] = $viewer->language;
    $localeParts = explode('_', $viewer->language);
    if (count($localeParts) > 1) {
      $params['region'] = $localeParts[1];
    }
    $params['vendor_order_id'] = $order_id;
    $params['return_url'] = $schema . $host
      .  $this->view->url(array('action' => 'return', 'controller' => 'manage-orders', 'module' => 'booking'), 'admin_default', true)
      . '/?state=' . 'return&order_id=' . $order_id;
    $params['cancel_url'] = $schema . $host
      .  $this->view->url(array('action' => 'return', 'controller' => 'manage-orders', 'module' => 'booking'), 'admin_default', true)
      . '/?state=' . 'cancel&order_id=' . $order_id;
    $params['ipn_url'] = $schema . $host
      .  $this->view->url(array('action' => 'index', 'controller' => 'ipn', 'module' => 'manage-orders'), 'admin_default', true) . '&order_id=' . $order_id;
     // Process transaction
    if($gateway->plugin == "Booking_Plugin_Gateway_Booking_Stripe") {
        $params['currency'] = Engine_Api::_()->booking()->getCurrentCurrency();
        $this->view->publishKey = $gateway->config['sesadvpmnt_stripe_publish']; 
        $this->view->session =  $plugin->createOrderTransaction($item,$professional,$params);  
        $this->renderScript('/application/modules/Sesadvpmnt/views/scripts/payment/index.tpl');
    } elseif($gateway->plugin  == "Booking_Plugin_Gateway_Booking_Paytm") {
        $paytmParams = $plugin->createOrderTransaction($item,$professional,$params);
        $secretKey  = $gateway->config['paytm_secret_key'];
        $this->view->paytmParams = $paytmParams;
        $this->view->checksum = getChecksumFromArray($paytmParams, $secretKey);
        if($gateway->test_mode){
          $this->view->url = "https://securegw-stage.paytm.in/order/process";
        } else {
          $this->view->url = "https://securegw.paytm.in/merchant-status/getTxnStatus";
        }
        $this->renderScript('/application/modules/Epaytm/views/scripts/payment/index.tpl');
      } else {
        $transaction = $plugin->createOrderTransaction($item, $professional, $params);
        // Pull transaction params
        $this->view->transactionUrl = $transactionUrl = $gatewayPlugin->getGatewayUrl();
        $this->view->transactionMethod = $transactionMethod = $gatewayPlugin->getGatewayMethod();
        $this->view->transactionData = $transactionData = $transaction->getData();
      }
    // Handle redirection
    if ($transactionMethod == 'GET') {
      $transactionUrl .= '?' . http_build_query($transactionData);
      return $this->_helper->redirector->gotoUrl($transactionUrl, array('prependBase' => false));
    }
    // Post will be handled by the view script
  }



  public function returnAction()
  {
    $session = new Zend_Session_Namespace();
    // Get order
    $orderId = $this->_getParam('order_id', null);
    $orderPaymentId = $session->booking_order_id;
    $orderPayment = Engine_Api::_()->getItem('payment_order', $orderPaymentId);
    $item_id = $session->booking_item_id;
    $item = Engine_Api::_()->getItem('booking_userpayrequest', $item_id);
    if (
      !$orderPayment || ($orderId != $orderPaymentId) || ($orderPayment->source_type != 'booking_userpayrequest') ||
      !($user_order = $orderPayment->getSource())
    ) {
      return $this->_helper->redirector->gotoRoute(array(), 'admin_default', true);
    }
    $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($user_order->professional_id);
    $gateway = Engine_Api::_()->getItem('booking_usergateway',$orderPayment->gateway_id);
    if (!$gateway)
      return $this->_helper->redirector->gotoRoute(array(), 'admin_default', true);
    // Get gateway plugin
    $plugin = $gateway->getPlugin();
    unset($session->errorMessage);
    try {
      //get all params 
      $params = $this->_getAllParams();
      $status = $plugin->orderTransactionReturn($orderPayment, $params, $item);
    } catch (Payment_Model_Exception $e) {
      $status = 'failure';
      $session->errorMessage = $e->getMessage();
      throw $e;
    }
    return $this->_finishPayment($status, $orderPayment->source_id);
  }
  protected function _finishPayment($state = 'active', $orderPaymentId)
  {
    $session = new Zend_Session_Namespace();
    // Clear session
    $errorMessage = $session->errorMessage;
    $session->errorMessage = $errorMessage;
    // Redirect
    if ($state == 'free') {
      return $this->_helper->redirector->gotoRoute(array(), 'default', true);
    } else {
      return $this->_helper->redirector->gotoRoute(array('action' => 'finish', 'state' => $state));
    }
  }
  public function finishAction()
  {  
    $session = new Zend_Session_Namespace();
    if (!empty($session->booking_order_id))
      $session->booking_order_id = '';
    $orderTrabsactionDetails = array('state' => $this->_getParam('state'), 'errorMessage' => $session->errorMessage);
    $session->booking_order_details = $orderTrabsactionDetails;
    $state = $this->_getParam('state');
    if (!$state)
      return $this->_forward('notfound', 'error', 'core');
    $this->view->error = $error =  $session->errorMessage;
    $session->unsetAll();
  }
  public function cancelAction()
  {
    $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($this->getRequest()->getParam('professional_id'));
    if (!$professional) {
      return $this->_forward('requireauth', 'error', 'core');
    }
    $paymnetReq = Engine_Api::_()->getItem('booking_userpayrequest', $this->getRequest()->getParam('id'));

    // In smoothbox
    $this->_helper->layout->setLayout('default-simple');

    // Make form
    $this->view->form = $form = new Sesbasic_Form_Delete();
    $form->setTitle('Reject Payment Request');
    $form->setDescription('Are you sure that you want to reject this payment request?');
    $form->submit->setLabel('Reject');

    if (!$paymnetReq) {
      $this->view->status = false;
      $this->view->error = Zend_Registry::get('Zend_Translate')->_("Paymnet request doesn't exists or not authorized to cancel");
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
      $paymnetReq->state = 'cancelled';
      $paymnetReq->save();
      $db->commit();

      //Notification work
      $viewer = Engine_Api::_()->user()->getViewer();
      $owner = $professional->getOwner();
      Engine_Api::_()->getDbtable('notifications', 'activity')->addNotification($owner, $viewer, $professional, 'booking_profpayment_adminrequestcancel', array());
      //Payment cancel mail send to event owner
      Engine_Api::_()->getApi('mail', 'core')->sendSystem($owner, 'booking_profpayment_adminrequestcancel', array('professional_name' => $professional->name, 'object_link' => $professional->getHref(), 'host' => $_SERVER['HTTP_HOST']));
    } catch (Exception $e) {
      $db->rollBack();
      throw $e;
    }
    $this->view->status = true;
    $this->view->message = Zend_Registry::get('Zend_Translate')->_('Payment Request has been cancelled.');
    $professional = Engine_Api::_()->getItem('user', $professional->user_id);
    $viewer = Engine_Api::_()->user()->getViewer();
    Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($professional, $viewer,$professional, 'booking_profpayment_reject');
    Engine_Api::_()->getApi('mail', 'core')->sendSystem(
      $professional,
      'booking_profpayment_reject',
      array(
        'host' => $_SERVER['HTTP_HOST'],
        'queue' => false,
        'recipient_title' => $viewer->displayname,
        'object_link' => 'http://' . $_SERVER['HTTP_HOST'] . Zend_Controller_Front::getInstance()->getRouter()->assemble(array(), 'user_login', true)
      )
    );
    return $this->_forward('success', 'utility', 'core', array(
      'smoothboxClose' => 10,
      'parentRefresh' => 10,
      'messages' => array($this->view->message)
    ));
  }
  public function managePaymentProfessionalAction() {
    $this->view->navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_manageorders');
    $this->view->subNavigation  = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_manageorders', array(), 'booking_admin_main_managepaymentprofessionalsub');

    $this->view->formFilter = $formFilter = new Booking_Form_Admin_FilterPaymentProfessional();
    $values = array();
    if ($formFilter->isValid($this->_getAllParams()))
      $values = $formFilter->getValues();

    $values = array_merge(array('order' => $_GET['order'], 'order_direction' => $_GET['order_direction']), $values);

    $this->view->assign($values);

    $professionalTableName = Engine_Api::_()->getItemTable('professional')->info('name');
    $ordersTable = Engine_Api::_()->getDbTable('userpayrequests', 'booking');
    $ordersTableName = $ordersTable->info('name');

    $select = $ordersTable->select()
            ->setIntegrityCheck(false)
            ->from($ordersTableName)
            ->joinLeft($professionalTableName, "$ordersTableName.owner_id = $professionalTableName.user_id", 'name')
            ->where($ordersTableName . '.state = ?', 'complete')
            ->order((!empty($_GET['order']) ? $_GET['order'] : 'userpayrequest_id' ) . ' ' . (!empty($_GET['order_direction']) ? $_GET['order_direction'] : 'DESC' ));

    if (!empty($_GET['name']))
      $select->where($professionalTableName . '.name LIKE ?', '%' . $_GET['name'] . '%');
    if (!empty($_GET['creation_date']))
      $select->where($ordersTableName . '.creation_date LIKE ?', $_GET['creation_date'] . '%');
   if (!empty($_GET['gateway']))
      $select->where($ordersTableName . '.gateway_type LIKE ?', $_GET['gateway'] . '%');
    $paginator = Zend_Paginator::factory($select);
    $this->view->paginator = $paginator;
    $paginator->setItemCountPerPage(100);
    $paginator->setCurrentPageNumber($this->_getParam('page', 1));
  }
  public function viewPaymentrequestAction() {
    $this->view->item = Engine_Api::_()->getItem('booking_userpayrequest', $this->_getParam('id', null));
  }
}
