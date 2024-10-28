<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Comment
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: Gallerycreate.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */
class Comment_Form_Admin_Emotion_Gallerycreate extends Engine_Form {
  public function init() {
    $this->setTitle('Create New Pack')
            ->setDescription('');
     $id = Zend_Controller_Front::getInstance()->getRequest()->getParam('id', 0);
      
      $this->addElement('Text', 'title', array(
        'label' => 'Pack Title',
        'required'=>true,
        'allowEmpty'=>false,
        'description' => '',
      ));     
      $this->addElement('Textarea', 'description', array(
        'label' => 'Pack Description',
        'required'=>false,
        'allowEmpty'=>true,
        'description' => '',
      ));     
     $catgeories = Engine_Api::_()->getDbTable('emotioncategories','comment')->getCategories(array('fetchAll'=>true));
     $arrayCat = array();
     foreach($catgeories as $category)
      $arrayCat[$category->getIdentity()] = $category->getTitle();
   if(engine_count($arrayCat)){
     $this->addElement('Select', 'category_id', array(
      'label' => 'Category Id',
      'description' => '',
      'multiOptions'=>$arrayCat,
      'required'=>false,
      'allowEmpty'=>true,
      'value' => '',
    ));     
   }
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
        'accept'=>"image/*",
        'label' => 'Pack Photo',
        'description' => 'Upload a photo [Note: photos with extension: "jpg, png, jpeg and gif" only.]',
    ));
    $this->file->addValidator('Extension', false, 'jpg,png,jpeg,gif,GIF,PNG,JPG,JPEG');
    
    $this->addElement('Button', 'submit', array(
      'label' => 'Create Pack',
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
