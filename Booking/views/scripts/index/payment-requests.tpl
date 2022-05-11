<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>
<?php $defaultCurrency = Engine_Api::_()->booking()->defaultCurrency(); ?>
<div class="sescrowdfunding_dashboard_content_header sesbasic_clearfix">	
  <h3><?php echo $this->translate("Make Payment Request"); ?></h3>
    <?php if($this->thresholdAmount > 0){ ?>
    <div class="sescrowdfunding_dashboard_threshold_amt"><?php echo $this->translate("Threshold Amount:"); ?> <b><?php echo Engine_Api::_()->booking()->getCurrencyPrice($this->thresholdAmount,$defaultCurrency); ?></b></div>
    <?php } ?>
</div>
<?php if(!count($this->userGateway)){ ?>
	<div class="tip">
  <span>    
    <?php echo $this->translate('Payment details not submitted yet %1$sClick Here%2$s to submit.', '<a href="'.$this->url(array('crowdfunding_id' => $this->crowdfunding->custom_url,'action'=>'account-details'), 'sescrowdfunding_dashboard', true).'">', '</a>'); ?>
  </span>
</div>
<?php } ?>
<?php $orderDetails = $this->orderDetails; ?>
<div class="sescf_payment_request_stats sescf_donations_stats_container sesbasic_bxs sesbasic_clearfix">
	<div class="sescf_donations_stats">
  	<div>
      <span><?php echo $this->translate("Total Orders"); ?></span>
      <span><?php echo $orderDetails['totalOrder'];?></span>
    </div>
  </div>
	<div class="sescf_donations_stats">
		<div>
      <span><?php echo $this->translate("Total Amount"); ?></span>
      <span><?php echo Engine_Api::_()->booking()->getCurrencyPrice($orderDetails['totalAmountSale'],$defaultCurrency); ?></span>
  	</div>
  </div>
	<div class="sescf_donations_stats">
		<div>
      <span><?php echo $this->translate("Commission Amount"); ?></span>
      <span><?php echo Engine_Api::_()->booking()->getCurrencyPrice($orderDetails['commission_amount'],$defaultCurrency); ?></span>
  	</div>
  </div>
	<div class="sescf_donations_stats">
		<div>
      <span><?php echo $this->translate("Total Amount After Commission"); ?></span>
      <?php $totalRemainingAmount = $orderDetails['totalAmountSale'] - $orderDetails['commission_amount']; ?>
      <span><?php echo Engine_Api::_()->booking()->getCurrencyPrice($totalRemainingAmount,$defaultCurrency); ?></span>
  	</div>
  </div>
  <div class="sescf_donations_stats">
		<div>
      <span><?php echo $this->translate("Total Remaining Amount"); ?></span>
      <?php $totalRemainingAmountafterPayreceived = $this->remainingAmount - $orderDetails['commission_amount']; ?>
      <span><?php echo Engine_Api::_()->booking()->getCurrencyPrice($totalRemainingAmountafterPayreceived,$defaultCurrency); ?></span>
		</div>
	</div>
</div>

<?php if($this->remainingAmount >= $this->thresholdAmount && count($this->userGateway) && !count($this->isAlreadyRequests)) { ?>
<div class="sescf_dashboard_btn">	
	<a href="<?php echo $this->url(array('action'=>'payment-request'), 'booking_general', true); ?>" class="openSmoothbox sesbasic_button cescf_pr_icon cescf_ic_btn"><?php echo $this->translate("Make Request For Payment."); ?></a>
</div>
<?php } ?>
<?php if( isset($this->paymentRequests) && count($this->paymentRequests) > 0): ?>
<div class="sescf_payment_request_table sesbasic_dashboard_table sesbasic_bxs">
  <form method="post" >
    <table>
      <thead>
        <tr>
          <th class="centerT"><?php echo $this->translate("Request Id"); ?></th>
           <th><?php echo $this->translate("Amount Requested") ?></th>
          <th><?php echo $this->translate("Requested Date") ?></th>
          <th><?php echo $this->translate("Release Amount") ?></th>
          <th><?php echo $this->translate("Release Date") ?></th>
          <th><?php echo $this->translate("Status") ?></th>
          <th><?php echo $this->translate("Options") ?></th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($this->paymentRequests as $item): ?>
          <tr>
            <td class="centerT"><?php echo $item->userpayrequest_id; ?></td>
            <td class="centerT"><?php echo Engine_Api::_()->booking()->getCurrencyPrice($item->requested_amount,$defaultCurrency); ?></td>
            <td><?php echo Engine_Api::_()->sesbasic()->dateFormat($item->creation_date	); ?></td> 
            <td class="centerT"><?php echo $item->state != 'pending' ? Engine_Api::_()->booking()->getCurrencyPrice($item->release_amount	,$defaultCurrency) :  "-"; ?></td>
            <td><?php echo $item->release_date && (bool)strtotime($item->release_date) && $item->state != 'pending' ? Engine_Api::_()->sesbasic()->dateFormat($item->release_date) :  '-'; ?></td> 
            <td><?php echo ucfirst($item->state); ?></td>
            <td class="table_options">
              <?php if ($item->state == 'pending') { ?>
                <?php echo $this->htmlLink($this->url(array('crowdfunding_id' => $this->crowdfunding->custom_url,'action'=>'payment-request','id'=>$item->userpayrequest_id), 'sescrowdfunding_dashboard', true), $this->translate(""), array('class' => 'openSmoothbox fa fa-pencil','title'=>$this->translate("Edit Request"))); ?>
                <?php echo $this->htmlLink($this->url(array('action' => 'delete-payment', 'id' => $item->userpayrequest_id, 'crowdfunding_id' => $this->crowdfunding->custom_url), 'sescrowdfunding_dashboard', true), $this->translate(""), array('class' => 'openSmoothbox fa fa-trash','title'=>$this->translate("Delete Request"))); ?>
              <?php } ?>
              <?php echo $this->htmlLink($this->url(array('action' => 'detail-payment', 'id' => $item->userpayrequest_id, 'crowdfunding_id' => $this->crowdfunding->custom_url), 'sescrowdfunding_dashboard', true), $this->translate(""), array('class' => 'openSmoothbox fa fa-eye','title'=>$this->translate("View Details"))); ?>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
   </form>
</div>
<?php else: ?>
<div class="tip">
  <span>
    <?php echo $this->translate("You do not have any pending payment request yet.") ?>
  </span>
</div>
<?php endif; ?>
</div>
</div>
</div>
