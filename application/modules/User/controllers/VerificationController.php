<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    User
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: SubscriptionController.php 9747 2012-07-26 02:08:08Z john $
 * @author     John Boehr <j@webligo.com>
 */

/**
 * @category   Application_Core
 * @package    User
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 */

class User_VerificationController extends Core_Controller_Action_Standard {

  /**
   * @var User_Model_User
   */
  protected $_user;

  /**
   * @var Zend_Session_Namespace
   */
  protected $_session;

  /**
   * @var Payment_Model_Order
   */
  protected $_order;

  /**
   * @var Payment_Model_Gateway
   */
  protected $_gateway;

  public function init() {
    
    // If there are no enabled gateways or packages, disable
//     if( Engine_Api::_()->getDbtable('gateways', 'payment')->getEnabledGatewayCount() <= 0 ) {
//       return $this->_helper->redirector->gotoRoute(array(), 'default', true);
//     }
    
    // Get user and session
    $this->_user = Engine_Api::_()->user()->getViewer();
    $this->_session = new Zend_Session_Namespace('Payment_Verification');
    $this->_session->gateway_id = $this->_getParam('gateway_id', 0);
    $this->_session->user_id = $user_id = $this->_getParam('user_id', 0);
    
    // Check viewer and user
    if( !$this->_user || !$this->_user->getIdentity() ) {
      if( !empty($this->_session->user_id) ) {
        $this->_user = Engine_Api::_()->getItem('user', $this->_session->user_id);
      }
      // If no user, redirect to home?
      if( !$this->_user || !$this->_user->getIdentity() ) {
        $this->_session->unsetAll();
        return $this->_helper->redirector->gotoRoute(array(), 'default', true);
      }
    }
    $this->_session->user_id = $this->_user->getIdentity();
  }

  public function indexAction() {
    return $this->_forward('gateway');
  }

  public function processAction() {
  
    // Get gateway
    $gatewayId = $this->_getParam('gateway_id', $this->_session->gateway_id);
		$user_id = $this->_getParam('user_id', $this->_session->user_id);

    if (!$gatewayId || !($gateway = Engine_Api::_()->getDbtable('verificationgateways', 'payment')->find($gatewayId)->current()) || !($gateway->enabled)) {
      return $this->_helper->redirector->gotoRoute(array('action' => 'gateway'));
    }
    $this->view->gateway = $gateway;

    //Process
    // Create order
    $ordersTable = Engine_Api::_()->getDbtable('orders', 'payment');
    if (!empty($this->_session->order_id)) {
      $previousOrder = $ordersTable->find($this->_session->order_id)->current();
      if ($previousOrder && $previousOrder->state == 'pending') {
        $previousOrder->state = 'incomplete';
        $previousOrder->save();
      }
    }
    
    $recurrence = Engine_Api::_()->authorization()->getPermission($this->_user, 'user', 'recurrence');
    $price = Engine_Api::_()->authorization()->getPermission($this->_user, 'user', 'price_verified');

    //Order table for verification
    $verificationsTable = Engine_Api::_()->getDbTable('verifications', 'payment');
    $db = $verificationsTable->getAdapter();
    $db->beginTransaction();
    try {
      $verifications = $verificationsTable->createRow();
      $verifications->user_id = $this->_user->getIdentity();
      $verifications->params = json_encode(array('recurrence' => json_decode($recurrence), 'price' => $price));
      $verifications->save();
      // Commit
      $db->commit();
      $verificationsId = $verifications->getIdentity();
    } catch (Exception $e) {
      $db->rollBack();
      throw $e;
    }

    $ordersTable->insert(array(
			'user_id' => $this->_user->getIdentity(),
			'gateway_id' => $gateway->gateway_id,
			'state' => 'pending',
			'creation_date' => new Zend_Db_Expr('NOW()'),
			'source_type' => 'payment_verification',
			'source_id' => $verificationsId,
    ));
    $this->_session->order_id = $order_id = $ordersTable->getAdapter()->lastInsertId();
    
    // Unset certain keys
    unset($this->_session->gateway_id);
    
    // Get gateway plugin
    $this->view->gatewayPlugin = $gatewayPlugin = $gateway->getGateway();
    $plugin = $gateway->getPlugin();

    // Prepare host info
    $schema = _ENGINE_SSL ? 'https://' : 'http://';
    $host = $_SERVER['HTTP_HOST'];

    // Prepare transaction
    $params = array();
    $params['language'] = $this->_user->language;
    $localeParts = explode('_', $this->_user->language);
    if( engine_count($localeParts) > 1 ) {
      $params['region'] = $localeParts[1];
    }
    $params['vendor_order_id'] = $order_id;
    $this->view->returnUrl = $params['return_url'] = $schema . $host
      . $this->view->url(array('action' => 'return'))
      . '?order_id=' . $order_id
      //. '?gateway_id=' . $this->_gateway->gateway_id
      //. '&subscription_id=' . $this->_subscription->subscription_id
      . '&state=' . 'return';
    $params['cancel_url'] = $schema . $host
      . $this->view->url(array('action' => 'return'))
      . '?order_id=' . $order_id
      //. '?gateway_id=' . $this->_gateway->gateway_id
      //. '&subscription_id=' . $this->_subscription->subscription_id
      . '&state=' . 'cancel';
    $params['ipn_url'] = $schema . $host
      . $this->view->url(array('action' => 'index', 'controller' => 'ipn'))
      . '?order_id=' . $order_id;
      //. '?gateway_id=' . $this->_gateway->gateway_id
      //. '&subscription_id=' . $this->_subscription->subscription_id;
  
    $params['price'] = $price;
    $params['recurrence'] = $recurrence;
    
    // Process transaction
    $transaction = $plugin->createVerificationTransaction($this->_user, $params);

    // Pull transaction params
    $this->view->transactionUrl = $transactionUrl = $gatewayPlugin->getGatewayUrl();
    $this->view->transactionMethod = $transactionMethod = $gatewayPlugin->getGatewayMethod();
    $this->view->transactionData = $transactionData = $transaction->getData();

    // Handle redirection
    if( $transactionMethod == 'GET' ) {
      $transactionUrl .= '?' . http_build_query($transactionData);
      return $this->_helper->redirector->gotoUrl($transactionUrl, array('prependBase' => false));
    }

    // Post will be handled by the view script
  }
  
  public function returnAction() {
  
    // Get order
    if( !$this->_user ||
        !($orderId = $this->_getParam('order_id', $this->_session->order_id)) ||
        !($order = Engine_Api::_()->getItem('payment_order', $orderId)) ||
        $order->user_id != $this->_user->getIdentity() ||
        $order->source_type != 'payment_verification' ||
        !($verifications = $order->getSource()) ||
        !($gateway = Engine_Api::_()->getItem('payment_verificationgateway', $order->gateway_id)) ) {
      return $this->_helper->redirector->gotoRoute(array(), 'default', true);
    }
    
    //$this->_subscription = $subscription;
    // Get gateway plugin
    $this->view->gatewayPlugin = $gatewayPlugin = $gateway->getGateway();
    $plugin = $gateway->getPlugin();

    // Process return
    unset($this->_session->errorMessage);
    try {
      $status = $plugin->onVerificationTransactionReturn($order, $this->_getAllParams());
      
      if(($status == 'active' || $status == 'free')) {
        $admins = Engine_Api::_()->user()->getSuperAdmins();
        $user = Engine_Api::_()->getItem('user', $order->user_id);
        
        $translate = Zend_Registry::get('Zend_Translate');
        $adminLink = 'https://' . $_SERVER['HTTP_HOST'] . Zend_Controller_Front::getInstance()->getRouter()->assemble(array('module' => 'payment', 'controller' => 'index', 'action' => 'index'), 'admin_default', true);
        
        foreach($admins as $admin){
          Engine_Api::_()->getApi('mail', 'core')->sendSystem($admin,'payment_manual_verification', array(
            'payment_method' => $gateway->title,
            'sender_name' => $user->getTitle(),
            'admin_link' => $adminLink,
          ));
        }
      }
    } catch( Payment_Model_Exception $e ) {
      $status = 'failure';
      $this->_session->errorMessage = $e->getMessage();
    }

    return $this->_finishPayment($status);
  }
  
  protected function _finishPayment($state = 'active')
  {
    $viewer = Engine_Api::_()->user()->getViewer();
    $user = $this->_user;

    // No user?
    if( !$this->_user ) {
      return $this->_helper->redirector->gotoRoute(array(), 'default', true);
    }

    // Clear session
    $errorMessage = $this->_session->errorMessage;
    $userIdentity = $this->_session->user_id;
    $this->_session->unsetAll();
    $this->_session->user_id = $userIdentity;
    $this->_session->errorMessage = $errorMessage;

    // Redirect
    if( $state == 'free' ) {
      return $this->_helper->redirector->gotoRoute(array(), 'default', true);
    } else {
      return $this->_helper->redirector->gotoRoute(array('action' => 'finish', 'state' => $state, 'user_id' => $user->getIdentity()));
    }
  }
  
  public function finishAction()
  {
    $this->view->status = $status = $this->_getParam('state');
    $this->view->error = $this->_session->errorMessage;
    $this->view->user_id = $user_id = $this->_getParam('user_id', null);
    $this->view->url = $this->view->url(array(), 'default', true);
  }
  
  public function cancelAction() {
  
		$transactionId = $this->_getParam('transaction_id', null);
    $transaction = Engine_Api::_()->getItem('payment_transaction', $transactionId);
    $order = Engine_Api::_()->getItem('payment_order', $transaction->order_id);
    $subscription = $order->getSource();

		if(!$transactionId || !$transaction)
			return $this->_forward('notfound', 'error', 'core');
			
    // In smoothbox
    $this->_helper->layout->setLayout('default-simple');

    // Make form
    $this->view->form = $form = new Payment_Form_Payment_Cancel();
    $form->setTitle('Cancel This Subscription?');
    $form->setDescription('Are you sure you want to cancel your verification subscription? You\'ll need to reapply if canceled.');
    $form->submit->setLabel('Yes');

    if (!$this->getRequest()->isPost()) {
      $this->view->status = false;
      $this->view->error = Zend_Registry::get('Zend_Translate')->_('Invalid request method');
      return;
    }
    $gateway = Engine_Api::_()->getItem('payment_verificationgateway', $transaction->gateway_id);
    try {
      if( !empty($transaction->gateway_id) && !empty($transaction->gateway_order_id) ) {
        if( $gateway ) {
          $gatewayPlugin = $gateway->getPlugin();
          if( method_exists($gatewayPlugin, 'cancelSubscription') ) {
            $r = $gatewayPlugin->cancelSubscription($transaction->gateway_order_id, $note);
            $subscription->onCancel();
          }
        }
      }
      
      //Cancel for Manual Payment gateway
      if(engine_in_array($gateway->getIdentity(), array(3, 4, 5, 6))) {
        $subscription->onCancel();
      }
      
      $this->view->status = true;
      $this->view->message = Zend_Registry::get('Zend_Translate')->_('Verification Subscription cancelled successfully.');
      return $this->_forward('success', 'utility', 'core', array(
        'smoothboxClose' => 10,
        'parentRefresh' => 10,
        'messages' => array($this->view->message)
      ));
    } catch (Exception $e) {
      throw $e;
    }
  }
  
  public function sendVerificationRequestAction() {
  
		$user_id = $this->_getParam('user_id', null);
    $viewer = Engine_Api::_()->getItem('user', $user_id);
    
		if(!$user_id || !$viewer)
			return $this->_forward('notfound', 'error', 'core');
			
    // In smoothbox
    $this->_helper->layout->setLayout('default-simple');

    // Make form
    $this->view->form = $form = new User_Form_Verification_Send();

    if (!$this->getRequest()->isPost()) {
      $this->view->status = false;
      $this->view->error = Zend_Registry::get('Zend_Translate')->_('Invalid request method');
      return;
    }
    
    if (!$form->isValid($this->getRequest()->getPost()))
      return;
    
    $values = $form->getValues();
    $table = Engine_Api::_()->getDbTable('verificationrequests', 'user');
    
    $db = $table->getAdapter();
    $db->beginTransaction();
    
    try {

      $row = $table->createRow();
      $row->user_id = $user_id;
      $row->message = $values['message'];
      $row->creation_date = date('Y-m-d H:i:s');
      $row->save();
      
      //Send notification and mail to all admins
      $allAdmins = Engine_Api::_()->getItemTable('user')->getAllAdmin();
      foreach ($allAdmins as $admin) {
        Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($admin, $viewer, $admin, 'user_verirequestto_superadmin');
      }
      
      $db->commit();
      
      $this->view->status = true;
      $this->view->message = Zend_Registry::get('Zend_Translate')->_('Your verification request has been successfully submitted.');
      return $this->_forward('success', 'utility', 'core', array(
        'smoothboxClose' => 10,
        'parentRefresh' => 10,
        'messages' => array($this->view->message)
      ));
    } catch (Exception $e) {
      throw $e;
    }
  }
  
  public function cancelVerificationRequestAction() {
  
		$user_id = $this->_getParam('user_id', null);
    $user = Engine_Api::_()->getItem('user', $user_id);
    
    $verificationrequest_id = $this->_getParam('verificationrequest_id', null);
    $verificationrequest = Engine_Api::_()->getItem('user_verificationrequest', $verificationrequest_id);
    
		if(!$user_id || !$user)
			return $this->_forward('notfound', 'error', 'core');
			
    if(!$verificationrequest_id || !$verificationrequest)
			return $this->_forward('notfound', 'error', 'core');
			
    // In smoothbox
    $this->_helper->layout->setLayout('default-simple');

    // Make form
    $this->view->form = $form = new User_Form_Verification_Cancel();

    if (!$this->getRequest()->isPost()) {
      $this->view->status = false;
      $this->view->error = Zend_Registry::get('Zend_Translate')->_('Invalid request method');
      return;
    }
    
    if (!$form->isValid($this->getRequest()->getPost()))
      return;

    try {
      $verificationrequest->delete();
      
      $this->view->status = true;
      $this->view->message = Zend_Registry::get('Zend_Translate')->_('Verification request cancelled successfully.');
      return $this->_forward('success', 'utility', 'core', array(
        'smoothboxClose' => 10,
        'parentRefresh' => 10,
        'messages' => array($this->view->message)
      ));
    } catch (Exception $e) {
      throw $e;
    }
  }
}
