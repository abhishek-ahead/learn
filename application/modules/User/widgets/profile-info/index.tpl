<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    User
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: index.tpl 10158 2014-04-10 19:07:53Z lucas $
 * @author     John
 */
?>
<div class="user_profile_info">
  <ul>
    <?php if( !empty($this->memberType)): ?>
      <li class="profile_type">
        <div>
          <span><?php echo $this->translate('Profile Type:') ?></span>
          <?php echo $this->translate($this->memberType) ?>
        </div>
      </li>
    <?php endif; ?>
    <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('network.enable', 1) && !empty($this->networks) && engine_count($this->networks) > 0 ): ?>
      <li class="profile_networks">
        <div>
          <span><?php echo $this->translate('Networks:') ?></span>
          <?php echo $this->fluentList($this->networks, true) ?>
        </div>
      </li>
    <?php endif; ?>
    <li class="profile_views">
      <div>
      <span><?php echo $this->translate('Profile Views:') ?></span>
      <?php echo $this->translate(array('%s view', '%s views', $this->subject->view_count),
          $this->locale()->toNumber($this->subject->view_count)) ?>
      </div>
    </li>
    <?php if(Engine_Api::_()->getApi('settings', 'core')->user_friends_eligible) { ?>
      <li class="profile_friends">
        <div>
          <span><?php echo $this->translate('Friends:') ?></span>
          <?php echo $this->translate(array('%s friend', '%s friends', $this->subject->member_count), $this->locale()->toNumber($this->subject->member_count)) ?>
        </div>
      </li>
    <?php } ?>
    <li class="profile_updates">
      <div>
        <span><?php echo $this->translate('Last Update:'); ?></span>
        <?php 
          if($this->subject->modified_date != "0000-00-00 00:00:00"){
            echo $this->timestamp($this->subject->modified_date);
          }
          else{
              echo $this->timestamp($this->subject->creation_date);
          }
        ?>
      </div>
    </li>
    <li class="profile_login">
      <div>  
        <span><?php echo $this->translate('Last Login:') ?></span>
        <?php if ($this->subject->lastlogin_date): ?>
          <span><?php echo $this->timestamp($this->subject->lastlogin_date) ?></span>
        <?php else: ?>
          <span><?php echo $this->translate('Never') ?></span>
        <?php endif ?>
      </div>
    </li>
    <li class="profile_joined">
      <div>
        <span><?php echo $this->translate('Joined:') ?></span>
        <?php echo $this->timestamp($this->subject->creation_date) ?>
      </div>
    </li>
    <li class="profile_level">
      <div>
        <span><?php echo $this->translate('Member Level:') ?></span>
        <?php echo $this->translate(Engine_Api::_()->getItem('authorization_level', $this->subject->level_id)->getTitle()); ?>
      </div>
    </li>
    <?php if( $this->inviter ): ?>
        <li class="profile_invite">
          <div>
            <span> <?php echo $this->translate('Invitee:') ?></span>
            <?php echo $this->translate($this->inviter); ?>
          </div>
        </li>
    <?php endif; ?>
    <?php if( !$this->subject->enabled && $this->viewer->isAdmin() ): ?>
      <li class="profile_enabled">
        <div> 
          <em>
            <?php echo $this->translate('Enabled:') ?>
            <?php echo $this->translate('No') ?>
          </em>
        </div>
      </li>
    <?php endif; ?>
  </ul>
</div>
<script type="text/javascript">
  scriptJquery('.core_main_user').parent().addClass('active');
</script>
