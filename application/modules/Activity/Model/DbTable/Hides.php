<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Hides.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Activity_Model_DbTable_Hides extends Engine_Db_Table {

  public function getHides($params = array()){
    $select = $this->select()->where('action_id =?',$params['action_id'])->where('user_id =?',$params['user_id'])->limit(1);
    return $this->fetchRow($select);  
  }
  
}
