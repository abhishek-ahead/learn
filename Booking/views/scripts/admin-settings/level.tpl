
<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: level.tpl  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
 
 ?><?php 
$this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/jscolor/jscolor.js');
$this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/jquery.min.js');
?>
<script type="text/javascript">
  var fetchLevelSettings = function(level_id) {
    window.location.href = en4.core.baseUrl + 'admin/booking/settings/level/id/' + level_id;
  }
</script>
<?php include APPLICATION_PATH .  '/application/modules/Booking/views/scripts/dismiss_message.tpl';?>
<div class='clear'>
  <div class='settings sesbasic_admin_form'>
    <?php echo $this->form->render($this) ?>
  </div>

</div>

<?php $this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/sesJquery.js'); ?>

<script type="application/javascript">
sesJqueryObject(document).on('change','input[type=radio][name=addlist_event]',function(){
	if (this.value == 1) {
    sesJqueryObject('#addlist_maxevent-wrapper').show();
  }else{
		 sesJqueryObject('#addlist_maxevent-wrapper').hide();
	}
});

window.addEvent('domready', function() {
	var valueLocation = sesJqueryObject('input[name=addlist_event]:checked').val();
	if(valueLocation == 0)
		sesJqueryObject('#addlist_maxevent-wrapper').hide();
});
</script>