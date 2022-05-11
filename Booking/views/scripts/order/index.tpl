<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>

<?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Booking/externals/styles/styles.css'); ?>

<div class="layout_middle">
	<div class="generic_layout_container generic_layout_core_content">
  	<div class="sesapmt_booking_details_form sesbasic_bxs">
      <form class="sesbasic_clearfix" name="ticket" id="serviceBook" method="post" action="<?php echo $this->url(array('professional_id' => $this->professional_id,'controller'=>'order','order_id'=>$this->order->order_id,'action'=>'checkout'), 'booking_order', true); ?>">
      	<div class="_details sesapmt_booking_order_info_box">
          <div class="sesapmt_booking_order_info_summary">
            <div class="_title"><?php echo $this->translate("Order Summary"); ?></div>
            <div class="sesapmt_booking_order_info_field sesbasic_clearfix">
            	<?php $counter = count($this->appointmentDetails); ?>
              <span><?php echo $this->translate(array('Total service', 'Total services', $counter)) ?></span>
            	<span><?php echo $this->locale()->toNumber($counter); ?></span>
            </div>
            <?php foreach($this->appointmentDetails as $appointmentDetails){ ?>
              <div class="sesapmt_booking_order_info_field sesbasic_clearfix">
                <span><?php $servicename = Engine_Api::_()->getItem('booking_service', $appointmentDetails->service_id); echo $servicename->name; ?></span>
                <span><?php echo Engine_Api::_()->booking()->getCurrencyPrice($servicename->price);?></span>
              </div>
            <?php } ?>
            <?php if($this->order->total_service_tax+$this->order->total_entertainment_tax > 0){ ?>
              <div class="sesapmt_booking_order_info_field sesbasic_clearfix">
                <span><?php echo $this->translate("Total Tax"); ?></span>
                <span><?php echo Engine_Api::_()->booking()->getCurrencyPrice(($this->order->total_service_tax+$this->order->total_entertainment_tax)); ?></span>
              </div>
            <?php } ?>
            <div class="sesapmt_booking_order_info_field sesbasic_clearfix">
              <span><?php echo $this->translate("Service Durations"); ?></span>
              <span><?php echo Engine_Api::_()->booking()->convertToHoursMins($this->order->durations, '%02d hours %02d minutes'); ?></span>
            </div>
            <div class="sesapmt_booking_order_info_field sesbasic_clearfix _total">  
              <span><?php echo $this->translate("Grand Total"); ?></span>
              <span><?php echo Engine_Api::_()->booking()->getCurrencyPrice(($this->order->total_service_tax+$this->order->total_entertainment_tax+$this->order->total_amount)); ?></span>
            </div>
          </div>
        </div>
      	<div class="_form">
          <div class="_title"><?php echo $this->translate("Service order Details"); ?></div>
          <div class="sesapmt_booking_details_form_field sesbasic_clearfix">
            <div class="_label">
              <label for="fname_owner"><?php echo $this->translate("First Name"); ?> <span class="required">*</span></label>
            </div>
            <div class="_element">
              <input id="fname_owner" type="text" name="fname_owner" value="<?php echo isset($this->fnamelname['first_name']) ? $this->fnamelname['first_name'] : '' ?>" />
              <span class="required noDisp"><?php echo $this->translate("Please enter First Name");?></span>
            </div>
          </div>
          <div class="sesapmt_booking_details_form_field sesbasic_clearfix">
            <div class="_label">
              <label for="lname_owner"><?php echo $this->translate("Last Name"); ?> <span class="required">*</span></label>
            </div>
            <div class="_element">
              <input id="lname_owner" type="text" name="lname_owner" value="<?php echo isset($this->fnamelname['last_name']) ? $this->fnamelname['last_name'] : '' ?>" />
              <span class="required noDisp"><?php echo $this->translate("Please enter Last Name");?></span>
            </div>
          </div>
          <div class="sesapmt_booking_details_form_field sesbasic_clearfix">
            <div class="_label">
              <label for="mobile_owner"><?php echo $this->translate("Mobile"); ?> <span class="required">*</span></label>
            </div>
            <div class="_element">
              <input id="mobile_owner" type="text" name="mobile_owner" value="" />
              <span class="required noDisp"><?php echo $this->translate("Please enter valid Mobile.");?></span>
            </div>
          </div>
          <div class="sesapmt_booking_details_form_field sesbasic_clearfix">
            <div class="_label">
              <label for="email_owner"><?php echo $this->translate("Email"); ?> <span class="required">*</span></label>
            </div>
            <div class="_element">
              <input id="email_owner" type="text" name="email_owner" value="<?php echo $this->viewer->email; ?>" />
              <span class="required noDisp"><?php echo $this->translate("Please enter valid Email.");?></span>
            </div>
          </div>
          <div class="sesapmt_booking_details_form_field _btn sesbasic_clearfix">
          	<div class="_label">&nbsp;</div>		
          	<div class="_element"><button type="submit" name="submit" value="submit" id="sbtBtn"><?php echo $this->translate("Continue"); ?></button></div>
        	</div>
        </div>
      </form>
    </div>
	</div>
</div>
<script type="application/javascript">
function validateForm(){
  valid = true;
  sesJqueryObject('#serviceBook').find(':input[type=text]').each(function(){
      if(!sesJqueryObject(this).val()  && !validateEmail(sesJqueryObject(this).val())){
        valid = false;
        sesJqueryObject(this).parent().find('span').show();
      }else{
        sesJqueryObject(this).parent().find('span').hide();
      }
      if(sesJqueryObject(this).attr('id')=="mobile_owner" && !is_mobile_valid(sesJqueryObject(this).val())){
        sesJqueryObject(this).parent().find('span').show();
        valid = false;
      }
  });
  return valid;
}
sesJqueryObject('#serviceBook').submit(function(e){
  valid = validateForm();
  if(!valid){
      e.preventDefault();
      return false;
  }
    return true;
});
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
function is_mobile_valid(string_or_number){
  var re = /^[1-9][0-9]{9,14}$/;
  return re.test(string_or_number);
}
</script>
