<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    User
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: _followmembers.tpl 9747 2012-07-26 02:08:08Z john $
 * @author     Jung
 */
?>
<?php
$subject = $this->subject ? $this->subject : $subject;

$followTable = Engine_Api::_()->getDbTable('follows', 'user');
$isFollow = $followTable->getFollowStatus($subject->user_id);

$followClass = (!$isFollow) ? 'fa-check' : 'fa-times' ;

$getFollowResourceStatus = $followTable->getFollowResourceStatus($subject->user_id);

$getFollowUserStatus = $followTable->getFollowUserStatus($subject->user_id);

$iconType = $this->iconType ? $this->iconType : ' ';
?>
<?php if($isFollow && $getFollowResourceStatus->user_approved == 1 && $getFollowResourceStatus->resource_approved == 1) { ?>
  <a href='javascript:;' data-icontype="<?php echo $iconType; ?>" data-url='<?php echo $subject->getIdentity(); ?>' class='buttonlink user_follow user_follow_<?php echo $subject->getIdentity() ?> <?php echo $iconType; ?>'><i class='fa fa-times'></i><span><?php echo $this->translate('Following'); ?></span></a>
<?php } else if($getFollowResourceStatus &&  $getFollowResourceStatus->user_approved == 0 && $getFollowResourceStatus->resource_approved == 1) { ?>
  <a href='javascript:;' data-icontype="<?php echo $iconType; ?>" data-url='<?php echo $subject->getIdentity(); ?>' class='buttonlink user_follow user_follow_<?php echo $subject->getIdentity(); ?> <?php echo $iconType; ?>' data-bs-toggle="tooltip" data-bs-title="<?php echo $this->translate('Cancel Follow Request'); ?>"><i class='fa fa-times'></i> <span><?php echo $this->translate('Requested'); ?></span></a>
<?php } else if( $getFollowResourceStatus && $getFollowResourceStatus->user_approved == 0 && $getFollowResourceStatus->resource_approved == 1 ) { ?>
  <a href='javascript:;' data-icontype="<?php echo $iconType; ?>" data-url='<?php echo $subject->getIdentity(); ?>' class='buttonlink user_follow user_follow_<?php echo $subject->getIdentity(); ?> <?php echo $iconType; ?>'><i class='fa fa-times'  title='<?php echo $this->translate('Confirm'); ?>'></i> <span><?php echo $this->translate('Confirm'); ?></span></a>
<?php } else if(empty($isFollow) && empty($getFollowResourceStatus)) { ?>
  <a href='javascript:;' data-icontype="<?php echo $iconType; ?>" data-url='<?php echo $subject->getIdentity(); ?>' class='buttonlink user_followers user_follow user_follow_<?php echo $subject->getIdentity(); ?> <?php echo $iconType; ?>'><i class='fa fa-check'></i> <span>
  <?php if(!empty($getFollowUserStatus) && !empty($getFollowUserStatus->user_approved) && !empty($getFollowUserStatus->resource_approved)) { ?>
    <?php echo $this->translate('Follow Back'); ?>
  <?php } else { ?>
    <?php echo $this->translate('Follow'); ?>
  <?php } ?>
  </span></a>
<?php } ?>
