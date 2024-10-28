<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Translate.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Activity_Model_Helper_Translate extends Activity_Model_Helper_Abstract {
  /**
   *
   * @param string $value
   * @return string
   */
  public function direct($value, $noTranslate = false,$separator = ' &rarr; ')
  {
    $translate = Zend_Registry::get('Zend_Translate');
    if( !$noTranslate && $translate instanceof Zend_Translate ) {
      $tmp = $translate->translate($value);
      return $tmp;
    } else {
      return $value;
    }
  }
}
