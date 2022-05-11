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


<div class="sesapmt_myappointments_wrapper sesbasic_bxs sesbasic_clearfix">
  <ul class="sesapmt_tabs sesbasic_clearfix">
    <li class="selected"><a href="#tab1"><?php echo $this->translate("Current Appointments");?></a></li>
    <li><a href="#tab2"><?php echo $this->translate("Upcoming Appointments");?></a></li>
    <li><a href="#tab2"><?php echo $this->translate("Completed Appointments");?></a></li>
  </ul>
  
  <div class="sesapmt_myappointments_cont">
  	
    <div class="sesbasic_clearfix">
    	<div class="sesapmt_myappointments_filters sesbasic_clearfix">
      	<div class="floatL _left"><a href="#" class="selected"><?php echo $this->translate('Given'); ?></a>&nbsp;|&nbsp;<a href="#"><?php echo $this->translate('Taken'); ?></a></div>
        <div class="floatR _right">
        	<span>
          	<label><?php echo $this->translate('Status:'); ?></label>
            <select>
            	<option><?php echo $this->translate('Completed'); ?></option>
              <option><?php echo $this->translate('Pending'); ?></option>
              <option><?php echo $this->translate('Cancelled'); ?></option>
            </select>
          </span>
          <span>
          	<label><?php echo $this->translate('Payment Status:'); ?></label>
            <select>
            	<option><?php echo $this->translate('Completed'); ?></option>
              <option><?php echo $this->translate('Pending'); ?></option>
              <option><?php echo $this->translate('Cancelled'); ?></option>
            </select>
          </span>
        </div>
      </div>	
      <!--<div class="sesapmt_myappointments_cont_clm_head"><?php echo $this->translate("Given Appointments");?></div>-->
      <div class="sesapmt_myappointments_list">
        
        <div class="sesapmt_myappointments_list_item sesbasic_clearfix">
          <article class="sesbasic_clearfix">
            <div class="sesapmt_myappointments_list_item_thumb">
              <a href=""><span class="bg_item_photo" style="background-image:url(https://cdn.dribbble.com/users/14268/avatars/normal/5b1b8427c9b8559dead85f3c6d25dfbe.jpg);"></span></a>
            </div>
            <div class="sesapmt_myappointments_list_item_info">
              <p class="sesapmt_myappointments_list_item_title"><a href="#"><?php echo $this->translate('Eddie Lobanovskiy'); ?></a></p>
              <p class="sesapmt_myappointments_list_item_det">
                <span class="sesbasic_text_light"><?php echo $this->translate("Timing:");?></span>
                <span>10:00 AM - 11:00 AM on 28/07/2017</span>
              </p>
              <p class="sesapmt_myappointments_list_item_det">
                <span class="sesbasic_text_light"><?php echo $this->translate("Status:");?></span>
                <span class="sesapmt_status_completed"><?php echo $this->translate("Completed") ?></span>
              </p>
              <p class="sesapmt_myappointments_list_item_det floatL">
                <span class="sesbasic_text_light"><?php echo $this->translate("Payment:");?></span>
                <span class="sesapmt_status_completed"><?php echo $this->translate("Completed") ?></span>
              </p>
              <p class="sesapmt_myappointments_list_item_btns floatR">
                <a href="">Reject</a>&nbsp;|&nbsp;<a href=""><?php echo $this->translate('Block'); ?></a>	
              </p>
            </div>
          </article>
        </div>
        
        <div class="sesapmt_myappointments_list_item sesbasic_clearfix">
          <article class="sesbasic_clearfix">
            <div class="sesapmt_myappointments_list_item_thumb">
              <a href=""><span class="bg_item_photo" style="background-image:url(https://cdn.dribbble.com/users/1/avatars/normal/f7f4d84953eec9ad0f0aed3022433af4.jpg);"></span></a>
            </div>
            <div class="sesapmt_myappointments_list_item_info">
              <p class="sesapmt_myappointments_list_item_title"><a href="#"><?php echo $this->translate('Dan Cederholm'); ?></a></p>
              <p class="sesapmt_myappointments_list_item_det">
                <span class="sesbasic_text_light"><?php echo $this->translate("Timing:");?></span>
                <span>10:00 AM - 11:00 AM on 28/07/2017</span>
              </p>
              <p class="sesapmt_myappointments_list_item_det">
                <span class="sesbasic_text_light"><?php echo $this->translate("Status:");?></span>
                <span class="sesapmt_status_pending"><?php echo $this->translate("Pending") ?></span>
              </p>
              <p class="sesapmt_myappointments_list_item_det floatL">
                <span class="sesbasic_text_light"><?php echo $this->translate("Payment:");?></span>
                <span class="sesapmt_status_pending"><?php echo $this->translate("Pending") ?></span>
              </p>
              <p class="sesapmt_myappointments_list_item_btns floatR">
                <a href=""><?php echo $this->translate('Reject'); ?></a>&nbsp;|&nbsp;<a href=""><?php echo $this->translate('Block'); ?></a>	
              </p>
            </div>
          </article>
        </div>
        
        <div class="sesapmt_myappointments_list_item sesbasic_clearfix">
          <article class="sesbasic_clearfix">
            <div class="sesapmt_myappointments_list_item_thumb">
              <a href=""><span class="bg_item_photo" style="background-image:url(https://cdn.dribbble.com/users/4/avatars/normal/avatar.jpg);"></span></a>
            </div>
            <div class="sesapmt_myappointments_list_item_info">
              <p class="sesapmt_myappointments_list_item_title"><a href="#"><?php echo $this->translate('Meagan Fisher'); ?></a></p>
              <p class="sesapmt_myappointments_list_item_det">
                <span class="sesbasic_text_light"><?php echo $this->translate("Timing:");?></span>
                <span>10:00 AM - 11:00 AM on 28/07/2017</span>
              </p>
              <p class="sesapmt_myappointments_list_item_det">
                <span class="sesbasic_text_light"><?php echo $this->translate("Status:");?></span>
                <span class="sesapmt_status_cancelled"><?php echo $this->translate("Cancelled") ?></span>
              </p>
              <p class="sesapmt_myappointments_list_item_det floatL">
                <span class="sesbasic_text_light"><?php echo $this->translate("Payment:");?></span>
                <span class="sesapmt_status_cancelled"><?php echo $this->translate("Cancelled") ?></span>
              </p>
              <p class="sesapmt_myappointments_list_item_btns floatR">
                <a href=""><?php echo $this->translate('Reject'); ?></a>&nbsp;|&nbsp;<a href=""><?php echo $this->translate('Block'); ?></a>	
              </p>
            </div>
          </article>  
        </div>
        
        <div class="sesapmt_myappointments_list_item sesbasic_clearfix">
          <article class="sesbasic_clearfix">
            <div class="sesapmt_myappointments_list_item_thumb">
              <a href=""><span class="bg_item_photo" style="background-image:url(https://cdn.dribbble.com/users/14268/avatars/normal/5b1b8427c9b8559dead85f3c6d25dfbe.jpg);"></span></a>
            </div>
            <div class="sesapmt_myappointments_list_item_info">
              <p class="sesapmt_myappointments_list_item_title"><a href="#"><?php echo $this->translate('Eddie Lobanovskiy'); ?></a></p>
              <p class="sesapmt_myappointments_list_item_det">
                <span class="sesbasic_text_light"><?php echo $this->translate("Timing:");?></span>
                <span>10:00 AM - 11:00 AM on 28/07/2017</span>
              </p>
              <p class="sesapmt_myappointments_list_item_det">
                <span class="sesbasic_text_light"><?php echo $this->translate("Status:");?></span>
                <span class="sesapmt_status_completed"><?php echo $this->translate("Completed") ?></span>
              </p>
              <p class="sesapmt_myappointments_list_item_det floatL">
                <span class="sesbasic_text_light"><?php echo $this->translate("Payment:");?></span>
                <span class="sesapmt_status_completed"><?php echo $this->translate("Completed") ?></span>
              </p>
              <p class="sesapmt_myappointments_list_item_btns floatR">
                <a href=""><?php echo $this->translate('Reject'); ?></a>&nbsp;|&nbsp;<a href=""><?php echo $this->translate('Block'); ?></a>	
              </p>
            </div>
          </article>
        </div>
        
      </div>
    </div>
    
  </div>
</div>
