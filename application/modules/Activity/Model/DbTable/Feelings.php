<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Feelings.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Activity_Model_DbTable_Feelings extends Engine_Db_Table {
  
  protected $_rowClass = 'Activity_Model_Feeling';
  
  public function getPaginator($params = array()) {

    return Zend_Paginator::factory($this->getFeelings($params));
  }

  public function getFeelings($params = array()) {

    $select = $this->select()->order('order ASC');
    if(empty($params['admin'])) {
      $select->where('enabled =?', 1);
    }
    if(!empty($params['notin']))
      $select->where('feeling_id !=?',1);
    if(!empty($params['fetchAll'])) {
      return $this->fetchAll($select);
    }
    return $select;
  }
}
