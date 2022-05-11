<?php

?>
<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>

<?php if(!$this->is_ajax){ ?>
	<div id="booking_accountdetails">
<?php } ?>
<ul class="sesapmt_dashboard_sub_tabs">
	<li class="<?php echo $this->gateway_type == 'paypal' ? '_active' : ''; ?>"><a href="javascript:;" data-gateway_type="paypal" class="sesbasic_dashboard_nopropagate_content"><i class="fab fa-paypal"></i><span><?php echo $this->translate('Paypal Details'); ?></span></a></li>
	<?php if(Engine_Api::_()->getDbtable('modules', 'core')->isModuleEnabled('sesadvpmnt') && Engine_Api::_()->getApi('settings', 'core')->getSetting('sesadvpmnt.enable.package', 1)){ ?>
			<li class="<?php echo $this->gateway_type == 'stripe' ? '_active' : ''; ?>"><a href="javascript:;" data-gateway_type="stripe"  class="sesbasic_dashboard_nopropagate_content"><i class="fab fa-cc-stripe"></i><span><?php echo $this->translate('Stripe Details'); ?></span></a></li>
	<?php } ?>
	<?php if(Engine_Api::_()->getDbtable('modules', 'core')->isModuleEnabled('epaytm')){ ?>
			<li class="<?php echo $this->gateway_type == 'paytm' ? '_active' : ''; ?>"><a href="javascript:;" data-gateway_type="paytm" class="sesbasic_dashboard_nopropagate_content"><i class="fa fa-cc-paytm"></i><span><?php echo $this->translate('Paytm Details'); ?></span></a></li>
	<?php } ?>
</ul>
<?php echo $this->form->render() ?>
<?php if(!$this->is_ajax){ ?>
	</div>
<?php  } ?>
<?php if($this->is_ajax) die; ?>