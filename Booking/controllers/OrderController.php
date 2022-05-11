<?php

class Booking_OrderController extends Core_Controller_Action_Standard
{

  public function init()
  {
    if (!$this->_helper->requireUser->isValid())
      return;
    $id = $this->_getParam('order_id', null);
    $order = Engine_Api::_()->getItem('booking_order', $id);
    if ($order) {
      Engine_Api::_()->core()->setSubject($order);
    } else {
      return $this->_forward('requireauth', 'error', 'core');
    }
  }

  public function indexAction()
  {
    $order_id = $this->_getParam('order_id', null);
    if (!$order_id)
      return $this->_forward('requireauth', 'error', 'core');
    $this->view->professional_id = $professional_id = $this->_getParam('professional_id', null);
    $this->view->viewer = $viewer = Engine_Api::_()->user()->getViewer();
    $viewer_id = $viewer->getIdentity();
    $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($professional_id);
    $isprofessional = null;
    if ($professional->professional_id) {
      $isprofessional = Engine_Api::_()->getItem('professional', $professional->professional_id);
      if ($isprofessional) {
        $this->view->professional = $isprofessional;
      } else
        return $this->_forward('requireauth', 'error', 'core');
    }
    if (!$isprofessional)
      return $this->_forward('requireauth', 'error', 'core');
    $this->view->order = $order = Engine_Api::_()->getDbtable('orders', 'booking')->getOrders(array('order_id' => $order_id, 'professional_id' => $professional_id, 'owner_id' => $viewer_id));
    $this->view->fnamelname = Engine_Api::_()->sesbasic()->getUserFnameLname();
    $this->view->appointmentDetails = $appointmentDetails = Engine_Api::_()->getDbtable('appointments', 'booking')->getAppointmentDetails(array('order_id' => $order_id, 'professional_id' => $professional_id, 'user_id' => $viewer_id));
    if (!$appointmentDetails)
      return $this->_forward('requireauth', 'error', 'core');
  }

  public function checkoutAction()
  {
    $order_id = $this->_getParam('order_id', null);
    if (!$order_id)
      return $this->_forward('requireauth', 'error', 'core');
    $this->view->professional_id = $professional_id = $this->_getParam('professional_id', null);
    $this->view->viewer = $viewer = Engine_Api::_()->user()->getViewer();
    $viewer_id = $viewer->getIdentity();
    $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($professional_id);
    $isprofessional = null;
    if ($professional->professional_id) {
      $isprofessional = Engine_Api::_()->getItem('professional', $professional->professional_id);
      if ($isprofessional) {
        $this->view->professional = $isprofessional;
      } else
        return $this->_forward('requireauth', 'error', 'core');
    }
    if (!$isprofessional)
      return $this->_forward('requireauth', 'error', 'core');
    $this->view->order = $order = Engine_Api::_()->getDbtable('orders', 'booking')->getOrders(array('order_id' => $order_id, 'professional_id' => $professional_id, 'owner_id' => $viewer_id));
    $this->view->appointmentDetails = $appointmentDetails = Engine_Api::_()->getDbtable('appointments', 'booking')->getAppointmentDetails(array('order_id' => $order_id, 'professional_id' => $professional_id, 'user_id' => $viewer_id));
    $postBookingUser = isset($_POST) ? $_POST : '';
    //save details of Booking buyer.
    if (is_array($postBookingUser) && count($postBookingUser)) {
      $order->fname = isset($_POST['fname_owner']) ? $_POST['fname_owner'] : '';
      $order->lname = isset($_POST['lname_owner']) ? $_POST['lname_owner'] : '';
      $order->email = isset($_POST['email_owner']) ? $_POST['email_owner'] : '';
      $order->mobile = isset($_POST['mobile_owner']) ? $_POST['mobile_owner'] : '';
      $order->save();
    }
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
    $this->view->gateways = $gatewayPlugins;
  }

  public function processAction()
  {
    // Get gateway
    $gatewayId = $this->_getParam('gateway_id', null);
    $order_id = $this->_getParam('order_id', null);
    if (!$order_id)
      return $this->_forward('requireauth', 'error', 'core');
    $this->view->professional_id = $professional_id = $this->_getParam('professional_id', null);
    $this->view->viewer = $viewer = Engine_Api::_()->user()->getViewer();
    $viewer_id = $viewer->getIdentity();
    $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($professional_id);
    $isprofessional = null;
    if ($professional->professional_id) {
      $isprofessional = Engine_Api::_()->getItem('professional', $professional->professional_id);
      if ($isprofessional) {
        $this->view->professional = $isprofessional;
      } else
        return $this->_forward('requireauth', 'error', 'core');
    }
    if (!$isprofessional)
      return $this->_forward('requireauth', 'error', 'core');
    $this->view->order = $order = Engine_Api::_()->getDbtable('orders', 'booking')->getOrders(array('order_id' => $order_id, 'professional_id' => $professional_id, 'owner_id' => $viewer_id));
    if (!$gatewayId || !($gateway = Engine_Api::_()->getItem('booking_gateway', $gatewayId)) || !($gateway->enabled)) {
      header("location:" . $this->view->escape($this->view->url(array('action' => 'checkout'))));
      die;
    }
    $this->view->gateway = $gateway;
    $this->view->gatewayPlugin = $gatewayPlugin = $gateway->getGateway();
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
    $params['return_url'] = $schema . $host . $this->view->escape($this->view->url(array('action' => 'return'))) . '/?state=' . 'return';
    $params['cancel_url'] = $this->view->escape($schema . $host . $this->view->url(array('action' => 'return'))) . '/?state=' . 'cancel';
    $params['ipn_url'] = $schema . $host . $this->view->url(array('action' => 'index', 'controller' => 'ipn', 'module' => 'payment'), 'default');
    if ($gatewayId == 1) {
      $gatewayPlugin->createProduct(array_merge($order->getGatewayParams(), array('approved_url' => $params['return_url'])));
    }
    $plugin = $gateway->getPlugin();
    $ordersTable = Engine_Api::_()->getDbtable('orders', 'payment');
    // Process
    $ordersTable->insert(array(
      'user_id' => $viewer->getIdentity(),
      'gateway_id' => $gateway->gateway_id,
      'state' => 'pending',
      'creation_date' => new Zend_Db_Expr('NOW()'),
      'source_type' => 'booking_order',
      'source_id' => $order->order_id,
    ));
    $session = new Zend_Session_Namespace();
    $session->booking_order_id = $order_id = $ordersTable->getAdapter()->lastInsertId();
    $bookingOrder = Engine_Api::_()->getItem('booking_order',$order->order_id);
    $bookingOrder->gateway_id = $gateway->gateway_id;$bookingOrder->save();
    // Process transaction
    if ($gateway->plugin == "Sesadvpmnt_Plugin_Gateway_Stripe") {
      $params['currency'] = Engine_Api::_()->booking()->getCurrentCurrency();
      $this->view->publishKey = $gateway->config['sesadvpmnt_stripe_publish']; 
      $this->view->session = $plugin->createOrderTransaction($viewer, $order, $isprofessional, $params);
  
      $this->renderScript('/application/modules/Sesadvpmnt/views/scripts/payment/index.tpl');
    } elseif ($gateway->plugin  == "Epaytm_Plugin_Gateway_Paytm") {
      $bookingOrder->gateway_type = 'Paytm';$bookingOrder->save();
      $params['amount'] = $order->total_amount;
      $paytmParams = $plugin->createBookingTransaction($viewer, $order, $isprofessional, $params);
      $secretKey  = $gateway->config['paytm_secret_key'];
      $this->view->paytmParams = $paytmParams;
      // Pull transaction params
      $this->view->checksum = getChecksumFromArray($paytmParams, $secretKey);
      if ($gateway->test_mode) {
        $this->view->url = "https://securegw-stage.paytm.in/order/process";
      } else {
        $this->view->url = "https://securegw.paytm.in/merchant-status/getTxnStatus";
      }
      $this->renderScript('/application/modules/Epaytm/views/scripts/payment/index.tpl');
    } else {
      $transaction = $plugin->createOrderTransaction($viewer, $order, $isprofessional, $params);
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
    $this->view->order = $order = Engine_Api::_()->core()->getSubject();
    //if($order->state == 'complete')
    //return $this->_forward('notfound', 'error', 'core');
    $session = new Zend_Session_Namespace();
    // Get order
    $orderId = $this->_getParam('order_id', null);
    $orderPaymentId = $session->booking_order_id;
    $orderPayment = Engine_Api::_()->getItem('payment_order', $orderPaymentId);
    if (
      !$orderPayment || ($orderId != $orderPayment->source_id) || ($orderPayment->source_type != 'booking_order') ||
      !($user_order = $orderPayment->getSource())
    ) {
      return $this->_helper->redirector->gotoRoute(array(), 'booking_general', true);
    }
    $gateway = Engine_Api::_()->getItem('booking_gateway', $orderPayment->gateway_id);
    if (!$gateway)
      return $this->_helper->redirector->gotoRoute(array(), 'booking_general', true);
    // Get gateway plugin
    $params = $this->_getAllParams();
    $plugin = $gateway->getPlugin();
    unset($session->errorMessage);
    try {
      //generate booking code
      if (!$order->ragistration_number) {
        $order->ragistration_number = Engine_Api::_()->booking()->generateBookingCode(8);
        $order->save();
      }
      $status = $plugin->orderBookingTransactionReturn($orderPayment, array_merge($this->_getAllParams(),$params));
      if ($params['state'] == 'cancel') {
        $status = 'cancel';
        $session->errorMessage = $this->view->translate('Your payment has been cancelled and not been charged. If this is not correct, please try again later.');
      }
    } catch (Payment_Model_Exception $e) {
      $status = 'failure';
      $session->errorMessage = $e->getMessage();
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
      $session->unsetAll();
      return $this->_helper->redirector->gotoRoute(array('booking_general'), 'default', true);
    } else {
      $url =  $this->view->escape($this->view->url(array('action' => 'finish', 'state' => $state)));
      header('location:' . $url);
      die;
    }
  }

  public function finishAction()
  {
    $session = new Zend_Session_Namespace();
    $orderTrabsactionDetails = array('state' => $this->_getParam('state'), 'errorMessage' => $session->errorMessage);
    $session->sesevent_order_details = $orderTrabsactionDetails;
    $url =  $this->view->escape($this->view->url(array('action' => 'success')));
    header('location:' . $url);
    die;
  }

  public function checkorderAction()
  {
    $order_id = $this->_getParam('order_id', null);
    $checkOrderStatus = Engine_Api::_()->getDbtable('orders', 'booking')->getOrderStatus($order_id);
    if ($checkOrderStatus) {
      echo json_encode(array('status' => true));
      die;
    } else {
      echo json_encode(array('status' => false));
      die;
    }
  }

  public function successAction()
  {
    $session = new Zend_Session_Namespace();
    $order_id = $this->_getParam('order_id', null);
    $this->view->professional_id = $professional_id = $this->_getParam('professional_id', null);
    $this->view->viewer = $viewer = Engine_Api::_()->user()->getViewer();
    $this->view->order = $order = Engine_Api::_()->core()->getSubject();
    if (!$order || $order->owner_id != $viewer->getIdentity())
      return $this->_forward('notfound', 'error', 'core');
    if (!$order_id)
      return $this->_forward('notfound', 'error', 'core');

    $this->view->professional_id = $professional_id = $this->_getParam('professional_id', null);
    $this->view->viewer = $viewer = Engine_Api::_()->user()->getViewer();
    $viewer_id = $viewer->getIdentity();
    $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($professional_id);
    $isprofessional = null;
    if ($professional->professional_id) {
      $isprofessional = Engine_Api::_()->getItem('professional', $professional->professional_id);
      if ($isprofessional) {
        $this->view->professional = $isprofessional;
      } else
        return $this->_forward('requireauth', 'error', 'core');
    }
    if (!$isprofessional)
      return $this->_forward('requireauth', 'error', 'core');

    $state = $this->_getParam('state');
    if (!$state)
      return $this->_forward('notfound', 'error', 'core');
    $this->view->error = $error =  $session->errorMessage;
    $session->unsetAll();
    $this->view->state = $state;
    $getAdminnSuperAdmins = Engine_Api::_()->booking()->getAdminSuperAdmins();
    $services = Engine_Api::_()->getDbtable('appointments', 'booking')->getAllOrderServices($order_id);
    $serviceName = "";
    $count = 0;
    foreach ($services as $value) {
      $count++;
      $service = Engine_Api::_()->getItem('booking_service', $value->service_id);
      $serviceName .= "{$service->name},";
    }
    $service = $this->view->translate(array('service', 'services', $count)) . " " . rtrim($serviceName, ',');
    //Payment mail goes to all admins.
    foreach ($getAdminnSuperAdmins as $getAdminnSuperAdmin) {
      $user = Engine_Api::_()->getItem('user', $getAdminnSuperAdmin['user_id']);
      Engine_Api::_()->getApi('mail', 'core')->sendSystem(
        $user,
        'booking_userpayment_done',
        array(
          'host' => $_SERVER['HTTP_HOST'],
          'service_name' => $service,
          'queue' => false,
          'recipient_title' => $viewer->displayname,
          // 'object_link' => $service->getHref(),
        )
      );
    }
    //Payment mail goes to professional.
    Engine_Api::_()->getApi('mail', 'core')->sendSystem(
      $user,
      'booking_userpayment_done',
      array(
        'host' => $_SERVER['HTTP_HOST'],
        'service_name' => $service,
        'queue' => false,
        'recipient_title' => $viewer->displayname,
        // 'object_link' => $service->getHref(),
      )
    );
  }
}
