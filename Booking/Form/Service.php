<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Service.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Service extends Engine_Form {

  protected $_itemData = "";

  function getItemData() {
    return $this->_itemData;
  }

  function setItemData($itemData) { 
    echo $itemData;
    $this->_itemData = $itemData;
  }

  public function init() {
    $service_id = Zend_Controller_Front::getInstance()->getRequest()->getParam('service_id', 0);
    if ($service_id)
      $service = Engine_Api::_()->getItem('booking_service', $service_id);
    $settings = Engine_Api::_()->getApi('settings', 'core');
    $this->setTitle('Create New Service');
    $this->setAttrib('id', 'booking_service_create_form');

    $this->addElement('Text', 'name', array(
        'label' => 'Service Name',
        'required' => true
    ));

    $this->addElement('Textarea', 'description', array(
        'label' => 'Description',
        'required' => true
    ));
    $symbol = Engine_Api::_()->booking()->getCurrentCurrency();
    $this->addElement('Text', 'price', array(
        'label' => 'Price (' . $symbol . ')',
        'required' => true
    ));

    $categories = Engine_Api::_()->getDbtable('categories', 'booking')->getCategoriesAssoc();
    if (count($categories) > 0) {
      $categorieEnable = $settings->getSetting('booking.category.enable', '1');
      if ($categorieEnable == 1) {
        $required = true;
        $allowEmpty = false;
      } else {
        $required = false;
        $allowEmpty = true;
      }
      $categories = array('' => 'Choose Category') + $categories;
      $this->addElement('Select', 'category_id', array(
          'label' => 'Category',
          'multiOptions' => $categories,
          'allowEmpty' => $allowEmpty,
          'required' => $required,
          'onchange' => "showSubCategory(this.value);showFields(this.value,1,this.class,this.class,'resets');",
      ));
      //Add Element: 2nd-level Category
      $this->addElement('Select', 'subcat_id', array(
          'label' => "2nd-level Category",
          'allowEmpty' => true,
          'required' => false,
          'multiOptions' => array('0' => ''),
          'registerInArrayValidator' => false,
          'onchange' => "showSubSubCategory(this.value);showFields(this.value,1,this.class,this.class,'resets');"
      ));
      //Add Element: Sub Sub Category
      $this->addElement('Select', 'subsubcat_id', array(
          'label' => "3rd-level Category",
          'allowEmpty' => true,
          'registerInArrayValidator' => false,
          'required' => false,
          'multiOptions' => array('0' => ''),
          'onchange' => 'showFields(this.value,1);showFields(this.value,1,this.class,this.class,"resets");'
      ));
    }

    $this->addElement('Text', 'duration', array(
        'label' => 'Time Duration',
        'required' => true,
        'validators' => array(
          array('Int', true),
        ),
    ));

    $this->addElement('Select', 'timelimit', array(
        'label' => 'Duration',
        'multiOptions' => array("h" => "Hour", "m" => "Minutes"),
    ));

    $this->addElement('File', 'file_id', array(
        'label' => 'Photo',
        'description' => 'Upload a photo',
    ));
    $this->file_id->addValidator('Extension', false, 'jpg,png,gif,jpeg');

    if (!empty($service_id)) {
      $this->addElement('Dummy', 'background_image_name', array(
          'content' => '<img style="height:100px;width:100px" src="' . Engine_Api::_()->storage()->get($service->file_id, '')->getPhotoUrl('thumb.profile') . '">',
      ));
    }

    $this->addElement('Button', 'submit', array(
        'label' => 'Save Changes',
        'type' => 'submit',
        'ignore' => true,
        'decorators' => array(
            'ViewHelper',
        ),
    ));

    $this->addElement('Cancel', 'cancel', array(
        'label' => 'cancel',
        'link' => true,
        'href' => '',
        'prependText' => ' or ',
        'onclick' => 'parent.Smoothbox.close();',
        'decorators' => array(
            'ViewHelper'
        )
    ));

    $this->addDisplayGroup(array('submit', 'cancel'), 'buttons', array(
        'decorators' => array(
            'FormElements',
            'DivDivDivWrapper',
        ),
    ));
  }

}
