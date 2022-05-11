<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Courses
 * @copyright  Copyright 2014-2019 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: _reviewOptions.tpl 2019-08-28 00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */
 
?>
<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>

<?php
$item = $this->subject; 
$viewer = $this->viewer;
$professional = Engine_Api::_()->getItem('professional',$item->professional_id);
?>
<?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.review.votes', 1)){ ?>
  <div class="_left">
  	<div><b><?php echo $this->translate("Was this Review...?"); ?></b></div>
    <div>
      <?php $isGivenVoteTypeone = Engine_Api::_()->getDbTable('reviewvotes','booking')->isReviewVote(array('profreview_id'=>$item->getIdentity(),'professional_id'=>$professional->getIdentity(),'type'=>1)); ?>
      <a class="sesbasic_button <?php if($viewer->getIdentity()){ ?> sesapmt_review_useful <?php } ?> sesbasic_animation <?php echo $isGivenVoteTypeone ? 'active' : '' ?>" href="javascript:;" data-href="<?php echo $item->getIdentity(); ?>" data-type="1"><i></i><span class="title"><?php echo $this->translate(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.review.first', 'Useful')); ?></span><span class="_count"><?php echo $item->useful_count; ?></span></a>
    </div>
    <div>
      <?php $isGivenVoteTypetwo = Engine_Api::_()->getDbTable('reviewvotes','booking')->isReviewVote(array('profreview_id'=>$item->getIdentity(),'professional_id'=>$professional->getIdentity(),'type'=>2)); ?>
      <a class="sesbasic_button <?php if($viewer->getIdentity()){ ?>sesapmt_review_funny<?php } ?> sesbasic_animation <?php echo $isGivenVoteTypetwo ? 'active' : '' ?>" href="javascript:;" data-href="<?php echo $item->getIdentity(); ?>" data-type="2"><i></i><span class="title"><?php echo $this->translate(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.review.second', 'Funny')); ?></span><span class="_count"><?php echo $item->funny_count ?></span></a>
    </div>
    <div>
      <?php $isGivenVoteTypethree = Engine_Api::_()->getDbTable('reviewvotes','booking')->isReviewVote(array('profreview_id'=>$item->getIdentity(),'professional_id'=>$professional->getIdentity(),'type'=>3)); ?>
      <a class="sesbasic_button <?php if($viewer->getIdentity()){ ?>sesapmt_review_cool<?php } ?> sesbasic_animation <?php echo $isGivenVoteTypethree ? 'active' : '' ?>" href="javascript:;" data-href="<?php echo $item->getIdentity(); ?>" data-type="3"><i></i><span class="title"><?php echo $this->translate(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.review.third', 'Cool')); ?></span><span class="_count"><?php echo $item->cool_count ?></span></a>
    </div>
  </div>
<?php } ?>
<?php $ownerSelf = $viewer->getIdentity() == $item->owner_id ? true : false; ?>
<div class="_right">
  <?php if($ownerSelf) { ?>
  	<div>
    	<a class="fa fa-edit sesbasic_button _icon <?php if($this->profileWidgets) { echo 'sessmoothbox'; } ?> <?php if($ownerSelf) { echo 'booking_professional_own_update_review'; } ?>" href="<?php echo $this->url(array('route' => 'professionalreview_view', 'action' => 'edit-review', 'profreview_id' => $item->profreview_id,'format' => 'smoothbox'),'professionalreview_view',true); ?>" <?php if(!$ownerSelf) { ?> onclick='return opensmoothboxurl(this.href);' <?php  } ?> title="<?php echo $this->translate('Edit Review'); ?>"></a>
    </div>
    <div>
    	<a class="fa fa-trash sesbasic_button _icon" href="<?php echo $this->url(array('route' => 'professionalreview_view', 'action' => 'delete', 'profreview_id' => $item->profreview_id,'format' => 'smoothbox'),'professionalreview_view',true); ?>" onclick='return opensmoothboxurl(this.href);' title="<?php echo $this->translate('Delete Review'); ?>"></a>
  	</div>
  <?php } ?>
  <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.show.report', 1) && $viewer->getIdentity() && in_array('report', $this->stats) && !$ownerSelf): ?>
  	<div>
  		<a class="fa fa-flag sesbasic_button _icon" href="<?php echo $this->url(array('route' => 'default', 'module' => 'core', 'controller' => 'report', 'action' => 'create', 'subject' => $item->getGuid(), 'format' => 'smoothbox',),'default',true); ?>" onclick='return opensmoothboxurl(this.href);' title="<?php echo $this->translate('Report');?>"></a>
  	</div>
  <?php endif; ?>
  <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.allow.share', 1) && $viewer->getIdentity() && in_array('share', $this->stats) && !$ownerSelf): ?>
  	<div>
    	<a class="fa fa-share sesbasic_button _icon" href="<?php echo $this->url(array('route' => 'default', 'module' => 'activity', 'controller' => 'index', 'action' => 'share', 'type' => $item->getType(), 'id' => $item->getIdentity(), 'format' => 'smoothbox'),'default',true); ?>" onclick='return opensmoothboxurl(this.href);' title="<?php echo $this->translate('Share Review');?>"></a>
  	</div>
  <?php endif; ?>
</div>

