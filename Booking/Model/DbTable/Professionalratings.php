<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Professionalratings.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Model_DbTable_Professionalratings extends Engine_Db_Table {

  protected $_rowClass = "Booking_Model_Professionalrating";

  function isProfessionalratingAvailable($param = array()) { 
    $select = $this->select();
    $select->from($this->info('name'), array('professionalrating_id'))
      ->where('user_id = ?', $param['user_id'])
      ->where('professional_id =?', $param['professional_id']);
    return ($this->fetchRow($select)) ? "update" : "insert";

  }

  function avgRating($param = array()) {
    $select = $this->select();
    $select->from($this->info('name'), array('rating' => new Zend_Db_Expr('ROUND(SUM(rating) / COUNT(rating),1)')))
      ->where('professional_id =?', $param['professional_id']);
    return $this->fetchRow($select);
  }

}
