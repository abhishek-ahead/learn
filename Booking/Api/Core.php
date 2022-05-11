<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Core.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Api_Core extends Core_Api_Abstract
{
	//remove incomplete ticket order
	public function removeIncompleteAppointments_Orders($viewerId = '')
	{
		if ($viewerId) {
			$order = Engine_Api::_()->getDbtable('orders', 'booking');
			$orderTableName = $order->info('name');
			$select = $order->select()
				->from($orderTableName, "order_id")
				->where('state ="incomplete" OR state ="failed"')
				->where($orderTableName . '.owner_id =?', $viewerId);
			$orderId = $select->query()->fetchColumn();
			if ($orderId) {
				$dbGetInsert = Engine_Db_Table::getDefaultAdapter();
				$dbGetInsert->query('DELETE FROM engine4_booking_appointments WHERE order_id = ' . $orderId);
				$dbGetInsert->query('DELETE FROM engine4_booking_appointments WHERE state="failed"');
				$dbGetInsert->query('DELETE FROM engine4_booking_orders WHERE order_id = ' . $orderId);
			} else {
				$dbGetInsert = Engine_Db_Table::getDefaultAdapter();
				$dbGetInsert->query('DELETE FROM engine4_booking_appointments WHERE state = "incomplete" AND user_id=' . $viewerId . ' AND given=' . $viewerId);
			}
		}
	}
	public function dateFormat($date = null, $changetimezone = '', $object = '', $formate = 'M d, Y h:m A')
	{
		if ($changetimezone != '' && $date) {
			$date = strtotime($date);
			$oldTz = date_default_timezone_get();
			date_default_timezone_set($object->timezone);
			if ($formate == '')
				$dateChange = date('Y-m-d h:i:s', $date);
			else {
				$dateChange = date('M d, Y h:i A', $date);
			}
			date_default_timezone_set($oldTz);
			return $dateChange . ' (' . $object->timezone . ')';
		}
		if ($date) {
			return date('M d, Y h:i A', strtotime($date));
		}
	}
	public function getAdminSuperAdmins()
	{
		$userTable = Engine_Api::_()->getDbTable('users', 'user');
		$select = $userTable->select()->from($userTable->info('name'), 'user_id')->where('level_id IN (?)', array(1, 2));
		$results = $select->query()->fetchAll();
		return $results;
	}

	//get supported currencies
	public function getSupportedCurrency()
	{
		if (!empty($_SESSION['ses_multiple_currency']['multipleCurrencyPluginActivated'])) {
			return Engine_Api::_()->sesmultiplecurrency()->getSupportedCurrency();
		} else {
			return array();
		}
	}

	public function isMultiCurrencyAvailable()
	{
		if (!empty($_SESSION['ses_multiple_currency']['multipleCurrencyPluginActivated'])) {
			return Engine_Api::_()->sesmultiplecurrency()->isMultiCurrencyAvailable();
		} else {
			return false;
		}
	}

	public function getCurrencySymbolValue($price, $currency = '', $change_rate = '')
	{
		if (!empty($_SESSION['ses_multiple_currency']['multipleCurrencyPluginActivated'])) {
			return Engine_Api::_()->sesmultiplecurrency()->getCurrencySymbolValue($price, $currency, $change_rate);
		} else {
			return false;
		}
	}

	//return price with symbol and change rate param for payment history.
	public function getCurrencyPrice($price = 0, $givenSymbol = '', $change_rate = '')
	{
		$settings = Engine_Api::_()->getApi('settings', 'core');
		$precisionValue = $settings->getSetting('sesmultiplecurrency.precision', 2);
		$defaultParams['precision'] = $precisionValue;
		if (!empty($_SESSION['ses_multiple_currency']['multipleCurrencyPluginActivated'])) {
			return Engine_Api::_()->sesmultiplecurrency()->getCurrencyPrice($price, $givenSymbol, $change_rate);
		} else {
			return Zend_Registry::get('Zend_View')->locale()->toCurrency($price, $this->getCurrentCurrency(), $defaultParams);
		}
	}

	public function getCurrentCurrency()
	{
		$settings = Engine_Api::_()->getApi('settings', 'core');
		if (!empty($_SESSION['ses_multiple_currency']['multipleCurrencyPluginActivated'])) {
			return Engine_Api::_()->sesmultiplecurrency()->getCurrentCurrency();
		} else {
			return $settings->getSetting('payment.currency', 'USD');
		}
	}

	function checkPaymentGatewayEnable()
	{
		$paymentMethods = array();
		$noPaymentGatewayEnableByAdmin = false;
		//payment to site admin
		$table = Engine_Api::_()->getDbTable('gateways', 'payment');
		$select = $table->select()->where('plugin =?', 'Payment_Plugin_Gateway_PayPal')->where('enabled =?', 1);
		$paypal = $table->fetchRow($select);
		$select = $table->select()->where('plugin =?', 'Sesadvpmnt_Plugin_Gateway_Stripe')->where('enabled =?', 1);
		$stripe = $table->fetchRow($select);
		if ($paypal) {
			$paymentMethods['paypal'] = 'paypal';
		}
		if ($stripe) {
			$paymentMethods['stripe'] = 'stripe';
		}
		if (!count($paymentMethods)) {
			$noPaymentGatewayEnableByAdmin = true;
		}
		return array('methods' => $paymentMethods, 'noPaymentGatewayEnableByAdmin' => $noPaymentGatewayEnableByAdmin, 'paypal' => $paypal);
	}

	function getRandonRagistrationCode($length)
	{
		$az = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$azr = rand(0, 51);
		$azs = substr($az, $azr, 10);
		$stamp = hash('sha256', time());
		$mt = hash('sha256', mt_rand(5, 20));
		$alpha = hash('sha256', $azs);
		$hash = str_shuffle($stamp . $mt . $alpha);
		return ucfirst(substr($hash, $azr, $length));
	}
	//randon ticket id generator
	public function generateBookingCode($length = 8, $tableName = 'orders')
	{
		$code = $this->getRandonRagistrationCode($length);
		$checkRegistrationNumber = 1;
		do {
			$checkRegistrationNumber =  Engine_Api::_()->getDbtable($tableName, 'booking')->checkRegistrationNumber($code);
			if ($checkRegistrationNumber) {
				$code = $this->getRandonRagistrationCode($length);
			}
		} while ($checkRegistrationNumber != 0);
		return $code;
	}

	public function defaultCurrency()
	{
		if (!empty($_SESSION['ses_multiple_currency']['multipleCurrencyPluginActivated'])) {
			return Engine_Api::_()->sesmultiplecurrency()->defaultCurrency();
		} else {
			$settings = Engine_Api::_()->getApi('settings', 'core');
			return $settings->getSetting('payment.currency', 'USD');
		}
	}

	function isValidFloatAndIntegerValue($number)
	{
		//reference https://stackoverflow.com/questions/3941052/php-regex-valid-float-number
		return preg_match("/^(\d+|\d*\.\d+)$/", $number);
	}

	function getTimeSlots($time, $starttime, $endtime, $pause = false)
	{
		if (!$starttime || !$endtime) {
			$starttime = "00:00";
			$endtime = "24:00";
			$end_time = strtotime($endtime); //change to strtotime
		} else {
			$end_time = $endtime; //change to strtotime
		}
		$end_time = strtotime($endtime);
		$duration = $time;  // split by 30 mins
		$array_of_start = array();
		$array_of_end = array();
		$start_time = strtotime($starttime); //change to strtotime
		$add_mins = $duration * 60;
		while ($start_time <= $end_time) { // loop between time
			$duration = date("h:i a", $start_time);
			$array_of_start[date("H:i", $start_time)] = date("h:i a (H:i)", $start_time);
			$array_of_end[(($pause) ? $pause = false : str_replace("00:00", "24:00", date('H:i', strtotime($duration))))] = date('h:i a', strtotime($duration)) . " (" . str_replace("00:00", "24:00", date('H:i', strtotime($duration))) . ")";
			$start_time += $add_mins; // to check endtie=me
		}
		array_shift($array_of_end);
		return array('start_time' => $array_of_start, 'end_time' => $array_of_end);
	}

	function buildSlots($time, $start, $end)
	{
		$start_time = strtotime($start);
		$end_time = strtotime($end);
		$addTime = $time * 60;
		$startTime = array();
		$endTime = array();
		$counter = 0;
		while ($start_time <= $end_time) {
			$startTime[] = $time = date("h:i a", $start_time);
			$endTime[] = date('h:i a', strtotime($time));
			$start_time += $addTime;
			$counter++;
		}
		array_pop($startTime);
		array_shift($endTime);
		return array('start_time' => $startTime, 'end_time' => $endTime);
	}

	function hoursToMinutes($hours)
	{
		$minutes = 0;
		if (strpos($hours, ':') !== false) {
			// Split hours and minutes.
			list($hours, $minutes) = explode('.', $hours);
		}
		return $hours * 60 + $minutes;
	}

	function minutesToHours($minutes)
	{
		$hours = (int) ($minutes / 60);
		$minutes -= $hours * 60;
		return sprintf("%d Hour %2.0f Minutes", $hours, $minutes);
	}

	//convert 00:02:00 -> 120
	/**
	 * @link http://codepad.org/v58Q5GUy
	 * @link https://stackoverflow.com/questions/24975664/how-to-convert-hhmmss-to-minutes
	 */
	function minutes($time)
	{
		$time = explode(':', $time);
		return ($time[0] * 60) + ($time[1]) + ($time[2] / 60);
	}

	// convert 120 -> 02 hours 00 minutes
	/**
	 * @link https://stackoverflow.com/questions/8563535/convert-number-of-minutes-into-hours-minutes-using-php
	 */
	function convertToHoursMins($time, $format = '%02d:%02d')
	{
		if ($time < 1) {
			return;
		}
		$hours = floor($time / 60);
		$minutes = ($time % 60);
		return sprintf($format, $hours, $minutes);
	}

	public function getWidgetParams($widgetId) {
		$db = Engine_Db_Table::getDefaultAdapter();
		$params = $db->select()
		->from('engine4_core_content', 'params')
		->where('`content_id` = ?', $widgetId)
		->query()
		->fetchColumn();
		return json_decode($params, true);
	}

	function getCountryCodes()
	{
		return array(
			'AF' =>
			array(
				'code' => '93',
				'name' => 'AFGHANISTAN',
			),
			'AL' =>
			array(
				'code' => '355',
				'name' => 'ALBANIA',
			),
			'DZ' =>
			array(
				'code' => '213',
				'name' => 'ALGERIA',
			),
			'AS' =>
			array(
				'code' => '1684',
				'name' => 'AMERICAN SAMOA',
			),
			'AD' =>
			array(
				'code' => '376',
				'name' => 'ANDORRA',
			),
			'AO' =>
			array(
				'code' => '244',
				'name' => 'ANGOLA',
			),
			'AI' =>
			array(
				'code' => '1264',
				'name' => 'ANGUILLA',
			),
			'AQ' =>
			array(
				'code' => '672',
				'name' => 'ANTARCTICA',
			),
			'AG' =>
			array(
				'code' => '1268',
				'name' => 'ANTIGUA AND BARBUDA',
			),
			'AR' =>
			array(
				'code' => '54',
				'name' => 'ARGENTINA',
			),
			'AM' =>
			array(
				'code' => '374',
				'name' => 'ARMENIA',
			),
			'AW' =>
			array(
				'code' => '297',
				'name' => 'ARUBA',
			),
			'AU' =>
			array(
				'code' => '61',
				'name' => 'AUSTRALIA',
			),
			'AT' =>
			array(
				'code' => '43',
				'name' => 'AUSTRIA',
			),
			'AZ' =>
			array(
				'code' => '994',
				'name' => 'AZERBAIJAN',
			),
			'BS' =>
			array(
				'code' => '1242',
				'name' => 'BAHAMAS',
			),
			'BH' =>
			array(
				'code' => '973',
				'name' => 'BAHRAIN',
			),
			'BD' =>
			array(
				'code' => '880',
				'name' => 'BANGLADESH',
			),
			'BB' =>
			array(
				'code' => '1246',
				'name' => 'BARBADOS',
			),
			'BY' =>
			array(
				'code' => '375',
				'name' => 'BELARUS',
			),
			'BE' =>
			array(
				'code' => '32',
				'name' => 'BELGIUM',
			),
			'BZ' =>
			array(
				'code' => '501',
				'name' => 'BELIZE',
			),
			'BJ' =>
			array(
				'code' => '229',
				'name' => 'BENIN',
			),
			'BM' =>
			array(
				'code' => '1441',
				'name' => 'BERMUDA',
			),
			'BT' =>
			array(
				'code' => '975',
				'name' => 'BHUTAN',
			),
			'BO' =>
			array(
				'code' => '591',
				'name' => 'BOLIVIA',
			),
			'BA' =>
			array(
				'code' => '387',
				'name' => 'BOSNIA AND HERZEGOVINA',
			),
			'BW' =>
			array(
				'code' => '267',
				'name' => 'BOTSWANA',
			),
			'BR' =>
			array(
				'code' => '55',
				'name' => 'BRAZIL',
			),
			'BN' =>
			array(
				'code' => '673',
				'name' => 'BRUNEI DARUSSALAM',
			),
			'BG' =>
			array(
				'code' => '359',
				'name' => 'BULGARIA',
			),
			'BF' =>
			array(
				'code' => '226',
				'name' => 'BURKINA FASO',
			),
			'BI' =>
			array(
				'code' => '257',
				'name' => 'BURUNDI',
			),
			'KH' =>
			array(
				'code' => '855',
				'name' => 'CAMBODIA',
			),
			'CM' =>
			array(
				'code' => '237',
				'name' => 'CAMEROON',
			),
			'CA' =>
			array(
				'code' => '1',
				'name' => 'CANADA',
			),
			'CV' =>
			array(
				'code' => '238',
				'name' => 'CAPE VERDE',
			),
			'KY' =>
			array(
				'code' => '1345',
				'name' => 'CAYMAN ISLANDS',
			),
			'CF' =>
			array(
				'code' => '236',
				'name' => 'CENTRAL AFRICAN REPUBLIC',
			),
			'TD' =>
			array(
				'code' => '235',
				'name' => 'CHAD',
			),
			'CL' =>
			array(
				'code' => '56',
				'name' => 'CHILE',
			),
			'CN' =>
			array(
				'code' => '86',
				'name' => 'CHINA',
			),
			'CX' =>
			array(
				'code' => '61',
				'name' => 'CHRISTMAS ISLAND',
			),
			'CC' =>
			array(
				'code' => '61',
				'name' => 'COCOS (KEELING) ISLANDS',
			),
			'CO' =>
			array(
				'code' => '57',
				'name' => 'COLOMBIA',
			),
			'KM' =>
			array(
				'code' => '269',
				'name' => 'COMOROS',
			),
			'CG' =>
			array(
				'code' => '242',
				'name' => 'CONGO',
			),
			'CD' =>
			array(
				'code' => '243',
				'name' => 'CONGO, THE DEMOCRATIC REPUBLIC OF THE',
			),
			'CK' =>
			array(
				'code' => '682',
				'name' => 'COOK ISLANDS',
			),
			'CR' =>
			array(
				'code' => '506',
				'name' => 'COSTA RICA',
			),
			'CI' =>
			array(
				'code' => '225',
				'name' => 'COTE D IVOIRE',
			),
			'HR' =>
			array(
				'code' => '385',
				'name' => 'CROATIA',
			),
			'CU' =>
			array(
				'code' => '53',
				'name' => 'CUBA',
			),
			'CY' =>
			array(
				'code' => '357',
				'name' => 'CYPRUS',
			),
			'CZ' =>
			array(
				'code' => '420',
				'name' => 'CZECH REPUBLIC',
			),
			'DK' =>
			array(
				'code' => '45',
				'name' => 'DENMARK',
			),
			'DJ' =>
			array(
				'code' => '253',
				'name' => 'DJIBOUTI',
			),
			'DM' =>
			array(
				'code' => '1767',
				'name' => 'DOMINICA',
			),
			'DO' =>
			array(
				'code' => '1809',
				'name' => 'DOMINICAN REPUBLIC',
			),
			'EC' =>
			array(
				'code' => '593',
				'name' => 'ECUADOR',
			),
			'EG' =>
			array(
				'code' => '20',
				'name' => 'EGYPT',
			),
			'SV' =>
			array(
				'code' => '503',
				'name' => 'EL SALVADOR',
			),
			'GQ' =>
			array(
				'code' => '240',
				'name' => 'EQUATORIAL GUINEA',
			),
			'ER' =>
			array(
				'code' => '291',
				'name' => 'ERITREA',
			),
			'EE' =>
			array(
				'code' => '372',
				'name' => 'ESTONIA',
			),
			'ET' =>
			array(
				'code' => '251',
				'name' => 'ETHIOPIA',
			),
			'FK' =>
			array(
				'code' => '500',
				'name' => 'FALKLAND ISLANDS (MALVINAS)',
			),
			'FO' =>
			array(
				'code' => '298',
				'name' => 'FAROE ISLANDS',
			),
			'FJ' =>
			array(
				'code' => '679',
				'name' => 'FIJI',
			),
			'FI' =>
			array(
				'code' => '358',
				'name' => 'FINLAND',
			),
			'FR' =>
			array(
				'code' => '33',
				'name' => 'FRANCE',
			),
			'PF' =>
			array(
				'code' => '689',
				'name' => 'FRENCH POLYNESIA',
			),
			'GA' =>
			array(
				'code' => '241',
				'name' => 'GABON',
			),
			'GM' =>
			array(
				'code' => '220',
				'name' => 'GAMBIA',
			),
			'GE' =>
			array(
				'code' => '995',
				'name' => 'GEORGIA',
			),
			'DE' =>
			array(
				'code' => '49',
				'name' => 'GERMANY',
			),
			'GH' =>
			array(
				'code' => '233',
				'name' => 'GHANA',
			),
			'GI' =>
			array(
				'code' => '350',
				'name' => 'GIBRALTAR',
			),
			'GR' =>
			array(
				'code' => '30',
				'name' => 'GREECE',
			),
			'GL' =>
			array(
				'code' => '299',
				'name' => 'GREENLAND',
			),
			'GD' =>
			array(
				'code' => '1473',
				'name' => 'GRENADA',
			),
			'GU' =>
			array(
				'code' => '1671',
				'name' => 'GUAM',
			),
			'GT' =>
			array(
				'code' => '502',
				'name' => 'GUATEMALA',
			),
			'GN' =>
			array(
				'code' => '224',
				'name' => 'GUINEA',
			),
			'GW' =>
			array(
				'code' => '245',
				'name' => 'GUINEA-BISSAU',
			),
			'GY' =>
			array(
				'code' => '592',
				'name' => 'GUYANA',
			),
			'HT' =>
			array(
				'code' => '509',
				'name' => 'HAITI',
			),
			'VA' =>
			array(
				'code' => '39',
				'name' => 'HOLY SEE (VATICAN CITY STATE)',
			),
			'HN' =>
			array(
				'code' => '504',
				'name' => 'HONDURAS',
			),
			'HK' =>
			array(
				'code' => '852',
				'name' => 'HONG KONG',
			),
			'HU' =>
			array(
				'code' => '36',
				'name' => 'HUNGARY',
			),
			'IS' =>
			array(
				'code' => '354',
				'name' => 'ICELAND',
			),
			'IN' =>
			array(
				'code' => '91',
				'name' => 'INDIA',
			),
			'ID' =>
			array(
				'code' => '62',
				'name' => 'INDONESIA',
			),
			'IR' =>
			array(
				'code' => '98',
				'name' => 'IRAN, ISLAMIC REPUBLIC OF',
			),
			'IQ' =>
			array(
				'code' => '964',
				'name' => 'IRAQ',
			),
			'IE' =>
			array(
				'code' => '353',
				'name' => 'IRELAND',
			),
			'IM' =>
			array(
				'code' => '44',
				'name' => 'ISLE OF MAN',
			),
			'IL' =>
			array(
				'code' => '972',
				'name' => 'ISRAEL',
			),
			'IT' =>
			array(
				'code' => '39',
				'name' => 'ITALY',
			),
			'JM' =>
			array(
				'code' => '1876',
				'name' => 'JAMAICA',
			),
			'JP' =>
			array(
				'code' => '81',
				'name' => 'JAPAN',
			),
			'JO' =>
			array(
				'code' => '962',
				'name' => 'JORDAN',
			),
			'KZ' =>
			array(
				'code' => '7',
				'name' => 'KAZAKSTAN',
			),
			'KE' =>
			array(
				'code' => '254',
				'name' => 'KENYA',
			),
			'KI' =>
			array(
				'code' => '686',
				'name' => 'KIRIBATI',
			),
			'KP' =>
			array(
				'code' => '850',
				'name' => 'KOREA DEMOCRATIC PEOPLES REPUBLIC OF',
			),
			'KR' =>
			array(
				'code' => '82',
				'name' => 'KOREA REPUBLIC OF',
			),
			'XK' =>
			array(
				'code' => '381',
				'name' => 'KOSOVO',
			),
			'KW' =>
			array(
				'code' => '965',
				'name' => 'KUWAIT',
			),
			'KG' =>
			array(
				'code' => '996',
				'name' => 'KYRGYZSTAN',
			),
			'LA' =>
			array(
				'code' => '856',
				'name' => 'LAO PEOPLES DEMOCRATIC REPUBLIC',
			),
			'LV' =>
			array(
				'code' => '371',
				'name' => 'LATVIA',
			),
			'LB' =>
			array(
				'code' => '961',
				'name' => 'LEBANON',
			),
			'LS' =>
			array(
				'code' => '266',
				'name' => 'LESOTHO',
			),
			'LR' =>
			array(
				'code' => '231',
				'name' => 'LIBERIA',
			),
			'LY' =>
			array(
				'code' => '218',
				'name' => 'LIBYAN ARAB JAMAHIRIYA',
			),
			'LI' =>
			array(
				'code' => '423',
				'name' => 'LIECHTENSTEIN',
			),
			'LT' =>
			array(
				'code' => '370',
				'name' => 'LITHUANIA',
			),
			'LU' =>
			array(
				'code' => '352',
				'name' => 'LUXEMBOURG',
			),
			'MO' =>
			array(
				'code' => '853',
				'name' => 'MACAU',
			),
			'MK' =>
			array(
				'code' => '389',
				'name' => 'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF',
			),
			'MG' =>
			array(
				'code' => '261',
				'name' => 'MADAGASCAR',
			),
			'MW' =>
			array(
				'code' => '265',
				'name' => 'MALAWI',
			),
			'MY' =>
			array(
				'code' => '60',
				'name' => 'MALAYSIA',
			),
			'MV' =>
			array(
				'code' => '960',
				'name' => 'MALDIVES',
			),
			'ML' =>
			array(
				'code' => '223',
				'name' => 'MALI',
			),
			'MT' =>
			array(
				'code' => '356',
				'name' => 'MALTA',
			),
			'MH' =>
			array(
				'code' => '692',
				'name' => 'MARSHALL ISLANDS',
			),
			'MR' =>
			array(
				'code' => '222',
				'name' => 'MAURITANIA',
			),
			'MU' =>
			array(
				'code' => '230',
				'name' => 'MAURITIUS',
			),
			'YT' =>
			array(
				'code' => '262',
				'name' => 'MAYOTTE',
			),
			'MX' =>
			array(
				'code' => '52',
				'name' => 'MEXICO',
			),
			'FM' =>
			array(
				'code' => '691',
				'name' => 'MICRONESIA, FEDERATED STATES OF',
			),
			'MD' =>
			array(
				'code' => '373',
				'name' => 'MOLDOVA, REPUBLIC OF',
			),
			'MC' =>
			array(
				'code' => '377',
				'name' => 'MONACO',
			),
			'MN' =>
			array(
				'code' => '976',
				'name' => 'MONGOLIA',
			),
			'ME' =>
			array(
				'code' => '382',
				'name' => 'MONTENEGRO',
			),
			'MS' =>
			array(
				'code' => '1664',
				'name' => 'MONTSERRAT',
			),
			'MA' =>
			array(
				'code' => '212',
				'name' => 'MOROCCO',
			),
			'MZ' =>
			array(
				'code' => '258',
				'name' => 'MOZAMBIQUE',
			),
			'MM' =>
			array(
				'code' => '95',
				'name' => 'MYANMAR',
			),
			'NA' =>
			array(
				'code' => '264',
				'name' => 'NAMIBIA',
			),
			'NR' =>
			array(
				'code' => '674',
				'name' => 'NAURU',
			),
			'NP' =>
			array(
				'code' => '977',
				'name' => 'NEPAL',
			),
			'NL' =>
			array(
				'code' => '31',
				'name' => 'NETHERLANDS',
			),
			'AN' =>
			array(
				'code' => '599',
				'name' => 'NETHERLANDS ANTILLES',
			),
			'NC' =>
			array(
				'code' => '687',
				'name' => 'NEW CALEDONIA',
			),
			'NZ' =>
			array(
				'code' => '64',
				'name' => 'NEW ZEALAND',
			),
			'NI' =>
			array(
				'code' => '505',
				'name' => 'NICARAGUA',
			),
			'NE' =>
			array(
				'code' => '227',
				'name' => 'NIGER',
			),
			'NG' =>
			array(
				'code' => '234',
				'name' => 'NIGERIA',
			),
			'NU' =>
			array(
				'code' => '683',
				'name' => 'NIUE',
			),
			'MP' =>
			array(
				'code' => '1670',
				'name' => 'NORTHERN MARIANA ISLANDS',
			),
			'NO' =>
			array(
				'code' => '47',
				'name' => 'NORWAY',
			),
			'OM' =>
			array(
				'code' => '968',
				'name' => 'OMAN',
			),
			'PK' =>
			array(
				'code' => '92',
				'name' => 'PAKISTAN',
			),
			'PW' =>
			array(
				'code' => '680',
				'name' => 'PALAU',
			),
			'PA' =>
			array(
				'code' => '507',
				'name' => 'PANAMA',
			),
			'PG' =>
			array(
				'code' => '675',
				'name' => 'PAPUA NEW GUINEA',
			),
			'PY' =>
			array(
				'code' => '595',
				'name' => 'PARAGUAY',
			),
			'PE' =>
			array(
				'code' => '51',
				'name' => 'PERU',
			),
			'PH' =>
			array(
				'code' => '63',
				'name' => 'PHILIPPINES',
			),
			'PN' =>
			array(
				'code' => '870',
				'name' => 'PITCAIRN',
			),
			'PL' =>
			array(
				'code' => '48',
				'name' => 'POLAND',
			),
			'PT' =>
			array(
				'code' => '351',
				'name' => 'PORTUGAL',
			),
			'PR' =>
			array(
				'code' => '1',
				'name' => 'PUERTO RICO',
			),
			'QA' =>
			array(
				'code' => '974',
				'name' => 'QATAR',
			),
			'RO' =>
			array(
				'code' => '40',
				'name' => 'ROMANIA',
			),
			'RU' =>
			array(
				'code' => '7',
				'name' => 'RUSSIAN FEDERATION',
			),
			'RW' =>
			array(
				'code' => '250',
				'name' => 'RWANDA',
			),
			'BL' =>
			array(
				'code' => '590',
				'name' => 'SAINT BARTHELEMY',
			),
			'SH' =>
			array(
				'code' => '290',
				'name' => 'SAINT HELENA',
			),
			'KN' =>
			array(
				'code' => '1869',
				'name' => 'SAINT KITTS AND NEVIS',
			),
			'LC' =>
			array(
				'code' => '1758',
				'name' => 'SAINT LUCIA',
			),
			'MF' =>
			array(
				'code' => '1599',
				'name' => 'SAINT MARTIN',
			),
			'PM' =>
			array(
				'code' => '508',
				'name' => 'SAINT PIERRE AND MIQUELON',
			),
			'VC' =>
			array(
				'code' => '1784',
				'name' => 'SAINT VINCENT AND THE GRENADINES',
			),
			'WS' =>
			array(
				'code' => '685',
				'name' => 'SAMOA',
			),
			'SM' =>
			array(
				'code' => '378',
				'name' => 'SAN MARINO',
			),
			'ST' =>
			array(
				'code' => '239',
				'name' => 'SAO TOME AND PRINCIPE',
			),
			'SA' =>
			array(
				'code' => '966',
				'name' => 'SAUDI ARABIA',
			),
			'SN' =>
			array(
				'code' => '221',
				'name' => 'SENEGAL',
			),
			'RS' =>
			array(
				'code' => '381',
				'name' => 'SERBIA',
			),
			'SC' =>
			array(
				'code' => '248',
				'name' => 'SEYCHELLES',
			),
			'SL' =>
			array(
				'code' => '232',
				'name' => 'SIERRA LEONE',
			),
			'SG' =>
			array(
				'code' => '65',
				'name' => 'SINGAPORE',
			),
			'SK' =>
			array(
				'code' => '421',
				'name' => 'SLOVAKIA',
			),
			'SI' =>
			array(
				'code' => '386',
				'name' => 'SLOVENIA',
			),
			'SB' =>
			array(
				'code' => '677',
				'name' => 'SOLOMON ISLANDS',
			),
			'SO' =>
			array(
				'code' => '252',
				'name' => 'SOMALIA',
			),
			'ZA' =>
			array(
				'code' => '27',
				'name' => 'SOUTH AFRICA',
			),
			'ES' =>
			array(
				'code' => '34',
				'name' => 'SPAIN',
			),
			'LK' =>
			array(
				'code' => '94',
				'name' => 'SRI LANKA',
			),
			'SD' =>
			array(
				'code' => '249',
				'name' => 'SUDAN',
			),
			'SR' =>
			array(
				'code' => '597',
				'name' => 'SURINAME',
			),
			'SZ' =>
			array(
				'code' => '268',
				'name' => 'SWAZILAND',
			),
			'SE' =>
			array(
				'code' => '46',
				'name' => 'SWEDEN',
			),
			'CH' =>
			array(
				'code' => '41',
				'name' => 'SWITZERLAND',
			),
			'SY' =>
			array(
				'code' => '963',
				'name' => 'SYRIAN ARAB REPUBLIC',
			),
			'TW' =>
			array(
				'code' => '886',
				'name' => 'TAIWAN, PROVINCE OF CHINA',
			),
			'TJ' =>
			array(
				'code' => '992',
				'name' => 'TAJIKISTAN',
			),
			'TZ' =>
			array(
				'code' => '255',
				'name' => 'TANZANIA, UNITED REPUBLIC OF',
			),
			'TH' =>
			array(
				'code' => '66',
				'name' => 'THAILAND',
			),
			'TL' =>
			array(
				'code' => '670',
				'name' => 'TIMOR-LESTE',
			),
			'TG' =>
			array(
				'code' => '228',
				'name' => 'TOGO',
			),
			'TK' =>
			array(
				'code' => '690',
				'name' => 'TOKELAU',
			),
			'TO' =>
			array(
				'code' => '676',
				'name' => 'TONGA',
			),
			'TT' =>
			array(
				'code' => '1868',
				'name' => 'TRINIDAD AND TOBAGO',
			),
			'TN' =>
			array(
				'code' => '216',
				'name' => 'TUNISIA',
			),
			'TR' =>
			array(
				'code' => '90',
				'name' => 'TURKEY',
			),
			'TM' =>
			array(
				'code' => '993',
				'name' => 'TURKMENISTAN',
			),
			'TC' =>
			array(
				'code' => '1649',
				'name' => 'TURKS AND CAICOS ISLANDS',
			),
			'TV' =>
			array(
				'code' => '688',
				'name' => 'TUVALU',
			),
			'UG' =>
			array(
				'code' => '256',
				'name' => 'UGANDA',
			),
			'UA' =>
			array(
				'code' => '380',
				'name' => 'UKRAINE',
			),
			'AE' =>
			array(
				'code' => '971',
				'name' => 'UNITED ARAB EMIRATES',
			),
			'GB' =>
			array(
				'code' => '44',
				'name' => 'UNITED KINGDOM',
			),
			'US' =>
			array(
				'code' => '1',
				'name' => 'UNITED STATES',
			),
			'UY' =>
			array(
				'code' => '598',
				'name' => 'URUGUAY',
			),
			'UZ' =>
			array(
				'code' => '998',
				'name' => 'UZBEKISTAN',
			),
			'VU' =>
			array(
				'code' => '678',
				'name' => 'VANUATU',
			),
			'VE' =>
			array(
				'code' => '58',
				'name' => 'VENEZUELA',
			),
			'VN' =>
			array(
				'code' => '84',
				'name' => 'VIET NAM',
			),
			'VG' =>
			array(
				'code' => '1284',
				'name' => 'VIRGIN ISLANDS, BRITISH',
			),
			'VI' =>
			array(
				'code' => '1340',
				'name' => 'VIRGIN ISLANDS, U.S.',
			),
			'WF' =>
			array(
				'code' => '681',
				'name' => 'WALLIS AND FUTUNA',
			),
			'YE' =>
			array(
				'code' => '967',
				'name' => 'YEMEN',
			),
			'ZM' =>
			array(
				'code' => '260',
				'name' => 'ZAMBIA',
			),
			'ZW' =>
			array(
				'code' => '263',
				'name' => 'ZIMBABWE',
			),
		);
	}
}
