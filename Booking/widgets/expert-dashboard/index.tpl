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

<?php
$timeslots = "";
$i=0;
if(!empty($_POST['time'])){
  $timeDuration = Engine_Api::_()->booking()->buildSlots($_POST['time'],date("H:i", strtotime($_POST['starttime'])),str_replace("00:00", "24:00",date('H:i', strtotime($_POST['endtime']))));
  foreach ($timeDuration['start_time'] as $key => $value) {
    $checked  = '';
    $i=$i+1;
    $rand=rand(10,999);
    if(array_key_exists(date('H:i',strtotime($value)), $arrayDurations) && in_array(str_replace("00:00", "24:00",date('H:i',strtotime($timeDuration['end_time'][$key]))), $arrayDurations)){
      $checked = "checked='checked'";
    }
    $timeslots .= "<input id='".($rand)."a' ".$checked." type='checkbox' name='timeSlots' value='".date('H:i', strtotime($value))."-".str_replace("00:00", "24:00",date('H:i', strtotime($timeDuration['end_time'][$key])))."' >";
    $timeslots .= "<label for='".($rand)."a'>".date('h:i A', strtotime($value))." - ".date('h:i A', strtotime($timeDuration['end_time'][$key]))."</label><br>"; 
   }
   echo "<div class='".((5<$i) ? 'scroll' : 'noscroll')."'>".$timeslots."</div>";
  die;
}
if($this->isAjax){
     echo $this->form->render($this); 
     die();
}
?>
<?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Booking/externals/styles/styles.css'); ?>
<?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/styles/datepicker/jquery.timepicker.css'); ?>
<?php $this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/datepicker/jquery.timepicker.js'); ?>

<div class="sesapmt_db_wrapper sesbasic_bxs sesbasic_clearfix">
  <?php if($this->data) { ?>
  <div class="sesapmt_db_head sesbasic_clearfix">
    <h2 class="floatL"><?php echo $this->translate('Expert Dashboard'); ?></h2>
    <span class="floatR"><a href="<?php echo $this->data->getHref();  ?>" class="sesapmt_btn sesbasic_animation"><span><?php echo $this->translate('View Your Expert Profile'); ?></span></a></span>
  </div>
  <?php } ?>
  <div class="sesapmt_panel_tabs">
    <ul class="sesapmt_panel_tabs_ul">
      <li class="selected"><a href="#services"><?php echo $this->translate('Services'); ?></a></li>
      <!--li><a href="#">Transactions</a></li-->
      <li><a href="#calendersettings"><?php echo $this->translate('Calendar Settings'); ?></a></li>
      <li><a href="#settings" id="mysettings"><?php echo $this->translate('My Settings'); ?></a></li>
      <?php $settings = Engine_Api::_()->getApi('settings', 'core'); ?>
      <?php if($settings->getSetting('booking.paymode')){ ?>
        <li><a href="#genrealdetails" id="accountdetails"><?php echo $this->translate('Account Details'); ?></a></li>
        <li><a href="#paymentdetails" id="paymentrequests"><?php echo $this->translate('Payment Requests'); ?></a></li>
        <li><a href="#paymentsreceived" id="paymenttransaction"><?php echo $this->translate('Payments Received'); ?></a></li>
      <?php } ?>
      <li><a href="<?php echo $this->url(array("action"=>'enabledme','professional_id'=>$this->professionalItemId),'booking_general',true); ?>" class="openSmoothbox"/><?php echo $this->translate('Become a normal user'); ?></a></li>
      <!--li><a href="#holidays">Holidays</a></li>
      <li><a href="#bookingslots">Booking Slots</a></li>
      <li><a href="#samples">Services Samples</a></li-->
    </ul>
  </div>
  <div class="sesapmt_panel_tabs_cont">
    <div id="genrealdetails" class="tab-content prelative"></div>
    <div id="paymentdetails" class="tab-content prelative"></div>
    <div id="paymentsreceived" class="tab-content prelative"></div>
    <div id="settings" class="tab-content prelative">
    	<div class="sesapmt_settings_form">
      </div>
    </div>
    <div id="calendersettings" class="tab-content prelative">
      <div class="sesapmt_panel_tabs">
        <ul class="sesapmt_panel_days_tabs" id="sesapmt_days">
          <li class="selected isData">
            <a href="#monday" rel='1'><?php echo $this->translate('Monday'); ?></a>
          </li>
          <li ><a href="#tuesday" rel='2' class="isDay"><?php echo $this->translate('Tuesday'); ?></a></li>
          <li ><a href="#wednesday" rel='3' class="isDay"><?php echo $this->translate('Wednesday'); ?></a></li>
          <li ><a href="#thursday" rel='4' class="isDay"><?php echo $this->translate('Thursday'); ?></a></li>
          <li ><a href="#friday" rel='5' class="isDay"><?php echo $this->translate('Friday'); ?></a></li>
          <li ><a href="#saturday" rel='6' class="isDay"><?php echo $this->translate('Saturday'); ?></a></li>
          <li ><a href="#sunday" rel='7' class="isDay"><?php echo $this->translate('Sunday'); ?></a></li>
        </ul>
        <div id="monday" class="tab-days calander_days" style="display:block;">
          <?php echo $this->form->render($this); ?> 
        </div>
        <div id="tuesday" class="tab-days calander_days" style="display:none;">
            <div class="sesbasic_loading_container"></div>
        </div>
        <div id="wednesday" class="tab-days calander_days" style="display:none;">
            <div class="sesbasic_loading_container"></div>
        </div>
        <div id="thursday" class="tab-days calander_days" style="display:none;">
            <div class="sesbasic_loading_container"></div>
        </div>
        <div id="friday" class="tab-days calander_days" style="display:none;">
            <div class="sesbasic_loading_container"></div>
        </div>
        <div id="saturday" class="tab-days calander_days" style="display:none;">
            <div class="sesbasic_loading_container"></div>
        </div>
        <div id="sunday" class="tab-days calander_days" style="display:none;">
            <div class="sesbasic_loading_container"></div>
        </div>
       </div>
    </div>
    <script type="text/javascript">
      en4.core.runonce.add(function() {
      mapLoad = false;
        initializeSesBookingMapList();
        });
    </script>
    <script type="text/javascript">
      en4.core.runonce.add(function() {
          var elem = getVisibleElement();
          var parentElem = elem.find('form').find('div').find('div').find('.form-elements').find("#allelements-wrapper").find("#fieldset-allelements");
          var starttimeID=parentElem.find("#starttime-wrapper").find("#starttime").attr('id');
          var endtimeID=parentElem.find("#endtime-wrapper").find("#endtime").attr('id');
          sesJqueryObject('#'+starttimeID+',#'+endtimeID+'').timepicker({
                 timeFormat: 'g:i a',
                 interval: 30,
                 minTime: '00',
                 maxTime: '24',
                 defaultTime: '00',
                 startTime: '00',
                 dynamic: true,
                 dropdown: true,
                 scrollbar: true
          });
        });
    </script>        
    <div class="sesapmt_db_services tab-content current" id="services">
    	<div class="sesapmt_dashboard_header">	
      	<h3><?php echo $this->translate('Services'); ?></h3>
      </div>
      <div class="sesapmt_dashboard_header_btn">
        <?php $viewer = Engine_Api::_()->user()->getViewer(); $totalservices = Engine_Api::_()->getDbTable('services', 'booking')->coutServices(); ?>
        <?php  if($totalservices!=Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'servicemax') || Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'servicemax')==0) { ?><a class="sesapmt_btn sesbasic_animation openSmoothbox" href="<?php echo $this->url(array("action"=>'create-service'),'booking_general',true); ?>"><i class="fa fa-plus"></i><span><?php echo $this->translate('Add New Service'); ?></span></a><?php }else { ?> <div class="tip"><span><?php echo $this->translate('You have already uploaded the maximum number of entries allowed.If you would like to upload a new entry, please delete an old one first.');?></span></div> <?php } ?>
      </div>
      <div class="sesapmt_db_services_list sesbasic_clearfix">
        <?php if(count($this->paginator)){ ?>
        <?php foreach ($this->paginator as $item): ?>  
        <div class="sesapmt_db_services_list_item sesbasic_clearfix">
        	<div class="sesapmt_db_services_list_item_thumb">
          	<a href="<?php echo $item->getHref(); ?>">
            	<img src="<?php echo Engine_Api::_()->storage()->get($item->file_id, '')->getPhotoUrl('thumb.profile'); ?>"/>
            </a>
          </div>
          <div class="sesapmt_db_services_list_item_info">
            <p class="sesapmt_db_services_list_item_title">
              <a href="<?php echo $item->getHref(); ?>"><?php echo $item->name; ?></a> 
            </p>
            <p class="sesapmt_db_services_list_item_charge">
              <span><?php echo Engine_Api::_()->booking()->getCurrencyPrice($item->price); ?></span>
              <sub>/ <?php echo $item->duration." ".(($item->timelimit=="h")?"Hour.":"Minutes."); ?></sub>
            </p>
            <p class="sesapmt_db_services_list_item_des"><?php echo $item->description; ?></p>
            <p class="sesapmt_db_services_list_item_options">
              <?php $viewer = Engine_Api::_()->user()->getViewer();  if(Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'servedit')) { ?>
                <a href="<?php echo $this->url(array("action"=>'create-service','service_id'=>$item->getIdentity()),'booking_general',true); ?>" class="edit openSmoothbox"><i class="fas fa-pencil-alt"></i></a>
              <?php } ?>
              <?php $viewer = Engine_Api::_()->user()->getViewer();  if(Engine_Api::_()->authorization()->getPermission($viewer, 'booking', 'servdelete')) { ?>
                <a href="<?php echo $this->url(array("action"=>'delete-service','service_id'=>$item->getIdentity(),'professional_id'=>$this->professional_id),'booking_general',true); ?>" class="delete openSmoothbox"><i class="fas fa-trash"></i></a>
              <?php } ?>
            </p>
        	</div>    
        </div>
        <?php endforeach; ?>
          <?php } else { ?>
            <div class="tip"><span><?php echo $this->translate('You have not created any service yet. Get started by creating one.'); ?></span></div>
          <?php } ?>
      </div> 
    </div>

    <div id="holidays" class="sesapmt_db_holidays tab-content">
      <div class="sesapmt_dashboard_header">	<h3><?php echo $this->translate('Holidays');?></h3></div>
      <p><?php echo $this->translate('Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.');?></p>
      
      <div class="sesapmt_db_holidays_cont">
        <div class="sesapmt_mini_calendar sesapmt_mini_holiday_calendar">
          <div class="sesapmt_mini_calendar_header">
            <a href="" class="leftbtn"><i class="fa fa-angle-left"></i></a>
            <a href="" class="rightbtn"><i class="fa fa-angle-right"></i></a>
            <span>July, 2017</span>
          </div>
          <div class="sesapmt_mini_calendar_main">
            <table>
              <thead>
                <tr>
                  <th><?php echo $this->translate('Mon');?></th>
                  <th><?php echo $this->translate('Tue');?></th>
                  <th><?php echo $this->translate('Wed');?></th>
                  <th><?php echo $this->translate('Thu');?></th>
                  <th><?php echo $this->translate('Fri');?></th>
                  <th><?php echo $this->translate('Sat');?></th>
                  <th><?php echo $this->translate('Sun');?></th>
                </tr>  
              </thead>
              <tbody>
                <tr>
                  <td class="date disabled"><span>26</span></td>
                  <td class="date disabled"><span>27</span></td>
                  <td class="date disabled"><span>28</span></td>
                  <td class="date disabled"><span>29</span></td>
                  <td class="date disabled"><span>30</span></td>
                  <td class="date"><a href="">1</a></td>
                  <td class="date holiday"><span>2</span></td>
                </tr>
                <tr>
                  <td class="date"><a href="">3</a></td>
                  <td class="date"><a href="">4</a></td>
                  <td class="date"><a href="">5</a></td>
                  <td class="date"><a href="">6</a></td>
                  <td class="date"><a href="">7</a></td>
                  <td class="date"><a href="">8</a></td>
                  <td class="date holiday"><span>9</span></td>
                </tr>
                <tr>
                  <td class="date"><a href="">10</a></td>
                  <td class="date"><a href="">11</a></td>
                  <td class="date"><a href="">12</a></td>
                  <td class="date"><a href="">13</a></td>
                  <td class="date"><a href="">14</a></td>
                  <td class="date"><a href="">15</a></td>
                  <td class="date holiday"><span>16</span></td>
                </tr>
                <tr>
                  <td class="date "><a href="">17</a></td>
                  <td class="date"><a href="">18</a></td>
                  <td class="date ismarked"><a href="">19</a></td>
                  <td class="date"><a href="">20</a></td>
                  <td class="date"><a href="">21</a></td>
                  <td class="date"><a href="">22</a></td>
                  <td class="date holiday"><span>23</span></td>
                </tr>
                <tr>
                  <td class="date"><a href="">24</a></td>
                  <td class="date"><a href="">25</a></td>
                  <td class="date"><a href="">26</a></td>
                  <td class="date"><a href="">27</a></td>
                  <td class="date"><a href="">28</a></td>
                  <td class="date"><a href="">29</a></td>
                  <td class="date holiday"><span>30</span></td>
                </tr>
                <tr>
                  <td class="date"><a href="">31</a></td>
                  <td class="date disabled"><span>1</span></td>
                  <td class="date disabled"><span>2</span></td>
                  <td class="date disabled"><span>3</span></td>
                  <td class="date disabled"><span>4</span></td>
                  <td class="date disabled"><span>5</span></td>
                  <td class="date disabled"><span>6</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div id="bookingslots" class="tab-content">5</div>
    <div id="samples" class="sesapmt_db_samples tab-content">
      <div class="sesapmt_dashboard_header">	<h3><?php echo $this->translate('Samples');?></h3></div>
      <p><?php echo $this->translate('Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.');?></p>  
      <div class="sesapmt_dashboard_header_btn">
          <span class="sesapmt_btn sesbasic_animation"><i class="fa fa-plus openSmoothbox"></i><span><?php echo $this->translate('Add New Sample'); ?></span></span>
      </div>
      <div class="sesapmt_db_portfolio_listings">
        <ul class="sesbasic_clearfix">
          <li class="sesapmt_db_portfolio_item sesbasic_clearfix">
            <article>
              <span class="sesapmt_db_portfolio_item_thumb bg_item_photo" style="background-image:url(http://cdn.thumbr.io/f7a8edda492ef5318847abd97abc73e5/KhPZbWboUluRxv8PG87L/https%3A%2F%2Fcdn.dribbble.com/users/148670/screenshots/3623360/gradients.png/400/freebbble-thumb.jpg);"></span>
              <div class="sesapmt_db_portfolio_item_cont sesbasic_animation">
                <p class="_caption"><?php echo $this->translate('Gramercy Park Hotel - Ruby on Rails'); ?></p>
                <p class="_options sesbasic_clearfix">
                  <span class="floatL"><input id="db_sample_item_1" type="checkbox" name="db_sample_item" /><label for="db_sample_item_1"><?php echo $this->translate('Show in Listing'); ?></label></span>
                  <span class="floatR">
                    <a href="" title="Edit"><i class="fa fa-pencil"></i></a>
                    <a href="" title="Delete"><i class="fa fa-trash"></i></a>
                  </span>
                </p>
              </div>
            </article>
          </li>
          <li class="sesapmt_db_portfolio_item sesbasic_clearfix">
            <article>
              <span class="sesapmt_db_portfolio_item_thumb bg_item_photo" style="background-image:url(http://cdn.thumbr.io/d9fae67625570a48639c428bcf55e9d5/KhPZbWboUluRxv8PG87L/https%3A%2F%2Fimages.pexels.com/photos/442404/succulents-hands-woman-female-442404.jpeg%3Fw%3D940%26amp%3Bh%3D650%26amp%3Bauto%3Dcompress%26amp%3Bcs%3Dtinysrgb/400/pexels-thumb.jpg);"></span>
              <div class="sesapmt_db_portfolio_item_cont sesbasic_animation">
                <p class="_caption"><?php echo $this->translate('Gramercy Park Hotel - Ruby on Rails'); ?></p>
                <p class="_options sesbasic_clearfix">
                  <span class="floatL"><input id="db_sample_item_2" type="checkbox" name="db_sample_item" /><label for="db_sample_item_2"><?php echo $this->translate('Show in Listing'); ?></label></span>
                  <span class="floatR">
                    <a href="" title="Edit"><i class="fa fa-pencil"></i></a>
                    <a href="" title="Delete"><i class="fa fa-trash"></i></a>
                  </span>
                </p
              ></div>
            </article>
          </li>
          <li class="sesapmt_db_portfolio_item sesbasic_clearfix">
            <article>
              <span class="sesapmt_db_portfolio_item_thumb bg_item_photo" style="background-image:url(http://img.freepik.com/free-vector/red-and-yellow-watercolor-texture-background_1035-9292.jpg?size=500&amp;ext=jpg);"></span>
              <div class="sesapmt_db_portfolio_item_cont sesbasic_animation">
                <p class="_caption"><?php echo $this->translate('Gramercy Park Hotel - Ruby on Rails'); ?></p>
                <p class="_options sesbasic_clearfix">
                  <span class="floatL"><input id="db_sample_item_3" type="checkbox" name="db_sample_item" /><label for="db_sample_item_3"><?php echo $this->translate('Show in Listing'); ?></label></span>
                  <span class="floatR">
                    <a href="" title="Edit"><i class="fa fa-pencil"></i></a>
                    <a href="" title="Delete"><i class="fa fa-trash"></i></a>
                  </span>
                </p
              ></div>
            </article>
          </li>
          <li class="sesapmt_db_portfolio_item sesbasic_clearfix">
            <article>
              <span class="sesapmt_db_portfolio_item_thumb bg_item_photo" style="background-image:url(http://cdn.thumbr.io/b75b6d15c339f75a29e68ce394fee8ce/KhPZbWboUluRxv8PG87L/https%3A%2F%2Fwww.pixeden.com/media/k2/galleries/1089/001-basic-stationery-brandingbrochure-notebook-tape-clip-businesscard-psd-mockup.jpg/400/pixeden-thumb.jpg);"></span>
              <div class="sesapmt_db_portfolio_item_cont sesbasic_animation">
                <p class="_caption"><?php echo $this->translate('Gramercy Park Hotel - Ruby on Rails'); ?></p>
                <p class="_options sesbasic_clearfix">
                  <span class="floatL"><input id="db_sample_item_4" type="checkbox" name="db_sample_item" /><label for="db_sample_item_4"><?php echo $this->translate('Show in Listing'); ?></label></span>
                  <span class="floatR">
                    <a href="" title="Edit"><i class="fa fa-pencil"></i></a>
                    <a href="" title="Delete"><i class="fa fa-trash"></i></a>
                  </span>
                </p
              ></div>
            </article>
          </li>
        </ul>
      </div>      
    </div>
  </div>
</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<script type="text/javascript">
$(document).ready(function() {
  // var hash = window.location.hash;
  //   $(hash).css("display", "block");
  //   if(hash){
  //     $("#services").removeClass("current");
  //   }
    $(".sesapmt_panel_tabs_ul a").click(function(event) {
        event.preventDefault();
        $(this).parent().addClass("selected");
        $(this).parent().siblings().removeClass("selected");
        var tab = $(this).attr("href");
        $(".tab-content").not(tab).css("display", "none");
        $(tab).fadeIn();
    });
       
});
function showPaymentTab() {
  $("#accountdetails").click();
  loadPaymentAccountDetails();
}
function getVisibleElement(){
    var calendersettings = sesJqueryObject('#calendersettings').find('.sesapmt_panel_tabs').find('.calander_days');
    var elem;
    calendersettings.each(function(index){
        if(sesJqueryObject(this).css('display') == "block")
            elem = sesJqueryObject(this);
    });
    return elem;
}
function loaddataindropdown(time,starttime,endtime){
    var elem = getVisibleElement();
    var parentElem = elem.find('form').find('div').find('div').find('.form-elements');
    var time = time;
    var starttime = starttime;
    var endtime=endtime;
    (new Request.HTML({
      method: 'post',
      'url': en4.core.baseUrl + 'widget/index/mod/booking/name/expert-dashboard',
      'data': {
        format: 'html',
        time:time,
        isTime:1,
        starttime:starttime,
        endtime:endtime,
    },
    onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
          parentElem.find('#timeslots-element').html(responseHTML);
        return true;
        }
      })).send();
}
sesJqueryObject(document).on('change','#duration',function () {
    var elem = getVisibleElement();
    var parentElem = elem.find('form').find('div').find('div').find('.form-elements').find("#allelements-wrapper").find("#fieldset-allelements");
    var time = parentElem.find("#duration-element").find('#duration').val();
    var starttime = parentElem.find("#starttime-wrapper").find("#starttime").val();
    var endtime = parentElem.find("#endtime-wrapper").find('#endtime').val();
    (new Request.HTML({
    method: 'post',
    'url': en4.core.baseUrl + "widget/index/mod/booking/name/expert-dashboard",
    'data': {
      format: 'html',
      time:time,
      starttime:starttime,
      endtime:endtime
    },
    onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
        parentElem.find('#timeslots-element').html(responseHTML);
        return true;
        }
    })).send();
});
sesJqueryObject(document).on('click','#refreshslots',function () {
    sesJqueryObject("#duration").change();
});
</script>

<script type="text/javascript">
    var requestForm ;
    sesJqueryObject(document).on('click','#sesapmt_days li a',function(e){
    e.preventDefault();
    sesJqueryObject(this).parent().addClass("selected");
    sesJqueryObject(this).parent().siblings().removeClass("selected");
    //var weekday=sesJqueryObject('.selected.isData a').html()
    var tab = sesJqueryObject(this).attr("href");
    sesJqueryObject(".tab-days").not(tab).css("display", "none");
    sesJqueryObject(tab).fadeIn();
    if(sesJqueryObject(this).parent().hasClass('isData')){
        return;
    }
    if(typeof requestForm != "undefined")
        requestForm.cancel();

    var rel_id=sesJqueryObject(this).attr('rel');
    var object = sesJqueryObject(this);
    requestForm = (new Request.HTML({
    method: 'post',
    'url': en4.core.baseUrl + "widget/index/mod/booking/name/expert-dashboard",
    'data': {
      format: 'html',
      dayid:rel_id,
      isAjax:1,
    },
    onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
        object.parent().addClass('isData');
        var tab = object.attr("href");
        sesJqueryObject(tab).html(responseHTML);
        var elem = getVisibleElement();
        var parentElem = elem.find('form').find('div').find('div').find('.form-elements').find("#allelements-wrapper").find("#fieldset-allelements");
        elem.find('form').find('div').find('div').find('.form-elements').find('#offday').change();
        var starttimeID=parentElem.find("#starttime-wrapper").find("#starttime").attr('id');
        var endtimeID=parentElem.find("#endtime-wrapper").find("#endtime").attr('id');
        sesJqueryObject('#'+starttimeID+',#'+endtimeID+'').timepicker({
            timeFormat: 'g:i a',
            interval: 30,
            minTime: '00',
            maxTime: '24',
            defaultTime: '00',
            startTime: '00',
            dynamic: true,
            dropdown: true,
            scrollbar: true
            });
          return true;
        }
      })).send();
   });
en4.core.runonce.add(function() {
    var check=<?php echo $this->isOff; ?>;
    if(check){
        sesJqueryObject('#offday').change();
    }
});
sesJqueryObject(document).on('change','#offday',function (e) {
    var elem = getVisibleElement();
    var parentElem = elem.find('form').find('div').find('div').find('.form-elements');
    if(parentElem.find('#offday').val()=="1") {
        parentElem.find('#allelements-wrapper').css("display","none");
    }else if(sesJqueryObject(this).val()=="0") {
        parentElem.find('#allelements-wrapper').css("display","block");
    }
});
sesJqueryObject(document).on('change','#selectall',function (e) {
    var elem = getVisibleElement();
    var parentElem = elem.find('form').find('div').find('div').find('.form-elements').find("#allelements-wrapper").find("#fieldset-allelements");
    parentElem.find("#selectall-wrapper").find("input:checkbox").prop('checked', this.checked)
    parentElem.find("#timeslots-wrapper").find("#timeslots-element").find("input[name='timeSlots']").prop('checked', this.checked);
});
sesJqueryObject(document).on('click','#saveData',function (e) {
    var elem = getVisibleElement();
    var parentElem = elem.find('form').find('div').find('div').find('.form-elements').find("#allelements-wrapper").find("#fieldset-allelements");
    var dayID=sesJqueryObject('.selected.isData a').attr('rel');
    var time = parentElem.find('#duration').val();
    var start = parentElem.find('#starttime').val();
    var end = parentElem.find('#endtime').val();
    var offday=elem.find('form').find('div').find('div').find('.form-elements').find('#offday').val();
    if(offday==1){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                elem.find('form').find('div').find('div').find('.form-elements').find("#demo").html(this.responseText);
            }
            if(this.readyState==1){
                elem.find('form').find('div').find('div').find('.form-elements').find("#demo").html('waiting....');
            }
        };
        var url = en4.core.baseUrl + 'booking/ajax/savecalenderoffsettings/';
        url+='dayid/'+dayID;
        url+='/time/'+time;
        url+='/start/'+start;
        url+='/end/'+end;
        url+='/offday/'+offday;
        xhttp.open("GET",url, true);
        xhttp.send();
        return;
    }
    var items=parentElem.find('[name="timeSlots"]:checkbox');
    var alLeastOneSlot=0;
    var timeslotsarray=[];
      for(var i=0; i<items.length; i++){
        if(items[i].type=='checkbox' && items[i].checked==true)
          {timeslotsarray.push(items[i].value+"_true");alLeastOneSlot+=1;}
        else
          {timeslotsarray.push(items[i].value+"_false");}
    }
    if(alLeastOneSlot==0){
        alert('please select atleast one Slot');
        return;
    }

    var servicesvalues = [];
    var atLeastoneService=0;
    parentElem.find(".chkListItem").each(function(){
       if(sesJqueryObject(this).is(":checked")){
        servicesvalues.push(sesJqueryObject(this).attr('id')+"_true");
        atLeastoneService+=1;
       }else{
            servicesvalues.push(sesJqueryObject(this).attr('id')+"_false");
       }
    });
    if(atLeastoneService==0){
        alert('please select atleast one service');
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            elem.find('form').find('div').find('div').find('.form-elements').find("#demo").html(this.responseText);
        }
        if(this.readyState==1){
            elem.find('form').find('div').find('div').find('.form-elements').find("#demo").html('waiting....');
        }
    };
    var url = en4.core.baseUrl + 'booking/ajax/savecalendersettings/';
    url+='dayid/'+dayID;
    url+='/time/'+time;
    url+='/start/'+start;
    url+='/end/'+end;
    url+='/offday/'+offday;
    url+='/timeslotsarray/'+timeslotsarray;
    url+='/servicesvalues/'+servicesvalues;
    xhttp.open("GET",url, true);
    xhttp.send();
});

sesJqueryObject(document).on('click','#accountdetails',function(e){
  loadPaymentAccountDetails();
});
function loadPaymentAccountDetails() {
  sesJqueryObject("#genrealdetails").html('<div class="sesbasic_loading_container" id="sesdashboard_overlay_content" style="display:block;"></div>');
  (new Request.HTML({
    method: 'post',
    'url': en4.core.baseUrl + "booking/dashboard/account-details",
    data:{
      is_ajax_content:true,
    },
    onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
        var myVar = sesJqueryObject(responseHTML).find('#booking_accountdetails').html();
        sesJqueryObject("#genrealdetails").html(myVar);
        return true;
        }
    })).send();
}

sesJqueryObject(document).on('click','.sesbasic_dashboard_nopropagate_content',function(e){
  sesJqueryObject("#genrealdetails").html('<div class="sesbasic_loading_container" id="sesdashboard_overlay_content" style="display:block;"></div>');
  var gateway_type = sesJqueryObject(this).attr("data-gateway_type");
  (new Request.HTML({
    method: 'post',
    'url': en4.core.baseUrl + "booking/dashboard/account-details",
    data:{
      is_ajax_content : true,
      gateway_type : gateway_type
    },
    onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
        var myVar = sesJqueryObject(responseHTML).find('#booking_accountdetails').html();
        sesJqueryObject("#genrealdetails").html(myVar);
        return true;
        }
    })).send();
});

// save payment details account-details
var submitFormAjax;
sesJqueryObject(document).on('submit','#booking_ajax_form_submit',function(e){
	e.preventDefault();
	  if(!sesJqueryObject('#sesdashboard_overlay_content').length)
				sesJqueryObject('#booking_ajax_form_submit').before('<div class="sesbasic_loading_cont_overlay" id="sesdashboard_overlay_content" style="display:block;"></div>');
			else
				sesJqueryObject('#sesdashboard_overlay_content').show();
			//submit form 
			var form = sesJqueryObject('#booking_ajax_form_submit');
			var formData = new FormData(this);
			formData.append('is_ajax', 1);
			submitFormAjax = sesJqueryObject.ajax({
            type:'POST',
            url: sesJqueryObject(this).attr('action'),
            data:formData,
            cache:false,
            contentType: false,
            processData: false,
            success:function(data){
							sesJqueryObject('#sesdashboard_overlay_content').hide();
							var dataJson = data;
						try{
							var dataJson = JSON.parse(data);
						}catch(err){
							//silence
						}
							if(dataJson.redirect){
								sesJqueryObject('#'+dataJson.redirect).trigger('click');
								return;
							}else{
								if(data){
										sesJqueryObject('#genrealdetails').html(data);
								}else{
									alert('Something went wrong,please try again later');	
								}
							}
						},
            error: function(data){
            	//silence
						}
        });
		// }
});

// retrive professional mysettings details.
sesJqueryObject(document).on('click','#mysettings',function(e){
  sesJqueryObject("#settings").html('<div class="sesbasic_loading_container" id="sesdashboard_overlay_content" style="display:block;"></div>');
  (new Request.HTML({
    method: 'post',
    'url': en4.core.baseUrl + "booking/dashboard/my-settings",
    data:{
      is_ajax_content:true,
    },
    onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
        var myVar = sesJqueryObject(responseHTML).find('#professionalMySettings').html();
        sesJqueryObject("#settings").html(myVar);
        initializeSesBookingMapList();
        return true;
        }
    })).send();
});
// save professional mysettings details.
var submitmysettingsFormAjax;
sesJqueryObject(document).on('submit','#booking_mysettings_ajax_form_submit',function(e){
	e.preventDefault();
	  if(!sesJqueryObject('#sesdashboard_overlay_content').length)
				sesJqueryObject('#booking_mysettings_ajax_form_submit').before('<div class="sesbasic_loading_container" id="sesdashboard_overlay_content" style="display:block;"></div>');
			else
				sesJqueryObject('#sesdashboard_overlay_content').show();
			//submit form 
			var form = sesJqueryObject('#booking_mysettings_ajax_form_submit');
			var formData = new FormData(this);
			formData.append('is_ajax', 1);
			submitmysettingsFormAjax = sesJqueryObject.ajax({
            type:'POST',
            url: sesJqueryObject(this).attr('action'),
            data:formData,
            cache:false,
            contentType: false,
            processData: false,
            success:function(data){
							sesJqueryObject('#sesdashboard_overlay_content').hide();
							var dataJson = data;
						try{
							var dataJson = JSON.parse(data);
						}catch(err){
							//silence
						}
							if(dataJson.redirect){
								sesJqueryObject('#'+dataJson.redirect).trigger('click');
								return;
							}else{
								if(data){
										sesJqueryObject('#sesapmt_settings_form').html(data);
                    sesJqueryObject('#mysettings').trigger('click');
								}else{
									alert('Something went wrong,please try again later');	
								}
							}
						},
            error: function(data){
            	//silence
						}
        });
		// }
});

sesJqueryObject(document).on('click','#paymentrequests',function(e){
  sesJqueryObject("#paymentdetails").html('<div class="sesbasic_loading_container" id="sesdashboard_overlay_content" style="display:block;"></div>');
  (new Request.HTML({
    method: 'post',
    'url': en4.core.baseUrl + "booking/dashboard/payment-requests",
    data:{
      is_ajax_content:true,
    },
    onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
        var myVar = sesJqueryObject(responseHTML).find('#booking_paymentrequests').html();
        sesJqueryObject("#paymentdetails").html(myVar);
        return true;
        }
    })).send();
});

// payment-transaction
sesJqueryObject(document).on('click','#paymenttransaction',function(e){
  sesJqueryObject("#paymentsreceived").html('<div class="sesbasic_loading_container" id="sesdashboard_overlay_content" style="display:block;"></div>');
  (new Request.HTML({
    method: 'post',
    'url': en4.core.baseUrl + "booking/dashboard/payment-transaction",
    data:{
      is_ajax_content:true,
    },
    onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
        var myVar = sesJqueryObject(responseHTML).find('#booking_paymenttransaction').html();
        sesJqueryObject("#paymentsreceived").html(myVar);
        return true;
        }
    })).send();
});
</script>
<script type="text/javascript">
  $$('.core_main_booking').getParent().addClass('active');
</script>
