<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: add-feelingicon.tpl 2017-01-12 00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

?>
<div class='settings'>
  <?php echo $this->form->render($this); ?>
</div>
<script type="text/javascript">
  function changemodule(modulename) {
    var type = '<?php echo $this->type ?>';
    var feeling_id = '<?php echo $this->feeling_id ?>';
    window.location.href="<?php echo $this->url(array('module'=>'activity','controller'=>'feeling', 'action'=>'add-feelingicon'),'admin_default',true)?>/module_name/"+modulename + "/type/" +type+"/feeling_id/"+feeling_id;
  }
</script>
