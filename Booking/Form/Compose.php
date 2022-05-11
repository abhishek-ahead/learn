<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Compose.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */

class Booking_Form_Compose extends Engine_Form {

    protected $_professional;
    
    function getProfessionalName($professionalName){
        $this->_professional=$professionalName;
        return $this->_professional;
    }
    
    function setProfessionalName($professionalName){
        $this->_professional=$professionalName;
        return $this->_professional;
    }
    
    public function init() 
    {   
        $this->setTitle('Compose Message');
        $this->setDescription('Send message to Professional');
        
        // init to        
        $this->addElement('Text', 'name', array(
            'label'=>'Send To',
            'order' => 2,
            'value'=>$this->_professional,
            'readonly'=>true
        ));

        Engine_Form::addDefaultDecorators($this->name);

        // init title
        $this->addElement('Text', 'title', array(
          'label' => 'Subject',
          'order' => 3,
        ));

        // init body - plain text
        $this->addElement('Textarea', 'body', array(
            'label' => 'Message',
            'order' => 4,
            'required' => true,
            'allowEmpty' => false,
        ));
          
        // init submit
        $this->addElement('Button', 'submit', array(
          'label' => 'Send Message',
          'order' => 5,
          'type' => 'submit',
          'ignore' => true
        ));
    }
}
  