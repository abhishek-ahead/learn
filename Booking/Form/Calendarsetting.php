<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Calendarsetting.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Calendarsetting extends Engine_form {

  protected $_dayId;

  function getDayId($dayId) {
    $this->_dayId = $dayId;
    return $this->_dayId;
  }

  function setDayId($dayId) {
    $this->_dayId = $dayId;
    return $this->_dayId;
  }

  public function init() {
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $ifNoDurationAvailable = Engine_Api::_()->getDbTable('durations', 'booking')->durationsAvailabel();
    $ifNoServicesAvailable = Engine_Api::_()->getDbTable('services', 'booking')->servicesAvailabel($viewerId);
    $dateInAppointments = Engine_Api::_()->getDbtable('appointments', 'booking')->isDateInAppointments(array("professional_id" => $viewerId));
    if (empty($ifNoDurationAvailable) || empty($ifNoServicesAvailable)) {
      $this->addElement('Dummy', 'warning', array(
          'id' => 'timeslots-demo',
          'content' => '<span class="tip"><span>NO ' . (empty($ifNoDurationAvailable) ? ' durations ' : '') . (empty($ifNoServicesAvailable) ? ', services' : '') . ' created yet!</span></span>'
      ));
    }
    if (!empty($dateInAppointments->toArray())) {
      $getCurrentDaySettings = array("mon" => 1, "tue" => 2, "wed" => 3, "thu" => 4, "fri" => 5, "sat" => 6, "sun" => 7);
      foreach ($dateInAppointments as $value) {
        if ($this->_dayId == $getCurrentDaySettings[strtolower(date("D", strtotime($value->date)))]) {
          $this->addElement('Dummy', 'warning', array(
              'id' => 'timeslots-demo',
              'content' => '<span class="tip"><span>Slots are already booked for appointment on ' . array_search($this->_dayId, array("Monday" => 1, "Tuesday" => 2, "Wednesday" => 3, "Thursday" => 4, "Friday" => 5, "Saturday" => 6, "Sunday" => 7)) . ', please be sure any change in calender settings</span></span>',
          ));
        }
      }
    }

    $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($viewerId);
    // $userSelected = Engine_Api::_()->getItem('user', $professional->user_id);
    // if (Engine_Api::_()->authorization()->getPermission($userSelected->level_id, 'booking', 'paymod')) {
    //   $ifUserGatewayAvailable = Engine_Api::_()->getDbTable('usergateways', 'booking')->getUserGateway(array("professional_id" => $professional->professional_id));
    //   if (!$ifUserGatewayAvailable->usergateway_id) {
    //     $this->addElement('Dummy', 'nopayment', array(
    //       'content' => '<span class="tip"><span>You have\'t save your payments details yet. Please save your payment details first then make changes in calendar settings.</span></span>',
    //     ));
    //   }
    // }

    $this->addElement('Dummy', 'demo', array(
        'id' => 'timeslots-demo',
        'content' => '<p id="demo"></p>'
    ));

    $this->addElement('Select', 'offday', array(
        'label' => 'Off Day',
        'multiOptions' => array(0 => "No", 1 => "Yes"),
        'allowEmpty' => FALSE,
        'required' => true,
        'registerInArrayValidator' => false,
        'value' => 0
    ));

    $results = Engine_Api::_()->getDbtable('durations', 'booking')->getMinutes();
    $this->setTitle('Calendar Settings');
    $this->addElement('Select', 'duration', array(
        'label' => 'Appointment Duration',
        'multiOptions' => $results,
        'allowEmpty' => FALSE,
        'required' => true,
        'id' => 'duration',
        //'onchange'=>'loaddataindropdown(this.value,booking_start_time.value,booking_end_time.value)',
        'value' => current(array_keys($results)),
    ));

    $start_time = "09:00 am";
    $end_time = "06:00 pm";

    $this->addElement('Text', 'starttime', array(
        'label' => 'Start Time 12 am (00:00)',
        'value' => $start_time,
        'allowEmpty' => FALSE,
        'required' => true,
    ));

    $this->addElement('Text', 'endtime', array(
        'label' => 'End Time 12 am (24:00)',
        'value' => $end_time,
        'allowEmpty' => FALSE,
        'required' => true,
    ));

    $this->addElement('Button', 'refreshslots', array(
        'label' => 'Display Slots',
        'type' => 'button',
    ));

    $timeslots = "";
    $i = 0;
    if ($this->_dayId) {
      $tableData = array(
          'day' => $this->_dayId,
          'user_id' => $viewerId,
      );
      $data1 = Engine_Api::_()->getDbtable('settings', 'booking')->getTableSettings($tableData);
      if ($data1) {
        $settingservices = array(
            'setting_id' => $data1->setting_id,
            'user_id' => $viewerId,
        );
        $timeDuration = Engine_Api::_()->booking()->buildSlots($data1->duration, date("H:i", strtotime($data1->starttime)), str_replace("00:00", "24:00", date('H:i', strtotime($data1->endtime))));
        $data3 = Engine_Api::_()->getDbtable('settingdurations', 'booking')->getDurationSettings($settingservices);
        $arrayDurations = array();
        foreach ($data3 as $duration) {
          $arrayDurations[$duration['starttime']] = $duration['endtime'];
        }
        $slotsInAppointments = array();
        foreach ($dateInAppointments as $dateInAppointmentsvalue) {
          $slotsRange = Engine_Api::_()->getDbtable('settingdurations', 'booking')->slotsRanges(array("starttime" => $dateInAppointmentsvalue->professionaltime, "endtime" => $dateInAppointmentsvalue->serviceendtime));
          foreach ($slotsRange as $slotsValue) {
            $slotsInAppointments[] = $slotsValue->starttime;
          }
        }
        array_shift($slotsInAppointments);
        foreach ($timeDuration['start_time'] as $key => $value) {
          $active = $bookedMark = '';
          if ($slotsInAppointments[$key] == date("H:i", strtotime($value))) {
            $active = "class='active'";
            $bookedMark = "title='Booked'";
          }
          $checked = '';
          $i = $i + 1;
          $rand = rand(10, 999);
          if (array_key_exists(date('H:i', strtotime($value)), $arrayDurations) && in_array(str_replace("00:00", "24:00", date('H:i', strtotime($timeDuration['end_time'][$key]))), $arrayDurations)) {
            $checked = "checked='checked'";
          }
          $timeslots .= "<input id='" . ($rand) . "a' " . $checked . " type='checkbox' name='timeSlots' value='" . date('H:i', strtotime($value)) . "-" . str_replace("00:00", "24:00", date('H:i', strtotime($timeDuration['end_time'][$key]))) . "' >";
          $timeslots .= "<label for='" . ($rand) . "a' >" . date('h:i A', strtotime($value)) . " - " . date('h:i A', strtotime($timeDuration['end_time'][$key])) . "</label><br>";
        }
      }
    }
    if ($i != 0 || 1) {
      $this->addElement('Checkbox', 'selectall', array(
          'label' => 'Check all slots',
      ));
    }
    $this->addElement('Dummy', 'timeslots', array(
        'id' => 'timeslots-element',
        'content' => "<div class='" . ((5 < $i) ? 'scroll' : 'noscroll') . "'>" . $timeslots . "</div>",
    ));

    $servicesArray = array();
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $table = Engine_Api::_()->getDbTable('services', 'booking');
    $paginator = $table->getServices(array('user_id' => $viewerId));
    foreach ($paginator as $value) {
      $servicesArray[] = 'service_' . $value['service_id'];
      $this->addElement('Checkbox', 'service_' . $value['service_id'], array(
          'label' => $value['name'] . " (" . Engine_Api::_()->booking()->getCurrencyPrice($value->price) . ") / " . $value->duration . " " . (($value->timelimit == "h") ? "Hour." : "Minutes."),
          'class' => 'chkListItem',
          'id' => $value['service_id']
      ));
    }

    $allElements = array('duration', 'starttime', 'endtime', 'refreshslots', 'selectall', 'timeslots');
    $this->addDisplayGroup(array_merge($allElements, $servicesArray), 'allelements');

    $this->addElement('Button', 'button', array(
        'label' => 'Save Slots',
        'type' => 'button',
        'ignore' => true,
        'id' => 'saveData',
    ));
  }

}

?>
