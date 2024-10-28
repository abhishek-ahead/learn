<?php

/**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Comment
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Voteupdowns.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Comment_Model_DbTable_Voteupdowns extends Engine_Db_Table
{
  protected $_rowClass = 'Comment_Model_Voteupdown';

  public function isVote($params = array())
  {
    $select = $this->select()
      ->where('resource_id =?', $params['resource_id'])
      ->where('resource_type =?', $params['resource_type'])
      ->where('user_type =?', $params['user_type'])
      ->where('user_id =?', $params['user_id'])
      ->limit(1);
    return $this->fetchRow($select);
  }

}
