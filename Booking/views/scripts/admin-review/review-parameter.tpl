<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: review-parameter.tpl  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
 
 ?>
<?php include APPLICATION_PATH .  '/application/modules/Sesproduct/views/scripts/dismiss_message.tpl';?>
<style>
  .error {
    color:#FF0000;
  }
</style>
<div class='sesbasic-form sesbasic-categories-form'>
  <div>
    <?php if( count($this->subsubNavigation) ): ?>
      <div class='sesbasic-admin-sub-tabs'>
        <?php echo $this->navigation()->menu()->setContainer($this->subsubNavigation)->render();?>
      </div>
    <?php endif; ?>
    <div class="sesbasic-form-cont">
      <h3><?php echo $this->translate("") ?> </h3>
      <p class="description"></p>
      <div class="sesbasic-categories-listing" style="width:100%">
      	<div id="error-message-category-delete"></div>
        <form id="multimodify_form" method="post" onsubmit="return multiModify();">
          <table class='admin_table' style="width: 100%;">
            <thead>
	      <tr>
		<th><?php echo $this->translate("Category") ?></th>
		<th><?php echo $this->translate("Review Parameters") ?></th>
		<th><?php echo $this->translate("Options") ?></th>
	      </tr>
            </thead>
            <tbody>
              <?php foreach ($this->category as $category):?>
		<tr id="profile_type-<?php echo $category->getIdentity(); ?>" data-article-id="<?php echo $category->getIdentity(); ?>">
		  <td>
		    <?php echo $category->category_name; ?>
		    <div class="hidden" style="display:none" id="inline_<?php echo $category->getIdentity(); ?>">
		      <div class="parent">0</div>
		    </div>
		  </td>
		  <?php $reviewParameter = Engine_Api::_()->getDbtable('parameters', 'estore')->getParameterResult(array('category_id'=>$category->getIdentity())); ?>
		  <td>
		    <?php $titleEAC = 'Add';?>
		    <?php if(count($reviewParameter)):?>
		      <?php $titleEAC = 'Edit';?>
		      <ul class="sesmember_parameters_list">
			<?php foreach($reviewParameter as $val): ?>
			  <li><?php echo $val['title']; ?></li>
			<?php endforeach; ?>
		      </ul>
		    <?php else: ?>
		      -
		    <?php endif;?>
		  </td>
		  <td><?php echo $this->htmlLink(array('route' => 'admin_default', 'module' => 'estore', 'controller' => 'review', 'action' => 'add-parameter', 'id' => $category->getIdentity()), $this->translate($titleEAC.' Parameter'), array('class'=> "smoothbox")); ?>
		</tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  </div>
</div>
