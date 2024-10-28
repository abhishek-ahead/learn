<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Url.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Activity_Model_Helper_Url extends Activity_Model_Helper_Abstract
{
  /**
   * Generates a url for action
   * 
   * @param mixed $params
   * @param string $innerHTML
   * @return string
   */
  public function direct($params, $innerHTML,$separator = ' &rarr; ')
  {
    // Passed an absolute url
    if( is_string($params) )
    {
      $uri = $params;
    }
    
    else if( is_array($params) && isset($params['uri']) )
    {
      $uri = $params['uri'];
    }

    // Passed a route array
    else if( is_array($params) )
    {
      $route = ( isset($params['route']) ? $params['route'] : 'default' );
      unset($params['route']);
      $uri = Zend_Controller_Front::getInstance()->getRouter()->assemble($params, $route, true);
    }

    // Whoops, just return the innerHTML
    else
    {
      return $innerHTML;
    }

    return '<a href="'.$uri.'">'.$innerHTML.'</a>';
  }
}
