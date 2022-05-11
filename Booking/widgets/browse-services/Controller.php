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


class Booking_Widget_BrowseServicesController extends Engine_Content_Widget_Abstract
{
  public function indexAction()
  {
    if (isset($_POST['params']))
        $params = json_decode($_POST['params'], true);

    $limit_data=3;
    $page= $this->_getParam('page', 1);
    $this->view->viewmore = $this->_getParam('viewmore', 0);
    $this->view->paginationType = $pagging = $this->_getParam('pagging', 1);
    $this->view->widgetName = 'browse-services';
    if ($this->view->viewmore)
    $this->getElement()->removeDecorator('Container');
    $this->view->masonry_height=$masonry_height="200px";
    //$this->view->paginator = $paginator = Engine_Api::_()->getDbTable('services', 'booking')
      //  ->getServicePaginator();
    $booking_widget = Zend_Registry::isRegistered('booking_widget') ? Zend_Registry::get('booking_widget') : null;
    if(empty($booking_widget))
      return $this->setNoRender();
    $this->view->is_ajax = $is_ajax = isset($_POST['is_ajax']) ? true : false;

    $this->view->serviceLimit = $serviceLimit = isset($params['limit_data']) ? $params['limit_data'] : $this->_getParam('limit_data', 10);
    $this->view->width = $width = isset($params['width']) ? $params['width'] : $this->_getParam('width', 200);

    $this->view->height = $height = isset($params['height']) ? $params['height'] : $this->_getParam('height', 200);
    $show_criteria = $var = isset($params['show_criteria']) ? $params['show_criteria'] : $this->_getParam('show_criteria','');

    $this->view->servicenamelimit = $servicenamelimit = isset($params['title_truncation']) ? $params['title_truncation'] : $this->_getParam('title_truncation', 16);
    $this->view->servicewidth = $servicewidth = isset($params['servicewidth']) ? $params['servicewidth'] : $this->_getParam('servicewidth', 200);
    $this->view->paginationType = $paginationType = isset($params['paginationType']) ? $params['paginationType'] : $this->_getParam('paginationType', '1');
    $this->view->serviceimage=(!empty(in_array("serviceimage",$var))?1:0);
    // $this->view->providerviceimage=(!empty(in_array("providericon",$var))?1:0);
    $this->view->provideicon=(!empty(in_array("providericon",$var))?1:0);
    $this->view->providername=(!empty(in_array("providername",$var))?1:0);
    $this->view->servicename=(!empty(in_array("servicename",$var))?1:0);
    $this->view->price=(!empty(in_array("price",$var))?1:0);
    $this->view->minute=(!empty(in_array("minute",$var))?1:0);
    $this->view->bookbutton=(!empty(in_array("bookbutton",$var))?1:0);
    $this->view->like=(!empty(in_array("like",$var))?1:0);
    $this->view->favourite=(!empty(in_array("favourite",$var))?1:0);
    $this->view->report=(!empty(in_array("report",$var))?1:0);
    $this->view->likecount=(!empty(in_array("likecount",$var))?1:0);
    $this->view->favouritecount=(!empty(in_array("favouritecount",$var))?1:0);
    $this->view->viewbutton=(!empty(in_array("viewbutton",$var))?1:0);
    $this->view->socialSharing = (!empty(in_array("socialSharing", $var)) ? 1 : 0);
    $this->view->socialshare_enable_plusicon = $this->_getParam("socialshare_enable_plusicon");
    $this->view->socialshare_icon_limit = $this->_getParam("socialshare_icon_limit")+1;

    $allData=array("viewerId"=>"","limit"=>$serviceLimit, 'widgetname' => 'browseservices');

    $isService=$this->_getParam("isService",0);
    if(!empty($isService)){
        $serviceSQLData=array();

        $serviceSQLData["isService"]=$isService;
        $serviceName=$this->_getParam("servicename",0);
        $serviceProfessional=$this->_getParam("professional",0);
        $servicecategory_id=$this->_getParam("category_id",0);
        $servicesubcat_id=$this->_getParam("subcat_id",0);
        $servicesubsubcat_id=$this->_getParam("subsubcat_id",0);
        $price=$this->_getParam("price",0);

        if(!empty($serviceName))
            $serviceSQLData["servicename"]=$serviceName;
        if(!empty($serviceProfessional))
            $serviceSQLData["professional"]=$serviceProfessional;
        if(!empty($price))
            $serviceSQLData["price"]=$price;
        if(!empty($servicecategory_id))
            $serviceSQLData["category_id"]=$servicecategory_id;
        if(!empty($servicesubcat_id))
            $serviceSQLData["subcat_id"]=$servicesubcat_id;
        if(!empty($servicesubsubcat_id))
            $serviceSQLData["subsubcat_id"]=$servicesubsubcat_id;
    }
    $this->view->paginator = $paginator = Engine_Api::_()->getDbTable('services', 'booking')->servicePaginator(($isService) ? $serviceSQLData : $allData );
    $paginator->setItemCountPerPage($serviceLimit);

    $paginator->setCurrentPageNumber($page);
    $this->view->count = $count = $paginator->getTotalItemCount();
    $this->view->all_params = $values = array('servicewidth' => $servicewidth, 'title_truncation' => $servicenamelimit, 'paginationType' => $paginationType, 'width' => $width, 'height' => $height, 'limit_data' => $serviceLimit, "show_criteria" => $show_criteria, "count" => $count, "is_ajax" => $is_ajax);
  }
}
