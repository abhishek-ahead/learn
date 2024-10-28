<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    Payment
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: Core.php 9747 2012-07-26 02:08:08Z john $
 * @author     John Boehr <j@webligo.com>
 */

/**
 * @category   Application_Core
 * @package    Payment
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 */
class Payment_Api_Core extends Core_Api_Abstract {

  public function isOneTime($params = array()) {
    return ( $params[0] <= 0 || $params[1] == 'forever' );
  }
  
  public function getPackageDescription($params = array(), $price = null) {
  
    $translate = Zend_Registry::get('Zend_Translate');
    $view = Zend_Registry::get('Zend_View');
    
    $priceStr = $this->getCurrencyPrice($price,'','','');

    // Plan is free
    if( $price == 0 ) {
      $str = $translate->translate('Free');
    }
    // Plan is recurring
    else if( $params[0] > 0 && $params[1] != 'forever' ) {

      // Make full string
      if( $params[0] == 1 ) { // (Week|Month|Year)ly
        if( $params[1] == 'day' ) {
          $typeStr = $translate->translate('daily');
        } else {
          $typeStr = $translate->translate($params[1] . 'ly');
        }
        $str = sprintf($translate->translate('%1$s %2$s'), $priceStr, $typeStr);
      } else { // per x (Week|Month|Year)s
        $typeStr = $translate->translate(array($params[1], $params[1] . 's', $params[0]));
        $str = sprintf($translate->translate('%1$s per %2$s %3$s'), $priceStr,
        $params[0], $typeStr); // @todo currency
      }
    }
    // Plan is one-time
    else {
      $str = sprintf($translate->translate('One-time fee of %1$s'), $priceStr);
    }
    
//     // Add duration, if not forever
//     if( $this->duration > 0 && $this->duration_type != 'forever' ) {
//     $typeStr = $translate->translate(array($this->duration_type, $this->duration_type . 's', $this->duration));
//     $str = sprintf($translate->translate('%1$s for %2$s %3$s'), $str, $this->duration, $typeStr);
//     }

    return $str;
  }
  
  public function getExpirationDate($rel = null)
  {
    if( null === $rel ) {
        $rel = time();
    }

    // If it's a one-time payment or a free package with no duration, there
    // is no expiration
    if( ($this->isOneTime($rel))) {
      return false;
    }
    

    // If this is a free or one-time package, the expiration is based on the
    // duration, otherwise the expirations is based on the recurrence
    $interval = null;
    $interval_type = null;
    if( $this->isOneTime($rel) ) {
      $interval = $this->duration;
      $interval_type = $this->duration_type;
    } else {
      $interval = $rel[0]; //$this->recurrence;
      $interval_type = $rel[1]; //$this->recurrence_type;
    }

    // This is weird, it should have been handled by the statement at the top
    if( $interval == 'forever' ) {
      return false;
    }

    // Calculate when the next payment should be due
    switch( $interval_type ) {
    case 'day':
        $part = Zend_Date::DAY;
        break;
    case 'week':
        $part = Zend_Date::WEEK;
        break;
    case 'month':
        $part = Zend_Date::MONTH;
        break;
    case 'year':
        $part = Zend_Date::YEAR;
        break;
    default:
        throw new Engine_Payment_Exception('Invalid recurrence_type');
        break;
    }

    $relDate = new Zend_Date(time());
    $relDate->add((int) $interval, $part);

    return $relDate->toValue();
  }
  
  public function defaultCurrency() {
    return Engine_Api::_()->getApi('settings', 'core')->getSetting('payment.currency', 'USD');
  }
  
  public function getCurrencySymbolValue($price, $currency = '', $change_rate = '') {
  
    $currentCurrency = !empty($_SESSION['current_currencyId']) ? $_SESSION['current_currencyId'] : (!empty($_COOKIE['current_currencyId']) ? $_COOKIE['current_currencyId'] : $currency );
    
    $settings = Engine_Api::_()->getApi('settings', 'core');
    if ($currentCurrency != '') {
      $currencyData = Engine_Api::_()->getDbTable('currencies', 'payment')->getCurrency($currentCurrency);
      if ($currencyData->change_rate != '' && $change_rate->change_rate == '') {
        return $currencyData->change_rate * $price;
      } else if ($change_rate != '') {
        return $change_rate * $price;
      }
    }
    return '';
  }
  
  // Return price with code and change rate param for payment history.
  public function getCurrencyPrice($price = 0, $givenSymbol = '', $change_rate = '',$returnPrice = "") {

    $price = (float) $price;
    $defaultParams['precision'] = 2;
    if ($givenSymbol == '') {
      $defaultCurrency = $this->defaultCurrency();
      if (isset($_COOKIE['current_currencyId']) && !empty($_COOKIE['current_currencyId']) && $_COOKIE['current_currencyId'] != $defaultCurrency) {
        $changePrice = $this->getCurrencySymbolValue($price, '', $change_rate);
        $currency = $_COOKIE['current_currencyId'];
        if ($changePrice != '')
          $price = $changePrice;
      } else if (isset($_SESSION['current_currencyId']) && !empty($_SESSION['current_currencyId']) && $_SESSION['current_currencyId'] != $defaultCurrency) {
        $changePrice = $this->getCurrencySymbolValue($price, '', $change_rate);
        $currency = $_SESSION['current_currencyId'];
        if ($changePrice != '')
          $price = $changePrice;
      } else
        $currency = $defaultCurrency;
    } else if ($change_rate != '') {
      $changePrice = $this->getCurrencySymbolValue($price, '', $change_rate);
      if ($changePrice != '')
        $price = $changePrice;
      $currency = $givenSymbol;
    } else
      $currency = $givenSymbol;
      
    if($returnPrice)
      return $price;

    $currencyData = Engine_Api::_()->getDbTable('currencies', 'payment')->getCurrency(array('code' => $currency));
    
    if($currencyData->placement == 'pre')
      $priceStr = $currencyData->symbol . number_format($price, 2, '.', $currencyData->seprator);
    else if($currencyData->placement == 'post')
      $priceStr = number_format($price, 2, '.', $currencyData->seprator). $currencyData->symbol;

    return $priceStr;
  }
  
  public function getCurrentCurrency() {
    return !empty($_SESSION['current_currencyId']) ? $_SESSION['current_currencyId'] : (empty($_COOKIE['current_currencyId']) ? $this->defaultCurrency() : $_COOKIE['current_currencyId']);
  }
  
  public function updateCurrencyValues() {
    
    $settings = Engine_Api::_()->getApi('settings', 'core');
    
    $apikey = $settings->getSetting('payment.currencyapikey','');
    if(!$apikey)
      return;
      
    $defaultCurrency = $this->defaultCurrency();
    if (!$defaultCurrency)
      return;

    $currencies = Engine_Api::_()->getDbTable('currencies', 'payment')->getCurrencies(array('enabled' => 1));
    foreach ($currencies as $currency) {
    
      if ($defaultCurrency == $currency->code)
        continue;
      
      $from_Currency = urlencode($defaultCurrency);
      $to_Currency = urlencode($currency->code);
      $query = $from_Currency.'_'.$to_Currency;
      $url = "https://free.currconv.com/api/v7/convert?&compact=ultra&apiKey=".$apikey.'&q='.$query;
      $get = file_get_contents($url);
      
      $obj = json_decode($get,true);
      $val = floatval($obj["$query"]);
      
      if (!empty($val)) {
        $currency->change_rate = $val;
        $currency->save();
      } else {
        $_SESSION['apiError'] =  "Free API limit reached.";
        break;
      }
    }
  }
}
