<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Attachment.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Activity_Model_Attachment extends Core_Model_Item_Abstract {
  protected $_searchTriggers = false;

  public function getNextPhoto()
  {
    $table = Engine_Api::_()->getItemTable('activity_attachment');
    $select = $table->select()
      //->where('id = ?', $this->id)
      //->where('type = ?', $this->type)
      ->where('action_id = ?', $this->action_id)
      ->where('`attachment_id` > ?', $this->attachment_id)
      ->order('attachment_id ASC')
      ->limit(1);
    $photo = $table->fetchRow($select);

    if( !$photo ) {
      // Get first photo instead
      $select = $table->select()
          //->where('id = ?', $this->id)
          //->where('type = ?', $this->type)
          ->where('action_id = ?', $this->action_id)
          ->order('attachment_id ASC')
          ->limit(1);
      $photo = $table->fetchRow($select);
    }

    return $photo;
  }

  public function getPreviousPhoto()
  {
    $table = $this->getTable();
    $select = $table->select()
      //->where('id = ?', $this->id)
      //->where('type = ?', $this->type)
      ->where('action_id = ?', $this->action_id)
      ->where('`attachment_id` < ?', $this->attachment_id)
      ->order('attachment_id DESC')
      ->limit(1);
    $photo = $table->fetchRow($select);

    if( !$photo ) {
      // Get last photo instead
      $select = $table->select()
          //->where('id = ?', $this->id)
          //->where('type = ?', $this->type)
          ->where('action_id = ?', $this->action_id)
          ->order('attachment_id DESC')
          ->limit(1);
      $photo = $table->fetchRow($select);
    }

    return $photo;
  }
}