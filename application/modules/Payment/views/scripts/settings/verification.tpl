<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    Payment
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: index.tpl 9747 2012-07-26 02:08:08Z john $
 * @author     John
 */
?>
<div class="generic_layout_container layout_top">
  <div class="generic_layout_container layout_middle">
    <?php echo $this->content()->renderWidget('user.user-setting-cover-photo'); ?>
  </div>
</div>
<div class="generic_layout_container layout_main user_setting_main_page_main">
  <div class="generic_layout_container layout_left">
    <div class="theiaStickySidebar">
      <?php echo $this->content()->renderWidget('user.settings-menu'); ?>
    </div>
  </div>
  <div class="generic_layout_container layout_middle user_setting_main_middle">
    <div class="theiaStickySidebar">
      <?php 
        $isSentRequest = Engine_Api::_()->getDbTable('verificationrequests', 'user')->isSentRequest(array('user_id' => $this->user->getIdentity()));
        $settings = Engine_Api::_()->getApi('settings', 'core'); 
        $currentCurrency = $settings->getSetting('payment.currency', 'USD');
      ?>
      <div class="user_setting_global_form">
        <?php if( $this->isAdmin ): ?>
          <div class="tip">
            <span><?php echo $this->translate('Verifications Requests are not required for administrators and moderators.') ?></span>
          </div>
        <?php endif; ?>
        <?php if( !$this->isAdmin ): ?>
          <form method="get" action="<?php echo $this->escape($this->url(array('module'=> 'user','controller' => 'verification', 'action' => 'process'),'default',true)) ?>" class="global_form verification_form_settings" enctype="application/x-www-form-urlencoded">
            <div>
              <div>
                <?php if($this->verified == 2) { ?>
                  <h3><?php echo $this->translate('Verification Settings') ?></h3>
                <?php } else { ?>
                  <h3><?php echo $this->translate('Verification Subscription') ?></h3>
                <?php } ?>
                <?php if(!empty($this->verified) && $this->user->is_verified) { ?>
                  <p class="user_virified_msg">
                    <i class="fas fa-check-circle text-success"></i>
                    <span class="text-success"><?php echo $this->translate('Congratulations, you are a verified member of this site.') ?></span>
                  </p>
                <?php } ?>

                <?php if(!empty($this->verified) && empty($this->user->is_verified)) { ?>
                  <?php if(empty($isSentRequest) && $this->verified == 2) { ?>
                      <p><?php echo $this->translate("At present, your membership on this site is not verified. To initiate the verification process for your profile, please click the 'Request Verification' button below."); ?></p>
                  <?php } else if($this->verified == 4) { ?>
                    <?php if(empty($this->transaction)) { ?>
                      <p><?php echo $this->translate("At present, your membership on this site is not verified. To initiate the verification process for your profile, please make the payment by click on button below."); ?></p>
                    <?php } else if(!empty($this->transaction) && empty($this->user->is_verified)) { ?>
                      <p><?php echo $this->translate("Your user profile verification is currently suspended."); ?></p>
                    <?php } ?>
                  <?php } ?>
                <?php } ?>
                
                <?php if(!empty($this->verified) && $this->verified == 4) { ?>
                  <?php if(!empty($this->price_verified) && empty($this->transaction) && empty($this->user->is_verified)) { ?>
                    <?php $givenSymbol = Engine_Api::_()->getApi('settings', 'core')->getSetting('payment.currency', 'USD'); ?>
                    <div class="form-elements">
                      <p class="_txt">
                        <?php echo $this->translate("Verification Fees: %s", Engine_Api::_()->payment()->getPackageDescription($this->recurrence, $this->price_verified)); ?> 
                      </p>
                      <div id="buttons-wrapper" class="form-wrapper">
                        <?php $currencyData = Engine_Api::_()->getDbTable('currencies', 'payment')->getCurrency(Engine_Api::_()->payment()->getCurrentCurrency()); 
                        $allowedGateways = json_decode($currencyData->gateways);
                        ?>
                        <?php foreach( $this->gateways as $gatewayInfo ):
                          $gateway = $gatewayInfo['gateway'];
                          $plugin = $gatewayInfo['plugin'];
                          $config = (array) $gateway['config'];
                          if($gateway->plugin == 'Payment_Plugin_Gateway_Stripe') continue;
                          $first = ( !isset($first) ? true : false );
                          $gatewayObject = $gateway->getGateway();
                          $supportedCurrencies = $gatewayObject->getSupportedCurrencies();
                          if(!engine_in_array($currentCurrency,$supportedCurrencies))
                          continue;
                          if(engine_count($allowedGateways) == 0 && !engine_in_array($gateway->title , $allowedGateways))         continue;
                          ?>
                          <button type="button" name="execute" onclick="checkGatewayId(<?php echo $gateway->gateway_id ?>);">
                          <?php if(isset($config['icon']) && !empty($config['icon'])) { ?>
                            <?php $path = Engine_Api::_()->core()->getFileUrl($config['icon']); ?>
                            <img src="<?php echo $path; ?>" alt="img">
                          <?php } ?>
                          <?php echo $this->translate('Pay with %1$s', $this->translate($gateway->title)) ?></button>
                          <button id="gatewayButton" type="submit" name="gatewayButton" style="display:none;"></button>
                        <?php endforeach; ?>
                        <input type="hidden" name="gateway_id" id="gateway_id" />
                        <input type="hidden" name="price_verified" id="price_verified" value="<?php echo $this->price_verified; ?>" />
                        <input type="hidden" name="user_id" id="user_id" value="<?php echo $this->subject()->user_id; ?>" />
                      </div>
                    </div>
                    <script type="text/javascript">
                      function checkGatewayId(gatewayId) {
                        scriptJquery('#gateway_id').attr('value', gatewayId);
                        scriptJquery('#gatewayButton').trigger('click');
                      }
                    </script>
                  <?php } ?>
                  
                  <?php if(!empty($this->transaction) && !empty($this->user->is_verified)) { ?>
                    <?php 
                      $order = Engine_Api::_()->getItem('payment_order', $this->transaction->order_id);
                      $subscription = $order->getSource();
                      $subscriptionParams = json_decode($subscription->params);
                      $recurrence = $subscriptionParams->recurrence;
                      $price = $subscriptionParams->price;
                      $desc = Engine_Api::_()->payment()->getPackageDescription($recurrence, $price);
                    ?>
                    <p>
                      <?php echo $this->translate('You are currently paying: %1$s', '<strong>' . $desc . '</strong>') ?>
                    </p>
                    <?php if(!Engine_Api::_()->payment()->isOneTime($recurrence)) { ?>
                      <p style="padding-top: 5px; padding-bottom: 10px;">
                        <?php echo $this->translate('If you would like to cancel your verification subscription, please click on Cancel button below.') ?>
                      </p>
                      <div class="form-elements">
                        <a title="<?php echo $this->translate("Cancel Verification") ?>" href="<?php echo $this->url(array('module'=> 'user','controller' => 'verification', 'action'=>'cancel','transaction_id' => $this->transaction->transaction_id), 'default', true); ?>" class="smoothbox cancel_btn btn btn-primary"><?php echo $this->translate("Cancel"); ?></a>
                      </div>
                    <?php } ?>
                  <?php } ?>
                <?php } ?>
                
                <?php if(!empty($this->verified) && $this->verified == 2 && empty($this->user->is_verified)) { ?>
                  <?php if(!$isSentRequest && empty($this->user->is_verified)) { ?>
                    <div>
                      <a class="smoothbox btn btn-primary" href="<?php echo $this->escape($this->url(array('module'=> 'user', 'controller' => 'verification', 'action' => 'send-verification-request', 'user_id' => $this->user->getIdentity()),'default',true)) ?>"><?php echo $this->translate("Request Verification"); ?></a>
                    </div>
                  <?php } else if(!empty($isSentRequest) && empty($this->user->is_verified)) { ?>
                    <p><?php echo $this->translate("Your verification request is being processed. To cancel the request, click 'Cancel Request' below.") ?></p>
                    <p><a class="smoothbox btn btn-primary" href="<?php echo $this->escape($this->url(array('module'=> 'user', 'controller' => 'verification', 'action' => 'cancel-verification-request', 'user_id' => $this->user->getIdentity(), 'verificationrequest_id' => $isSentRequest),'default',true)) ?>"><?php echo $this->translate("Cancel Request"); ?></a></p>
                  <?php } ?>
                <?php } ?>

              </div>
            </div>
          </form>
        <?php endif; ?>
      </div>
    </div>
  </div>
</div>
