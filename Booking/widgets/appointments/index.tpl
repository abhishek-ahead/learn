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
$this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); 
?>
 <?php $randonNumber = $this->widgetId;?>
 <?php if(!$this->is_ajax){ ?>
  <!--Default Tabs-->
  <?php if($this->params['tabOption'] == 'default'){ ?>
    <div class="layout_core_container_tabs" 
    <?php if(count($this->defaultOptions) ==1){ ?> style="border-width:0;" 
    <?php } ?>>
    <div class="tabs_alt tabs_parent" 
    <?php if(count($this->defaultOptions) ==1){ ?> style="display:none" 
    <?php } ?>>
  <?php } ?>
  <!--Advance Tabs-->
  <?php  if($this->params['tabOption'] == 'advance'){ ?>
    <div class="sesbasic_tabs_container sesbasic_clearfix sesbasic_bxs" 
    <?php if(count($this->defaultOptions) ==1){ ?> style="border-width:0;" 
    <?php } ?>>
    <div class="sesbasic_tabs sesbasic_clearfix" 
    <?php if(count($this->defaultOptions) ==1){ ?> style="display:none" 
    <?php } ?>>
  <?php  } ?>
  <?php if($this->params['tabOption'] == 'filter'){ ?>
    <div class="sesbasic_filter_tabs_container sesbasic_clearfix sesbasic_bxs" 
    <?php if(count($this->defaultOptions) ==1){ ?> style="border-width:0;" 
    <?php } ?>>
    <div class="sesbasic_filter_tabs sesbasic_clearfix" 
    <?php if(count($this->defaultOptions) ==1){ ?> style="display:none" 
    <?php } ?>>
  <?php } ?>
  <?php if($this->params['tabOption'] == 'vertical'){ ?>
    <div class="sesbasic_v_tabs_container sesbasic_clearfix sesbasic_bxs" 
    <?php if(count($this->defaultOptions) ==1){ ?> style="border-width:0;" 
    <?php } ?>>
    <div class="sesbasic_v_tabs appointment_v_tabs sesbasic_clearfix" 
    <?php if(count($this->defaultOptions) ==1){ ?> style="display:none" 
    <?php } ?>>
  <?php } ?>
  <?php if($this->params['tabOption'] == 'select' && count($this->defaultOptions) > 1){ ?>
    <div class="sesbasic_select_tabs_container sesbasic_clearfix sesbasic_bxs">
      <div class="sesbasic_select_tabs">
        <p>
          <span>
            <?php echo $this->translate("Sort By: ") ?>
          </span>  
          <span>
            <select onchange="changeTabSes_<?php echo $randonNumber; ?>(this.value)" id="selected_optn_<?php echo $randonNumber; ?>">
              <?php 
              $defaultOptionArray = array();
              foreach($this->defaultOptions as $key=>$valueOptions){ 
                $defaultOptionArray[] = $key;
                ?>
                <option value="<?php echo $key; ?>">
                  <?php echo $this->translate(($valueOptions)); ?>
                </option>
              <?php } ?>
            </select>
          </span>
        </p>
      <?php } else { ?>
        <ul id="appointments-<?php echo $randonNumber; ?>">
          <?php 
          $defaultOptionArray = array();
          foreach($this->defaultOptions as $key=>$valueOptions){ 
            $defaultOptionArray[] = $key;
            ?>
            <li <?php if($this->defaultOpenTab == $key){ ?> class="active"<?php } ?> id="sesTabContainer_<?php echo $randonNumber; ?>_<?php echo $key; ?>">
              <a href="javascript:;" data-src="<?php echo $key; ?>" onclick="changeTabSes_<?php echo $randonNumber; ?>('<?php echo $key; ?>')">
                <?php echo $this->translate($valueOptions); ?>
              </a>
            </li>
          <?php } ?>
        </ul>
      <?php } ?>
    </div>
    <div class="sesbasic_tabs_content sesbasic_clearfix">
    <?php  } ?>
      <?php include APPLICATION_PATH . '/application/modules/Booking/views/scripts/_appointments.tpl'; ?>
    <?php if(!$this->is_ajax){ ?>
    </div>
  </div>
<?php } ?>
<?php if(!$this->is_ajax):?>
  <script type="application/javascript"> 
    var availableTabs_<?php echo $randonNumber;  ?>;
    var requestTab_<?php echo $randonNumber;  ?>;
    <?php if(isset($defaultOptionArray)){      ?>
      availableTabs_<?php echo $randonNumber;?> = <?php echo json_encode($defaultOptionArray);?>;
    <?php } ?>
    var defaultOpenTab ;
    function changeTabSes_<?php echo $randonNumber;
    ?>(valueTab){
      if(sesJqueryObject('#selected_optn_<?php echo $randonNumber; ?>').length == 0){
        if(sesJqueryObject("#sesTabContainer_<?php echo $randonNumber; ?>_"+valueTab).hasClass('active'))
        return;
        var id = '_<?php echo $randonNumber; ?>';
        var length = availableTabs_<?php echo $randonNumber;?>.length;
        for (var i = 0; i < length; i++){
          if(availableTabs_<?php echo $randonNumber; ?>[i] == valueTab){
            document.getElementById('sesTabContainer'+id+'_'+availableTabs_<?php echo $randonNumber; ?>[i]).addClass('active');
            sesJqueryObject('#sesTabContainer'+id+'_'+availableTabs_<?php echo $randonNumber; ?>[i]).addClass('sesbasic_tab_selected');
          }
          else{
            sesJqueryObject('#sesTabContainer'+id+'_'+availableTabs_<?php echo $randonNumber; ?>[i]).removeClass('sesbasic_tab_selected');
            document.getElementById('sesTabContainer'+id+'_'+availableTabs_<?php echo $randonNumber; ?>[i]).removeClass('active');
          }
        }
      }
      if(valueTab){
        if(document.getElementById("error-message_<?php echo $randonNumber;?>"))
        document.getElementById("error-message_<?php echo $randonNumber;?>").style.display = 'none';
        if(document.getElementById('tabbed-widget_<?php echo $randonNumber; ?>'))
        document.getElementById('tabbed-widget_<?php echo $randonNumber; ?>').innerHTML ='';
        sesJqueryObject('#view_more_<?php echo $randonNumber; ?>').hide();
        document.getElementById('tabbed-widget_<?php echo $randonNumber; ?>').innerHTML = '<div class="sesbasic_view_more_loading" id="loading_image_<?php echo $randonNumber; ?>" style="width:100%;"> <img src="<?php echo $this->layout()->staticBaseUrl; ?>application/modules/Sesbasic/externals/images/loading.gif" /> </div>';
        if(typeof(requestTab_<?php echo $randonNumber; ?>) != 'undefined')
        requestTab_<?php echo $randonNumber;
        ?>.cancel();
        if(typeof(requestViewMore_<?php echo $randonNumber; ?>) != 'undefined')
        requestViewMore_<?php echo $randonNumber;
        ?>.cancel();
        defaultOpenTab = valueTab;
        requestTab_<?php echo $randonNumber;
        ?> = new Request.HTML({
          method: 'post',
          'url': en4.core.baseUrl+"widget/index/mod/booking/name/<?php echo $this->widgetName; ?>/openTab/"+valueTab,
          'data': {
            format: 'html',  
            params : params<?php echo $randonNumber; ?>, 
            is_ajax : 1,
            defaultOpenTab : defaultOpenTab,
            searchParams:searchParams<?php echo $randonNumber; ?> ,
            identity : '<?php echo $randonNumber; ?>',
            height:'<?php echo $this->height;?>',
            widget_id: '<?php echo $this->widgetId;?>',
          }
          ,
          onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
            if(sesJqueryObject('#sesbasic_loading_cont_overlay_<?php echo $randonNumber?>').length)
              sesJqueryObject('#sesbasic_loading_cont_overlay_<?php echo $randonNumber?>').css('display','none');
            else
              sesJqueryObject('#loading_image_<?php echo $randonNumber; ?>').hide();
            sesJqueryObject('#error-message_<?php echo $randonNumber;?>').remove();
            var check = true;
            if(document.getElementById('tabbed-widget_<?php echo $randonNumber; ?>'))
            document.getElementById('tabbed-widget_<?php echo $randonNumber; ?>').innerHTML = responseHTML;
            var totalClassroom= sesJqueryObject('#tabbed-widget_<?php echo $randonNumber; ?>').find("#paginator_count_ajax_classroom_entry");
            sesJqueryObject('.sesbasic_view_type_<?php echo $randonNumber; ?>').find('#paginator_count_classrooms').html(totalClassroom.html());
            totalClassroom.remove();
            if(document.getElementById('appointment_pinboard_view_<?php echo $randonNumber;?>') && sesJqueryObject('.sesbasic_view_type_options_<?php echo $randonNumber; ?>').find('.active').attr('rel') == 'pinboard') {
              if(document.getElementById('appointment_pinboard_view_<?php echo $randonNumber;?>'))
              document.getElementById('appointment_pinboard_view_<?php echo $randonNumber;?>').style.display = 'block';
              pinboardLayout_<?php echo $randonNumber ?>('force','true');
            }
            sesJqueryObject('.sesbasic_view_more_loading_<?php echo $randonNumber;?>').hide();
            if(typeof viewMoreHide_<?php echo $randonNumber; ?> == 'function')
            viewMoreHide_<?php echo $randonNumber;?>();
          }
        }
        );
        requestTab_<?php echo $randonNumber;
        ?>.send();
        return false;
      }
    }
</script>
<script type="text/javascript">
  $$('.core_main_booking').getParent().addClass('active');
</script>
<?php endif;?>