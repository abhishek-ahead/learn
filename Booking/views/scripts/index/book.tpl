<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: book.tpl  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
 
?>
<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>
<?php echo $this->form->render($this); ?>
<script>
    function display(a){
        var hours = Math.trunc(a/60);
        var minutes = a % 60;
        return (((hours==0)?"":hours+" hours ")+""+((minutes==0)?"":minutes+" minutes"));
    }
    sesJqueryObject("#calculate").click(function(){
        var items=document.getElementsByName('services[]');
        var timeslotsarray="";
          for(var i=0; i<items.length; i++){
            if(items[i].type=='checkbox' && items[i].checked==true)
              {timeslotsarray+=(items[i].value)+",";}
            }
            var a=timeslotsarray.split(",");
            var s;
            var price=0;
            var time=0;
            var currency="";
            for(i=0;i<a.length-1;i++){
                s=a[i].split("|");
                currency=s[1].substring(0,1);
                price+=parseFloat(s[1].substring(1, s[1].length));
                time+=parseInt(s[2])
            }
        sesJqueryObject("#totaltime").html("Total time :"+display(time));
        sesJqueryObject("#price").html("Total Price :"+currency+""+price);
    });
</script>
