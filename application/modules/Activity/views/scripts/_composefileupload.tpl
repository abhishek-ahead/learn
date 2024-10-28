<?php

/**
 * socialnetworking.solutions
 *
 * @category   Application_Modules
 * @package    Activity
 * @copyright  Copyright 2014-2020 Ahead WebSoft Technologies Pvt. Ltd.
 * @license    https://socialnetworking.solutions/license/
 * @version    $Id: _composefileupload.tpl 2017-01-12 00:00:00 socialnetworking.solutions $
 * @author     socialnetworking.solutions
 */

?>
<?php
$request = Zend_Controller_Front::getInstance()->getRequest();
$requestParams = $request->getParams();

$allowFileUpload = false;
$module = $this->subject() ? strtolower($this->subject()->getModuleName()) : "";
try {
  if ($this->subject() && Engine_Api::_()->$module()->allowFileuploadInFeed()) {
    $allowFileUpload = true;
  }
} catch (Exception $e) {
  // 
}

if (($requestParams['action'] == 'compose' || $requestParams['action'] == 'view') && $requestParams['module'] == 'messages' && $requestParams['controller'] == 'messages') {
  return;
}

if ((($requestParams['action'] == 'home' || $requestParams['action'] == 'index') && $requestParams['module'] == 'user' && ($requestParams['controller'] == 'index' || $requestParams['controller'] == 'profile')) || ($allowFileUpload)) {
  ?>
  <script type="text/javascript">
    en4.core.runonce.add(function () {
      composeInstance.addPlugin(new Composer.Plugin.Fileupload({
        title: '<?php echo $this->string()->escapeJavascript($this->translate('Add File')) ?>',
        serverLimit: '<?php echo Engine_Api::_()->core()->convertPHPSizeToBytes(ini_get('upload_max_filesize'));
        ; ?>', 
        serverLimitDigits: '<?php echo Engine_Api::_()->core()->convertPHPSizeToBytes(ini_get('upload_max_filesize'));
        ; ?>',
        lang: {
          'cancel': '<?php echo $this->string()->escapeJavascript($this->translate('cancel')) ?>',
        },
      }));
    });
  </script>
<?php } ?>
