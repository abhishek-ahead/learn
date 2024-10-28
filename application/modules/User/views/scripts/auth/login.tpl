<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    User
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: login.tpl 9747 2012-07-26 02:08:08Z john $
 * @author     John
 */
?>
<div class="user_login_page">
  <?php $image = Engine_Api::_()->getApi('settings', 'core')->getSetting('core.general.landingimage', ''); ?>
  <?php $image = $image ? Engine_Api::_()->core()->getFileUrl($image) : 'application/modules/User/externals/images/login-bg.jpg'; ?>
  <div class="user_login_bg" style="background-image:url(<?php echo $image; ?>);"></div>
  <div class="user_login_form">
    <h3>
      <?php echo $this->translate('Enter Details to Login'); ?>
    </h3>
    <?php echo $this->form->render($this) ?>
    <div class="signup_link text-center"><?php echo $this->htmlLink(array('route' => 'user_signup'), $this->translate('Not a Member? <b>Join</b>')) ?></div>
  
    <?php include APPLICATION_PATH .  '/application/modules/User/views/scripts/_recentLoginPage.tpl';?>
  </div>
</div>
<?php
$settings = Engine_Api::_()->getApi('settings', 'core'); 
$otpsms_signup_phonenumber = $settings->getSetting('otpsms.signup.phonenumber', 0);
$otpsms_login_options = $settings->getSetting('otpsms.login.options',0);

if(!empty($otpsms_signup_phonenumber)) {
  $getCountry = Engine_Api::_()->getDbTable('countries', 'core')->getCountry(Engine_Api::_()->getApi('settings', 'core')->getSetting('otpsms.default.countries','US'));
  if(!empty($getCountry)) {
    $country = Engine_Api::_()->getItem('core_country', $getCountry);
  }
}
?>
<?php if(!empty($otpsms_signup_phonenumber) && !empty($otpsms_login_options)) { ?>
  <script type="text/javascript">
    en4.core.runonce.add(function() {
      scriptJquery('#email-element').prepend(scriptJquery('#login_country_code').html());
      scriptJquery('#login_country_code').remove();
      
      scriptJquery('#country_code').selectize({
        onInitialize: function(){
          var $select = scriptJquery('#country_code');
          var selectize = $select[0].selectize; 
          
          if(typeof selectize.options[selectize.items[0]] != 'undefined') {
            var image = selectize.options[selectize.items[0]].image;
            
            scriptJquery(selectize.$control[0]).find('.item').remove();
            if(typeof image != 'undefined') {
              scriptJquery(selectize.$control[0]).prepend(`<div class="item" data-value="${selectize.options[selectize.items[0]].value.split('_')[0]}"><img src="${image}" height="20" width="20"> +${selectize.options[selectize.items[0]].value.split('_')[0]}</div>`);
            } else {
              scriptJquery(selectize.$control[0]).prepend(`<div class="item" data-value="<?php echo $country->phonecode; ?>"> +<?php echo $country->phonecode; ?></div>`);
            }
          } else {
            <?php  if(!empty($country->icon)) { 
              if(!empty($country->icon)) {
                $path = Engine_Api::_()->core()->getFileUrl($country->icon); 
              ?>
              scriptJquery(selectize.$control[0]).prepend(`<div class="item" data-value="<?php echo $country->phonecode; ?>"><img src="<?php echo $path; ?>" height="20" width="20"> +<?php echo $country->phonecode; ?></div>`);
              <?php } else { ?>
              scriptJquery(selectize.$control[0]).prepend(`<div class="item" data-value="<?php echo $country->phonecode; ?>"> +<?php echo $country->phonecode; ?></div>`);
              <?php } ?>
            <?php } else { ?>
              scriptJquery(selectize.$control[0]).prepend(`<div class="item" data-value="<?php echo $country->phonecode; ?>"> +<?php echo $country->phonecode; ?></div>`);
            <?php } ?>
          }
        },
        render: {
          option: function (data, escape) {
            if(data.image) {
              return '<div><img src="' + data.image + '" alt="' + escape(data.text) + '" style="width: 20px; height: 20px;"> ' + escape(data.text) + '</div>';
            } else {
              return '<div>' + escape(data.text) + '</div>';
            }
          },
        },
        onDropdownClose: function(dropdown) {
          var that = scriptJquery(dropdown).prev().find('.item');
          var image = scriptJquery('.selectize-dropdown-content').find(`[data-value="${that.data('value')}"]`).find('img').attr('src');
          if(typeof image != 'undefined') {
            that.html(`<img src="${image}" height="20" width="20"> +${that.data('value').split('_')[0]}`);
          } else {
            if(typeof that.find('img') != 'undefined' && that.find('img').length) {
              that.html(`<img src="${that.find('img').attr('src')}" height="20" width="20"> +${that.data('value').split('_')[0]}`);
            } else {
              that.html(`+${that.data('value').split('_')[0]}`);
            }
          }
        },
      });
    });
    
    AttachEventListerSE('keyup', '#email', function(e) {
      var emailVal = scriptJquery("#email").val();
      if(emailVal.match(/^\d+$/)) {
        scriptJquery('#country_code_element').show();
        scriptJquery('#email-wrapper').addClass('country_code_main');
        //scriptJquery('#country_code').show();
      } else {
        scriptJquery('#country_code_element').hide();
        scriptJquery('#email-wrapper').removeClass('country_code_main');
        //scriptJquery('#country_code').hide();
      }
    });
  </script>
  <?php echo Engine_Api::_()->getDbTable('countries', 'core')->getAllCountryHtml(array('id' => 'login_country_code')); ?>
<?php } ?>
<script type="text/javascript">
  if(typeof loginSignupPlaceHolderActive != 'undefined') {
    en4.core.runonce.add(function() {
      scriptJquery('#email-label').hide();
      scriptJquery('#password-label').hide();
      scriptJquery('#email').attr('placeholder',scriptJquery('#email-label').find('label').html());
      scriptJquery('#password').attr('placeholder',scriptJquery('#password-label').find('label').html());
    });
  }
</script>
