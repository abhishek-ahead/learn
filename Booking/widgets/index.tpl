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

<?php
$viewer = Engine_Api::_()->user()->getViewer();
$viewerId = $viewer->getIdentity();
$levelId = ($viewerId) ? $viewer->level_id : Engine_Api::_()->getDbtable('levels', 'authorization')->getPublicLevel()->level_id;
?>
<?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Booking/externals/styles/styles.css'); ?>
<?php if(count($this->professionalPaginator)){ ?>
<div class="sesapmt_expert_profile_information sesbasic_bxs sesbasic_clearfix">
  <div class="sesapmt_expert_profile_information_photo">
    <?php if($this->image){  if(!$this->professionalPaginator->file_id){ $userSelected = Engine_Api::_()->getItem('user',$this->professionalPaginator->user_id); 
    echo $this->itemBackgroundPhoto($userSelected, 'thumb.profile'); 
    } else { ?>
    <span class="bg_item_photo" style="background-image:url(<?php echo Engine_Api::_()->storage()->get($this->professionalPaginator->file_id)->getPhotoUrl(); ?>);"></span>
    <?php } } ?>
  </div>
  <div class="sesapmt_expert_profile_information_detials">
    <div class="sesapmt_expert_profile_information_header sesbasic_clearfix">
      <h2><?php if($this->name) echo $this->professionalPaginator->name ?></h2>
      <div class="sesapmt_expert_profile_information_tagline sesbasic_text_light">
        <?php if($this->designation) echo $this->professionalPaginator->designation ?>
      </div>
    </div>
    <div class="sesapmt_expert_profile_information_stats sesbasic_clearfix">
      <?php if($this->location && !empty($this->professionalPaginator->location)){ ?>
      <span class="sesapmt_expert_profile_information_location">
        <i class="fas fa-map-marker-alt sesbasic_text_light"></i>
        <span><?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('enableglocation', 1)) { ?><a href="<?php echo $this->url(array('resource_id' => $this->professionalPaginator->professional_id,'resource_type'=>'professional','action'=>'get-direction'), 'sesbasic_get_direction', true);?>" class="openSmoothbox"><?php echo $this->professionalPaginator->location ?></a><?php } else { ?><?php echo $this->professionalPaginator->location ?><?php } ?></span>
      </span>
      <?php } ?>
      <?php if($levelId!=5) { ?>
      <span class="sesapmt_expert_profile_information_statics sesbasic_text_light">
        <?php if($this->likecount) { ?><span title="<?php echo $item->like_count; ?> likes"><i class="fa fa-thumbs-up"></i><?php echo $this->professionalPaginator->like_count; ?></span><?php } ?>
        <?php if($this->favouritecount) { ?><span title="<?php echo $item->favourite_count; ?> comments"><i class="fa fa-heart"></i><?php echo $this->professionalPaginator->favourite_count; ?></span><?php } ?>
        <?php if($this->followcount) { ?><span title="<?php echo $item->follow_count; ?> favorite"><i class="fa fa-check"></i><?php echo $this->professionalPaginator->follow_count; ?></span><?php } ?>
      </span>
      <?php } ?>
    </div>
    <div class="sesapmt_expert_profile_information_rating">
      <?php if($this->rating) echo $this->form->render($this); ?>
    </div>  
    <?php if($this->about && !empty($this->professionalPaginator->about)){ ?>
    <div class="sesapmt_expert_profile_information_about sesbasic_clearfix">
      <span class="sesapmt_expert_profile_information_label">About</span>
      <span><?php echo $this->professionalPaginator->description ?></span>
    </div>
    <?php } ?>
    <div class="sesapmt_expert_profile_information_footer sesbasic_clearfix">
      <div class="sesapmt_expert_profile_information_btns floatL">
        <?php if($levelId!=5) { if($this->contact){ ?><a href="<?php echo $this->url(array("action"=>'contact','contact'=>"+".$this->professionalPaginator->country_code."-".$this->professionalPaginator->phone_number),'booking_general',true); ?>" class="sesapmt_btn_alt sesbasic_animation sessmoothbox"><span>Contact</span></a><?php } ?>
        <?php if($this->bookme) { ?><a href="<?php echo $this->url(array("action"=>'bookservices','professional'=>$this->professionalPaginator->user_id),'booking_general',true); ?>" class="sesapmt_btn sesbasic_animation"><span>Book</span></a> <?php } } ?>
      </div>
      
      <div class="sesapmt_expert_profile_information_sociallinks sesbasic_clearfix floatR" id="<?php echo $this->professionalPaginator->professional_id; ?>">
      	<?php if($this->socialSharing) { ?>
          <?php if($this->socialshare_icon_limit): ?>
          <?php  echo $this->partial('_socialShareIcons.tpl','sesbasic',array('resource' => $this->professionalPaginator, 'socialshare_enable_plusicon' => $this->socialshare_enable_plusicon, 'socialshare_icon_limit' => $this->socialshare_icon_limit)); ?>
          <?php else: ?>
          <?php echo $this->partial('_socialShareIcons.tpl','sesbasic',array('resource' => $this->professionalPaginator, 'socialshare_enable_plusicon' => $this->socialshare_enable_gridview2plusicon, 'socialshare_icon_limit' => $this->socialshare_icon_gridview2limit)); ?>
          <?php endif;?>
        <?php } ?>
        
        <?php $userInfo = array('user_id' => $viewerId, 'service_id' => $item->professional_id); ?>
        <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.like', 1)){ if($this->like) { ?>
            <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_like_btn" onclick="prolike(<?php echo $this->professionalPaginator->professional_id; ?>)"><i class="fa fa-thumbs-up"></i><span><?php echo $this->professionalPaginator->like_count; ?></span></a>
        <?php } } ?>
        <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.fav', 1)) { if($this->favourite) { ?>
            <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_fav_btn" onclick="profavourite(<?php echo $this->professionalPaginator->professional_id; ?>)"><i class="fa fa-heart"></i><span><?php echo $this->professionalPaginator->favourite_count; ?></span></a>
        <?php } } ?>    
        <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.follow', 1)){ if($this->follow) { ?>
            <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_follow_btn" onclick="profollow(<?php echo $this->professionalPaginator->professional_id; ?>)"><i class="fa fa-check"></i><span><?php echo $this->professionalPaginator->follow_count; ?></span></a>
        <?php } } ?>
        
        <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.report', 1)){ if($this->report) { ?>
        <a href="<?php echo $this->url(array('module'=>'core', 'controller'=>'report', 'action'=>'create', 'route'=>'default', 'subject'=> $this->professionalPaginator->getGuid(), 'format' => 'smoothbox'),'default',true) ?>" class="smoothbox sesbasic_icon_btn" title="<?php echo $this->translate("Report") ?>"><i class="fa fa-flag"></i></a>
        <?php } } ?>
      </div>

    </div>
  </div>
</div>
<?php } else { ?>
<div class="tip"><span>No professional available</span></div>
<?php } ?>
<script type="text/javascript">
  function saverating(rating){
  var isuser = <?php echo $viewerId ?> ;
  var professionalId =  <?php echo $this->professionalId; ?>;
  if (isuser === 0){
  alert("you need to login first");
    var host = window.location.host;
    var StaticBaseUrl = <?php echo Zend_Registry::get('StaticBaseUrl'); ?> ;
    window.location.replace(StaticBaseUrl + "login");
    return;
  }
  (new Request.HTML({ 
    method: 
      'post',
      'url': en4.core.baseUrl + "widget/index/mod/booking/name/expert-profile",
      'data': {
    format: 'html',
      is_ajax:1,
      rateValue:rating,
      professionalId : professionalId
    },
    onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
      return true;
    }
  })).send();
  }
</script>
<script type="text/javascript">
function prolike(professional_id){
    (new Request.HTML({
      method: 'post',
      'url': en4.core.baseUrl + 'booking/ajax/like',
      'data': {
        format: 'html',
        professional_id: professional_id
    },
    onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
          sesJqueryObject('#'+professional_id).find('.sesbasic_icon_like_btn').find('span').html(responseHTML);
        return true;
        }
      })).send();
}
</script>
<script type="text/javascript">
function profollow(professional_id){
    (new Request.HTML({
      method: 'post',
      'url': en4.core.baseUrl + 'booking/ajax/follow',
      'data': {
        format: 'html',
        professional_id: professional_id
    },
    onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
          sesJqueryObject('#'+professional_id+'').find('.sesbasic_icon_follow_btn').find('span').html(responseHTML);
        return true;
        }
      })).send();
}
</script>
<script type="text/javascript">
function profavourite(professional_id){
    (new Request.HTML({
      method: 'post',
      'url': en4.core.baseUrl + 'booking/ajax/favourite',
      'data': {
        format: 'html',
        professional_id : professional_id
    },
    onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
          sesJqueryObject('#'+professional_id+'').find('.sesbasic_icon_fav_btn').find('span').html(responseHTML);
        return true;
        }
      })).send();
}
</script>
