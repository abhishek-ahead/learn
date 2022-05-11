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
<?php include APPLICATION_PATH . '/application/modules/Booking/views/scripts/_getallprofessional.tpl'; ?>
<script type="text/javascript" >
    var professionalName;
    var serviceName;
    var category_id;
    var subcat_id;
    var subsubcat_id;
    var availability;
    var rating;
    var locat;
    sesJqueryObject(document).on('click','#search_professional, .portfolio_selectView_<?php echo $randonNumber; ?>, .grid_selectView_<?php echo $randonNumber;?>, .list_selectView_<?php echo $randonNumber;?>',function (e) {
	var viewType='<?php echo $this->view_type; ?>';
	viewType = 'grid';
	if(sesJqueryObject(this).attr('rel')!=undefined){
			viewType=sesJqueryObject(this).attr('rel');
	}
	professionalName=sesJqueryObject("#professional_name").val();
	serviceName=sesJqueryObject("#service_name").val();
	category_id=sesJqueryObject("#category_id").val();
	subcat_id=sesJqueryObject("#subcat_id").val();
	subsubcat_id=sesJqueryObject("#subsubcat_id").val();
	availability=sesJqueryObject("#professional_start_date").val();
	rating=sesJqueryObject("#rating").val();
	locat=sesJqueryObject("#location-element").find("#locationSesList").val();
	(new Request.HTML({
		method: 'post',
		'url': en4.core.baseUrl + "widget/index/mod/booking/name/professionals",
		'data': {
			format: 'html',
			viewType:viewType,
			professionalName:professionalName,
			serviceName:serviceName,
			category_id:category_id,
			subcat_id:subcat_id,
			subsubcat_id:subsubcat_id,
			availability:availability,
			rating:rating,
			locat:locat,
			isProfessional:1,
			params: '<?php echo json_encode($this->all_params); ?>',
		},
		onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
				var result = sesJqueryObject(responseHTML).find("#professional_"+viewType+"_view_<?php echo $randonNumber; ?>");
				console.log(viewType);
				sesJqueryObject("#professional_"+viewType+"_view_<?php echo $randonNumber; ?>").html(result.html());
				return true;
				}
		})).send();
});
</script>
<script type="text/javascript">
  $$('.core_main_booking').getParent().addClass('active');
</script>