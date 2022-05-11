<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Browserprofessionalsettings.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Admin_Browseprofessionalsettings extends Engine_Form {

  public function init() {
    $this->setTitle('SNS - Booking & Appointments Plugin - Browse Professionals')->setDescription('Display all professionals on your website. The recommended page for this widget is "SNS - Booking & Appointments plugin- Browse Professionals Page".');

    $this->addElement('MultiCheckbox', "show_criteria", array(
      'label' => "Choose from below the details that you want to show for this in this widget.",
      'multiOptions' => array(
        'name' => 'Professional name',
        'image' => 'Professional image',
        'designation' => 'Provider designation',
        'location' => 'Provider location',
        'description' => 'Professional description',
        'rating' => 'Rating',
        'like' => 'Like Button',
        'favourite' => 'Favourite Button',
        'follow' => 'Follow Button',
        'likecount' => 'Like counts',
        'favouritecount' => 'Favourite counts',
        'followcount' => 'Follow counts',
        'bookbutton' => 'Professional Book button',
        'viewprofile' => 'View profile button',
        'socialSharing' => 'Social Share Buttons <a class="smoothbox" href="admin/sesbasic/settings/faqwidget">[FAQ]</a>',
      ),
      'escape' => false,
    ));

    //Social Share Plugin work

    $this->addElement('Text', "limit_data", array(
      'label' => 'count (number of Professional to show).',
      'value' => 20,
      'validators' => array(
        array('Int', true),
        array('GreaterThan', true, array(0)),
      )
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

    $this->addElement('Radio', "pagging", array(
      'label' => "Do you want the Professional to be auto-loaded when users scroll down the page?",
      'multiOptions' => array(
        'auto_load' => 'Yes, Auto Load.',
        'button' => 'No, show \'View more\' link.',
        'pagging' => 'No, show \'Pagination\'.'
      ),
      'value' => 'auto_load',
    ));
    $this->addElement('Text', "title_truncation", array(
      'label' => 'Enter Professional description truncation limit.',
      'value' => 45,
      'validators' => array(
        array('Int', true),
        array('GreaterThan', true, array(0)),
      )
    ));

    $this->addElement('Text', "height", array(
      'label' => 'Enter the height of one photo block for \'Grid View\' (in pixels).',
      'value' => '160',
      'validators' => array(
        array('Int', true),
        array('GreaterThan', true, array(0)),
      )
    ));
    $this->addElement('Text', "width", array(
      'label' => 'Enter the width of one photo block for \'Grid View\' (in pixels).',
      'value' => '140',
      'validators' => array(
        array('Int', true),
        array('GreaterThan', true, array(0)),
      )
    ));
  }

}
