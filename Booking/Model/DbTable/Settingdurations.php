<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Settingdurations.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Model_DbTable_Settingdurations extends Engine_Db_Table {
    protected $_rowClass = "Booking_Model_Settingduration";

  public function getDurationSettings($params = array())
	{
		$select = $this->select()
            ->from($this->info('name'), array('*'))
            ->where('setting_id =?', $params['setting_id'])
            ->where('user_id =?',$params['user_id']);
        return $this->fetchAll($select);
	}

    public function isAvailableTimeSlots($params = array())
    {
        $select = $this->select()
                ->from($this->info('name'), array('starttime','endtime'))
                ->where('starttime =?',$params['starttime'])
                ->where('endtime =?', $params['endtime'])
                ->where('user_id =?',$params['user_id']);
        $data=$this->fetchRow($select);
        return ((empty($data))?true:false);
    }
    
    public function slotsRanges($params=  array()){
        $select = $this->select()
            ->from($this->info('name'), array('starttime'))
            ->where("starttime >= ?", $params['starttime'])
            ->where("endtime <= ?",$params['endtime']);
        return $this->fetchAll($select);
    }
}
