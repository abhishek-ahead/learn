<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Filterlists.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */


class Activity_Model_DbTable_Filterlists extends Engine_Db_Table {

  protected $_rowClass = 'Activity_Model_Filterlist';
  
  public function getLists($notArray = ''){
    $select = $this->select()->where('active =?',1)->order('order ASC');
    if($notArray)
      $select->where('filtertype NOT IN(?)',implode(',',$notArray));
    return $this->fetchAll($select);  
  }

  public function isFilterExists($params = array())
  {
    return $this->select()
              ->from($this->info('name'), 'filterlist_id')
              ->where('filtertype =?', $params['filtertype'])
              ->query()
              ->fetchColumn();
  }
  
}
