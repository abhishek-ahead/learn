<?php

/**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Comment
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Commentfiles.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Comment_Model_DbTable_Commentfiles extends Engine_Db_Table
{
  public function getFiles($params = array())
  {
    $select = $this->select()->where('comment_id =?', $params['comment_id']);
    return $this->fetchAll($select);
  }
}
