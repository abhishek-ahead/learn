<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    Activity
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: index.tpl 10018 2013-03-27 01:36:15Z john $
 * @author     John
 */
?>
<?php 
  $enabledModuleNames = Engine_Api::_()->getDbTable('modules', 'core')->getEnabledModuleNames();
  $staticBaseUrl = $this->layout()->staticBaseUrl;
  
  if(engine_in_array('music',$enabledModuleNames)) {
    $this->headScript()
      ->appendFile($staticBaseUrl . 'externals/audio/audio.min.js')
      ->appendFile($staticBaseUrl . 'application/modules/Music/externals/scripts/core.js')
      ->appendFile($staticBaseUrl . 'application/modules/Music/externals/scripts/player.js');
  }

  $this->headScript()->appendFile($staticBaseUrl . 'application/modules/Core/externals/scripts/comments_composer.js');
  $this->headScript()->appendFile($staticBaseUrl . 'application/modules/Core/externals/scripts/comments_composer_tag.js');
  $this->headScript()->appendFile($staticBaseUrl . 'application/modules/Core/externals/scripts/composer.js');
    
  if(engine_in_array('poll',$enabledModuleNames)) {
    $this->headScript()->appendFile($staticBaseUrl . 'application/modules/Poll/externals/scripts/core.js'); 
  }
?>
<?php if( (!empty($this->feedOnly) || !$this->endOfFeed ) &&
    (empty($this->getUpdate) && empty($this->checkUpdate)) ): ?>
  <script type="text/javascript">
    en4.core.runonce.add(function() {
      
      var activity_count = <?php echo sprintf('%d', $this->activityCount) ?>;
      var next_id = <?php echo sprintf('%d', $this->nextid) ?>;
      var subject_guid = '<?php echo $this->subjectGuid ?>';
      var endOfFeed = <?php echo ( $this->endOfFeed ? 'true' : 'false' ) ?>;

      var activityViewMore = window.activityViewMore = function(next_id, subject_guid,isFirstLoaded) {
        // if(en4.core.request.isRequestActive()) return;
        
        var url = '<?php echo $this->url(array('module' => 'core', 'controller' => 'widget', 'action' => 'index', 'content_id' => $this->identity), 'default', true) ?>';         
        scriptJquery('#feed_viewmore').hide();
        scriptJquery('#feed_loading').show();
        
          var request = scriptJquery.ajax({
          url : url,
          dataType : 'html',
          method:"POST",
          data : {
            action_id: '<?php echo $this->action_id; ?>',
            format : 'html',
            maxid : next_id,
            feedOnly : true,
            nolayout : true,
            subject : subject_guid,
            search : '<?php echo $this->search ?>',
            isHashtagPage : '<?php echo $this->isHashtagPage ?>',
          },
          evalScripts : true,
          success : function(responseHTML) {
            if(isFirstLoaded){
              scriptJquery("#show-loading-cnt").hide();
              scriptJquery(responseHTML).insertBefore(scriptJquery('#feed_viewmore'));
              en4.core.runonce.trigger();
              Smoothbox.bind(scriptJquery('#activity-feed'));
              if(!scriptJquery("#activity-feed").length){
                scriptJquery("#no-feed-tip").show();
              }
            }else{
              scriptJquery(responseHTML).appendTo(scriptJquery('#activity-feed'));
              en4.core.runonce.trigger();
              Smoothbox.bind(scriptJquery('#activity-feed'));
            }
          }
        });
      }
      
      if( next_id > 0 && !endOfFeed ) {
        scriptJquery('#feed_viewmore').css('display','');
        scriptJquery('#feed_loading').css('display','none');
        scriptJquery('#feed_viewmore_link').off('click').on('click', function(event){
          event.preventDefault();
          activityViewMore(next_id, subject_guid);
        });
      } else {
        scriptJquery('#feed_viewmore').css('display','none');
        scriptJquery('#feed_loading').css('display','none');
      }
      
    });
  </script>
<?php endif; ?>

<?php if( !empty($this->feedOnly) && empty($this->checkUpdate)): // Simple feed only for AJAX
  echo $this->activityLoop($this->activity, array(
    'action_id' => $this->action_id,
    'viewAllComments' => $this->viewAllComments,
    'viewAllLikes' => $this->viewAllLikes,
    'similarActivities' => $this->similarActivities,
    'getUpdate' => $this->getUpdate,
    'viewMaxPhoto' => $this->viewMaxPhoto,
    'hashtag' => $this->hashtag
  ));
  return; // Do no render the rest of the script in this mode
endif; ?>

<?php if( !empty($this->checkUpdate) ): // if this is for the live update
  if ($this->activityCount)
  echo "<script type='text/javascript'>
          document.title = '($this->activityCount) ' + activityUpdateHandler.title;
          activityUpdateHandler.options.next_id = ".$this->firstid.";
        </script>

        <div class='tip'>
          <span>
            <a href='javascript:void(0);' onclick='javascript:activityUpdateHandler.getFeedUpdate(".$this->firstid.");$(\"feed-update\").empty();'>
              {$this->translate(array(
                  '%d new update is available - click this to show it.',
                  '%d new updates are available - click this to show them.',
                  $this->activityCount),
                $this->activityCount)}
            </a>
          </span>
        </div>";
  return; // Do no render the rest of the script in this mode
endif; ?>

<?php if ($this->isHashtagPage): ?>
   <script type="text/javascript">
     <?php if ($this->search):?>
      var text = 'Trending Posts: <a href = "<?php echo $this->url(array('controller' => 'hashtag', 'action' => 'index'), "core_hashtags")
        . "?search=" . urlencode('#' . $this->search);?>"><?php echo "#" . $this->search; ?></a>';
    <?php else:?>
      var text = 'Trending Posts';
    <?php endif;?>
    scriptJquery('.layout_activity_feed').find('h3:first').html(text);
   </script>
<?php endif;?>

<?php if( !empty($this->getUpdate) ): // if this is for the get live update ?>
   <script type="text/javascript">
     activityUpdateHandler.options.last_id = <?php echo sprintf('%d', $this->firstid) ?>;
   </script>
<?php endif; ?>

<?php if( $this->enableComposer && !$this->isHashtagPage): ?>
  <div class="activity-post-container nolinks">

    <form method="post" action="<?php echo $this->url(array('module' => 'activity', 'controller' => 'index', 'action' => 'post'), 'default', true) ?>" class="activity" enctype="application/x-www-form-urlencoded" id="activity-form">
      <textarea id="activity_body" cols="1" rows="1" name="body" placeholder="<?php echo $this->escape($this->translate('Post Something...')) ?>"></textarea>
      <input type="hidden" name="return_url" value="<?php echo $this->url() ?>" />
      <?php if( $this->viewer() && $this->subject() && !$this->viewer()->isSelf($this->subject())): ?>
        <input type="hidden" name="subject" value="<?php echo $this->subject()->getGuid() ?>" />
      <?php endif; ?>
      <?php if( $this->formToken ): ?>
        <input type="hidden" name="token" id="token" value="<?php echo $this->formToken ?>" />
      <?php endif ?>
        <div id="compose-menu" class="compose-menu">
         <div class="compose-right-content">
          <?php if (!empty($this->privacyList) || !empty($this->networkList)): ?>
            <script type="text/javascript">
              var togglePrivacyPulldownEnable = true;
              scriptJquery(document).ready(function () {
                scriptJquery(document.body).on('click', function() {
                  if (togglePrivacyPulldownEnable && scriptJquery('#privacy_pulldown').hasClass('privacy_pulldown_active')) {
                    scriptJquery('#privacy_pulldown').addClass('privacy_pulldown').removeClass('privacy_pulldown_active');
                  }
                  togglePrivacyPulldownEnable = true;
                });
              });
              var togglePrivacyPulldown = function ( element) {
                scriptJquery('.privacy_list').each(function (evnet) {
                  var otherElement = scriptJquery(this);
                  var pulldownElement = otherElement.find('#privacy_pulldown_active');
                  if (pulldownElement) {
                    pulldownElement.addClass('privacy_pulldown').removeClass('privacy_pulldown_active');
                  }
                });
                if (scriptJquery(element).hasClass('privacy_pulldown')) {
                  scriptJquery(element).removeClass('privacy_pulldown').addClass('privacy_pulldown_active');
                } else {
                  //element.addClass('privacy_pulldown').removeClass('privacy_pulldown_active');
                }
                if (scriptJquery(element).hasClass('privacy_pulldown_active')) {
                  setTimeout(function() {
                     composeInstance.getMenu().css('display', '');
                   },300);
                }
                togglePrivacyPulldownEnable = false;
              }

              var setPrivacyValue = function (value, label, classicon) {
                scriptJquery('li.activity_tab_active').each(function (el) {
                  scriptJquery(this).removeClass('activity_tab_active').addClass('activity_tab_unactive');
                });
                scriptJquery('#privacy_list_' + value).addClass('activity_tab_active').removeClass('activity_tab_unactive');
                scriptJquery('#auth_view').val(value);
                scriptJquery('#privacy_pulldown_button').html('<i class="privacy_pulldown_icon ' + classicon + ' "></i><span>' + label + ' </span>');
                scriptJquery("#privacy_lable_tip").html(en4.core.language.translate("<?php echo $this->string()->escapeJavascript($this->translate('Share with %s')) ?>", label));
                scriptJquery('#privacy_pulldown').removeClass('privacy_pulldown_active').addClass('privacy_pulldown');
              }

              var showMultiNetworks = function () {
                Smoothbox.open('<?php echo $this->url(array(
                  'module' => 'activity',
                  'controller' => 'index',
                  'action' => 'add-multiple-networks'), 'default', true) ?>');
                var element = scriptJquery('#privacy_pulldown');
                if(scriptJquery(element).hasClass('privacy_pulldown') ) {
                  element.removeClass('privacy_pulldown').addClass('privacy_pulldown_active');
                } else {
                  element.addClass('privacy_pulldown').removeClass('privacy_pulldown_active');
                }
              }
            </script>
            <div class='privacy_list' id='privacy_list'>
              <div class="privacy_pulldown dropdown" id="privacy_pulldown" onmousedown="togglePrivacyPulldown(this);">
                <p class="privacy_list_tip">
                  <span id="privacy_lable_tip">
                    <?php echo $this->translate("Share with %s", $this->defaultPrivacyLabel) ?>
                  </span>
                  <img src="<?php echo $staticBaseUrl ?>application/modules/Activity/externals/images/tooltip-arrow-down.png" alt="" />
                </p>
                <a href="javascript:void(0);" id="privacy_pulldown_button" class="privacy_pulldown_button dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="privacy_pulldown_icon <?php echo $this->defaultPrivacyClass ?>"></i>
                  <span>
                    <?php echo !empty($this->defaultPrivacyLabel) ? $this->translate($this->defaultPrivacyLabel) : '' ?>
                  </span>
                </a>
                <ul class="privacy_dropdown dropdown-menu dropdown-menu-end" id="privacylist">
                  <?php foreach( $this->privacyList as $key => $value ): ?>
                    <li class="<?php echo ( $key == $this->defaultPrivacy ? 'activity_tab_active' : 'activity_tab_unactive' ) ?>" id="privacy_list_<?php echo $key ?>" onclick="setPrivacyValue('<?php echo $key ?>', '<?php echo $this->string()->escapeJavascript($this->translate($value)); ?>', 'activity_icon_feed_<?php echo $key ?>')" title="<?php echo $this->translate("Share with %s", $value); ?>" >
                      <a class="dropdown-item" href="javascript:void(0);">
                        <i class="privacy_pulldown_icon activity_icon_feed_<?php echo $key ?>"></i>
                        <div><?php echo $this->translate($value); ?></div>
                      </a>
                    </li>
                  <?php endforeach; ?>
                  <?php if(Engine_Api::_()->getApi('settings', 'core')->getSetting('network.enable', 1)) { ?>
                  <?php if(!empty($this->privacyList) && !empty($this->networkList)): ?>
                    <li class="sep"></li>
                  <?php endif;?>
                  <?php foreach( $this->networkList as $key => $value ): ?>
                    <li class="<?php echo ( $key == $this->defaultPrivacy ? 'activity_tab_active' : 'activity_tab_unactive' ) ?>" id="privacy_list_<?php echo $key ?>" onclick="setPrivacyValue('<?php echo $key ?>', '<?php echo $this->string()->escapeJavascript($this->translate($value)); ?>', 'activity_icon_feed_network')" title="<?php echo $this->translate("Share with %s", $value); ?>" >
                      <a class="dropdown-item" href="javascript:void(0);">
                        <i class="privacy_pulldown_icon activity_icon_feed_network"></i>
                        <div><?php echo $this->translate($value); ?></div>
                      </a>
                    </li>
                  <?php endforeach; ?>
                  <?php if(is_array($this->networkList) && engine_count($this->networkList) > 1): ?>
                    <li class="sep"></li>
                    <li onclick="showMultiNetworks();">
                      <a class="dropdown-item" href="javascript:void(0);">
                        <i class="privacy_pulldown_icon activity_icon_feed_network"></i>
                        <div><?php echo $this->translate("Multiple Networks"); ?></div>
                      </a>
                    </li>
                  <?php endif;?>
                  <?php } ?>
                </ul>
              </div>
            </div>
          <?php endif;?>
          <input type="hidden" id="auth_view" name="auth_view" value="<?php echo $this->defaultPrivacy; ?>" />
          <button id="compose-submit" type="submit"><?php echo $this->translate("Share") ?></button>
          </div>
        </div>
    </form>
    <script type="text/javascript">
      var composeInstance;
      en4.core.runonce.add(function() {
        // @todo integrate this into the composer
        if( true ) {
          try {
            composeInstance = new Composer('#activity_body', {
              menuElement : '#compose-menu',
              hashtagEnabled : '<?php echo $this->hashtagEnabled ?>',
              baseHref : '<?php echo $this->baseUrl() ?>',
              postLength : <?php echo Engine_Api::_()->getApi('settings', 'core')->getSetting('activity_postLength',1000); ?>,
              lang : {
                'Post Something...' : '<?php echo $this->string()->escapeJavascript($this->translate('Post Something...')) ?>'
              },
              submitCallBack : en4.activity.post
            });
          }catch(err){ console.log(err); }
        }
      });
    </script>
    <?php foreach( $this->composePartials as $partial ): ?>
      <?php if (false !== strpos($partial[0], '_composeTag') && is_array($this->composerOptions) && !engine_in_array('userTags', $this->composerOptions)) {
        continue;
      }?>
      <?php echo $this->partial($partial[0], $partial[1], array(
        'composerType' => 'activity'
      )) ?>
    <?php endforeach; ?>
  </div>
  <?php if (is_array($this->composerOptions) && engine_in_array("emoticons", $this->composerOptions)): ?>
    <?php $emoticonsTag = Engine_Api::_()->activity()->getEmoticons();
        if (!empty($emoticonsTag)): ?>
        <script type="text/javascript">
          var hideEmoticonsBox = false;
          function htmlunescape(content) {
            var doc = new DOMParser().parseFromString(content, "text/html");
            return doc.documentElement.textContent;
          }

          function setEmoticonsBoard() {
            if (composeInstance) {
              composeInstance.focus();
            }

            hideEmoticonsBox = true;
            scriptJquery('#emoticons-activator').toggleClass('emoticons_active');
            scriptJquery('#emoticons-activator').toggleClass('');
            scriptJquery('#emoticons-board').toggleClass('emoticons_box_opened');
            scriptJquery('#emoticons-board').toggleClass('emoticons_box_closed');
            if (scriptJquery('#emoticons-activator').hasClass('emoticons_active')) {
              setTimeout(function() {
                composeInstance.getMenu().css('display', '');
              },300);
            }
          }

          function addEmoticonIcon(iconCode) {
            var content = htmlunescape(composeInstance.getContent());
            content = content.replace(/&nbsp;/g, ' ');
            if( !('useContentEditable' in composeInstance.options && composeInstance.options.useContentEditable )) {
              composeInstance.setContent(content + ' ' + iconCode);
              return;
            }
            var textBeforeCaret = content.substr(0, composeInstance.lastCaretPos);
            var textAfterCaret = content.substr(composeInstance.lastCaretPos);
            iconCode = ' ' + iconCode + ' ';
            composeInstance.setContent(textBeforeCaret + iconCode + textAfterCaret);
            composeInstance.setCaretPos(textBeforeCaret.length + iconCode.length);
            if ( composeInstance.getContent() !== '' ) {
              setTimeout(function() {
                composeInstance.getMenu().css('display', '');
              },300);
            }
          }

          scriptJquery(document.body).on('click',hideEmoticonsBoxEvent.bind());

          function hideEmoticonsBoxEvent() {
            if (!hideEmoticonsBox && scriptJquery('#emoticons-board').length) {
              scriptJquery('#emoticons-board').removeClass('emoticons_box_opened').addClass('emoticons_box_closed');
            }
            hideEmoticonsBox = false;
          }

          en4.core.runonce.add(function() {
            scriptJquery('#emoticons-activator').appendTo(scriptJquery('#compose-container'));
          });
        </script>
        <span id="emoticons-activator"  class="emoticons-activator"  onmousedown="setEmoticonsBoard()">
          <span id="emoticons-board"  class="emoticons_box emoticons_box_closed" >
          <span class="emoticons_box_arrow"></span>
          <?php foreach ($emoticonsTag as $symbol => $icon): ?>
            <span class="emoticons_box_icon" onmousedown='addEmoticonIcon("<?php echo $this->string()->escapeJavascript($symbol)?>")'>
              <?php echo "<img src=\"" . $staticBaseUrl .
                    "application/modules/Activity/externals/emoticons/images/$icon\" border=\"0\"/>" ?>
            </span>
          <?php endforeach; ?>
          </span>
        </span>
    <?php endif; ?>
  <?php endif; ?>
<?php endif; ?>

<?php if ($this->updateSettings && !$this->action_id): // wrap this code around a php if statement to check if there is live feed update turned on ?>
  <script type="text/javascript">
    var activityUpdateHandler;
    en4.core.runonce.add(function() {
      activity_type = 1;
      try {
          activityUpdateHandler = new ActivityUpdateHandler({
            'baseUrl' : en4.core.baseUrl,
            'basePath' : en4.core.basePath,
            'identity' : 4,
            'delay' : <?php echo $this->updateSettings;?>,
            'last_id': <?php echo sprintf('%d', $this->firstid) ?>,
            'subject_guid' : '<?php echo $this->subjectGuid ?>'
          });
          setTimeout("activityUpdateHandler.start()",1250);
          //activityUpdateHandler.start();
          window._activityUpdateHandler = activityUpdateHandler;
      } catch( e ) {
        //if( $type(console) ) console.log(e);
      }
    });
  </script>
<?php endif;?>

  <div class="tip" id="fail_msg" style="display: none;">
    <span>
      <?php $url = $this->url(array('module' => 'user', 'controller' => 'settings', 'action' => 'privacy'), 'default', true) ?>
      <?php echo $this->translate('The post was not added to the feed. Please check your %1$sprivacy settings%2$s.', '<a href="'.$url.'">', '</a>') ?>
    </span>
  </div>
<div class="tip" id="flood_msg" style="display: none;">
    <span id="flood_msg_cnt">

    </span>
</div>
<?php // If requesting a single action and it doesn't exist, show error ?>

<?php if( !$this->activity ): ?>
  <?php if( $this->action_id ): ?>
    <div id="no-feed-tip" style="display: none;">
      <h2><?php echo $this->translate("Activity Item Not Found") ?></h2>
      <p>
        <?php echo $this->translate("The page you have attempted to access could not be found.") ?>
      </p>
    </div>
  <?php else: ?>
    <div class="tip" id="no-feed-tip" style="display: none;">
      <span>
        <?php
          if(!$this->isHashtagPage) {
            echo $this->translate("Nothing has been posted here yet - be the first!");
          } else {
            echo $this->translate("No results found!");
          } ?>
      </span>
    </div>
  <?php endif; ?>
<?php endif; ?>

<?php if(!$this->fetchFeed){ ?>
  
  <div id="show-loading-cnt">
    <ul class="feed mt-2">
      <?php for($i=1;$i<=($this->action_id ? 1 : 4);$i++) { ?>
        <li class="activity-item">
          <div class="feed_content_loader">
            <div class="photo_box"></div>
            <div class="cont_line _title"></div>
            <div class="cont_line _date"></div>
            <div class="_cont"><div class="cont_line"></div><div class="cont_line"></div><div class="cont_line"></div></div>
            <div class="_footer"><div class="cont_line"></div><div class="cont_line"></div><div class="cont_line"></div></div>
            <div class="loader_animation"></div>
          </div>
        </li>
      <?php } ?>
      </ul>
  </div>
  <script type="text/javascript">
    // SHOW LOADER
    en4.core.runonce.add(function() {
      var subject_guid = '<?php echo $this->subjectGuid ?>';
      activityViewMore(0, subject_guid,true);
    });
  </script>
<?php } ?>
<div id="feed-update"></div>

<?php echo $this->activityLoop($this->activity, array(
  'action_id' => $this->action_id,
  'viewAllComments' => $this->viewAllComments,
  'viewAllLikes' => $this->viewAllLikes,
  'similarActivities' => $this->similarActivities,
  'getUpdate' => $this->getUpdate,
  'viewMaxPhoto' => $this->viewMaxPhoto,
  'hashtag' => $this->hashtag
)) ?>

<div class="feed_viewmore" id="feed_viewmore" style="display: none;">
  <?php echo $this->htmlLink('javascript:void(0);', $this->translate('View More'), array(
    'id' => 'feed_viewmore_link',
    'class' => 'buttonlink icon_viewmore'
  )) ?>
</div>

<div class="feed_viewmore" id="feed_loading" style="display: none;">
<div id="show-loading-cnt">
    <ul class="feed mt-2">
      <?php for($i=1;$i<=($this->action_id ? 1 : 4);$i++) { ?>
        <li>
          <div class="feed_content_loader">
            <div class="photo_box"></div>
            <div class="cont_line _title"></div>
            <div class="cont_line _date"></div>
            <div class="_cont"><div class="cont_line"></div><div class="cont_line"></div><div class="cont_line"></div></div>
            <div class="_footer"><div class="cont_line"></div><div class="cont_line"></div><div class="cont_line"></div></div>
            <div class="loader_animation"></div>
          </div>
        </li>
      <?php } ?>
      </ul>
  </div>
</div>
<style>
@keyframes placeHolderShimmer {
	0% {
	background-position:-800px 0;
	}
	100% {
	background-position:800px 0;
	}
}
</style>
<script type="text/javascript">
  var showEditMultiNetworks = function (action_id) {
    var action_id = action_id;
    var activityEditLink = '<?php echo $this->url(array(
      'module' => 'activity',
      'controller' => 'index',
      'action' => 'edit-multiple-networks',
      'action_id'=>''), 'default', true) ?>';
    Smoothbox.open(`${activityEditLink}${action_id}`);
    var element = scriptJquery('#privacy_pulldown');
    if(element.hasClass('privacy_pulldown') ) {
      element.removeClass('privacy_pulldown').addClass('privacy_pulldown_active');
    } else {
      element.addClass('privacy_pulldown').removeClass('privacy_pulldown_active');
    }
  }
  function setEditPrivacyValue(privacy,action_id) {
    if(privacy=="multi_networks"){
      showEditMultiNetworks(action_id);
    }
  }
  
  		
		en4.core.runonce.add(function() {
			scriptJquery(".feed_item_body_content > .feed_item_bodytext").each(function(){
        var element = scriptJquery(this);
        element.clone().insertAfter(scriptJquery(this).closest(".feed_item_body_content"));
        element.remove();
      });
		});
    
</script>
