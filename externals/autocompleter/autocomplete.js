
AutocompleterRequestJSON = function (field_name, url, hiddenFieldName, extraParams) {
  scriptJquery('#'+field_name).parent().addClass('acWrap');
  scriptJquery('#'+field_name).parent().append('<div class="acBox"></div>');
  scriptJquery('#'+field_name).autocomplete({
    source: function (request, response) {
			var extraParamsObj = {};
			if(extraParams) {
				if(typeof extraParams != 'object') {
					extraParams = [extraParams];
				}
				extraParams.forEach(item => {
					extraParamsObj[item] = scriptJquery('#'+item).val();
				});
			}
      scriptJquery.ajax({
        type: "POST",
        url: url,
          data: {
            text: scriptJquery('#'+field_name).val(),
						extraParamsObj,
            //type: "user-all"
          },
          success: function( data ) {  
            response(data);
          },
          dataType: 'json',
          minLength: 1,
          delay: 500
      });
    },
    select : function(event, ui) {
      var label = ui.item.label;
      scriptJquery('#'+field_name).val(label.replace(/(<([^>]+)>)/ig,""));
      hiddenFieldName(ui.item);
      return false;
    }
  }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
    if(item.photo) {
      return scriptJquery( "<li></li>" ).data("item.autocomplete", item).append(item.photo + item.label).appendTo(ul); 
    } else if(item.icon) {
      return scriptJquery( "<li></li>" ).data("item.autocomplete", item).append(item.icon + item.label).appendTo(ul);  
    }
  }
}
