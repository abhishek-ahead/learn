<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    User
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: popuplogin.tpl 9747 2012-07-26 02:08:08Z john $
 * @author     John
 */
?>
<?php $this->headScript()->appendFile($this->layout()->staticBaseUrl .'application/modules/User/externals/scripts/core.js');?>
<div class="user_password_popup_main">
  <div class="user_password_popup">
    <div class="user_password_popup_thumb">
      <?php echo $this->itemBackgroundPhoto($this->user,'thumb.profile');  ?>
    </div>
    <div class="user_password_popup_name text-center mb-3">
      <span><?php echo $this->user->getTitle();  ?></span>
    </div>
    <div class="user_password_popup_field position-relative mb-3">
      <input type="password" id="poplogin_password" name="password" placeholder="<?php echo $this->translate('Enter your password'); ?>">
      <div class="user_showhidepassword">
        <i id="newtogglepopupPassword"></i>
      </div>
      <span id="poplogin_password_error" class="invalid-feedback" style="display: none;"><?php echo $this->translate("Please enter password."); ?></span>
    </div>
    <div class="user_password_popup_btn mb-2">
      <button id="poplogin_submit" onclick="loginAsUser('<?php echo $this->user_id; ?>', '', 1);"><?php echo $this->translate("Sign In"); ?></button>
    </div>
    <div class="text-center">
      <a href="<?php echo $this->baseUrl()."/user/auth/forgot";  ?>"><?php echo $this->translate("Forgotten password?"); ?></a>
    </div>
  </div>
</div>
<script>

  scriptJquery(document).ready(function() {
    scriptJquery('#poplogin_password').keydown(function(e) {
      if (e.which === 13) {
        loginAsUser('<?php echo $this->user_id; ?>', '', 1);
      }
    });
  });

  var newtogglepopupPassword = document.querySelector('#newtogglepopupPassword');
  if(document.getElementById('poplogin_password')) {
    var passnew = document.querySelector('#poplogin_password');
  }
  newtogglepopupPassword.addEventListener('click', function (e) {
      // toggle the type attribute
      var type = passnew.getAttribute('type') === 'password' ? 'text' : 'password';
      passnew.setAttribute('type', type);
      // toggle the eye / eye slash icon
      this.classList.toggle('showpassword');
  });
</script>
