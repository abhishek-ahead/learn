<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: ProfessionalCreate.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Review_ProfessionalCreate extends Engine_Form {

  protected $_defaultProfileId;

  public function getDefaultProfileId() {
    return $this->_defaultProfileId;
  }

  public function setDefaultProfileId($default_profile_id) {
    $this->_defaultProfileId = $default_profile_id;
    return $this;
  }

  public function init() {
    $this->setAttrib('class', 'expert_review_form');

    $this->setAttrib('id', 'booking_review_form');
    $type = Zend_Controller_Front::getInstance()->getRequest()->getParam('type');

    $this->addElement('Dummy', 'review_star', array(
        'label' => 'Review',
        'decorators' => array(array('ViewScript', array(
        'viewScript' => '/application/modules/Booking/views/scripts/professional-rating.tpl',
        'class' => 'form element')))
    ));

    $this->addElement('Hidden', 'rate_value', array('order' => 878));
  }

}
