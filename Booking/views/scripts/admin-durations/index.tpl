<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: index.tpl  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
 
 ?>
<?php include APPLICATION_PATH .  '/application/modules/Booking/views/scripts/dismiss_message.tpl';?>
<h3><?php echo $this->translate("Manage Durations") ?></h3>
<p>
<?php echo $this->translate('This page lists all the durations of this plugin. Here you can enable or disable durations.'); ?>
</p>
<br />
<div>
    <span>
        <?php echo $this->htmlLink(array('route' => 'default', 'module' => 'booking', 'controller' => 'admin-durations', 'action' => 'add-duration'), $this->translate("Add New Duration"), array('class' => 'buttonlink sesbasic_icon_add smoothbox')) ?>
    </span>
</div>
<br />
<?php if(count($this->paginator)){ ?>
<table class='admin_table' style="width:40%;">
  <thead>
    <tr>
        <th><?php echo $this->translate("Duration time") ?></th>
        <th><?php echo $this->translate("Action") ?></th>
    </tr>
  </thead>
  <tbody>
        <?php foreach ( $this->paginator as $item): ?>  
        <tr>
            <?php /*
            if (strpos($item->duration, ".") !== false){
              echo "<td>".Engine_Api::_()->booking()->datetostring($item->duration);
            }else {
              echo "<td>".($item->duration)." ".(($item->timelimit=="h")?'Hours':'Minutes');
            }*/
            ?>
            <td><?php echo $item->durations." ".(($item->type=="h")?'Hours':'Minutes') ?></td>
            <td><?php if($item->active==1) {?>
            <a href="<?php echo $this->url(array("action"=>'change','disable'=>$item->getIdentity())); ?>" class="edit openSmoothbox">disable</a><?php }else { ?>
            <a href="<?php echo $this->url(array("action"=>'change','enable'=>$item->getIdentity())); ?>" class="edit openSmoothbox">enable</a>
        <?php } endforeach;?>
  </tbody>
</table>
<?php } else { ?>
  <div class="tip"><span>There are no event created by your members yet.</span></div>
<?php } ?>
