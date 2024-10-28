<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    Activity
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: deleted-comment.tpl 9747 2012-07-26 02:08:08Z john $
 * @author     Steve
 */
?>
<?php
if (!empty($this->commentCount)) {
  $commentcount = $this->translate(array('%s comment', '%s comments', $this->commentCount), $this->locale()->toNumber($this->commentCount));
?>
<?php echo $commentcount; ?>
<?php } die; ?>