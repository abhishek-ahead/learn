<?php
/**
 * SocialEngine
 *
 * @category   Application_Extensions
 * @package    Elpis
 * @copyright  Copyright 2006-2022 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: manifest.php 2022-06-21
 */

return array (
  'package' =>
  array(
    'type' => 'module',
    'name' => 'elpis',
    'version' => '6.7.0',
    'dependencies' => array(
      array(
        'type' => 'module',
        'name' => 'core',
        'minVersion' => '5.0.0',
      ),
    ),
    'path' => 'application/modules/Elpis',
    'title' => 'Elpis Theme',
    'description' => 'Responsive, modern theme with features to delight you and your members!',
    'author' => '<a href="https://socialengine.com/" style="text-decoration:underline;" target="_blank">SocialEngine</a>',
    'thumb' => 'application/modules/Core/externals/images/thumb.png',
    'callback' => array(
        'path' => 'application/modules/Elpis/settings/install.php',
        'class' => 'Elpis_Installer',
    ),
    'actions' =>
    array(
        0 => 'install',
        1 => 'upgrade',
        2 => 'refresh',
        3 => 'enable',
        4 => 'disable',
    ),
    'directories' =>
    array(
      'application/modules/Elpis',
      'application/themes/elpis',
    ),
    'files' =>
    array(
      'application/languages/en/elpis.csv',
    ),
  ),
  'items' => array(
    'elpis_customthemes',
  ),
	// Hooks ---------------------------------------------------------------------
	'hooks' => array(
		array(
			'event' => 'onRenderLayoutDefault',
			'resource' => 'Elpis_Plugin_Core'
		),
		array(
			'event' => 'onRenderLayoutDefaultSimple',
			'resource' => 'Elpis_Plugin_Core'
		),
	),
);
