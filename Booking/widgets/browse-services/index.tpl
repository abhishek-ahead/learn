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
<?php $base_url = $this->layout()->staticBaseUrl;
$this->headScript()
->appendFile($base_url . 'externals/autocompleter/Observer.js')
->appendFile($base_url . 'externals/autocompleter/Autocompleter.js')
->appendFile($base_url . 'externals/autocompleter/Autocompleter.Local.js')
->appendFile($base_url . 'externals/autocompleter/Autocompleter.Request.js');
?>
<?php $this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/jquery1.11.js'); ?>
<?php $randonNumber="303";?>
<?php 
$viewer = Engine_Api::_()->user()->getViewer();
$viewerId = $viewer->getIdentity();
$levelId = ($viewerId) ? $viewer->level_id : Engine_Api::_()->getDbtable('levels', 'authorization')->getPublicLevel()->level_id;
$tablename = Engine_Api::_()->getDbtable('professionals', 'booking');
?>
<?php if(count($this->paginator)){ ?>
<?php if (empty($this->viewmore)) { ?>
  <div class="sesapmt_browse_services sesbasic_bxs sesbasic_clearfix">
    <div class="sesapmt_browse_services_inner">
      <div id="ajaxdata" class="sesapmt_service_list">
        <div class="service_count"><?php echo $this->translate(array('%s service found.', '%s services found.', $this->count), $this->locale()->toNumber($this->count)); ?></div>
        <?php } ?>
        <?php if (!empty($this->viewmore)) { ?>
          <div class="service_ajax_count"><?php echo $this->translate(array('%s service found.', '%s services found.', $this->count), $this->locale()->toNumber($this->count)); ?></div>
        <?php } ?>
          <?php foreach ($this->paginator as $key => $item):?>
          <div class="sesapmt_service_list_item" style="width:<?php echo $this->width.'px'; ?>;">
            <article>
              <div class="item_thumb" style="background-image:url(<?php if($this->serviceimage) { echo Engine_Api::_()->storage()->get($item->file_id, '')->getPhotoUrl(); } ?>);height:<?php echo $this->height.'px'; ?>"> <a href="<?php echo $item->getHref(); ?>" class="item_thumb_link"></a>
                <div class="sesapmt_services_list_buttons" id="<?php echo $item->service_id; ?>">
                <?php if($levelId!=5) { ?>
                  <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.allow.share', 1) == 2 && Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.allow.share', 1) != 0){ ?>
                    <?php if($this->socialSharing) { ?>
                      <?php if($this->socialshare_icon_limit): ?>
                        <?php  echo $this->partial('_socialShareIcons.tpl','sesbasic',array('resource' => $item, 'socialshare_enable_plusicon' => $this->socialshare_enable_plusicon, 'socialshare_icon_limit' => $this->socialshare_icon_limit)); ?>
                        <?php else: ?>
                          <?php echo $this->partial('_socialShareIcons.tpl','sesbasic',array('resource' => $item, 'socialshare_enable_plusicon' => $this->socialshare_enable_gridview2plusicon, 'socialshare_icon_limit' => $this->socialshare_icon_gridview2limit)); ?>
                        <?php endif;?>
                      <?php } } ?>
                  <?php $userInfo = array('user_id' => $viewerId, 'service_id' => $item->service_id); ?>
                  <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.service.like', 1)){ if($this->like){ ?>
                    <?php //get likes from servicelikes table
                        $isUserLike=Engine_Api::_()->getDbTable('servicelikes', 'booking')->isUserLike($userInfo);
                    ?>
                  <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_like_btn <?php if($isUserLike) echo "button_active";  ?>" onclick="like(<?php echo $item->service_id; ?>)"><i class="fa fa-thumbs-up"></i><span><?php echo $item->like_count; ?></span></a>
                  <?php } } ?>
                  <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.service.fav', 1)){ if($this->favourite){ ?>
                    <?php //get Favourite from serviceFavourite table
                        $isUserFavourite=Engine_Api::_()->getDbTable('servicefavourites', 'booking')->isUserFavourite($userInfo);
                    ?>
                  <a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_fav_btn <?php if($isUserFavourite) echo "button_active";  ?>" onclick="favourite(<?php echo $item->service_id; ?>)"><i class="fa fa-heart"></i><span><?php echo $item->favourite_count; ?></span></a>
                  <?php } } ?>
                  <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.report', 1)){ ?>
                  <!--a href="javascript:;" class="sesbasic_icon_btn sesbasic_icon_btn_count sesbasic_icon_report_btn"><i class="fa fa-flag"></i><span>0</span></a-->
                  <?php } ?>
                <?php } ?>
                </div>
              </div>
              <div class="info">
                <p class="_title">
                	<a href="<?php echo $item->getHref(); ?>">
                  	<?php if($this->servicename) if(strlen($item->name)>$this->servicenamelimit) echo mb_substr($item->name,0,($this->servicenamelimit)).'...'; else echo $item->name; ?>
                  </a>
                </p>
                <div class="professional">
                    <?php
                        $select = $tablename->select()->from($tablename->info('name'), array('*'))->where("user_id =?",$item->user_id);
                        $itemProfessional=$tablename->fetchRow($select);
                    ?>
                    <?php if(!$itemProfessional->file_id): ?>
                        <?php $userSelected = Engine_Api::_()->getItem('user',$item->user_id);  ?>
                        <?php if($this->provideicon) echo $this->htmlLink($itemProfessional->getHref(), $this->itemPhoto($userSelected, 'thumb.icon', $userSelected->getTitle())); ?>
                    <?php else: ?>
                      <?php  if($this->provideicon) { ?><a href="<?php echo $itemProfessional->getHref(); ?>"  ><img src="<?php echo Engine_Api::_()->storage()->get($itemProfessional->file_id, '')->getPhotoUrl('thumb.icon');?>"/></a><?php } ?>
                    <?php endif; ?>
                    <a href="<?php echo $itemProfessional->getHref(); ?>" >
                    <?php  if($this->providername) echo $itemProfessional->name; ?>
                    </a>
                </div>
                <p class="_price">
                	<span><?php if($this->price) echo Engine_Api::_()->booking()->getCurrencyPrice($item->price)." / "; ?></span>
                	<?php  if($this->minute) echo $item->duration." ".(($item->timelimit=="h")?"Hour.":"Minutes."); ?>
                </p>
               	<p class="_stats sesbasic_text_light">
                <?php if($levelId!=5) { ?>
                    <?php if($this->likecount) { ?><span title="<?php echo $item->like_count; ?> likes"><i class="fa fa-thumbs-up"></i><?php echo $item->like_count; ?></span><?php } ?>
                    <?php if($this->favouritecount) { ?><span title="<?php echo $item->favourite_count; ?> favourites"><i class="fa fa-heart"></i><?php echo $item->favourite_count; ?></span><?php } ?>
                <?php } ?>
                </p>
                <?php if($levelId!=5 && $this->viewbutton) {
                  $professionalTable = $tablename->getProfessioanlId($item->user_id);
                  $professional = Engine_Api::_()->getItem('professional', $professionalTable->professional_id);
    
                  if($item->user_id != Engine_Api::_()->user()->getViewer()->getIdentity()){ ?>
                    <p class="_book">
                      <?php if (Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'bookservice') && !empty($professional)) { if(!empty($professional->isProfessionalAvailable)){ ?><a href="<?php echo $this->url(array("action"=>'bookservices','professional'=>$item->user_id , 'service' => $item->service_id),'booking_general',true); ?>" class="sesapmt_btn sesbasic_animation"><span><?php echo $this->translate('Book'); ?></span></a><?php } else{ ?> <span class="tip"><span><?php echo  $this->translate('This service is currently unavailable.'); ?></span></span> <?php } } ?>
                    </p>
                  <?php } else { ?>
                  <?php
                    if (Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'bookservice')) { ?>
                      <p class="_book"><a href="<?php echo $this->url(array("action"=>'bookservices','professional'=>$item->user_id , 'service' => $item->service_id),'booking_general',true); ?>" class="sesapmt_btn sesbasic_animation"><span><?php echo $this->translate('Book'); ?></span></a></p>
                  <?php } ?>
                  <?php } ?>
                <?php } ?>
            	</div>
            </article>
          </div>
          <?php endforeach; ?>
          
          <?php //if($this->paginationType == 1): ?>
            <?php if (!empty($this->paginator) && $this->paginator->count() > 1): ?>
              <?php if ($this->paginator->getCurrentPageNumber() < $this->paginator->count()): ?>
                <div class="clear" id="loadmore_list"></div>
                <div class="sesbasic_view_more sesbasic_load_btn" id="load_more" onclick="loadMore();" style="display: block;">
                  <a href="javascript:void(0);" class="sesbasic_animation sesbasic_link_btn" ><i class="fa fa-repeat"></i><span><?php echo $this->translate('View More');?></span></a>
                </div>
                <div class="sesbasic_view_more_loading" id="underloading_image" style="display: none;">
                <span class="sesbasic_link_btn"><i class="fa fa-spinner fa-spin"></i></span>
                </div>
              <?php endif; ?>
            <?php endif; ?>
          <?php //else: ?>
            <?php //echo $this->paginationControl($this->paginator, null, null, array('pageAsQuery' => true, 'query' => $this->formValues)); ?>
          <?php //endif; ?>
        <?php if (empty($this->viewmore)) { ?>
      </div>
    </div>
  </div>
<?php } ?>
<?php } else { ?>
  <div class="tip"><span><?php echo $this->translate("There are currently no services to show."); ?></span></div>
<?php } ?>

<script type="text/javascript">
  function loadMore() {  
    if ($('load_more'))
      $('load_more').style.display = "<?php echo ( $this->paginator->count() == $this->paginator->getCurrentPageNumber() || $this->count == 0 ? 'none' : '' ) ?>";

    if(document.getElementById('load_more'))
      document.getElementById('load_more').style.display = 'none';
    
    if(document.getElementById('underloading_image'))
     document.getElementById('underloading_image').style.display = '';

    en4.core.request.send(new Request.HTML({
      method: 'post',              
      'url': en4.core.baseUrl + 'widget/index/mod/booking/name/browse-services',
      'data': {
        format: 'html',
        page: "<?php echo sprintf('%d', $this->paginator->getCurrentPageNumber() + 1) ?>",
        viewmore: 1,
        params: '<?php echo json_encode($this->all_params); ?>',
      },
      onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
        document.getElementById('ajaxdata').innerHTML = document.getElementById('ajaxdata').innerHTML + responseHTML;
        if(sesJqueryObject('.service_ajax_count').length){
          sesJqueryObject('.service_count').html(sesJqueryObject('.service_ajax_count').html());
          sesJqueryObject('.service_ajax_count').remove();
        }
        if(document.getElementById('load_more'))
          document.getElementById('load_more').destroy();
        
        if(document.getElementById('underloading_image'))
         document.getElementById('underloading_image').destroy();
       
        if(document.getElementById('loadmore_list'))
         document.getElementById('loadmore_list').destroy();
      }
    }));
    return false;
  }
</script>
<?php if($this->paginationType == 1): ?>
  <script type="text/javascript">    
     //Take refrences from: http://mootools-users.660466.n2.nabble.com/Fixing-an-element-on-page-scroll-td1100601.html
    //Take refrences from: http://davidwalsh.name/mootools-scrollspy-load
    en4.core.runonce.add(function() {
      var paginatorCount = '<?php echo $this->paginator->count(); ?>';
      var paginatorCurrentPageNumber = '<?php echo $this->paginator->getCurrentPageNumber(); ?>';
      function ScrollLoader() { 
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if($('loadmore_list')) {
          if (scrollTop > 40)
            loadMore();
        }
      }
      window.addEvent('scroll', function() {
        ScrollLoader(); 
      });
    });    
  </script>
<?php endif; ?>

<script type="text/javascript">
    function like(service_id){
        (new Request.HTML({
          method: 'post',
          'url': en4.core.baseUrl + 'booking/ajax/servicelike',
          'data': {
            format: 'html',
            service_id: service_id
        },
        onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
              sesJqueryObject('#'+service_id+'').find('.sesbasic_icon_like_btn').find('span').html(responseHTML);
              if(sesJqueryObject('#'+service_id+'').find('.sesbasic_icon_like_btn').hasClass("button_active"))
                  sesJqueryObject('#'+service_id+'').find('.sesbasic_icon_like_btn').removeClass("button_active");
              else
                  sesJqueryObject('#'+service_id+'').find('.sesbasic_icon_like_btn').addClass("button_active");
            return true;
            }
          })).send();
    }
</script> 
<script type="text/javascript">
    function favourite(service_id){
        (new Request.HTML({
          method: 'post',
          'url': en4.core.baseUrl + 'booking/ajax/servicefavourite',
          'data': {
            format: 'html',
            service_id : service_id
        },
        onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
              sesJqueryObject('#'+service_id+'').find('.sesbasic_icon_fav_btn').find('span').html(responseHTML);
              if(sesJqueryObject('#'+service_id+'').find('.sesbasic_icon_fav_btn').hasClass("button_active"))
                  sesJqueryObject('#'+service_id+'').find('.sesbasic_icon_fav_btn').removeClass("button_active");
              else
                  sesJqueryObject('#'+service_id+'').find('.sesbasic_icon_fav_btn').addClass("button_active");
            return true;
            }
          })).send();
    }
</script> 
<script type="text/javascript">
sesJqueryObject(document).on('click','#showservices',function () {
sesJqueryObject("#ajaxdata").html('<div class="sesbasic_loading_container"></div>');
var servicename=sesJqueryObject("#servicename").val();
var price=sesJqueryObject("#prince").val();
var professional=sesJqueryObject("#professional").val();
var category_id=sesJqueryObject("#category_id").val();
var subcat_id=sesJqueryObject("#subcat_id").val();
var subsubcat_id=sesJqueryObject("#subsubcat_id").val();
(new Request.HTML({
    method: 'post',
    'url': en4.core.baseUrl + "widget/index/mod/booking/name/browse-services",
    'data': {
      format: 'html',
      servicename:servicename,
      professional:professional,
      category_id:category_id,
      subcat_id:subcat_id,
      subsubcat_id:subsubcat_id,
      price:price,
      isService:1,
      is_ajax: '<?php echo $this->is_ajax; ?>',
      viewmore : '1',
      params: '<?php echo json_encode($this->all_params); ?>',
    },
    onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
            console.log(responseHTML);
        sesJqueryObject("#ajaxdata").html(responseHTML);
        return true;
        }
    })).send();
});
</script> 
<script type="text/javascript">
  function showSubCategory(cat_id,selectedId) {
    var selected;
    if(selectedId != ''){
      var selected = selectedId;
    }
    var url = en4.core.baseUrl + 'booking/ajax/subcategory/category_id/' + cat_id;
    new Request.HTML({
      url: url,
      data: {
        'selected':selected
      },
      onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
        if (formObj.find('#subcat_id-wrapper').length && responseHTML) {
          formObj.find('#subcat_id-wrapper').show();
          formObj.find('#subcat_id-wrapper').find('#subcat_id-element').find('#subcat_id').html(responseHTML);
        } else {
          if (formObj.find('#subcat_id-wrapper').length) {
            formObj.find('#subcat_id-wrapper').hide();
            formObj.find('#subcat_id-wrapper').find('#subcat_id-element').find('#subcat_id').html( '<option value="0"></option>');
          }
        }
        if(selectedId == ''){
            if (formObj.find('#subsubcat_id-wrapper').length) {
              formObj.find('#subsubcat_id-wrapper').hide();
              formObj.find('#subsubcat_id-wrapper').find('#subsubcat_id-element').find('#subsubcat_id').html( '<option value="0"></option>');
          }
        }
      }
    }).send(); 
  }
function showSubSubCategory(cat_id,selectedId,isLoad) {
    if(cat_id == 0){
        if (formObj.find('#subsubcat_id-wrapper').length) {
    formObj.find('#subsubcat_id-wrapper').hide();
    formObj.find('#subsubcat_id-wrapper').find('#subsubcat_id-element').find('#subsubcat_id').html( '<option value="0"></option>');
    }
        return false;
    }
    var selected;
    if(selectedId != ''){
            var selected = selectedId;
    }
    var url = en4.core.baseUrl + 'booking/ajax/subsubcategory/subcategory_id/' + cat_id;
    (new Request.HTML({
      url: url,
      data: {
        'selected':selected
      },
      onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
        if (formObj.find('#subsubcat_id-wrapper').length && responseHTML) {
          formObj.find('#subsubcat_id-wrapper').show();
          formObj.find('#subsubcat_id-wrapper').find('#subsubcat_id-element').find('#subsubcat_id').html(responseHTML);

        } else {
          if (formObj.find('#subsubcat_id-wrapper').length) {
            formObj.find('#subsubcat_id-wrapper').hide();
            formObj.find('#subsubcat_id-wrapper').find('#subsubcat_id-element').find('#subsubcat_id').html( '<option value="0"></option>');
          }
        }				
    }
   })).send();  
  }
   en4.core.runonce.add(function(){
    formObj = sesJqueryObject('#booking_form_servicesearch').find('div').find('div').find('div');
    var sesdevelopment = 1;
    <?php if(isset($this->category_id) && $this->category_id != 0){ ?>
        <?php if(isset($this->subcat_id)){$catId = $this->subcat_id;}else $catId = ''; ?>
        showSubCategory('<?php echo $this->category_id; ?>','<?php echo $catId; ?>','yes');
     <?php  }else{ ?>
            formObj.find('#subcat_id-wrapper').hide();
     <?php } ?>
     <?php if(isset($this->subsubcat_id) && $this->subsubcat_id != 0){ ?>
      if (<?php echo isset($this->subcat_id) && intval($this->subcat_id) > 0 ? $this->subcat_id : 'sesdevelopment' ?> == 0) {
        formObj.find('#subsubcat_id-wrapper').hide();
      } else {
        <?php if(isset($this->subsubcat_id)){$subsubcat_id = $this->subsubcat_id;}else $subsubcat_id = ''; ?>
        showSubSubCategory('<?php echo $this->subcat_id; ?>','<?php echo $this->subsubcat_id; ?>','yes');
      }
     <?php }else{ ?>
        formObj.find('#subsubcat_id-wrapper').hide();
     <?php } ?>
  });
</script> 
