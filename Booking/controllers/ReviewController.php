<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Courses
 * @copyright  Copyright 2014-2019 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: ReviewController.php 2019-08-28 00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Booking_ReviewController extends Core_Controller_Action_Standard {

    public function init() {
        if (!Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.allow.review', 1))
            return $this->_forward('notfound', 'error', 'core');

        //Get subject
        if (null !== ($profreview_id = $this->_getParam('profreview_id')) && null !== ($review = Engine_Api::_()->getItem('booking_profreview', $profreview_id)) && $review instanceof Booking_Model_Profreview && !Engine_Api::_()->core()->hasSubject()) {
            Engine_Api::_()->core()->setSubject($review);
        }
    }
    public function browseAction() {
        // Render
        $this->_helper->content->setEnabled();
    }

    public function createAction() {
        $viewer = Engine_Api::_()->user()->getViewer();
        $subjectId = $this->_getParam('object_id', 0);
        $this->view->item = $userInfoItem = $item = Engine_Api::_()->getItem('professional', $subjectId);
        if (!$item)
            return $this->_forward('notfound', 'error', 'core');
        //check review exists
        $isReview = Engine_Api::_()->getDbtable('profreviews', 'booking')->isReview(array('professional_id' => $item->getIdentity(), 'column_name' => 'profreview_id'));
        if (Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.prof.allow.owner.review', 1)) {
            $allowedCreate = true;
        } else {
            if ($item->owner_id == $viewer->getIdentity())
                $allowedCreate = false;
            else
                $allowedCreate = true;
        }
        if ($isReview || !$allowedCreate)
            return $this->_forward('notfound', 'error', 'core');
        $values = $_POST;
        $values['rating'] = $_POST['rate_value'];
        $values['owner_id'] = $viewer->getIdentity();
        $values['professional_id'] = $item->getIdentity();
        $reviews_table = Engine_Api::_()->getDbtable('profreviews', 'booking');
        $db = $reviews_table->getAdapter();
        $db->beginTransaction();
        try {
            $review = $reviews_table->createRow();
            $review->setFromArray($values);
            $review->description = $_POST['description'];
            $review->save();
            $reviewObject = $review;
            $dbObject = Engine_Db_Table::getDefaultAdapter();
            $db->commit();
            //save rating in parent table if exists
            if (isset($item->rating)) {
                $item->rating = Engine_Api::_()->getDbtable('profreviews', 'booking')->getRating($review->professional_id);
                $item->save();
            }
            $review->save();
            $db->commit();
            $stats = Engine_Api::_()->booking()->getWidgetParams(@$_POST['widget_id']);
            $this->view->stats = count($stats) ? $stats['stats'] : $this->_getParam('stats', array('featured', 'sponsored', 'likeCount', 'commentCount', 'viewCount', 'title', 'postedBy', 'pros', 'cons', 'description', 'creationDate', 'recommended', 'parameter', 'rating'));
            $this->view->review = $reviewObject;
            if (Engine_Api::_()->sesbasic()->getViewerPrivacy('booking_profreview', 'edit') || 1) {
                $this->view->form = $form = new Booking_Form_Review_Professional_Create(array('reviewId' => $reviewObject->profreview_id, 'professionalItem' => $item));
                $form->populate($reviewObject->toArray());
                $form->rate_value->setvalue($reviewObject->rating);
                $form->setAction($this->view->url(array('module' => 'booking', 'controller' => 'review', 'action' => 'edit', 'profreview_id' => $reviewObject->profreview_id), 'default', true));
            }
            $this->view->rating_count = Engine_Api::_()->getDbTable('profreviews', 'booking')->ratingCount($item->getIdentity());
            $this->view->rating_sum = $userInfoItem->rating;
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }
    public function editAction() {
        $viewer = Engine_Api::_()->user()->getViewer();
        $profreview_id = $this->_getParam('profreview_id', null);
        $subject = Engine_Api::_()->getItem('booking_profreview', $profreview_id);
        $this->view->item = $item = Engine_Api::_()->getItem('professional', $subject->professional_id);
        if (!$profreview_id || !$subject)
            return $this->_forward('notfound', 'error', 'core');
        $values = $_POST;
        $values['rating'] = $_POST['rate_value'];
        $reviews_table = Engine_Api::_()->getDbtable('profreviews', 'booking');
        $db = $reviews_table->getAdapter();
        $db->beginTransaction();
        try {
            $subject->setFromArray($values);
            $subject->save();
            if (isset($item->rating)) {
                $item->rating = Engine_Api::_()->getDbtable('profreviews', 'booking')->getRating($subject->owner_id);
                $item->save();
            }
            $subject->save();
            $reviewObject = $subject;
            $db->commit();
            $stats = Engine_Api::_()->booking()->getWidgetParams($viewer->getIdentity());
            $this->view->stats = count($stats) ? $stats : $this->_getParam('stats', array('featured', 'sponsored', 'likeCount', 'commentCount', 'viewCount', 'title', 'postedBy', 'pros', 'cons', 'description', 'creationDate', 'recommended', 'parameter', 'rating'));
            $this->view->review = $reviewObject;
            $this->view->form = $form = new Booking_Form_Review_Professional_Edit(array( 'reviewId' => $reviewObject->profreview_id, 'professionalItem' => $item));
            $form->populate($reviewObject->toArray());
            $form->rate_value->setvalue($reviewObject->rating);
            $form->setAction($this->view->url(array('module' => 'booking', 'controller' => 'review', 'action' => 'edit', 'profreview_id' => $reviewObject->profreview_id), 'default', true));
            $this->view->rating_count = Engine_Api::_()->getDbTable('profreviews', 'booking')->ratingCount($reviewObject->owner_id);
            $this->view->total_rating_average = Engine_Api::_()->getDbtable('profreviews', 'booking')->getRating($reviewObject->owner_id);
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }
    public function deleteAction() {
        $viewer = Engine_Api::_()->user()->getViewer();
        $review = Engine_Api::_()->getItem('booking_profreview', $this->getRequest()->getParam('profreview_id'));
        $content_item = Engine_Api::_()->getItem('professional', $review->professional_id);
        // In smoothbox
        $this->_helper->layout->setLayout('default-simple');
        $this->view->form = $form = new Sesbasic_Form_Delete();
        $form->setTitle('Delete Review?');
        $form->setDescription('Are you sure that you want to delete this review? It will not be recoverable after being deleted.');
        $form->submit->setLabel('Delete');
        if ($this->getRequest()->isPost()) {
            $db = $review->getTable()->getAdapter();
            $db->beginTransaction();
            try {
                $review->delete();
                $db->commit();
                $this->view->message = Zend_Registry::get('Zend_Translate')->_('The selected review has been deleted.');
                return $this->_forward('success', 'utility', 'core', array('parentRedirect' => $content_item->gethref(), 'messages' => array($this->view->message)));
            } catch (Exception $e) {
                $db->rollBack();
                throw $e;
            }
        }
    }

    public function viewAction() {
        $viewer = Engine_Api::_()->user()->getViewer();
        if (Engine_Api::_()->core()->hasSubject())
            $subject = Engine_Api::_()->core()->getSubject();
        else
            return $this->_forward('notfound', 'error', 'core');

        $profreview_id = $this->_getParam('profreview_id', null);

        if (!Engine_Api::_()->sesbasic()->getViewerPrivacy('booking_profreview', 'view'))
            return $this->_forward('notfound', 'error', 'core');
        //Increment view count
        if (!$viewer->isSelf($subject->getOwner())) {
            $subject->view_count++;
            $subject->save();
        }
        //Render
        $this->_helper->content->setEnabled();
    }

    public function editReviewAction() {
        $this->_helper->layout->setLayout('default-simple');
        $profreview_id = $this->_getParam('profreview_id', null);
        $subject = Engine_Api::_()->getItem('booking_profreview', $profreview_id);

        if (!Engine_Api::_()->sesbasic()->getViewerPrivacy('booking_profreview', 'edit'))
            return $this->_forward('notfound', 'error', 'core');

        $this->view->item = $item = Engine_Api::_()->getItem('courses', $subject->professional_id);

        if (!$profreview_id || !$subject)
            return $this->_forward('notfound', 'error', 'core');

        $this->view->form = $form = new Courses_Form_Review_Edit(array('reviewId' => $subject->profreview_id,  'courseItem' => $item));
        $form->setAction(Zend_Controller_Front::getInstance()->getRouter()->assemble(array('module' => 'courses', 'controller' => 'review', 'action' => 'edit-review', 'profreview_id' => $profreview_id), 'default', true));
        $title = Zend_Registry::get('Zend_Translate')->_('Edit a Review for "<b>%s</b>".');
        $form->setTitle(sprintf($title, $subject->getTitle()));
        $form->setDescription("Please fill below information.");

        if (!$this->getRequest()->isPost()) {
            $form->populate($subject->toArray());
            $form->rate_value->setValue($subject->rating);
            return;
        }
        if (!$form->isValid($this->getRequest()->getPost()))
            return;

        $values = $_POST;
        $values['rating'] = $_POST['rate_value'];
        $reviews_table = Engine_Api::_()->getDbtable('profreviews', 'courses');
        $db = $reviews_table->getAdapter();
        $db->beginTransaction();
        try {
            $subject->setFromArray($values);
            $subject->save();
            $table = Engine_Api::_()->getDbtable('parametervalues', 'courses');
            $tablename = $table->info('name');
            $dbObject = Engine_Db_Table::getDefaultAdapter();
            foreach ($_POST as $key => $reviewC) {
                if (count(explode('_', $key)) != 3 || !$reviewC)
                    continue;
                $key = str_replace('review_parameter_', '', $key);
                if (!is_numeric($key))
                    continue;
                $parameter = Engine_Api::_()->getItem('courses_parameter', $key);
               $query = 'INSERT INTO ' . $tablename . ' (`parameter_id`, `rating`, `user_id`, `resources_id`,`content_id`) VALUES ("' . $key . '","' . $reviewC . '","' . $subject->owner_id . '","' . $item->owner_id . '","' . $subject->profreview_id . '") ON DUPLICATE KEY UPDATE rating = "' . $reviewC . '"';
                $dbObject->query($query);
                $ratingP = $table->getRating($key);
                $parameter->rating = $ratingP;
                $parameter->save();
            }
            if (isset($item->rating)) {
                $item->rating = Engine_Api::_()->getDbtable('profreviews', 'booking_profreview')->getRating($subject->professional_id);
                $item->save();
            }
            $subject->save();
            $reviewObject = $subject;
            $db->commit();
            $this->view->message = Zend_Registry::get('Zend_Translate')->_('The selected review has been edited.');
            return $this->_forward('success', 'utility', 'core', array('parentRedirect' => $reviewObject->gethref(), 'messages' => array($this->view->message)));
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }
    function likeAction() {
        if (Engine_Api::_()->user()->getViewer()->getIdentity() == 0) {
            echo json_encode(array('status' => 'false', 'error' => 'Login'));
            die;
        }
        $item_id = $this->_getParam('id');
        if (intval($item_id) == 0) {
            echo json_encode(array('status' => 'false', 'error' => 'Invalid argument supplied.'));
            die;
        }
        $viewer = Engine_Api::_()->user()->getViewer();
        $viewer_id = $viewer->getIdentity();
        $itemTable = Engine_Api::_()->getItemTable('booking_profreview');
        $tableLike = Engine_Api::_()->getDbtable('likes', 'core');
        $tableMainLike = $tableLike->info('name');
        $select = $tableLike->select()
            ->from($tableMainLike)
            ->where('resource_type = ?', 'booking_profreview')
            ->where('poster_id = ?', $viewer_id)
            ->where('poster_type = ?', 'user')
            ->where('resource_id = ?', $item_id);
        $result = $tableLike->fetchRow($select);
        if (count($result) > 0) {
            //delete
            $db = $result->getTable()->getAdapter();
            $db->beginTransaction();
            try {
                $result->delete();
                $itemTable->update(array('like_count' => new Zend_Db_Expr('like_count - 1')), array('profreview_id = ?' => $item_id));
                $db->commit();
            } catch (Exception $e) {
                $db->rollBack();
                throw $e;
            }
            $selectUser = $itemTable->select()->where('profreview_id =?', $item_id);
            $user = $itemTable->fetchRow($selectUser);
            echo json_encode(array('status' => 'true', 'error' => '', 'condition' => 'reduced', 'count' => $user->like_count));
            die;
        } else {
            //update
            $db = Engine_Api::_()->getDbTable('likes', 'core')->getAdapter();
            $db->beginTransaction();
            try {
                $like = $tableLike->createRow();
                $like->poster_id = $viewer_id;
                $like->resource_type = 'booking_profreview';
                $like->resource_id = $item_id;
                $like->poster_type = 'user';
                $like->save();
                $itemTable->update(array('like_count' => new Zend_Db_Expr('like_count + 1')), array('profreview_id = ?' => $item_id));
                //Commit
                $db->commit();
            } catch (Exception $e) {
                $db->rollBack();
                throw $e;
            }
            //Send notification and activity feed work.
            $selectUser = $itemTable->select()->where('profreview_id =?', $item_id);
            $item = $itemTable->fetchRow($selectUser);
            $subject = $item;
            $owner = $subject->getOwner();
            if ($owner->getType() == 'user' && $owner->getIdentity() != $viewer_id) {
                $activityTable = Engine_Api::_()->getDbtable('actions', 'activity');
                Engine_Api::_()->getDbtable('notifications', 'activity')->delete(array('type =?' => 'liked', "subject_id =?" => $viewer_id, "object_type =? " => $subject->getType(), "object_id = ?" => $subject->getIdentity()));
                Engine_Api::_()->getDbtable('notifications', 'activity')->addNotification($owner, $viewer, $subject, 'liked');
                $result = $activityTable->fetchRow(array('type =?' => 'liked', "subject_id =?" => $viewer_id, "object_type =? " => $subject->getType(), "object_id = ?" => $subject->getIdentity()));
                if (!$result) {
                    $action = $activityTable->addActivity($viewer, $subject, 'liked');
                    if ($action)
                        $activityTable->attachActivity($action, $subject);
                }
            }
            echo json_encode(array('status' => 'true', 'error' => '', 'condition' => 'increment', 'count' => $item->like_count));
            die;
        }
    }

}
