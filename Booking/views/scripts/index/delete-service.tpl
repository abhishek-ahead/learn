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
<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>
<form method="post" class="global_form_popup">
  <div>
    <h3><?php echo $this->translate("Delete Entry?") ?></h3>
    <p><?php echo $this->translate("Are you sure that you want to delete this entry? It will not be recoverable after being deleted.") ?></p>
    <?php if(!empty($this->dateInAppointments)){ ?>
      <div class="tip"><span><?php echo $this->translate('Someone has booked this service so, please delete service once that user complete this service.');?></span></div>
    <?php } ?>
    <br />
    <p>
      <input type="hidden" name="confirm"/>
      <button type='submit'><?php echo $this->translate("Delete") ?></button>
      <?php echo $this->translate(" or ") ?> 
      <a href='javascript:void(0);' onclick='javascript:parent.Smoothbox.close()'>
        <?php echo $this->translate("Cancel") ?></a>
    </p>
  </div>
</form>