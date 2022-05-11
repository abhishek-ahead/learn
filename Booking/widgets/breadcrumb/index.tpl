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
<div class="sesbasic_breadcrumb">
    <?php if($this->subject->getType()=="professional"){ ?>
    <a href="<?php echo $this->url(array('action' => 'professionals'), 'booking_general'); ?>"><?php echo $this->translate("Browse Professional"); ?></a>&nbsp;&raquo;
    <?php } ?>
    <?php if($this->subject->getType()=="booking_service"){ ?>
    <a href="<?php echo $this->url(array('action' => 'index'), 'booking_general'); ?>"><?php echo $this->translate("Browse Services"); ?></a>&nbsp;&raquo;
    <?php } ?>
    <?php echo $this->subject->getTitle(); ?>
</div>
