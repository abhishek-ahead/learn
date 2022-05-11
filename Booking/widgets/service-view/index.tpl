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
<?php  if(count($this->servicePaginator)){ ?>
<?php $userSelected = Engine_Api::_()->getItem('user',$item->user_id);?>
<?php if($this->providericon) { ?>
<?php if($userSelected->photo_id):?>
	<a href="<?php echo $userSelected->getHref();?>"><img src="<?php echo Engine_Api::_()->storage()->get($userSelected->photo_id)->getPhotoUrl(); ?>" alt=""></a>
<?php else:?>
	<a href="<?php echo $userSelected->getHref();?>"><img src="application/modules/Booking/externals/images/nophoto_service_thumb_profile.png" alt=""></a>
<?php endif;?>
<?php }?>
<?php if($this->providername) echo $userSelected->displayname; ?>
  <div class="sesapmt_view_service sesbasic_bxs sesbasic_clearfix">
    <div class="sesapmt_view_service_top sesbasic_clearfix">
      <div class="sesapmt_view_service_img">
        <img src="<?php echo Engine_Api::_()->storage()->get($this->servicePaginator->file_id)->getPhotoUrl(); ?>" alt="">
      </div>
      <div class="sesapmt_view_service_info">
        <div class="_name"><?php echo $this->servicePaginator->name ?></div>
        <div class="_price sesbasic_text_light">
          <span class="sesbasic_text_hl"><?php echo Engine_Api::_()->booking()->getCurrencyPrice($this->servicePaginator->price); ?></span> /
          <?php  echo $this->servicePaginator->duration." ".(($this->servicePaginator->timelimit=="h")?"Hour.":"Minutes."); ?>
        </div>
        <?php $viewer = Engine_Api::_()->user()->getViewer(); ?>
        <?php $viewerId = $viewer->getIdentity(); ?>
        <?php $levelId = ($viewerId) ? $viewer->level_id : Engine_Api::_()->getDbtable('levels', 'authorization')->getPublicLevel()->level_id; ?>
        <?php if($levelId!=5) {
          if($this->servicePaginator->user_id!=Engine_Api::_()->user()->getViewer()->getIdentity()){ ?>
            <div class="_btn">  
              <?php $viewer = Engine_Api::_()->user()->getViewer(); if (Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'bookservice')) { if(!empty($this->isProfessionalAvailable)){ ?><a href="<?php echo $this->url(array("action"=>'bookservices','professional'=>$this->servicePaginator->user_id , 'service' => $this->servicePaginator->service_id),'booking_general',true); ?>" class="sesapmt_btn sesbasic_animation"><span><?php echo $this->translate('Book'); ?></span></a><?php } else{ ?> <span class="tip"><span><?php echo $this->translate('This service is currently unavailable.'); ?></span></span> <?php } } ?>
            </div>
          <?php } else { ?>
          <?php $viewer = Engine_Api::_()->user()->getViewer(); 
            if (Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'bookservice')) { ?>
              <div class="_btn"><a href="<?php echo $this->url(array("action"=>'bookservices','professional'=>$this->servicePaginator->user_id , 'service' => $this->servicePaginator->service_id),'booking_general',true); ?>" class="sesapmt_btn sesbasic_animation"><span><?php echo $this->translate('Book'); ?></span></a></div>
          <?php } ?>
          <?php } ?>
        <?php } ?>
      </div>
    </div>
    <div class="sesapmt_view_service_des"> <?php echo $this->servicePaginator->description ?> </div>
  </div>
<?php } else { ?>
	<div class="tip"><span><?php echo $this->translate('No services available'); ?></span></div>
<?php }  ?>
<div class="sesapmt_service_reviews_container sesbasic_bxs">
  <div class="sesapmt_service_reviews_title"><?php echo $this->translate("Reviews");?></div>
    <div class="sesbasic_profile_tabs_top sesbasic_clearfix">
      <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.allow.review', 1) && $this->allowedCreate && $this->viewer->getIdentity()){ if(!$this->isReviewAvailable) { ?>
      <a href="<?php echo $this->url(array("action"=>'service-review','service_id'=>$this->serviceId),'booking_general',true); ?>" class="sesapmt_btn sesbasic_animation smoothbox"><i class="fa fa-plus"></i><span><?php echo $this->translate('Write a Review'); ?></span></a>
      <?php } } ?>
    </div>
  <ul class="sesapmt_review_listing sesbasic_clearfix">
    <?php  if(count($this->reviewsPaginator)){ ?>
    <?php foreach ($this->reviewsPaginator as $item): ?>
    <li class="sesapmt_review_listing_item sesbasic_clearfix">
      <div class="sesapmt_review_listing_item_cont">
      	<div class="sesapmt_review_listing_item_title"><?php echo $item->title; ?></div>
        <div class="sesapmt_review_listing_item_rating sesbasic_rating_star">
          <?php for($i=1;$i<=$item->rating;$i++){  ?>
          	<span id="" class="fas fa-star"></span>
          <?php } for($i=$item->rating;$i<5;$i++){ ?>
          	<span id="" class="far fa-star"></span>
          <?php }  ?>
        </div>
        <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.show.pros', 1)) { ?>
          <div class="sesapmt_review_listing_item_body"><b><?php echo $this->translate("Pros:");?></b>&nbsp;<?php echo $item->pros; ?></div>
        <?php } ?>
        <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.show.cons', 1)) { ?>
          <div class="sesapmt_review_listing_item_body"><b><?php echo $this->translate("Cons:");?></b>&nbsp;<?php echo $item->cons; ?></div>
        <?php } ?>
        <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.review.summary', 1)) { ?>
          <div class="sesapmt_review_listing_item_body"><b><?php echo $this->translate("Description:");?></b>&nbsp;<?php echo $item->description; ?></div>
        <?php } ?>
        <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.show.recommended', 1)) { ?>
        <div class="sesapmt_review_listing_item_body"><b>Recommended:</b>&nbsp;
          <?php if($item->recommended) { ?>
          <i class="fa fa-check"></i>
          <?php } else { ?>
          <i class="fa fa-times"></i>
          <?php } ?>
        </div>
        <?php } ?>
      </div>
      <div class="sesapmt_review_listing_item_footer">
        <div class="sesapmt_review_listing_reviewer_photo">
          <?php $userSelected = Engine_Api::_()->getItem('user',$item->user_id); ?>  
          <?php echo $this->htmlLink($userSelected->getHref(), $this->itemPhoto($userSelected, 'thumb.icon', $userSelected->getTitle())) ?>
        </div>
        <div class="sesapmt_review_listing_item_info">
          <div class="sesapmt_review_listing_reviewer_name"><a href="<?php echo $userSelected->getHref();?>"><?php echo $userSelected->displayname; ?></a></div>
        </div>
        <?php if($this->viewerId==$item->user_id) { ?>
        	<div class="sesapmt_review_listing_options clear sesbasic_animation">
          	<div><a href="<?php echo $this->url(array("action"=>'service-review','review_id'=>$item->review_id,'service_id'=>$item->service_id),'booking_general',true); ?>" class="sesbasic_button smoothbox sesbasic_icon_edit _icon" title="<?php echo $this->translate('Edit');?>"></a></div>
          	<div><a href="<?php echo $this->url(array("action"=>'delete','review_id'=>$item->review_id),'booking_general',true); ?>" class="sesbasic_button smoothbox sesbasic_icon_delete _icon" title="<?php echo $this->translate('Delete');?>"></a></div>
        	</div>
        <?php } else { ?>
          <div class="sesapmt_review_listing_options ">
            <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.show.report', 1) && $this->viewer->getIdentity()): ?>
              <div>
                <a class="sesbasic_button sesbasic_icon_report _icon" title="<?php echo $this->translate('Report');?>" href="<?php echo $this->url(array('route' => 'default', 'module' => 'core', 'controller' => 'report', 'action' => 'create', 'subject' => $item->getGuid(), 'format' => 'smoothbox',),'default',true); ?>" onclick='return opensmoothboxurl(this.href);'></a>
              </div>
            <?php endif; ?>
            <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.allow.share', 1)): ?>
              <div>
                <a class="sesbasic_button sesbasic_icon_share _icon" title="<?php echo $this->translate('Share Review');?>" href="<?php echo $this->url(array('route' => 'default', 'module' => 'activity', 'controller' => 'index', 'action' => 'share', 'type' => $item->getType(), 'id' => $item->getIdentity(), 'format' => 'smoothbox'),'default',true); ?>" onclick='return opensmoothboxurl(this.href);'></a> 
              </div>
            <?php endif; ?>
          </div>
        <?php } ?>
      </div>
    </li>
    <?php endforeach;  ?>
    <?php } else { ?>
    <div class="tip"><span><?php echo $this->translate('No reviews are available yet!'); ?></span></div>
    <?php }  ?>
  </ul>
</div>
