<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>

<?php $randonNumber = $randonNumber ? $randonNumber : $this->widgetId; ?>
<?php if(!$this->is_ajax){ ?>
  <style>
    .displayFN{display:none !important;}
  </style>
  <?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Booking/externals/styles/styles.css'); ?>
  <?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/styles/styles.css'); ?> 
  <?php $viewer = Engine_Api::_()->user()->getViewer();
  $viewerId = $viewer->getIdentity();
  $levelId = ($viewerId) ? $viewer->level_id : Engine_Api::_()->getDbtable('levels', 'authorization')->getPublicLevel()->level_id; 
  ?>
<?php } ?>
<?php if(!$this->is_ajax){ ?>
  <div class="sesapmt_browse_services sesbasic_bxs sesbasic_clearfix">
    <div class="sesapmt_browse_services_inner prelative">
      <div id="sesbasic_loading_cont_overlay_<?php echo $randonNumber?>" class="sesbasic_loading_cont_overlay"></div>
      <div id="ajaxdata<?php echo $randonNumber?>" class="sesapmt_service_list">
      <?php } ?>
      <?php if(count($this->paginator)){ ?>
        <?php foreach ($this->paginator as $item): ?>  
          <?php 
          $tablename = Engine_Api::_()->getDbtable('professionals', 'booking');
          $select = $tablename->select()->from($tablename->info('name'), array('*'))->where("user_id =?",$item->user_id);
          $itemProfessional = $tablename->fetchRow($select);
          ?>
          <div class="sesapmt_service_list_item" style="width:<?php echo $this->width.'px'; ?>;">
            <article>
             <div class="item_thumb" style="background-image:url(<?php  if($this->serviceimage) { $img_path = Engine_Api::_()->storage()->get($item->file_id, '')->getPhotoUrl(); echo $img_path; } ?>);height:<?php echo $this->height.'px'; ?>">
              <?php if($levelId!=5) {?>
               <div class="sesapmt_services_list_buttons" id="<?php echo $item->service_id; ?>">
                <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.like', 1)){ if($this->like) { ?>
                  <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_like_btn" onclick="like(<?php echo $item->service_id; ?>)"><i class="fa fa-thumbs-up"></i><span><?php echo $item->like_count; ?></span></a>
                <?php } } ?>
                <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.fav', 1)){ if($this->favourite) { ?>
                  <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_fav_btn" onclick="favourite(<?php echo $item->service_id; ?>)"><i class="fa fa-heart"></i><span><?php echo $item->favourite_count; ?></span></a>
                <?php } } ?>
                <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.report', 1)){ ?>
                <?php } ?>
              </div>
            <?php } ?>
            <a href="<?php echo $item->getHref(); ?>" class="item_thumb_link"></a>
            </div>
            <div class="info">
              <p class="_title">
                <?php if($this->servicename) { if(strlen($item->name)>$this->servicenamelimit) echo mb_substr($item->name,0,($this->servicenamelimit)).'...'; else echo $item->name; } ?>
              </p>
              <p class="_price">
               <span><?php if($this->price) { echo Engine_Api::_()->booking()->getCurrencyPrice($item->price); ?></span> / <?php } if($this->minute) { echo $item->duration." ".(($item->timelimit=="h")?"Hour.":"Minutes.");} ?>
             </p>
             <p class="_stats sesbasic_text_light">
              <?php if($this->likecount) { ?><span title="<?php echo $item->like_count; ?> likes"><i class="fa fa-thumbs-up"></i><?php echo $item->like_count; ?></span><?php } ?>
              <?php if($this->favouritecount) { ?><span title="<?php echo $item->favourite_count; ?> favourites"><i class="fa fa-heart"></i><?php echo $item->favourite_count; ?></span><?php } ?>
            </p>
            <p class="_book">
              <?php if($this->bookbutton) { ?>  
                <?php if(!empty($professional->isProfessionalAvailable)){ ?>
                  <a href="<?php echo $this->url(array("action"=>'bookservices','professional'=> $itemProfessional->user_id , 'service' => $item->service_id),'booking_general',true); ?>"><?php echo $this->translate('Book'); ?></a> 
                <?php } else{ ?> <span class="tip"><span><?php echo  $this->translate('This service is currently unavailable.'); ?></span></span>
                <?php } ?>

              <?php } ?>
            </p>
          </div>
        </article>   
      </div>
    <?php endforeach; ?>
    <?php } else { ?>
      <?php if($this->ifNoProfessioanl) { ?><div class="tip"><span><?php echo $this->translate('There are currently no services to show.');?></span></div><?php } ?>
    <?php } ?>
    <?php if($this->loadOptionData == 'pagging' && (empty($this->show_limited_data) || $this->show_limited_data  == 'no')){ ?>
      <div style="width: 100%;">
        <?php echo $this->paginationControl($this->paginator, null, array("_pagging.tpl", "booking"),array('identityWidget'=>$randonNumber)); ?>
      </div>
    <?php } ?>
<?php if(!$this->is_ajax){ ?>
    </div>
  </div>
</div>
<?php } ?>
<div id="browse-widget_<?php echo $randonNumber;?>" class="sesevent_event_all_events sesevent_browse_listing"></div>
<?php if($this->loadOptionData != 'pagging' && !$this->is_ajax && (empty($this->show_limited_data) || $this->show_limited_data  == 'no')):?>
  <div class="sesbasic_load_btn" id="view_more_<?php echo $randonNumber;?>" onclick="viewMore_<?php echo $randonNumber; ?>();" > 
    <?php echo $this->htmlLink('javascript:void(0);', $this->translate('View More'), array('id' => "feed_viewmore_link_$randonNumber", 'class' => 'sesbasic_animation sesbasic_link_btn fa fa-repeat')); ?> </div>
    <div class="sesbasic_load_btn sesbasic_view_more_loading_<?php echo $randonNumber;?>" id="loading_image_<?php echo $randonNumber; ?>" style="display: none;"><span class="sesbasic_link_btn"><i class="fa fa-spinner fa-spin"></i></span> </div>  
  <?php endif;?>
  <?php if (empty($this->is_ajax)) : ?>
    <div id="temporary_data_<?php echo $randonNumber?>"></div>
  <?php endif;?>
  <script type="text/javascript">
    <?php if(!$this->is_ajax):?>
      if("<?php echo $this->view_type ; ?>" == 'masonry'){}
      <?php if($this->loadOptionData == 'auto_load' && (empty($this->show_limited_data) || $this->show_limited_data  == 'no')){ ?>
        window.addEvent('load', function() {
          sesJqueryObject(window).scroll( function() {
            var containerId = '#browse-widget_<?php echo $randonNumber;?>';
            if(typeof sesJqueryObject(containerId).offset() != 'undefined') {
              var hT = sesJqueryObject('#view_more_<?php echo $randonNumber; ?>').offset().top,
              hH = sesJqueryObject('#view_more_<?php echo $randonNumber; ?>').outerHeight(),
              wH = sesJqueryObject(window).height(),
              wS = sesJqueryObject(this).scrollTop();
              if ((wS + 30) > (hT + hH - wH) && sesJqueryObject('#view_more_<?php echo $randonNumber; ?>').css('display') == 'block') {
                document.getElementById('feed_viewmore_link_<?php echo $randonNumber; ?>').click();
              }
            }      
          });
        });
      <?php } ?>
    <?php endif; ?>
    <?php if(!$this->is_ajax):?>
      var loadMap_<?php echo $randonNumber;?> = false;
      var activeType_<?php echo $randonNumber ?>;
      function showData_<?php echo $randonNumber; ?>(type) {
        activeType_<?php echo $randonNumber ?> = '';
      }
      var searchParams<?php echo $randonNumber; ?> ;
      var identity<?php echo $randonNumber; ?>  = '<?php echo $randonNumber; ?>';
    <?php endif;?> 
    var params<?php echo $randonNumber; ?> = '<?php echo json_encode($this->params); ?>';
    var page<?php echo $randonNumber; ?> = '<?php echo $this->page + 1; ?>';
    <?php if(!$this->is_ajax):?>
      var isSearch = false;
      var oldMapData_<?php echo $randonNumber; ?> = [];
    <?php endif;?>
    <?php if($this->loadOptionData != 'pagging') { ?>
      en4.core.runonce.add(function() {
        viewMoreHide_<?php echo $randonNumber; ?>();
      });
      function viewMoreHide_<?php echo $randonNumber; ?>() {
        if ($('view_more_<?php echo $randonNumber; ?>'))
        $('view_more_<?php echo $randonNumber; ?>').style.display = "<?php echo ($this->paginator->count() == 0 ? 'none' : ($this->paginator->count() == $this->paginator->getCurrentPageNumber() ? 'none' : '' )) ?>";
      }
      function viewMore_<?php echo $randonNumber; ?> () {
        sesJqueryObject('#view_more_<?php echo $randonNumber; ?>').hide();
        sesJqueryObject('#loading_image_<?php echo $randonNumber; ?>').show(); 
        if(typeof requestViewMore_<?php echo $randonNumber; ?>  != "undefined"){
          requestViewMore_<?php echo $randonNumber; ?>.cancel();
        }
        requestViewMore_<?php echo $randonNumber; ?> = new Request.HTML({
          method: 'post',
          'url': en4.core.baseUrl + "widget/index/mod/booking/name/<?php echo $this->widgetName; ?>",
          'data': {
            format: 'html',
            page: page<?php echo $randonNumber; ?>,    
            params : params<?php echo $randonNumber; ?>, 
            is_ajax : 1,
            professionalId : <?php echo $this->professionalId; ?> , 
            searchParams:searchParams<?php echo $randonNumber; ?> ,
            identity : '<?php echo $randonNumber; ?>',
            height:'<?php echo $this->masonry_height;?>',
            type:activeType_<?php echo $randonNumber ?>,
            identityObject:'<?php echo isset($this->identityObject) ? $this->identityObject : "" ?>'
          },
          onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
            sesJqueryObject('#ajaxdata<?php echo $randonNumber?>').append(responseHTML);
            sesJqueryObject('.sesbasic_view_more_loading_<?php echo $randonNumber;?>').hide();
            sesJqueryObject('#loadingimgsesevent-wrapper').hide();
            viewMoreHide_<?php echo $randonNumber; ?>();
          }
        });
        requestViewMore_<?php echo $randonNumber; ?>.send();
        return false;
      }
    <?php }else{ ?>
      function paggingNumber<?php echo $randonNumber; ?>(pageNum){
        sesJqueryObject('#sesbasic_loading_cont_overlay_<?php echo $randonNumber?>').css('display','block');
        if(typeof requestViewMore_<?php echo $randonNumber; ?>  != "undefined"){
          requestViewMore_<?php echo $randonNumber; ?>.cancel();
        }
        requestViewMore_<?php echo $randonNumber; ?> = (new Request.HTML({
          method: 'post',
          'url': en4.core.baseUrl + "widget/index/mod/booking/name/<?php echo $this->widgetName; ?>",
          'data': {
            format: 'html',
            page: pageNum,
            params :params<?php echo $randonNumber; ?> , 
            is_ajax : 1,
            professionalId : <?php echo $this->professionalId; ?> , 
            searchParams:searchParams<?php echo $randonNumber; ?>,
            identity : <?php echo $randonNumber; ?>,
            type:sesJqueryObject('.sesbasic_view_type_options_<?php echo $randonNumber; ?>').find('.active').attr('rel'),
            height:'<?php echo $this->masonry_height;?>',
            identityObject:'<?php echo isset($this->identityObject) ? $this->identityObject : "" ?>'
          },
          onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
            sesJqueryObject('#ajaxdata<?php echo $randonNumber?>').html(responseHTML);
            sesJqueryObject('#sesbasic_loading_cont_overlay_<?php echo $randonNumber?>').css('display', 'none');
          }
        }));
        requestViewMore_<?php echo $randonNumber; ?>.send();
        return false;
      }
    <?php } ?>
  </script>
  