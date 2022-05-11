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
    name <?php echo $this->professionalPaginator->name ?><br/>
    designation <?php echo $this->professionalPaginator->designation ?><br/>
    location <?php echo $this->professionalPaginator->location ?><br/>
    timezone <?php echo $this->professionalPaginator->timezone ?><br/>
    description <?php echo $this->professionalPaginator->description ?><br/>
    rating <?php echo $this->professionalPaginator->rating ?><br/>
<?php } else { ?>
    <div class="tip"><span><?php echo $this->translate('No professional available'); ?></span></div>
<?php } ?>



