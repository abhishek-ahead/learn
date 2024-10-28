<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    User
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: get-main-photo.tpl 9747 2012-07-26 02:08:08Z john $
 * @author     Alex
 */
?>
<?php $settings = Engine_Api::_()->getApi('settings', 'core'); ?>
<div class="profile_cover_head_inner">
  <div class="profile_main_photo_wrapper">
    <div class="profile_main_photo b_dark">
      <div class="item_photo">
        <?php if (empty($this->uploadDefaultCover)): ?>
          <div class="main_thumb_photo">
            <?php if($this->user->getPhotoUrl('thumb.profile')) : ?>
              <span style="background-image:url('<?php echo $this->user->getPhotoUrl('thumb.profile');?>'); text-align:left;" id="user_profile_photo"></span>
            <?php else : ?>
              <span class="bg_item_photo bg_thumb_profile bg_item_photo_user bg_item_nophoto" id="user_profile_photo"></span>
            <?php endif;?>
          </div>
        <?php else: ?>
          <div class="main_thumb_photo">
            <span class="bg_item_photo bg_thumb_profile bg_item_photo_user bg_item_nophoto" id="user_profile_photo"></span>
          </div>
        <?php endif; ?>
        <?php if (!empty($this->can_edit) && empty($this->uploadDefaultCover)) : ?>
          <div id="mainphoto_options" class="profile_cover_options
            <?php if (!empty($this->uploadDefaultCover)) : ?> profile_main_photo_options is_hidden
            <?php else: ?> profile_main_photo_options<?php endif; ?>">
            <ul class="edit-button">
              <li>
                <?php if (!empty($this->user->photo_id)) : ?>
                  <span class="profile_cover_btn">
                    <i class="fa fa-camera" aria-hidden="true"></i>
                  </span>
                <?php else: ?>
                  <span class="profile_cover_btn">
                    <i class="fa fa-camera" aria-hidden="true"></i>
                  </span>
                <?php endif; ?>

                <ul class="profile_options_pulldown">
                  <li>
                    <a href='<?php echo $this->url(array(
                      'action' => 'upload-cover-photo',
                      'user_id' => $this->user->user_id,
                      'photoType' => 'profile'), 'user_coverphoto', true); ?>' class="profile_cover_icon_photo_upload smoothbox">
                      <?php echo $this->translate('Upload Photo'); ?>
                    </a>
                  </li>
                  <?php if (Engine_Api::_()->getDbtable('modules', 'core')->isModuleEnabled('album')):?>
                    <li>
                      <?php echo $this->htmlLink(
                        $this->url(array(
                          'action' => 'choose-from-albums',
                          'user_id' => $this->user->user_id,
                          'photoType' => 'profile'
                        ), 'user_coverphoto', true),
                        $this->translate('Choose from Albums'),
                        array(' class' => 'profile_cover_icon_photo_view smoothbox')); ?>
                    </li>
                  <?php endif; ?>
                  <?php if (!empty($this->user->photo_id)) : ?>
                    <li>
                      <?php echo $this->htmlLink(
                        array('route' => 'user_coverphoto', 'action' => 'remove-cover-photo', 'user_id' => $this->user->user_id, 'photoType' => 'profile'),
                        $this->translate('Remove'),
                        array(' class' => 'smoothbox profile_cover_icon_photo_delete')); ?>
                    </li>
                  <?php endif; ?>
                </ul>
              </li>
            </ul>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </div>
  <?php 
    $viewer = Engine_Api::_()->user()->getViewer();
    $subject = Engine_Api::_()->core()->getSubject();
  ?>
  <?php if (empty($this->uploadDefaultCover)): ?>
    <div class="cover_photo_profile_information">
      <div class="cover_photo_profile_status">
        <?php if($this->subject()) { ?>
          <h2>
            <?php echo $this->subject()->getTitle() ?>
          </h2>
          <p class="cover_photo_stats">
            <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('user.signup.username', 1) && $this->subject()->username) { ?>
              <span><?php echo $this->translate("@%s", $this->subject()->username); ?></span>
            <?php } ?>
            <?php if(Engine_Api::_()->getApi('settings', 'core')->user_friends_eligible && $subject->member_count){ ?>
              <span><?php echo $this->translate(array('%s Friend', '%s Friends', $subject->member_count), $this->locale()->toNumber($subject->member_count)) ?></span>
            <?php } ?>
            <?php if ($settings->getSetting('core.followenable', '1')) { ?>
              <?php $followersCount = Engine_Api::_()->getDbTable('follows', 'user')->followers(array('user_id' => $subject->getIdentity())); ?>
              <?php if(engine_count($followersCount)) { ?>
                <span><?php echo $this->translate(array('%s Follower', '%s Followers', engine_count($followersCount)), engine_count($followersCount)) ?>  </span>
              <?php } ?>
              <?php $followingCount = Engine_Api::_()->getDbTable('follows', 'user')->following(array('user_id' => $subject->getIdentity())); ?>
              <?php if(engine_count($followingCount)) { ?>
                <span><?php echo $this->translate('%s Following', engine_count($followingCount)); ?></span>
              <?php } ?>
            <?php } ?>
          </p>
        <?php } ?>
      </div>
      <?php if($this->viewer()->getIdentity()) { ?>
      <div class="coverphoto_navigation">
        <ul class="coverphoto_navigation_list">
          <?php 
           $label = "Edit My Profile";
           if( !$viewer->isSelf($subject) ) {
             $label = "Edit User Profile";
           }
           $auth = $subject->isSuperAdmin() ? $viewer->isSuperAdmin($subject) : 1;
           if( $subject->authorization()->isAllowed($viewer, 'edit') && $auth) {
          ?>
            <li>
              <a class="edit_profile" href="<?php echo $this->url(array('controller' => 'edit','action' => 'profile','id' => ( $viewer->getGuid(false) == $subject->getGuid(false) ? null : $subject->getIdentity())),'user_extended',true)  ?>"> 
                <i class="fas fa-user-edit"></i>              
                <span> <?php echo $this->translate($label); ?> </span>
              </a>
            </li>
          <?php } ?>
          <?php 
            $messageAllowed = true;
            if( !$viewer->getIdentity() || $viewer->getGuid(false) === $subject->getGuid(false) ) {
              $messageAllowed = false;
            }else{
              // Get setting?
              $viewerPermission = Engine_Api::_()->authorization()->getPermission($viewer->level_id, 'messages', 'create');
              if( Authorization_Api_Core::LEVEL_DISALLOW === $viewerPermission ) {
                $messageAllowed = false;
              }else{
                $subjectPermission = Engine_Api::_()->authorization()->getPermission($subject->level_id, 'messages', 'create');
                if( Authorization_Api_Core::LEVEL_DISALLOW === $subjectPermission ) {
                  $messageAllowed = false;
                }else{
                  $messageAuth = Engine_Api::_()->authorization()->getPermission($viewer->level_id, 'messages', 'auth');
                  if( $messageAuth == 'none' ) {
                    $messageAllowed = false;
                  } else if( $messageAuth == 'friends' ) {
                    // Get data
                    $direction = (int) $settings->getSetting('user.friends.direction', 1);
                    if( !$direction ) {
                      //one way
                      $friendship_status = $viewer->membership()->getRow($subject);
                    }
                    else $friendship_status = $subject->membership()->getRow($viewer);
              
                    if( !$friendship_status || $friendship_status->active == 0 ) {
                      $messageAllowed = false;
                    }
                  }
                }
              }
            }
            if($messageAllowed){
          ?>
          <li>
             <a class="smoothbox" href="<?php echo $this->url(array('action' => 'compose','to' => $subject->getIdentity(),'format' => 'smoothbox'),'messages_general',true) ?>" >
              <i class="fas fa-comment-dots"></i>
              <span> <?php echo $this->translate('Send Message'); ?> </span>
             </a>
          </li>    
          <?php } ?>

          <?php 
            $allowFriendhship = true;
            if( !$viewer->getIdentity() || $viewer->getGuid(false) === $subject->getGuid(false) ) {
              $allowFriendhship = false;
            }else{

              // No blocked
              if( $viewer->isBlockedBy($subject) ) {
                $allowFriendhship = false;
              }
          
              // Check if friendship is allowed in the network
              $eligible = (int) $settings->getSetting('user.friends.eligible', 2);
              if( !$eligible ) {
                $allowFriendhship = false;
              }
          
              // check admin level setting if you can befriend people in your network
              else if( $eligible == 1 ) {
          
                $networkMembershipTable = Engine_Api::_()->getDbtable('membership', 'network');
                $networkMembershipName = $networkMembershipTable->info('name');
          
                $select = new Zend_Db_Select($networkMembershipTable->getAdapter());
                $select
                  ->from($networkMembershipName, 'user_id')
                  ->join($networkMembershipName, "`{$networkMembershipName}`.`resource_id`=`{$networkMembershipName}_2`.resource_id", null)
                  ->where("`{$networkMembershipName}`.user_id = ?", $viewer->getIdentity())
                  ->where("`{$networkMembershipName}_2`.user_id = ?", $subject->getIdentity())
                ;
          
                $data = $select->query()->fetch();
          
                if( empty($data) ) {
                  $allowFriendhship = false;
                }
              }
              
              $friendsParams = array();
              if($allowFriendhship){
                // One-way mode
                $direction = (int) $settings->getSetting('user.friends.direction', 1);
                if( !$direction ) {
                  $viewerRow = $viewer->membership()->getRow($subject);
                  $subjectRow = $subject->membership()->getRow($viewer);
                  
            
                  // Viewer?
                  if( null === $subjectRow ) {
                    // Follow
                    $friendsParams[] = array(
                      'label' => 'Follow',
                      'class' => 'smoothbox icon_friend_add',
                      'route' => 'user_extended',
                      'params' => array(
                        'controller' => 'friends',
                        'action' => 'add',
                        'user_id' => $subject->getIdentity()
                      ),
                    );
                  } else if( $subjectRow->resource_approved == 0 ) {
                    // Cancel follow request
                    $friendsParams[] = array(
                      'label' => 'Cancel Follow Request',
                      'class' => 'smoothbox icon_friend_remove',
                      'route' => 'user_extended',
                      'params' => array(
                        'controller' => 'friends',
                        'action' => 'cancel',
                        'user_id' => $subject->getIdentity()
                      ),
                    );
                  } else {
                    // Unfollow
                    $friendsParams[] = array(
                      'label' => 'Following',
                      'class' => 'smoothbox icon_friend_remove',
                      'route' => 'user_extended',
                      'params' => array(
                        'controller' => 'friends',
                        'action' => 'remove',
                        'user_id' => $subject->getIdentity()
                      ),
                    );
                  }
                  // Subject?
                  if( null === $viewerRow ) {
                    // Do nothing
                  } else if( $viewerRow->resource_approved == 0 ) {
                    // Approve follow request
                    $friendsParams[] = array(
                      'label' => 'Approve Follow Request',
                      'class' => 'smoothbox icon_friend_add',
                      'route' => 'user_extended',
                      'params' => array(
                        'controller' => 'friends',
                        'action' => 'confirm',
                        'user_id' => $subject->getIdentity()
                      ),
                    );
                  } else {
                    // Remove as follower?
                    $friendsParams[] = array(
                      'label' => 'Remove as Follower',
                      'class' => 'smoothbox icon_friend_remove',
                      'route' => 'user_extended',
                      'params' => array(
                        'controller' => 'friends',
                        'action' => 'remove',
                        'user_id' => $subject->getIdentity(),
                        'rev' => true,
                      ),
                    );
                  }
                  
                }
            
                // Two-way mode
                else {
                  $row = $viewer->membership()->getRow($subject);
                  if( null === $row ) {
                    // Add
                    $friendsParams[] = array(
                      'label' => 'Add Friend',
                      'class' => 'smoothbox icon_friend_add',
                      'route' => 'user_extended',
                      'params' => array(
                        'controller' => 'friends',
                        'action' => 'add',
                        'user_id' => $subject->getIdentity()
                      ),
                    );
                  } else if( $row->user_approved == 0 ) {
                    // Cancel request
                    $friendsParams[] = array(
                      'label' => 'Cancel Friend Request',
                      'class' => 'smoothbox icon_friend_remove',
                      'route' => 'user_extended',
                      'params' => array(
                        'controller' => 'friends',
                        'action' => 'cancel',
                        'user_id' => $subject->getIdentity()
                      ),
                    );
                  } else if( $row->resource_approved == 0 ) {
                    // Approve request
                    $friendsParams[] = array(
                      'label' => 'Approve Friend Request',
                      'class' => 'smoothbox icon_friend_add',
                      'route' => 'user_extended',
                      'params' => array(
                        'controller' => 'friends',
                        'action' => 'confirm',
                        'user_id' => $subject->getIdentity()
                      ),
                    );
                  } else {
                    // Remove friend
                    $friendsParams[] = array(
                      'label' => 'Remove Friend',
                      'class' => 'smoothbox icon_friend_remove',
                      'route' => 'user_extended',
                      'params' => array(
                        'controller' => 'friends',
                        'action' => 'remove',
                        'user_id' => $subject->getIdentity()
                      ),
                    );
                  }
                }
              }
            }
        
            if(@$friendsParams && engine_count(@$friendsParams)){
          ?>
            <?php foreach($friendsParams as $params){ ?>
            <li>
              <a href="<?php echo $this->url($params["params"],$params["route"],true) ?>" class="buttonlink <?php echo $params['class']; ?>">
                <span> <?php echo $this->translate($params["label"]); ?> </span>
              </a>
            </li> 
            <?php } ?>
          <?php } ?>
          <?php if($settings->getSetting('core.followenable',1)  && !Engine_Api::_()->user()->getViewer()->isSelf($subject)) { ?>
            <?php $getFollowUserStatus = Engine_Api::_()->getDbTable('follows', 'user')->getFollowUserStatus($subject->user_id); ?>
              <li>    
                <?php echo $this->partial('_followmembers.tpl', 'user', array('subject' => $subject)); ?> 
              </li>
           <?php } ?>
          <li>
            <a href="javascript:void(0)" class="coverphoto_navigation_dropdown_btn" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fas fa-ellipsis-h"></i>
            </a>
            <ul class="dropdown-menu">
              <?php foreach( $this->userNavigation as $link ): ?>
                <li>
                  <a class="<?php echo  'buttonlink' . ( $link->getClass() ? ' ' . $link->getClass() : '' ) . (!empty($link->get('icon')) ? $link->get('icon') : ''); ?>" href='<?php echo $link->getHref() ?>' aria-label="<?php echo $this->translate($link->getlabel()) ?>">
                  <?php echo $this->translate($link->getlabel()) ?>
                  </a>
                </li>
              <?php endforeach; ?>
            </ul>            
          </li>         
        </ul>
      </div> 
      <?php } ?>
      <?php if( $this->auth ): ?>
      <div class="profile_status_text profile_status_scroll" id="user_profile_status_container">
        <?php $status = Engine_Text_Emoji::decode($this->subject()->status); ?>
        <?php echo $this->viewMore($this->getHelper('getActionContent')->smileyToEmoticons($status)) ?>
        <?php if( !empty($this->subject()->status) && $this->subject()->isSelf($this->viewer())): ?>
          <a class="profile_status_clear" href="javascript:void(0);" onclick="en4.user.clearStatus();">(<?php echo $this->translate('clear') ?>)</a>
        <?php endif; ?>
      </div>
    <?php endif; ?>
    <?php if($settings->getSetting('core.followenable',1) && Engine_Api::_()->user()->getViewer()->getIdentity() && !Engine_Api::_()->user()->getViewer()->isSelf($subject)) { ?>
      <?php $getFollowUserStatus = Engine_Api::_()->getDbTable('follows', 'user')->getFollowUserStatus($subject->user_id); ?>
      <?php 
      $follow_verification = false;
      if(!empty($settings->getSetting('core.allowuserverfication', 0)) && $this->viewer()->follow_verification) { 
        $follow_verification = true;
      } elseif(empty($settings->getSetting('core.allowuserverfication', 0)) && empty($settings->getSetting('core.autofollow', 0))) {
        $follow_verification = true;
      }
      ?>
      <?php if($follow_verification && $getFollowUserStatus && $this->viewer()->getIdentity() == $getFollowUserStatus->user_id && $getFollowUserStatus->user_approved == 0) { ?>
        <div class="coverphoto_follow_inner" id="coverphoto_follow_inner">
          <ul class="coverphoto_follow_btns"> 
            <li class="coverphoto_follow_text"><?php echo $this->translate("%s wants to follow you.", $subject->getTitle()); ?></li>
            <li>
              <a id="user_follow_accept_<?php echo $getFollowUserStatus->follow_id; ?>" href='javascript:;' data-action="accept" data-follow_id="<?php echo $getFollowUserStatus->follow_id; ?>" data-url='<?php echo $subject->getIdentity(); ?>' class='user_follow follow_accept_btn user_follow_<?php echo $subject->getIdentity(); ?>'>
                <i class='fa fa-check'></i>
                  <span><?php echo $this->translate('Confirm'); ?></span>
              </a>
            </li>
            <li>
              <a id="user_follow_reject_<?php echo $getFollowUserStatus->follow_id; ?>" href='javascript:;' data-action="reject" data-follow_id="<?php echo $getFollowUserStatus->follow_id; ?>" data-url='<?php echo $subject->getIdentity(); ?>' class='user_follow follow_reject_btn user_follow_<?php echo $subject->getIdentity(); ?>'>
                <i class='fa fa-times'></i>
                <span><?php echo $this->translate('Delete'); ?></span>
              </a>
            </li> 
          </ul>
        </div>  
      <?php } ?>
    <?php } ?>
  </div>
  <?php endif; ?>
</div>  
<script>
  scriptJquery(function () {
    scriptJquery('[data-toggle="tooltip"]').tooltip()
  })
</script>
