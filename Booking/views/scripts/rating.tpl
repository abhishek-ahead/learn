<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Courses
 * @copyright  Copyright 2014-2019 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: rating.tpl 2019-08-28 00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */
 
?>
<?php $totalReviewCount = (int)Engine_Api::_()->getDbTable('profreviews','booking')->getReviewCount(array('professional_id'=>$item->getIdentity()))[0]; ?>
<span>
  <?php for( $x=1; $x<=$item->rating; $x++ ): ?>
    <span class="sesbasic_rating_star_small fa fa-star rating_star"></span>
  <?php endfor; ?>
  <?php if( (round($item->rating) - $item->rating) > 0): ?>
    <span class="sesbasic_rating_star_small far fa-star-half"></span>
  <?php endif; ?>
  <?php for( $x=5; $x>round($item->rating); $x-- ): ?>
    <span class="sesbasic_rating_star_small far fa-star sesbasic_rating_star_small_disable"></span>
  <?php endfor; ?>
  <span class="booking_rating"> (<?php echo $totalReviewCount; ?>) </span>
</span>
