
//Prevent javascript error before the content has loaded
var executetimesmoothbox = false;

//Add ajaxsmoothbox to href elements that have a class of .ajaxsmoothbox
scriptJquery(document).on('click','.ajaxsmoothbox',function(event){
	event.preventDefault();
	ajaxsmoothboxopen(this);
});

function ajaxsmoothboxopen(obj) {
  
	if(!scriptJquery('.ajaxsmoothbox_main').length) {

    scriptJquery.crtEle('div', {
      'id': 'ajaxsmoothbox_overlay',
      'class': 'ajaxsmoothbox_overlay'
    }).appendTo(document.body);
    
		scriptJquery.crtEle('div', {
      'id': 'ajaxsmoothbox_main',
      'class': 'ajaxsmoothbox_main'
    }).appendTo(document.body);
    
		scriptJquery("#ajaxsmoothbox_main").html('<div class="ajaxsmoothbox_container" id="ajaxsmoothbox_container"><div class="ajaxsmoothbox_loading"></div></div>');
    
    if(scriptJquery(obj).data('addclass')){
      scriptJquery('#ajaxsmoothbox_container').addClass(scriptJquery(obj).data('addclass'));
    }
    loaddefaultcontent();
	}
	// display the box for the elements href
	ajaxsmoothboxshow(obj);
	return false;
}

//esc key close
scriptJquery(document).on('keyup', function (e) {
  if(scriptJquery('#'+e.target.id).prop('tagName') == 'INPUT' || scriptJquery('#'+e.target.id).prop('tagName') == 'TEXTAREA' || !scriptJquery('#ajaxsmoothbox_container').length)
    return true;
  //ESC key close
  if (e.keyCode === 27) {
    ajaxsmoothboxclose();return false; 
  }
});

scriptJquery(document).on('click','.ajaxsmoothbox_main',function(e){
  if (e.target !== this)
    return;
	ajaxsmoothboxclose();
});

function loaddefaultcontent(){
	var htmlElement = document.getElementsByTagName("html")[0];
  htmlElement.style.overflow = 'hidden';
	scriptJquery("#ajaxsmoothbox_container").css({
		left: ((scriptJquery(window).width() - 300 ) / 2) + 'px',
		top: ((scriptJquery(window).height() - 100 ) / 2) + 'px',
		display: "block"
	});	
}

var Ajaxsmoothbox = {
		javascript : [],
		css : [],
}

// called when the user clicks on a ajaxsmoothbox link
function ajaxsmoothboxshow(obj) {
    if(obj){
      //initialize blank array value
      Ajaxsmoothbox.javascript = Array();
      Ajaxsmoothbox.css = [];
      var url = scriptJquery(obj).attr('href');
      if(url == 'javascript:;' || scriptJquery(obj).hasClass('open'))
        url = scriptJquery(obj).attr('data-url');
      var params = scriptJquery(obj).attr('rel');
      var requestSmoothbox = scriptJquery.ajax({
      dataType: 'html',
      url: url,
      method: 'get',
      data: {
        format: 'html',
        params:params,
        typesmoothbox:'ajaxsmoothbox'
      },
      evalScripts: true,
      success: function(responseHTML) {
        executeCssJavascriptFiles(responseHTML);
      }
    });
  }
}

function ajaxsmoothboxExecuteCode(responseHTML,prevWidth){
  if(typeof ajaxsmoothboxcallbackBefore == 'function')
		ajaxsmoothboxcallbackBefore(responseHTML);

	responseHTML = '<a title="'+en4.core.language.translate("Close")+'" class="ajaxsmoothbox_close_btn fas fa-times" href="javascript:;" onclick="javascript:ajaxsmoothboxclose();"></a>'+responseHTML;
	scriptJquery('#ajaxsmoothbox_container').html(responseHTML);	
	//execute code at run once
	if(!executetimesmoothbox){
		executetimesmoothboxTimeinterval = 10;	
	}
	setTimeout(function(){en4.core.runonce.trigger(); }, executetimesmoothboxTimeinterval);
	resizeajaxsmoothbox(prevWidth);
}

function ajaxsmoothboxclose(){
	scriptJquery('.ajaxsmoothbox_main').remove();
	scriptJquery('#ajaxsmoothbox_overlay').remove();
	var htmlElement = document.getElementsByTagName("html")[0];
	htmlElement.style.overflow = '';
	executetimesmoothbox = false;
  ajaxsmoothboxcallback = function () {};
  ajaxsmoothboxcallbackBefore = function () {};
  if(typeof ajaxsmoothboxcallbackclose == 'function')
		ajaxsmoothboxcallbackclose();
}

function resizeajaxsmoothbox(prevWidth) {

 var linkClose = '<a title="'+en4.core.language.translate("Close")+'" class="ajaxsmoothbox_close_btn fas fa-times" href="javascript:;" onclick="javascript:ajaxsmoothboxclose();"></a>';
 scriptJquery('#ajaxsmoothbox_container').prepend(linkClose);
 var windowheight = scriptJquery(window).height();
 var objHeight =	scriptJquery('#ajaxsmoothbox_container').height();
 var windowwidth= scriptJquery(window).width();
 var objWidth=	scriptJquery('#ajaxsmoothbox_container').width();
 if(objHeight >= windowheight){
  var top = '10'; 
 } else if(objHeight <= windowheight){
  var top = (windowheight - objHeight)/2;		 
 }
 var width = scriptJquery('#ajaxsmoothbox_container').find('div').first().width();
 var	setwidth= width /2 ;
 scriptJquery("#ajaxsmoothbox_container").animate({
		top: top+'px',
		width: width+'px',
		left: (((scriptJquery(window).width() ) / 2) - setwidth) + 'px',
 },400,function() {
    if(typeof ajaxsmoothboxcallback == 'function')
		  ajaxsmoothboxcallback();
    // Animation complete.
  });
}

var successLoad;
function executeCssJavascriptFiles(responseHTML) {
	var jsCount = Ajaxsmoothbox.javascript.length;
	var cssCount = Ajaxsmoothbox.css.length;
	//store the total file so we execute all required function after css and js load.
	var totalFiles = jsCount + cssCount;
	successLoad= 0;
	var isLoaded = 0;
	var prevWidth = scriptJquery('#ajaxsmoothbox_container').width();
	if(jsCount == cssCount){
		isLoaded = 1;
		ajaxsmoothboxExecuteCode(responseHTML,prevWidth);
	}
	//execute jsvascript files
	for(var i=0;i < jsCount;i++){
			Asset.javascript(Ajaxsmoothbox.javascript[i], {
			onLoad: function(e) {
				successLoad++;
				if (successLoad === totalFiles){
				    isLoaded = 1;
					ajaxsmoothboxExecuteCode(responseHTML,prevWidth);
				}
			}});
	}
		//execute css files
	for(var i=0;i < cssCount;i++){
			Asset.css(Ajaxsmoothbox.css[i], {
			onLoad: function() {
				successLoad++;
				if (successLoad === totalFiles){
				    isLoaded = 1;
					ajaxsmoothboxExecuteCode(responseHTML,prevWidth);
				}
			}});
	}
	if(!isLoaded){
	    ajaxsmoothboxExecuteCode(responseHTML,prevWidth);
	}
}
