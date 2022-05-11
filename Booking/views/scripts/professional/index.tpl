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
?>
<?php if(count($this->professionalPaginator)){ ?>
    <img src="<?php echo Engine_Api::_()->storage()->get($this->professionalPaginator->file_id)->getPhotoUrl(); ?>" alt="" width="100" height="100">
   <?php echo $this->translate('name ');?><?php echo $this->professionalPaginator->name ?><br/>
    <?php echo $this->translate('designation ');?><?php echo $this->professionalPaginator->designation ?><br/>
    <?php echo $this->translate('location ');?><?php echo $this->professionalPaginator->location ?><br/>
    <?php echo $this->translate('timezone ');?><?php echo $this->professionalPaginator->timezone ?><br/>
    <?php echo $this->translate('description ');?><?php echo $this->professionalPaginator->description ?><br/>
    <?php echo $this->translate('rating ');?><?php echo $this->professionalPaginator->rating ?><br/>
<?php } else { ?>
    <div class="tip"><span><?php echo $this->translate('No professional available'); ?></span></div>
<?php } ?>



