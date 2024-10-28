<?php
/**
 * SocialEngine
 *
 * @category   Application_Extensions
 * @package    Album
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: Controller.php 9747 2012-07-26 02:08:08Z john $
 * @author     Shaun Harding <shaun@socialengine.com>
 */

/**
 * @category   Application_Extensions
 * @package    Album
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 */
class Activity_Widget_PhotoVideoInfoController extends Engine_Content_Widget_Abstract
{
  public function indexAction()
  {
    $viewer = Engine_Api::_()->user()->getViewer();

    $this->view->subject = $subject = Engine_Api::_()->core()->getSubject();

    if ($subject->getType() == 'album_photo') {
      $this->view->album = $album = $subject->getAlbum();
      $this->view->canEdit = $album->authorization()->isAllowed($viewer, 'edit');
      $this->view->canDelete = $album->authorization()->isAllowed($viewer, 'delete');
      $this->view->canTag = $album->authorization()->isAllowed($viewer, 'tag');
    } elseif($subject->getType() == 'video') {
      // Check if edit/delete is allowed
      $this->view->canEdit = $subject->authorization()->isAllowed($viewer, 'edit');
      $this->view->canDelete = $subject->authorization()->isAllowed($viewer, 'delete');
    }
  }
}
