<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>
<?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Booking/externals/styles/styles.css'); ?>
<div class="layout_middle">
	<div class="generic_layout_container generic_layout_core_content">
    <div class="sesapmt_booking_checkout sesbasic_clearfix sesbasic_bxs">
      <div class="sesapmt_booking_order_info_box">
        <div class="_title">
          <?php echo $this->translate("Order Information"); ?>
          <a href="<?php echo $this->url(array('action'=>'bookservices','professional'=>$this->professional_id),'booking_general',true); ?>" class="floatR fas fa-times" title="Cancel Order"></a>
        </div>
        <div class="sesapmt_booking_order_info_field sesbasic_clearfix">
          <?php $counter = count($this->appointmentDetails); ?>
          <span><?php echo $this->translate(array('Total service', 'Total services', $counter));?></span>
          <span><?php echo $this->locale()->toNumber($counter) ?></span>
        </div>
        <?php foreach($this->appointmentDetails as $appointmentDetails){ ?>
          <div class="sesapmt_booking_order_info_field sesbasic_clearfix">
            <span><?php $servicename = Engine_Api::_()->getItem('booking_service', $appointmentDetails->service_id); echo $servicename->name;?></span>
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
      
      <div class="sesapmt_booking_checkout_payment prelative">
      	<form method="get" action="<?php echo $this->escape($this->url(array('action' => 'process'))) ?>" enctype="application/x-www-form-urlencoded">
          <div id="buttons-wrapper" class="sesapmt_booking_checkout_btns centerT">
            <?php foreach( $this->gateways as $gatewayInfo ):
              if($gatewayInfo['gateway']->title=="PayPal" 
                || $gatewayInfo['gateway']->title=="Stripe"
                || ($gatewayInfo['gateway']->title=="Paytm" && Engine_Api::_()->booking()->defaultCurrency() == "INR")){
                $gateway = $gatewayInfo['gateway'];
                $plugin = $gatewayInfo['plugin'];
              ?>
              <button type="submit" name="execute"  onclick="$('gateway_id').set('value', '<?php echo $gateway->gateway_id ?>')">
                <?php echo $this->translate('Pay with %1$s', $this->translate($gateway->title)) ?>
              </button>
                <?php } ?>
          	<?php endforeach; ?>
        	</div>
        	<input type="hidden" name="gateway_id" id="gateway_id" value="" />
        </form>
        <div class="sesbasic_loading_cont_overlay" style="display:none"></div>
      </div>
    </div>
	</div>
</div>  