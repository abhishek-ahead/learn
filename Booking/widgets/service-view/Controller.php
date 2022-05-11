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

class Booking_Widget_ServiceViewController extends Engine_Content_Widget_Abstract
{
    public function indexAction()
    {
        $this->view->viewer = $viewer = Engine_Api::_()->user()->getViewer();
        $this->view->serviceId=$serviceId=Zend_Controller_Front::getInstance()->getRequest()->getParam("service_id");
        $this->view->viewerId=$viewerId = Engine_Api::_()->user()->getViewer()->getIdentity();
        $serviceTable= Engine_Api::_()->getDbTable('services', 'booking')->getServices(array("service_id"=>$serviceId));
        $this->view->servicePaginator=$serviceTable;
        if($serviceTable){
            $professionalTable = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($serviceTable->user_id);
            $professional = Engine_Api::_()->getItem('professional', $professionalTable->professional_id);
            $this->view->isProfessionalAvailable = (!empty($professional->available)) ? true : false;
            $reviewsTable= Engine_Api::_()->getDbTable('reviews', 'booking');
            $reviewsPaginator=$reviewsTable->getReviews(array("service_id"=>$serviceId));
            $this->view->reviewsPaginator=$reviewsPaginator;
            $isReviewAvailable=$reviewsTable->isReviewAvailable(array("service_id"=>$serviceId,"user_id"=>$viewerId));
            $this->view->isReviewAvailable=$isReviewAvailable;
            if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.allow.owner', 1))
			$allowedCreate = true;	
			else{
				if($serviceTable->user_id == $viewer->getIdentity())	
				$allowedCreate = false;
				else
				$allowedCreate = true;
			}
			$this->view->allowedCreate = $allowedCreate;
        }
	}
}
