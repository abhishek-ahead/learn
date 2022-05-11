<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: test.tpl  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
 
 ?>
<body onload="loadDoc()">
<?php
echo $this->form->render($this);
?>
<script>
    
function loadDoc(val) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     document.getElementById("timeslots-element").innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", "/sesforsmt/bookings/forajax?name="+val, true);
  xhttp.send();
}
function getAllTime(){
    var data="";
    var start = document.getElementById("start_time");
    var end = document.getElementById("end_time");
    for (i=start.selectedIndex;i<=end.selectedIndex;i++){
        data=data+"<input type='checkbox'>"+start.options[i].value+" - "+end.options[i].value+"<br>";
    }
    document.getElementById("displayTime").innerHTML=data;
}
/*jQuery(document).ready(function() {
    jQuery("#difference").change(function(event){
       var name = jQuery("#difference").val();
       jQuery.ajax({
            url: "/sesforsmt/bookings/test",
            cache: false,
            data: {name : name},
            success: function(){
             jQuery("#timeslots").html(name);
            }
        });
       //jQuery("#timeslots").load('/sesforsmt/bookings/test', {"name":name} );
    });
});
jQuery(document).on('click','#loadData',function(){
    var data="";
    jQuery("#start_time option").each(function()
        {
            /*var selectedText = jQuery("#start_time option").html();
            data+="<input type='checkbox'>"+jQuery(this).html()+"<br>";
        });
        jQuery('#timeslots').html(data);
  })
    /*$("#loadData").click(function(event){
        $("#start_time option").each(function()
        {
            console.log($(this).val());
        });
    <input type="checkbox">'+jQuery(this).html()+
    });*/
</script>
