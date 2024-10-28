<?php

/**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Comment
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: deleted-item.tpl 2017-01-12 00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

?>
<script type="text/javascript">
  parent.scriptJquery('#activity-item-<?php echo $this->action_id ?>').remove();
  setTimeout(function () {
    parent.Smoothbox.close();
  }, <?php echo ($this->smoothboxClose === true ? 1000 : $this->smoothboxClose); ?>);
</script>
<div class="global_form_popup_message">
  <?php echo $this->message ?>
</div>