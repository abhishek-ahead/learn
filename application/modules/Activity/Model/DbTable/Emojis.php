<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Activity
 * @package    Activity
 * @copyright  Copyright 2017-2018 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Emojis.php  2017-11-14 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */

class Activity_Model_DbTable_Emojis extends Engine_Db_Table
{
  protected $_rowClass = 'Activity_Model_Emoji';

  public function getPaginator($params = array())
  {
    return Zend_Paginator::factory($this->getEmojis($params));
  }

  public function getEmojis($params = array())
  {
    $select = $this->select()
      ->where('emoji_id <> ?', 3)
      ->order('order ASC')
      ;
    if (!empty($params['fetchAll'])) {
      return $this->fetchAll($select);
    }
    return $select;
  }
}