<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: AjaxController.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_AjaxController extends Core_Controller_Action_Standard
{

  public function subcategoryAction()
  {
    $category_id = $this->_getParam('category_id', null);
    if ($category_id) {
      $subcategory = Engine_Api::_()->getDbtable('categories', 'booking')->getModuleSubcategory(array('category_id' => $category_id, 'column_name' => '*'));
      $count_subcat = count($subcategory->toarray());
      if (isset($_POST['selected']))
        $selected = $_POST['selected'];
      else
        $selected = '';
      $data = '';
      if ($subcategory && $count_subcat) {
        $data .= '<option value=""></option>';
        foreach ($subcategory as $category) {
          $data .= '<option ' . ($selected == $category['category_id'] ? 'selected = "selected"' : '') . ' value="' . $category["category_id"] . '" >' . Zend_Registry::get('Zend_Translate')->_($category["category_name"]) . '</option>';
        }
      }
    } else
      $data = '';
    echo $data;
    die;
  }

  public function subsubcategoryAction()
  {
    $category_id = $this->_getParam('subcategory_id', null);
    if ($category_id) {
      $subcategory = Engine_Api::_()->getDbtable('categories', 'booking')->getModuleSubsubcategory(array('category_id' => $category_id, 'column_name' => '*'));
      $count_subcat = count($subcategory->toarray());
      if (isset($_POST['selected']))
        $selected = $_POST['selected'];
      else
        $selected = '';
      $data = '';
      if ($subcategory && $count_subcat) {
        $data .= '<option value=""></option>';
        foreach ($subcategory as $category) {
          $data .= '<option ' . ($selected == $category['category_id'] ? 'selected = "selected"' : '') . ' value="' . $category["category_id"] . '">' . Zend_Registry::get('Zend_Translate')->_($category["category_name"]) . '</option>';
        }
      }
    } else
      $data = '';
    echo $data;
    die;
  }

  public function savecalenderoffsettingsAction()
  {
    //when off day select in calender settings
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $dayid = $this->_getParam('dayid', null);
    $time = $this->_getParam('time', null);
    $start = $this->_getParam('start', null);
    $end = $this->_getParam('end', null);
    $offday = $this->_getParam('offday', null);
    $tableData = array(
      'day' => $dayid,
      'user_id' => $viewerId,
    );
    $status = Engine_Api::_()->getDbtable('settings', 'booking')->isDay($tableData);
    $db = Engine_Api::_()->getDbTable('settings', 'booking')->getAdapter();
    $db->beginTransaction();
    try {
      $settingsTable = Engine_Api::_()->getDbTable('settings', 'booking');
      $settingsvalues['duration'] = $time;
      $settingsvalues['starttime'] = $start;
      $settingsvalues['endtime'] = $end;
      $settingsvalues['offday'] = $offday;
      if ($status == "update") {
        Engine_Api::_()->getDbTable('settings', 'booking')->update($settingsvalues, array('day = ?' => $dayid, 'user_id = ?' => $viewerId));
        $tablename = Engine_Api::_()->getDbtable('settings', 'booking');
        $select = $tablename->select()->from($tablename->info('name'), array('setting_id'))->where('day = ?', $dayid)->where('user_id = ?', $viewerId);
        $data = $tablename->fetchRow($select);
        $id_for_setting_services = $data->setting_id;
      }
      if ($status == "save") {
        $settingsvalues['day'] = $dayid;
        $settingsvalues['user_id'] = $viewerId;
        $settingsData = $settingsTable->createRow();
        $settingsData->setFromArray($settingsvalues);
        $settingsData->save();
      }
      $db->commit();
    } catch (Exception $e) {
      $db->rollBack();
      throw $e;
    }
    if ($status == "save")
      die("<ul class='form-notices'><li>Settings Saved</li></ul>");
    if ($status == "update")
      die("<ul class='form-notices'><li>Settings Update</li></ul>");
  }

  public function savecalendersettingsAction()
  {
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $dayid = $this->_getParam('dayid', null);
    $time = $this->_getParam('time', null);
    $start = $this->_getParam('start', null);
    $end = $this->_getParam('end', null);
    $offday = $this->_getParam('offday', null);
    $servicesvalues = $this->_getParam('servicesvalues', null);
    $timeslotsarray = $this->_getParam('timeslotsarray', null);
    $tableData = array(
      'day' => $dayid,
      'user_id' => $viewerId,
    );
    $status = Engine_Api::_()->getDbtable('settings', 'booking')->isDay($tableData);
    try {
      $db = Engine_Api::_()->getDbTable('settings', 'booking')->getAdapter();
      $db->beginTransaction();
      $settingsTable = Engine_Api::_()->getDbTable('settings', 'booking');
      $settingsvalues['duration'] = $time;
      $settingsvalues['starttime'] = $start;
      $settingsvalues['endtime'] = $end;
      $settingsvalues['offday'] = $offday;
      if ($status == "update") {
        Engine_Api::_()->getDbTable('settings', 'booking')->update($settingsvalues, array('day = ?' => $dayid, 'user_id = ?' => $viewerId));
        $tablename = Engine_Api::_()->getDbtable('settings', 'booking');
        $select = $tablename->select()->from($tablename->info('name'), array('setting_id'))->where('day = ?', $dayid)->where('user_id = ?', $viewerId);
        $data = $tablename->fetchRow($select);
        $id_for_setting_services = $data->setting_id;
      }
      if ($status == "save") {
        $settingsvalues['day'] = $dayid;
        $settingsvalues['user_id'] = $viewerId;
        $settingsData = $settingsTable->createRow();
        $settingsData->setFromArray($settingsvalues);
        $settingsData->save();
        // for setting services -> settings ID
        $id_for_setting_services = $settingsData->getIdentity();
      }
      try {
        //for setting services table
        $db_setting_services = Engine_Api::_()->getDbTable('settingservices', 'booking')->getAdapter();
        $db_setting_services->beginTransaction();
        $settingservicesTable = Engine_Api::_()->getDbTable('settingservices', 'booking');
        Engine_Api::_()->getDbTable('settingservices', 'booking')->delete(array("user_id =?" => $viewerId, "setting_id =?" => $id_for_setting_services));
        foreach (explode(",", $servicesvalues) as $services_ids) {
          $settingservicesvalues['user_id'] = $viewerId;
          $chk = explode("_", $services_ids);
          if ("true" == $chk[1]) {
            if ($status == "update") {
              $settingservicesvalues['setting_id'] = $id_for_setting_services;
              $settingservicesvalues['service_id'] = $chk[0];
              $settingservicesData = $settingservicesTable->createRow();
              $settingservicesData->setFromArray($settingservicesvalues);
              $settingservicesData->save();
            }
            if ($status == "save") {
              $settingservicesvalues['setting_id'] = $id_for_setting_services;
              $settingservicesvalues['service_id'] = $chk[0];
              $settingservicesData = $settingservicesTable->createRow();
              $settingservicesData->setFromArray($settingservicesvalues);
              $settingservicesData->save();
            }
          }
        }
        $db_setting_services->commit();
      } catch (Exception $e) {
        $db_setting_services->rollBack();
        throw $e;
      }
      try {
        //for setting durations table
        $db_setting_durations = Engine_Api::_()->getDbTable('settingdurations', 'booking')->getAdapter();
        $db_setting_durations->beginTransaction();
        $settingdurationsTable = Engine_Api::_()->getDbTable('settingdurations', 'booking');
        Engine_Api::_()->getDbTable('settingdurations', 'booking')->delete(array("user_id =?" => $viewerId, "setting_id =?" => $id_for_setting_services));
        foreach (explode(",", $timeslotsarray) as $value) {
          $settingdurationsvalues['user_id'] = $viewerId;
          $time = explode("-", $value);
          $condtion = explode("_", $time[1]);
          $start = date("H:i", strtotime($time[0]));
          $end = str_replace("00:00", "24:00", date("H:i", strtotime($condtion[0])));
          if ("true" == $condtion[1]) {
            if ($status == "save") {
              $settingdurationsvalues['starttime'] = $start;
              $settingdurationsvalues['endtime'] = $end;
              $settingdurationsvalues['setting_id'] = $id_for_setting_services;
              $settingdurationsData = $settingdurationsTable->createRow();
              $settingdurationsData->setFromArray($settingdurationsvalues);
              $settingdurationsData->save();
            }
            if ($status == "update") { //return true
              $settingdurationsvalues['setting_id'] = $id_for_setting_services;
              $settingdurationsvalues['starttime'] = $start;
              $settingdurationsvalues['endtime'] = $end;
              $settingdurationsData = $settingdurationsTable->createRow();
              $settingdurationsData->setFromArray($settingdurationsvalues);
              $settingdurationsData->save();
            }
          }
          $db_setting_durations->commit();
        }
      } catch (Exception $e) {
        $db_setting_durations->rollBack();
        throw $e;
      }
      $db->commit();
    } catch (Exception $e) {
      $db->rollBack();
      throw $e;
    }
    if ($status == "save")
      die("<ul class='form-notices'><li>Settings Saved</li></ul>");
    if ($status == "update")
      die("<ul class='form-notices'><li>Settings Update</li></ul>");
  }

  public function loadslotsAction()
  {
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $tableData = array(
      'day' => $_POST['dayid'],
      'user_id' => $viewerId,
    );

    $settingservices = array(
      'setting_id' => $_POST['dayid'],
      'user_id' => $viewerId,
    );
    $data1 = Engine_Api::_()->getDbtable('settings', 'booking')->getTableSettings($tableData);
    $data2 = Engine_Api::_()->getDbtable('settingservices', 'booking')->getTableSettings($settingservices);
    $data3 = Engine_Api::_()->getDbtable('settingdurations', 'booking')->getDurationSettings($settingservices);
    $allData = array_merge($data1, $data2, $data3);;
    echo json_encode($allData);
    die();
  }

  public function getidbynameAction()
  {
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $adminData = array();
    $userTable = Engine_Api::_()->getDbTable('users', 'user');
    if (Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.allow.for', 1)) {
      $select = $userTable->select()->where('displayname LIKE "%' . $this->_getParam('text', '') . '%" AND NOT user_id=' . $viewerId);
    } else {
      $friendsIds = $viewer->membership()->getMembersIds();
      if (!empty($friendsIds)) {
        $select = $userTable->select()->from($userTable->info('name'), array('user_id', 'displayname'))
          ->where('user_id IN (?)', $friendsIds)
          ->where("displayname LIKE '%" . $this->_getParam('text', '') . "%'");
      }
    }
    $users = $userTable->fetchAll($select);
    foreach ($users as $user) {
      $adminData[] = array(
        'id' => $user->user_id,
        'label' => $user->displayname,
      );
    }
    if (empty($adminData)) {
      $adminData[] = array(
        'id' => 0,
        'label' => 'no user available for this name.',
      );
    }
    return $this->_helper->json($adminData);
  }

  public function bookserviceAction()
  {
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $professionalId = $this->_getParam('professionalId', null);
    $userId = $this->_getParam('userId', null);
    $settings = Engine_Api::_()->getApi('settings', 'core');
    $isOnlinePayment = $settings->getSetting('booking.paymode');
    if ($userId != $viewer->getIdentity()) {
      $sesusersTable = Engine_Api::_()->getDbtable('users', 'user');
      $sesuserData = $sesusersTable->select()->where('displayname ="' . $userId . '"');
      $users = $sesusersTable->fetchRow($sesuserData);
      $userId = $users->user_id;
    }
    $serviceIds = $this->_getParam('serviceIds', null);
    $appointmentdate = $this->_getParam('date', null);
    $professionalTimezone = $this->_getParam('professionalTimezone', null);
    $userName = $this->_getParam('userName', null); //given
    $viewerTimezone = $this->_getParam('viewerTimezone', null);
    $professioanltime = $this->_getParam('professioanltime', null);
    $viewertime = $this->_getParam('viewertime', null);
    if ($professionalId == $viewer->getIdentity()) {
      $userName = $viewer->getIdentity(); //given
    }
    $bookingendtime = $this->_getParam('bookingendtime', null);
    $serviceTotal = 0;
    $responseMSG = array();
    $price = 0;
		$service_tax = 0;
		$entertainment_tax = 0;
		$counter = 0;
    $total_tickets = 0;
    $currencyValue = 1;
    $date = new DateTime('00:00:00');
    $db = Engine_Api::_()->getDbTable('appointments', 'booking')->getAdapter();
    foreach ($serviceIds as $serviceId) {
      try {
        if($counter == 0){
          $tableOrder = Engine_Api::_()->getDbtable('orders', 'booking');
          $order = $tableOrder->createRow();
          $order->professional_id = $professionalId;
          $order->owner_id = $userId;
          if ($isOnlinePayment && $professionalId != $viewer->getIdentity())
            $order->state = 'incomplete';
          else
            $order->state = 'complete';
          $order->creation_date	= date('Y-m-d H:i:s');
          $order->modified_date	= date('Y-m-d H:i:s');
          $order->ip_address = $_SERVER['REMOTE_ADDR'];
          $order->save();
        }
        $servicesTable = Engine_Api::_()->getDbtable('services', 'booking');
        $servicesData = $servicesTable->select()->from($servicesTable->info('name'), array("duration", "timelimit", "price"))->where("service_id =?", $serviceId);
        $servicesValues = $servicesTable->fetchRow($servicesData);
        $db->beginTransaction();
        $professionalTable = Engine_Api::_()->getDbTable('appointments', 'booking');
        $professionalData = $professionalTable->createRow();
        $professionalvalues["professional_id"] = $professionalId;
        $professionalvalues["user_id"] = $userId;
        $professionalvalues["service_id"] = $serviceId;
        $professionalvalues["duration"] = $servicesValues->duration;
        $professionalvalues["time"] = $servicesValues->timelimit;
        $professionalvalues["price"] = $servicesValues->price;
        $professionalvalues["date"] = date("Y-m-d", strtotime($appointmentdate));
        $professionalvalues["professionaltimezone"] = $professionalTimezone;
        $professionalvalues["usertimezone"] = $viewerTimezone;
        $professionalvalues["professionaltime"] = $professioanltime;
        $professionalvalues["serviceendtime"] = $bookingendtime;
        $professionalvalues["usertime"] = $viewertime;
        $professionalvalues["given"] = $userName; //given
        $professionalvalues["action"] = 0;
        $professionalvalues["block"] = 0;
        $professionalvalues["complete"] = 0;
        $professionalvalues["order_id"] = $order->getIdentity();
        if (!$isOnlinePayment)
          $professionalvalues['state'] = 'complete';
        $professionalData->setFromArray($professionalvalues);
        $professionalData->save();
        $date->add(new DateInterval("PT{$servicesValues->duration}".strtoupper($servicesValues->timelimit).""));
        //$actPrice = round($servicesValues->price*$currencyValue,2);
        $serviceTotal += $servicesValues->price;
        // $price = round(($serviceTotal*$actPrice) + $price,2);		 
        $total_services = ($counter++) + $total_services;
        // $service_tax = round(($actPrice * ($ticket->service_tax/100))*$value['value'] + $service_tax,2);
        // $entertainment_tax = round((($actPrice * ($ticket->entertainment_tax/100)))*$value['value'] + $entertainment_tax,2);
        Engine_Api::_()->getDbTable('settingdurations', 'booking')->update(array("available" => 0), array("starttime >= ?" => $professioanltime, "endtime <= ?" => $bookingendtime));
        $db->commit();
        if ($professionalId != $viewer->getIdentity()) {
          //notifcation & mail When user request for service
          $user = Engine_Api::_()->getItem('user', $professionalId);
          $servicename = Engine_Api::_()->getItem('booking_service', $serviceId);
          Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($user, $viewer, $servicename, 'booking_userbookserv');
          Engine_Api::_()->getApi('mail', 'core')->sendSystem(
            $user,
            'booking_userbookserv',
            array(
              'host' => $_SERVER['HTTP_HOST'],
              'service_name' => $servicename->name,
              'queue' => false,
              'recipient_title' => $viewer->displayname,
            )
          );
          //end notifcation & mail
        }
        if ($professionalId == $viewer->getIdentity()) {
          //notifcation & mail When professional self book service for user
          $object_id = Engine_Api::_()->getItem('user', $userId);
          $subject_id = Engine_Api::_()->getItem('user', $professionalId);
          $servicename = Engine_Api::_()->getItem('booking_service', $serviceId);
          Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($object_id, $subject_id, $subject_id, 'booking_profbookservforuser');
          Engine_Api::_()->getApi('mail', 'core')->sendSystem(
            $object_id,
            'booking_profbookservforuser',
            array(
              'host' => $_SERVER['HTTP_HOST'],
              'service_name' => $servicename->name,
              'professional_name' => $subject_id->displayname,
              'queue' => false,
              'recipient_title' => $viewer->displayname,
            )
          );
          //end notifcation & mail
        }
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    }
    $purchaseTotal = round($price,2);
    $order->total_service_tax	= $service_tax;
    $order->total_services	= $total_services;
    $order->durations	= Engine_Api::_()->booking()->minutes($date->format('H:i:s'));
    $order->total_entertainment_tax		= $entertainment_tax;
    $order->total_amount	= $serviceTotal;
    $order->save();
    if ($isOnlinePayment) {
      if ($professionalId != $viewer->getIdentity()) {
        //When user request for service
        $responseMSG['message'] = "user";
        $responseMSG['url'] = $this->view->url(array('module' => 'booking', 'controller' => 'order', 'action' => 'index', 'professional_id' => $professionalId, 'order_id' => $order->getIdentity()));
      }
      if ($professionalId == $viewer->getIdentity()) {
        // When professional self book service for user
        $responseMSG['message'] = "professional";
        $responseMSG['success'] = "your request send successfully to member";
        $responseMSG['url'] = $this->view->url(array('action' => 'appointments'), 'booking_general', true);
      }
    } else {
      //Offline Payment.
      $responseMSG['message'] = "offline-payment";
      $responseMSG['url'] = $this->view->url(array('action' => 'appointments'), 'booking_general', true);
    }
    echo json_encode($responseMSG);
    die();
  }

  public function blockslotsAction()
  {
    $startcolumn = $this->_getParam('startcolumn', null);
    $totaltime = $this->_getParam('totaltime', null);
    $professionalId = $this->_getParam('professionalId', null);
    $settingid = $this->_getParam('settingid', null);
    $slotsInAppointments = $this->_getParam('slotsInAppointments', null);
    $settingdurationsTable = Engine_Api::_()->getDbtable('settingdurations', 'booking');
    $settingdurationsData = $settingdurationsTable->select()->from($settingdurationsTable->info('name'), array("starttime", "endtime"))
      ->where("starttime >=?", $startcolumn)
      ->where("user_id =?", $professionalId)
      ->where("setting_id =?", $settingid);

    $settingdurationsValues = $settingdurationsTable->fetchAll($settingdurationsData);
    $totalminutes = 0;
    $isTime = "0";
    foreach ($settingdurationsValues as $key => $value) {
      $date1 = date_create($value->starttime);
      $date2 = date_create($value->endtime);
      $diff = date_diff($date1, $date2);
      $hours = $diff->format("%h");
      if ($hours) {
        $totalminutes += Engine_Api::_()->booking()->hoursToMinutes($hours);
      }
      $totalminutes += $diff->format("%i");
      if ($this->inRange($totaltime, 0, $totalminutes)) {
        foreach ($slotsInAppointments as $slotsInAppointmentsValue) {
          if ($slotsInAppointmentsValue == $value->starttime) {
            break 2;
          }
        }
        $isTime = $value->endtime;
        break;
      }
    }
    echo $isTime;
    die();
  }

  function inRange($val, $min, $max)
  {
    return ($val >= $min && $val <= $max);
  }

  function likeAction()
  {
    $count = "";
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $professional_id = $this->_getParam('professional_id', null);
    $tableLike = Engine_Api::_()->getDbTable('likes', 'booking');
    $tableMainLike = $tableLike->info('name');
    $select = $tableLike->select()
      ->from($tableMainLike)
      ->where('professional_id = ?', $professional_id)
      ->where('user_id = ?', $viewerId);
    $result = $tableLike->fetchRow($select);
    if ($result) {
      //delete like
      $db = $tableLike->getAdapter();
      $db->beginTransaction();
      try {
        //delete like if already exist.
        $tableLike->delete(array("professional_id = ?" => $professional_id, "user_id = ?" => $viewerId));
        $db->commit();
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    } else {
      $db = $tableLike->getAdapter();
      $db->beginTransaction();
      try {
        //insert like
        $tableLikes = $tableLike->createRow();
        $formValues['professional_id'] = $professional_id;
        $formValues['user_id'] = $viewerId;
        $tableLikes->setFromArray($formValues);
        $tableLikes->save();
        $db->commit();

        //notifcation When someone like a Professional.
        $professional = Engine_Api::_()->getItem('professional', $professional_id);
        $user = Engine_Api::_()->getItem('user', $professional->user_id);
        Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($user, $viewer, $viewer, 'booking_userlikepro');
        //end notifcation 
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    }
    $select = $tableLike->select()
      ->from($tableMainLike, array('total' => new Zend_Db_Expr('COUNT(professional_id)')))
      ->where('professional_id = ?', $professional_id);
    $count = $tableLike->fetchRow($select);
    $item = Engine_Api::_()->getItem('professional', $professional_id);
    $item->like_count = $count['total'];
    $item->save();
    if (!$result)
      $activityApi = Engine_Api::_()->getDbtable('actions', 'activity')->addActivity($viewer, $item, 'booking_userlikepro');
    echo $count['total'];
    die();
  }

  function followAction()
  {
    $count = "";
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $professional_id = $this->_getParam('professional_id', null);
    $tablefollow = Engine_Api::_()->getDbTable('follows', 'booking');
    $tableMainLike = $tablefollow->info('name');
    $select = $tablefollow->select()
      ->from($tableMainLike)
      ->where('professional_id = ?', $professional_id)
      ->where('user_id = ?', $viewerId);
    $result = $tablefollow->fetchRow($select);
    if ($result) {
      //delete follow
      $db = $tablefollow->getAdapter();
      $db->beginTransaction();
      try {
        //delete follow if already exist.
        $tablefollow->delete(array("professional_id = ?" => $professional_id, "user_id = ?" => $viewerId));
        $db->commit();
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    } else {
      $db = $tablefollow->getAdapter();
      $db->beginTransaction();
      try {
        //insert like
        $tablefollows = $tablefollow->createRow();
        $formValues['professional_id'] = $professional_id;
        $formValues['user_id'] = $viewerId;
        $tablefollows->setFromArray($formValues);
        $tablefollows->save();
        $db->commit();

        //notifcation When someone follow a Professional.
        $professional = Engine_Api::_()->getItem('professional', $professional_id);
        $user = Engine_Api::_()->getItem('user', $professional->user_id);
        Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($user, $viewer, $user, 'booking_userfollowpro');
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    }
    $select = $tablefollow->select()
      ->from($tableMainLike, array('total' => new Zend_Db_Expr('COUNT(professional_id)')))
      ->where('professional_id = ?', $professional_id);
    $count = $tablefollow->fetchRow($select);
    $item = Engine_Api::_()->getItem('professional', $professional_id);
    $item->follow_count = $count['total'];
    $item->save();
    if (!$result) //activity feed
      $activityApi = Engine_Api::_()->getDbtable('actions', 'activity')->addActivity($viewer, $item, 'booking_userfollowpro');
    echo $count['total'];
    die();
  }

  function favouriteAction()
  {
    $count = "";
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $professional_id = $this->_getParam('professional_id', null);
    $tablefavourite = Engine_Api::_()->getDbTable('favourites', 'booking');
    $tableMainLike = $tablefavourite->info('name');
    $select = $tablefavourite->select()
      ->from($tableMainLike)
      ->where('professional_id = ?', $professional_id)
      ->where('user_id = ?', $viewerId);
    $result = $tablefavourite->fetchRow($select);
    if ($result) {
      //delete favourite
      $db = $tablefavourite->getAdapter();
      $db->beginTransaction();
      try {
        //delete favourite 
        $tablefavourite->delete(array("professional_id = ?" => $professional_id, "user_id = ?" => $viewerId));
        $db->commit();
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    } else {
      $db = $tablefavourite->getAdapter();
      $db->beginTransaction();
      try {
        //insert favourite
        $tablefavourites = $tablefavourite->createRow();
        $formValues['professional_id'] = $professional_id;
        $formValues['user_id'] = $viewerId;
        $tablefavourites->setFromArray($formValues);
        $tablefavourites->save();
        $db->commit();

        //notifcation & mail When someone mark favourite for professional 
        $professional = Engine_Api::_()->getItem('professional', $professional_id);
        $user = Engine_Api::_()->getItem('user', $professional->user_id);
        Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($user, $viewer, $user, 'booking_userfavpro');
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    }
    $select = $tablefavourite->select()
      ->from($tableMainLike, array('total' => new Zend_Db_Expr('COUNT(professional_id)')))
      ->where('professional_id = ?', $professional_id);
    $count = $tablefavourite->fetchRow($select);
    $item = Engine_Api::_()->getItem('professional', $professional_id);
    $item->favourite_count = $count['total'];
    $item->save();
    if (!$result)
      $activityApi = Engine_Api::_()->getDbtable('actions', 'activity')->addActivity($viewer, $item, 'booking_userfavpro');
    echo $count['total'];
    die();
  }

  function servicelikeAction()
  {
    $count = "";
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $service_id = $this->_getParam('service_id', null);
    $tableLike = Engine_Api::_()->getDbTable('servicelikes', 'booking');
    $tableMainLike = $tableLike->info('name');
    $select = $tableLike->select()
      ->from($tableMainLike)
      ->where('service_id = ?', $service_id)
      ->where('user_id = ?', $viewerId);
    $result = $tableLike->fetchRow($select);
    if ($result) {
      //update like
      $db = $tableLike->getAdapter();
      $db->beginTransaction();
      try {
        //insert like
        $tableLike->delete(array("service_id = ?" => $service_id, "user_id = ?" => $viewerId));
        $db->commit();
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    } else {
      $db = $tableLike->getAdapter();
      $db->beginTransaction();
      try {
        //insert like
        $tableLikes = $tableLike->createRow();
        $formValues['service_id'] = $service_id;
        $formValues['user_id'] = $viewerId;
        $tableLikes->setFromArray($formValues);
        $tableLikes->save();
        $db->commit();
        //notifcation When someone like professional service.  
        $service = Engine_Api::_()->getItem('booking_service', $service_id);
        $user = Engine_Api::_()->getItem('user', $service->user_id);
        Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($user, $viewer, $user, 'booking_userlikeserv',array('servicename'=>$service));
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    }
    $select = $tableLike->select()
      ->from($tableMainLike, array('total' => new Zend_Db_Expr('COUNT(service_id)')))
      ->where('service_id = ?', $service_id);
    $count = $tableLike->fetchRow($select);
    $item = Engine_Api::_()->getItem('booking_service', $service_id);
    $item->like_count = $count['total'];
    $item->save();
    if (!$result)
      $activityApi = Engine_Api::_()->getDbtable('actions', 'activity')->addActivity($viewer, $item, 'booking_userlikeser');
    echo $count['total'];
    die();
  }

  function servicefavouriteAction()
  {
    $count = "";
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $service_id = $this->_getParam('service_id', null);
    $tableFavourite = Engine_Api::_()->getDbTable('servicefavourites', 'booking');
    $tableMainFavourite = $tableFavourite->info('name');
    $select = $tableFavourite->select()
      ->from($tableMainFavourite)
      ->where('service_id = ?', $service_id)
      ->where('user_id = ?', $viewerId);
    $result = $tableFavourite->fetchRow($select);
    if ($result) {
      //update Favourite
      $db = $tableFavourite->getAdapter();
      $db->beginTransaction();
      try {
        //insert Favourite
        $tableFavourite->delete(array("service_id = ?" => $service_id, "user_id = ?" => $viewerId));
        $db->commit();
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    } else {
      $db = $tableFavourite->getAdapter();
      $db->beginTransaction();
      try {
        //insert Favourite
        $tableFavourites = $tableFavourite->createRow();
        $formValues['service_id'] = $service_id;
        $formValues['user_id'] = $viewerId;
        $tableFavourites->setFromArray($formValues);
        $tableFavourites->save();
        $db->commit();
        //notifcation When someone marked professional service as favourite.  
        $service = Engine_Api::_()->getItem('booking_service', $service_id);
        $user = Engine_Api::_()->getItem('user', $service->user_id);
        Engine_Api::_()->getDbTable('notifications', 'activity')->addNotification($user, $viewer, $user, 'booking_userfavserv', array('servicename' => $service));
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
    }
    $select = $tableFavourite->select()
      ->from($tableMainFavourite, array('total' => new Zend_Db_Expr('COUNT(service_id)')))
      ->where('service_id = ?', $service_id);
    $count = $tableFavourite->fetchRow($select);
    $item = Engine_Api::_()->getItem('booking_service', $service_id);
    $item->favourite_count = $count['total'];
    $item->save();
    if (!$result)
      $activityApi = Engine_Api::_()->getDbtable('actions', 'activity')->addActivity($viewer, $item, 'booking_userfavser');
    echo $count['total'];
    die();
  }

  public function accountDetailsAction()
  {
    $messages = array();
    parse_str($_REQUEST['data'], $data);
    $viewer = Engine_Api::_()->user()->getViewer();

    $userGateway = Engine_Api::_()->getDbtable('usergateways', 'sesbasic')->getUserGateway(array('user_id' => $viewer->getIdentity(), 'enabled' => true));

    $settings = Engine_Api::_()->getApi('settings', 'core');
    $userGatewayEnable = 'paypal';
    $gatewayTitle = 'Paypal';
    $gatewayClass = 'Sesbasic_Plugin_Gateway_PayPal';

    $values = $data;
    $enabled = (bool)$values['enabled'];
    unset($values['enabled']);

    $db = Engine_Db_Table::getDefaultAdapter();
    $db->beginTransaction();
    $userGatewayTable = Engine_Api::_()->getDbtable('usergateways', 'sesbasic');
    // insert data to table if not exists
    try {
      if (!count($userGateway)) {
        $gatewayObject = $userGatewayTable->createRow();
        $gatewayObject->user_id = $viewer->getIdentity();
        $gatewayObject->title = $gatewayTitle;
        $gatewayObject->plugin = $gatewayClass;
        $gatewayObject->save();
      } else {
        $gatewayObject = Engine_Api::_()->getItem("sesbasic_usergateway", $userGateway['usergateway_id']);
      }
      $db->commit();
    } catch (Exception $e) {
      echo $e->getMessage();
    }
    // Validate gateway config
    if ($enabled) {
      $gatewayObjectObj = $gatewayObject->getGateway('booking');
      try {
        $gatewayObjectObj->setConfig($values);
        $response = $gatewayObjectObj->test();
      } catch (Exception $e) {
        $enabled = false;
        //$form->populate(array('enabled' => false));
        $messages['gatewayloginfail'] = (sprintf('Gateway login failed. Please double check ' .
          'your connection information. The gateway has been disabled. ' .
          'The message was: [%2$d] %1$s', $e->getMessage(), $e->getCode()));
      }
    } else {
      $messages['disable'] = 'Gateway is currently disabled.';
    }
    // Process
    $message = null;
    try {
      $values = $gatewayObject->getPlugin()->processAdminGatewayForm($values);
    } catch (Exception $e) {
      $message = $e->getMessage();
      $values = null;
    }
    if (null !== $values) {
      $gatewayObject->setFromArray(array(
        'enabled' => $enabled,
        'config' => $values,
      ));
      $gatewayObject->save();
      $messages['success'] = 'Changes saved.';
    } else {
      $messages['message'] = $message;
    }
    echo json_encode($messages);
    die;
  }
}
