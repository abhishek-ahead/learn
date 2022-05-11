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
class Booking_Widget_ProfessionalSearchController extends Engine_Content_Widget_Abstract
{
	public function indexAction()
	{
		$this->view->view_type = $this->_getParam('view_type', 'horizontal');
		$this->view->search_for = $search_for = $this->_getParam('search_type');
		if (isset($_POST['params']))
			$params = json_decode($_POST['params'], true);
		$search_fors = $this->_getParam('search_type');
    $booking_widget = Zend_Registry::isRegistered('booking_widget') ? Zend_Registry::get('booking_widget') : null;
    if(empty($booking_widget) || empty($search_for))
      return $this->setNoRender();
		foreach ($search_fors as $search_for)
			$this->view->{$search_for . 'Active'} = $search_for;
		$this->view->form = $form = new Booking_Form_Professionalsearchform(
			array(
				"professionalNameActive"=>$this->view->professionalNameActive,
				"serviceNameActive"=>$this->view->serviceNameActive,
				"ratingActive"=>$this->view->ratingActive,
				"availabilityActive"=>$this->view->availabilityActive,
				"locationActive"=>$this->view->locationActive,
        "categoryActive"=>$this->view->categoryActive,
			)
		);
	}
}
