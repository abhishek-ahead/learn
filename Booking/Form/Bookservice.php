<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Bookservice.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Bookservice extends Engine_Form
{

  protected $_serviceId;
  protected $_professionalId;

  function getSettingId($settingId)
  {
    $this->_serviceId = $settingId;
  }

  function setSettingId($settingId)
  {
    $this->_serviceId = $settingId;
  }

  function getProfessionalId($professionalId)
  {
    $this->_professionalId = $professionalId;
  }

  function setProfessionalId($professionalId)
  {
    $this->_professionalId = $professionalId;
  }

  public function init()
  {
    $this->setAttrib('class', 'select_service_form');
    $viewer = Engine_Api::_()->user()->getViewer();
    $viewerId = $viewer->getIdentity();
    $settingservices = Engine_Api::_()->getDbtable('settingservices', 'booking')->getTableSettings(array("setting_id" => $this->_serviceId, "user_id" => $this->_professionalId));
    $serviceData = array();
    foreach ($settingservices as $value) {
      $serviceData[] = $value->service_id;
    }
    $getSelectiveService = Engine_Api::_()->getDbTable('services', 'booking')->getSelectiveService($serviceData, (int)$this->_professionalId);
    $options = array();
    foreach ($getSelectiveService as $value) {
      if($_POST['service_id']){
        if($_POST['service_id'] == $value->service_id){
          $options[$value->service_id . "|" . Engine_Api::_()->booking()->getCurrencyPrice($value->price) . "|" . (($value->timelimit == "m") ? $value->duration : $minutes = Engine_Api::_()->booking()->hoursToMinutes($value->duration))] = $value->name . " (" . Engine_Api::_()->booking()->getCurrencyPrice($value->price) . ") / " . $value->duration . " " . (($value->timelimit == "h") ? "Hour." : "Minutes.");
          break;
        }
      }else
        $options[$value->service_id . "|" . Engine_Api::_()->booking()->getCurrencyPrice($value->price) . "|" . (($value->timelimit == "m") ? $value->duration : $minutes = Engine_Api::_()->booking()->hoursToMinutes($value->duration))] = $value->name . " (" . Engine_Api::_()->booking()->getCurrencyPrice($value->price) . ") / " . $value->duration . " " . (($value->timelimit == "h") ? "Hour." : "Minutes.");
    }

    $activate = true;
    if ($this->_professionalId == $viewerId) {
      if (Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.allow.for', 1)) {
        $this->addElement('Text', 'bookto', array(
          'label' => 'Booking for:',
          'autocomplete' => "off",
          'id' => 'bookto',
        ));
      } else {
        $friendsIds = $viewer->membership()->getMembersIds();
        if (!empty($friendsIds)) {
          $this->addElement('Text', 'bookto', array(
            'label' => 'Booking for:',
            'autocomplete' => "off",
            'id' => 'bookto',
          ));
        } else {
          $this->addElement('Dummy', 'bookto', array(
            'content' => '<div class="tip"><span>currently you don\'t have any friends yet! make friends before book an appointment for other.</span></div>',
          ));
          $activate = false;
        }
      }
      $this->addElement('Hidden', 'bookto_userid', array(
        'order' => 10002,
      ));
    }

    if (empty($options)) {
      $this->addElement('Dummy', "noservices", array(
        'content' => '<span class="tip">No services available yet for this slot</span>'
      ));
      $activate = false;
    } else {
      $this->addElement('MultiCheckbox', "services", array(
        'label' => "Services",
        'multiOptions' => $options,
        'value' => '',
      ));
    }

    if ($activate)
      $this->addElement('Button', 'calculate', array(
        'type' => 'button',
        'onclick' => 'calc()',
      ));

    $this->addElement('Dummy', "dummy", array(
      'content' => ""
        . "<div id='totalestimate'></div>"
        . "<input type='hidden' name='totalprice' class='totalprice'/>"
        . "<input type='hidden' name='totaltime' class='totaltime'/>"
        . "<input type='hidden' name='professioanltime' class='professioanltime'/>"
        . "<input type='hidden' name='viewertime' class='viewertime'/>"
        . "<input type='hidden' id='bookingendtime' class='bookingendtime'/>"
    ));

    $this->addElement('Button', 'Send request', array(
      'type' => 'button',
      'id' => 'appointmentrequest',
      'label' => 'Send Request',
    ));
  }
}
