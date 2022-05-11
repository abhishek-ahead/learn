<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: _getallprofessional.tpl  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
 
 ?>
<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>

<?php  
$viewer = Engine_Api::_()->user()->getViewer();
$viewerId = $viewer->getIdentity();
$levelId = ($viewerId) ? $viewer->level_id : Engine_Api::_()->getDbtable('levels', 'authorization')->getPublicLevel()->level_id;
if(isset($this->identityForWidget) && !empty($this->identityForWidget)):?>
  <?php $randonNumber = 1 ?>
<?php else:?>
  <?php $randonNumber = 1?> 
<?php endif;?>
<?php if(!$this->is_ajax){ ?>
  <div class="sesbasic_clearfix sesapmt_browse_header" style="display:none;">
    <div class="sesbasic_view_type_options sesbasic_view_type_options_<?php echo $randonNumber;?>">
      <?php if(is_array($this->optionsEnable) && in_array('list',$this->optionsEnable)){ ?>
        <a title="List View" class="listicon list_selectView_<?php echo $randonNumber;?> <?php if($this->view_type == 'list') { echo 'active'; } ?>" rel="list" href="javascript:showData_<?php echo $randonNumber; ?>('list');"></a>
      <?php } ?>
      <?php if(is_array($this->optionsEnable) && in_array('grid',$this->optionsEnable)){ ?>
        <a title="Grid View" class="gridicon grid_selectView_<?php echo $randonNumber;?> <?php if($this->view_type == 'grid') { echo 'active'; } ?>" rel="grid" href="javascript:showData_<?php echo $randonNumber; ?>('grid');"></a>
      <?php } ?>
      <?php if(is_array($this->optionsEnable) && in_array('portfolio',$this->optionsEnable)){ ?>
        <a title="Portfolio view" class="a-gridicon portfolio_selectView_<?php echo $randonNumber;?> <?php if($this->view_type == 'portfolio') { echo 'active'; } ?>" rel="portfolio" href="javascript:showData_<?php echo $randonNumber; ?>('portfolio');"></a>
      <?php } ?>
    </div>
  </div>
<?php } ?>
<?php $view_type=$this->view_type; ?>
<?php if(($this->view_type=="grid" && !empty($this->isProfessional)) || (!$this->is_ajax)){ ?>
	<div class="sesapmt_professionals_listing sesbasic_bxs sesbasic_clearfix" id="professional_grid_view_<?php echo $randonNumber;?>">
    <div class="sesapmt_professionals_grid_listings sesbasic_clearfix">
      <?php if(count($this->paginator)){ ?>
      <?php foreach ($this->paginator as $item): ?>   
      <?php 
        $professionalratingsTable= Engine_Api::_()->getDbTable('professionalratings', 'booking');
        $select = $professionalratingsTable->select();
        $select->from($professionalratingsTable->info('name'), array('rating'))->where('professional_id =?',$item->professional_id);
        $avgRating=$professionalratingsTable->avgRating(array("professional_id"=>$item->professional_id));
        $rating =(int)(($avgRating["rating"]) ? $avgRating["rating"] : "0.0" );
        $userInfo = array('user_id' => $viewerId, 'professional_id' => $item->professional_id);
        //get likes from servicelikes table
        $isUserLike = Engine_Api::_()->getDbTable('likes', 'booking')->isUserLike($userInfo);
        $isUserFavourite = Engine_Api::_()->getDbTable('favourites', 'booking')->isUserFavourite($userInfo);
        $isUserFollow = Engine_Api::_()->getDbTable('follows', 'booking')->isUserFollow($userInfo);
      ?>
        <div class="sesapmt_professionals_grid">
          <article class="sesbasic_clearfix sesbasic_animation">
            <a href="<?php echo $item->getHref(); ?>" class="sesapmt_professionals_grid_hover_link"></a>
            <div class="_header">
              <div class="_thumb">
              <?php if($this->image) { if(!$item->file_id): ?>
                <?php  $userSelected = Engine_Api::_()->getItem('user',$item->user_id); 
                  echo $this->htmlLink($item->getHref(), $this->itemPhoto($userSelected, 'thumb.icon', $userSelected->getTitle())); ?>
                <?php else: ?>
                  <a href="<?php echo $item->getHref();  ?>" ><img src="<?php echo Engine_Api::_()->storage()->get($item->file_id, '')->getPhotoUrl('thumb.icon');?>" alt="" /></a>
                <?php endif; } ?>
              </div>
              <div class="_info">
                <?php if($this->name) { ?>
                  <div class="_name">
                    <a href="<?php echo $item->getHref();  ?>"><?php echo $item->name; ?></a>
                  </div>
                <?php } ?>
                <?php if($this->designation) { ?>
                  <div class="_tagline sesbasic_text_light" title="<?php echo $item->designation; ?>">
                    <?php echo $item->designation; ?>
                  </div>
                <?php } ?>
              </div>
            </div>
            <div class="_des">
            	<?php if($this->description) if(strlen($item->description)>$this->description) echo mb_substr($item->description,0,($this->description_truncation)).'...'; else echo $item->description; ?>
            </div>
            <div class="sesapmt_professionals_grid_item_stats">
              <p class="_stats sesbasic_text_light">
                <?php if($this->likecount) { ?><span title="<?php echo $item->like_count; ?> likes"><i class="fa fa-thumbs-up"></i><?php echo $item->like_count; ?></span><?php } ?>
                <?php if($this->favouritecount) { ?><span title="<?php echo $item->favourite_count; ?> comments"><i class="fa fa-heart"></i><?php echo $item->favourite_count; ?></span><?php } ?>
                <?php if($this->followcount) { ?><span title="<?php echo $item->follow_count; ?> favorite"><i class="fa fa-check"></i><?php echo $item->follow_count; ?></span><?php } ?>
            	</p>
              
              <?php if($this->rating) { ?>
                <p class="_rating">
                  <?php  include APPLICATION_PATH .  '/application/modules/Booking/views/scripts/rating.tpl';?>
                </p>
              <?php }  ?>
            </div>
            <?php if($this->location && $item->location) { ?>
            <div class="sesapmt_professionals_grid_item_stats">
            	<p class="_stats sesbasic_text_light">
           			<span class="sesapmt_professionals_grid_location"><i class="fas fa-map-marker-alt"></i><span><?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('enableglocation', 1)) { ?><a href="<?php echo $this->url(array('resource_id' => $item->professional_id,'resource_type'=>'professional','action'=>'get-direction'), 'sesbasic_get_direction', true);?>" class="openSmoothbox"><?php echo $item->location ?></a><?php } else { ?><?php echo $item->location ?><?php } ?></span></span>
            	</p>
            	</div>
            <?php } ?>
            
            <div class="sesapmt_professionals_grid_btns">
              <div class="sesapmt_professionals_grid_likebtns" id="<?php echo $item->professional_id; ?>">
              <?php if($levelId!=5) { ?>
                <?php  if($this->socialSharing && Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.allow.share', 1) == 2 && Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.allow.share', 1) != 0) { if($this->socialshare_icon_limit): ?>
                  <?php  echo $this->partial('_socialShareIcons.tpl','sesbasic',array('resource' => $item, 'socialshare_enable_plusicon' => $this->socialshare_enable_plusicon, 'socialshare_icon_limit' => $this->socialshare_icon_limit)); ?>
                <?php else: ?>
                  <?php  echo $this->partial('_socialShareIcons.tpl','sesbasic',array('resource' => $item, 'socialshare_enable_plusicon' => $this->socialshare_enable_gridview2plusicon, 'socialshare_icon_limit' => $this->socialshare_icon_gridview2limit)); ?>
                <?php endif; } ?>
                <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.like', 1)){ if($this->like) { ?>
                    <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_like_btn <?php if($isUserLike) echo "button_active";  ?>" onclick="like(<?php echo $item->professional_id; ?>)" title='<?php echo $this->translate("Like"); ?>'><i class="fa fa-thumbs-up"></i><span><?php echo $item->like_count; ?></span></a>
                <?php } } ?>
                <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.fav', 1)) { if($this->favourite) { ?>
                    <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_fav_btn <?php if($isUserFavourite) echo "button_active";  ?>" onclick="favourite(<?php echo $item->professional_id; ?>)" title='<?php echo $this->translate("Favourite"); ?>'><i class="fa fa-heart"></i><span><?php echo $item->favourite_count; ?></span></a>
                <?php } } ?>    
                <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.follow', 1) && $item->user_id!=Engine_Api::_()->user()->getViewer()->getIdentity()){ if($this->follow) { ?>
                    <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_follow_btn <?php if($isUserFollow) echo "button_active";  ?>" onclick="follow(<?php echo $item->professional_id; ?>)" title='<?php echo $this->translate("Follow"); ?>'><i class="fa fa-check"></i><span><?php echo $item->follow_count; ?></span></a>
                <?php } } ?>
                <?php if((Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.allow.share', 1) == 1 || Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.allow.share', 1) == 2 ) && Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.allow.share', 1) != 0) { ?>
                  <a href="javascript:void(0)" class="sesbasic_icon_btn" onClick="openSmoothBoxInUrl('<?php echo $this->url(array('module'=> 'sesbasic', 'controller' =>'index','action' => 'share','type' => 'professional','id' => $item->professional_id,'format' => 'smoothbox'),'default',true); ?>');return false;" title='<?php echo $this->translate("Share on Site"); ?>'><i class="fa fa-share-alt"></i></a>
                <?php }  ?>
              <?php } ?>
              </div>

              <div class="sesapmt_professionals_grid_buttons">
                <?php if($this->viewprofile) { ?><a href="<?php echo $item->getHref();  ?>" class="sesapmt_btn_alt sesbasic_animation"><span><?php echo $this->translate('View Profile');?></span></a><?php } ?>
                <?php if($this->bookbutton && $levelId!=5) { if($item->user_id!=Engine_Api::_()->user()->getViewer()->getIdentity()){ ?>
                    <?php $viewer = Engine_Api::_()->user()->getViewer(); if (Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'bookservice')) { ?><a href="<?php echo $this->url(array("action"=>'bookservices','professional'=>$item->user_id),'booking_general',true); ?>" class="sesapmt_btn sesbasic_animation"><span><?php echo $this->translate('Book');?></span></a><?php } ?>
                <?php } else { ?>
                <?php $viewer = Engine_Api::_()->user()->getViewer(); if (Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'bookservice')) { ?>
                    <a href="<?php echo $this->url(array("action"=>'bookservices','professional'=>$item->user_id),'booking_general',true); ?>" class="sesapmt_btn sesbasic_animation"><span><?php echo $this->translate('Book');?></span></a>
                <?php } ?>
              <?php } } ?>
              </div>
            </div>  
          </article>
        </div>
    	<?php endforeach; ?>
    <?php } else { ?>
      <div class="tip"><span><?php echo $this->translate('There are currently no professionals.');?></span></div>
    <?php } ?>
	</div>
	</div>
<?php } ?>
<?php if($view_type=="list" || (!$this->is_ajax)){ ?>
	<div class="sesapmt_professionals_listing sesbasic_bxs sesbasic_clearfix" id="professional_list_view_<?php echo $randonNumber;?>">
    <div class="sesapmt_professionals_list_listings sesbasic_clearfix">
    	<?php if(count($this->paginator)){ ?>
        <?php foreach ($this->paginator as $item): ?>  
        <?php 
        $professionalratingsTable= Engine_Api::_()->getDbTable('professionalratings', 'booking');
        $select = $professionalratingsTable->select();
        $select->from($professionalratingsTable->info('name'), array('rating'))->where('professional_id =?',$item->professional_id);
        $avgRating=$professionalratingsTable->avgRating(array("professional_id"=>$item->professional_id));
        $rating =(int)(($avgRating["rating"]) ? $avgRating["rating"] : "0.0" );
        ?>
        <div class="sesapmt_professionals_list_item sesbasic_clearfix">
        <article class="sesbasic_clearfix">
      	<div class="sesapmt_professionals_list_item_thumb">
            <?php if($this->image) { if(!$item->file_id): ?>
                <?php  $userSelected = Engine_Api::_()->getItem('user',$item->user_id); 
                    echo $this->htmlLink($item->getHref(), $this->itemBackgroundPhoto($userSelected, 'thumb.profile', $userSelected->getTitle())); ?>
                <?php else: ?>
                <a href="<?php echo $item->getHref();  ?>" ><span class="bg_item_photo" style="background-image:url(<?php echo Engine_Api::_()->storage()->get($item->file_id, '')->getPhotoUrl('thumb.profile');?>);"></span></a>
            <?php endif; } ?>
        </div>
        <div class="sesapmt_professionals_list_item_details">
            <?php if($this->name) { ?><p class="sesapmt_professionals_list_item_name"><a href="<?php echo $item->getHref();  ?>" target="_blank"><?php echo $item->name; ?></a></p><?php } ?>
            <p class="sesapmt_professionals_list_item_tagline sesbasic_text_light" title="<?php echo $item->designation; ?>"><?php echo $item->designation; ?></p>
            <p class="sesapmt_professionals_list_item_stats sesbasic_clearfix sesbasic_text_light">
          		<span class="sesapmt_professionals_list_item_location">
              	<i class="fas fa-map-marker-alt"></i><span><?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('enableglocation', 1)) { ?><a href="<?php echo $this->url(array('resource_id' => $item->professional_id,'resource_type'=>'professional','action'=>'get-direction'), 'sesbasic_get_direction', true);?>" class="openSmoothbox"><?php echo $item->location ?></a><?php } else { ?><?php echo $item->location ?><?php } ?></span>
              </span>
                <span class="sesapmt_professionals_list_item_statics">
                    <span title="<?php echo $item->like_count; ?> likes"><i class="fa fa-thumbs-up"></i><?php echo $item->like_count; ?></span>
                    <span title="<?php echo $item->favourite_count; ?> comments"><i class="fa fa-comment"></i><?php echo $item->favourite_count; ?></span>
                    <span title="<?php echo $item->follow_count; ?> favorite"><i class="fa fa-heart"></i><?php echo $item->follow_count; ?></span>
            	</span>
          		<span class="sesapmt_professionals_list_item_rating">
                <?php for($i=1;$i<=$rating;$i++){  ?> <span id="" class="rating_star_generic rating_star"></span> <?php } for($i=$rating;$i<5;$i++){ ?> <span id="" class="fa fa fa-star-o star-disable"></span> <?php }  ?>
            	</span>
            </p>
            <p class="sesapmt_professionals_list_item_des"><?php echo $item->description; ?></p>

            <div class="sesapmt_professionals_list_item_btns sesbasic_clearfix">
            	<div class="sesapmt_professionals_list_likebtns floatL" id="<?php echo $item->professional_id; ?>">
                <?php  if($this->socialSharing) { if($this->socialshare_icon_limit): ?>
                  <?php  echo $this->partial('_socialShareIcons.tpl','sesbasic',array('resource' => $item, 'socialshare_enable_plusicon' => $this->socialshare_enable_plusicon, 'socialshare_icon_limit' => $this->socialshare_icon_limit)); ?>
                <?php else: ?>
                  <?php  echo $this->partial('_socialShareIcons.tpl','sesbasic',array('resource' => $item, 'socialshare_enable_plusicon' => $this->socialshare_enable_gridview2plusicon, 'socialshare_icon_limit' => $this->socialshare_icon_gridview2limit)); ?>
                <?php endif; } ?>
                <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.like', 1)){ ?>
                <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_like_btn" onclick="like(<?php echo $item->professional_id; ?>)"><i class="fa fa-thumbs-up"></i><span><?php echo $item->like_count; ?></span></a>
                <?php } ?>
                <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.fav', 1)){ ?>
                    <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_fav_btn" onclick="favourite(<?php echo $item->professional_id; ?>)"><i class="fa fa-heart"></i><span><?php echo $item->favourite_count; ?></span></a>
                <?php } ?>    
                <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.follow', 1)){ ?>
                    <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_follow_btn" onclick="follow(<?php echo $item->professional_id; ?>)"><i class="fa fa-check"></i><span><?php echo $item->follow_count; ?></span></a>
                <?php } ?>
                <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.report', 1)){ ?>
                    <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_report_btn"><i class="fa fa-flag"></i><span>0</span></a>
                <?php } ?>
            	</div>
                <div class="sesapmt_professionals_list_item_btn floatR">
                    <a href="<?php echo $item->getHref();  ?>" target="_blank" class="sesapmt_btn_alt sesbasic_animation"><span><?php echo $this->translate('View Profile');?></span></a>
                <?php if($item->user_id!=Engine_Api::_()->user()->getViewer()->getIdentity()){ ?>
                    <a href="<?php echo $this->url(array("action"=>'compose','professional'=>$item->name,'id'=>$item->user_id),'booking_general',true); ?>" class="sesapmt_btn_alt sesbasic_animation openSmoothbox"><span><?php echo $this->translate('Message');?></span></a>
                    <a href="<?php echo $this->url(array("action"=>'bookservices','professional'=>$item->user_id),'booking_general',true); ?>" class="sesapmt_btn sesbasic_animation"><span><?php echo $this->translate('Book');?></span></a>
                <?php } ?>
                </div>
            </div>
        </div>
        </article>
         </div>
        <?php endforeach; ?>
      <?php } else { ?>
      	<div class="tip"><span><?php echo $this->translate('There are currently no professionals.');?></span></div>
    	<?php } ?>
  	</div>
	</div>  
<?php } ?>

<!--Portfolio View Start-->
<?php if($view_type=="portfolio" || (!$this->is_ajax) ){ ?>
<div class="sesapmt_professionals_listing sesbasic_bxs sesbasic_clearfix" id="professional_portfolio_view_<?php echo $randonNumber;?>">
	<div class="sesapmt_professionals_portfolio_listings sesbasic_clearfix">
        <?php if(count($this->paginator)){ ?>
        <?php foreach ($this->paginator as $item): ?>
        <?php 
        $professionalratingsTable= Engine_Api::_()->getDbTable('professionalratings', 'booking');
        $select = $professionalratingsTable->select();
        $select->from($professionalratingsTable->info('name'), array('rating'))->where('professional_id =?',$item->professional_id);
        $avgRating=$professionalratingsTable->avgRating(array("professional_id"=>$item->professional_id));
        $rating =(int)(($avgRating["rating"]) ? $avgRating["rating"] : "0.0" );
        ?>
        <div class="sesapmt_professionals_portfolio_item">
            <article>
            <div class="sesapmt_professionals_portfolio_item_thumbs sesbasic_clearfix">
                <a href=""><span class="bg_item_photo" style="background-image:url(https://cdn.dribbble.com/users/13307/screenshots/3674788/arden_ios_game_1x.jpg);"></span></a>
                <a href=""><span class="bg_item_photo" style="background-image:url(https://cdn.dribbble.com/users/13307/screenshots/3674788/arden_ios_game_1x.jpg);"></span></a>
                <a href=""><span class="bg_item_photo" style="background-image:url(https://cdn.dribbble.com/users/13307/screenshots/3537215/logic_puzzle_game_ios_1x.jpg);"></span></a>
                <a href=""><span class="bg_item_photo" style="background-image:url(https://cdn.dribbble.com/users/13307/screenshots/3504491/ashbry_music_festival_1x.jpg);"></span></a>
                <a href=""><span class="bg_item_photo" style="background-image:url(https://cdn.dribbble.com/users/13307/screenshots/3332965/web_site_design_1x.jpg);"></span></a>
                <a href=""><span class="bg_item_photo" style="background-image:url(https://cdn.dribbble.com/users/13307/screenshots/3332965/web_site_design_1x.jpg);"></span></a>
            </div>
                <div class="sesapmt_professionals_portfolio_item_info sesbasic_clearfix">
                    <div class="sesapmt_professionals_portfolio_item_photo">
                    <?php if(!$item->file_id): ?>
                        <?php  $userSelected = Engine_Api::_()->getItem('user',$item->user_id); 
                            echo $this->htmlLink($item->getHref(), $this->itemPhoto($userSelected, 'thumb.profile', $userSelected->getTitle())); ?>
                        <?php else: ?>
                            <a href="<?php echo $item->getHref();  ?>"><img src="<?php echo Engine_Api::_()->storage()->get($item->file_id, '')->getPhotoUrl('thumb.normal');?>"/></a>
                    <?php endif; ?>
                  </div>
                    <div class="sesapmt_professionals_portfolio_item_details">
                    <p class="sesapmt_professionals_portfolio_item_name"><a href="<?php echo $item->getHref();  ?>" ><?php echo $item->name; ?></a></p>
                    <p class="sesapmt_professionals_portfolio_item_tagline sesbasic_text_light" title="<?php echo $item->designation; ?>"><?php echo $item->designation; ?></p>
                    <p class="sesapmt_professionals_portfolio_item_stats sesbasic_clearfix">
                      <span class="sesapmt_professionals_portfolio_item_rating">
                        <?php for($i=1;$i<=$rating;$i++){  ?> <span id="" class="rating_star_generic rating_star"></span> <?php } for($i=$rating;$i<5;$i++){ ?> <span id="" class="fa fa fa-star-o star-disable"></span> <?php }  ?>
                      </span>
                      <span class="sesapmt_professionals_portfolio_item_location"><i class="fas fa-map-marker-alt"></i><span><?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('enableglocation', 1)) { ?><a href="<?php echo $this->url(array('resource_id' => $item->professional_id,'resource_type'=>'professional','action'=>'get-direction'), 'sesbasic_get_direction', true);?>" class="openSmoothbox"><?php echo $item->location ?></a><?php } else { ?><?php echo $item->location ?><?php } ?></span></span>
                    </p>
                    <div class="sesapmt_professionals_likebtns">
                    <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.like', 1)){ ?>
                        <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_like_btn"><i class="fa fa-thumbs-up"></i><span>0</span></a>
                    <?php } ?>
                    <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.fav', 1)){ ?>
                        <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_fav_btn"><i class="fa fa-heart"></i><span>0</span></a>
                    <?php } ?>    
                    <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.follow', 1)){ ?>
                        <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_follow_btn"><i class="fa fa-check"></i><span>0</span></a>
                    <?php } ?>
                    <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.report', 1)){ ?>
                        <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_report_btn"><i class="fa fa-flag"></i><span>0</span></a>
                    <?php } ?>
                  </div>
                    <div class="sesevent_cat_event_list_stats sesevent_list_stats sesbasic_text_light">
                        <span title="<?php echo $item->like_count; ?> likes"><i class="fa fa-thumbs-up"></i><?php echo $item->like_count; ?></span>
                        <span title="<?php echo $item->favourite_count; ?> comments"><i class="fa fa-comment"></i><?php echo $item->favourite_count; ?></span>
                        <span title="<?php echo $item->follow_count; ?> favorite"><i class="fa fa-heart"></i><?php echo $item->follow_count; ?></span>
                    </div>
                    <p class="sesapmt_professionals_portfolio_item_btns">
                        <a href="<?php echo $item->getHref();  ?>" class="sesapmt_btn_alt sesbasic_animation"><span><?php echo $this->translate('View Profile');?></span></a>
                    <?php if($item->user_id!=Engine_Api::_()->user()->getViewer()->getIdentity()){ ?>
                        <a href="<?php echo $this->url(array("action"=>'compose','professional'=>$item->name,'id'=>$item->user_id),'booking_general',true); ?>" class="sesapmt_btn_alt sesbasic_animation openSmoothbox"><span><?php echo $this->translate('Message');?></span></a>
                        <a href="<?php echo $this->url(array("action"=>'bookservices','professional'=>$item->user_id),'booking_general',true); ?>" class="sesapmt_btn sesbasic_animation"><span><?php echo $this->translate('Book');?></span></a>
                    <?php } ?>
                    </p>
                  </div>
                </div>
            </article>
        </div>
        <?php endforeach; ?>
        <?php } else { ?>
          <div class="tip"><span><?php echo $this->translate('There are currently no professionals.');?></span></div>
        <?php } ?>
  </div>
</div>  
<?php } ?>
<?php if (empty($this->is_ajax)) : ?>
  <div id="temporary-data-<?php echo $randonNumber?>" style="display:none"></div>
<?php endif;?>
<script type="text/javascript">
  function like(professional_id){
    (new Request.HTML({
      method: 'post',
      'url': en4.core.baseUrl + 'booking/ajax/like',
      'data': {
        format: 'html',
        professional_id : professional_id
      },
      onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
        sesJqueryObject('#'+professional_id+'').find('.sesbasic_icon_like_btn').find('span').html(responseHTML);
        if(sesJqueryObject('#'+professional_id+'').find('.sesbasic_icon_like_btn').hasClass("button_active"))
          sesJqueryObject('#'+professional_id+'').find('.sesbasic_icon_like_btn').removeClass("button_active");
        else
          sesJqueryObject('#'+professional_id+'').find('.sesbasic_icon_like_btn').addClass("button_active");
        return true;
      }
    })).send();
  }
</script>
<script type="text/javascript">
  function follow(professional_id){
    (new Request.HTML({
      method: 'post',
      'url': en4.core.baseUrl + 'booking/ajax/follow',
      'data': {
        format: 'html',
        professional_id : professional_id
      },
      onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
        sesJqueryObject('#'+professional_id+'').find('.sesbasic_icon_follow_btn').find('span').html(responseHTML);
        if(sesJqueryObject('#'+professional_id+'').find('.sesbasic_icon_follow_btn').hasClass("button_active"))
          sesJqueryObject('#'+professional_id+'').find('.sesbasic_icon_follow_btn').removeClass("button_active");
        else
          sesJqueryObject('#'+professional_id+'').find('.sesbasic_icon_follow_btn').addClass("button_active");
        return true;
      }
    })).send();
  }
</script>
<script type="text/javascript">
  function favourite(professional_id){
    (new Request.HTML({
      method: 'post',
      'url': en4.core.baseUrl + 'booking/ajax/favourite',
      'data': {
        format: 'html',
        professional_id : professional_id
      },
      onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
        sesJqueryObject('#'+professional_id+'').find('.sesbasic_icon_fav_btn').find('span').html(responseHTML);
        if(sesJqueryObject('#'+professional_id+'').find('.sesbasic_icon_fav_btn').hasClass("button_active"))
          sesJqueryObject('#'+professional_id+'').find('.sesbasic_icon_fav_btn').removeClass("button_active");
        else
          sesJqueryObject('#'+professional_id+'').find('.sesbasic_icon_fav_btn').addClass("button_active");
        return true;
      }
    })).send();
  }
</script>
<script type="text/javascript">
    sesJqueryObject('#professional_grid_view_<?php echo $randonNumber;?>').hide();
    sesJqueryObject('#professional_list_view_<?php echo $randonNumber;?>').hide();
    sesJqueryObject('#professional_portfolio_view_<?php echo $randonNumber;?>').hide();
    <?php 
        if($view_type="list"){
            echo "sesJqueryObject('#professional_grid_view_".$randonNumber."').show();";
        }
        else if($view_type="grid"){
            echo "sesJqueryObject('#professional_list_view_".$randonNumber."').show();";
        }
        else if($view_type="portfolio"){
            echo "sesJqueryObject('#professional_portfolio_view_".$randonNumber."').show();";
        }
    ?>
    function showData_<?php echo $randonNumber; ?>(type) {
      activeType_<?php echo $randonNumber ?> = '';
      if(type == 'grid') {
        sesJqueryObject('#professional_grid_view_<?php echo $randonNumber;?>').show();
        sesJqueryObject('#professional_list_view_<?php echo $randonNumber;?>').hide();
        sesJqueryObject('#professional_portfolio_view_<?php echo $randonNumber;?>').hide();
        sesJqueryObject('.list_selectView_<?php echo $randonNumber; ?>').removeClass('active');
        sesJqueryObject('.portfolio_selectView_<?php echo $randonNumber; ?>').removeClass('active');
        sesJqueryObject('.grid_selectView_<?php echo $randonNumber; ?>').addClass('active');
        activeType_<?php echo $randonNumber ?> = 'grid';
      }else if(type == 'list') {
        sesJqueryObject('#professional_grid_view_<?php echo $randonNumber;?>').hide();
        sesJqueryObject('#professional_list_view_<?php echo $randonNumber;?>').show();
        sesJqueryObject('#professional_portfolio_view_<?php echo $randonNumber;?>').hide()
        sesJqueryObject('.list_selectView_<?php echo $randonNumber; ?>').addClass('active');
        sesJqueryObject('.portfolio_selectView_<?php echo $randonNumber; ?>').removeClass('active');
        sesJqueryObject('.grid_selectView_<?php echo $randonNumber; ?>').removeClass('active');
        activeType_<?php echo $randonNumber ?> = 'list';
      }else if(type == 'portfolio') {
        sesJqueryObject('#professional_portfolio_view_<?php echo $randonNumber;?>').show();
        sesJqueryObject('#professional_grid_view_<?php echo $randonNumber;?>').hide();
        sesJqueryObject('#professional_list_view_<?php echo $randonNumber;?>').hide();
        sesJqueryObject('.portfolio_selectView_<?php echo $randonNumber; ?>').addClass('active');
        sesJqueryObject('.grid_selectView_<?php echo $randonNumber; ?>').removeClass('active');
        sesJqueryObject('.list_selectView_<?php echo $randonNumber; ?>').removeClass('active');
        activeType_<?php echo $randonNumber ?> = 'portfolio';
      }
    }
</script>
<?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('enableglocation', 1)) { ?>
<?php if(!$this->is_ajax):?>
  <?php $this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/richMarker.js'); ?>
  <?php $this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/marker.js'); ?>
<?php endif;?>
<?php } ?>
