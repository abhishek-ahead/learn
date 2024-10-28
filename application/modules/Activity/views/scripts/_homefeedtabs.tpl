<?php ?>
<script type="application/javascript">
  var filterResultrequest;
  AttachEventListerSE('click', 'ul.activity_filter_tabs li a', function (e) {
    if (scriptJquery(this).hasClass('viewmore'))
      return false;
    scriptJquery('.activity_filter_img').show();
    scriptJquery('.activity_filter_tabsli').removeClass('active activity_active_tabs');
    scriptJquery(this).parent().addClass('active activity_active_tabs');
    var filterFeed = scriptJquery(this).attr('data-src');
    //if(typeof filterResultrequest != 'undefined')
    //filterResultrequest.remove();
    var url = '<?php echo $this->url(array('module' => 'core', 'controller' => 'widget', 'action' => 'index', 'content_id' => $this->identity), 'default', true) ?>';
    var hashTag = scriptJquery('#hashtagtext').val();

    var adsIds = scriptJquery('.ecmads_ads_listing_item');
    var adsIdString = "";
    if (adsIds.length > 0) {
      scriptJquery('.ecmads_ads_listing_item').each(function (index) {
        var dataFeedItem = scriptJquery(this).attr('data-activity-feed-item');
        if (typeof dataFeedItem == "undefined")
          adsIdString = scriptJquery(this).attr('rel') + "," + adsIdString;
      });
    } 
    var feed_filter_text = scriptJquery(this).attr('data-text');
    filterResultrequest = scriptJquery.ajax({
      url: url + "?search=" + hashTag + '&isOnThisDayPage=' + isOnThisDayPage + '&isMemberHomePage=' + isMemberHomePage,
      type: "POST",
      data: {
        format: 'html',
        'filterFeed': filterFeed,
        'feedOnly': true,
        'ads_ids': adsIdString,
        'getUpdates': 1,
        'nolayout': true,
        'subject': '<?php echo !empty($this->subjectGuid) ? $this->subjectGuid : "" ?>',
      },
      evalScripts: true,
      success: function (responseHTML) {
        scriptJquery('#feed_filter_text').html(feed_filter_text);
        if (!activityGetFeeds) {
          scriptJquery('#activity-feed').append(responseHTML);
        } else {
          scriptJquery('#activity-feed').html(responseHTML);
        }
        if (scriptJquery('#activity-feed').find('li').length > 0) {
          scriptJquery('.activity_noresult_tip').hide();
          if (scriptJquery('#feed_viewmore').css('display') == 'none' && scriptJquery('#feed_loading').css('display') == 'none')
            scriptJquery('#feed_no_more_feed').show();
        } else {
          scriptJquery('#feed_no_more_feed').hide();
          scriptJquery('.activity_noresult_tip').css('display', 'block');
        }
        //initialize feed autoload counter
        counterLoadTime = 0;
        activitytooltip();
        Smoothbox.bind(document.getElementById('activity-feed'));
        scriptJquery('.activity_filter_img').hide();
        feedUpdateFunction();
        activateFunctionalityOnFirstLoad();
        
      }
    });
  });
</script>
<?php
  $lists = $this->lists;
  $counter = 1;
  $netwrokStarted = false;
  $listStarted = false;
?>
<div class="activity_feed_filters" style="display: none;">
  <div style="display:none;" class="activity_filter_img">
    <a href="javascript:void(0);"><i class='fas fa-circle-notch fa-spin'></i></a>
  </div>
  <div class="activity_feed_filter_more dropdown">
    <a href="javascript:;" class="viewmore" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-bars"></i><span id="feed_filter_text"><?php echo $this->translate("All Updates"); ?></span><i class="fa-solid fa-angle-down"></i></a>
    <ul class="activity_filter_tabs dropdown-menu dropdown-option-menu dropdown-menu-end">
      <?php foreach ($lists as $activeList) { ?>
        <?php if (isset($activeList['network_id'])) { ?>
          <?php if (!$netwrokStarted) { ?>
            <?php $netwrokStarted = true; ?>
            <li class="dropdown-divider"></li>
          <?php } ?>
          <li class="activity_filter_tabsli"><a href="javascript:;" class="dropdown-item" data-src="<?php echo 'network_filter_' . $activeList['network_id']; ?>" data-text="<?php echo $this->translate($activeList['title']); ?>"> <i class="icon_network <?php echo $activeList['icon'] ? $activeList['icon'] : 'fas fa-network-wired'; ?>"></i><?php echo $this->translate($activeList['title']); ?></a></li>
        <?php } else if (isset($activeList['list_id'])) { ?>
          <?php  if (!$listStarted) { ?>
            <?php $listStarted = true; ?>
            <li class="dropdown-divider"></li>
          <?php } ?>
          <li class="activity_filter_tabsli"><a href="javascript:;" class="dropdown-item" data-src="<?php echo 'member_list_' . $activeList['list_id']; ?>" data-text="<?php echo $this->translate($activeList['title']); ?>"> <i class="icon_activity_lists <?php echo $activeList['icon']; ?>"></i><?php echo $this->translate($activeList['title']); ?></a></li>
        <?php } else { ?>
          <li class="activity_filter_tabsli <?php echo $counter == 1 ? 'active activity_active_tabs' : ''; ?>"><a href="javascript:;" class="dropdown-item" data-src="<?php echo $activeList['filtertype']; ?>" data-text="<?php echo $this->translate($activeList['title']); ?>"><i class="<?php echo $activeList['icon'] ? $activeList['icon'] :  'item_icon_'.$activeList['filtertype'] ?>"></i><?php echo $this->translate($activeList['title']); ?></a></li>
        <?php } ?>
        <?php ++$counter; ?> 
      <?php } ?>
    </ul>
  </div>
  <?php if ($this->viewer()->getIdentity()) { ?>
    <div class="activity_filter_tabsli activity_feed_filter_setting">
      <a href="javascript:;" class="ajaxsmoothbox viewmore" data-bs-toggle="tooltip" title="<?php echo $this->translate('Settings'); ?>" data-url="activity/ajax/settings/"><i class="fa fa-cog" aria-hidden="true"></i></a>
    </div>
  <?php } ?>
</div>