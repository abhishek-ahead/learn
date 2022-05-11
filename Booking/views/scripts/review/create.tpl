<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Courses
 * @copyright  Copyright 2014-2019 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: create.tpl 2019-08-28 00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */
 
?>
<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>

  <li class="sesbasic_clearfix booking_professional_reviews">
    <div class="booking_professional_review_listing_top sesbasic_clearfix">
    	<?php if(in_array('title', $this->stats)): ?>
        <div class='booking_professional_review_listing_title sesbasic_clearfix'>
          <?php echo $this->review->title; ?>
        </div>
      <?php endif; ?>  
      <div class="booking_professional_review_listing_top_info sesbasic_clearfix">
        <?php if(in_array('postedBy', $this->stats)): ?>
          <div class='booking_professional_review_listing_top_info_img'>
            <?php echo $this->htmlLink($this->review->getOwner()->getHref(), $this->itemPhoto($this->review->getOwner(), 'thumb.icon')) ?>
          </div>
        <?php endif; ?>
        <div class='booking_professional_review_listing_top_info_cont'>
        	<?php if(in_array('postedBy', $this->stats) || in_array('creationDate', $this->stats)): ?>
            <p class="booking_professional_review_listing_stats sesbasic_text_light">
              <?php if(in_array('postedBy', $this->stats)): ?>
               by <?php echo $this->htmlLink($this->review->getOwner()->getHref(), $this->review->getOwner()->getTitle(), array('class' => 'ses_tooltip', 'data-src' => $this->review->getOwner()->getGuid())) ?>
              <?php endif; ?>
              <?php if(in_array('postedBy', $this->stats) && in_array('creationDate', $this->stats)): ?> | <?php endif; ?>
              <?php if(in_array('creationDate', $this->stats)): ?>
                <?php echo $this->translate('about');?>
                <?php echo $this->timestamp(strtotime($this->review->creation_date)) ?>
              <?php endif; ?>
            </p>
          <?php endif; ?>
          <p class="booking_professional_review_listing_stats sesbasic_text_light">
            <?php if(in_array('likeCount', $this->stats)): ?>
              <span title="<?php echo $this->translate(array('%s like', '%s likes', $this->review->like_count), $this->locale()->toNumber($this->review->like_count)); ?>"><i class="fa fa-thumbs-up"></i><?php echo $this->review->like_count; ?></span>
            <?php endif; ?>
            <?php if(in_array('commentCount', $this->stats)): ?>
              <span title="<?php echo $this->translate(array('%s comment', '%s comments', $this->review->comment_count), $this->locale()->toNumber($this->review->comment_count))?>"><i class="fa fa-comment"></i><?php echo $this->review->comment_count;?></span>
            <?php endif; ?>
            <?php if(in_array('viewCount', $this->stats)): ?>
              <span title="<?php echo $this->translate(array('%s view', '%s views', $this->review->view_count), $this->locale()->toNumber($this->review->view_count))?>"><i class="fa fa-eye"></i><?php echo $this->review->view_count; ?></span>
            <?php endif; ?>
          </p>
        </div>
    </div>
    <div class="booking_professional_review_show_rating review_ratings_listing">
        <?php if(in_array('rating', $this->stats)): ?>
          <div class="sesbasic_rating_star">
            <?php $ratingCount = $this->review->rating;?>
            <?php for($i=0; $i<5; $i++){?>
              <?php if($i < $ratingCount):?>
          <span id="" class="booking_professional_rating_star"></span>
              <?php else:?>
          <span id="" class="booking_professional_rating_star booking_professional_rating_star_disable"></span>
              <?php endif;?>
            <?php }?>
          </div>
        <?php endif ?>
        <?php if(in_array('parameters', $this->stats)){ ?>
          <?php $reviewParameters = Engine_Api::_()->getDbtable('parametervalues', 'booking')->getParameters(array('content_id'=>$this->review->getIdentity(),'user_id'=>$this->review->owner_id)); ?>
          <?php if(count($reviewParameters)>0){ ?>
            <div class="booking_professional_review_show_rating_box sesbasic_clearfix">
              <?php foreach($reviewParameters as $reviewP){ ?>
              <div class="sesbasic_clearfix">
                <div class="booking_professional_review_show_rating_label"><?php echo $reviewP['title']; ?></div>
                <div class="booking_professional_review_show_rating_parameters sesbasic_rating_parameter sesbasic_rating_parameter_small">
                  <?php $ratingCount = $reviewP['rating'];?>
                  <?php for($i=0; $i<5; $i++){?>
                    <?php if($i < $ratingCount):?>
                <span id="" class="sesbasic-rating-parameter-unit"></span>
                    <?php else:?>
                <span id="" class="sesbasic-rating-parameter-unit sesbasic-rating-parameter-unit-disable"></span>
                    <?php endif;?>
                  <?php }?>
                </div>
          			</div>
              <?php } ?>
            </div>
          <?php } 
        }?>
      </div>
    </div>
    <div class="booking_professional_review_listing_desc sesbasic_clearfix">
      <?php if(in_array('pros', $this->stats) && Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.show.pros', 1)): ?>
        <p class="booking_professional_review_listing_body">
          <b><?php echo $this->translate("Pros: "); ?></b>
          <?php echo $this->string()->truncate($this->string()->stripTags($this->review->pros), 300) ?>
        </p>
      <?php endif; ?>
      <?php if(in_array('cons', $this->stats) && Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.show.cons', 1)): ?>
        <p class="booking_professional_review_listing_body">
          <b><?php echo $this->translate("Cons: "); ?></b>
          <?php echo $this->string()->truncate($this->string()->stripTags($this->review->cons), 300) ?>
        </p>
      <?php endif; ?>
      <?php if(in_array('description', $this->stats) && $this->review->description && Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.review.summary', 1)): ?>
        <p class='booking_professional_review_listing_body'>
          <b><?php echo $this->translate("Description: "); ?></b>
          <?php echo $this->string()->truncate($this->string()->stripTags($this->review->description), 300) ?>
        </p>
      <?php endif; ?>
      <?php if(in_array('recommended', $this->stats) && Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.show.recommended', 1)): ?>
        <p class="booking_professional_review_listing_recommended"> <b><?php echo $this->translate('Recommended');?><i class="<?php if($this->review->recommended):?>fa fa-check<?php else:?>fa fa-times<?php endif;?>"></i></b></p>
      <?php endif; ?>
      </div>
      <?php  echo $this->partial('_reviewOptions.tpl','booking',array('subject'=>$this->review,'viewer'=> Engine_Api::_()->user()->getViewer(),'stats'=>$this->stats)); ?>
  </li>
<div class="rating_params">
    <input type="hidden" id="rating_text" value="<?php echo $this->translate(array('%s rating', '%s ratings', $this->rating_count),$this->locale()->toNumber($this->rating_count)) ?>" />
    <input type="hidden" id="total_rating_average" value="<?php echo $this->total_rating_average; ?>" />
  </div>
  <div id="booking_professional_review_create_form" class="" style="display:none;position:relative;">
    <?php echo $this->form->render($this);?>
  </div>
<?php die;?>
