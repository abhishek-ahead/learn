<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: _customtime.tpl  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
 
 ?>
<div id="starttime-wrapper" class="form-wrapper">
    <div id="starttime-label" class="form-label">
        <label for="starttime" class="required">Start Time</label>
    </div>
    <div id="starttime-element" class="form-element">
        <input type="text" name="starttime" id="starttime" value="<?php echo $this->starttime; ?>" class="ui-timepicker-input" autocomplete="off">
    </div>
</div>
<div id="endtime-wrapper" class="form-wrapper">
    <div id="endtime-label" class="form-label">
        <label for="endtime" class="required">End Time</label>
    </div>
    <div id="endtime-element" class="form-element">
        <input type="text" name="endtime" id="endtime" value="<?php echo $this->endtime; ?>">
    </div>
</div>
