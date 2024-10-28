<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Activity
 * @package    Activity
 * @copyright  Copyright 2017-2018 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Emojiicons.php  2017-11-14 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */

class Activity_Model_DbTable_Emojiicons extends Engine_Db_Table
{

  protected $_rowClass = 'Activity_Model_Emojiicon';

  public function getPaginator($params = array())
  {
    return Zend_Paginator::factory($this->getEmojiicons($params));
  }

  public function getEmojiicons($params = array())
  {
    $select = $this->select()->order('order ASC');
    if (!empty($params['limit'])) {
      $select->limit($params['limit']);
    }
    if(isset($params['emoji_id']) && !empty($params['emoji_id'])) {
     $select->where('emoji_id =?', $params['emoji_id']);
    }
    if (!empty($params['fetchAll'])) {
      return $this->fetchAll($select);
    }
    return $select;
  }

  public function getEmojiFileId($params = array())
  {
    return $this->select()
      ->from($this->info('name'), array($params['column']))
      ->where('emoji_encodecode =?', $params['emoji_encodecode'])
      ->query()
      ->fetchColumn();
  }

  public function getEmojiIconExist($params = array())
  {
    return $this->select()
      ->from($this->info('name'), array('emojiicon_id'))
      ->where('emoji_icon =?', $params['emoji_icon'])
      ->query()
      ->fetchColumn();
  }
}