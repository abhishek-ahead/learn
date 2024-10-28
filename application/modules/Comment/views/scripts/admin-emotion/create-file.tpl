<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Comment
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: create-file.tpl 2017-01-12 00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */
 
?>
<script type="text/javascript">
  var contentAutocomplete =  'tags';
  en4.core.runonce.add(function() {
    var cache = {};
    scriptJquery('#tags').autocomplete({
      source: function (request, response) { 
        scriptJquery.ajax({
          url: '<?php echo $this->url(array('controller' => 'tag', 'action' => 'suggest'), 'default', true) ?>',
          data: { text: request.term },
          success: function (transformed) {
            response(transformed);
          },
          error: function () {
              response([]);
          }
        });
      },
      select: function(event, ui) { 
      },
    });
  });
</script>
<div class='settings'>
  <?php echo $this->form->render($this); ?>
</div>
