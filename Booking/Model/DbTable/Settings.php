<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Settings.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */

class Booking_Model_DbTable_Settings extends Engine_Db_Table {

  protected $_rowClass = 'Booking_Model_Setting';
  protected $_searchTriggers = false;
  
	public function getTableSettings($params = array())
	{
		$select = $this->select()
            ->from($this->info('name'), array('*'))
            ->where('user_id =?', $params['user_id'])
            ->where('day =?',$params['day']);
        return $this->fetchRow($select);
	}
  public function isDay($params = array())
  {
      $select = $this->select()
              ->from($this->info('name'), array('day'))
              ->where('user_id =?', $params['user_id'])
              ->where('day =?',$params['day']);
      $data=$this->fetchRow($select);
      return ((sizeof($data)==0)?"save":"update");
  }
}

// /->select()->where('day =?','active =?','1','1')