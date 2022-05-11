<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Courses
 * @copyright  Copyright 2014-2019 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: review-rating.tpl 2019-08-28 00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */
 
?>
<?php $id = Zend_Controller_Front::getInstance()->getRequest()->getParam('profreview_id');?>
<?php $editPrivacy = true;//Engine_Api::_()->sesbasic()->getViewerPrivacy('booking_professional_review', 'edit');?>

<div class="form-wrapper booking_professional_form_rating_star">
  <div class="form-label"><label><?php echo $this->translate("Overall Rating"); ?></label></div>
  <div id="booking_professional_review_rating" class="sesbasic_rating_star booking_professional_rating_star_element" onmouseout="rating_out();">
    <span id="rate_1" class="rating_star_big_generic rating_star_big_disabled" onclick="rate(1);" onmouseout="rating_out()" onmouseover="rating_over(1);"></span>
    <span id="rate_2" class="rating_star_big_generic rating_star_big_disabled" onclick="rate(2);" onmouseout="rating_out()" onmouseover="rating_over(2);"></span>
    <span id="rate_3" class="rating_star_big_generic rating_star_big_disabled" onclick="rate(3);" onmouseout="rating_out()" onmouseover="rating_over(3);"></span>
    <span id="rate_4" class="rating_star_big_generic rating_star_big_disabled" onclick="rate(4);" onmouseout="rating_out()" onmouseover="rating_over(4);"></span>
    <span id="rate_5" class="rating_star_big_generic rating_star_big_disabled" onclick="rate(5);" onmouseout="rating_out()" onmouseover="rating_over(5);"></span>
    <span id="rating_text" class="sesbasic_rating_text"><?php echo $this->translate('click to rate');?></span>
  </div>
</div>
<?php $this->headScript()->appendFile($this->layout()->staticBaseUrl . 'externals/tinymce/tinymce.min.js'); ?>
<script type="text/javascript">
en4.core.runonce.add(function() {

  tinymce.init({
    mode: "specific_textareas",
    editor_selector: "booking_professional_review_tinymce",
    plugins: "table,fullscreen,media,preview,paste,code,image,textcolor",
    theme: "modern",
    menubar: false,
    statusbar: false,
    toolbar1: "",
    toolbar2: "",
    toolbar3: "",
    element_format: "html",
    height: "225px",
    convert_urls: false,
    language: "en",
    directionality: "ltr"
  });

  function ratingText(rating){
    var text = '';
    if(rating == 1)
    text = "<?php echo Engine_Api::_()->getApi('settings', 'core')->getSetting('booking_prof_rating_stars_one',$this->translate('terrible')); ?>";
    else if(rating == 2)
    text = "<?php echo Engine_Api::_()->getApi('settings', 'core')->getSetting('booking_prof_rating_stars_two',$this->translate('poor')); ?>";
    else if(rating == 3)
    text = "<?php echo Engine_Api::_()->getApi('settings', 'core')->getSetting('booking_prof_rating_stars_three',$this->translate('average')); ?>";
    else if(rating == 4)
    text = "<?php echo Engine_Api::_()->getApi('settings', 'core')->getSetting('booking_prof_rating_stars_four',$this->translate('very good')); ?>";
    else if(rating == 5)
    text = "<?php echo Engine_Api::_()->getApi('settings', 'core')->getSetting('booking_prof_rating_stars_five',$this->translate('excellent')); ?>";
    else
    text = "<?php echo $this->translate('click to rate');?>";
    return text;
  }
  var rating_over = window.rating_over = function(rating) {
    $('rating_text').innerHTML = ratingText(rating);
    for(var x=1; x<=5; x++) {
      if(x <= rating)
      $('rate_'+x).set('class', 'rating_star_big_generic rating_star_big');
      else
      $('rate_'+x).set('class', 'rating_star_big_generic rating_star_big_disabled');
    }
  }

  var rating_out = window.rating_out = function() {
    var star_value = document.getElementById('rate_value').value;
    $('rating_text').innerHTML = ratingText(star_value);
    if(star_value != '') {
      set_rating(star_value);
    }
    else {
      for(var x=1; x<=5; x++) {
	$('rate_'+x).set('class', 'rating_star_big_generic rating_star_big_disabled');
      }
    }
  }

  var rate = window.rate = function(rating) {
    document.getElementById('rate_value').value = rating;
    $('rating_text').innerHTML = ratingText(rating);
    set_rating(rating);
  }

  var set_rating = window.set_rating = function(rating) {
    for(var x=1; x<=parseInt(rating); x++) {
      $('rate_'+x).set('class', 'rating_star_big_generic rating_star_big');
    }
    for(var x=parseInt(rating)+1; x<=5; x++) {
      $('rate_'+x).set('class', 'rating_star_big_generic rating_star_big_disabled');
    }
    $('rating_text').innerHTML = ratingText(rating);
  }

  window.addEvent('domready', function() {
    var ratingCount = $('rate_value').value;
    if(ratingCount > 0)
    var val = ratingCount;
    else
    var val = 0;
    set_rating(ratingCount);
  });


  //Ajax error show before form submit
  var error = false;
  var objectError ;
  var counter = 0;
  function validateForm(){
    var errorPresent = false;
    counter = 0;
    sesJqueryObject('#booking_professional_review_form input, #booking_professional_review_form select,#booking_professional_review_form checkbox,#booking_professional_review_form textarea,#booking_professional_review_form radio').each(
	function(index){
	var input = sesJqueryObject(this);
	if(sesJqueryObject(this).closest('div').parent().css('display') != 'none' && sesJqueryObject(this).closest('div').parent().find('.form-label').find('label').first().hasClass('required') && sesJqueryObject(this).prop('type') != 'hidden' && sesJqueryObject(this).closest('div').parent().attr('class') != 'form-elements'){
	  if(sesJqueryObject(this).prop('type') == 'checkbox'){
	    value = '';
	    if(sesJqueryObject('input[name="'+sesJqueryObject(this).attr('name')+'"]:checked').length > 0) {
	      value = 1;
	    };
	    if(value == '')
	    error = true;
	    else
	    error = false;
	  }else if(sesJqueryObject(this).prop('type') == 'select-multiple'){
	    if(sesJqueryObject(this).val() === '' || sesJqueryObject(this).val() == null)
	    error = true;
	    else
	    error = false;
	  }else if(sesJqueryObject(this).prop('type') == 'select-one' || sesJqueryObject(this).prop('type') == 'select' ){
	    if(sesJqueryObject(this).val() === '')
	    error = true;
	    else
	    error = false;
	  }else if(sesJqueryObject(this).prop('type') == 'radio'){
	    if(sesJqueryObject("input[name='"+sesJqueryObject(this).attr('name').replace('[]','')+"']:checked").val() === '')
	    error = true;
	    else
	    error = false;
	  }else if(sesJqueryObject(this).prop('type') == 'textarea'){
	    if(sesJqueryObject(this).css('display') == 'none'){
	      var	content = tinymce.get(sesJqueryObject(this).attr('id')).getContent();
	      if(!content)
	      error= true;
	      else
	      error = false;
	    }else	if(sesJqueryObject(this).val() === '' || sesJqueryObject(this).val() == null)
	    error = true;
	    else
	    error = false;
	  }else{
	    if(sesJqueryObject(this).val() === '' || sesJqueryObject(this).val() == null)
	    error = true;
	    else
	    error = false;
	  }
	  if(error){
	    if(counter == 0){
	      objectError = this;
	    }
	    counter++
	  }
	  if(error)
	  errorPresent = true;
	  error = false;
	}
      }
    );
    return errorPresent ;
  }
      <?php if(empty($id)):?>
    sesJqueryObject(document).on('submit','#booking_professional_review_form',function(e){
      var validationFm = validateForm();
      if(!sesJqueryObject('#rate_value').val()){
	alert('<?php echo $this->translate("Please fill the red mark fields"); ?>');
	var errorFirstObject = sesJqueryObject('#booking_professional_review_rating').parent();
	sesJqueryObject('html, body').animate({
	scrollTop: errorFirstObject.offset().top
	}, 2000);
	return false;
      }
      else if(validationFm) {
	alert('<?php echo $this->translate("Please fill the red mark fields"); ?>');
	if(typeof objectError != 'undefined'){
	var errorFirstObject = sesJqueryObject(objectError).parent().parent();
	sesJqueryObject('html, body').animate({
	scrollTop: errorFirstObject.offset().top
	}, 2000);
	}
	return false;
      }else{
	sendDataToServer(this);
	return false;
      }
    });
    <?php endif;?>
  });


  function sendDataToServer(object){
    //submit form
    sesJqueryObject('.sesbasic_review_loading_cont_overlay').show();
    var formData = new FormData(object);
    formData.append('is_ajax', 1);
    formData.append('user_id', '<?php echo $this->viewer_id;?>');
    var form = sesJqueryObject(object);
    var url = sesJqueryObject('#booking_professional_review_form').attr('action');
    sesJqueryObject.ajax({
      type:'POST',
      dataType:'html',
      url: url,
      data:formData,
      cache:false,
      contentType: false,
      processData: false,
      success:function(response){
        sesJqueryObject('body').append('<div id="booking_professional_review_content" style="display:none;"></div>');
        sesJqueryObject('#booking_professional_review_content').html(response);
        var reviewHtml = sesJqueryObject('#booking_professional_review_content').find('.booking_professional_reviews').html();
        //update cover rating
				if(sesJqueryObject('.booking_professional_cover_rating').length){
					pre_rate_cover = sesJqueryObject('#booking_professional_review_content').find('.rating_params').find('#total_rating_average').val();
					var ratingtext = sesJqueryObject('#booking_professional_review_content').find('.rating_params').find('#rating_text').val();
					window.set_rating_cover(ratingtext);
				}

        if(sesJqueryObject('.booking_professional_owner_review').length > 0) {
          var updatedHtmlQuery = sesJqueryObject('ul.booking_professional_review_listing li.booking_professional_owner_review').index();
          sesJqueryObject('.booking_professional_review_listing').children().eq(updatedHtmlQuery).html(reviewHtml);
          if(sesJqueryObject('.booking_professional_review_listing').find(".sesbasic_tip"))
            sesJqueryObject('.booking_professional_review_listing').find(".sesbasic_tip").remove();
        }
        else if(!sesJqueryObject('#booking_professional_review_rate').length){
	 			 sesJqueryObject('.booking_professional_review_listing').prepend('<li class="sesbasic_clearfix booking_professional_owner_review">'+reviewHtml+'</li>');
	 			 if(sesJqueryObject('.booking_professional_review_listing').find(".sesbasic_tip"))
          sesJqueryObject('.booking_professional_review_listing').find(".sesbasic_tip").remove();
        }
        var editPrivacy = '<?php echo $editPrivacy;?>';
        if(editPrivacy == 1) {
					var editFormHtml = sesJqueryObject('#booking_professional_review_content').find('#booking_professional_review_create_form').html();
					sesJqueryObject('#booking_professional_review_create_form').first().html(editFormHtml);
					sesJqueryObject('#booking_professional_create_button').hide();
					sesJqueryObject('#booking_professional_edit_button').show();
        }
        else
        	sesJqueryObject('#booking_professional_create_button').hide();

        sesJqueryObject('#booking_professional_review_content').remove();
        sesJqueryObject('#booking_professional_review_create_form').hide();
				sesJqueryObject('.booking_professional_review_listing ').show();
				sesJqueryObject('.booking_professional_review_listing').parent().find('.tip').hide();
				sesJqueryObject('.sesbasic_loading_cont_overlay').hide();
				var openObject = sesJqueryObject('.booking_professional_review_profile_btn');
				sesJqueryObject('html, body').animate({
					scrollTop: openObject.offset().top
				}, 2000);
				en4.core.runonce.trigger();
				location.reload();
      },
      error: function(data){
      //silence
      }
    });
  }
</script>
