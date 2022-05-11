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
<h3><?php echo $this->translate("Manage Professionals") ?></h3>
<p> <?php echo $this->translate('This page lists all of the professionals on your website. You can use this page to monitor these professionals and inactive offensive professionals if necessary. Entering criteria into the filter fields will help you find specific professionals entries. Leaving the filter fields blank will show all the professionals entries on your social network
below.'); ?> </p>
<br />
<div class='admin_search sesbasic_search_form'><?php echo $this->form->render($this) ?></div>
<br />
<?php if(count($this->paginator)){ ?>
<table class='admin_table booking_professional_list' style="width:100%;">
  <thead>
    <tr>
      <th><?php echo $this->translate("Professional") ?></th>
      <th><?php echo $this->translate("Designation") ?></th>
      <th><?php echo $this->translate("Location") ?></th>
      <th><?php echo $this->translate("Timezone") ?></th>
      <th><?php echo $this->translate("Rating (5)") ?></th>
      <th class="admin_table_centered"><?php echo $this->translate("Active") ?></th>
      <th><?php echo $this->translate("Action") ?></th>
    </tr>
  </thead>
  <tbody>
    <?php foreach ($this->paginator as $item): ?>
      <tr>
        <td class="booking_profile">
        	<div class="professional_info">
            <?php if(!$item->file_id): ?>
            	<?php  $userSelected = Engine_Api::_()->getItem('user',$item->user_id); 
                 echo $this->htmlLink($item->getHref(), $this->itemPhoto($userSelected, 'thumb.icon', $userSelected->getTitle())); ?>
            <?php else: ?>
              <a href="<?php echo $item->getHref(); ?>"><img src="<?php echo Engine_Api::_()->storage()->get($item->file_id, '')->getPhotoUrl('thumb.icon');?>"/></a>
            <?php endif; ?>
        		<span><?php echo $item->name; ?></span>
        	</div>
        </td>
        <td><?php echo $item->designation; ?></td>
        <td><?php echo $item->location; ?></td>
        <td><?php echo $item->timezone; ?></td>
        <td><?php echo $item->rating; ?></td>
        <td class="admin_table_centered"><?php if($item->active == 1):?>
          <?php echo $this->htmlLink(array('route' => 'admin_default', 'module' => 'booking', 'controller' => 'professionals', 'action' => 'enabled', 'id' => $item->getIdentity()), $this->htmlImage($this->layout()->staticBaseUrl . 'application/modules/Booking/externals/images/check.png', '', array('title'=> $this->translate('Disable')))) ?>
          <?php else: ?>
          <?php echo $this->htmlLink(array('route' => 'admin_default', 'module' => 'booking', 'controller' => 'professionals', 'action' => 'enabled', 'id' => $item->getIdentity()), $this->htmlImage($this->layout()->staticBaseUrl . 'application/modules/Booking/externals/images/error.png', '', array('title'=> $this->translate('Enable')))) ?>
          <?php endif; ?>
        </td>
        <td>
            <a href="<?php echo $this->url(array('route' => 'admin_default', 'module' => 'booking', 'controller' => 'professionals', 'action' => 'delete', 'professional_id' => $item->getIdentity())) ?>" class="smoothbox"><?php echo $this->translate('Delete'); ?></a>
        </td>
      </tr>
    <?php endforeach;  ?>
  </tbody>
</table>
<?php } else { ?>
  <div class="tip"><span>There is no professional available yet!</span></div>
<?php } ?>
