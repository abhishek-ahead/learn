<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Comment
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: manifest.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

return array (
  'package' =>
  array (
    'type' => 'module',
    'name' => 'comment',
    'version' => '7.0.0',
    'dependencies' => array(
      array(
        'type' => 'module',
        'name' => 'core',
        'minVersion' => '6.0.0',
      ),
    ),
    'path' => 'application/modules/Comment',
    'title' => 'Comments',
    'description' => 'Comments',
    'author' => 'Webligo Developments',
    'callback' => array(
			'path' => 'application/modules/Comment/settings/install.php',
			'class' => 'Comment_Installer',
    ),
    'actions' =>
    array (
      0 => 'install',
      1 => 'upgrade',
      2 => 'refresh',
      //3 => 'enable',
      //4 => 'disable',
    ),
    'directories' =>
    array (
      'application/modules/Comment',
    ),
    'files' =>
    array (
      'application/languages/en/comment.csv',
    ),
  ),
  //Load by default css / js file ---------------------------------------------------------------------
  'loadDefault' => array(
    "js" => array(
    ),
    'css' => array(
    )
  ),
  // Items ---------------------------------------------------------------------
  'items' => array(
    'comment_emotioncategory',
    'comment_emotiongallery',
    'comment_emotionfile', 
    'comment_reaction',
    'comment_voteupdown',
  ),
  'hooks' => array(
    array(
      'event' => 'onRenderLayoutDefault',
      'resource' => 'Comment_Plugin_Core',
    ),
    array(
      'event' => 'onRenderLayoutDefaultSimple',
      'resource' => 'Comment_Plugin_Core'
    ),
  ),
);
