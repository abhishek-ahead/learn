<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: index.tpl  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
 
?>
<?php 
$this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); 
?>

<?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Booking/externals/styles/styles.css'); ?>

<div class="sesapmt_sidebar_button">
	<a href="" class="sesapmt_btn sesbasic_animation"><span><?php echo $this->translate("Book");?></span></a>
</div>