<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Favourites.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Model_DbTable_Favourites extends Engine_Db_Table {

  protected $_rowClass = "Booking_Model_Favourite";

  public function isUserFavourite($params = array()) {
    $select = $this->select()
    ->from($this->info('name'), array('favourite_id'))
    ->where('user_id =?', $params['user_id'])
    ->where('professional_id =?', $params['professional_id']);
    return ($this->fetchRow($select)) ? 1 : 0 ;
  }

}
