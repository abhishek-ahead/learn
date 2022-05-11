<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Controller.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Widget_BookServicesController extends Engine_Content_Widget_Abstract
{
	public function indexAction()
	{
		$this->view->is_ajax = $is_ajax = isset($_POST['is_ajax']) ? true : false;
		$this->view->professionalId = $professionalId = isset($_POST['professional']) ? $_POST['professional'] : Zend_Controller_Front::getInstance()->getRequest()->getParam("professional");
		$this->view->service_id = $service_id = Zend_Controller_Front::getInstance()->getRequest()->getParam("service");
		$userSelected = Engine_Api::_()->getItem('user',$professionalId);
		if ($is_ajax) {
			$this->view->settingid = $settingid = $_POST['setting_id'];
			if (!empty($settingid))
				$this->view->form = $from = new Booking_Form_Bookservice(array("settingId" => $settingid, "professionalId" => $professionalId));
		}
		$getCurrentDaySettings = array("mon" => 1, "tue" => 2, "wed" => 3, "thu" => 4, "fri" => 5, "sat" => 6, "sun" => 7);
		$this->view->currentDayID = $currentDayID = (empty($_POST['getDate']) ? $getCurrentDaySettings[strtolower(date("D", time()))] : $getCurrentDaySettings[strtolower(date("D",  strtotime($_POST['getDate'])))]);
		$settings = Engine_Api::_()->getDbtable('settings', 'booking')->getTableSettings(array("user_id" => $professionalId, "day" => $currentDayID));
		if (!empty($settings)) {
			$settingdurations = Engine_Api::_()->getDbtable('settingdurations', 'booking')->getDurationSettings(array("user_id" => $settings->user_id, "setting_id" => $settings->setting_id));
			$this->view->settingdurations = $settingdurations;
			$this->view->settingid = $settings->setting_id;
		}
		$viewer = Engine_Api::_()->user()->getViewer();
		$viewerTimezone = $viewer->timezone;
		$this->view->viewerTimezone = $viewerTimezone;
		$this->view->userId = $viewer->getIdentity();
		$this->view->userName = $viewer->getIdentity();
		$paySettings = Engine_Api::_()->getApi('settings', 'core');
		$this->view->isOnlinePayment = $isOnlinePayment = $paySettings->getSetting('booking.paymode');
		
		$tablename = Engine_Api::_()->getDbtable('professionals', 'booking');
		$select = $tablename->select()->from($tablename->info('name'), array('timezone', 'name'))->where("user_id =?", $professionalId);
		$data = $tablename->fetchRow($select);
		$this->view->professionalTimezone = $data->timezone;
		$this->view->professionalName = $data->name;

		$dateInAppointments = Engine_Api::_()->getDbtable('appointments', 'booking')->isDateInAppointments(array("date" => !empty($_POST['getDate']) ? $_POST['getDate'] : date('Y-m-d', time()), "professional_id" => $professionalId));
		$this->view->dateInAppointments = $dateInAppointments;

		$slotsInAppointments = array();
		foreach ($dateInAppointments as $value) {
			$slotsRange = Engine_Api::_()->getDbtable('settingdurations', 'booking')->slotsRanges(array("starttime" => $value->professionaltime, "endtime" => $value->serviceendtime));
			foreach ($slotsRange as $slotsValue) {
				$slotsInAppointments[] = $slotsValue->starttime;
			}
		}
		$this->view->slotsInAppointments = $slotsInAppointments;
	}
}
