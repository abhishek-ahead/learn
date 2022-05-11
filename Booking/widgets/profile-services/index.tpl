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
<?php include APPLICATION_PATH . '/application/modules/Booking/views/scripts/_profileServices.tpl'; ?>
<?php if(!$this->is_ajax){ ?>
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
<?php } ?>