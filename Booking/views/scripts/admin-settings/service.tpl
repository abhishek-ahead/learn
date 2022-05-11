<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: service.tpl  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
 
 ?>
<?php 
$this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/jscolor/jscolor.js');
$this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/jquery.min.js');
?>
<?php include APPLICATION_PATH .  '/application/modules/Booking/views/scripts/dismiss_message.tpl';?>

<div class='admin_search sesbasic_search_form'>
  <?php echo $this->form->render($this) ?>
</div>
<br />
<h3><?php echo $this->translate("Services") ?></h3>
<p>
<?php echo $this->translate('What type of services do you want to give your clients, you can add services as you like.'); ?>
</p>
<br />
<table class='admin_table'>
  <thead>
    <tr>
      <th><?php echo $this->translate("Service Name") ?></th>
      <th><?php echo $this->translate("Provider Name") ?></th>
      <th><?php echo $this->translate("Amount") ?></th>
      <th><?php echo $this->translate("Options") ?></th>
    </tr>
  </thead>
  <tbody>
        <?php if(count($this->paginator)){ ?>
        <?php foreach ($this->paginator as $item): ?>  
            <tr>
                <td>
                    <?php echo $item->name; ?>
                </td>
                <td><?php $userSelected = Engine_Api::_()->getItem('user', $item->user_id);?>
                  <a href="<?php echo 'profile/'.$userSelected->username; //$this->url(array("action"=>'view','user'=>$userSelected->displayname),'booking_general',true); ?>">
                    <?php echo $userSelected->displayname; ?>
                  </a>
                </td>
                <td>
                    <?php echo $item->price; ?>
                </td>
                <td><a href="">edit</a> | <a href="">delete</a></td>
            </tr>
        <?php endforeach; ?>

        <?php } else { ?>
        <div class="tip"><span>There are no event created by your members yet.</span></div>
        <?php } ?>
  </tbody>
</table>