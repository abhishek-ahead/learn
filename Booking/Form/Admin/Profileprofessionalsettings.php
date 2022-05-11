<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Profileprofessionalsettings.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Admin_Profileprofessionalsettings extends Engine_Form {

  public function init() {
    
    $this->setTitle('SNS - Booking & Appointments Plugin - Expert Profile')->setDescription('This widget shows all the information of professional');

    $this->addElement('MultiCheckbox', "show_criteria", array(
      'label' => "Choose from below the details that you want to show for professionals in this widget.",
      'multiOptions' => array(
        'image' => 'image',
        'name' => 'name',
        'designation' => 'designation',
        'location' => 'location',
        'rating' => 'rating',
        'about' => 'about',
        'contact' => 'contact button',
        'like' => 'like Button',
        'favourite' => 'favourite Button',
        'follow' => 'follow Button',
        'report' => 'report',
        'likecount' => 'like counts',
        'favouritecount' => 'favourite counts',
        'followcount' => 'follow counts',
        'bookme' => 'book me button',
        'socialSharing' => 'Social Share Buttons <a class="smoothbox" href="admin/sesbasic/settings/faqwidget">[FAQ]</a>'
      ),
      'escape' => false,
    ));

    $this->addElement('Select', "socialshare_enable_plusicon", array(
      'label' => "Enable More Icon for social share buttons?",
      'multiOptions' => array(
        '1' => 'Yes',
        '0' => 'No',
      ),
      'value' => 1,
    ));

    $this->addElement('Text', "socialshare_icon_limit", array(
      'label' => 'Count (number of social sites to show). If you enable More Icon, then other social sharing icons will display on clicking this plus icon.',
      'value' => 2,
      'validators' => array(
        array('Int', true),
        array('GreaterThan', true, array(0)),
      )
    ));
  }

}
