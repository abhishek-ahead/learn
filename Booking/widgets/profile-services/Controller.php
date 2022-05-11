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

class Booking_Widget_ProfileServicesController extends Engine_Content_Widget_Abstract
{
  public function indexAction()
  {
    // Prepare
    if (isset($_POST['params']))
      $params = json_decode($_POST['params'], true);
    if (isset($_POST['searchParams']) && $_POST['searchParams'])
      parse_str($_POST['searchParams'], $searchArray);
    $viewer = Engine_Api::_()->user()->getViewer();
    $this->view->is_ajax = $is_ajax = isset($_POST['is_ajax']) ? true : false;
    $this->view->widgetId = $widgetId = (isset($_POST['identity']) ? $_POST['identity'] : $this->view->identity);
    $params['identity'] = Engine_Api::_()->booking()->getWidgetParams($widgetId);
    $page = isset($_POST['page']) ? $_POST['page'] : 1;
    $this->view->show_item_count = $show_item_count = isset($params['show_item_count']) ? $params['show_item_count'] :  $this->_getParam('show_item_count', 0);
    $text =  isset($searchArray['search_text']) ? $searchArray['search_text'] : (!empty($params['search_text']) ? $params['search_text'] : (isset($_GET['search_text']) && ($_GET['search_text'] != '') ? $_GET['search_text'] : ''));
    $limit_data = isset($params['limit_data']) ? $params['limit_data'] : $this->_getParam('limit_data', '10');
    $show_criterias = isset($params['show_criterias']) ? $params['show_criterias'] : $this->_getParam('show_criteria', array("serviceimage", "servicename", "price", "minute", "bookbutton", "like", "favourite", "likecount", "favouritecount"));
    $this->view->serviceimage = (!empty(in_array("serviceimage", $show_criterias)) ? 1 : 0);
    $this->view->servicename = (!empty(in_array("servicename", $show_criterias)) ? 1 : 0);
    $this->view->price = (!empty(in_array("price", $show_criterias)) ? 1 : 0);
    $this->view->minute = (!empty(in_array("minute", $show_criterias)) ? 1 : 0);
    $this->view->bookbutton = (!empty(in_array("bookbutton", $show_criterias)) ? 1 : 0);
    $this->view->like = (!empty(in_array("like", $show_criterias)) ? 1 : 0);
    $this->view->favourite = (!empty(in_array("favourite", $show_criterias)) ? 1 : 0);
    $this->view->likecount = (!empty(in_array("likecount", $show_criterias)) ? 1 : 0);
    $this->view->favouritecount = (!empty(in_array("favouritecount", $show_criterias)) ? 1 : 0);
    $this->view->servicenamelimit = isset($params['title_truncation']) ? $params['title_truncation'] : $this->_getParam("title_truncation", 20);
    $this->view->height = $defaultHeight = isset($params['height']) ? $params['height'] : $this->_getParam('height', '200');
    $this->view->width = $defaultWidth = isset($params['width']) ? $params['width'] : $this->_getParam('width', '200');
    $this->view->masonry_height = $defaultMasonryHeight = isset($params['masonry_height']) ? $params['masonry_height'] : $this->_getParam('masonry_height', '200px');
    $this->view->identityForWidget = isset($_POST['identity']) ? $_POST['identity'] : '';
    $this->view->loadOptionData = $loadOptionData = isset($params['pagging']) ? $params['pagging'] : $this->_getParam('pagging', 'auto_load');
    // check to see if request is for specific user's listings  
    if (!$is_ajax) {
      $this->view->optionsEnable = $optionsEnable = $this->_getParam('enableTabs', array('list', 'grid', 'pinboard', 'masonry', 'map'));
      if (!count($optionsEnable) || empty($optionsEnable))
        $this->setNoRender();
      if (count($optionsEnable) > 1) {
        $this->view->bothViewEnable = true;
      }
    }
    $params = array('pagging' => $loadOptionData, 'limit_data' => $limit_data, 'list_title_truncation' => $list_title_truncation, 'grid_title_truncation' => $grid_title_truncation, 'masonry_title_truncation' => $masonry_title_truncation, 'pinboard_title_truncation' => $pinboard_title_truncation, 'list_description_truncation' => $list_description_truncation, 'grid_description_truncation' => $grid_description_truncation, 'pinboard_description_truncation' => $pinboard_description_truncation, 'show_criterias' => $show_criterias, 'height' => $defaultHeight, 'photo_height' => $defaultPhotoHeight, 'photo_width' => $defaultPhotoWidth, 'info_height' => $defaultInfoHeight, 'pinboard_width' => $defaultPinboardWidth, 'masonry_height' => $defaultMasonryHeight, 'advgrid_title_truncation' => $advgrid_title_truncation, 'advgrid_height' => $advgrid_height, 'advgrid_width' => $advgrid_width, 'show_item_count' => $show_item_count,  'socialshare_icon_limit' => $socialshare_icon_listviewlimit);
    $this->view->widgetName = 'profile-services';
    $this->view->page = $page;

    $this->view->params = $params;
    if ($is_ajax) {
      $this->getElement()->removeDecorator('Container');
    }
    $this->view->identityForWidget = $identityForWidget = isset($_POST['identity']) ? $_POST['identity'] : $this->view->identity;
    if(Engine_Api::_()->core()->hasSubject('user')) {
        $subject = Engine_Api::_()->core()->getSubject();
        $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($subject->getIdentity());
        $professionalId = 0;
        if($professional){
            $professionalId = $professional->getIdentity();
        }
    } else {
        // Get paginator
        $professionalId = Zend_Controller_Front::getInstance()->getRequest()->getParam("professional_id");
        $professionalId = isset($_POST['professionalId']) ? $_POST['professionalId'] : $professionalId;
    }
    if(empty($professionalId)){
        return $this->setNoRender();
    }
    $this->view->professionalId = $professionalId;
    $userSelected = Engine_Api::_()->getItem('professional', $professionalId);
    $this->view->ifNoProfessioanl = $userSelected;
    $this->view->paginator = $paginator = Engine_Api::_()->getDbTable('services', 'booking')->servicePaginator(array("viewerId" => $userSelected->user_id));
    $paginator->setItemCountPerPage($limit_data);
    $paginator->setCurrentPageNumber($page);
  }
}
