<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: create.tpl 2017-01-12 00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */
 
?>
<div class='settings'>
  <?php echo $this->form->render($this); ?>
</div>
<script type="application/javascript">
  function setModuleName(value){
    document.getElementById('module').value = value;;  
  }
  if(document.getElementById('module'))
    document.getElementById('module').value = document.getElementById('filtertype').options[document.getElementById('filtertype').selectedIndex].text;
</script>
