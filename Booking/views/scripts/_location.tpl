<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: _location.tpl  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
 
 ?>
<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>

<?php $location = isset($_POST['location']) ? $_POST['location'] : $_POST['location'] ; ?>
<div id="seslocation-wrapper" class="form-wrapper">
    <div id="location-label" class="form-label">
      <label for="locationSes"><?php echo $this->translate("Location"); ?></label>
    </div>
    <div id="location-element" class="form-element">
        <input type="text" name="location" id="locationSes" value="<?php echo (!empty($this->locationSes)) ? $this->locationSes : $location ?> " />
    </div>
</div>
<script type="application/javascript">
 en4.core.runonce.add(function() {
	if(typeof locationcreatedata == 'undefined'){
		locationcreatedata = true;
		
	sesJqueryObject(document).on('click','#sesevent_add_location',function(){
			sesJqueryObject('#sesevent_location_map_data').hide();
			sesJqueryObject('#seslocation-wrapper').show();
			sesJqueryObject('#online_event-wrapper').hide();
			sesJqueryObject('#sesevent_location_data-wrapper').hide();
			sesJqueryObject('#sesevent_online_event').show();
			sesJqueryObject('#sesevent_add_location').hide();
			sesJqueryObject('#sesevent_enter_address').show();
			sesJqueryObject('.location_value').val('');
			sesJqueryObject('#locationSesList').val('');
			sesJqueryObject('#lngSesList').val('');
			sesJqueryObject('#latSesList').val('');
	});
	
	
 }
<?php if($is_webinar){ ?>
	sesJqueryObject('#sesevent_online_event').trigger('click');
<?php }else if($location != '' && ($venue_name != '' || $city != '' || $state != '' || $country != '' || $zip != '' || $address != '' || $address2 != '')){ ?>
	checkinD = true;
	sesJqueryObject('#sesevent_enter_address').trigger('click');
<?php }else{ ?>
	//sesJqueryObject('#sesevent_enter_address').trigger('click');
<?php } ?>
	mapLoad_event = false;
	initializeSesEventMapList();
 });
  function createEventLoadMap() {
	 var lat = sesJqueryObject('#latSes').val();
	 var lng = sesJqueryObject('#lngSes').val();
		if(lat && lng && sesJqueryObject('#sesevent_location_map_data').css('display') == 'none'){
			sesJqueryObject('#sesevent_enter_address').trigger('click');
		}
	 if(lat && lng && sesJqueryObject('#sesevent_location_map_data').css('display') == 'block'){
		sesJqueryObject('#sesevent_location_map').show();
		sesJqueryObject('#sesevent_default_map').hide();
		var myLatlng = new google.maps.LatLng(lat, lng);
		var myOptions = {
		 zoom: 17,
		 center: myLatlng,
		 mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		var mapLocationCreate = new google.maps.Map(document.getElementById("sesevent_location_map"), myOptions);
		var marker = new google.maps.Marker({
			position: myLatlng,
			map: mapLocationCreate,
		});
		google.maps.event.addListener(mapLocationCreate, 'click', function() {
			google.maps.event.trigger(mapLocationCreate, 'resize');
			mapLocationCreate.setZoom(17);
			mapLocationCreate.setCenter(myLatlng);
		});
		if(checkinD){
			checkinD = false;
			return ;
		}
		var geocoder = new google.maps.Geocoder(); 
   geocoder.geocode({'latLng': new google.maps.LatLng(lat, lng)}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK && results.length) {
						
							if (results[0]) {
									for(var i=0; i<results[0].address_components.length; i++)
									{
											var postalCode = results[0].address_components[i].long_name;
									 }
							 }
							
							if (results[1]) {
								var indice=0;
								for (var j=0; j<results.length; j++)
								{
										if (results[j].types[0]=='locality')
										{
												indice=j;
												break;
										}
								}
								for (var i=0; i<results[j].address_components.length; i++)
								{
										if (results[j].address_components[i].types[0] == "locality") {
														//this is the object you are looking for
														city = results[j].address_components[i].long_name;
												}
										if (results[j].address_components[i].types[0] == "administrative_area_level_1") {
														//this is the object you are looking for
														state = results[j].address_components[i].long_name;
												}
										if (results[j].address_components[i].types[0] == "country") {
														//this is the object you are looking for
														country = results[j].address_components[i].long_name;
												}
								}
								if(postalCode)
									sesJqueryObject('#zip').val(postalCode);
								if(city)
									sesJqueryObject('#city').val(city);
								if(state)
									sesJqueryObject('#state').val(state);
								if(country)
									sesJqueryObject('#country').val(country);
							}
						} 
        });		
	 }
 }
</script>