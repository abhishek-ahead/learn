<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: AdminDurationController.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_AdminDurationsController extends Core_Controller_Action_Admin {

  public function indexAction() {
      $this->view->navigation = $navigation = Engine_Api::_()->getApi('menus', 'core')->getNavigation('booking_admin_main', array(), 'booking_admin_main_durations');
      //$this->view->form = $form = new Booking_Form_Admin_Settings_Services();
      $table = Engine_Api::_()->getDbTable('durations', 'booking');
      $this->view->paginator = $paginator = $table->fetchAll();
  }
  public function addDurationAction(){
  	$this->_helper->layout->setLayout('admin-simple');
      $this->view->form = $form = new Booking_Form_Admin_Duration_Add();
      if ($this->getRequest()->isPost() && $form->isValid($this->_getAllParams())) {
            $values = $form->getValues();
            $db = Engine_Api::_()->getDbTable('durations', 'booking')->getAdapter();
            $db->beginTransaction();
            try {
               $settingsTable = Engine_Api::_()->getDbTable('durations', 'booking');
                $duration = $settingsTable->createRow();
                $duration->setFromArray($values);
                $duration->save();
                $db->commit();
                return $this->_forward('success', 'utility', 'core', array(
                    'smoothboxClose' => true,
                    'parentRefresh' => true,
                    'format'=> 'smoothbox',
                    'messages' => array('Durations saved successfully.')
                  ));
            }catch(Exception $e){
                $db->rollBack();
                throw $e;
            }
        }
    }

    public function changeAction(){
        $this->_helper->layout->setLayout('admin-simple');
        $enable = $this->_getParam('enable');
        $disable = $this->_getParam('disable');
        if ($this->getRequest()->isPost()) {
          if($enable){
              $duration =Engine_Api::_()->getItem('booking_durations',$enable);
              $duration->active = 1;
            }
          if($disable){
              $duration =Engine_Api::_()->getItem('booking_durations',$disable);
              $duration->active = 0;
            }
          $duration->save();
          return $this->_forward('success', 'utility', 'core', array(
            'smoothboxClose' => 10,
            'parentRefresh' => 10,
            'messages' => array('You have successfully delete client.')
          ));
        }
    }
}