<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: Controller.php  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
class Booking_Widget_ExpertProfileController extends Engine_Content_Widget_Abstract {

  public function indexAction() {
    $this->view->professionalId = $professionalId = Zend_Controller_Front::getInstance()->getRequest()->getParam("professional_id");
    $viewerId = Engine_Api::_()->user()->getViewer()->getIdentity();
    $var = $this->_getParam("show_criteria");
    $this->view->image = (!empty(in_array("image", $var)) ? 1 : 0);
    $this->view->name = (!empty(in_array("name", $var)) ? 1 : 0);
    $this->view->designation = (!empty(in_array("designation", $var)) ? 1 : 0);
    $this->view->location = (!empty(in_array("location", $var)) ? 1 : 0);
    $this->view->rating = (!empty(in_array("rating", $var)) ? 1 : 0);
    $this->view->like = (!empty(in_array("like", $var)) ? 1 : 0);
    $this->view->favourite = (!empty(in_array("favourite", $var)) ? 1 : 0);
    $this->view->follow = (!empty(in_array("follow", $var)) ? 1 : 0);
    $this->view->report = (!empty(in_array("report", $var)) ? 1 : 0);
    $this->view->likecount = (!empty(in_array("likecount", $var)) ? 1 : 0);
    $this->view->favouritecount = (!empty(in_array("favouritecount", $var)) ? 1 : 0);
    $this->view->followcount = (!empty(in_array("followcount", $var)) ? 1 : 0);
    $this->view->about = (!empty(in_array("about", $var)) ? 1 : 0);
    $this->view->contact = (!empty(in_array("contact", $var)) ? 1 : 0);
    $this->view->bookme = (!empty(in_array("bookme", $var)) ? 1 : 0);
    $this->view->socialSharing = (!empty(in_array("socialSharing", $var)) ? 1 : 0);
    $this->view->servicenamelimit = $this->_getParam("title_truncation");
    $this->view->width = $this->_getParam("width");
    $booking_widget = Zend_Registry::isRegistered('booking_widget') ? Zend_Registry::get('booking_widget') : null;
    if(empty($booking_widget))
      return $this->setNoRender();
    $this->view->height = $this->_getParam("height");
    $this->view->socialshare_enable_plusicon = $this->_getParam("socialshare_enable_plusicon");
    $this->view->socialshare_icon_limit = $this->_getParam("socialshare_icon_limit")+1;
    $this->view->is_ajax = $is_ajax = (!empty($_POST['is_ajax'])) ? $_POST['is_ajax'] : NULL;
    if (isset($is_ajax)) {
      $professionalId = (int) $_POST['professionalId'];
      $rate = (int) $_POST['rateValue'];
      $professionalratingsTable = Engine_Api::_()->getDbTable('professionalratings', 'booking');
      $isProfessionalratingAvailable = $professionalratingsTable->isProfessionalratingAvailable(array("professional_id" => $professionalId, "user_id" => $viewerId));
      try {
        $professionalItem = Engine_Api::_()->getItem('professional', $professionalId);
        $db = $professionalratingsTable->getAdapter();
        $db->beginTransaction();
        if ($isProfessionalratingAvailable === "insert") {
          echo $professionalId . "insert";
          $reviews = $professionalratingsTable->createRow();
          $formValues["professional_id"] = $professionalId;
          $formValues["user_id"] = $viewerId;
          $formValues["rating"] = $rate;
          $reviews->setFromArray($formValues);
          $reviews->save();
          $professionalItem->rating = $rate;
          $professionalItem->save();
        } else if ($isProfessionalratingAvailable === "update") {
          $professionalratingsTable->update(array(
            'rating' => $rate,
            ), array(
            'professional_id = ?' => $professionalId,
            'user_id = ?' => $viewerId,
            )
          );
          $professionalItem->rating = $rate;
          $professionalItem->save();
        }
        $db->commit();
      } catch (Exception $e) {
        $db->rollBack();
        throw $e;
      }
      echo "sd";
      die;
    }
    $professionalTable = Engine_Api::_()->getDbTable('professionals', 'booking')->isProfessional($professionalId);
    $this->view->professionalPaginator = $professionalTable;
    $this->view->form = $form = new Booking_Form_Review_ProfessionalCreate();
    $professionalratingsTable = Engine_Api::_()->getDbTable('professionalratings', 'booking');
    $select = $professionalratingsTable->select();
    $select->from($professionalratingsTable->info('name'), array('rating'))->where('user_id = ?', $viewerId)->where('professional_id =?', $professionalId);
    $rating = $professionalratingsTable->fetchRow($select);
    $form->rate_value->setValue(($rating['rating']) ? $rating['rating'] : 0 );
  }

}
