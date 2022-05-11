<div class="tip">
  <span>
    <?php echo $this->translate("Booking is not possible because Professional not enable payment gateway yet!"); ?>
    <a href="<?php echo $this->url(array('module' => 'booking', 'controller' => 'index', 'action' => 'index'), 'booking_general', true) ?>">Go back</a>
  </span>
</div>