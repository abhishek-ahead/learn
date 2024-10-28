<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: LinkComposer.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Activity_Plugin_LinkComposer extends Core_Plugin_Abstract
{
  public function onAttachActivitylink($data)
  {
    try {
      $viewer = Engine_Api::_()->user()->getViewer();
      if( Engine_Api::_()->core()->hasSubject() ) {
        $subject = Engine_Api::_()->core()->getSubject();
        if( $subject->getType() != 'user' ) {
          $data['parent_type'] = $subject->getType();
          $data['parent_id'] = $subject->getIdentity();
        }
      }

      // Filter HTML
      $filter = new Zend_Filter();
      $filter->addFilter(new Engine_Filter_Censor());
      $filter->addFilter(new Engine_Filter_HtmlSpecialChars());
      if( !empty($data['title']) ) {
        $data['title'] = $filter->filter($data['title']);
      }
      if( !empty($data['description']) ) {
        $data['description'] = $filter->filter(preg_replace('/ +/', ' ',html_entity_decode(strip_tags($data['description']))));
      }
      $iframelyConfig = Engine_Api::_()->getApi('settings', 'core')->core_iframely;
      if( !empty($iframelyConfig['host']) && $iframelyConfig['host'] != 'socialengine' ) {
        $response = Engine_Iframely::factory($iframelyConfig)->get($data['uri']);
				$data['params']['iframely'] = $response ? json_encode($response) : array();
      }
      $link = Engine_Api::_()->getApi('links', 'core')->createLink($viewer, $data);
    } catch( Exception $e ) {
      throw $e;
      return;
    }
    return $link;
  }
}
