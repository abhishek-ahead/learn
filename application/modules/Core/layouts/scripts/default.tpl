<?php
/**
 * SocialEngine
 *
 * @category   Application_Core
 * @package    Core
 * @copyright  Copyright 2006-2020 Webligo Developments
 * @license    http://www.socialengine.com/license/
 * @version    $Id: default.tpl 10227 2014-05-16 22:43:27Z andres $
 * @author     John
 */
?>
<?php echo $this->doctype()->__toString() ?>
<?php $locale = $this->locale()->getLocale()->__toString(); $orientation = ($this->layout()->orientation == 'right-to-left' ? 'rtl' : 'ltr'); ?>
<?php $headerContent = $this->content('header'); ?>
<?php $footerContent = $this->content('footer'); ?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $locale ?>" lang="<?php echo $locale ?>" dir="<?php echo $orientation ?>">
<head>
    <base href="<?php echo rtrim($this->serverUrl($this->baseUrl()), '/'). '/' ?>" />


    <?php // ALLOW HOOKS INTO META?>
    <?php echo $this->hooks('onRenderLayoutDefault', $this) ?>


    <?php // TITLE/META?>
    <?php
    $view = Zend_Registry::isRegistered('Zend_View') ? Zend_Registry::get('Zend_View') : null;
    $http_https = _ENGINE_SSL ? 'https://' : 'http://';
    $counter = (int) $this->layout()->counter;
    $staticBaseUrl = $this->layout()->staticBaseUrl;
    $headIncludes = $this->layout()->headIncludes;

    $request = Zend_Controller_Front::getInstance()->getRequest();
    $this->headTitle()
        ->setSeparator(' - ');
    
    //Page Data
    $pageName = $request->getModuleName() . '_' . $request->getActionName() . '_' . $request->getControllerName();
    $pageInfo = Engine_Api::_()->getDbtable('pages', 'core')->getPageInfo(array('name' => $pageName));
    if(!empty($pageInfo))
    $page_id = $pageInfo->page_id;
    
    $pageTitleKey = 'pagetitle-' . $request->getModuleName() . '-' . $request->getActionName() . '-' . $request->getControllerName();
    $pageTitle = $this->translate($pageTitleKey);
    
    if ($pageTitle && $pageTitle != $pageTitleKey) {
      $this->headTitle($pageTitle, Zend_View_Helper_Placeholder_Container_Abstract::PREPEND);
    }
    
    $this->headTitle($this->translate($this->layout()->siteinfo['title']));
    
    $this->headMeta()
        ->appendHttpEquiv('Content-Type', 'text/html; charset=UTF-8')
        ->appendHttpEquiv('Content-Language', $this->locale()->getLocale()->__toString());

    // Make description and keywords
    $description = $this->layout()->siteinfo['description'];
    $keywords = $this->layout()->siteinfo['keywords'];

    if ($this->subject() && $this->subject()->getIdentity()) {
      $this->headTitle(strip_tags($this->subject()->getTitle()), Zend_View_Helper_Placeholder_Container_Abstract::PREPEND);

      $description = strip_tags($this->subject()->getDescription()) . ' ' . $description;
      // Remove the white space from left and right side
      $keywords = trim($keywords);
      if (!empty($keywords) && (strrpos($keywords, ',') !== (strlen($keywords) - 1))) {
          $keywords .= ',';
      }
      $keywords .= $this->subject()->getKeywords(',');
    }

    $keywords = trim($keywords, ',');
    
    $pageUrl = $http_https . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

    $this->headMeta()->appendName('description', trim($description));
    $this->headMeta()->appendName('keywords', trim($keywords));
    $this->headMeta()->appendName('viewport', 'width=device-width, initial-scale=1.0');
    
    if(!empty($page_id)) {
      //Roboto tag
      if($pageInfo->roboto_tags == 1) {
          $view->headMeta()->setProperty('robots', 'index, follow');
      } elseif($pageInfo->roboto_tags == 2) {
          $view->headMeta()->setProperty('robots', 'index, nofollow');
      } elseif($pageInfo->roboto_tags == 3) {
          $view->headMeta()->setProperty('robots', 'noindex, follow');
      } elseif($pageInfo->roboto_tags == 4) {
          $view->headMeta()->setProperty('robots', 'noindex,nofollow');
      }

      //Add custom tags
      if(!empty($pageInfo->meta_tags)) {
        $view->layout()->headIncludes = $pageInfo->meta_tags;
      }

      //Add Image
      if (!empty($pageInfo->meta_image)) {
        $image = Engine_Api::_()->core()->getFileUrl($pageInfo->meta_image);
        //$view->doctype('XHTML1_RDFA');
        $view->headMeta()->setProperty('og:image', $image);
        $view->headMeta()->setProperty('twitter:image',$image);
      }
    }
    
    //OG Meta Tags for facebook
    $this->headMeta()->setProperty('og:locale', $view->locale()->getLocale()->__toString());
    $this->headMeta()->setProperty('og:type', "website");
    $this->headMeta()->setProperty('og:url', $pageUrl);
    $this->headMeta()->setProperty('og:title', strip_tags($this->headTitle()->toString()));
    $this->headMeta()->setProperty('og:description', trim($description));
    
    //OG Meta Tags for twitter
    $this->headMeta()->setProperty('twitter:card', 'summary_large_image');
    $this->headMeta()->setProperty('twitter:url', $pageUrl);
    $this->headMeta()->setProperty('twitter:title', strip_tags($this->headTitle()->toString()));
    $this->headMeta()->setProperty('twitter:description', trim($description));
    if(!empty($page_id) && !empty($pageInfo->meta_image)) {
      $view->headMeta()->setProperty('twitter:image',$image);
    }

    //Adding open graph meta tag for video thumbnail
    if ($this->subject() && $this->subject()->getPhotoUrl()) {
      $this->headMeta()->setProperty('og:image', $this->absoluteUrl($this->subject()->getPhotoUrl()));
      
      //OG Meta Tags for twitter
      $this->headMeta()->setProperty('twitter:image', $this->absoluteUrl($this->subject()->getPhotoUrl()));
    }
    
    //Hreflang is an HTML <link> or <link> tag attribute that tells search engines the relationship between pages in different languages on your website. Google uses the attribute to serve the correct regional or language URLs in its search results based on the searcher's country and language preferences.
    $translate = Zend_Registry::get('Zend_Translate');
    $languages = $translate->getList();
    foreach($languages as $language) {
      $view->headLink(array('rel' => "alternate", 'hreflang' => $language, 'href' => $view->absoluteUrl($view->url().'?locale='.$language)),'PREPEND');
    }

    //A canonical URL lets you tell search engines that certain similar URLs are actually the same. Sometimes you have products or content that can be found on multiple URLs — or even multiple websites, but by using canonical URLs (HTML link tags with the attribute rel=canonical), you can have these on your site without harming your rankings.
    $view->headLink(array('rel' => 'canonical', 'href' => $view->absoluteUrl($view->url())),'PREPEND');

    //OpenSearch is a collection of simple formats for the sharing of search results. The OpenSearch description document format can be used to describe a search engine so that it can be used by search client applications.
    if(file_exists(APPLICATION_PATH . DIRECTORY_SEPARATOR . 'osdd.xml')) {
      $view->headLink(array('rel' => 'search', 'href' => 'osdd.xml', 'type' => 'application/opensearchdescription+xml'),'PREPEND');
    }
    
    //Schema Markup
    $settings = Engine_Api::_()->getApi('settings', 'core');
    $schema_type = $settings->getSetting('coreseo.schema.type', 1);
    if($schema_type == 1) {
    
      $socialmediaURL = array($settings->getSetting('coreseo.facebook', ''), $settings->getSetting('coreseo.twitter', ''), $settings->getSetting('coreseo.linkedin', ''), $settings->getSetting('coreseo.instagram', ''), $settings->getSetting('coreseo.youtube', ''));
      
      $othermediaurl = $settings->getSetting('coreseo.othermediaurl', '');
      $othermediaurl = explode(',', $othermediaurl);
      $socialmediaURL = array_merge($socialmediaURL, $othermediaurl);
      $socialmediaURL = array_filter(array_map('trim', $socialmediaURL));

      $scheme_array = array(
          '@context' => 'http://schema.org',
          '@type' => 'Website',
          "name" => $settings->getSetting('coreseo.sitetitle', Engine_Api::_()->getApi('settings', 'core')->getSetting('core.general.site.title')),
          "alternateName" => $settings->getSetting('coreseo.alternatetitle', ''),
          "url" => $view->absoluteUrl($view->url()),
          "sameAs" => $socialmediaURL, //URL of a reference Web page that unambiguously indicates the item's identity. E.g. the URL of the item's Wikipedia page, Wikidata entry, or official website. Ex: https://schema.org/sameAs
      );
      $schememarkup_array = array_filter($scheme_array);
      $schema_markup = json_encode($schememarkup_array, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    } else {
      $schema_markup = $settings->getSetting('coreseo.customschema', '');
    }
    

    // Get body identity
    if (isset($this->layout()->siteinfo['identity'])) {
        $identity = $this->layout()->siteinfo['identity'];
    } else {
        $identity = $request->getModuleName() . '-' .
            $request->getControllerName() . '-' .
            $request->getActionName();
    }
    ?>

    <?php $controllerName = $request->getControllerName();?>
    <?php $actionName = $request->getActionName(); ?>
    
    <?php echo $this->headTitle()->toString()."\n" ?>
    <?php echo $this->headMeta()->toString()."\n" ?>

    <link href="<?php echo $staticBaseUrl . 'externals/bootstrap/css/bootstrap.css'; ?>" media="screen" rel="stylesheet" type="text/css">
    <?php // LINK/STYLES?>
    <?php $favicon = Engine_Api::_()->getApi('settings', 'core')->getSetting('core.site.favicon',false); ?>
    <?php
    $this->headLink(array(
        'rel' => 'shortcut icon',
        'href' => ($favicon ? Engine_Api::_()->core()->getFileUrl($favicon) : $staticBaseUrl . ( isset($this->layout()->favicon) ? $this->layout()->favicon : 'favicon.ico')),
        'type' => 'image/x-icon'),
        'PREPEND');
    $themes = array();
    if (!empty($this->layout()->themes)) {
        $themes = $this->layout()->themes;
    } else {
        $themes = array('default');
    }

    $contrast_mode = Engine_Api::_()->core()->getContantValueXML('contrast_mode') ? Engine_Api::_()->core()->getContantValueXML('contrast_mode') : 'dark_mode';
    foreach ($themes as $theme) {
        if (APPLICATION_ENV != 'development') {
            if(isset($_SESSION['mode_theme']) && $_SESSION['mode_theme'] == 'dark_mode') {
                $this->headLink()->prependStylesheet($staticBaseUrl . 'application/css.php?request=application/themes/' . $theme . '/dark-theme.css');
            } else if(isset($_SESSION['mode_theme']) && $_SESSION['mode_theme'] == 'light_mode') {
                $this->headLink()->prependStylesheet($staticBaseUrl . 'application/css.php?request=application/themes/' . $theme . '/light-theme.css'); 
            } else{
                $this->headLink()->prependStylesheet($staticBaseUrl . 'application/css.php?request=application/themes/' . $theme . '/theme.css'); 
            }
        } else {
            if(isset($_SESSION['mode_theme']) && $_SESSION['mode_theme'] == 'dark_mode') {
                $this->headLink()->prependStylesheet(rtrim($this->baseUrl(), '/') . '/application/css.php?request=application/themes/' . $theme . '/dark-theme.css');
            } else if(isset($_SESSION['mode_theme']) && $_SESSION['mode_theme'] == 'light_mode') {
                $this->headLink()->prependStylesheet(rtrim($this->baseUrl(), '/') . '/application/css.php?request=application/themes/' . $theme . '/light-theme.css');
            } else{
                $this->headLink()->prependStylesheet(rtrim($this->baseUrl(), '/') . '/application/css.php?request=application/themes/' . $theme . '/theme.css');
            }
            
        }
    }
    // Process
    foreach ($this->headLink()->getContainer() as $dat) {
        if (!empty($dat->href)) {
            if (false === strpos($dat->href, '?')) {
                $dat->href .= '?c=' . $counter;
            } else {
                $dat->href .= '&c=' . $counter;
            }
        }
    }

    $currentTheme = APPLICATION_PATH . '/application/themes/' . $themes[0] . '/default.tpl';
    $currentThemeHeader = APPLICATION_PATH . '/application/themes/' . $themes[0] . '/head.tpl';
    ?>
    <?php echo $this->headLink()->toString()."\n" ?>
    <?php echo $this->headStyle()->toString()."\n" ?>

    <?php // TRANSLATE?>
    <?php $this->headScript()->prependScript($this->headTranslate()->toString()) ?>
    
    <?php
      $loginSignupPage = true;
      $flagLoginSignup = true;
    ?>
    
    <?php if($loginSignupPage) { ?>
    <?php // SCRIPTS?>
    <script type="text/javascript">if (window.location.hash == '#_=_')window.location.hash = '';</script>
    <script type="text/javascript">
        <?php echo $this->headScript()->captureStart(Zend_View_Helper_Placeholder_Container_Abstract::PREPEND) ?>

        //Date.setServerOffset('<?php echo date('D, j M Y G:i:s O', time()) ?>');

        en4.orientation = '<?php echo $orientation ?>';
        en4.core.environment = '<?php echo APPLICATION_ENV ?>';
        en4.core.language.setLocale('<?php echo $this->locale()->getLocale()->__toString() ?>');
        en4.core.setBaseUrl('<?php echo $this->url(array(), 'default', true) ?>');
        en4.core.staticBaseUrl = '<?php echo $this->escape($staticBaseUrl) ?>';
        en4.core.loader = scriptJquery.crtEle('img', {src: en4.core.staticBaseUrl + 'application/modules/Core/externals/images/loading.gif'});

        <?php if ($this->subject()): ?>
        en4.core.subject = {
            type : '<?php echo $this->subject()->getType(); ?>',
            id : <?php echo $this->subject()->getIdentity(); ?>,
            guid : '<?php echo $this->subject()->getGuid(); ?>'
        };
        <?php endif; ?>
        <?php if ($this->viewer()->getIdentity()): ?>
        en4.user.viewer = {
            type : '<?php echo $this->viewer()->getType(); ?>',
            id : <?php echo $this->viewer()->getIdentity(); ?>,
            guid : '<?php echo $this->viewer()->getGuid(); ?>'
        };
        <?php endif; ?>
        if( <?php echo(Engine_Api::_()->getDbtable('settings', 'core')->core_dloader_enabled ? 'true' : 'false') ?> ) {
            en4.core.runonce.add(function() {
                en4.core.dloader.attach();
            });
        }

        <?php echo $this->headScript()->captureEnd(Zend_View_Helper_Placeholder_Container_Abstract::PREPEND) ?>
        var dateFormatCalendar = "<?php echo Engine_Api::_()->core()->dateFormatCalendar(); ?>";
    </script>
    <?php if(!empty($schema_markup) && isset($schema_markup)) { ?>
      <script type="application/ld+json">
        <?php echo $schema_markup; ?>
      </script>
    <?php } ?>
    <link rel="stylesheet" href="<?php echo $staticBaseUrl . 'externals/jQuery/jquery-ui.css'; ?>">
    <?php

        $this->headScript()
            ->prependFile($staticBaseUrl . 'externals/smoothbox/smoothbox4.js')
            ->prependFile($staticBaseUrl . 'externals/smoothbox/ajaxsmoothbox.js')
            ->prependFile($staticBaseUrl . 'externals/mdetect/mdetect.js')
            ->prependFile($staticBaseUrl . 'application/modules/User/externals/scripts/core.js')
            ->prependFile($staticBaseUrl . 'application/modules/Core/externals/scripts/core.js')
            ->prependFile($staticBaseUrl . 'externals/bootstrap/js/bootstrap.js')
            ->prependFile($staticBaseUrl . 'externals/jQuery/core.js')
            ->prependFile($staticBaseUrl . 'externals/jQuery/jquery-ui.js')
            ->prependFile($staticBaseUrl . 'externals/jQuery/jquery.min.js');
    ?>

<?php
    // Process
    foreach ($this->headScript()->getContainer() as $dat) {
        if (!empty($dat->attributes['src'])) {
            if (false === strpos($dat->attributes['src'], '?')) {
                $dat->attributes['src'] .= '?c=' . $counter;
            } else {
                $dat->attributes['src'] .= '&c=' . $counter;
            }
        }
    }
    ?>

    <?php echo $this->headScript()->toString()."\n" ?>
    <script type="text/javascript">
      var $ = scriptJquery;
    </script>
    <?php } else if(empty($this->viewer()->getIdentity()) && !empty($flagLoginSignup)) { ?>
      
      <script src='<?php echo $staticBaseUrl . 'externals/jQuery/jquery.min.js'; ?>'></script>
      <script src='https://www.google.com/recaptcha/api.js' async defer></script>
      <?php 
      $spamSettings = Engine_Api::_()->getApi('settings', 'core')->core_spam;
      $recaptchaVersionSettings = Engine_Api::_()->getApi('settings', 'core')->core_spam_recaptcha_version;
      if($recaptchaVersionSettings == 0  && $spamSettings['recaptchaprivatev3'] && $spamSettings['recaptchapublicv3']) { ?>
        <script type="text/javascript">
          scriptJquery(document).ready(function() {
            scriptJquery('#captcha-wrapper').hide();
            scriptJquery('<input>').attr({ 
              name: 'recaptcha_response', 
              id: 'recaptchaResponse', 
              type: 'hidden', 
            }).appendTo('.global_form'); 
          });
        </script>
      <?php } ?>
    <?php } ?>


    <?php echo $headIncludes ?>

    <?php
    if (file_exists($currentThemeHeader)) {
        require($currentThemeHeader);
    }
    ?>
    <style type="text/css">
    @media (max-width: 600px){    
    	.iskeyboard-enabled #TB_iframeContent{max-height:calc(100vh - 330px);}
    }
    </style>
</head>

<?php
    $themeFontSize = !empty($_SESSION['font_theme']) && $_SESSION['font_theme'] ? $_SESSION['font_theme'] : "";
    $bodyClass = "";
    if (!$this->viewer()->getIdentity()){
        $bodyClass .= "guest-user";
    }
    
    $contrast_mode = Engine_Api::_()->core()->getContantValueXML('contrast_mode') ? Engine_Api::_()->core()->getContantValueXML('contrast_mode') : 'dark_mode';
    $themeModeColor = !empty($_SESSION['mode_theme']) && $_SESSION['mode_theme'] ? $_SESSION['mode_theme'] : "";
    if($contrast_mode == 'dark_mode' && $themeModeColor == 'dark_mode') {
      $bodyClass .= " ".$themeModeColor;
    } else if($contrast_mode == 'light_mode' && $themeModeColor == 'light_mode') {
      $bodyClass .= " ".$themeModeColor;
    }

?>

<body id="global_page_<?php echo $identity ?>"<?php if ($bodyClass): ?> class="<?php echo $bodyClass; ?>"<?php endif; ?><?php if ($themeFontSize): ?> style="font-size: <?php echo $themeFontSize; ?>"<?php endif; ?>>
<script type="javascript/text">
    if(DetectIpad()){
      scriptJquery('a.album_main_upload').css('display', 'none');
      scriptJquery('a.album_quick_upload').css('display', 'none');
      scriptJquery('a.icon_photos_new').css('display', 'none');
    }
</script>
<script>
    window.onload = function() {
        var windowWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        if (windowWidth <= 950) {
            var hasSidebar = (document.querySelector('.layout_main .layout_left')
            || document.querySelector('.layout_main .layout_right'));
            if (hasSidebar !== null) {
                document.body.className += ' has-sidebar';
            }

            document.getElementById('show-sidebar').onclick = function () {
                document.body.classList.toggle('sidebar-active');
            };
        }
    };
</script>
<?php if (file_exists($currentTheme)): ?>
    <?php $this->content()->renderThemeLayout($this, $currentTheme); ?>
<?php else: ?>
    <div id="global_header">
        <?php echo $headerContent ?>
    </div>
    <div id='global_wrapper'>
        <div id='global_content'>
            <span id="show-sidebar"><span><i class="fa fa-angle-down"></i></span></span>
            <?php echo $this->layout()->content ?>
        </div>
    </div>
    <div id="global_footer">
        <?php echo $footerContent ?>
    </div>
<?php endif; ?>
</body>
</html>

