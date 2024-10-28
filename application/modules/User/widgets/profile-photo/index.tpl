<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    User
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: index.tpl 9747 2012-07-26 02:08:08Z john $
 * @author     John
 */
?>
<?php 
  $coverphoto = Engine_Api::_()->authorization()->getPermission($this->subject()->level_id, 'user', 'coverphoto');
  $coverphoto = $coverphoto ? Engine_Api::_()->core()->getFileUrl($coverphoto) : '';
?>
<div class="profile_photos_cover_section">
  <div class="profile_photos_cover_photo">
    <?php if(!empty($this->photo)) { ?>
      <img src="<?php echo $this->photo->getPhotoUrl('thumb.cover'); ?>" alt="profile img">
    <?php } else if(!empty($coverphoto)) { ?>
      <img src="<?php echo $coverphoto; ?>" alt="profile img">
    <?php } ?>
  </div>
  <div class="profile_photos_cover_photo_inner">
    <div class="profile_photo">
      <?php echo $this->htmlLink($this->subject()->getHref(), $this->itemBackgroundPhoto($this->subject(), 'thumb.profile')) ?>
    </div>
    <div class="profile_photo_main_content">
      <?php if($this->subject()) { ?>
        <h4>
          <a href="<?php echo $this->subject()->getHref(); ?>"><?php echo $this->subject()->getTitle() ?></a>
        </h4>
      <?php } ?>
      <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('user.signup.username', 1)) { ?>
        <span class="username"><?php echo '@'.$this->subject()->username;?></span>
      <?php } ?>
    </div>
  </div>
  <?php if($this->friends->getTotalItemCount() > 0) { ?>
    <div class="profile_cover_user_friend_main">
      <h6><?php echo $this->translate("Recent Friends"); ?></h6>
      <ul class="profile_cover_user_friends">
        <?php foreach( $this->friends as $membership ) { ?>
          <?php if( !isset($this->friendUsers[$membership->resource_id]) ) continue;
            $member = $this->friendUsers[$membership->resource_id];
          ?>
          <li>
            <?php echo $this->htmlLink($member->getHref(), $this->itemBackgroundPhoto($member, 'thumb.icon')) ?>
          </li>
        <?php } ?>
      </ul>
    </div>
  <?php } ?>
</div>
