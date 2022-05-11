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
<?php  if(count($this->servicePaginator)){ ?>
<?php $userSelected = Engine_Api::_()->getItem('user',$item->user_id);?>  
    <?php if($this->providericon) { ?><?php if($userSelected->photo_id):?><a href="<?php echo $userSelected->getHref();?>"><img src="<?php echo Engine_Api::_()->storage()->get($userSelected->photo_id)->getPhotoUrl(); ?>" alt=""></a><?php else:?><a href="<?php echo $userSelected->getHref();?>"><img src="application/modules/User/externals/images/nophoto_user_thumb_icon.png" alt=""></a><?php endif;?><?php }?>
    <?php if($this->providername)  echo $userSelected->displayname; ?>
    <img src="<?php echo Engine_Api::_()->storage()->get($this->servicePaginator->file_id)->getPhotoUrl(); ?>" alt="" width="100" height="100">
    <?php echo $this->translate('service name ');?><?php echo $this->servicePaginator->name ?><br/>
    <?php echo $this->translate('description ');?><?php echo $this->servicePaginator->description ?><br/>
    <?php echo $this->translate('price ');?><span><?php echo Engine_Api::_()->booking()->getCurrencyPrice($this->servicePaginator->price); ?></span><?php echo $this->translate(' / Time ');?><?php  echo $this->servicePaginator->duration." ".(($this->servicePaginator->timelimit=="h")?"Hour.":"Minutes."); ?>
<?php } else { ?>
    <div class="tip"><span><?php echo $this->translate('No professional available'); ?></span></div>
<?php }  ?>



