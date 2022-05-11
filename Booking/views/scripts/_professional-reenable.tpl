<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: delete-service.tpl  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
 
 ?>
<form method="post" class="global_form_popup" action="<?php echo $this->url(array('module' => 'booking', 'controller' => 'index', 'action' => 'professional-enable', 'format' => 'smoothbox'), 'default', true); ?>">
  <div>
    <h3><?php echo $this->translate("Enable Entry?") ?></h3>
    <p><?php echo $this->translate("You are already a Professional & you have disabled your profile. Are you sure you want to enable your Professional Profile now?") ?></p>
    <br />
    <p>
      <input type="hidden" name="confirm"/>
      <button type='submit'><?php echo $this->translate("Enable") ?></button>
      <?php echo $this->translate(" or ") ?> 
      <a href='javascript:void(0);' onclick='javascript:parent.Smoothbox.close()'>
        <?php echo $this->translate("Cancel") ?></a>
    </p>
  </div>
</form>