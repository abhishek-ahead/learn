<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Sesadvpmnt
 * @package    Sesadvpmnt
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Paytm.php  2019-04-25 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
include_once APPLICATION_PATH . "/application/modules/Epaytm/Api/PaytmKit/lib/encdec_paytm.php";
class Booking_Plugin_Gateway_Booking_Paytm extends Engine_Payment_Plugin_Abstract {
    protected $_gatewayInfo;
    protected $_gateway;
    // General
    /**
    * Constructor
    */
    public function __construct(Zend_Db_Table_Row_Abstract $gatewayInfo)
    {
        $this->_gatewayInfo = $gatewayInfo;
        // @todo
    }
    /**
    * Get the service API
    *
    * @return Engine_Service_PayPal
    */
    public function getService()
    {
        return $this->getGateway()->getService();
    }
    /**
    * Get the gateway object
    *
    * @return Engine_Payment_Gateway
    */
    public function getGateway()
    {
        if( null === $this->_gateway ) {
            $class = 'Epaytm_Gateways_Paytm';
            Engine_Loader::loadClass($class);
            $gateway = new $class(array(
                'config' => (array) $this->_gatewayInfo->config,
                'testMode' => $this->_gatewayInfo->test_mode,
            ));
            if( !($gateway instanceof Engine_Payment_Gateway) ) {
                throw new Engine_Exception('Plugin class not instance of Engine_Payment_Gateway');
            }
            $this->_gateway = $gateway;
        }
        return $this->_gateway;
    }
    // Actions
    /**
    * Create a transaction object from specified parameters
    *
    * @return Engine_Payment_Transaction
    */
    public function createTransaction(array $params)
    {
        $transaction = new Engine_Payment_Transaction($params);
        $transaction->process($this->getGateway($params['moduleName']));
        return $transaction;
    }
    /**
    * Create an ipn object from specified parameters
    *
    * @return Engine_Payment_Ipn
    */
    public function createIpn(array $params)
    {
        $ipn = new Engine_Payment_Ipn($params);
        $ipn->process($this->getGateway());
        return $ipn;
    }
    // SEv4 Specific
    /**
    * Create a transaction for a subscription
    *
    * @param User_Model_User $user
    * @param Zend_Db_Table_Row_Abstract $subscription
    * @param Zend_Db_Table_Row_Abstract $package
    * @param array $params
    * @return Engine_Payment_Gateway_Transaction
    */
	public function createSubscriptionTransaction(User_Model_User $user, Zend_Db_Table_Row_Abstract $user_order, Payment_Model_Package $package, array $params = array()){}
  public function createOrderTransaction($order,$professional,array $params = array()) { 
    $viewer = Engine_Api::_()->user()->getViewer();
    $paytmParams  = array(
      /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
      "MID" => $this->_gatewayInfo->config['paytm_marchant_id'],
      /* Find your WEBSITE in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
      "WEBSITE" => $this->_gatewayInfo->config['paytm_website'],
      /* Find your INDUSTRY_TYPE_ID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
      "INDUSTRY_TYPE_ID" => $this->_gatewayInfo->config['paytm_industry_type'],
      /* WEB for website and WAP for Mobile-websites or App */
      "CHANNEL_ID" => $this->_gatewayInfo->config['paytm_channel_id'],
      /* Enter your unique order id */
      "ORDER_ID" => $params['vendor_order_id'],
      /* unique id that belongs to your customer */
      "CUST_ID" => $viewer->getIdentity(),
      /* customer's mobile number */
      /**
      * Amount in INR that is payble by customer
      * this should be numeric with optionally having two decimal points
      */
      "TXN_AMOUNT" =>  @round($order->release_amount, 2),
      /* on completion of transaction, we will send you the response on this URL */
      "CALLBACK_URL" => $params['return_url'],
    );
     return $paytmParams;
  }
  public function orderTransactionReturn($order,$params = array()) {
        // Get related info
        $user = $order->getUser();
        $orderPayment = $order->getSource();
        $module_name = 'user';
        $viewer = Engine_Api::_()->user()->getViewer();
        // Get payment state
        $paymentStatus = null;
        $orderStatus = null;
        switch($params['STATUS']) {
          case 'created':
          case 'pending':
            $paymentStatus = 'pending';
            $orderStatus = 'complete';
            break;
          case 'active':
          case 'succeeded':
          case 'completed':
          case 'processed':
          case 'TXN_SUCCESS': // Probably doesn't apply
            $paymentStatus = 'okay';
            $orderStatus = 'complete';
            break;
          case 'denied':
          case "TXN_FAILURE": 
            $paymentStatus = 'failed';
            $orderStatus = 'failed'; 
          case 'voided': // Probably doesn't apply
          case 'reversed': // Probably doesn't apply
          case 'refunded': // Probably doesn't apply
          case 'TXN_FAILURE':  // Probably doesn't apply
          default: // No idea what's going on here
            $paymentStatus = 'failed';
            $orderStatus = 'failed'; // This should probably be 'failed'
            break;
        }
        // Update order with profile info and complete status?
        $order->state = $orderStatus;
        $order->gateway_transaction_id = isset($params['TXNID']) ? $params['TXNID'] : '';
        $order->save();
        // Insert transaction
        $transactionsTable = Engine_Api::_()->getDbtable('transactions', 'payment');
        $transactionsTable->insert(array(
            'user_id' => $order->user_id,
            'gateway_id' =>$this->_gatewayInfo->usergateway_id,
            'timestamp' => new Zend_Db_Expr('NOW()'),
            'order_id' => $order->order_id,
            'type' => $orderPayment->getType(),
            'state' => $paymentStatus,
            'gateway_transaction_id' => isset($params['TXNID']) ? $params['TXNID'] : '',
            'amount' => $params['TXNAMOUNT'], // @todo use this or gross (-fee)?
            'currency' => $params['CURRENCY'],
        ));
        // Get benefit setting
        $giveBenefit = Engine_Api::_()->getDbtable('transactions', 'payment')->getBenefitStatus($user);
        // Check payment status
        if( $paymentStatus == 'okay' || ($paymentStatus == 'pending' && $giveBenefit) ) {
        // Update order table info
        $orderPayment->gateway_id = $this->_gatewayInfo->usergateway_id;
        $orderPayment->gateway_transaction_id = isset($params['TXNID']) ? $params['TXNID'] : '';
        $orderPayment->currency_symbol = $params['CURRENCY'];
        $orderPayment->release_date = date('Y-m-d H:i:s');
        $orderPayment->gateway_type = "Paytm";
        $orderPayment->save();

        //update EVENT OWNER REMAINING amount
        $tableRemaining = Engine_Api::_()->getDbtable('remainingpayments', 'booking');
        $tableName = $tableRemaining->info('name');
        $select = $tableRemaining->select()->from($tableName)->where('professional_id =?',$orderPayment->professional_id);
        $select = $tableRemaining->fetchAll($select);
        $remainingAmt = $select[0]['remaining_payment'] - $params['TXNAMOUNT'];
        if($remainingAmt < 0)
          $orderAmount = 0;
        else
          $orderAmount = $remainingAmt;
          $tableRemaining->update(array('remaining_payment' => $remainingAmt),array('professional_id =?'=>$orderPayment->professional_id));
        
        // Payment success
        $orderPayment->onOrderComplete();
        // send notification and email
        if( $orderPayment->state == 'complete' ) {
          $professional = Engine_Api::_()->getItem('user', $orderPayment->professional_id);
          $viewer = Engine_Api::_()->user()->getViewer();
          // $professionalTransactionUrl= '<a href='.$this->url(array('action'=>'payment-transaction'),'booking_dashboard',true).'></a>';
          Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($professional, $viewer, $professional, 'booking_profpayment_approve');
          Engine_Api::_()->getApi('mail', 'core')->sendSystem(
            $professional,
            'booking_profpayment_approve',
            array(
              'host' => $_SERVER['HTTP_HOST'],
              'queue' => false,
              'recipient_title' => $viewer->displayname,
              'object_link' => 'http://' . $_SERVER['HTTP_HOST'] .Zend_Controller_Front::getInstance()->getRouter()->assemble(array(), 'user_login', true))
          );
        }
        return 'active';
      }
        else if( $paymentStatus == 'pending' ) {
        // Update order  info
        $orderPayment->gateway_id = $this->_gatewayInfo->usergateway_id;
        $orderPayment->gateway_profile_id = isset($params['TXNID']) ? $params['TXNID'] : '';
        $orderPayment->save();
        // Order pending
        $orderPayment->onOrderPending();
        return 'pending';
      }
      else if( $paymentStatus == 'failed' ) {
        // Cancel order and subscription?
        $order->onFailure();
        $orderPayment->onOrderFailure();

        // Payment failed
        throw new Payment_Model_Exception('Your payment could not be ' .
          'completed. Please ensure there are sufficient available funds ' .
          'in your account.');
      }
        else {
            // This is a sanity error and cannot produce information a user could use
            // to correct the problem.
            throw new Payment_Model_Exception('There was an error processing your ' .
                'transaction. Please try again later.');
        }
      return 'active';
    }

    /**
    * Process return of subscription transaction
    *
    * @param Payment_Model_Order $order
    * @param array $params
    */
    public function onSubscriptionTransactionReturn(Payment_Model_Order $order, array $params = array()) {}

	public function onOrderTicketTransactionIpn(Payment_Model_Order $order, Engine_Payment_Ipn $ipn) {

	}
  /**
   * Process ipn of subscription transaction
   *
   * @param Payment_Model_Order $order
   * @param Engine_Payment_Ipn $ipn
   */
  public function onSubscriptionTransactionIpn(
      Payment_Model_Order $order,
      Engine_Payment_Ipn $ipn)
  {}

  public function cancelSubscription($transactionId, $note = null)
  {}
  /**
   * Generate href to a page detailing the order
   *
   * @param string $transactionId
   * @return string
   */
  public function getOrderDetailLink($orderId)
  {

  }
  /**
   * Generate href to a page detailing the transaction
   *
   * @param string $transactionId
   * @return string
   */
  public function getTransactionDetailLink($transactionId)
  {

  }
  /**
   * Get raw data about an order or recurring payment profile
   *
   * @param string $orderId
   * @return array
   */
  public function getOrderDetails($orderId)
  {
    // We don't know if this is a recurring payment profile or a transaction id,
    // so try both
    try {
      return $this->getService()->detailRecurringPaymentsProfile($orderId);
    } catch( Exception $e ) {
      echo $e;
    }
    try {
      return $this->getTransactionDetails($orderId);
    } catch( Exception $e ) {
      echo $e;
    }
    return false;
  }
  /**
   * Get raw data about a transaction
   *
   * @param $transactionId
   * @return array
   */
  public function getTransactionDetails($transactionId)
  {
    return $this->getService()->detailTransaction($transactionId);
  }
  // IPN
  /**
   * Process an IPN
   *
   * @param Engine_Payment_Ipn $ipn
   * @return Engine_Payment_Plugin_Abstract
   */
  public function onIpn(Engine_Payment_Ipn $ipn)
  { }
 function getSupportedCurrencies(){
      return array('INR'=>'INR');
 }
  // Forms
  /**
   * Get the admin form for editing the gateway info
   *
   * @return Engine_Form
   */
  public function getAdminGatewayForm()
  {
    return new Epaytm_Form_Admin_Settings_Paytm();
  }
  public function processAdminGatewayForm(array $values)
  {
    return $values;
  }
}
