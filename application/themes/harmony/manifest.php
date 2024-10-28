<?php
/**
 * SocialEngine
 *
 * @category   Application_Theme
 * @package    harmony
 * @copyright  Copyright 2006-2024 Ahead WebSoft Technologies
 * @license    https://socialengine.com/eula
 * @version    $Id: manifest.php 2024-03-11 00:00:00Z 
 * @author     SocialEngine
 */

/**
 * @category   Application_Theme
 * @package    harmony
 * @copyright  Copyright 2006-2024 Ahead WebSoft Technologies
 * @license    https://socialengine.com/eula
 */

 return array (
  'package' =>
  array (
    'type' => 'theme',
    'name' => 'harmony',
    'version' => '7.0.0',
    'revision' => '$Revision: 10113 $',
    'path' => 'application/themes/harmony',
    'repository' => 'socialengine.com',
    'title' => 'Harmony',
    'thumb' => 'theme.jpg',
    'author' => 'SocialEngine Core',
    'actions' =>
    array (
      0 => 'install',
      1 => 'upgrade',
      2 => 'refresh',
    ),
    'callback' =>
    array (
      'class' => 'Engine_Package_Installer_Theme',
    ),
    'directories' =>
    array (
      0 => 'application/themes/harmony',
    ),
    'description' => 'Harmony',
  ),
  'files' =>
  array (
    0 => 'main.css',
    1 => 'variables.css',
    3 => 'harmony-custom.css',
  ),
);
