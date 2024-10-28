<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Hashtags.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Activity_Model_DbTable_Hashtags extends Engine_Db_Table {

  public function getAllHashtags($action_id) {
    
    $select = $this->select()
                  ->from($this->info('name'))
                  ->where('action_id =?', $action_id);
    return $this->fetchAll($select);
  }
}
