<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: index.tpl 2017-01-12 00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */
 
?>
<?php 
$oldTimeZone = date_default_timezone_get();
date_default_timezone_set($this->viewer()->timezone);
?>
<div class="activity_tip_box activity_onthisday_banner clearfix ">
	<div class="activity_onthisday_banner_date">
  	<span class="activity_onthisday_banner_date_month"><?php echo date('M') ?></span>
  	<span class="activity_onthisday_banner_date_day"><?php echo date('d'); ?></span>
  </div>  
</div>
<?php date_default_timezone_set($oldTimeZone); ?>
