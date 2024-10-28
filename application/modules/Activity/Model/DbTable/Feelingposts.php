<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Feelingposts.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Activity_Model_DbTable_Feelingposts extends Engine_Db_Table
{
  protected $_rowClass = 'Activity_Model_Feelingpost';
  
  public function getActionFeelingposts($action_id = ''){
    if(!$action_id)
      return array();
    $select = $this->select()->where('action_id =?',$action_id);
    if(!empty($params['paginator']))
      return $select;
    return $this->fetchRow($select);  
  }
}
