<?php

/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    User
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @author     John
 */

/**
 * @category   Application_Core
 * @package    User
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 */

class User_Form_Admin_Manage_ImportUser extends Engine_Form {

  public function init() {

    $settings = Engine_Api::_()->getApi('settings', 'core');

    $this->setTitle('Bulk Import Members Using CSV File');
	
	 $this->setDescription('Below settings will apply to all the members imported via uploaded csv file.');

    $this->addElement('File', 'csvfile', array(
        'label' => 'Choose the .csv file to upload members in bulk on your site',
        'allowEmpty' => false,
        'required' => true,
    ));
    $this->csvfile->addValidator('Extension', false, 'csv');

    $this->addElement('Select', 'timezone', array(
      'label' => 'Timezone',
      'value' => $settings->getSetting('core.locale.timezone'),
      'multiOptions' => array(
        'US/Pacific' => '(UTC-8) Pacific Time (US & Canada)',
        'US/Mountain' => '(UTC-7) Mountain Time (US & Canada)',
        'US/Central' => '(UTC-6) Central Time (US & Canada)',
        'US/Eastern' => '(UTC-5) Eastern Time (US & Canada)',
        'America/Halifax' => '(UTC-4)  Atlantic Time (Canada)',
        'America/Anchorage' => '(UTC-9)  Alaska (US & Canada)',
        'Pacific/Honolulu' => '(UTC-10) Hawaii (US)',
        'Pacific/Samoa' => '(UTC-11) Midway Island, Samoa',
        'Etc/GMT-12' => '(UTC-12) Eniwetok, Kwajalein',
        'Canada/Newfoundland' => '(UTC-3:30) Canada/Newfoundland',
        'America/Buenos_Aires' => '(UTC-3) Brasilia, Buenos Aires, Georgetown',
        'Atlantic/South_Georgia' => '(UTC-2) Mid-Atlantic',
        'Atlantic/Azores' => '(UTC-1) Azores, Cape Verde Is.',
        'Europe/London' => 'Greenwich Mean Time (Lisbon, London)',
        'Europe/Berlin' => '(UTC+1) Amsterdam, Berlin, Paris, Rome, Madrid',
        'Europe/Athens' => '(UTC+2) Athens, Helsinki, Istanbul, Cairo, E. Europe',
        'Europe/Moscow' => '(UTC+3) Baghdad, Kuwait, Nairobi, Moscow',
        'Iran' => '(UTC+3:30) Tehran',
        'Asia/Dubai' => '(UTC+4) Abu Dhabi, Kazan, Muscat',
        'Asia/Kabul' => '(UTC+4:30) Kabul',
        'Asia/Yekaterinburg' => '(UTC+5) Islamabad, Karachi, Tashkent',
        'Asia/Calcutta' => '(UTC+5:30) Bombay, Calcutta, New Delhi',
        'Asia/Katmandu' => '(UTC+5:45) Nepal',
        'Asia/Omsk' => '(UTC+6) Almaty, Dhaka',
        'Indian/Cocos' => '(UTC+6:30) Cocos Islands, Yangon',
        'Asia/Krasnoyarsk' => '(UTC+7) Bangkok, Jakarta, Hanoi',
        'Asia/Hong_Kong' => '(UTC+8) Beijing, Hong Kong, Singapore, Taipei',
        'Asia/Tokyo' => '(UTC+9) Tokyo, Osaka, Sapporto, Seoul, Yakutsk',
        'Australia/Adelaide' => '(UTC+9:30) Adelaide, Darwin',
        'Australia/Sydney' => '(UTC+10) Brisbane, Melbourne, Sydney, Guam',
        'Asia/Magadan' => '(UTC+11) Magadan, Solomon Is., New Caledonia',
        'Pacific/Auckland' => '(UTC+12) Fiji, Kamchatka, Marshall Is., Wellington',
      ),
    ));
    $this->timezone->getDecorator('Description')->setOptions(array('placement' => 'APPEND'));

    // Languages
    $translate = Zend_Registry::get('Zend_Translate');
    $languageList = $translate->getList();

    //$currentLocale = Zend_Registry::get('Locale')->__toString();
    // Prepare default langauge
    $defaultLanguage = Engine_Api::_()->getApi('settings', 'core')->getSetting('core.locale.locale', 'en');
    if( !engine_in_array($defaultLanguage, $languageList) ) {
      if( $defaultLanguage == 'auto' && isset($languageList['en']) ) {
        $defaultLanguage = 'en';
      } else {
        $defaultLanguage = null;
      }
    }

    // Prepare language name list
    $localeObject = Zend_Registry::get('Locale');

    $languageNameList = array();
    $languageDataList = Zend_Locale_Data::getList($localeObject, 'language');
    $territoryDataList = Zend_Locale_Data::getList($localeObject, 'territory');

    foreach( $languageList as $localeCode ) {
      $languageNameList[$localeCode] = Zend_Locale::getTranslation($localeCode, 'language', $localeCode);
      if( empty($languageNameList[$localeCode]) ) {
        list($locale, $territory) = explode('_', $localeCode);
        $languageNameList[$localeCode] = "{$territoryDataList[$territory]} {$languageDataList[$locale]}";
      }
    }
    $languageNameList = array_merge(array(
      $defaultLanguage => $defaultLanguage
    ), $languageNameList);

    if(engine_count($languageNameList)>1){
      $this->addElement('Select', 'language', array(
        'label' => 'Language',
        'multiOptions' => $languageNameList,
      ));
      $this->language->getDecorator('Description')->setOptions(array('placement' => 'APPEND'));
    }
    else{
      $this->addElement('Hidden', 'language', array(
        'value' => current((array)$languageNameList),
        'order' => 1002
      ));
    }
    
    // Element: profile_type
    $topStructure = Engine_Api::_()->fields()->getFieldStructureTop('user');
    if( engine_count($topStructure) == 1 && $topStructure[0]->getChild()->type == 'profile_type' ) {
      $profileTypeField = $topStructure[0]->getChild();

      $options = $optionsIds = $profileTypeField->getOptions(array('profiletypeshow' => 1));
      
      $options = $profileTypeField->getElementParams('user');

      unset($options['options']['order']);
      unset($options['options']['multiOptions']['']);
      if($options['type'] == 'ProfileType') {
        unset($options['options']['multiOptions']['5']);
        unset($options['options']['multiOptions']['9']);
      }
      if( engine_count($options['options']['multiOptions']) > 1 ) { 
        $options = $profileTypeField->getElementParams('user');
        unset($options['options']['order']);
        unset($options['options']['multiOptions']['0']);
        $this->addElement('Select', 'profile_types', array_merge($options['options'], array(
              'required' => true,
              'allowEmpty' => false,
              'tabindex' => $tabIndex++,
            )));
      } else if( engine_count($options['options']['multiOptions']) == 1 ) {
        $this->addElement('Hidden', 'profile_types', array(
          'value' => $optionsIds[0]->option_id,
          'order' => 1001
        ));
      }
    }

    //Element member level
    $levelMultiOptions = array();
    $levels = Engine_Api::_()->getDbtable('levels', 'authorization')->fetchAll();
    foreach( $levels as $row ) {
      $levelMultiOptions[$row->level_id] = $row->getTitle();
    }
    $defaultLevelId = Engine_Api::_()->getItemTable('authorization_level')->getDefaultLevel()->level_id;
    $this->addElement('Select', 'level_id',array(
        'label'  => 'Select Member Level',
        'required'  => true,
        'multiOptions'  => $levelMultiOptions,
        'value' => $defaultLevelId,
    ));

    // Init level
    if(Engine_Api::_()->getApi('settings', 'core')->getSetting('network.enable', 1)) {
      $networkMultiOptions = array(); //0 => ' ');
      $networks = Engine_Api::_()->getDbtable('networks', 'network')->fetchAll();
      if(engine_count($networks) > 0) {
        foreach( $networks as $row ) {
          $networkMultiOptions[$row->network_id] = $row->getTitle();
        }
        $this->addElement('Multiselect', 'network_id', array(
          'label' => 'Networks',
          'multiOptions' => $networkMultiOptions,
        ));
      }
    }

    $this->addElement('Checkbox', 'approved', array(
        'label' => 'Approved?',
        'validators' => array(
            'notEmpty',
            array('GreaterThan', false, array(0)),
        ),
        'tabindex' => $tabIndex++,
    ));

    $this->addElement('Checkbox', 'verified', array(
        'label' => 'Is Email Verified?',
        'validators' => array(
            'notEmpty',
            array('GreaterThan', false, array(0)),
        ),
        'tabindex' => $tabIndex++,
    ));

    $this->addElement('Checkbox', 'enabled', array(
        'label' => 'Enabled?',
        'validators' => array(
            'notEmpty',
            array('GreaterThan', false, array(0)),
        ),
        'tabindex' => $tabIndex++,
    ));
    
    $this->addElement('Checkbox', 'is_verified', array(
      'label' => 'Verified?',
      'validators' => array(
          'notEmpty',
          array('GreaterThan', false, array(0)),
      ),
      'tabindex' => $tabIndex++,
    ));

    $this->addElement('Button', 'submit', array(
        'label' => 'Import',
        'type' => 'submit',
        'ignore' => true,
        'decorators' => array(
            'ViewHelper',
        ),
    ));

    $this->addElement('Cancel', 'cancel', array(
        'label' => 'cancel',
        'onclick' => 'javascript:parent.Smoothbox.close()',
        'link' => true,
        'prependText' => ' or ',
        'decorators' => array(
            'ViewHelper',
        ),
    ));

    $this->addDisplayGroup(array('submit', 'cancel'), 'buttons', array(
        'decorators' => array(
            'FormElements',
            'DivDivDivWrapper',
        ),
    ));
  }
}
