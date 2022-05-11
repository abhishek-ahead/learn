<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>
<?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Booking/externals/styles/styles.css'); ?>
<div class="layout_middle">
  <div class="generic_layout_container layout_core_content sesbasic_bxs">
    <?php if(empty($this->error)){ ?>
      <div class="sesapmt_order_message_box sesapmt_order_success_box">
        <i class="fa fa-check"></i>
        <div class="_cont">
          <h2><?php echo $this->translate("Your order is successfully completed."); ?></h2>
          <p class="_msg">
            <?php echo $this->translate(" Congratulations! your Order #%s is successfully completed and the details has been sent to %s.",$this->order->order_id,isset($this->order->email) && $this->order->email != '' ? '<b>'.$this->order->email.'</b>' : '<b>'.$this->viewer->email.'</b>'); ?>
          </p>
          <div class="_btns sesbasic_clearfix">
            <a href="<?php echo $this->url(array('action'=>'appointments'), 'booking_general', true); ?>" class="sesbasic_link_btn floatL"><?php echo $this->translate("Go To Appointment"); ?></a>
          </div>
        </div>    
      </div>    
    <?php  }else{?>
    	<div class="sesapmt_order_message_box sesapmt_order_error_box">
      	<i class="fa fa-exclamation-triangle"></i>
        <div class="_cont">
          <h2><?php echo $this->error; ?></h2>
          <div class="_btns sesbasic_clearfix">
            <a href="<?php echo $this->url(array('action'=>'bookservices','professional'=>$this->professional_id),'booking_general',true); ?>" class="sesbasic_link_btn floatL"><?php echo $this->translate("Go To Appointment"); ?></a>
          </div>
      	</div>    
      </div>
    <?php } ?>
  </div>
</div>