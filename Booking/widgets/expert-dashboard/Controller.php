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


class Booking_Widget_ExpertDashboardController extends Engine_Content_Widget_Abstract
{
  public function indexAction()
  {
    
  	$day = !empty($_POST['dayid']) ? $_POST['dayid'] : 1;
    $this->view->isAjax = $this->_getParam('isAjax',0);
    $viewer = Engine_Api::_()->user()->getViewer();
    $this->view->professional_id =$viewerId = $viewer->getIdentity();
    $table = Engine_Api::_()->getDbTable('services', 'booking')->getMainServices(array("viewerId"=>$viewerId));
    $this->view->paginator = $paginator = $table;
    $tableData=array(
        'day'=>$day,
        'user_id'=>$viewerId,
    );
    $professionalTable=Engine_Api::_()->getDbtable('professionals', 'booking');
    $professionalData=$professionalTable->select()->from($professionalTable->info('name'), array('*'))->where("user_id =?",$viewerId);
    $this->view->data=$data=$professionalTable->fetchRow($professionalData);
    $this->view->professionalItemId=$data['professional_id'];
    $this->view->form = $form = new Booking_Form_Calendarsetting(array('dayId'=>$day));
    $data1=Engine_Api::_()->getDbtable('settings', 'booking')->getTableSettings($tableData);
    if($data1){
        $settingservices=array(
            'setting_id'=>$data1->setting_id,
            'user_id'=>$viewerId,
        );
      $form->populate($data1->toArray());
      $data2 = Engine_Api::_()->getDbtable('settingservices', 'booking')->getTableSettings($settingservices);
      if($data2){
        $settings_data=array();
        foreach ($data2 as $key => $value) {
          $settings_data['service_'.$value->service_id]=1;
        }
        $form->populate($settings_data);
      }
      $timeDuration = Engine_Api::_()->booking()->getTimeSlots($data1->duration,false,false,true);
        $this->view->isOff=$form->getValue("offday");
        $form->populate(array("starttime"=>$data1->starttime,"endtime"=>$data1->endtime));
    }else{
        $this->view->isOff=$form->getValue("offday");
        $timeslots = "";
        $duration=$form->getValue('duration');
        $starttime = $form->getValue('starttime');
        $endtime = $form->getValue('endtime');
        if(empty($duration) || empty($starttime) || empty($endtime))
            return;
        $this->view->slots=$slots=Engine_Api::_()->booking()->buildSlots($duration,date("H:i", strtotime($starttime)),str_replace("00:00", "24:00",date('H:i', strtotime($endtime))));
        if(empty($slots)){
            return;
        }
        foreach ($slots['start_time'] as $key => $value) 
        {
            $rand=rand(10,999);
            $timeslots .= "<input id='".($rand)."a' type='checkbox' name='timeSlots' value='".date('H:i', strtotime($value))."-".str_replace("00:00", "24:00",date('H:i', strtotime($slots['end_time'][$key])))."' >";
            $timeslots .= "<label for='".($rand)."a'>".date('h:i A', strtotime($value))." - ".date('h:i A', strtotime($slots['end_time'][$key]))."</label><br>"; 
        }
        $form->timeslots->setContent("<div class='".((5<$key) ? 'scroll' : 'noscroll')."'>".$timeslots."</div>");
    }
    if(!empty($_POST['time']) && !empty($_POST['isTime'])){
        $timeDuration = Engine_Api::_()->booking()->buildSlots($_POST['time'],date("H:i", strtotime($_POST['starttime'])),date("H:i", strtotime($_POST['endtime'])));
        echo json_encode($timeDuration);
        die();
  	}
  }
}
