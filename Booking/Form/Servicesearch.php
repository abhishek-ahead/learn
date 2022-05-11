<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Servicesearch.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Servicesearch extends Engine_Form
{

  protected $_professionalName;
  protected $_serviceName;
  protected $_priceActive;
  protected $_categoryActive;

  public function setprofessionalNameActive($professionalNameActive)
  {
    $this->_professionalName = $professionalNameActive;
  }

  public function setserviceNameActive($serviceNameActive)
  {
    $this->_serviceName = $serviceNameActive;
  }

  public function setpriceActive($priceActive)
  {
    $this->_priceActive = $priceActive;
  }

  public function setcategoryActive($categoryActive)
  {
    $this->_categoryActive = $categoryActive;
  }

  public function init()
  {
    if ($this->_serviceName)
      $this->addElement('Text', 'servicename', array(
        'label' => 'Service Name'
      ));

    $this->setAttrib('id', 'booking_form_servicesearch');

    if ($this->_categoryActive) {
      $categories = Engine_Api::_()->getDbtable('categories', 'booking')->getCategoriesAssoc();
      if (!empty($categories)) {
        if (count($categories) > 0) {
          $categorieEnable = 1;
          if ($categorieEnable == 1) {
            $required = true;
            $allowEmpty = false;
          } else {
            $required = false;
            $allowEmpty = true;
          }
        }
        $categories = array('' => 'Choose Category') + $categories;
        $this->addElement('Select', 'category_id', array(
          'label' => 'Category',
          'multiOptions' => $categories,
          'allowEmpty' => $allowEmpty,
          'onchange' => "showSubCategory(this.value);",
        ));
        //Add Element: 2nd-level Category
        $this->addElement('Select', 'subcat_id', array(
          'label' => "2nd-level Category",
          'allowEmpty' => true,
          'required' => false,
          'multiOptions' => array('0' => ''),
          'registerInArrayValidator' => false,
          'onchange' => "showSubSubCategory(this.value);"
        ));
        //Add Element: Sub Sub Category
        $this->addElement('Select', 'subsubcat_id', array(
          'label' => "3rd-level Category",
          'allowEmpty' => true,
          'registerInArrayValidator' => false,
          'required' => false,
          'multiOptions' => array('0' => ''),
        ));
      }
    }

    if ($this->_professionalName)
      $this->addElement('Text', 'professional', array(
        'label' => 'Professional Name',
        'autocomplete' => "off",
        'id' => 'professional',
      ));

    if ($this->_priceActive)
      $this->addElement('Text', 'prince', array(
        'label' => 'Price'
      ));

    $this->addElement('Button', 'submit', array(
      'label' => 'Show services',
      'id' => 'showservices',
      'type' => 'button',
      'ignore' => true,
    ));
  }
}
