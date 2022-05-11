<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: appointment.tpl  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
 
 ?>
<?php 
$this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/jscolor/jscolor.js');
$this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/jquery.min.js');
?>
<?php include APPLICATION_PATH .  '/application/modules/Booking/views/scripts/dismiss_message.tpl';?>

<div class='admin_search sesbasic_search_form'>
  <?php //echo $this->appointment->render($this); ?>
</div>
<h3>Appointments</h3>
<p>This page lists all the appointments on your website</p>
<br />
<?php if(count($this->getAllAppointmentsPaginator)){   ?>
  <table class='admin_table'>
    <thead>
      <tr>
        <th><?php echo $this->translate("ID") ?></th>
        <th><?php echo $this->translate("Provider Name") ?></th>
        <th><?php echo $this->translate("user Name") ?></th>
        <th><?php echo $this->translate("Service Name") ?></th>
        <th><?php echo $this->translate("Date") ?></th>
        <th><?php echo $this->translate("Start Time") ?></th>
        <th><?php echo $this->translate("End Time") ?></th>
        <th><?php echo $this->translate("Status") ?></th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($this->getAllAppointmentsPaginator as $item): ?>
      <tr>
        <td><?php echo $item->appointment_id; ?></td>
        <td><?php $userSelected = Engine_Api::_()->getItem('user',$item->professional_id); echo $userSelected->displayname;?></td>
        <td><?php $userSelected = Engine_Api::_()->getItem('user',$item->user_id); echo $userSelected->displayname;?></td>
        <td><?php $serviceName=Engine_Api::_()->getDbTable('services', 'booking')->getServices(array('service_id'=>$item->service_id)); echo $serviceName->name;?></td>
        <td><?php echo date("d F Y (D)",strtotime($item->date)); ?></td>
        <td><?php echo date("h:i A",strtotime($item->professionaltime)); ?></td>
        <td><?php echo date("h:i A",strtotime($item->serviceendtime)); ?></td>
        <td><?php if($item->action=="completed") echo "completed"; else if($item->action=="reject") echo "reject"; else if($item->action=="cancelled") echo "cancelled"; else if($item->action=="0") echo "Pending"; else echo "hold" ?></td>
      </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
<?php } else { ?>
  <br />
  <div class="tip"><span>There are no Appointments created by members yet.</span></div>
<?php } ?>
