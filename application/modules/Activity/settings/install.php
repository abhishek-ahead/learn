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

    // Activity Attachment View Page
    $pageId = $db->select()
      ->from('engine4_core_pages', 'page_id')
      ->where('name = ?', 'activity_index_attachmentview')
      ->limit(1)
      ->query()
      ->fetchColumn();
    // insert if it doesn't exist yet
    if( !$pageId ) {
      // Insert page
      $db->insert('engine4_core_pages', array(
        'name' => 'activity_index_attachmentview',
        'displayname' => 'Activity Attachment View',
        'title' => 'Activity Attachment View',
        'description' => 'This page lists photos/videos post from the status box.',
        'custom' => 0,
      ));
      $pageId = $db->lastInsertId();

      // Insert top
      $db->insert('engine4_core_content', array(
        'type' => 'container',
        'name' => 'top',
        'page_id' => $pageId,
        'order' => 1,
      ));
      $topId = $db->lastInsertId();

      // Insert main
      $db->insert('engine4_core_content', array(
        'type' => 'container',
        'name' => 'main',
        'page_id' => $pageId,
        'order' => 2,
      ));
      $mainId = $db->lastInsertId();


      // Insert main-middle
      $db->insert('engine4_core_content', array(
        'type' => 'container',
        'name' => 'middle',
        'page_id' => $pageId,
        'parent_content_id' => $mainId,
        'order' => 2,
      ));
      $mainMiddleId = $db->lastInsertId();

      // Insert main-right
      $db->insert('engine4_core_content', array(
        'type' => 'container',
        'name' => 'right',
        'page_id' => $pageId,
        'parent_content_id' => $mainId,
        'order' => 1,
      ));
      $mainRightId = $db->lastInsertId();

      // Insert content
      $db->insert('engine4_core_content', array(
        'type' => 'widget',
        'name' => 'core.content',
        'page_id' => $pageId,
        'parent_content_id' => $mainMiddleId,
        'order' => 1,
      ));

      // Insert search
      $db->insert('engine4_core_content', array(
        'type' => 'widget',
        'name' => 'activity.photo-video-info',
        'page_id' => $pageId,
        'parent_content_id' => $mainRightId,
        'order' => 1,
      ));

      $db->insert('engine4_core_content', array(
        'type' => 'widget',
        'name' => 'core.comments',
        'page_id' => $pageId,
        'parent_content_id' => $mainRightId,
        'order' => 2,
      ));
    }
    
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
    
    
    //Memories On This Day Page
    $page_id = $db->select()
      ->from('engine4_core_pages', 'page_id')
      ->where('name = ?', 'activity_index_onthisday')
      ->limit(1)
      ->query()
      ->fetchColumn();

    // insert if it doesn't exist yet
    if( !$page_id ) {
      // Insert page
      $db->insert('engine4_core_pages', array(
        'name' => 'activity_index_onthisday',
        'displayname' => 'Memories On This Day Page',
        'title' => 'Memories On This Day',
        'description' => 'This page show memories and feeds on this day.',
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

      // Insert top-middle
      $db->insert('engine4_core_content', array(
        'type' => 'container',
        'name' => 'middle',
        'page_id' => $page_id,
        'parent_content_id' => $top_id,
      ));
      $top_middle_id = $db->lastInsertId();

      // Insert main-middle
      $db->insert('engine4_core_content', array(
        'type' => 'container',
        'name' => 'middle',
        'page_id' => $page_id,
        'parent_content_id' => $main_id,
        'order' => 2,
      ));
      $main_middle_id = $db->lastInsertId();

      // Insert main-left
      $db->insert('engine4_core_content', array(
        'type' => 'container',
        'name' => 'left',
        'page_id' => $page_id,
        'parent_content_id' => $main_id,
        'order' => 1,
      ));
      $main_left_id = $db->lastInsertId();
      // Insert content
      $db->insert('engine4_core_content', array(
        'type' => 'widget',
        'name' => 'activity.onthisday-banner',
        'page_id' => $page_id,
        'parent_content_id' => $main_middle_id,
        'order' => 1,
      ));
      // Insert content
      $db->insert('engine4_core_content', array(
        'type' => 'widget',
        'name' => 'activity.feed',
        'page_id' => $page_id,
        'parent_content_id' => $main_middle_id,
        'order' => 2,
      ));
      // insert left content
      $db->insert('engine4_core_content', array(
        'type' => 'widget',
        'name' => 'user.home-links',
        'page_id' => $page_id,
        'parent_content_id' => $main_left_id,
        'order' => 1,
      ));
      $db->insert('engine4_core_content', array(
        'type' => 'widget',
        'name' => 'core.statistics',
        'page_id' => $page_id,
        'parent_content_id' => $main_left_id,
        'order' => 2,
      ));
    }
    
    //Sell Something Page
    $page_id = $db->select()
      ->from('engine4_core_pages', 'page_id')
      ->where('name = ?', 'activity_index_sell')
      ->limit(1)
      ->query()
      ->fetchColumn();

    // insert if it doesn't exist yet
    if( !$page_id ) {
      // Insert page
      $db->insert('engine4_core_pages', array(
        'name' => 'activity_index_sell',
        'displayname' => 'Sell Something Page',
        'title' => 'Sell Something Day',
        'description' => 'This page show sell something feed.',
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

      // Insert main-middle
      $db->insert('engine4_core_content', array(
        'type' => 'container',
        'name' => 'middle',
        'page_id' => $page_id,
        'parent_content_id' => $main_id,
        'order' => 2,
      ));
      $main_middle_id = $db->lastInsertId();

      // Insert content
      $db->insert('engine4_core_content', array(
        'type' => 'widget',
        'name' => 'activity.sell-something',
        'page_id' => $page_id,
        'parent_content_id' => $main_middle_id,
        'order' => 1,
      ));
    }
    
    parent::onInstall();
  }
}
