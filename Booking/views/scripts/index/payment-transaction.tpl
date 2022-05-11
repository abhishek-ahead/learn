<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>
<?php $defaultCurrency = Engine_Api::_()->booking()->defaultCurrency(); ?>
<div class="sescrowdfunding_dashboard_content_header sesbasic_clearfix">	
  <h3><?php echo $this->translate("Payments Received"); ?></h3>
  <p><?php echo $this->translate('Here, you are viewing the details of payments received from the website.') ?></p>
</div>
<?php if( isset($this->paymentRequests) && count($this->paymentRequests) > 0): ?>
<div class="sescf_paymentmade_table sesbasic_dashboard_table sesbasic_bxs">
  <form method="post" >
    <table>
      <thead>
        <tr>
          <th><?php echo $this->translate("Requested Amount") ?></th>
          <th><?php echo $this->translate("Released Amount") ?></th>
          <th><?php echo $this->translate("Released Date") ?></th>
          <th><?php echo $this->translate("Response Message") ?></th>
          <th><?php echo $this->translate("Status") ?></th>
          <th><?php echo $this->translate("Options") ?></th>
        </tr>
      </thead>
      <tbody>
        <?php 
          foreach ($this->paymentRequests as $item): ?>
        <tr>
          <td class="centerT"><?php echo Engine_Api::_()->booking()->getCurrencyPrice($item->requested_amount,$defaultCurrency); ?></td>
          <td class="centerT"><?php echo Engine_Api::_()->booking()->getCurrencyPrice($item->release_amount	,$defaultCurrency); ?></td>
          <td><?php echo $item->release_date ? Engine_Api::_()->sesbasic()->dateFormat($item->release_date) :  '-'; ?></td> 
          <td><?php echo $this->string()->truncate(empty($item->admin_message	) ? '-' : $item->admin_message, 30) ?></td>
          <td><?php echo ucfirst($item->state); ?></td>
          <td class="table_options">
         		<?php echo $this->htmlLink($this->url(array('action' => 'detail-payment', 'id' => $item->userpayrequest_id, 'crowdfunding_id' => $this->crowdfunding->custom_url), 'sescrowdfunding_dashboard', true), $this->translate("View Details"), array('title' => $this->translate("View Details"), 'class' => 'openSmoothbox')); ?>
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
    <?php echo $this->translate("No transactions have been made yet.") ?>
  </span>
</div>
<?php endif; ?>
</div>
</div>
</div>
