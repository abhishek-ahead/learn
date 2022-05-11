<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Professionalsearchform.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Professionalsearchform extends Engine_Form
{

  protected $_professionalName;
  protected $_serviceName;
  protected $_ratingActive;
  protected $_availabilityActive;
  protected $_locationActive;
  protected $_categoryActive;


  public function setprofessionalNameActive($professionalNameActive)
  {
    $this->_professionalName = $professionalNameActive;
  }

  public function setserviceNameActive($serviceNameActive)
  {
    $this->_serviceName = $serviceNameActive;
  }

  public function setratingActive($ratingActive)
  {
    $this->_ratingActive = $ratingActive;
  }

  public function setavailabilityActive($availabilityActive)
  {
    $this->_availabilityActive = $availabilityActive;
  }

  public function setlocationActive($locationActive)
  {
    $this->_locationActive = $locationActive;
  }

  public function setcategoryActive($categoryActive)
  {
    $this->_categoryActive = $categoryActive;
  }

  public function init()
  {
    $this->setAttrib('id', 'booking_form_professionalsearch');
    if ($this->_professionalName)
      $this->addElement('Text', 'professional_name', array(
        'label' => 'Professional Name',
      ));

    if ($this->_serviceName)
      $this->addElement('Text', 'service_name', array(
        'label' => 'Service Name',
      ));

    if ($this->_categoryActive){
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

    if ($this->_ratingActive)
      $this->addElement('Select', 'rating', array(
        'label' => 'Ratings',
        'multiOptions' => array('' => '', '5' => 'High to Low', '1' => 'Low to high'),
      ));

    if ($this->_availabilityActive)
      $this->addElement('Text', 'availability', array(
        'label' => 'Availability',
        'id' => 'professional_start_date',
        'autocomplete' => 'off',
      ));

    $settingsLocation = Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.location.isrequired');
    if ($settingsLocation) {
      if ($this->_locationActive)
        $this->addElement('Text', 'location', array(
          'label' => 'Location:',
          'id' => 'locationSesList',
          'filters' => array(
            new Engine_Filter_Censor(),
            new Engine_Filter_HtmlSpecialChars(),
          ),
        ));
    }
    $this->addElement('Hidden', 'lat', array(
      'id' => 'latSesList',
      'order' => 20
    ));

    $this->addElement('Hidden', 'lng', array(
      'id' => 'lngSesList',
      'order' => 21
    ));

    $this->addElement('Button', 'search_professional', array(
      'label' => 'Search professionals',
      'type' => 'button',
      'ignore' => true,
    ));
  }
}
