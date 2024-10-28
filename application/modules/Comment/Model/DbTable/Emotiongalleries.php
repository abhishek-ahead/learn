<?php

/**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Comment
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Emotiongalleries.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Comment_Model_DbTable_Emotiongalleries extends Engine_Db_Table
{
  protected $_rowClass = 'Comment_Model_Gallery';
  public function getPaginator($params = array())
  {
    return Zend_Paginator::factory($this->getGallery($params));
  }
  public function getGallery($params = array())
  {
    $select = ($this->select());
    if (!empty($params['type']) && $params['type'] && $params['type'] == 'user') {
      $select->where('enabled =?', 1);
    }
    if (!empty($params['fetchAll'])) {
      return $this->fetchAll($select);
    }
    return $select;

  }
}
