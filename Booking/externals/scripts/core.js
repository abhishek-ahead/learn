//MAP CODE 
//initialize default values
var map;
var infowindow;
var marker;
var mapLoad = true;
//list page map 
function initializeSesBookingMapList() {
if(mapLoad){
  var mapOptions = {
    center: new google.maps.LatLng(-33.8688, 151.2195),
    zoom: 17
  };
   map = new google.maps.Map(document.getElementById('map-canvas-list'),
    mapOptions);
}
  var input =document.getElementById('locationSesList');

  var autocomplete = new google.maps.places.Autocomplete(input);
if(mapLoad)
  autocomplete.bindTo('bounds', map);

if(mapLoad){
   infowindow = new google.maps.InfoWindow();
   marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });
}
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
	
	if(mapLoad){
    infowindow.close();
    marker.setVisible(false);
	}
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }
	if(mapLoad){
    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
	}
		document.getElementById('lngSesList').value = place.geometry.location.lng();
		document.getElementById('latSesList').value = place.geometry.location.lat();
if(mapLoad){
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
}
    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }
  if(mapLoad){
	  infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);
		return false;
	}
	}); 
	if(mapLoad){
		google.maps.event.addDomListener(window, 'load', initializeSesBookingMapList);
	}
}

function reviewVotesProfessional(elem,type){
  sesJqueryObject(elem).parent().parent().find('p').first().html('<span style="color:green;font-weight:bold">Thanks for your vote!</span>');
  var element = sesJqueryObject(this);
  if (!sesJqueryObject(elem).attr('data-href'))
    return;
  var text = sesJqueryObject(elem).find('.title').html();
  var id = sesJqueryObject (elem).attr('data-href');
  (new Request.HTML({
    method: 'post',
    'url': en4.core.baseUrl + 'booking/index/review-votes',
    'data': {
      format: 'html',
      id: id,
      type: type,
    },
    onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
      var response = jQuery.parseJSON(responseHTML);
      if (response.error)
        alert(en4.core.language.translate('Something went wrong,please try again later'));
      else {
        //sesJqueryObject (elementCount).find('span').html(response.count);
        if (response.condition == 'reduced') {
          sesJqueryObject (elem).removeClass('active');
          sesJqueryObject (elem).find('span').eq(1).html(response.count);
        }else{
          sesJqueryObject (elem).addClass('active');
          sesJqueryObject (elem).find('span').eq(1).html(response.count);
        }
      }
      return true;
    }
  })).send();
}

//review votes js
sesJqueryObject(document).on('click', '.sesapmt_review_useful', function (e) {
    reviewVotesProfessional(this, '1');
});
sesJqueryObject(document).on('click', '.sesapmt_review_funny', function (e) {
    reviewVotesProfessional(this, '2');
});
sesJqueryObject(document).on('click', '.sesapmt_review_cool', function (e) {
    reviewVotesProfessional(this, '3');
});