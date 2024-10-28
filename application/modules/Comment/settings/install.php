<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Comment
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: install.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */
class Comment_Installer extends Engine_Package_Installer_Module {

  public function onInstall() {
    $db = $this->getDb();
    parent::onInstall();
  }
}
