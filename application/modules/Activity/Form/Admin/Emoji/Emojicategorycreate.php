<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Activity
 * @package    Activity
 * @copyright  Copyright 2017-2018 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Emojicategorycreate.php  2017-11-14 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */

class Activity_Form_Admin_Emoji_Emojicategorycreate extends Engine_Form {

  public function init() {
  
    $this->setTitle('Create New Emoji Category')
            ->setDescription('');
            
    $id = Zend_Controller_Front::getInstance()->getRequest()->getParam('id', 0);
      
    $this->addElement('Text', 'title', array(
      'label' => 'Title',
      'required'=>true,
      'allowEmpty'=>false,
      'description' => '',
    ));     

    if(!$id){
      $re = true;
      $all = false;  
    }else{
      $re = false;
      $all = true;
    }
    $this->addElement('File', 'file', array(
        'allowEmpty' => $all,
        'required' => $re,
        'label' => 'Photo',
        'accept'=>"image/*",
        'description' => 'Upload a photo [Note: photos with extension: "jpg, png, jpeg and gif" only.]',
    ));
    $this->file->addValidator('Extension', false, 'jpg,png,jpeg,gif,GIF,PNG,JPG,JPEG');
    
    $this->addElement('Button', 'submit', array(
      'label' => 'Create',
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