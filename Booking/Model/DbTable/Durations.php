<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Durations.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Model_DbTable_Durations extends Engine_Db_Table {

  protected $_rowClass = "Booking_Model_Duration";

  public function getMinutes() {
    $menuoptions = array();
    $select = $this->select()
      ->from($this->info('name'), array('durations', 'type'))
      ->order("durationorder ASC")
      ->where('active = ?', 1);
    $data = $this->fetchAll($select);
    foreach ($data as $key => $value) {
      $menuoptions[
        (($value->type == "m") ? $value->durations : $minutes = Engine_Api::_()->booking()->hoursToMinutes($value->durations))
        ] = (($value->type == "m") ? $value->durations . " Minutes" : str_replace("  0 Minutes", "", Engine_Api::_()->booking()->minutesToHours(Engine_Api::_()->booking()->hoursToMinutes($value->durations))));
    }
    return $menuoptions;
  }

  public function durationsAvailabel() {
    $action = false;
    $select = $this->select()
      ->from($this->info('name'), array('durations', 'type'))
      ->where('active = ?', 1);
    $data = $this->fetchAll($select);
    foreach ($data as $key => $value) {
      $action = true;
    }
    return $action;
  }

}
