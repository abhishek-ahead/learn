<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Buysells.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */


class Activity_Model_DbTable_Buysells extends Engine_Db_Table {

  protected $_rowClass = 'Activity_Model_Buysell';
  
  public function getSellSelect($params = array()) {
  
      $viewer = Engine_Api::_()->user()->getViewer();
      $viewerId = $viewer->getIdentity();

      $rName = $this->info('name');
      
      $actionsTable = Engine_Api::_()->getDbtable('actions', 'activity');
      $actionsTableName = $actionsTable->info('name');

      $select = $this->select()
                  ->setIntegrityCheck(false)
                  ->join($actionsTableName, $actionsTableName . '.action_id = ' . $rName . '.action_id',null)
                  ->order($rName.'.buysell_id DESC')
                  ->group($rName.'.buysell_id');
      return $select;
  }

  public function getSellPaginator($params = array()) {
  
    $paginator = Zend_Paginator::factory($this->getSellSelect($params));
    if(!empty($params['page'])) {
      $paginator->setCurrentPageNumber($params['page']);
    }
    
    if( !empty($params['limit'])) {
      $paginator->setItemCountPerPage($params['limit']);
    }

    if(empty($params['limit'])) {
      $paginator->setItemCountPerPage(10);
    }
    
    return $paginator;
  }
}
