<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Bookservice.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_EditProfessional extends Booking_Form_Becomeprofessional
{
  public function init()
  {
    $this->addElement('Checkbox', 'available', array(
      'label' => 'Available',
      'tabindex' => 1,
    ));

    parent::init();
    $this->setTitle('Update My Settings')
      ->setDescription('Use this form below to register as a professional.');

    $this->submit->setLabel('Update Changes');
  }
}
