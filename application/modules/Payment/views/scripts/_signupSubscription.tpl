<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    Payment
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: _signupSubscription.tpl 9804 2012-10-27 08:31:56Z pamela $
 * @author     John Boehr <j@webligo.com>
 */
?>
<?php $settings = Engine_Api::_()->getApi('settings', 'core'); ?>
<form method="post" id="signup" name="signup" action="<?php echo $this->escape($this->form->getAction()) ?>" enctype="application/x-www-form-urlencoded">
  <div class="payment_subscription_plans_table <?php echo $settings->getSetting('payment.overlap', 1) ? 'payment_subscription_plans_overlap' : ''; ?>" 
    style="background-color:<?php echo $settings->getSetting('payment.body.container.clr',""); ?>;">
    <?php if($settings->getSetting('payment.table.title','Subscription Plans') || $settings->getSetting('payment.table.description','Please choose a subscription plan from the options below.')) { ?>
      <div class="payment_subscription_plans_table_header" style="background-color:<?php echo $settings->getSetting('payment.header.bgclr',""); ?>;">
        <p class="payment_subscription_plans_table_heading" style="color:<?php echo $settings->getSetting('payment.header.txtclr',""); ?>;"><?php echo $this->translate($settings->getSetting('payment.table.title','Subscription Plans')); ?></p>
        <p class="payment_subscription_plans_table_des" style="color:<?php echo $settings->getSetting('payment.header.txtclr',""); ?>;"><?php echo $this->translate(nl2br($settings->getSetting('payment.table.description','Please choose a subscription plan from the options below.'))); ?></p>
      </div>
    <?php } else { ?>
      <div class="payment_subscription_plans_table_header" style="background-color:<?php echo $settings->getSetting('payment.header.bgclr',""); ?>;">
        <p class="payment_subscription_plans_table_heading" style="color:<?php echo $settings->getSetting('payment.header.txtclr',""); ?>;"><?php echo $this->translate("Subscription Plan"); ?></p>
        <p class="payment_subscription_plans_table_des" style="color:<?php echo $settings->getSetting('payment.header.txtclr',""); ?> ;"><?php echo $this->translate("Please select a subscription plan from the list below."); ?></p>
      </div>
    <?php } ?>
    <div class="payment_subscription_plans_listing">
      <?php foreach($this->form->getPackages() as $package): ?>
        <?php if($this->currentPackage && $package->package_id == $this->currentPackage->package_id ) { continue; } ?>
        <?php $column = json_decode($package->packagestyles); ?>
        <div class="payment_subscription_plans_listing_item<?php if(!empty($column->show_highlight)): ?> heighlighted <?php endif;?>" style="width:<?php echo isset($column->column_width) && is_numeric($column->column_width) ? $column->column_width.'px' : $this->width ?>; <?php if(isset($column->column_margin) && $column->column_margin):?>margin-left:<?php echo $column->column_margin - 4;?>px;margin-right:<?php echo $column->column_margin;?>px;<?php endif;?>">
          <article style="background-color:#<?php echo isset($column->column_row_color) && $column->column_row_color ? $column->column_row_color : '';?>;">
            <div class="payment_subscription_plans_listing_top" style="background-color:#<?php echo isset($column->column_color) && $column->column_color ? $column->column_color : '' ?>;">
              <?php if(!empty($package->photo_id)): ?>
                <?php $path = Engine_Api::_()->core()->getFileUrl($package->photo_id); ?>
                <?php if(!empty($path)) { ?>
                  <div class="payment_subscription_plans_listing_img" style="background-image:url(<?php echo $path; ?>);"></div>
                <?php } ?>
              <?php endif; ?>
              <div class="payment_subscription_plans_listing_title">
                <?php if(!empty($package->title)):?>
                  <span style="color:#<?php echo isset($column->column_text_color) && $column->column_text_color ? $column->column_text_color : ''; ?>"><?php echo $this->translate($package->title); ?></span>
                <?php endif;?>
              </div>
              <div class="payment_subscription_plans_listing_content">
                <p class="price">
                  <?php // Plan is free
                    $typeStr = '';
                    $priceStr =  Engine_Api::_()->payment()->getCurrencyPrice($package->price,'','','');
                    
                    if( $package->price == 0 ) {
                      $typeStr = $this->translate('Free');
                    }
                    // Plan is recurring
                    else if( $package->recurrence > 0 && $package->recurrence_type != 'forever' ) {
                      // Make full string
                      if( $package->recurrence == 1 ) { // (Week|Month|Year)ly
                        if( $package->recurrence_type == 'day' ) {
                          $typeStr = $this->translate('daily');
                        } else {
                          $typeStr = $this->translate($package->recurrence_type . 'ly');
                        }
                      } else { // per x (Week|Month|Year)s
                        $typeStr = $this->translate(array($package->recurrence_type, $package->recurrence_type . 's', $package->recurrence));
                        $typeStr = sprintf($this->translate(' %1$s %2$s'), $package->recurrence, $typeStr); // @todo currency
                      }
                    } 
                    // Plan is one-time
                    else {
                      $typeStr = $this->translate('One-time fee');
                    }
                  ?>
                  <span style="color:#<?php echo $column->column_text_color;?> "><?php echo $priceStr; //sprintf($this->translate('%1$s'), $priceStr); ?></span>
                  <?php if($typeStr): ?><sub style="color:#<?php echo $column->column_text_color;?> ">/&nbsp;<?php echo $typeStr; ?></sub><?php endif;?>
                </p>
                <p class="duration" style="color:#<?php echo $column->column_text_color;?> ">
                  <?php $typeStr = $this->translate(array($package->duration_type, $package->duration_type . 's', $package->duration)); ?>
                  <?php if($package->duration > 0) { ?>
                    <span  style="color:#<?php echo $column->column_text_color;?>"><?php echo sprintf($this->translate('for %1$s %2$s'),$package->duration, $typeStr); ?></span>
                  <?php } else { ?>
                    <span  style="color:#<?php echo $column->column_text_color;?> "><?php echo sprintf($this->translate('%1$s'),$typeStr); ?></span>
                  <?php } ?>
                </p>
                <!-- <p class="duration" style="color:#<?php // echo isset($column->column_text_color) && ($column->column_text_color) ? $column->column_text_color : ''; ?> !important">
                  <?php // $typeStr = $this->translate(array($package->duration_type, $package->duration_type . 's', $package->duration)); ?>
                  <?php // if($package->duration > 0) { ?>
                    <span  style="color:#<?php // echo isset($column->column_text_color) && ($column->column_text_color) ? $column->column_text_color : ''; ?> "><?php // echo sprintf($this->translate('for %1$s %2$s'),$package->duration, $typeStr); ?></span>
                  <?php // } else { ?>
                    <span  style="color:#<?php // echo isset($column->column_text_color) && ($column->column_text_color) ? $column->column_text_color : ''; ?> "><?php // echo sprintf($this->translate('%1$s'),$typeStr); ?></span>
                  <?php // } ?>
                </p> -->
              </div>
            </div>
            <?php if($package->description) { ?>
              <div class="payment_subscription_plans_listing_hint" style="color:#<?php echo isset($column->column_row_text_color) && ($column->column_row_text_color) ? $column->column_row_text_color : ''; ?> ;height:<?php echo isset($column->column_descr_height) && is_numeric($column->column_descr_height) ? $column->column_descr_height : ''; ?>px;border-color:#<?php echo isset($column->row_border_color) && $column->row_border_color ? $column->row_border_color : ''; ?>;">
                <?php echo $this->translate($package->description) ?>
              </div>
            <?php } ?>
            <ul class="payment_subscription_plans_listing_features <?php if(isset($column->icon_position) &&  $column->icon_position): ?> iscenter <?php endif;?>">
              <?php $rowCount = 15; ?> 
              <?php for ($i = 1; $i <= $rowCount; $i++) { ?>
                <?php 
                  $fileIdColumn = 'row'.$i.'_file_id';
                  $descriptionColumn = 'row'.$i.'_description';
                  $textColumn = 'row'.$i.'_text';
                  $features = json_decode($package->features);
                ?>
                <?php if(!empty($features->$textColumn)):?>
                  <li class="payment_custom_scroll" style="height:<?php echo isset($column->row_height) && is_numeric($column->row_height) ? $column->row_height : ''; ?>px;border-color:#<?php echo isset($column->row_border_color) && $column->row_border_color ? $column->row_border_color : ''; ?>;">
                    <?php if(isset($features->$fileIdColumn) && !empty($features->$fileIdColumn)):?>
                      <i class="<?php echo $features->$fileIdColumn; ?> payment_font_icon"></i>
                    <?php endif;?>
                    <?php if(isset($features->$textColumn) && $features->$textColumn):?>
                      <span style="color:#<?php echo isset($column->column_row_text_color) && $column->column_row_text_color ? $column->column_row_text_color : ''; ?> "><?php echo $this->translate($features->$textColumn); ?></span>	
                    <?php endif;?>
                    <?php if(isset($features->$descriptionColumn) && $features->$descriptionColumn):?>
                      <i data-bs-toggle="tooltip" data-bs-placement="top" class="fa fa-question-circle" title="<?php echo $this->translate($features->$descriptionColumn); ?>" style="color:#<?php echo isset($column->column_row_text_color) && $column->column_row_text_color ? $column->column_row_text_color : ''; ?>">
                      </i>
                    <?php endif;?>
                  </li>
                <?php endif; ?>
              <?php } ?>
            </ul>
            <div class="payment_subscription_plans_listing_footer">
              <input type="radio" name="package_id" id="package_id_<?php echo $package->package_id ?>" value="<?php echo $package->package_id ?>" />
              <a href="javascript:;" class="payment_animation" onclick="onFormSubmit(<?php echo $package->package_id ?>)" style="background-color:#<?php echo isset($column->footer_bg_color) && $column->footer_bg_color ? $column->footer_bg_color : ''; ?>;color:#<?php echo isset($column->footer_text_color) && $column->footer_text_color ? $column->footer_text_color : ''; ?>"><?php echo $this->currentSubscription ? $this->translate("Upgrade") : $this->translate("Join Now"); ?></a>
            </div>
            <?php if(isset($column->show_label) && $column->show_label): ?>
              <div class="<?php if(isset($column->label_position) && $column->label_position) : ?>payment_subscription_plans_listing_label right<?php else:?>payment_subscription_plans_listing_label left<?php endif;?>">
                <?php if(isset($column->label_text) && $column->label_text): ?><div style="color:#<?php echo $column->label_text_color;?> ;background-color:#<?php echo isset($column->label_color) && $column->label_color ? $column->label_color : ''; ?>;"><?php echo $this->translate($column->label_text); ?></div><?php endif;?>
              </div>
            <?php endif;?>
          </article>
        </div>
      <?php endforeach;?>
    </div>
  </div>
</form>
<?php if($settings->getSetting('payment.footer.enable',1)) { ?>
  <div class="payment_subscription_plans_listing_note">
    <div class="payment_rich_content">
      <?php echo $this->translate(nl2br($settings->getSetting('payment.footer.note',''))); ?>
    </div>
  </div>
<?php } ?>
<script type="text/javascript">
  function onFormSubmit(id) {
    document.getElementById("package_id_"+id).checked = true;
    scriptJquery("#signup").trigger('submit');
  }
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });
  scriptJquery("#global_wrapper").addClass('signup_subscriptions_plans')
</script>
