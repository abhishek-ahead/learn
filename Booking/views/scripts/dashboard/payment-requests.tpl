<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>
<div id="booking_paymentrequests" class="sesapmt_dashboard_payments_details"> 
  <?php $defaultCurrency = Engine_Api::_()->booking()->defaultCurrency(); ?>
  <div class="sesapmt_dashboard_header">	
    <h3><?php echo $this->translate("Make Payment Request"); ?></h3>
 	</div>
  <?php if($this->thresholdAmount > 0){ ?>
  	<div class="sesapmt_dashboard_threshold_amt">
    	<?php echo $this->translate("Threshold Amount:"); ?> <b><?php echo Engine_Api::_()->booking()->getCurrencyPrice($this->thresholdAmount,$defaultCurrency); ?></b></div>
  <?php } ?>
  
  <?php if(!count($this->userGateway)){ ?>
    <div class="tip">
      <span>    
        <?php echo $this->translate('Payment details not submited yet %1$sClick Here%2$s to submit.', '<a href="javascript:;" onclick="showPaymentTab()">', '</a>'); ?>
      </span>
  	</div>
  <?php } ?>
  <?php $orderDetails = $this->orderDetails; ?>
  <div class="sesapmt_sale_stats_container sesbasic_bxs sesbasic_clearfix">
    <div class="sesapmt_sale_stats">
    	<article>
        <span><?php echo $this->translate("Total Orders"); ?></span>
        <span><?php echo $orderDetails['totalOrder'];?></span>
    	</article>
    </div>
    <div class="sesapmt_sale_stats">
    	<article>
        <span><?php echo $this->translate("Total Services"); ?></span>
        <span><?php echo $orderDetails['total_services']; ?></span>
    	</article>
    </div>
    <div class="sesapmt_sale_stats">
    	<article>
        <span><?php echo $this->translate("Total Amount"); ?></span>
        <span><?php echo Engine_Api::_()->booking()->getCurrencyPrice($orderDetails['totalAmountSale'],$defaultCurrency); ?></span>
    	</article>
    </div>
    <div class="sesapmt_sale_stats">
    	<article>
        <span><?php echo $this->translate("Total Tax Amount"); ?></span>
        <span><?php echo Engine_Api::_()->booking()->getCurrencyPrice($orderDetails['totalTaxAmount'],$defaultCurrency); ?></span>
    	</article>
    </div>
    <div class="sesapmt_sale_stats">
    	<article>
        <span><?php echo $this->translate("Total Commission Amount"); ?></span>
        <span><?php echo Engine_Api::_()->booking()->getCurrencyPrice($orderDetails['commission_amount'],$defaultCurrency); ?></span>
    	</article>
    </div>
    <div class="sesapmt_sale_stats">
    	<article>
        <span><?php echo $this->translate("Total Remaining Amount"); ?></span>
        <span><?php echo Engine_Api::_()->booking()->getCurrencyPrice($this->remainingAmount,$defaultCurrency); ?></span>
    	</article>
    </div>
  </div>
  <?php if($this->remainingAmount >= $this->thresholdAmount && count($this->userGateway) && !count($this->isAlreadyRequests)){ ?>
    <div class="sesapmt_dashboard_header_btn">	
      <a href="<?php echo $this->url(array('professional_id' => $this->professional->user_id,'action'=>'payment-request'), 'booking_dashboard', true); ?>" class="openSmoothbox sesapmt_btn sesbasic_animation"><i class="fa fa-money"></i><span><?php echo $this->translate("Make Request For Payment."); ?></span></a>
    </div>
  <?php } ?>
  <?php if( isset($this->paymentRequests) && count($this->paymentRequests) > 0): ?>
  <div class="sesapmt_dashboard_table sesbasic_bxs">
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
          <?php 
            foreach ($this->paymentRequests as $item): ?>
          <tr>
            <td class="centerT"><?php echo $item->userpayrequest_id; ?></td>
            <td class="centerT"><?php echo Engine_Api::_()->booking()->getCurrencyPrice($item->requested_amount,$defaultCurrency); ?></td>
            <td><?php echo Engine_Api::_()->booking()->dateFormat($item->creation_date	); ?></td> 
            <td class="centerT"><?php echo $item->state != 'pending' ? Engine_Api::_()->booking()->getCurrencyPrice($item->release_amount	,$defaultCurrency) :  "-"; ?></td>
            <td><?php echo $item->release_date && (bool)strtotime($item->release_date) && $item->state != 'pending' ? Engine_Api::_()->booking()->dateFormat($item->release_date) :  '-'; ?></td> 
            <td><?php echo ucfirst($item->state); ?></td>
            <td class="table_options">
              <?php if ($item->state == 'pending'){ ?>
                  <?php echo $this->htmlLink($this->url(array('professional_id' => $this->professional->user_id,'action'=>'payment-request','id'=>$item->userpayrequest_id), 'booking_dashboard', true), $this->translate(""), array('class' => 'openSmoothbox fa fa-pencil','title'=>$this->translate("Edit Request"))); ?>
                  <?php echo $this->htmlLink($this->url(array('action' => 'delete-payment', 'id' => $item->userpayrequest_id, 'professional_id' => $this->professional->user_id), 'booking_dashboard', true), $this->translate(""), array('class' => 'openSmoothbox fa fa-trash','title'=>$this->translate("Delete Request"))); ?>
              <?php } ?>
                  <?php echo $this->htmlLink($this->url(array('action' => 'detail-payment', 'id' => $item->userpayrequest_id, 'professional_id' => $this->professional->user_id), 'booking_dashboard', true), $this->translate(""), array('class' => 'openSmoothbox fa fa-eye','title'=>$this->translate("View Details"))); ?>
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