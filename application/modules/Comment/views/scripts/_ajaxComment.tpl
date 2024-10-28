<?php

/**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Comment
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: _ajaxComment.tpl 2017-01-12 00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

?>
<?php $action = $this->action;
$isOnThisDayPage = $this->isOnThisDayPage;

 $commentCount = Engine_Api::_()->comment()->commentCount($action);
 ?>
<?php if($commentCount > 0){ ?>
  <?php
        echo $this->partial(
          '_commentsort.tpl',
          'comment',
          array('action'=>$action,'isOnThisDayPage'=>$isOnThisDayPage,'isPageSubject'=>$this->isPageSubject,"searchType"=>$this->type,'onlyComment'=>$this->onlyComment)
        );                    
      ?>
<?php  } ?>  
<?php $reverseOrder = 1;//Engine_Api::_()->getApi('settings', 'core')->getSetting('activity.commentreverseorder', false); ?>

<?php if($this->comments->count() != 0 && $this->comments->getCurrentPageNumber() < $this->comments->count() && !$reverseOrder): ?>
  <li class="comment_more">
    <div class="comments_viewall">
      <?php echo $this->htmlLink('javascript:void(0);', $this->translate('View previous comments'), array(
        'onclick' => 'commentactivitycomment("'.$action->getIdentity().'", "'.($this->comments->getCurrentPageNumber() + 1).'",this)'
      )) ?>
    </div>
  </li>
<?php endif; ?>


<?php if( $commentCount > 0 && !$isOnThisDayPage):  
  ?>
  <?php foreach($this->comments as $comment):?>
    <?php
  
        echo $this->partial(
          '_activitycommentbody.tpl',
          'comment',
          array('comment'=>$comment,'action'=>$action,'isPageSubject'=>$this->isPageSubject)
        );                    
      ?>
  <?php endforeach; ?>
<?php if($this->comments->count() != 0 && $this->comments->getCurrentPageNumber() < $this->comments->count() && $reverseOrder): ?>
  <li class="comment_more">
    <div class="comments_viewall">
      <?php echo $this->htmlLink('javascript:void(0);', $this->translate('View later comments'), array(
        'onclick' => 'commentactivitycomment("'.$action->getIdentity().'", "'.($this->comments->getCurrentPageNumber() + 1).'",this)'
      )) ?>
    </div>
  </li>
<?php endif; ?>
<?php endif; ?>
