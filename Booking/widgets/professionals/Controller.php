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


class Booking_Widget_ProfessionalsController extends Engine_Content_Widget_Abstract
{
  public function indexAction()
  {
    if (isset($_POST['params']))
      $params = json_decode($_POST['params'], true);
    $this->view->show_criteria = $var = isset($params['show_criteria']) ? $params['show_criteria'] : $this->_getParam('show_criteria');
    $this->view->name = (!empty(in_array("name", $var)) ? 1 : 0);
    $this->view->image = (!empty(in_array("image", $var)) ? 1 : 0);
    $this->view->designation = (!empty(in_array("designation", $var)) ? 1 : 0);
    $this->view->location = (!empty(in_array("location", $var)) ? 1 : 0);
    $this->view->description = (!empty(in_array("description", $var)) ? 1 : 0);
    $this->view->profilephoto = (!empty(in_array("profilephoto", $var)) ? 1 : 0);
    $this->view->rating = (!empty(in_array("rating", $var)) ? 1 : 0);
    $this->view->like = (!empty(in_array("like", $var)) ? 1 : 0);
    $this->view->favourite = (!empty(in_array("favourite", $var)) ? 1 : 0);
    $this->view->follow = (!empty(in_array("follow", $var)) ? 1 : 0);
    $this->view->report = (!empty(in_array("report", $var)) ? 1 : 0);
    $this->view->likecount = (!empty(in_array("likecount", $var)) ? 1 : 0);
    $this->view->favouritecount = (!empty(in_array("favouritecount", $var)) ? 1 : 0);
    $this->view->followcount = (!empty(in_array("followcount", $var)) ? 1 : 0);
    $this->view->bookbutton = (!empty(in_array("bookbutton", $var)) ? 1 : 0);
    $this->view->viewprofile = (!empty(in_array("viewprofile", $var)) ? 1 : 0);
    $this->view->socialSharing = (!empty(in_array("socialSharing", $var)) ? 1 : 0);
    $this->view->description_truncation = $description_truncation = isset($params['description_truncation']) ? $params['description_truncation'] : $this->_getParam("title_truncation", 45);
    $this->view->socialshare_enable_plusicon = $socialshare_enable_plusicon = isset($params['socialshare_enable_plusicon']) ? $params['socialshare_enable_plusicon'] : $this->_getParam("socialshare_enable_plusicon", 1);
    $this->view->socialshare_icon_limit = $socialshare_icon_limit = isset($params['socialshare_icon_limit']) ? $params['socialshare_icon_limit'] : $this->_getParam("socialshare_icon_limit", 2)+1;
    $this->view->width  = $width = isset($params['width']) ? $params['width'] : $this->_getParam("width", 140);
    $this->view->height = $height =  isset($params['height']) ? $params['height'] : $this->_getParam("height", 160);
    $this->view->all_params = $values = array(
      'description_truncation' => $description_truncation,
      'socialshare_enable_plusicon' => $socialshare_enable_plusicon,
      'socialshare_icon_limit' => $socialshare_icon_limit,
      'width' => $width,
      'height' => $height,
      'show_criteria' => $var
    );
    $page = isset($_POST['page']) ? $_POST['page'] : 1;
    $limit_data = isset($params['limit_data']) ? $params['limit_data'] : $this->_getParam('limit_data', '10');
    $this->view->loadOptionData = $loadOptionData = isset($params['pagging']) ? $params['pagging'] : $this->_getParam('pagging', 'auto_load');
    $this->view->is_ajax = $is_ajax = isset($_POST['is_ajax']) ? true : false;
    $this->view->identityForWidget = isset($_POST['identity']) ? $_POST['identity'] : '';
    $this->view->widgetName = 'professionals';
    //        if (!$is_ajax) {
    //            $this->view->optionsEnable = $optionsEnable = $this->_getParam('enableTabs', array('list', 'grid', 'portfolio'));
    //            if(!$optionsEnable){
    //                $view_type = $this->_getParam('openViewType');	
    //            }
    //            if (count($optionsEnable) > 1) {
    //              $this->view->bothViewEnable = true;
    //            }
    //        }
    $this->view->view_type = $view_type = "grid"; //(isset($_POST['type']) ? $_POST['type'] : (isset($params['view_type']) ? $params['view_type'] : $view_type));
    $this->view->isProfessional = $isProfessional = $this->_getParam("isProfessional", 0);
    $serviceSQLData = array('isProfessionalSearch' => 1);
    if (!empty($isProfessional)) {
      $viewType = $this->_getParam("viewType", 0);
      $professionalName = $this->_getParam("professionalName", 0);
      $serviceName = $this->_getParam("serviceName", 0);
      $category_id = $this->_getParam("category_id", 0);
      $subcat_id = $this->_getParam("subcat_id", 0);
      $subsubcat_id = $this->_getParam("subsubcat_id", 0);
      $availability = $this->_getParam("availability", 0);
      $rating = $this->_getParam("rating", 0);
      $locat = $this->_getParam("locat", 0);
      if (!empty($viewType))
        $serviceSQLData["viewType"] = $viewType;
      if (!empty($professionalName))
        $serviceSQLData["professionalName"] = $professionalName;
      if (!empty($serviceName))
        $serviceSQLData["serviceName"] = $serviceName;
      if (!empty($category_id))
        $serviceSQLData["category_id"] = $category_id;
      if (!empty($subcat_id))
        $serviceSQLData["subcat_id"] = $subcat_id;
      if (!empty($subsubcat_id))
        $serviceSQLData["subsubcat_id"] = $subsubcat_id;
      if (!empty($availability))
        $serviceSQLData["availability"] = $availability;
      if (!empty($rating))
        $serviceSQLData["rating"] = $rating;
      if (!empty($locat))
        $serviceSQLData["location"] = $locat;
    }
    $this->view->paginator = $paginator = Engine_Api::_()->getDbTable('professionals', 'booking')->getProfessionalPaginator($serviceSQLData);
    $paginator->setItemCountPerPage($limit_data);
    $paginator->setCurrentPageNumber($page);
  }
}
