<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Comment
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Zipupload.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */
class Comment_Form_Admin_Emotion_Zipupload extends Engine_Form {
  public function init() {
    $this->setTitle('Zip Upload')
            ->setDescription('');
     $id = Zend_Controller_Front::getInstance()->getRequest()->getParam('id', 0);
      
      $re = true;
      $all = false;  
    
    $this->addElement('File', 'file', array(
        'allowEmpty' => $all,
        'required' => $re,
        'label' => 'Zip File',
        'description' => 'Upload a zip [Note: extension: "zip"] only.]',
    ));
    $this->file->addValidator('Extension', false, 'zip');
    
    $this->addElement('Button', 'submit', array(
      'label' => 'Save Changes',
      'type' => 'submit',
      'ignore' => true,
      'decorators' => array('ViewHelper')
    ));
    $this->addElement('Cancel', 'cancel', array(
        'label' => 'Cancel',
        'link' => true,
        'prependText' => ' or ',
        'onclick' => 'javascript:parent.Smoothbox.close()',
        'decorators' => array(
            'ViewHelper',
        ),
    ));
    $this->addDisplayGroup(array('submit', 'cancel'), 'buttons');
  }
}
