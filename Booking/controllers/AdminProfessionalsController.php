<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: AdminProfessionalsController.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_AdminProfessionalsController extends Core_Controller_Action_Admin
{

	public function indexAction()
	{
		$this->view->navigation = $navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_main_professionals');
		$this->view->form = $form = new Booking_Form_Admin_Settings_Professionals();
		$result = array();
		if ($this->getRequest()->isPost() && $form->isValid($this->_getAllParams())) {
			$result = $this->_getAllParams();
		}
		$result["page"] = 1;
		$result["limit"] = 10;
		$table = Engine_Api::_()->getDbTable('professionals', 'booking')->getAllProfessionals($result);
		$this->view->paginator = $paginator = $table;
		$paginator->setItemCountPerPage(20);
		$paginator->setCurrentPageNumber(1);
	}

	public function enabledAction()
	{
		$viewer = Engine_Api::_()->user()->getViewer();
		$id = $this->_getParam('id');
		if (!empty($id)) {
			$item = Engine_Api::_()->getItem('professional', $id);
			$item->active = !$item->active;
			$item->save();
			if ($item->active) {
				$professionalProfileUrl = '<a href="'.$item->getHref().'"></a>';
				Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($item->getOwner(), $viewer, $item, 'booking_adminprofapd',array('professionalLink'=>$professionalProfileUrl));
				Engine_Api::_()->getApi('mail', 'core')->sendSystem(
					$viewer,
					'booking_adminprofapd',
					array(
						'host' => $_SERVER['HTTP_HOST'],
						'professional_name' => $item->name,
						'queue' => false,
						'recipient_title' => $viewer->displayname,
						'object_link' =>  $item->getHref(),
					)
				);
			} else {
				Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($item->getOwner(), $viewer, $item, 'booking_adminprofdapd');
				Engine_Api::_()->getApi('mail', 'core')->sendSystem(
					$viewer,
					'booking_adminprofdapd',
					array(
						'host' => $_SERVER['HTTP_HOST'],
						'professional_name' => $item->name,
						'queue' => false,
						'recipient_title' => $viewer->displayname,
						'object_link' =>  $item->getHref(),
					)
				);
			}
		}
		$this->_redirect('admin/booking/professionals');
	}

	public function deleteAction()
	{
		$this->_helper->layout->setLayout('default-simple');
		$this->view->form = $form = new Sesbasic_Form_Delete();
		$form->setTitle('Delete professional?');
    $form->setDescription('Are you sure that you want to delete this professional profile and its service as well?');
    $form->submit->setLabel('Delete');
		$professional_id = $this->_getParam("professional_id");
		$professional = Engine_Api::_()->getItem('professional', $professional_id);
		if ($this->getRequest()->isPost()) {
			$deletedProfessionalsdb = Engine_Api::_()->getDbTable('professionals', 'booking')->getAdapter();
			$deletedProfessionalsdb->beginTransaction();
			$deletedProfessionalsdb->commit();
			$deletedProfessionalsTable = Engine_Api::_()->getDbTable('deletedprofessionals', 'booking');
			$deletedProfessionals = $deletedProfessionalsTable->createRow();
			$formValues['user_id'] = $professional->user_id;
			$deletedProfessionals->setFromArray($formValues);
			$deletedProfessionals->save();
			$deletedProfessionals->save();
			$deletedProfessionalsdb->commit();
			$professional->delete();
			return $this->_forward('success', 'utility', 'core', array(
        'parentRedirect' => Zend_Controller_Front::getInstance()->getRouter()->assemble(array('module' => 'booking', 'controller' => 'professionals', 'action' => 'index'), 'admin_default', true),
        'messages' => array('Professional deleted successfully.')
      ));
		}
	}
}
