<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: ActivityLoop.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */
class Activity_View_Helper_ActivityLoop extends Activity_View_Helper_Activity
{
  public function activityLoop($actions = null, array $data = array())
  {
    if( !($actions instanceof Zend_Db_Table_Rowset_Abstract)) {
      //return '';
    }
    
    $form = new Activity_Form_Comment();
    $viewer = Engine_Api::_()->user()->getViewer();
    $activity_moderate = "";
	  $group_owner ="";
	  $group = "";
    try
    {
        if (Engine_Api::_()->core()->hasSubject('group')) {
            $group = Engine_Api::_()->core()->getSubject('group');
        }
    }
    catch( Exception $e){
    }
    if ($group) {
    $table = Engine_Api::_()->getDbtable('groups', 'group');
    $select = $table->select()
         ->where('group_id = ?', $group->getIdentity())
         ->limit(1);

    $row = $table->fetchRow($select);
    $group_owner = $row['user_id'];
    }
    if($viewer->getIdentity()){
      $activity_moderate = Engine_Api::_()->getDbtable('permissions', 'authorization')->getAllowed('user', $viewer->level_id, 'activity');
    }
    $data = array_merge($data, array(
      'actions' => $actions,
      'commentForm' => $form,
      'user_limit' => Engine_Api::_()->getApi('settings', 'core')->getSetting('activity_userlength'),
      'allow_delete' => Engine_Api::_()->getApi('settings', 'core')->getSetting('activity_userdelete'),
      'activity_group' =>$group_owner,
      'activity_moderate' =>$activity_moderate,
    ));
     
    $data['feeddesign'] = empty($data['feeddesign']) ? 1 : $data['feeddesign'];
		$data['filterFeed'] = empty($data['filterFeed']) ? '' : $data['filterFeed'];
    $data['ulInclude'] = empty($data['ulInclude'])  || !empty($data->includeUl)? true : false;
    $data['contentCount'] = empty($data['contentCount']) ? 0 : $data['contentCount'];
    return $this->view->partial(
      '_activityText.tpl',
      'activity',
      $data
    );
  }
}
