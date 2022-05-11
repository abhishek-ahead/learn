<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: _appointments.tpl  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */

?>
<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>

<?php if(!$this->is_ajax){ ?>
  <style>
    .displayFN{display:none !important;}
  </style>
  <?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Booking/externals/styles/styles.css'); ?>
  <?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/styles/styles.css'); ?> 
<?php } ?>
<?php if(!$this->is_ajax){ ?>
  <div id="scrollHeightDivSes_<?php echo $randonNumber; ?>" class="sesbasic_clearfix sesbasic_bxs clear">
    <ul class="booking_listing sesbasic_clearfix clear <?php if($this->view_type == 'pinboard'):?>sesbasic_pinboard_<?php echo $randonNumber;?><?php endif;?>" id="tabbed-widget_<?php echo $randonNumber; ?>" style="min-height:50px;">
    <?php } ?>
    <?php if(count($this->paginator)){   ?>
     <?php foreach ($this->paginator as $item): ?>
       <div class="sesapmt_myappointments_list_item sesbasic_clearfix">
         <article class="sesbasic_clearfix">
           <?php if($this->isProfessionalInAppointments==$item->professional_id){ ?>
             <?php $userSelected = Engine_Api::_()->getItem('user',$item->user_id);?>
             <?php if($this->defaultOpenTab=="given" || $this->defaultOpenTab=="cancelled" || $this->defaultOpenTab=="completed" || $this->defaultOpenTab=="reject"){ ?>
              <div class="sesapmt_myappointments_list_item_thumb">
                <?php echo $this->htmlLink($userSelected->getHref(), $this->itemBackgroundPhoto($userSelected, 'thumb.profile', $userSelected->getTitle())) ?>
              </div>
              <div class="sesapmt_myappointments_list_item_info">
               <p class="sesapmt_myappointments_list_item_title">
                 <?php echo $userSelected->displayname;?>
               </p>
               <p class="sesapmt_myappointments_list_item_det">
                <span class="sesbasic_text_light">Timing :</span>
                <span><?php echo date("d F Y (D)",strtotime($item->date))." ".date("h:i A",strtotime($item->professionaltime))." - ".date("h:i A",strtotime($item->serviceendtime)); ?></span>
              </p>
              <p class="sesapmt_myappointments_list_item_det">
               <span class="sesbasic_text_light">Service :</span>
               <span><?php $serviceName=Engine_Api::_()->getDbTable('services', 'booking')->getServices(array('service_id'=>$item->service_id));
               echo $serviceName->name;?></span>
             </p>
             <?php if( $this->defaultOpenTab!="cancelled" && $this->defaultOpenTab!="completed" && $this->defaultOpenTab!="reject"){ ?>
               <p class="sesapmt_myappointments_list_item_det floatL">
                <span class="sesbasic_text_light">Status :</span>
                <span><?php echo((!$item->action=="completed") ? "Pending" : ""); ?></span>
              </p>
              <p class="sesapmt_myappointments_list_item_btns floatR">
                <?php if($item->professional_id==$item->given) { ?>
                	<span><a href="<?php echo $this->url(array("action"=>'appointment',"cancel"=>$item->appointment_id),'booking_general',true); ?>" class="openSmoothbox">Cancel</a></span>
                <?php } else { ?>
                  <?php if($item->saveas==0){ ?>
                   <span><a href="<?php echo $this->url(array("action"=>'appointment',"accept"=>$item->appointment_id),'booking_general',true); ?>" class="openSmoothbox">Accept</a></span>
                 <?php } else { ?>
                   <span><a href="<?php echo $this->url(array("action"=>'appointment',"completed"=>$item->appointment_id),'booking_general',true); ?>" class="openSmoothbox">Mark as Completed</a></span>
                 <?php } ?>
                 <span><a href="<?php echo $this->url(array("action"=>'appointment',"reject"=>$item->appointment_id),'booking_general',true); ?>" class="openSmoothbox">Reject</a></span>
               <?php } ?>
             </p>
           <?php } ?> 
         </div>
       <?php } ?>
       <?php if(($this->isProfessionalInAppointments!=$item->user_id && $this->isProfessionalInAppointments==$item->user_id) && $this->defaultOpenTab=="taken"){ ?>
         <div class="tip"><span><?php echo $this->translate('There are currently no appointments to show.'); ?></span></div>
         <?php break; } ?>
       <?php } else if($this->isProfessionalInAppointments!=$item->professional_id){ ?>
         <?php $userSelected = Engine_Api::_()->getItem('user',$item->professional_id); ?>
         <?php if($this->defaultOpenTab=="taken" || $this->defaultOpenTab=="cancelled" || $this->defaultOpenTab=="completed" || $this->defaultOpenTab=="reject"){ ?>
          <div class="sesapmt_myappointments_list_item_thumb">
           <?php echo $this->htmlLink($userSelected->getHref(), $this->itemBackgroundPhoto($userSelected, 'thumb.profile', $userSelected->getTitle())) ?>
         </div>
         <div class="sesapmt_myappointments_list_item_info">
           <p class="sesapmt_myappointments_list_item_title">
             <?php echo $userSelected->displayname;?>
           </p>
           <p class="sesapmt_myappointments_list_item_det">
            <span class="sesbasic_text_light">Timing :</span>
            <span>
             <?php 
             /* getting my time zone */
             date_default_timezone_set($item->professionaltimezone);
             $professional = date("d-m-Y H:i:s");  

             /* getting whose request me time zone */
             date_default_timezone_set($item->usertimezone);
             $viewer = date("d-m-Y H:i:s");  

             $date1=date_create($professional);
             $date2=date_create($viewer);
             $diff=date_diff($date1,$date2);
             ?>
             <?php echo date("d F Y (D)", strtotime($diff->format("%R%a days %h hours %i minutes %s seconds"),strtotime($item->date)))." ".date("h:i A", strtotime($diff->format("%R%a days %h hours %i minutes %s seconds"),strtotime($item->professionaltime)))." - ".date("h:i A", strtotime($diff->format("%R%a days %h hours %i minutes %s seconds"),strtotime($item->serviceendtime))); ?>
           </span>
         </p>
         <p class="sesapmt_myappointments_list_item_det">
          <span class="sesbasic_text_light">Service :</span>
          <span><?php $serviceName=Engine_Api::_()->getDbTable('services', 'booking')->getServices(array('service_id'=>$item->service_id));
          echo $serviceName->name;?></span>
        </p>
        <?php  if( $this->defaultOpenTab!="cancelled" && $this->defaultOpenTab!="completed" && $this->defaultOpenTab!="reject"){ ?>
          <p class="sesapmt_myappointments_list_item_det floatL">
            <span class="sesbasic_text_light">Status :</span>
            <span><?php echo(($item->saveas==1) ? "Your service request accepted by professional." : "Pending"); ?></span>
          </p>
          <p class="sesapmt_myappointments_list_item_btns floatR">
           <?php if($item->professional_id!=$item->given) { ?>
             <span><a href="<?php echo $this->url(array("action"=>'appointment',"cancel"=>$item->appointment_id),'booking_general',true); ?>" class="openSmoothbox">Cancel</a></span>
           <?php } else { ?>
             <?php if($item->saveas==0){ ?> 
              <span>
                <?php //if member level have enable online payment. ?>
                <?php $settings = Engine_Api::_()->getApi('settings', 'core'); ?>
                <?php if($settings->getSetting('booking.paymode')){ ?>
                  <a href="<?php echo $this->url(array("action"=>'appointment',"accept"=>$item->appointment_id,"professional_id" => $item->professional_id, "order_id" => $item->order_id),'booking_general',true); ?>" class="openSmoothbox">Accept and Pay</a>
                <?php }else{ ?>
                  <a href="<?php echo $this->url(array("action"=>'appointment',"accept"=>$item->appointment_id),'booking_general',true); ?>" class="openSmoothbox">Accept</a>
                <?php } ?>
              </span>
            <?php } else { ?>
              <span><a href="<?php echo $this->url(array("action"=>'appointment',"completed"=>$item->appointment_id),'booking_general',true); ?>" class="openSmoothbox">Mark as Completed</a></span>
            <?php } ?>
            <span><a href="<?php echo $this->url(array("action"=>'appointment',"reject"=>$item->appointment_id),'booking_general',true); ?>" class="openSmoothbox">Reject</a></span>
          <?php } ?>
        </p>
      <?php } ?>
    </div>
  <?php } ?>
  <?php if(($this->isProfessionalInAppointments!=$item->user_id && $this->isProfessionalInAppointments==$item->user_id) && $this->defaultOpenTab=="given"){ ?>
   <div class="tip"><span>?><?php echo $this->translate('There are currently no appointments to show.'); ?></span></div>
   <?php break; } ?>
 <?php }?>
</article>   
</div>
<?php endforeach; ?>
<?php } else { ?>
  <div class="tip"><span><?php echo $this->translate('There are currently no appointments to show.'); ?></span></div>
<?php } ?>
<?php if($this->loadOptionData == 'pagging' && (empty($this->show_limited_data) || $this->show_limited_data  == 'no')){ ?>
  <div style="width: 100%;">
    <?php echo $this->paginationControl($this->paginator, null, array("_pagging.tpl", "booking"),array('identityWidget'=>$randonNumber)); ?>
  </div>
<?php } ?>
<?php if(!$this->is_ajax){ ?>
  <ul>
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
            defaultOpenTab : '<?php echo $this->defaultOpenTab ?>',
            searchParams:searchParams<?php echo $randonNumber; ?> ,
            identity : '<?php echo $randonNumber; ?>',
            height:'<?php echo $this->masonry_height;?>',
            type:activeType_<?php echo $randonNumber ?>,
            identityObject:'<?php echo isset($this->identityObject) ? $this->identityObject : "" ?>'
          },
          onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
            sesJqueryObject('.booking_listing').append(responseHTML);
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
            params : params<?php echo $randonNumber; ?>, 
            is_ajax : 1,
            defaultOpenTab : '<?php echo $this->defaultOpenTab ?>',
            searchParams:searchParams<?php echo $randonNumber; ?> ,
            identity : '<?php echo $randonNumber; ?>',
            height:'<?php echo $this->masonry_height;?>',
            type:activeType_<?php echo $randonNumber ?>,
            identityObject:'<?php echo isset($this->identityObject) ? $this->identityObject : "" ?>'
          },
          onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
            sesJqueryObject('.booking_listing').html(responseHTML);
            sesJqueryObject('#sesbasic_loading_cont_overlay_<?php echo $randonNumber?>').css('display', 'none');
          }
        }));
        requestViewMore_<?php echo $randonNumber; ?>.send();
        return false;
      }
    <?php } ?>
  </script>