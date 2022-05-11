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


class Booking_Widget_BrowseMenuController extends Engine_Content_Widget_Abstract
{
  public function indexAction()
  {
  		$this->setNoRenderOnApiCall();

    $this->view->isLogin = Engine_Api::_()->user()->getViewer()->getIdentity();
    $this->view->navigation = $navigation = Engine_Api::_()->getApi('menus', 'core')
      ->getNavigation('booking_main');
    $this->view->max = Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.taboptions', 6);
  }
   public function setNoRenderOnApiCall(){	
  	if (isset($_GET['removeSiteHeaderFooter'])){	
  		//return $this->setNoRender();	
  	}	
  }
}
