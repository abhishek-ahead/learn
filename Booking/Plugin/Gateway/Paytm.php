<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Estorepackage
 * @copyright  Copyright 2014-2019 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Paytm.php 2019-11-05 00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */
include_once APPLICATION_PATH . "/application/modules/Epaytm/Api/PaytmKit/lib/encdec_paytm.php";
class Booking_Plugin_Gateway_Paytm extends Engine_Payment_Plugin_Abstract
{
  protected $_gatewayInfo;
  protected $_gateway;
  public function __construct(Zend_Db_Table_Row_Abstract $gatewayInfo)
  {
    $this->_gatewayInfo = $gatewayInfo;
  }
  public function getService()
  {
    return $this->getGateway()->getService();
  }
  public function getGateway()
  {
    if( null === $this->_gateway ) {
        $class = 'Epaytm_Gateways_Paytm';
        Engine_Loader::loadClass($class);
        $gateway = new $class(array(
        'config' => (array) $this->_gatewayInfo->config,
        'testMode' => $this->_gatewayInfo->test_mode,
        'currency' => Engine_Api::_()->getApi('settings', 'core')->getSetting('payment.currency', 'USD'),
      ));
      if( !($gateway instanceof Engine_Payment_Gateway) ) {
        throw new Engine_Exception('Plugin class not instance of Engine_Payment_Gateway');
      }
      $this->_gateway = $gateway;
    }
    return $this->_gateway;
  }
  public function createTransaction(array $params)
  {
    $transaction = new Engine_Payment_Transaction($params);
    $transaction->process($this->getGateway());
    return $transaction;
  }
  public function createIpn(array $params)
  {
    $ipn = new Engine_Payment_Ipn($params);
    $ipn->process($this->getGateway());
    return $ipn;
  }
  public function createSubscriptionTransaction(User_Model_User $user, Zend_Db_Table_Row_Abstract $subscription, Payment_Model_Package $package, array $params = array()) {
  }
  public function createBookingTransaction(User_Model_User $viewer,
      Zend_Db_Table_Row_Abstract $order,
      Zend_Db_Table_Row_Abstract $professional,
      array $params = array())
  {
    // Process description
    $desc = $professional->name;
    if( strlen($desc) > 127 ) {
      $desc = substr($desc, 0, 124) . '...';
    } else if( !$desc || strlen($desc) <= 0 ) {
      $desc = 'N/A';
    }
    if( function_exists('iconv') && strlen($desc) != iconv_strlen($desc) ) {
      // PayPal requires that DESC be single-byte characters
      $desc = @iconv("UTF-8", "ISO-8859-1//TRANSLIT", $desc);
    }
    $description = $desc;
    $currentCurrency = Engine_Api::_()->booking()->getCurrentCurrency();
    $defaultCurrency = Engine_Api::_()->booking()->defaultCurrency();
    $settings = Engine_Api::_()->getApi('settings', 'core');
    $currencyValue = 1;
    if($currentCurrency != $defaultCurrency){
      $currencyValue = $settings->getSetting('sesmultiplecurrency.'.$currentCurrency);
    }
    $ticket_order = array();
    $orderAppointments = $order->getAppointments(array('order_id'=>$order->order_id,'professional_id'=>$professional->user_id,'user_id'=>$viewer->user_id));
    $priceTotal = $entertainment_tax = $service_tax = $totalservice = 0;
    $servicequantity = 1;
    foreach($orderAppointments as $val){
      $service = Engine_Api::_()->getItem('booking_service', $val->service_id);
      $price = @round($service->price*$currencyValue,2);
      $entertainmentTax =  0; //@round($service->entertainment_tax,2);
      $taxEntertainment = @round($price *($entertainmentTax/100),2);
      $serviceTax = 0;//@round($service->service_tax,2);
      $taxService = @round($price *($serviceTax/100),2);
      $priceTotal = @round($servicequantity*$price + $priceTotal,2);     
      $service_tax = @round(($taxService*$servicequantity) + $service_tax,2);
      $entertainment_tax = @round(($taxEntertainment * $servicequantity) + $entertainment_tax,2);
      $totalservice = $servicequantity+$totalservice;
      $service_order[] = array(
        'NAME' => $service->name,
        'AMT' => $price,
        'QTY' => $servicequantity,
      );
    }
    $totalTaxtAmt = @round($service_tax+$entertainment_tax,2);
    $subTotal = @round($priceTotal-$totalTaxtAmt,2);
    $order->total_amount = @round(($priceTotal/$currencyValue),2);
    $order->change_rate = $currencyValue;
    $order->total_service_tax = @round(($service_tax/$currencyValue),2);
    $order->total_entertainment_tax = @round(($entertainment_tax/$currencyValue),2);
    $order->creation_date = date('Y-m-d H:i:s');
    $totalAmount = round($priceTotal+$service_tax+$entertainment_tax,2);
    $order->total_services = $totalservice;
    $order->gateway_type = 'Paytm';
    $commissionType = Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'admin_commission');
    $commissionTypeValue = Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'commission_value');
    //%age wise
    if($commissionType == 1 && $commissionTypeValue > 0){
        $order->commission_amount = round(($priceTotal/$currencyValue) * ($commissionTypeValue/100),2);
    }else if($commissionType == 2 && $commissionTypeValue > 0){
        $order->commission_amount = $commissionTypeValue;
    }
    $order->save();
    // This is a one-time fee
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
      "TXN_AMOUNT" =>  $params['amount'],
      /* on completion of transaction, we will send you the response on this URL */
      "CALLBACK_URL" => $params['return_url'],
    );
    return $paytmParams;
    // Create transaction
  }
  public function onSubscriptionReturn(
      Payment_Model_Order $order,$transaction)
  {}
  public function orderBookingTransactionReturn(
    Payment_Model_Order $order, array $params = array()) {
    // Check that gateways match
    if( $order->gateway_id != $this->_gatewayInfo->gateway_id ) {
      throw new Engine_Payment_Plugin_Exception('Gateways do not match');
    }    
    // Get related info
    $user = $order->getUser();
    $orderBooking = $order->getSource();
    // Check subscription state
    if($orderBooking->state == 'active' ||
        $orderBooking->state == 'trial') {
      return 'active';
    } else if( $orderBooking->state == 'pending' ) {
      return 'pending';
    }
    // Check for cancel state - the user cancelled the transaction
    if($params['STATUS'] == 'TXN_FAILURE' ) {
      // Cancel order and subscription?
      $order->onCancel();
      $orderBooking->onOrderFailure();
      Engine_Api::_()->getDbtable('appointments', 'booking')->updateTicketOrderState(array('order_id'=>$orderBooking->order_id,'state'=>'failed'));
      // Error
      throw new Payment_Model_Exception('Your payment has been cancelled and ' .
          'not been charged. If this is not correct, please try again later.');
    }
    //payment currency
    $currentCurrency = Engine_Api::_()->booking()->getCurrentCurrency();
    $defaultCurrency = Engine_Api::_()->booking()->defaultCurrency();
    $settings = Engine_Api::_()->getApi('settings', 'core');
    $currencyValue = 1;
    if($currentCurrency != $defaultCurrency){
        $currencyValue = $settings->getSetting('sesmultiplecurrency.'.$currentCurrency);
    }
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
      $order->gateway_transaction_id = $response->id;
      $order->save();
      // Insert transaction
      $transactionsTable = Engine_Api::_()->getDbtable('transactions', 'payment');
      $transactionsTable->insert(array(
        'user_id' => $order->user_id,
        'gateway_id' => $this->_gatewayInfo->gateway_id,
        'timestamp' => new Zend_Db_Expr('NOW()'),
        'order_id' => $order->order_id,
        'type' => 'payment',
        'state' => $paymentStatus,
        'gateway_transaction_id' => $params['TXNID'],
        'amount' => $params['TXNAMOUNT'], // @todo use this or gross (-fee)?
        'currency' => $params['CURRENCY'],
      ));
      // Get benefit setting
      $giveBenefit = Engine_Api::_()->getDbtable('transactions', 'payment')
          ->getBenefitStatus($user); 
      // Check payment status
      if( $paymentStatus == 'okay' ||($paymentStatus == 'pending' && $giveBenefit) ) {
        // Update order table info
        $orderBooking->gateway_id = $this->_gatewayInfo->gateway_id;
        $orderBooking->gateway_transaction_id = $params['TXNID'];
        $orderBooking->currency_symbol = $params['CURRENCY'];
        $orderBooking->change_rate = $currencyValue;
        $orderBooking->save();
        $orderAmount = round($orderBooking->total_service_tax + $orderBooking->total_entertainment_tax + $orderBooking->total_amount,2);
        $commissionValue = round($orderBooking->commission_amount,2);
        if(isset($commissionValue) && $orderAmount > $commissionValue){
          $orderAmount = $orderAmount - $commissionValue; 
        }else{
          $orderBooking->commission_amount = 0;
        }
        //update BOOKING OWNER REMAINING amount
        $tableRemaining = Engine_Api::_()->getDbtable('remainingpayments', 'booking');
        $tableName = $tableRemaining->info('name');
        $select = $tableRemaining->select()->from($tableName)->where('professional_id =?',$orderBooking->professional_id);
        $select = $tableRemaining->fetchAll($select);
        if(count($select)){
          $tableRemaining->update(array('remaining_payment' => new Zend_Db_Expr("remaining_payment + $orderAmount")),array('professional_id =?' => $orderBooking->professional_id));
        }else{
          $tableRemaining->insert(array(
            'remaining_payment' => $orderAmount,
            'professional_id' => $orderBooking->professional_id
          ));
        }
        
        //update booking state
        $appointmentTable = Engine_Api::_()->getDbtable('appointments', 'booking');
        $select = $appointmentTable->select()->from($appointmentTable->info('name'), array('*'))->where("user_id =?", $orderBooking->owner_id)->where("professional_id =?", $orderBooking->professional_id)->where("order_id =?", $orderBooking->order_id);
        $data = $appointmentTable->fetchRow($select);
        if($data->given==$orderBooking->professional_id){
          $appointmentTable->update(
            array('state'=>'complete','saveas' => '1'),
            array('order_id =?' => $orderBooking->order_id)
         );
        }else{
          Engine_Api::_()->getDbtable('appointments', 'booking')->updateTicketOrderState(array('order_id'=>$orderBooking->order_id,'state'=>'complete'));
        }
        // Payment success
        $orderBooking->onOrderComplete();
        // send notification
        if( $orderBooking->state == 'complete' ) {
            // feeds mails work
            // $tableRemaining = Engine_Api::_()->getDbtable('appointments', 'booking');
            // $tableRemaining->update(array('remaining_payment' => new Zend_Db_Expr("remaining_payment + $orderAmount")),array('professional_id =?' => $orderBooking->professional_id));
          }
        $orderBooking->creation_date  = date('Y-m-d H:i:s');
        $orderBooking->save();
        return 'active';
      }
      else if( $paymentStatus == 'pending' ) {
        // Update order  info
        $orderBooking->gateway_id = $this->_gatewayInfo->gateway_id;
        $orderBooking->gateway_profile_id = $params['TXNID'];
        $orderBooking->save();
        // Order pending
        $orderBooking->onOrderPending();
        //update ticket state
        Engine_Api::_()->getDbtable('appointments', 'booking')->updateTicketOrderState(array('order_id'=>$orderBooking->order_id,'state'=>'pending'));
        return 'pending';
      }
      else if( $paymentStatus == 'failed' ) {
        // Cancel order and subscription?
        $order->onFailure();
        $orderBooking->onOrderFailure();
        //update ticket state
        Engine_Api::_()->getDbtable('appointments', 'booking')->updateTicketOrderState(array('order_id'=>$orderBooking->order_id,'state'=>'failed'));
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
  }
  public function onSubscriptionTransactionIpn(
      Payment_Model_Order $order,
      Engine_Payment_Ipn $ipn)
  {
  }
  public function onSubscriptionTransactionReturn(Payment_Model_Order $order,array $params = array()){}
  public function cancelSubscription($transactionId, $note = null)
  {
    $paytmParams = array();
    $paytmParams['body'] = array(
        "mid"			=> $this->_gatewayInfo->config['paytm_marchant_id'],
        "subsId"		=> $transactionId,
    );
    $checksum = getChecksumFromString(json_encode($paytmParams['body'], JSON_UNESCAPED_SLASHES), $this->_gatewayInfo->config['paytm_secret_key']);
    $paytmParams["head"] = array(
        "version" => "V1",
        "requestTimestamp" => time(),
        "tokenType" => "AES",
        "signature" => $checksum
    );
    if($this->_gatewayInfo->test_mode){
      $url = 'https://securegw-stage.paytm.in/subscription/cancel'; // for staging
    } else {
      $url = 'https://securegw.paytm.in/subscription/cancel'; // for production
    }
    $post_fields = json_encode($paytmParams, JSON_UNESCAPED_SLASHES);
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
    $response = curl_exec($ch);
    return $this;
  }

  /**
   * Generate href to a page detailing the order
   *
   * @param string $transactionId
   * @return string
   */
  public function getOrderDetailLink($orderId)
  {
    if( $this->getGateway()->getTestMode() ) {
      // Note: it doesn't work in test mode
      return 'https://dashboard.paytm.com/next/transactions';
    } else {
      return 'https://dashboard.paytm.com/next/transactions';
    }
  }

  public function getTransactionDetailLink($transactionId)
  {
    if( $this->getGateway()->getTestMode() ) {
      // Note: it doesn't work in test mode
      return 'https://dashboard.paytm.com/next/transactions';
    } else {
      return 'https://dashboard.paytm.com/next/transactions';
    }
  }

  public function getOrderDetails($orderId)
  {
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

  public function getTransactionDetails($transactionId)
  {
    return $this->getService()->detailTransaction($transactionId);
  }
  public function createOrderTransactionReturn($order,$transaction) {  
    return 'active';
  }
  function getSupportedCurrencies(){ 
      return array('INR'=>'INR');
 }

  public function getAdminGatewayForm(){
    return new Epaytm_Form_Admin_Settings_Paytm();
  }

  public function processAdminGatewayForm(array $values){
    return $values;
  }
  public function getGatewayUrl(){
  }
  function getSupportedBillingCycles(){ 
    return array(0=>'Day',2=>'Month',3=>'Year');
  }

  // IPN

  /**
   * Process an IPN
   *
   * @param Engine_Payment_Ipn $ipn
   * @return Engine_Payment_Plugin_Abstract
   */
   public function onIpn(Engine_Payment_Ipn $ipn)
  {
  }
    public function cancelResourcePackage($transactionId, $note = null) {


    }
    public function cancelStore($source, $package) {
      $paytmParams = array();
      $paytmParams['body'] = array(
          "mid"			=> MERCHANT_MID,
          "subsId"		=> "18405",
          "ssoToken"	=> "af5c035b-1ae3-4ca3-8d3c-2de1a2ba5600"
      );
      $checksum = getChecksumFromString(json_encode($paytmParams['body'], JSON_UNESCAPED_SLASHES), MERCHANT_KEY);
      $paytmParams["head"] = array(
          "version" => "V1",
          "requestTimestamp" => time(),
          "tokenType" => "AES",
          "signature" => $checksum
      );
      if($this->_gatewayInfo->test_mode){
        $url = 'https://securegw-stage.paytm.in/subscription/cancel'; // for staging
      } else {
        $url = 'https://securegw.paytm.in/subscription/cancel'; // for production
      }
      $post_fields = json_encode($paytmParams, JSON_UNESCAPED_SLASHES);
      $ch = curl_init($url);
      curl_setopt($ch, CURLOPT_POST, 1);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
      curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
      $response = curl_exec($ch);
    }
  public function onIpnTransaction($subscription){
      $package = $subscription->getPackage();
      $paytmParams = array();
      $paytmParams['body'] = array(
        "mid"	        => $this->_gatewayInfo->config['paytm_marchant_id'],
        "orderId"	        => "ORDER_".time(),
        "subscriptionId"	=> $subscription->gateway_profile_id,
        "txnAmount"		=> 
          array(
            "value"     => $params['amount'],
            "currency"	=> "INR"
          )
      );
      $checksum = getChecksumFromString(json_encode($paytmParams['body'], JSON_UNESCAPED_SLASHES), $this->_gatewayInfo->config['paytm_secret_key']);
      $paytmParams["head"] = array(
          "clientId" 			=> $subscription->user_id,
          "version"			=> "v1",
          "requestTimestamp"   => time(),
          "signature"			=> $checksum
      );
      if($this->_gatewayInfo->test_mode){
        $url = 'https://securegw-stage.paytm.in/'; // for staging
      } else {
        $url = 'https://securegw.paytm.in/'; // for production
      }
      $url = $url."subscription/renew?mid=".$this->_gatewayInfo->config['paytm_marchant_id']."&orderId=".$paytmParams["body"]["orderId"];
      $post_fields = json_encode($paytmParams, JSON_UNESCAPED_SLASHES);
      $ch = curl_init($url);
      curl_setopt($ch, CURLOPT_POST, 1);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
      curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
      $response = curl_exec($ch);
      $ordersTable = Engine_Api::_()->getDbtable('orders', 'payment');
      $transactionsTable = Engine_Api::_()->getDbtable('transactions', 'estorepackage');
      $order = null;
      $transaction = null;
      $transactionData = array(
            'gateway_id' => $this->_gatewayInfo->gateway_id,
      );
      // Transaction IPN - get order by subscription_id
      if (!$order && !empty($response['body'])) {
          $gateway_order_id = $response['body']['txnId'];
          $order = Engine_Api::_()->getItem('payment_order', $subscription->order_id);
          $transactionData['gateway_transaction_id'] = $gateway_order_id;
      }
      if (!empty($response['head'])) {
          $transactionData['creation_date'] = date('Y-m-d H:i:s', strtotime($response['head']['responseTimestamp']));
          $transactionData['total_amount'] = $params['amount'];
          $transactionData['currency_symbol'] = "INR";
          switch ($response['body']['resultInfo']['resultStatus']) {
            case 'S':
              $transactionData['type'] = 'payment';
              $transactionData['state'] = 'active';
              break;
            default:
              $transactionData['type'] = 'payment';
              $transactionData['state'] = 'failed';
              break;
          }
      } else {
        $transactionData['creation_date'] = new Zend_Db_Expr('NOW()');
      }
      if ($order) {
        $transactionData['owner_id'] = $order->user_id;
        $transactionData['order_id'] = $order->order_id;
      }
      $transactionsTable->insert($transactionData);
      if ($order) {
        $ipnProcessed = false;
        // Subscription IPN
        if ($order->source_type == 'sespage_page') {
          $this->onStoreTransactionIpn($order, $response);
          $ipnProcessed = true;
        }
        // Unknown IPN - could not be processed
        if (!$ipnProcessed) {
          throw new Engine_Payment_Plugin_Exception('Unknown order type for IPN');
        }
      }
  }
  public function onStoreTransactionIpn(Payment_Model_Order $order,  $rawData) { 
  // Check that gateways match
    if ($order->gateway_id != $this->_gatewayInfo->gateway_id) {
      throw new Engine_Payment_Plugin_Exception('Gateways do not match');
    }
    // Get related info	
    $user = $order->getUser();
    $item = $order->getSource();
    $package = $item->getPackage();
    $transaction = $item->getTransaction();
    // Get tx table
    $transactionsTable = Engine_Api::_()->getDbtable('transactions', 'estorepackage');
    switch ($rawData['body']['resultInfo']['resultStatus']) {
        case 'S':
          // Get benefit setting
          $giveBenefit = Engine_Api::_()->getDbtable('transactions', 'estorepackage')->getBenefitStatus($user);
          if ($giveBenefit) {
            $item->onPaymentSuccess();
          } else {
            $item->onPaymentPending();
          }
          break;
        case 'S': // Not sure about this one
          $item->onPaymentSuccess();
          // send notification
          /* if( $item->didStatusChange() ) {
            Engine_Api::_()->getApi('mail', 'core')->sendSystem($user, 'payment_subscription_active', array(
            'subscription_title' => $package->title,
            'subscription_description' => $package->description,
            'subscription_terms' => $package->getPackageDescription(),
            'object_link' => 'http://' . $_SERVER['HTTP_HOST'] .
            Zend_Controller_Front::getInstance()->getRouter()->assemble(array(), 'user_login', true),
            ));
            } */
          break;
        case 'F':
          $item->onPaymentFailure();
          // send notification
          /* if( $item->didStatusChange() ) {
            Engine_Api::_()->getApi('mail', 'core')->sendSystem($user, 'payment_subscription_overdue', array(
            'subscription_title' => $package->title,
            'subscription_description' => $package->description,
            'subscription_terms' => $package->getPackageDescription(),
            'object_link' => 'http://' . $_SERVER['HTTP_HOST'] .
            Zend_Controller_Front::getInstance()->getRouter()->assemble(array(), 'user_login', true),
            ));
            } */
          break;
        default:
          throw new Engine_Payment_Plugin_Exception(sprintf('Unknown IPN ' .
                  'payment status %1$s', $rawData['body']['resultInfo']['resultMsg']));
          break;
    }
    return $this;
  }
  function setConfig(){}
  function test(){}

  public function createOrderTransaction($order,$transaction) {  
    return 'active';
  }
}
