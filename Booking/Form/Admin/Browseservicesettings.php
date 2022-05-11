<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Browseservicessettings.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Admin_Browseservicesettings extends Engine_Form {

  public function init() {
    
    $this->setTitle('SNS - Booking & Appointments Plugin - Browse Services')->setDescription('show all the services on browse service page');

    $this->addElement('MultiCheckbox', "show_criteria", array(
      'label' => "Choose from below the details that you want to show for Services in this widget.",
      'multiOptions' => array(
        'serviceimage' => 'Service Image',
        'providericon' => 'Provider Icon',
        'providername' => 'Provider name',
        'servicename' => 'Service Name',
        'price' => 'Service price',
        'minute' => 'Service duration',
        'like' => 'like Button',
        'favourite' => 'favourite Button',
        'likecount' => 'like counts',
        'favouritecount' => 'favourite counts',
        'viewbutton' => 'View button',
        'socialSharing' => 'Social Share Buttons <a class="smoothbox" href="admin/sesbasic/settings/faqwidget">[FAQ]</a>',
      ),
      'escape' => false,
    ));

    $this->addElement('Text', "limit_data", array(
      'label' => 'count (number of services to show).',
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

    $this->addElement('Radio', "paginationType", array(
      'label' => "Do you want the services to be auto-loaded when users scroll down the page?",
      'multiOptions' => array(
        '1' => 'Yes auto load',
        '0' => 'No, show \'View More\''
      ),
      'value' => 1,
    ));

    $this->addElement('Text', "title_truncation", array(
      'label' => 'Enter service truncation limit.',
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
