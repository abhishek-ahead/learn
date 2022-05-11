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
<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>

<?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Booking/externals/styles/styles.css'); ?>
<div class="layout_middle">
	<div class="generic_layout_container layout_core_content">
    <div class="sesapmt_db_wrapper sesbasic_bxs sesbasic_clearfix">
      <div class="sesapmt_panel_tabs">
      	<ul class="sesapmt_panel_tabs_ul">
          <li><a href="/sesforsmt/bookings#transaction"><?php echo $this->translate('Transaction'); ?></a></li>
          <li><a href="/sesforsmt/bookings#Requestsettings"><?php echo $this->translate('Request Settings'); ?></a></li>
          <li><a href="/sesforsmt/bookings#history"><?php echo $this->translate('History'); ?></a></li>
        </ul>
      </div>
        <div class="sesapmt_panel_tabs_cont">
            <div id="genrealdetails" class="tab-content">1</div>
            <div id="paymentdetails" class="tab-content">2</div>
        </div>
    </div>
  </div>
</div>