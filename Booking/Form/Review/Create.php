<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Create.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Review_Create extends Engine_Form {

  protected $_defaultProfileId;

  public function getDefaultProfileId() {
    return $this->_defaultProfileId;
  }

  public function setDefaultProfileId($default_profile_id) {
    $this->_defaultProfileId = $default_profile_id;
    return $this;
  }

  public function init() {

    $this->setAttrib('id', 'booking_review_form');
    $type = Zend_Controller_Front::getInstance()->getRequest()->getParam('type');
    $this->setTitle('Write a review');

    $this->addElement('Dummy', 'review_star', array(
        'label' => 'Review',
        'decorators' => array(array('ViewScript', array(
                    'viewScript' => '/application/modules/Booking/views/scripts/review-rating.tpl',
                    'class' => 'form element')))
    ));

    $this->addElement('Hidden', 'rate_value', array('order' => 878));

    if (Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.review.title', 1)) {
      $this->addElement('Text', 'title', array(
          'label' => 'Review Title',
          'allowEmpty' => false,
          'required' => true,
          'maxlength' => "255",
      ));
    }
    if (Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.show.pros', 1)) {
      $this->addElement('Text', 'pros', array(
          'label' => 'Pros',
          'allowEmpty' => false,
          'required' => true,
          'maxlength' => "255",
      ));
    }
    if (Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.show.cons', 1)) {
      $this->addElement('Text', 'cons', array(
          'label' => 'Cons',
          'allowEmpty' => false,
          'required' => true,
          'maxlength' => "255",
      ));
    }
    if (Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.review.summary', 1)) {
      if (Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.show.tinymce', 1)) {
        $user = Engine_Api::_()->user()->getViewer();
        $user_level = Engine_Api::_()->user()->getViewer();
        $allowed_html = '';
        $allowed_html = Engine_Api::_()->authorization()->getPermission($user_level, 'booking', 'auth_html');
        $editorOptions = array(
            'html' => (bool) $allowed_html,
        );
        $this->addElement('TinyMce', 'description', array(
            'label' => 'Description',
            'required' => true,
            'allowEmpty' => false,
            'editorOptions' => $editorOptions,
        ));
      } else {
        $this->addElement('Textarea', 'description', array(
            'label' => 'Description',
            'allowEmpty' => false,
            'required' => true,
            'maxlength' => "300",
        ));
      }
    }
    if (Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.show.recommended', 1)) {
      $this->addElement('Radio', 'recommended', array(
          'label' => 'Recommended',
          'description' => 'Do you recommended this review to user?',
          'multiOptions' => array(
              1 => 'Yes',
              0 => 'No'
          ),
          'value' => 1,
      ));
    }
    //Buttons
    $this->addElement('Button', 'submit', array(
        'label' => 'Submit',
        'type' => 'submit',
        'ignore' => true,
        'decorators' => array(
            'ViewHelper',
        ),
    ));

    $this->addDisplayGroup(array('submit'), 'buttons', array(
        'decorators' => array(
            'FormElements',
            'DivDivDivWrapper',
        ),
    ));
  }

}
