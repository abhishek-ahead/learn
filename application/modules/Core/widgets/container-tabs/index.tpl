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

<script type="text/javascript">
    window.onpopstate = function() {
			var URL = window.location.href;
			const params2 = new URLSearchParams(URL.split('?')[1]);
			var params3 = params2.get('tab');
			if(!params3){
				params3 = scriptJquery("#main_tabs").children().eq(0).attr("data-id");
			}
			if(params3) {
				scriptJquery('#main_tabs').find('li').removeClass('active');
				scriptJquery('#main_tabs').find(`li.tab_${params3}`).addClass('active');
				scriptJquery('#main_tabs').parent().parent().find('div.generic_layout_container').hide();
				scriptJquery('#main_tabs').parent().parent().find(`div.tab_${params3}`).show();
      		}
    }

    
    function tabContainerSwitch(element, containerClass, tab_id) {
			
      element = scriptJquery(element);
      if( element.prop('tagName').toLowerCase() == 'a' ) {
        element = element.parents('li');
      }

      var myContainer = element.parents('.tabs_parent').parent();
      element.parents('.tabs_parent').addClass('tab_collapsed');
      myContainer.children('div:not(.tabs_alt)').hide();
      myContainer.find('ul > li').removeClass('active');
      element.attr('class').split(' ').forEach(function(className){
        className = className.trim();
        if( className.match(/^tab_[0-9]+$/) ) {
          myContainer.children('div.' + className).show();
          element.addClass('active');
        }
      });

		var URL = window.location.href;
		const params2 = new URLSearchParams(URL.split('?')[1]);
		params2.delete('tab');
		params2.append('tab', tab_id);
		const URL2 = params2.toString();
		history.pushState(null, null, URL.split('?')[0]+'?'+URL2);

      return false;
    }
    var moreTabSwitch = window.moreTabSwitch = function(el) {
      el = scriptJquery(el);
      el.toggleClass('tab_open');
      el.toggleClass('tab_closed');
    }
    scriptJquery(document).on('click', '.tab_collapsed_action', function(event) {
      scriptJquery(event.target).parents('.tabs_alt').toggleClass('tab_collapsed');
    });
</script>

<div class='tabs_alt tabs_parent tab_collapsed'>
  <span class="tab_collapsed_action"></span>
  <ul id='main_tabs' class="tabs_alt_inner">
		<?php $filteredURL = preg_replace('~(\?|&)'.'tab'.'=[^&]*~', '$1', $_SERVER['REQUEST_URI']);
		if(strpos($filteredURL, '?') === false) {
			$filteredURL = $filteredURL . '?';
		}	else {
			$explode = explode('?', $filteredURL);
			if(!empty($explode[1])) {
				$filteredURL = $filteredURL . '&';
			}
		}
		
		?>
    <?php foreach( $this->tabs as $key => $tab ): ?>
      <?php
		$filteredURL1 = $filteredURL.'tab='.$tab['id'];
        $class   = array();
        $class[] = 'tab_' . $tab['id'];
        $class[] = 'tab_' . trim(str_replace('generic_layout_container', '', $tab['containerClass']));
        if( $this->activeTab == $tab['id'] || $this->activeTab == $tab['name'] )
          $class[] = 'active';
        $class = join(' ', $class);
      ?>
      <?php if( $key < $this->max ): ?>
        <li class="tabs_alt_item <?php echo $class ?>" data-id="<?php echo $tab['id']; ?>"><a href="<?php echo $filteredURL1; ?>" onclick="event.preventDefault(); tabContainerSwitch(this, '<?php echo $tab['containerClass'] ?>', '<?php echo $tab['id']; ?>');"><?php echo $this->translate(!empty($tab['title']) ? $tab['title'] : "")  ?><?php if( !empty($tab['childCount']) ): ?><span>(<?php echo $tab['childCount'] ?>)</span><?php endif; ?></a></li>
      <?php endif;?>
    <?php endforeach; ?>
    
    <?php if (engine_count($this->tabs) > $this->max):?>
    <li class="tab_closed more_tab" onclick="moreTabSwitch(this);">
      <a href="javascript:void(0);"><?php echo $this->translate('More +') ?><span></span></a>
      <div class="tab_pulldown_contents_wrapper">
        <div class="tab_pulldown_contents">
          <ul>
			<?php foreach( $this->tabs as $key => $tab ): ?>
				<?php
					$filteredURLMore = $filteredURL.'tab='.$tab['id'];
					$class   = array();
					$class[] = 'tab_' . $tab['id'];
					$class[] = 'tab_' . trim(str_replace('generic_layout_container', '', $tab['containerClass']));
					if( $this->activeTab == $tab['id'] || $this->activeTab == $tab['name'] ) $class[] = 'active';
					$class = join(' ', array_filter($class));
				?>
				<?php if( $key >= $this->max ): ?>
					<li class="<?php echo $class ?>" data-id="<?php echo $tab['id']; ?>"><a href="<?php echo $filteredURLMore; ?>" onclick="event.preventDefault(); tabContainerSwitch(this, '<?php echo $tab['containerClass'] ?>', '<?php echo $tab['id']; ?>')"><?php echo $this->translate($tab['title']) ?><?php if( !empty($tab['childCount']) ): ?><span> (<?php echo $tab['childCount'] ?>)</span><?php endif; ?></a></li>
				<?php endif;?>
			<?php endforeach; ?>
          </ul>
        </div>
      </div>
    </li>
    <?php endif;?>
  </ul>
</div>

<?php echo $this->childrenContent ?>
