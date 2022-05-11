<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Settingservices.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Model_DbTable_Settingservices extends Engine_Db_Table {
    protected $_rowClass = "Booking_Model_Settingservice";

    public function getTableSettings($params = array())
	{
		$settings_data=array();
		$select = $this->select()
            ->from($this->info('name'), array('*'))
            ->where('setting_id =?', $params['setting_id'])
            ->where('user_id =?',$params['user_id']);
        return $this->fetchAll($select);
        
	}

    public function isAvailableServiceID($params = array())
    {
        $select = $this->select()
                ->from($this->info('name'), array('service_id'))
                ->where('service_id =?', $params['service_id'])
                ->where('user_id =?',$params['user_id']);
        $data=$this->fetchRow($select);
        return ((empty($data->service_id))?true:false);
    }
}
