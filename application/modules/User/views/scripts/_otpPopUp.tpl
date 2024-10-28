<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    User
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: _otpPopUp.tpl 9747 2012-07-26 02:08:08Z john $
 * @author     Jung
 */
?>
<div id="signup_pop_wrap">
  <div class="modal fade otp_verification_modal" id="user_signup_email" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="recent_login_removeLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content position-relative" id="send_signup_form">
        <form action="" method="post" id="twostep_auth_form" enctype="multipart/form-data">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="recent_login_removeLabel"><?php echo $this->translate("Two Step Authentication"); ?></h1>
          </div>
          <div class="modal-body otp_verification_modal_content">
            <p class="mb-3"><?php echo $this->translate("Please enter the One Time Password (OTP) to complete the verification process."); ?></p>

            <div class="input_field">
              <label for="code" class="form-label"><?php echo $this->translate("Enter Code"); ?></label>
              <input  class="form-control"  type="text" name="code" id="otp_code">
            </div>

            <div style="display:none;" id="error_message" class="error font_small mt-2"></div>
            <input type="hidden" name="validEmail" id="validEmail" />
            <div class="mt-2 input_field d-flex justify-content-between">
              <div>
                <div id="otp_timer" class="font_small">
                  <div id="timer" class="font_small"><?php echo Engine_Api::_()->getApi('otp', 'core')->getOtpExpire(); ?></div>
                </div>
               </div>
              <a href="javascript:void(0);" type="button" style="display:none;" id="resend_otp" class="font_small font_color_hl"><?php echo $this->translate('Resend OTP'); ?></a>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-link" id="cancel_verify_otp" data-bs-dismiss="modal" onclick="closeVerifyPopup();"><?php echo $this->translate("Cancel"); ?></button>
            <button type="button" class="btn btn-primary" id="verify_otp"><?php echo $this->translate('Verify'); ?></button>
          </div>
        </form>
        <div class="core_loading_cont_overlay" id="verify_popup_loading" style="display:none;"></div>
      </div>
    </div>
  </div>
</div>
