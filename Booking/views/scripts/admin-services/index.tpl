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
<?php 
$this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/jscolor/jscolor.js');
$this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/jquery.min.js');
?>
<?php include APPLICATION_PATH .  '/application/modules/Booking/views/scripts/dismiss_message.tpl';?>

<h3><?php echo $this->translate("Services") ?></h3>
<p><?php echo $this->translate('This page lists all  the services on your website. You can use this page to monitor these services and  delete offensive services if necessary.'); ?></p>
<br />
<div class='admin_search sesbasic_search_form'><?php echo $this->form->render($this) ?></div>
<br />
<?php if(count($this->paginator)){ ?>
  <table class='admin_table' style="width:100%;">
    <thead>
      <tr>
        <th><?php echo $this->translate("Service Name") ?></th>
        <th><?php echo $this->translate("Provider Name") ?></th>
        <th><?php echo $this->translate("Amount") ?></th>
        <th class="admin_table_centered"><?php echo $this->translate("Active") ?></th>
        <th><?php echo $this->translate("Options") ?></th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($this->paginator as $item): ?>
        <tr>
          <td class="bold"><?php echo $item->name; ?></td>
          <td><?php $professional = Engine_Api::_()->getDbtable('professionals', 'booking')->getProfessioanlId($item->user_id); echo $professional;?></td>
          <td><?php echo Engine_Api::_()->booking()->getCurrencyPrice($item->price); ?></td>
            <td class="admin_table_centered"><?php if($item->active == 1):?>
            <?php echo $this->htmlLink(array('route' => 'admin_default', 'module' => 'booking', 'controller' => 'services', 'action' => 'enabled', 'id' => $item->getIdentity()), $this->htmlImage($this->layout()->staticBaseUrl . 'application/modules/Booking/externals/images/check.png', '', array('title'=> $this->translate('Disable')))) ?>
            <?php else: ?>
            <?php echo $this->htmlLink(array('route' => 'admin_default', 'module' => 'booking', 'controller' => 'services', 'action' => 'enabled', 'id' => $item->getIdentity()), $this->htmlImage($this->layout()->staticBaseUrl . 'application/modules/Booking/externals/images/error.png', '', array('title'=> $this->translate('Enable')))) ?>
            <?php endif; ?></td>
          <td><a href="<?php echo $this->url(array("action"=>'create-service','service_id'=>$item->getIdentity(),'user_id'=>$item->user_id),'booking_general',true); ?>" class="smoothbox">Edit</a>&nbsp;|&nbsp;<a href="<?php echo $this->url(array("action"=>'delete-service','service_id'=>$item->getIdentity()),'booking_general',true); ?>" class="smoothbox">Delete</a></td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
<?php } else { ?>
	<div class="tip"><span>There is no service available yet!</span></div>
<?php } ?>
