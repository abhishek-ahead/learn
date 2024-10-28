<?php

 /**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: FileuploadComposer.php 2017-01-12  00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

class Activity_Plugin_FileuploadComposer extends Core_Plugin_Abstract {

  public function onAttachFileupload($data,$uploadFile) {
  
    if(!$uploadFile)
      return;
    
    $table = Engine_Api::_()->getDbTable('files','activity');
    try {
      $files = $table->createRow();
      $viewer = Engine_Api::_()->user()->getViewer();
      if( Engine_Api::_()->core()->hasSubject() ) {
        $subject = Engine_Api::_()->core()->getSubject();
        if( $subject->getType() != 'user' ) {
          $data['parent_type'] = $subject->getType();
          $data['parent_id'] = $subject->getIdentity();
        }
      }
      $files->user_id = $viewer->getIdentity();
      $files->save();
      $ext = @end(explode('.',$uploadFile['name']));
      $thumbFileRow = Engine_Api::_()->storage()->create($uploadFile, array(
          'parent_type' => $files->getType(),
          'parent_id' => $files->getIdentity(),
          'extension' => $ext,
          'name' => $uploadFile['name'],
        ));
      $files->item_id = $thumbFileRow->file_id;
      $files->save();
    } catch( Exception $e ) {
      throw $e;
      return;
    }
    return $files;
  }
}
