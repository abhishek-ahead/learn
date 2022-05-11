<?php
?>
<span class="feed_attachment_booking_service">
<div> 
	<a href="<?php echo $this->service->getHref(); ?>">
  	<img src="<?php echo Engine_Api::_()->storage()->get($this->service->file_id, '')->getPhotoUrl('thumb.main') ?>" alt="<?php echo $this->service->getTitle(); ?>"></a>
  <div>
    <div class="feed_item_link_title"> <a href="<?php echo $this->service->getHref(); ?>" class="ses_tooltip" data-src="<?php echo $this->service->getGuid(); ?>"><?php echo $this->service->getTitle(); ?></a> </div>
    <div class="feed_item_link_desc"> <?php echo Engine_String::strlen(strip_tags($this->service->description)) > 255 ? Engine_String::substr(strip_tags($this->service->description), 0, 255) . '...' : strip_tags($this->service->description); ?> </div>
</div>
</div>
</span>