<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    Core
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: index.tpl 9747 2012-07-26 02:08:08Z john $
 * @author     John
 */
?>
<?php $showSearch = true; ?>
<div id='core_menu_mini_menu' <?php if(empty($this->viewer->getIdentity())) { ?>class="minimenu_guest"<?php }; ?>>
  <ul>
    <?php foreach( $this->navigation as $item ): ?>
      <?php
        $linkTitle = '';
        $subclass = '';
        $linkTitle = $this->translate(strip_tags($item->getLabel()));
        if( $this->showIcons ) {
          $subclass = ' show_icons';
        }
        $className = explode(' ', $item->class);
        $class = !empty($item->class) ? $item->class . $subclass : null;
      ?>
      <?php if(end($className) == 'core_mini_profile') { ?>
        <li class="core_mini_menu_profile">
          <div class="core_settings_dropdown" id="minimenu_settings_content">
            <ul>
              <li>
                <a href="<?php echo $this->viewer->getHref(); ?>">
                  <i class="menuicon"><?php echo Zend_Registry::get('Zend_View')->itemBackgroundPhoto($this->viewer, 'thumb.icon'); ?></i>
                  <span><?php echo $this->viewer->getTitle(); ?></span>
                </a>
              </li>
              <li class="sep"><span></span></li>
              
              <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('core.general.recent.login', 1) && isset($_COOKIE['user_login_users'])) { ?>
                <li data-class="notifications_donotclose" class="core_minimenu_switchuser core_minimenu_icon switch_user_pulldown " id="switch_user_pulldown"> 
                  <a id="switch_account" data-class="notifications_donotclose" href="javascript:void(0);" onclick="showRecentloginPopup();" title="<?php echo $this->translate("Switch Account"); ?>">
                    <i class="menuicon fas fa-exchange-alt"></i>
                    <span><?php echo $this->translate("Switch Account"); ?></span>
                    <i data-class="notifications_donotclose" id="switch_account_i" class="fa fa-ellipsis-h"></i>
                  </a>
                  <div id="core_switch_user" class="core_switch_account_pulldown" style="display:none;">
                    <div class="core_switch_account_pulldown_header">
                      <p class="_heading"><?php echo $this->translate("Switch Account"); ?></p>
                      <p class="font_small"><?php echo $this->translate("You can switch your accounts from below or log into another account."); ?></p>
                    </div>
                    <div class="core_switch_account_list">
                      <?php $recent_login = Zend_Json::decode($_COOKIE['user_login_users']); ?>
                      <?php if(engine_count($recent_login) > 0) { ?>
                        <?php foreach($recent_login as $users) { ?>
                          <?php $userArray = explode("_", $users);
                            $user = Engine_Api::_()->getItem('user', $userArray[0]); ?>
                          <?php if($this->viewer->getIdentity() == $user->getIdentity()) { continue; ?><?php } ?>
                          <?php if($user && isset($user->user_id)) { ?>
                            <div id="core_recent_login_<?php echo $user->getIdentity(); ?>" class="core_switch_account_list_item d-flex  align-items-center"> 
                              <a <?php if($this->viewer->getIdentity() == $user->getIdentity()) { ?> class="recent_login_disable" <?php } else { ?> onclick="loginAsUser('<?php echo $user->user_id ?>','<?php echo $userArray[1] ?>', 0);"  <?php } ?> href="javascript:;" >
                                <div class="members_tab_item d-flex align-items-center">
                                  <div class="_img"> <?php echo $this->itemBackgroundPhoto($user, 'thumb.icon'); ?> </div>
                                  <div class="_cont">
                                    <span class="_name"><?php echo $user->getTitle(); ?></span>
                                    <?php $notificationCount = Engine_Api::_()->getDbtable('notifications', 'activity')->hasNotifications($user); ?>
                                    <?php if($notificationCount > 0) { ?>
                                      <span class="_notification font_small font_color_light"><?php echo $this->translate(array('%s notification', '%s notifications', $notificationCount),$notificationCount); ?></span>
                                    <?php } ?>
                                  </div>
                                </div>
                              </a>
                              <?php if($this->viewer->getIdentity() != $user->getIdentity()) { ?>
                                <a href="javascript:void(0);" onclick="removeRecentUser('<?php echo $user->getIdentity(); ?>', 'recent_login_remove');" class="close-btn"  data-bs-toggle="modal" data-bs-target="#recent_login_remove"><i class="fa fa-times"></i></a>
                              <?php } ?>
                            </div>
                          <?php } ?>
                        <?php } ?>
                      <?php } ?>
                      <div class="sep"><span></span></div>
                      <div class="core_switch_account_list_item login_other mt-0"> 
                        <a href="<?php echo $this->baseUrl()."/user/auth/poplogin?user_id=newuseradd&type=".true;  ?>" >
                          <div class="members_tab_item d-flex align-items-center">
                            <div class="_img d-flex align-items-center justify-content-center"><i class="fa fa-plus"></i></div>
                            <div class="_cont"> <span class="_name add_user"><?php echo $this->translate("Log into another account"); ?></span> </div>
                          </div>
                        </a> 
                      </div>
                    </div>
                  </div>
                </li>
                <li class="sep"><span></span></li>
              <?php } ?>
              
              <?php foreach( $this->core_minimenuquick as $link ): ?>
                <li>
                  <a href='<?php echo $link->getHref() ?>' class="<?php echo $link->getClass() ? ' ' . $link->getClass() : ''  ?>"
                    <?php if( $link->get('target') ): ?> target='<?php echo $link->get('target') ?>' <?php endif; ?> >
                    <i class="menuicon <?php echo $link->get('icon') ? $link->get('icon') : 'fa fa-star' ?>"></i>
                    <span><?php echo $this->translate($link->getlabel()) ?></span>
                  </a>
                </li>
              <?php endforeach; ?>
              <li class="sep"><span></span></li>
              <?php if(Engine_Api::_()->user()->getViewer()->isAllowed('admin')) { ?>
                <li>
                  <a href="<?php echo $this->url(array(), 'admin_default', true); ?>">
                    <i class="menuicon fas fa-tools"></i>
                    <span><?php echo $this->translate("Admin Panel");?></span>
                  </a>
                </li>
              <?php } ?>
              <li>
                <a href="<?php echo $this->url(array(), 'user_logout', true); ?>">
                  <i class="menuicon fas fa-sign-out-alt"></i>
                  <span><?php echo $this->translate("Sign Out");?></span>
                </a>
              </li>
              <?php if(!empty($this->accessibility)) { ?>
                <li class="sep"><span></span></li>
                <li id="thememodetoggle">
                  <label data-class="notifications_donotclose" for="theme_mode_toggle">
                    <i class="menuicon fas fa-adjust"></i>
                    <?php if($this->contrast_mode == 'dark_mode') { ?>
                      <span><?php echo $this->translate("Mode");?></span>
                      <input type="checkbox" <?php if(isset($_SESSION['mode_theme']) && $_SESSION['mode_theme'] == 'dark_mode') { ?> checked="checked" <?php } ?> id="theme_mode_toggle" data-class="notifications_donotclose" />
                      <i class="contrastmode_toggle _light"><i class="fas fa-sun"></i><i class="fas fa-moon"></i></i>
                    <?php } else { ?>
                      <span><?php echo $this->translate("Mode");?></span>
                      <input type="checkbox" <?php if(isset($_SESSION['mode_theme']) && $_SESSION['mode_theme'] == 'light_mode') { ?> checked="checked" <?php } ?> id="theme_mode_toggle" data-class="notifications_donotclose" />
                      <i class="contrastmode_toggle _dark"><i class="fas fa-moon"></i><i class="fas fa-sun"></i></i>
                    <?php } ?>
                  </label>
                </li>
                <li id="themefontmode">
                  <div>
                    <i class="menuicon fas fa-font"></i>
                    <span><?php echo $this->translate("Font Size") ?></span>
                    <ul class="resizer"> 
                      <li class="<?php echo !empty($_SESSION['font_theme']) && $_SESSION['font_theme'] == '85%' ? 'active' : '' ; ?>"><a href="javascript:void(0)" title="<?php echo $this->translate('Small Font') ?>" onclick="smallfont(this)">A <sup>-</sup></a></li>
                      <li class="<?php echo empty($_SESSION['font_theme']) || !$_SESSION['font_theme'] ? 'active' : '' ; ?>"><a href="javascript:void(0)" title="<?php echo $this->translate('Default Font') ?>" onclick="defaultfont(this)">A</a></li>
                      <li class="<?php echo !empty($_SESSION['font_theme']) && $_SESSION['font_theme'] == '115%' ? 'active' : '' ; ?>"><a href="javascript:void(0)" title="<?php echo $this->translate('Large Font') ?>" onclick="largefont(this)">A <sup>+</sup></a></li>
                    </ul>
                  </div>
                </li>
              <?php } ?>
            </ul>
          </div>
          <a href="javascript:void(0);" class="<?php echo $class; ?>" <?php if( $item->get('target') ): ?> target='<?php echo $item->get('target') ?>' <?php endif; ?> data-class="notifications_donotclose" id="minimenu_settings" onclick="showSettingsBox();">
            <?php if($this->viewer()->getIdentity()) { ?>
              <?php echo Zend_Registry::get('Zend_View')->itemBackgroundPhoto($this->viewer, 'thumb.icon'); ?>
              <i class="icon_down fas fa-angle-down"></i>
            <?php } else { ?>
              <i class="minimenu_icon fas fa-angle-down"></i>
            <?php } ?>
            <span class="_linktxt"><?php echo $this->translate("Me"); ?></span>
          </a>
        </li>
      <?php } else if(engine_count($this->currencies) > 1 && end($className) == 'core_mini_currency') { ?>
        <?php $currentCurrency = Engine_Api::_()->payment()->getCurrentCurrency(); ?>
        <?php $currentData = Engine_Api::_()->getDbTable('currencies', 'payment')->getCurrency($currentCurrency); ?>
        <li class="mini_menu_currency_chooser dropdown">
          <a href="javascript:;" id="currency_btn_currency" class="show_icons dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <?php if(isset($currentData->icon) && !empty($currentData->icon)) { ?>
              <?php $path = Engine_Api::_()->core()->getFileUrl($currentData->icon); ?>
              <?php if($path) { ?>
                <i class="minimenu_icon"><img src="<?php echo $path; ?>" alt="img"></i>
              <?php } ?>
            <?php } else{ ?>
              <i class="minimenu_icon icon_currency"></i>
            <?php } ?>
            <span class="_linktxt"><?php echo $currentCurrency; ?></span>
          </a>
          <div class="dropdown-menu dropdown-menu-end">
            <ul id="currency_change_data">
              <?php $defaultCurrency = Engine_Api::_()->payment()->defaultCurrency(); ?>
              <?php foreach ($this->currencies as $currency) { ?>
                <?php if($currentCurrency == $currency->code)
                    $active ='selected';
                  else
                    $active ='';
                ?>
                <li class="<?php echo $active; ?>">
                  <a href="javascript:;" class="dropdown-item" data-rel="<?php echo $currency->code; ?>" title="<?php echo $currency->title; ?>">
                  <?php if(isset($currency->icon) && !empty($currency->icon)) { ?>
                    <?php $path = Engine_Api::_()->core()->getFileUrl($currency->icon); ?>
                    <?php if($path) { ?>
                      <i><img src="<?php echo $path; ?>" alt="img"></i>
                    <?php } ?>
                  <?php } ?>
                  <span><?php echo $currency->code; ?></span>
                  </a>
                </li>
              <?php } ?>
            </ul>
          </div>  
        </li>

      <?php } else if(end($className) == 'core_mini_messages') { ?>
        <li class="core_mini_messages">
          <?php if($this->message_count && $this->showIcons) { ?>
            <span id="minimenu_message_count_bubble" class="minimenu_message_count_bubble <?php echo $subclass ?>"><?php echo $this->message_count; 
          ?></span>
          <?php } ?>
          <div class="pulldown_contents_wrapper" id="pulldown_message" style="display:none;">
            <div class="pulldown_contents">
              <div class="core_pulldown_header">
                <?php echo $this->translate("Messages "); ?><a class="icon_message_new righticon fa fa-plus" href="messages/compose" title="<?php echo $this->translate('Compose New Message'); ?>"></a>
              </div>
              <ul class="messages_menu" id="messages_menu">
                <li class="notifications_loading" style="padding:10px;">
                  <div class="pulldown_content_loading">
                    <div class="ropulldown_content_loading_item">
                      <div class="circle loading-animation"></div>
                      <div class="column">
                        <div class="line line1 loading-animation"></div>
                        <div class="line line2 loading-animation"></div>
                    </div>
                    </div>
                    <div class="ropulldown_content_loading_item">
                      <div class="circle loading-animation"></div>
                      <div class="column">
                        <div class="line line1 loading-animation"></div>
                        <div class="line line2 loading-animation"></div>
                    </div>
                    </div>
                    <div class="ropulldown_content_loading_item">
                      <div class="circle loading-animation"></div>
                      <div class="column">
                        <div class="line line1 loading-animation"></div>
                        <div class="line line2 loading-animation"></div>
                    </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="pulldown_options" id="pulldown_options">
              <a id="messages_viewall_link" href="<?php echo $this->url(array('action' => 'inbox'), 'messages_general', true) ?>"><?php echo $this->translate("View All Messages") ?></a>
              <a href="javascript:void(0);" id="messages_markread_link" onclick="markAllReadMessages();"><?php echo $this->translate("Mark All Read") ?></a>
            </div>
          </div>
          <a href="javascript:void(0);" class="<?php echo $class; ?>" <?php if( $item->get('target') ): ?> target='<?php echo $item->get('target') ?>' <?php endif; ?> title="<?php echo $linkTitle; ?>" alt="<?php echo ( !empty($item->alt) ? $item->alt : null ); ?>" data-class="notifications_donotclose" id="minimenu_message" onclick="showMessageBox();"><i class="minimenu_icon <?php echo $item->get('icon') ? $item->get('icon') : 'far fa-star' ?>"></i><span class="_linktxt"><?php echo $this->translate("Messages"); ?></span></a>
        </li>
      <?php } else { ?>
        <?php $isauth = engine_in_array(end($className), array('core_mini_auth','core_mini_signup')); ?>
        <li>
        <a href='<?php echo $item->getHref() ?>' class="<?php echo $class  ?>"
          <?php if( $item->get('target') ): ?> target='<?php echo $item->get('target') ?>' <?php endif; ?> title="<?php echo $linkTitle; ?>" alt="<?php echo ( !empty($item->alt) ? $item->alt : null ); ?>">
            <?php if($this->showIcons) {  ?>
              <i class="minimenu_icon <?php echo $item->get('icon') ? $item->get('icon') : (!$isauth ? 'far fa-star' : '') ?>"></i>
            <?php } ?>
            <?php if(stripos($item->class, 'core_mini_update') !== false ) { ?>
              <span class="_linktxt"><?php echo $this->translate("Notifications"); ?></span>
            <?php } else { ?>
              <span class="_linktxt"><?php echo $linkTitle; ?></span>
            <?php } ?>
          </a>
          <!-- For displaying count bubble : START -->
          <?php
            $countText = filter_var($item->getLabel(), FILTER_SANITIZE_NUMBER_INT);
          ?>
          <?php if($this->showIcons && stripos($item->class, 'core_mini_update') !== false ) : ?>
            <span class="minimenu_update_count_bubble <?php echo $subclass ?>" id="update_count">
              <?php echo $countText; ?>
            </span>
          <?php elseif( stripos($item->class, 'core_mini_messages') !== false && !empty($countText) ) : ?>
            <span class="minimenu_message_count_bubble <?php echo $subclass ?>" id="message_count">
              <?php echo $countText; ?>
            </span>
          <?php endif; ?>
          <!-- For displaying count bubble : END -->
        </li>
      <?php } ?>
    <?php endforeach; ?>
    <?php if(empty($this->viewer()->getIdentity()) && !empty($this->accessibility)) { ?>
      <li class="core_mini_menu_accessibility" id="core_mini_menu_accessibility">
        <div class="core_settings_dropdown" id="minimenu_settings_content">
          <div class="core_pulldown_header">
            <?php echo $this->translate("Accessibility Tools");?> 
          </div>
          <ul>
            <li id="thememodetoggle">
              <label data-class="notifications_donotclose" for="theme_mode_toggle">
                <i class="menuicon fas fa-adjust"></i>
                <?php if($this->contrast_mode == 'dark_mode') { ?>
                  <span><?php echo $this->translate("Mode");?></span>
                  <input type="checkbox" <?php if(isset($_SESSION['mode_theme']) && $_SESSION['mode_theme'] == 'dark_mode') { ?> checked="checked" <?php } ?> id="theme_mode_toggle" data-class="notifications_donotclose" />
                  <i class="contrastmode_toggle _light"><i class="fas fa-sun"></i><i class="fas fa-moon"></i></i>
                <?php } else { ?>
                  <span><?php echo $this->translate("Mode");?></span>
                  <input type="checkbox" <?php if(isset($_SESSION['mode_theme']) && $_SESSION['mode_theme'] == 'light_mode') { ?> checked="checked" <?php } ?> id="theme_mode_toggle" data-class="notifications_donotclose" />
                  <i class="contrastmode_toggle _dark"><i class="fas fa-moon"></i><i class="fas fa-sun"></i></i>
                <?php } ?>
              </label>
            </li>
            <li id="themefontmode">
              <div>
                <i class="menuicon fas fa-font"></i>
                <span><?php echo $this->translate("Font Size") ?></span>
                <ul class="resizer"> 
                  <li class="<?php echo !empty($_SESSION['font_theme']) && $_SESSION['font_theme'] == '85%' ? 'active' : '' ; ?>"><a href="javascript:void(0)" title="<?php echo $this->translate('Small Font') ?>" onclick="smallfont(this)">A <sup>-</sup></a></li>
                  <li class="<?php echo empty($_SESSION['font_theme']) || !$_SESSION['font_theme'] ? 'active' : '' ; ?>"><a href="javascript:void(0)" title="<?php echo $this->translate('Default Font') ?>" onclick="defaultfont(this)">A</a></li>
                  <li class="<?php echo !empty($_SESSION['font_theme']) && $_SESSION['font_theme'] == '115%' ? 'active' : '' ; ?>"><a href="javascript:void(0)" title="<?php echo $this->translate('Large Font') ?>" onclick="largefont(this)">A <sup>+</sup></a></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <a href="javascript:void(0);" class="show_icons" data-class="notifications_donotclose" id="minimenu_settings" onclick="showSettingsBox();">
          <i class="minimenu_icon fas fa-universal-access"></i>
          <span class="_linktxt"><?php echo $this->translate("Accessibility"); ?></span>
        </a>
      </li>
    <?php } ?>
  </ul>
</div>

<span  style="display: none;" class="updates_pulldown" id="core_mini_updates_pulldown">
  <div class="pulldown_contents_wrapper">
    <div class="pulldown_contents">
      <div class="core_pulldown_header"><?php echo $this->translate("Notifications");?></div>
      <ul class="notifications" id="notifications_menu">
        <div class="notifications_loading" id="notifications_loading">
          <div class="pulldown_content_loading">
            <div class="ropulldown_content_loading_item">
              <div class="circle loading-animation"></div>
              <div class="column">
                <div class="line line1 loading-animation"></div>
                <div class="line line2 loading-animation"></div>
            </div>
            </div>
            <div class="ropulldown_content_loading_item">
              <div class="circle loading-animation"></div>
              <div class="column">
                <div class="line line1 loading-animation"></div>
                <div class="line line2 loading-animation"></div>
            </div>
            </div>
            <div class="ropulldown_content_loading_item">
              <div class="circle loading-animation"></div>
              <div class="column">
                <div class="line line1 loading-animation"></div>
                <div class="line line2 loading-animation"></div>
            </div>
            </div>
          </div>
        </div>
      </ul>
    </div>
    <div class="pulldown_options" id="pulldown_options">
      <?php echo $this->htmlLink(array('route' => 'default', 'module' => 'activity', 'controller' => 'notifications'), $this->translate('View All Updates'), array('id' => 'notifications_viewall_link')) ?>
      <?php echo $this->htmlLink('javascript:void(0);', $this->translate('Mark All Read'), array('id' => 'notifications_markread_link')) ?>
    </div>
  </div>
</span>

<?php if(!empty($this->viewer->getIdentity())) { ?>

<!-- Remove Account -->
<div id="remove_pop_wrap">
  <div class="modal fade" id="recent_login_remove" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="recent_login_removeLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content" id="send_recentremove_form">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="recent_login_removeLabel"><?php echo $this->translate("Remove account"); ?></h1>
        </div>
        <div class="modal-body">
          <p><?php echo $this->translate("This member will need to enter their email address and password the next time they log in."); ?></p>
        </div>
        <div class="modal-footer">
          <form action="" method="post" id="remove_recentlogin_form" enctype="multipart/form-data">
            <input type="hidden" name="removeUserId" id="removeUserId" />
            <input type="hidden" name="redirectURL" id="redirectURL" value="<?php echo $_SERVER['REQUEST_URI']; ?>" />
            <button type="button" class="btn btn-link" data-bs-dismiss="modal" onclick="closeRemoveUser();"><?php echo $this->translate("Cancel"); ?></button>
            <button type="button" class="btn btn-primary" id="remove_account"><?php echo $this->translate('Remove Account'); ?></button>
          </form>
        </div>
        <div class="core_loading_cont_overlay" id="core_loading_cont_overlay" style="display:none;"></div>
      </div>
    </div>
  </div>
</div>

<script type='text/javascript'>

  scriptJquery(document).ready(function() {
    scriptJquery(scriptJquery('#remove_pop_wrap').html()).appendTo('body');
    scriptJquery('#remove_pop_wrap').remove()
  });

	function showRecentloginPopup() {
    if(document.getElementById('core_switch_user').style.display == 'block') {
      document.getElementById('core_switch_user').style.display = 'none';
      scriptJquery('#switch_user_pulldown').removeClass('switch_user_pulldown_selected');
    } else {
      document.getElementById('core_switch_user').style.display = 'block';
      scriptJquery('#switch_user_pulldown').addClass('switch_user_pulldown_selected');
    }
	}

  function messageProfilePage(pageUrl){
    if(pageUrl != 'null' ) {
      window.location.href=pageUrl;
    }
  }
  
  function deleteMessage(id, event) {
    event.stopPropagation();
    scriptJquery.ajax({
      url : en4.core.baseUrl + 'core/index/delete-message',
      dataType : 'json',
      method : 'post',
      data : {
        format : 'json',
        'id' : id
      },
      success : function(responseJSON) {
        if(responseJSON.status) {
          scriptJquery('#message_conversation_'+id).remove(); 
          scriptJquery('#minimenu_message_count_bubble').html(responseJSON.message_count);
          if(scriptJquery('#messages_menu li').length == 0) {
            scriptJquery('#messages_menu').html('<div class="pulldown_loading"><?php echo $this->string()->escapeJavascript($this->translate('You have no message.')); ?></div>');
            scriptJquery('#minimenu_message_count_bubble').removeClass('show_icons').html('0');
          }
          
        }
      }
    });
  }
  
  function markAllReadMessages() {
  
    event.stopPropagation();
    en4.core.request.send(scriptJquery.ajax({
      url : en4.core.baseUrl + 'core/index/mark-all-read-messages',
      dataType : 'json',
      method : 'post',
      data : {
        format: 'json'
      },
      success : function(responseJSON) {
        if(scriptJquery('#messages_menu').length) {
          var message_children = scriptJquery('#messages_menu').children('li');
          scriptJquery('#minimenu_message_count_bubble').removeClass('show_icons').hide();
          scriptJquery('#pulldown_message').hide();
        }
      }
    }));
  }

  scriptJquery(document).ready(function() {
    scriptJquery('#minimenu_settings_content').find('ul').removeClass('category_options generic_list_widget');
    scriptJquery("body").on('click',function(event) {
      if(event.target.id != '' && event.target.id != 'updates_toggle' && event.target.getAttribute('data-class') != 'notifications_donotclose') {
        if(scriptJquery(".updates_pulldown_active").length > 0)
          scriptJquery('.updates_pulldown_active').attr('class', 'updates_pulldown');

        if(scriptJquery("#pulldown_message").length && document.getElementById("pulldown_message").style.display == 'block')
          document.getElementById("pulldown_message").style.display = 'none';
          
        if(scriptJquery('#minimenu_settings_content').length && document.getElementById("minimenu_settings_content").style.display == 'block') {
          document.getElementById('minimenu_settings_content').style.display = 'none';
          scriptJquery('#switch_user_pulldown').removeClass('switch_user_pulldown_selected');
          scriptJquery('#core_switch_user').hide();
        }
      }
    });
  });

  function showMessageBox() {
  
    if(scriptJquery('#minimenu_settings_content').length && document.getElementById("minimenu_settings_content").style.display == 'block') {
      document.getElementById('minimenu_settings_content').style.display = 'none';
      scriptJquery('#switch_user_pulldown').removeClass('switch_user_pulldown_selected');
      scriptJquery('#core_switch_user').hide();
    }
      
    if(scriptJquery(".updates_pulldown_active").length > 0)
      scriptJquery('.updates_pulldown_active').attr('class', 'updates_pulldown');
      
    if(scriptJquery('#pulldown_message').length && document.getElementById("pulldown_message").style.display == 'block')
      document.getElementById('pulldown_message').style.display = 'none';
    else
      document.getElementById('pulldown_message').style.display = 'block';

    showMessages();
  }

  function showMessages() {
    scriptJquery.ajax({
      url: en4.core.baseUrl + 'core/index/inbox',
      data: {
        format : 'html'
      },
      method:'post',
      dataType: 'html',
      success: function (responseHTML) {
         document.getElementById('messages_menu').innerHTML = responseHTML;
      },
      error: function (err) {
         console.log(err);
      }
    });
  }
  
  var notificationUpdater;
  en4.core.runonce.add(function(){
    if(scriptJquery('#notifications_markread_link').length){
      scriptJquery('#notifications_markread_link').on('click', function() {
        en4.activity.hideNotifications('<?php echo $this->string()->escapeJavascript($this->translate("0 Updates"));?>');
      });
    }
    <?php if ($this->updateSettings && $this->viewer->getIdentity()): ?>
    notificationUpdater = new NotificationUpdateHandler({
              'delay' : <?php echo $this->updateSettings;?>
            });
    notificationUpdater.start();
    window._notificationUpdater = notificationUpdater;
    <?php endif;?>
  });

  var updateElement = scriptJquery('#core_menu_mini_menu').find('.core_mini_update:first');
  if( updateElement.length ) {
    updateElement.attr('id', 'updates_toggle');
    scriptJquery('#core_mini_updates_pulldown').css('display', 'inline-block').appendTo(updateElement.parent().attr('id', 'core_menu_mini_menu_update'));

    updateElement.appendTo(scriptJquery('#core_mini_updates_pulldown'));

    scriptJquery('#core_mini_updates_pulldown').on('click', function(event) {
      if(event.target.getAttribute('data-class') != 'notifications_donotclose') {
        var element = scriptJquery(this);
        if(element.hasClass('updates_pulldown')) {
          element.removeClass('updates_pulldown');
          element.addClass('updates_pulldown_active');
          showNotifications();
        } else {
          element.addClass('updates_pulldown');
          element.removeClass('updates_pulldown_active');
        }
      }
    });
  }
  
  var showNotifications = function() {
  
    if(scriptJquery("#pulldown_message").length && document.getElementById("pulldown_message").style.display == 'block')
      document.getElementById("pulldown_message").style.display = 'none';
    
    if(scriptJquery('#minimenu_settings_content').length && document.getElementById("minimenu_settings_content").style.display == 'block') {
      document.getElementById('minimenu_settings_content').style.display = 'none';
      scriptJquery('#switch_user_pulldown').removeClass('switch_user_pulldown_selected');
      scriptJquery('#core_switch_user').hide();
    }
      
    en4.activity.updateNotifications();
    scriptJquery.ajax({
      url: en4.core.baseUrl + 'activity/notifications/pulldown',
      data:{
        format : 'html',
        page : 1
      },
      method:'post',
      dataType: 'html',
      success: function (responseHTML) {
        if( responseHTML ) {
          // hide loading icon
          if(scriptJquery('#notifications_loading').length) 
            scriptJquery('#notifications_loading').css('display', 'none');

            scriptJquery('#notifications_menu').html(responseHTML);
            //Mark All read notification
            scriptJquery('#update_count').removeClass('minimenu_update_count_bubble_active').html('0');
            en4.activity.hideNotifications('<?php echo $this->string()->escapeJavascript($this->translate("0 Updates"));?>');
            
            scriptJquery('#notifications_menu').on('click', function(event) {
            
            if(event.target.id != 'remove_notification_update') {
              
              event.preventDefault(); //Prevents the browser from following the link.
              
              var current_link = scriptJquery(event.target);
              var notification_li = current_link.parents('li');
              
              // if this is true, then the user clicked on the li element itself
              if( notification_li.attr('id') == 'core_menu_mini_menu_update' ) {
                notification_li = current_link;
              }

              var forward_link;
              if( current_link.attr('href') ) {
                forward_link = current_link.attr('href');
              } else if(current_link.hasClass("notification_subject_icon")){
                forward_link = current_link.parents("a").attr('href');
              } else{
                forward_link = current_link.find('a:last-child').attr('href');
              }
              
              if(forward_link == undefined) {
                forward_link = scriptJquery("#"+notification_li.attr('id')).find('.notification_item_photo').find('a').attr('href');
                if(forward_link == undefined)
                  forward_link = en4.core.baseUrl;
              }

              if( notification_li.hasClass('notifications_unread')){
                notification_li.removeClass('notifications_unread');
                scriptJquery.ajax({
                  url: en4.core.baseUrl + 'activity/notifications/markread',
                  data: {
                    format     : 'json',
                    notification_id : notification_li.val()
                  },
                  method:'post',
                  dataType: 'json',
                  success: function (response) {
                    window.location = forward_link;
                  },
                  error: function (err) {
                    console.log(err);
                  }
                });
              } else {
                window.location = forward_link;
              }

            }
            });
        } else {
          scriptJquery('#notifications_loading').html('<?php echo $this->string()->escapeJavascript($this->translate("You have no new updates."));?>');
          if(scriptJquery('#notifications_menu').length == 1) {
            scriptJquery('#notifications_menu').html('<div class="notifications_loading" id="notifications_loading">You have no new updates.</div>');
            scriptJquery('#update_count').removeClass('minimenu_update_count_bubble_active').html('0');
            scriptJquery("#pulldown_options").hide();
          }
        }
      },
      error: function () {
      }
    });
  };
  
  function removenotification(notification_id) {
    scriptJquery.ajax({
      url: en4.core.baseUrl + 'activity/notifications/remove-notification',
      data: {
        format : 'html',
        notification_id: notification_id,
      },
      method:'post',
      dataType: 'html',
      success: function (response) {
        var response =jQuery.parseJSON( response );
        if(response.status == 1) {
          scriptJquery('#notifications_'+notification_id).remove();
        }
      },
    });
  }


  var friendRequestSend = function(action, user_id, notification_id, event) {
  
    event.stopPropagation();
    
    if( action == 'confirm' ) {
      var url = '<?php echo $this->url(array('module' => 'user', 'controller' => 'friends', 'action' => 'confirm'), 'default', true) ?>';
    } else if( action == 'reject' ) {
      var url = '<?php echo $this->url(array('module' => 'user', 'controller' => 'friends', 'action' => 'reject'), 'default', true) ?>';
    }

    scriptJquery.ajax({
      'url' : url,
      'data' : {
        'user_id' : user_id,
        'format' : 'json',
        'token' : '<?php echo $this->token() ?>'
      },
      success : function(responseJSON) {
        if( !responseJSON.status ) {
          if(document.getElementById('user-widget-request-' + notification_id))
            document.getElementById('user-widget-request-' + notification_id).innerHTML = '<div class="request_success">' + responseJSON.error + '</div>';
        } else {
          if(document.getElementById('user-widget-request-' + notification_id))
            document.getElementById('user-widget-request-' + notification_id).innerHTML = '<div class="request_success">' +responseJSON.message+'</div>';
        }
        
        if( !responseJSON.status ) {
          if(document.getElementById('notifications_' + notification_id))
            document.getElementById('notifications_' + notification_id).innerHTML = '<div class="request_success">' + responseJSON.error + '</div>';
        } else {
          if(document.getElementById('notifications_' + notification_id))
            document.getElementById('notifications_' + notification_id).innerHTML = '<div class="request_success">' +responseJSON.message+'</div>';
        }
      }
    });
  }

  function redirectPage(event) {
    event.stopPropagation();
    var url;
    var current_link = event.target;
    var notification_li = $(current_link).getParent('div');
    if(current_link.get('href') == null && $(current_link).get('tag')!='img') {
      if($(current_link).get('tag') == 'li') {
        var element = $(current_link).getElements('div:last-child');
        var html = element[0].outerHTML;
        var doc = document.createElement("html");
        doc.innerHTML = html;
        var links = doc.getElementsByTagName("a");
        var url = links[links.length - 1].getAttribute("href");
      }
      else
      url = $(notification_li).getElements('a:last-child').get('href');
      if(typeof url == 'object') {
        url = url[0];
      }
      notification_li.removeClass('pulldown_content_list_highlighted');
      scriptJquery.ajax({
        url : en4.core.baseUrl + 'activity/notifications/markread',
        data : {
          format: 'json',
          notification_id: scriptJquery(current_link).closest('li').attr('value')
        },
        success : function() {
          window.location = url;
        }
      });
    }
  }
</script>
<?php } ?>

<?php if($showSearch) { ?>
  <script type='text/javascript'>
    en4.core.runonce.add(function() {
      // combining mini-menu and search widget if next to each other
      var menuElement = scriptJquery('#global_header').find('.layout_core_menu_mini:first');
      var nextWidget = menuElement.next();
      if( nextWidget.length && nextWidget.hasClass('layout_core_search_mini') ) {
        nextWidget.removeClass('generic_layout_container').prependTo(menuElement);
        return;
      }
      previousWidget = menuElement.previous();
      if( previousWidget.length && previousWidget.hasClass('layout_core_search_mini') ) {
        previousWidget.removeClass('generic_layout_container').prependTo(menuElement);
      }
    });
  </script>
<?php } ?>

<script type='text/javascript'>

  // Setting Dropdown
  function showSettingsBox() {
  
    if(scriptJquery(".updates_pulldown_active").length > 0)
      scriptJquery('.updates_pulldown_active').attr('class', 'updates_pulldown');
      
    if(scriptJquery("#pulldown_message").length && document.getElementById("pulldown_message").style.display == 'block')
      document.getElementById('pulldown_message').style.display = 'none';
    
    if(scriptJquery('#minimenu_settings_content').length && document.getElementById("minimenu_settings_content").style.display == 'block') {
      document.getElementById('minimenu_settings_content').style.display = 'none';
      scriptJquery('#switch_user_pulldown').removeClass('switch_user_pulldown_selected');
      scriptJquery('#core_switch_user').hide();
    }
    else {
      document.getElementById('minimenu_settings_content').style.display = 'block';
    }
  }

  //currency change
  scriptJquery(document).on('click','ul#currency_change_data li > a',function(){
    var currencyId = scriptJquery(this).attr('data-rel');
    setSesCookie('current_currencyId',currencyId,365);
    location.reload();
  });
  
  function setSesCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires+';path=/;';
  }
  
  scriptJquery("#theme_mode_toggle").change(function(){

    var checked = scriptJquery(this).is(":checked");
    if(checked == false) {
      <?php if($this->contrast_mode == 'dark_mode') { ?>
        scriptJquery('body').removeClass('dark_mode');
        scriptJquery.post("core/index/mode",{mode:"light_mode", theme:"elpis"},function (response) {
          location.reload();
        });
      <?php } else { ?>
        scriptJquery('body').removeClass("light_mode");
        scriptJquery.post("core/index/mode",{mode:"", theme:"elpis"},function (response) {
          location.reload();
        });
      <?php } ?>
    } else {
      <?php if($this->contrast_mode == 'dark_mode') { ?>
        scriptJquery('body').addClass("dark_mode").removeClass('light_mode');
        scriptJquery.post("core/index/mode",{mode:"dark_mode", theme:"elpis"},function (response) {
          location.reload();
        });
      <?php } else { ?>
        scriptJquery('body').addClass('light_mode');
        scriptJquery.post("core/index/mode",{mode:"light_mode", theme:"elpis"},function (response) {
          location.reload();
        });
      <?php } ?>
    }
  });
	
  function smallfont(obj){
    scriptJquery(obj).parent().parent().find('.active').removeClass('active');
    scriptJquery(obj).parent().addClass('active');
    scriptJquery('body').css({
    'font-size': '85%'
    });
    scriptJquery.post("core/index/font",{size:"85%"},function (response) {
    });
	}
	
	function defaultfont(obj){
    scriptJquery(obj).parent().parent().find('.active').removeClass('active');
    scriptJquery(obj).parent().addClass('active');
    scriptJquery('body').css({
    'font-size': ''
    });
    scriptJquery.post("core/index/font",{size:""},function (response) {
    });
	}
	
	function largefont(obj){
    scriptJquery(obj).parent().parent().find('.active').removeClass('active');
    scriptJquery(obj).parent().addClass('active');
    scriptJquery('body').css({
    'font-size': '105%'
    });
    scriptJquery.post("core/index/font",{size:"115%"},function (response) {
    });
	}
	
	en4.core.runonce.add(function() {
    if(typeof isThemeModeActive === 'undefined') {
      scriptJquery('#thememodetoggle').hide();
      scriptJquery("#themefontmode").hide();
      scriptJquery("#core_mini_menu_accessibility").hide();
    }
	});
  scriptJquery("#thememodetoggle").click(function(){
  scriptJquery(".core_settings_dropdown").hide();
  });
</script>
