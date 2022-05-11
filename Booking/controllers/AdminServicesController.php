<?php
/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: AdminServicesController.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_AdminServicesController extends Core_Controller_Action_Admin
{

	public function indexAction()
	{
		$this->view->navigation = $navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_main_services');
		$this->view->form = $form = new Booking_Form_Admin_Settings_Services();
		$values = array();
		if ($form->isValid($this->_getAllParams()))
			$values = $form->getValues();
			$bookingServices = Engine_Api::_()->getItemTable('booking_service');
			$bookingServicesTableName = $bookingServices->info('name');
			$professionalTableName = Engine_Api::_()->getItemTable('professional')->info('name');
			$select = $bookingServices->select()
							->from($bookingServicesTableName,array("*"))
							->setIntegrityCheck(false)
							->joinLeft($professionalTableName, "$bookingServicesTableName.user_id = $professionalTableName.user_id", array('name as professional_name','active as professional_active'))
							->order('service_id DESC');
							$select->where($professionalTableName.'.active=?',1);
			if (!empty($_GET['servicename']))
				$select->where($bookingServicesTableName . '.name LIKE ?', $_GET['servicename'] . '%');
			if (!empty($_GET['providername']))
				$select->where($professionalTableName . '.name LIKE ?', '%' . $_GET['providername'] . '%');
			if (!empty($_GET['price']))
				$select->where($bookingServicesTableName . '.price =?',$_GET['price']);
			$paginator = Zend_Paginator::factory($select);
			$this->view->paginator = $paginator;
			$paginator->setItemCountPerPage(100);
			$paginator->setCurrentPageNumber($this->_getParam('page', 1));
	}
	public function enabledAction()
	{
		$viewer = Engine_Api::_()->user()->getViewer();
		$id = $this->_getParam('id');
		if (!empty($id)) {
			$item = Engine_Api::_()->getItem('booking_service', $id);
			$item->active = !$item->active;
			$item->save();
			if ($item->active) {
				Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($item->getOwner(), $viewer, $item, 'booking_adminserapd');
				Engine_Api::_()->getApi('mail', 'core')->sendSystem(
					$viewer,
					'booking_adminserapl',
					array(
						'host' => $_SERVER['HTTP_HOST'],
						'service_name' => $item->name,
						'queue' => false,
						'recipient_title' => $viewer->displayname,
						'object_link' =>  $item->getHref(),
					)
				);
			} else {
				Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($item->getOwner(), $viewer, $item, 'booking_adminserdapd');
				Engine_Api::_()->getApi('mail', 'core')->sendSystem(
					$viewer,
					'booking_adminserdapd',
					array(
						'host' => $_SERVER['HTTP_HOST'],
						'service_name' => $item->name,
						'queue' => false,
						'recipient_title' => $viewer->displayname,
						'object_link' =>  $item->getHref(),
					)
				);
			}
		}
		$this->_redirect('admin/booking/services');
	}
}
