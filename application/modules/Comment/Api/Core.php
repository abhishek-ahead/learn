<?php

/**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Comment
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Core.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */
class Comment_Api_Core extends Core_Api_Abstract
{

  public function likesGroup($action, $subject = false)
  {

    if (!$subject)
      $resource = $action->likes(true);
    else
      $resource = $action;

    if ($resource->getType() == 'activity_action' || $resource->getType() == 'activity_action') {
      $table = Engine_Api::_()->getItemTable('activity_like');
      $select = $table->select();
    } else {
      $table = Engine_Api::_()->getItemTable('core_like');
      $select = $table->select();
      $select->where('resource_type = ?', $resource->getType());
    }

    $recTable = Engine_Api::_()->getDbTable('reactions', 'comment')->info('name');
    $tableName = $table->info('name');

    $select->setIntegrityCheck(false)
      ->from($tableName, array('type' => 'type', 'counts' => new Zend_Db_Expr('COUNT(like_id)'), 'total' => new Zend_Db_Expr('COUNT(like_id)')));

    $select->joinLeft($recTable, $recTable . '.reaction_id =' . $tableName . '.type', array('file_id'))
      ->where($tableName . '.resource_id = ?', $resource->getIdentity())
      ->order($tableName . '.like_id ASC')
      ->group($tableName . '.type')
      ->where('enabled =?', 1)
      ->order('total DESC');

    return array('data' => $table->fetchAll($select), 'resource_type' => $resource->getType(), 'resource_id' => $resource->getIdentity());
  }

  public function commentLikesGroup($resource)
  {

    if ($resource->getType() == 'comment_activity') {
      $table = Engine_Api::_()->getItemTable('activity_like');
      $select = $table->select();
    } else {
      $table = Engine_Api::_()->getItemTable('core_like');
      $select = $table->select();
      $select->where('resource_type = ?', $resource->getType());
    }
    $recTable = Engine_Api::_()->getDbTable('reactions', 'comment')->info('name');
    $tableName = $table->info('name');

    $select->setIntegrityCheck(false)
      ->from($table->info('name'), array('type' => 'type', 'counts' => new Zend_Db_Expr('COUNT(like_id)'), 'total' => new Zend_Db_Expr('COUNT(like_id)')));

    $select->joinLeft($recTable, $recTable . '.reaction_id =' . $tableName . '.type', array('file_id'))
      ->where($tableName . '.resource_id = ?', $resource->getIdentity())
      ->order($tableName . '.like_id ASC')
      ->group($tableName . '.type')
      ->where('enabled =?', 1)
      ->order('total DESC');

    return array('data' => $table->fetchAll($select), 'resource_type' => $resource->getType(), 'resource_id' => $resource->getIdentity());
  }

  public function getReply($comment_id, $subject , $page = 'zero')
  {

    $commentsTableName = Engine_Api::_()->getDbtable('comments', 'core')->info('name');
    $select = $subject->comments()->getCommentSelect();

    $select->setIntegrityCheck(false)
      ->from($commentsTableName, array('*'));

    $select->where('parent_id =?', $comment_id);

    if ($page == 'zero') {
      $commentCount = engine_count($select->query()->fetchAll());
      $page = ceil($commentCount / 5);
    } else {
      $select->where($commentsTableName . '.comment_id > ' . $comment_id);
    }
    $select->reset('order');

    $select->order('comment_id ASC');
    $comments = Zend_Paginator::factory($select);

    $comments->setCurrentPageNumber($page);
    $comments->setItemCountPerPage(5);
    return $comments;
  }

  public function commentCount($action, $subject = false)
  {

    if (!$subject)
      $resource = $action->comments(true);
    else
      $resource = $action;

    if ($resource->getType() == 'activity_action') {
      $table = Engine_Api::_()->getItemTable('activity_comment');
      $tableName = $table->info('name');
      $select = $table->select()->from($tableName, new Zend_Db_Expr('SUM(1  + reply_count) as count'));
      $select->setIntegrityCheck(false);
    } else {
      $table = Engine_Api::_()->getItemTable('core_comment');
      $tableName = $table->info('name');
      $select = $table->select()->from($tableName, new Zend_Db_Expr('SUM(1  + reply_count) as count'));
      $select->where($tableName . '.resource_type = ?', $resource->getType());
      $select->setIntegrityCheck(false);
    }

    $select->where('parent_id =?', 0);
    $select
      ->where($tableName . '.resource_id = ?', $resource->getIdentity())
      ->group($tableName . '.resource_id');

    $data = $select->query()->fetchAll();
    if (!empty($data[0]))
      return (int) @$data[0]['count'];
    else
      return 0;
  }
}
