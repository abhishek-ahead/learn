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
class Booking_Widget_AppointmentsController extends Engine_Content_Widget_Abstract
{
  public function indexAction()
  {
    $this->view->is_ajax = $is_ajax = isset($_POST['is_ajax']) ? true : false;
    $this->view->view_more = isset($_POST['view_more']) ? true : false;
    $this->view->is_search = !empty($_POST['is_search']) ? true : false;
    $this->view->widgetId = $widgetId = (isset($_POST['identity']) ? $_POST['identity'] : $this->view->identity);
    $this->view->loadMoreLink = $this->_getParam('openTab') != NULL ? true : false;
    $this->view->loadJs = true;
    $this->view->optionsListGrid = array('tabbed' => true, 'paggindData' => true);
    $this->view->params = $params = Engine_Api::_()->booking()->getWidgetParams($widgetId);
    $this->view->loadOptionData = $loadOptionData = isset($params['pagging']) ? $params['pagging'] : $this->_getParam('pagging', 'auto_load');
    //START WORK FOR TABS
    $appointments = "Appointments";
    $viewer = Engine_Api::_()->user()->getViewer();
    $isProfessional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessionalAvailable(array("user_id" => $viewer->getIdentity()));
    $isProfessionalInAppointments = Engine_Api::_()->getDbtable('appointments', 'booking')->isProfessionalInAppointments();
    $this->view->isProfessionalInAppointments = $isProfessionalInAppointments->professional_id;
    $defaultOpenTab = array();
    $defaultOptions = $arrayOptions = array();
    $params['type'] = '0';
    $defaultOptionsArray = $params['search_type'];
    $arrayOptn = array();
    if (!$is_ajax && is_array($defaultOptionsArray)) {
      foreach ($defaultOptionsArray as $key => $defaultValue) {
        if ($this->_getParam($defaultValue . '_order'))
          $order = $this->_getParam($defaultValue . '_order');
        else
          $order = (1000 + $key);
        $arrayOptn[$order] = $defaultValue;
        if ($this->_getParam($defaultValue . '_label'))
          $valueLabel = $this->_getParam($defaultValue . '_label');
        else {
          if ($defaultValue == 'given' && !empty($isProfessional->professional_id))
            $valueLabel = ucwords($defaultValue) . " " . $appointments;
          else if ($defaultValue == 'taken')
            $valueLabel = ucwords($defaultValue) . " " . $appointments;
          else if ($defaultValue == 'cancelled')
            $valueLabel = ucwords($defaultValue) . " " . $appointments;
          else if ($defaultValue == 'completed')
            $valueLabel = ucwords($defaultValue) . " " . $appointments;
          else if ($defaultValue == 'reject')
            $valueLabel = ucwords(str_replace("reject", "rejected", $defaultValue)) . " " . $appointments;
        }
        $arrayOptions[$order] = $valueLabel;
      }
      ksort($arrayOptions);
      $counter = 0;
      if(empty($isProfessional->professional_id)){
        reset($arrayOptions);
        $key = key($arrayOptions);
        unset($arrayOptions[$key]);
      }
      foreach ($arrayOptions as $key => $valueOption) {
        if ($counter == 0)
          $this->view->defaultOpenTab = $defaultOpenTab = $arrayOptn[$key];
        $defaultOptions[$arrayOptn[$key]] = $valueOption;
        $counter++;
      }
    }
    if(empty($isProfessional->professional_id) || $isProfessional->is_deleted)
      unset($defaultOptions['given']);
    $this->view->defaultOptions = $defaultOptions;
    //END WORK OF TABS
    if ($is_ajax)
      $this->view->defaultOpenTab = $defaultOpenTab = isset($_POST['defaultOpenTab']) ? $_POST['defaultOpenTab'] : $defaultOpenTab ;
    if ($is_ajax)
      if ($defaultOpenTab == "cancelled" || $defaultOpenTab == "completed" || $defaultOpenTab == "reject")
        $params['type'] = $defaultOpenTab;
      switch ($defaultOpenTab) {
        case 'given':
        $params['sort'] = 'creation_date';
        break;
        case 'taken':
        $params['sort'] = 'view_count';
        break;
        case 'cancelled':
        $params['sort'] = 'like_count';
        break;
        case 'completed':
        $params['sort'] = 'comment_count';
        break;
        case 'reject':
        $params['sort'] = 'favourite_count';
        break;
        default:
        $params['sort'] = 'creation_date';
      }
      $this->view->view_type = $viewType = isset($_POST['type']) ? $_POST['type'] : (count($params['enableTabs']) > 1 ? $params['openViewType'] : $params['enableTabs'][0]);
      $limit_data = $params["limit_data"];
      $this->view->optionsEnable = $optionsEnable = $params['enableTabs'];
      if (count($optionsEnable) > 1) {
        $this->view->bothViewEnable = true;
      }
      $show_criterias = $params['show_criteria'];
      foreach ($show_criterias as $show_criteria)
        $this->view->{$show_criteria . 'Active'} = $show_criteria;
      $this->view->widgetName = 'appointments';
      $page = isset($_POST['page']) ? $_POST['page'] : 1;
      $this->view->page = $page;
      $value = array( 
        "tab" => $defaultOpenTab , 
        "isProfessional" => $isProfessional->professional_id,
        "isProfessionalInAppointments"=>$isProfessionalInAppointments->professional_id
      );
      $params = array_merge($params, $value);
      $this->view->paginator = $paginator = Engine_Api::_()->getDbtable('appointments', 'booking')->getAppointmentPaginator($params);
      $paginator->setItemCountPerPage($limit_data);
      $paginator->setCurrentPageNumber($page);
      if ($is_ajax) {
        $this->getElement()->removeDecorator('Container');
      }
    }
  }