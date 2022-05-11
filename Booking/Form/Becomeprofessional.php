<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Becomeprofessional.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Form_Becomeprofessional extends Engine_Form
{

	protected $_updatePro = '';
	protected $_imgSrc = '';

	/**
	 * Get the value of _updatePro
	 */
	public function getupdatePro()
	{
		return $this->_updatePro;
	}

	/**
	 * Set the value of _updatePro
	 *
	 * @return  self
	 */
	public function setupdatePro($updatePro)
	{
		$this->_updatePro = $updatePro;
		return $this;
	}

	/**
	 * Get the value of _imgSrc
	 */
	public function getimgSrc()
	{
		return $this->_imgSrc;
	}

	/**
	 * Set the value of _imgSrc
	 *
	 * @return  self
	 */
	public function setimgSrc($imgSrc)
	{
		$this->_imgSrc = $imgSrc;

		return $this;
	}

	public function init()
	{
		$this->setTitle('Become a professional')
			->setDescription('Use this form below to register as a professional.')
			->setAttrib('id', 'booking_mysettings_ajax_form_submit');

		$this->addElement('Text', 'name', array(
			'label' => 'Name',
			'required' => true
		));

		$this->addElement('Text', 'designation', array(
			'label' => 'Designation',
		));

		$settingsLocation = Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.location.isrequired');
		if ($settingsLocation) {
			$this->addElement('Text', 'location', array(
				'label' => 'Location:',
				'id' => 'locationSesList',
				'value' => '',
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

		$countries = Engine_Api::_()->booking()->getCountryCodes();
		$countriesArray = array();
		foreach ($countries as $code => $country) {
			$countriesArray[$country["code"]] = "+" . $country["code"];
		}

		$this->addElement('Select', 'country_code', array(
			'label' => 'Country',
			'multiOptions' => $countriesArray,
			'required' => true,
			'allowEmpty' => false,
		));

		$this->addElement('Text', 'phone_number', array(
			'label' => 'Phone Number',
			'placeholder' => 'Number',
			'required' => true,
			'allowEmpty' => false,
			'validators' => array(
				array('NotEmpty', true),
				array('Regex', true, array("/^[1-9][0-9]{9,14}$/")),
			),
			'tabindex' => 1,
		));

		$this->phone_number->getDecorator('Description')->setOptions(array('placement' => 'APPEND'));
		$this->phone_number->getValidator('Regex')->setMessage('Please enter a valid phone number.');
		$this->phone_number->getValidator('NotEmpty')->setMessage('Please enter a valid phone number.', 'isEmpty');

		$this->addDisplayGroup(array('country_code', 'phone_number'), 'number', array(
			'legend' => "Phone Number",
			'decorators' => array(
				'FormElements',
				'DivDivDivWrapper',
			)
		));
		$this->setDisplayGroupDecorators(array('FormElements', 'Fieldset'));

		$apitimezoneArray = array(
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
		);

		$viewer = Engine_Api::_()->user()->getViewer();
		$tablename = Engine_Api::_()->getDbtable('professionals', 'booking');
		$select = $tablename->select()->from($tablename->info('name'), array('timezone'))->where("user_id =?", $viewer->getIdentity());
		$data = $tablename->fetchRow($select);
		$this->addElement('select', 'timezone', array(
			'label' => 'Timezone',
			'description' => 'Select Your Timezone?',
			'multiOptions' => $apitimezoneArray,
			'required' => true,
			'value' => empty($data) ? $viewer->timezone : $data->timezone,
		));

		$this->addElement('Textarea', 'description', array(
			'label' => 'Description',
		));

		$this->addElement('File', 'file_id', array(
			'label' => 'Photo',
			'description' => 'Upload a photo',
		));

		$this->file_id->addValidator('Extension', false, 'jpg,png,gif,jpeg');

		$this->addElement('Button', 'submit', array(
			'label' => 'Save Changes',
			'type' => 'submit',
			'ignore' => true,
			'decorators' => array(
				'ViewHelper',
			),
		));

		if (empty($this->_updatePro)) {
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
		}

		if (!empty($this->_imgSrc)) {
			$this->addElement('Dummy', 'image', array(
				'content' => "<img src='" . $this->_imgSrc . "' height='100' width='100'/>"
			));
		}

		$this->addDisplayGroup(array('submit', 'cancel'), 'buttons', array(
			'decorators' => array(
				'FormElements',
				'DivDivDivWrapper',
			),
		));
	}
}
