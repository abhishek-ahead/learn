<?php
/**
 * SocialEngine
 *
 * @category   Application_Extensions
 * @package    Activity
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: delete-media.tpl 9747 2012-07-26 02:08:08Z john $
 * @author     John Boehr <j@webligo.com>
 */
?>
<?php if($this->success) { ?>
  <script type="text/javascript">
    en4.core.runonce.add(function() {
      if(parent.scriptJquery('#photo_next').length)
        parent.document.getElementById('photo_next').click();
      else if(parent.scriptJquery('#photo_prev').length)
        parent.document.getElementById('photo_prev').click();
      else {
        parent.parent.scriptJquery('.activity_filter_tabs').find('li.active').find('a').trigger('click');
        parent.parent.Smoothbox.close();
        return;
      }
      parent.parent.scriptJquery('.activity_filter_tabs').find('li.active').find('a').trigger('click');
      parent.Smoothbox.close();
    });
  </script>
  <?php return; ?>
<?php } ?>
<?php echo $this->form->render($this) ?>