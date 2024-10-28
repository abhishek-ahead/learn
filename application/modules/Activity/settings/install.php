<?php
/**
 * SocialEngine
 *
 * @category   Application_Extensions
 * @package    Activity
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 */

/**
 * @category   Application_Extensions
 * @package    Activity
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 */
class Activity_Installer extends Engine_Package_Installer_Module
{
  protected $_dropColumnsOnPreInstall = array(
    '4.9.0' => array(
      'engine4_activity_actiontypes' => array('editable'),
      'engine4_activity_actions' => array('modified_date')
    )
  );
  
  public function onInstall() {
  
    $db = $this->getDb();
    
    //Profile Feeds Page
    $page_id = $db->select()
                ->from('engine4_core_pages', 'page_id')
                ->where('name = ?', 'activity_index_view')
                ->limit(1)
                ->query()
                ->fetchColumn();
    $widgetOrder = 1;
    // insert if it doesn't exist yet
    if( !$page_id ) {
      // Insert page
      $db->insert('engine4_core_pages', array(
        'name' => 'activity_index_view',
        'displayname' => 'Activity Profile Page',
        'title' => 'Profile Feed',
        'description' => '',
        'custom' => 0,
      ));
      $page_id = $db->lastInsertId();

      // Insert top
      $db->insert('engine4_core_content', array(
        'type' => 'container',
        'name' => 'top',
        'page_id' => $page_id,
        'order' => 1,
      ));
      $top_id = $db->lastInsertId();

      // Insert main
      $db->insert('engine4_core_content', array(
        'type' => 'container',
        'name' => 'main',
        'page_id' => $page_id,
        'order' => 2,
      ));
      $main_id = $db->lastInsertId();

      // Insert main-left
      $db->insert('engine4_core_content', array(
        'type' => 'container',
        'name' => 'left',
        'page_id' => $page_id,
        'parent_content_id' => $main_id,
        'order' => 3,
      ));
      $main_left_id = $db->lastInsertId();

      // Insert main-right
      $db->insert('engine4_core_content', array(
        'type' => 'container',
        'name' => 'right',
        'page_id' => $page_id,
        'parent_content_id' => $main_id,
        'order' => 4,
      ));
      $main_right_id = $db->lastInsertId();

      // Insert top-middle
      $db->insert('engine4_core_content', array(
        'type' => 'container',
        'name' => 'middle',
        'page_id' => $page_id,
        'parent_content_id' => $top_id,
        'order' => 5,
      ));
      $top_middle_id = $db->lastInsertId();

      // Insert main-middle
      $db->insert('engine4_core_content', array(
        'type' => 'container',
        'name' => 'middle',
        'page_id' => $page_id,
        'parent_content_id' => $main_id,
        'order' => 6,
      ));
      $main_middle_id = $db->lastInsertId();

      // Insert content
      $db->insert('engine4_core_content', array(
        'type' => 'widget',
        'name' => 'activity.feed',
        'page_id' => $page_id,
        'parent_content_id' => $main_middle_id,
        'order' => $widgetOrder++,
        'params' => '{"title":"What\'s New"}',
      ));
      // insert left content
      $db->insert('engine4_core_content', array(
        'type' => 'widget',
        'name' => 'user.home-links',
        'page_id' => $page_id,
        'parent_content_id' => $main_left_id,
        'order' => $widgetOrder++,
      ));
      $db->insert('engine4_core_content', array(
        'type' => 'widget',
        'name' => 'core.statistics',
        'page_id' => $page_id,
        'parent_content_id' => $main_left_id,
        'order' => $widgetOrder++,
        'params' => '{"title":"Statistics"}',
      ));
      // insert right content
      $db->insert('engine4_core_content', array(
        'type' => 'widget',
        'name' => 'core.hashtags-cloud',
        'page_id' => $page_id,
        'parent_content_id' => $main_right_id,
        'order' => $widgetOrder++,
        'params' => '{"title":"Trending Hashtags"}',
      ));
    }
    parent::onInstall();
  }
}
