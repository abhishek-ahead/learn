<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Body.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Activity_Model_Helper_Body extends Activity_Model_Helper_Abstract
{
  /**
   * Body helper
   * 
   * @param string $body
   * @return string
   */
  public function direct($body, $noTranslate = false,$separator = ' &rarr; ')
  {
    $explode = explode('|||||---|||++', $body);
    if(!empty($explode[0]))
      $body = $explode[0];
    if( Zend_Registry::isRegistered('Zend_View')) {
      $view = Zend_Registry::get('Zend_View');
      $body = $view->viewMoreActivity($body);
    }
    return 'BODYSTRING' . $body ;
  }
}
