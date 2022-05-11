<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Servicefavourites.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Model_DbTable_Servicefavourites extends Engine_Db_Table {
    
    protected $_rowClass = "Booking_Model_Servicefavourite";

    public function isUserFavourite($params = array()) {
		$select = $this->select()
            ->from($this->info('name'), array('servicefavourite_id'))
            ->where('user_id =?', $params['user_id'])
            ->where('service_id =?', $params['service_id']);
      return ($this->fetchRow($select)) ? 1 : 0 ;
    }
    
    public function getAllServicefavourites($service_id){
      $select = $this->select()
            ->from($this->info('name'))
            ->where('service_id =?', $service_id);
      return $select;
    }
}
