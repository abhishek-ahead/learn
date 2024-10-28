<?php

/**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Comment
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: deleted-comment.tpl 2017-01-12 00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

?>
<?php
if (!empty($this->commentCount)) {
  $commentcount = $this->translate(array('%s comment', '%s comments', $this->commentCount), $this->locale()->toNumber($this->commentCount));
?>
<?php echo $commentcount; ?>
<?php } die; ?>