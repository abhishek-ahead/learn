<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Courses
 * @copyright  Copyright 2014-2019 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: index.tpl 2019-08-28 00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */
 
?>
<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>
<?php $randonNumber = $this->widgetId; ?>
<?php if(!$this->is_ajax){ ?>
<script type="text/javascript">
var previous_rate_value;
  function showReviewForm() {
    document.getElementById('booking_professional_review_create_form').style.display = 'block';
		var openObject = sesJqueryObject('#booking_professional_review_create_form');
				sesJqueryObject('html, body').animate({
					scrollTop: openObject.offset().top
				}, 2000);
				if(typeof review_cover_data_rate_id != 'undefined'){
					previous_rate_value = sesJqueryObject('#rate_value').val();
					window.rate(review_cover_data_rate_id);
				}
  }
</script>
<div class="sesapmt_service_reviews_container" style="border-top-width:0;padding-top:0;">
	<div class="sesapmt_service_reviews_title"><?php echo $this->translate("Reviews");?></div>
  <?php $editReviewPrivacy = true; ?>
  <?php if($this->viewer()->getIdentity() && Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.allow.review', 1) && $this->allowedCreate):?>
    <div class="sesbasic_profile_tabs_top sesbasic_clearfix booking_professional_review_profile_btn">
      <a id="booking_professional_create_button" href="javascript:void(0)" onclick="showReviewForm();" class="sesapmt_btn sesbasic_animation" style="display:<?php if($this->cancreate && !$this->isReview): ?>block;<?php else:?>none;<?php endif;?>"><i class="sesbasic_icon_add"></i><span><?php echo $this->translate('Write a Review');?></span></a>
    </div>
  <?php endif;?>
  <ul class="sesapmt_review_listing sesbasic_clearfix sesbasic_bxs" id="booking_professional_review_listing">
<?php } ?>
  <?php if( $this->paginator->getTotalItemCount() > 0 ){ ?>
    <?php foreach( $this->paginator as $item ): ?>
      <li class="sesapmt_review_listing_item sesbasic_clearfix <?php if($item->owner_id == $this->viewer()->getIdentity()):?>booking_professional_owner_review<?php endif;?>">
      	<div class="sesapmt_review_listing_item_cont">
        	<?php if(in_array('title', $this->stats)): ?>
        		<div class="sesapmt_review_listing_item_title"><?php echo $item->title; ?></div>
          <?php endif; ?>
          <?php if(in_array('rating', $this->stats)): ?>
            <div class="sesapmt_review_listing_item_rating sesbasic_rating_star">
              <?php $ratingCount = $item->rating;?>
              <?php for($i=0; $i<5; $i++){?>
                <?php if($i < $ratingCount):?>
                  <span id="" class="fas fa-star"></span>
                <?php else:?>
                  <span id="" class="far fa-star"></span>
                <?php endif;?>
              <?php }?>
            </div>
          <?php endif ?>
          <?php if(in_array('pros', $this->stats) && Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.show.pros', 1)): ?>
          	<div class="sesapmt_review_listing_item_body">
              <b><?php echo $this->translate("Pros"); ?>:&nbsp;</b>
              <?php echo $this->string()->truncate($this->string()->stripTags($item->pros), 300) ?>
           </div>
          <?php endif; ?>
          <?php if(in_array('cons', $this->stats) && Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.show.cons', 1)): ?>
            <div class="sesapmt_review_listing_item_body">
              <b><?php echo $this->translate("Cons"); ?>:&nbsp;</b>
              <?php echo $this->string()->truncate($this->string()->stripTags($item->cons), 300) ?>
            </div>
          <?php endif; ?>
          <?php if(in_array('description', $this->stats) && $item->description && Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.review.summary', 1)): ?>
            <div class='sesapmt_review_listing_item_body'>
              <b><?php echo $this->translate("Description"); ?>:&nbsp;</b>
              <p><?php echo $this->string()->truncate($this->string()->stripTags($item->description), 300) ?></p>
            </div>
          <?php endif; ?>
           <?php if(in_array('recommended', $this->stats) && Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.show.recommended', 1)): ?>
            <div class="sesapmt_review_listing_item_body">
            	<b><?php echo $this->translate('Recommended');?>:</b>&nbsp;<i class="<?php if($item->recommended):?>fa fa-check<?php else:?>fa fa-times<?php endif;?>"></i>
          	</div>
        	<?php endif; ?>
        </div>
        <div class="sesapmt_review_listing_item_footer">
        	<?php if(in_array('postedBy', $this->stats)): ?>
            <div class="sesapmt_review_listing_reviewer_photo">
            	<?php echo $this->htmlLink($item->getOwner()->getHref(), $this->itemPhoto($item->getOwner(), 'thumb.icon')) ?>
            </div>
          <?php endif; ?>
          <div class="sesapmt_review_listing_item_info">
          	<?php if(in_array('postedBy', $this->stats)): ?>
              <div class="sesapmt_review_listing_reviewer_name">
              	<?php echo $this->htmlLink($item->getOwner()->getHref(), $item->getOwner()->getTitle(), array('class' => 'ses_tooltip', 'data-src' => $item->getOwner()->getGuid())) ?>
              </div>
            <?php endif; ?>
           	<?php if(in_array('creationDate', $this->stats)): ?>
              <div class="sesapmt_review_listing_reviewer_date sesbasic_text_light">
              	<?php echo $this->timestamp(strtotime($item->creation_date)) ?>
              </div>
            <?php endif; ?>
          </div>
        	<div class="sesapmt_review_listing_options clear">
          	<?php echo $this->partial('_reviewOptions.tpl','booking',array('subject'=>$item,'viewer'=>Engine_Api::_()->user()->getViewer(),'stats'=>$this->stats,'profileWidgets'=>false)); ?>
          </div>
        </div>
      </li>
    <?php endforeach; ?>
     <?php if($this->loadOptionData == 'pagging'){ ?>
      <?php echo $this->paginationControl($this->paginator, null, array("_pagging.tpl", "booking"),array('identityWidget'=>$randonNumber)); ?>
    <?php } ?>
  <?php } else{ ?>
    <div class="sesbasic_tip">
        <img src="application/modules/Booking/externals/images/review.png" alt="" />
        <span class="sesbasic_text_light">
          <?php echo $this->translate('No review have been posted yet.');?>
        </span>
    </div>
  <?php } ?>
<?php if(!$this->is_ajax){ ?>
  </ul>
  <?php if($this->loadOptionData != 'pagging' && !$this->is_ajax):?>
  <div class="sesbasic_load_btn" id="view_more_<?php echo $randonNumber;?>" onclick="viewMore_<?php echo $randonNumber; ?>();" ><a href="javascript:void(0);" class="sesbasic_animation booking_professional_link_btn" id="feed_viewmore_link_<?php echo $randonNumber; ?>"><i class="fa fa-redo"></i><span><?php echo $this->translate('View More');?></span></a></div>
  <div class="sesbasic_load_btn sesbasic_view_more_loading_<?php echo $randonNumber;?>" id="loading_image_<?php echo $randonNumber; ?>" style="display: none;"> <span class="booking_professional_link_btn"><i class="fa fa-spinner fa-spin"></i></span></div>
  <?php endif;?>

  <?php if(($this->allowedCreate && $this->cancreate && $this->viewer()->getIdentity() && Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.allow.review', 1)) || ($editReviewPrivacy)): ?>
    <div id="booking_professional_review_create_form" class="sesapmt_review_form sesapmt_expert_review_form" style="display:none;">
      <?php echo $this->form->render($this);?>
      <div class="sesbasic_review_loading_cont_overlay" style="display:none"></div>
    </div>
  <?php endif;?>
</div>
<script type="text/javascript">
  function closeReviewForm() {
    document.getElementById('booking_professional_review_create_form').style.display = 'none';
		var openObject = sesJqueryObject('.booking_professional_review_profile_btn');
				sesJqueryObject('html, body').animate({
					scrollTop: openObject.offset().top
				}, 2000);
				if(sesJqueryObject('#booking_professional_edit_button').length && previous_rate_value != 'undefined'){
					window.rate(previous_rate_value);
				}
  }
</script>
<?php } ?>

<script type="application/javascript">
  <?php if(!$this->is_ajax):?>

	sesJqueryObject(document).on('click','.booking_professional_own_update_review',function(e){
			e.preventDefault();
			showReviewForm();
	});
    <?php if($this->loadOptionData == 'auto_load'){ ?>
    window.addEvent('load', function() {
      sesJqueryObject(window).scroll( function() {
	var containerId = '#booking_professional_review_listing';
        if(typeof sesJqueryObject(containerId).offset() != 'undefined') {
	  var heightOfContentDiv_<?php echo $randonNumber; ?> = sesJqueryObject(containerId).offset().top;
	  var fromtop_<?php echo $randonNumber; ?> = sesJqueryObject(this).scrollTop();
	  if(fromtop_<?php echo $randonNumber; ?> > heightOfContentDiv_<?php echo $randonNumber; ?> - 100 && sesJqueryObject('#view_more_<?php echo $randonNumber; ?>').css('display') == 'block' ){
	    document.getElementById('feed_viewmore_link_<?php echo $randonNumber; ?>').click();
	  }
        }
      });
    });
    <?php } ?>
  <?php endif; ?>
	var page<?php echo $randonNumber; ?> = <?php echo $this->page + 1; ?>;
	var params<?php echo $randonNumber; ?> = '<?php echo json_encode($this->stats); ?>';
	var searchParams<?php echo $randonNumber; ?> = '';
	<?php if($this->loadOptionData != 'pagging') { ?>
	viewMoreHide_<?php echo $randonNumber; ?>();
	function viewMoreHide_<?php echo $randonNumber; ?>() {
			if ($('view_more_<?php echo $randonNumber; ?>'))
			$('view_more_<?php echo $randonNumber; ?>').style.display = "<?php echo ($this->paginator->count() == 0 ? 'none' : ($this->paginator->count() == $this->paginator->getCurrentPageNumber() ? 'none' : '' )) ?>";
		}
	 function viewMore_<?php echo $randonNumber; ?> () {
			sesJqueryObject('#view_more_<?php echo $randonNumber; ?>').hide();
			sesJqueryObject('#loading_image_<?php echo $randonNumber; ?>').show();

			requestViewMore_<?php echo $randonNumber; ?> = new Request.HTML({
				method: 'post',
				'url': en4.core.baseUrl + "widget/index/mod/booking/name/professional-reviews",
				'data': {
		format: 'html',
		page: page<?php echo $randonNumber; ?>,
		params : params<?php echo $randonNumber; ?>,
		is_ajax : 1,
		limit:'<?php echo $this->limit; ?>',
		widgetId : '<?php echo $this->widgetId; ?>',
		searchParams : searchParams<?php echo $randonNumber; ?>,
		course_id:'<?php echo $this->course_id; ?>',
		loadOptionData : '<?php echo $this->loadOptionData ?>'
				},
				onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
				sesJqueryObject('#booking_professional_review_listing').append(responseHTML);
				sesJqueryObject('.sesbasic_view_more_loading_<?php echo $randonNumber;?>').hide();
				sesJqueryObject('#loadingimgbookingreview-wrapper').hide();
				viewMoreHide_<?php echo $randonNumber; ?>();
				}
			});
			requestViewMore_<?php echo $randonNumber; ?>.send();
			return false;
		}
	<?php }else{ ?>
		function paggingNumber<?php echo $randonNumber; ?>(pageNum){
			sesJqueryObject('#sesbasic_loading_cont_overlay_<?php echo $randonNumber?>').css('display','block');
			requestViewMore_<?php echo $randonNumber; ?> = (new Request.HTML({
				method: 'post',
				'url': en4.core.baseUrl + "widget/index/mod/booking/name/professional-reviews",
				'data': {
					format: 'html',
					page: pageNum,
					course_id:'<?php echo $this->course_id; ?>',
					params :params<?php echo $randonNumber; ?> ,
					searchParams : searchParams<?php echo $randonNumber; ?>,
					is_ajax : 1,
					limit:'<?php echo $this->limit; ?>',
					widgetId : '<?php echo $this->widgetId; ?>',
					loadOptionData : '<?php echo $this->loadOptionData ?>'
				},
				onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
					sesJqueryObject('#booking_professional_review_listing').html(responseHTML);
					sesJqueryObject('#sesbasic_loading_cont_overlay_<?php echo $randonNumber?>').css('display', 'none');
					sesJqueryObject('#loadingimgbookingreview-wrapper').hide();
				}
			}));
			requestViewMore_<?php echo $randonNumber; ?>.send();
			return false;
		}
<?php } ?>
  var tabId_pE1 = '<?php echo $this->identity; ?>';
  window.addEvent('domready', function() {
    tabContainerHrefSesbasic(tabId_pE1);
  });
</script>
