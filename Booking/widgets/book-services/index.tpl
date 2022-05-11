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

<?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Booking/externals/styles/styles.css'); ?>
<?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/styles/datepicker/bootstrap-datepicker.css'); ?>
<?php $this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/datepicker/bootstrap-datepicker.js'); ?>
<?php $base_url = $this->layout()->staticBaseUrl;
$this->headScript()
->appendFile($base_url . 'externals/autocompleter/Observer.js')
->appendFile($base_url . 'externals/autocompleter/Autocompleter.js')
->appendFile($base_url . 'externals/autocompleter/Autocompleter.Local.js')
->appendFile($base_url . 'externals/autocompleter/Autocompleter.Request.js');
?>
<?php if(!empty($this->is_ajax)){ echo $this->form->render($this);die(); }?>
<style type="text/css">
  #getDate{
    display: block !important;
  }
</style>
<div class="sesapmt_booking_container sesbasic_bxs">
	<div class="_left">
    <div class="sesapmt_booking_step sesapmt_booking_step_choose_date">
      <form method="post">
        <div class="sesapmt_booking_step_choose_date_field">
          <div class="label"><?php echo $this->translate("Select the date to book services");?></div>
          <input class="sesbasic_bg" type="text" name="getDate" id="getDate" value="<?php echo !empty($_POST['getDate']) ? date('Y-m-d',strtotime($_POST['getDate'])) : date('Y-m-d',time()); ?>"/>
        </div>
        <div class="sesapmt_booking_step_btn">
          <button type="submit"><?php echo $this->translate('submit'); ?></button>
        </div>
      </form>
    </div>
  </div>
  <?php 
  date_default_timezone_set($this->professionalTimezone);
  $professional = date("d-m-Y H:i:s");  

  date_default_timezone_set($this->viewerTimezone);
  $viewer = date("d-m-Y H:i:s");  

  $date1=date_create($professional);
  $date2=date_create($viewer);
  $diff=date_diff($date1,$date2);
  if(!(strtotime($date1->format('Y-m-d H:i:s')) == strtotime($date2->format('Y-m-d H:i:s')))){
    ?>
    <div class="_right">
     <div class="sesapmt_booking_step_info">
       <p class="sesapmt_timezone">
        <?php echo $this->translate("<b>%s Timezone:</b> <span id='professionalTimezone'>%s</span>",$this->professionalName,$this->professionalTimezone);?>
      </p>
      <p class="sesapmt_timezone">
      	<?php echo $this->translate("<b>Your Timezone:</b> <span id='viewerTimezone'>%s</span>",$this->viewerTimezone);?>
      </p>
      <?php
      echo $diff->format("<p class='bold'>You are %R %a days %h hours %i minutes ".(($diff->format("%R")=='+') ? 'ahead' : 'before')."</p>");
      ?>
    </div>
  </div>
<?php } ?>
</div>
<div class="sesapmt_booking_container sesbasic_bxs">
	<div class="_left">
		<?php if(count($this->settingdurations)){ ?>
      <div class="sesapmt_booking_step sesapmt_booking_step_choose_time">
      	<div class="label"><?php echo $this->translate("Select the time for service");?></div>
        <div class="sesbasic_bg sesapmt_booking_step_choose_time_list">
          <?php foreach ($this->settingdurations as $key => $item):?>
            <?php $professioanlTmiezone=date('h:i A',strtotime($item->starttime));
            $viewerTmiezone=date("h:i A", strtotime($diff->format("%R%a days %h hours %i minutes %s seconds"),strtotime($item->starttime))); ?>
            <div class="sesapmt_booking_step_choose_time_list_item">
              <div class="_info">
                <p><span class="_l"><?php echo $this->translate('Professional:'); ?></span><span class="_v"><?php echo $professioanlTmiezone." - ". date('h:i A',strtotime($item->endtime));?></span></p>
                <p><span class="_l"><?php echo $this->translate('MY Timezone:'); ?></span><span class="_v"><?php echo $viewerTmiezone; ?></span></p>
              </div>
              <div class="_btn">
              	<button <?php foreach($this->slotsInAppointments as $slots){ if($slots==$item->starttime) { echo "class='_disabled' disabled='disabled'"; }} ?> onclick="showAppointmentdata(<?php echo $item->setting_id.",'".$item->starttime."','".date('H:i',strtotime($viewerTmiezone))."'"; ?>,this)"><?php echo $this->translate('Book'); ?></button>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    <?php } else { ?>
    	<p class='tip'><span><?php echo $this->translate('Currently, this professional is not available for booking.'); ?></span></p>
    <?php } ?>
    <div id="formdata" class="sesapmt_booking_step sesapmt_booking_step_choose_service" style="display:none;">
    </div>
  </div>
</div>      
<script>
  var professioanltime;
  var viewertime;
  function showAppointmentdata(setting_id,professioanltimejs,viewertimejs,bcolor){
    bcolor.style.color = "gray";
    var getDate = document.getElementById("getDate").value;
    var service_id = '<?php echo $this->service_id; ?>';
    professioanltime=professioanltimejs;
    viewertime=viewertimejs;
    sesJqueryObject("#formdata").css("display", "block");
    sesJqueryObject("#formdata").html('<div class="sesbasic_loading_container"></div>');
    (new Request.HTML({
    method: 'post',
    'url': en4.core.baseUrl + "widget/index/mod/booking/name/book-services",
    'data': {
      format: 'html',
      is_ajax:1,
      setting_id:setting_id,
      getDate:getDate,
      service_id : service_id,
      professional:<?php echo $this->professionalId; ?>
    },
    onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
          sesJqueryObject("#formdata").html(responseHTML);
          sesJqueryObject("#appointmentrequest").css("display","none");
          loadAutocomplete();
        return true;
      }
    })).send();
  }
  function loadAutocomplete(){
    var Searchurl = '<?php echo $this->url(array('module' => 'booking', 'controller' => 'ajax', 'action' => 'getidbyname'), 'default', true) ?>';
    var contentAutocomplete = new Autocompleter.Request.JSON('bookto', Searchurl, {
      'postVar': 'text',
      'minLength': 1,
      'selectMode': 'pick',
      'autocompleteType': 'tag',
      'customChoices': true,
      'filterSubset': true,
      'multiple': false,
      'className': 'sesbasic-autosuggest',
      'injectChoice': function(token) {
        var choice = new Element('li', {
          'class': 'autocompleter-choices',
          'id':token.label,
          'data-user-id' : token.id
        });
        new Element('div', {
          'html': this.markQueryValue(token.label),
          'class': 'autocompleter-choice'
        }).inject(choice);
        this.addChoiceEvents(choice).inject(this.choices);
        choice.store('autocompleteChoice', token);
      }
    });
    contentAutocomplete.addEvent('onSelection', function(element, selected, value, input) {
      var bookForUserId = sesJqueryObject(selected).attr("data-user-id");
      sesJqueryObject("#bookto_userid").val(bookForUserId);
    });
    contentAutocomplete.addEvent('onSelect', function(element, selected, value, input) {
      var bookForUserId = sesJqueryObject(selected).attr("data-user-id");
      sesJqueryObject("#bookto_userid").val(bookForUserId);
    });
  }
</script>
<script type="text/javascript">
  en4.core.runonce.add(function() {
    var sesstartCalanderDate = new Date('<?php echo date("m/d/Y");  ?>');
    sesJqueryObject('#getDate').datepicker({
      format: 'yyyy-m-d',
      weekStart: 1,
      autoclose: true,
      startDate: sesstartCalanderDate,
      todayHighlight:true,
      todayBtn:true
    }).change(dateChanged)
    .on('changeDate', dateChanged);
  });
  function dateChanged() {
    var dt=sesJqueryObject('#getDate').val();
    sesJqueryObject('#getDate').val(dt);
  }
</script>
<script>
  var servicesData = []; 
  var userID=<?php  echo $this->userId; ?>;
  function display(a){
    var hours = Math.trunc(a/60);
    var minutes = a % 60;
    return (((hours==0)?"":hours+" hours ")+""+((minutes==0)?"":minutes+" minutes"));
  }
  function calc(){
    var bookto=sesJqueryObject("#bookto").val();
    var booktoId=sesJqueryObject("#bookto_userid").val();
    console.log(booktoId);
    if(bookto===""){
      alert("please fill booking for.");
      return;
    }
    if(booktoId==0){
      alert("Member doesn't exists and you will not be able to book the service.");
      return;
    }
    var alLeastOneSlot=0;
    var items=document.getElementsByName('services[]');
    for(var i=0; i<items.length; i++){
      if(items[i].type=='checkbox' && items[i].checked==true)
        {alLeastOneSlot+=1;}
    }
    if(alLeastOneSlot==0){
      alert('please select atleast one service');
      return;
    }
    servicesData=[];
    var startcolumn=professioanltime;
    var timeslotsarray="";
    for(var i=0; i<items.length; i++){
      if(items[i].type=='checkbox' && items[i].checked==true)
        {timeslotsarray+=(items[i].value)+"*";}
    }
    var a=timeslotsarray.split("*");
    var s;
    var price=0;
    var time=0;
    var currency="";
    for(i=0;i<a.length-1;i++){
      s=a[i].split("|");
      servicesData.push(s[0]);
      currency=s[1].substring(0,1);
      s[1] = s[1].replace(",","")
      price+=parseFloat(s[1].substring(1, s[1].length));
      time+=parseInt(s[2])
    }
    sesJqueryObject("#totalestimate").html("<div class='sesbasic_bg'><div><span>Total time :</span>"+display(time)+"</span></div><div><span>"+"Total Price :"+currency+""+price+"</span></div>");
    sesJqueryObject('input[type="hidden"][class="totalprice"]').prop("value",price);
    sesJqueryObject('input[type="hidden"][class="totaltime"]').prop("value",display(time));
    sesJqueryObject('input[type="hidden"][class="professioanltime"]').prop("value",professioanltime);
    sesJqueryObject('input[type="hidden"][class="viewertime"]').prop("value",viewertime);
    var professionalId=<?php echo $this->professionalId; ?>;
    var settingid=<?php echo (!empty($this->settingid)) ? $this->settingid : "0"; ?>;
    (new Request.HTML({
      method: 'post',
      'url': en4.core.baseUrl + "booking/ajax/blockslots/",
      'data': {
        format: 'html',
        startcolumn:startcolumn,
        totaltime:time,
        professionalId:professionalId,
        settingid:settingid,
        slotsInAppointments:<?php echo json_encode($this->slotsInAppointments); ?>
      },
      onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
        console.log(responseHTML);
        if(responseHTML==="0"){
          sesJqueryObject("#totalestimate").html("<p class='tip'><span>Time duration not in range</span></p>");
          sesJqueryObject("#appointmentrequest").css("display","none");
        }else{
          sesJqueryObject('input[type="hidden"][class="bookingendtime"]').prop("value",responseHTML);
          sesJqueryObject("#appointmentrequest").css("display","block");
        }
        return true;
      }
    })).send();
  }
  sesJqueryObject(document).on('click','#appointmentrequest',function (e) {
    var booktoId=sesJqueryObject("#bookto_userid").val();
    if(booktoId==0){
      alert("Member doesn't exists and you will not be able to book the service.");
      return;
    }
    var isOnlinePayment = '<?php echo $this->isOnlinePayment; ?>';
    var bookto=sesJqueryObject("#bookto").val();
    var bookForOther = '<?php if($this->professionalId==$this->userId) echo $this->translate('true'); else $this->translate('false'); ?>'
    var message = 'Are you sure want to take appointment?';
    if(isOnlinePayment=='1'){
      message = message.replace("?","");
      message+=" and process for pay?";
    }if(bookForOther=='true'){
      message = "Are you sure want to book appointment for member?";
    }
    if(bookto===""){
      alert("please fill booking for.");
      return;
    }
    if (confirm(message)) {} else {
      return;
    }
    var professionalTimezone = <?php echo "'".$this->professionalTimezone."'";?>;
    var viewerTimezone =<?php echo "'".$this->viewerTimezone."'";?>;
    var professionalId=<?php echo $this->professionalId; ?>;
        //var userId=<?php echo $this->userId; ?>;
        var serviceIds=servicesData;
        var userName=<?php if($this->professionalId!=$this->userId){ echo "'".$this->userName."'";} else{ ?>sesJqueryObject("#bookto").val()<?php } ?>;
        var userId = <?php if($this->professionalId==$this->userId) { ?> userName; <?php } else { ?> userID <?php } ?>;
        var date = document.getElementById("getDate").value;
        var bookingendtime=document.getElementById("bookingendtime").value;
        (new Request.HTML({
          method: 'post',
          'url': en4.core.baseUrl + "booking/ajax/bookservice/",
          'data': {
            format: 'html',
            is_ajax:1,
            professionalTimezone:professionalTimezone,
            viewerTimezone:viewerTimezone,
            professionalId:professionalId,
            userId:userId,
            serviceIds:serviceIds,
            userName:userName,
            date:date,
            professioanltime:professioanltime,
            viewertime:viewertime,
            bookingendtime:bookingendtime
          },
          onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
            var res = JSON.parse(responseHTML);
            if(res.message == "user"){
              location.replace(res.url);
            }
            if(res.message == "professional"){
              alert(res.success);
              location.replace(res.url);
            }
            if(res.message == "offline-payment"){
              location.replace(res.url);
            }
            return true;
          }
        })).send();
      });
    </script>
