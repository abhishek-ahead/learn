<?php
//folder name or directory name.
$module_name = 'booking';

//product title and module title.
$module_title = 'Booking & Appointments Plugin';

if (!$this->getRequest()->isPost()) {
  return;
}

if (!$form->isValid($this->getRequest()->getPost())) {
  return;
}

if ($this->getRequest()->isPost()) {

  $postdata = array();
  //domain name
  $postdata['domain_name'] = $_SERVER['HTTP_HOST'];
  //license key
  $postdata['licenseKey'] = @base64_encode($_POST['booking_licensekey']);
  $postdata['module_title'] = @base64_encode($module_title);

  $ch = curl_init();

  curl_setopt($ch, CURLOPT_URL, "https://socialnetworking.solutions/licensecheck.php");
  curl_setopt($ch, CURLOPT_POST, 1);

  // in real life you should use something like:
  curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postdata));

  // receive server response ...
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  $server_output = curl_exec($ch);

  $error = 0;
  if (curl_error($ch)) {
    $error = 1;
  }
  curl_close($ch);

  //here we can set some variable for checking in plugin files.
  if ($server_output == "OK" && $error != 1) {

    if (!Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.pluginactivated')) {

      $db = Zend_Db_Table_Abstract::getDefaultAdapter();
      
      $db->query('INSERT IGNORE INTO `engine4_core_menuitems` ( `name`, `module`, `label`, `plugin`, `params`, `menu`, `submenu`, `enabled`, `custom`, `order`) VALUES
      ("booking_admin_main_level", "booking", "Member Level Settings", "", \'{"route":"admin_default","module":"booking","controller":"settings","action":"level"}\', "booking_admin_main", "", 1, 0, 3),
      ("booking_admin_main_services", "booking", "Manage Services", "", \'{"route":"admin_default","module":"booking","controller":"services","action":"index"}\', "booking_admin_main", "", 1, 0, 7),
      ("booking_admin_main_professionals", "booking", "Manage Professionals", "", \'{"route":"admin_default","module":"booking","controller":"professionals","action":"index"}\', "booking_admin_main", "", 1, 0, 5),
      ("booking_admin_main_reviewsettings", "booking", "Review and rating settings", "", \'{"route":"admin_default","module":"booking","controller":"review","action":"review-settings"}\', "booking_admin_main", "", 1, 0, 8),
      ("booking_admin_main_appointments", "booking", "Manage Appointments", "", \'{"route":"admin_default","module":"booking","controller":"settings","action":"appointment"}\', "booking_admin_main", "", 1, 0, 6),
      ("booking_admin_main_durations", "booking", "Manage Durations", "", \'{"route":"admin_default","module":"booking","controller":"durations","action":"index"}\', "booking_admin_main", "", 1, 0, 2),
      ("booking_admin_main_categories", "booking", "Categories", "", \'{"route":"admin_default","module":"booking","controller":"categories","action":"index"}\', "booking_admin_main", "", 1, 0, 4),
      ("booking_admin_main_support", "booking", "Help", "", \'{"route":"admin_default","module":"booking","controller":"settings","action":"support"}\', "booking_admin_main", "", 1, 0, 10),
      ("core_sitemap_booking", "booking", "Bookings", "", \'{"route":"booking_general"}\', "core_sitemap", "", 1, 0, 4),
      ("core_main_booking", "booking", "Bookings", "", \'{"route":"booking_general"}\', "core_main", "", 1, 0, 4),
      ("booking_main_services", "booking", "Browse Services", "", \'{"route":"booking_general","action":"index"}\', "booking_main", "", 1, 0, 2),
      ("booking_main_professionals", "booking", "Browse Professionals", "", \'{"route":"booking_general","action":"professionals"}\', "booking_main", "", 1, 0, 1),
      ("booking_main_appointments", "booking", "Appointments", "", \'{"route":"booking_general","action":"appointments"}\', "booking_main", "", 1, 0, 3),
      ("booking_main_becomeprofessionals", "booking", "Become a professional", "", \'{"route":"booking_general","action":"create-professional"}\', "booking_main", "", 1, 0, 4),
      ("booking_main_settings", "booking", "Settings", "", \'{"route":"booking_general","action":"settings"}\', "booking_main", "", 1, 0, 4);');
      $db->query('INSERT IGNORE INTO `engine4_activity_notificationtypes` (`type`, `module`, `body`, `is_request`, `handler`) VALUES
      ("booking_adminprofapl", "booking", \'A new Professional {item:$object} is waiting for your approval.\', 0, ""),
      ("booking_adminprofapd", "booking", \'Admin has been approved your Professional Profile.\', 0, ""),
      ("booking_adminprofdapd", "booking", \'Sorry! Admin has disapproved your Professional Profile.\', 0, ""),
      ("booking_adminserapd", "booking", \'Your Service {item:$object} has been approved.\', 0, ""),
      ("booking_adminserdapd", "booking", \'Sorry! Your service {item:$object} has been disapproved.\', 0, ""),
      ("booking_userlikepro", "booking", \'{item:$object} has liked your Professional Profile.\', 0, ""),
      ("booking_userfollowpro", "booking", \'{item:$subject} started following your Professional Profile.\', 0, ""),
      ("booking_userfavpro", "booking", \'{item:$subject} has marked your professional profile as favourite.\', 0, ""),
      ("booking_userbookserv", "booking", \'{item:$subject} has requested for appointment of service {item:$object}\', 0, ""),
      ("booking_profbookservforuser", "booking", \'{item:$subject} has booked an appointment for you.\', 0, ""),
      ("booking_profacceptuserreq", "booking", \'{item:$subject} has accepted your appointment request.\', 0, ""),
      ("booking_profrejectuserreq", "booking", \'{item:$subject} has rejected your appointment request.\', 0, ""),
      ("booking_profcanceluserreq", "booking", \'{item:$subject} has cancelled your appointment.\', 0, ""),
      ("booking_useracceptprofreq", "booking", \'{item:$subject} has accepted your appointment request.\', 0, ""),
      ("booking_userrejectprofreq", "booking", \'{item:$subject} has rejected your appointment request.\', 0, ""),
      ("booking_usercancelprofreq", "booking", \'{item:$subject} has cancelled your appointment.\', 0, "");');
      $db->query('INSERT IGNORE INTO `engine4_activity_actiontypes` (`type`, `module`, `body`, `enabled`, `displayable`, `attachable`, `commentable`, `shareable`, `is_generated`) VALUES
      ("booking_pro_serv_cre", "booking", \'Professional {item:$subject} creates a new service {item:$object}.\', 1, 5, 1, 3, 1, 1),
      ("booking_userlikepro", "booking", \'user {item:$subject} likes a professional {item:$object}.\', 1, 5, 1, 3, 1, 1),
      ("booking_userfollowpro", "booking", \'user {item:$subject} follow a professional {item:$object}.\', 1, 5, 1, 3, 1, 1),
      ("booking_userfavpro", "booking", \'user {item:$subject} marks a professional {item:$object} as favourite.\', 1, 5, 1, 3, 1, 1),
      ("booking_userlikeser", "booking", \'user {item:$subject} likes a service {item:$object}.\', 1, 5, 1, 3, 1, 1),
      ("booking_userfavser", "booking", \'user {item:$subject} mark a service {item:$object} as favourite.\', 1, 5, 1, 3, 1, 1);');
      $db->query('INSERT IGNORE INTO `engine4_core_mailtemplates` (`type`, `module`, `vars`) VALUES
      ("booking_adminprofapl", "booking", "[host],[email],[professional_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_adminprofapd", "booking", "[host],[email],[professional_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_adminprofdapd", "booking", "[host],[email],[professional_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_adminserapl", "booking", "[host],[email],[service_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_adminserapd", "booking", "[host],[email],[service_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_adminserdapd", "booking", "[host],[email],[service_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_userbookserv", "booking", "[host],[email],[service_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_profacceptuserreq", "booking", "[host],[email],[professional_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_profrejectuserreq", "booking", "[host],[email],[professional_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_profcanceluserreq", "booking", "[host],[email],[professional_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_profbookservforuser", "booking", "[host],[email],[professional_name],[service_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_useracceptprofreq", "booking", "[host],[email],[member_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_userrejectprofreq", "booking", "[host],[email],[member_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_usercancelprofreq", "booking", "[host],[email],[member_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]");');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_appointments`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_appointments` (
        `appointment_id` int(11) NOT NULL AUTO_INCREMENT,
        `professional_id` int(11) NOT NULL,
        `user_id` int(11) NOT NULL,
        `service_id` int(11) NOT NULL,
        `duration` varchar(30) NOT NULL,
        `time` varchar(2) NOT NULL,
        `price` decimal(8,2) NOT NULL,
        `date` date NOT NULL,
        `professionaltimezone` varchar(50) NOT NULL,
        `usertimezone` varchar(50) NOT NULL,
        `professionaltime` varchar(20) NOT NULL,
        `serviceendtime` varchar(25) NOT NULL,
        `usertime` varchar(20) NOT NULL,
        `given` varchar(50) NOT NULL,
        `action` varchar(12) NOT NULL,
        `saveas` tinyint(4) NOT NULL DEFAULT "0",
        `block` tinyint(4) NOT NULL,
        `complete` tinyint(4) NOT NULL,
        PRIMARY KEY (`appointment_id`),
        KEY `appointment_id_2` (`appointment_id`,`professional_id`,`user_id`,`service_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_categories`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_categories` (
        `category_id` int(11) NOT NULL AUTO_INCREMENT,
        `slug` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        `category_name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
        `subcat_id` int(11) DEFAULT "0",
        `subsubcat_id` int(11) DEFAULT "0",
        `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
        `description` text COLLATE utf8_unicode_ci,
        `color` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
        `thumbnail` int(11) NOT NULL DEFAULT "0",
        `cat_icon` int(11) NOT NULL DEFAULT "0",
        `colored_icon` int(11) NOT NULL DEFAULT "0",
        `order` int(11) NOT NULL DEFAULT "0",
        `profile_type_review` int(11) DEFAULT NULL,
        `profile_type` int(11) DEFAULT NULL,
        `member_levels` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
        PRIMARY KEY (`category_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_durations`;');
      $db->query('CREATE TABLE  IF NOT EXISTS `engine4_booking_durations` (
        `duration_id` int(11) NOT NULL AUTO_INCREMENT,
        `durations` varchar(30) NOT NULL,
        `type` varchar(1) NOT NULL,
        `active` tinyint(4) NOT NULL DEFAULT "1",
        `durationorder` int(11) NOT NULL,
          PRIMARY KEY (`duration_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_favourites`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_favourites` (
        `favourite_id` int(11) NOT NULL AUTO_INCREMENT,
        `professional_id` int(11) NOT NULL,
        `user_id` int(11) NOT NULL,
        PRIMARY KEY (`favourite_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_follows`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_follows` (
        `follow_id` int(11) NOT NULL AUTO_INCREMENT,
        `professional_id` int(11) NOT NULL,
        `user_id` int(11) NOT NULL,
        PRIMARY KEY (`follow_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_likes`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_likes` (
        `like_id` int(11) NOT NULL AUTO_INCREMENT,
        `professional_id` int(11) NOT NULL,
        `user_id` int(11) NOT NULL,
        PRIMARY KEY (`like_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_servicelikes`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_servicelikes` (
        `servicelike_id` int(11) NOT NULL AUTO_INCREMENT,
        `service_id` int(11) NOT NULL,
        `user_id` int(11) NOT NULL,
        PRIMARY KEY (`servicelike_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_servicefavourites`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_servicefavourites` (
        `servicefavourite_id` int(11) NOT NULL AUTO_INCREMENT,
        `service_id` int(11) NOT NULL,
        `user_id` int(11) NOT NULL,
        PRIMARY KEY (`servicefavourite_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_professionalratings`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_professionalratings` (
        `professionalrating_id` int(11) NOT NULL AUTO_INCREMENT,
        `professional_id` int(11) NOT NULL,
        `user_id` int(11) NOT NULL,
        `rating` int(11) NOT NULL DEFAULT "0",
        PRIMARY KEY (`professionalrating_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_professionals`;');
      $db->query('CREATE TABLE `engine4_booking_professionals` (
        `professional_id` int(11) NOT NULL AUTO_INCREMENT,
        `user_id` int(11) NOT NULL,
        `name` varchar(255) NOT NULL,
        `designation` varchar(255) DEFAULT NULL,
        `country_code` varchar(6) NOT NULL,
        `phone_number` varchar(15) NOT NULL,
        `location` varchar(255) DEFAULT NULL,
        `timezone` varchar(50) NOT NULL,
        `description` text,
        `rating` int(11) NOT NULL,
        `file_id` int(11) DEFAULT "0",
        `active` tinyint(4) NOT NULL DEFAULT "0",
        `available` tinyint(4) NOT NULL DEFAULT "1",
        `like_count` int(11) DEFAULT "0",
        `follow_count` int(11) DEFAULT "0",
        `favourite_count` int(11) NOT NULL DEFAULT "0",
        `is_deleted` INT NOT NULL DEFAULT "0",
          PRIMARY KEY (`professional_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_services`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_services` (
        `service_id` int(11) NOT NULL AUTO_INCREMENT,
        `user_id` int(11) NOT NULL,
        `name` varchar(255) NOT NULL,
        `description` text NOT NULL,
        `price` decimal(8,2) NOT NULL,
        `category_id` int(11) NOT NULL,
        `subcat_id` int(11) NOT NULL,
        `subsubcat_id` int(11) NOT NULL,
        `timelimit` varchar(2) NOT NULL,
        `duration` varchar(255) NOT NULL,
        `file_id` int(11) DEFAULT "0",
        `active` tinyint(1) NOT NULL DEFAULT "0",
        `like_count` int(11) DEFAULT "0",
        `favourite_count` int(11) NOT NULL DEFAULT "0",
          PRIMARY KEY (`service_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_settingdurations`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_settingdurations` (
        `settingduration_id` int(11) NOT NULL AUTO_INCREMENT,
        `setting_id` int(11) NOT NULL,
        `starttime` varchar(255) NOT NULL,
        `endtime` varchar(255) NOT NULL,
        `user_id` int(11) NOT NULL,
        `available` tinyint(4) NOT NULL DEFAULT "1",
          PRIMARY KEY (`settingduration_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_settings`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_settings` (
        `setting_id` int(11) NOT NULL AUTO_INCREMENT,
        `day` int(11) NOT NULL,
        `duration` varchar(50) NOT NULL,
        `starttime` varchar(50) NOT NULL,
        `endtime` varchar(50) NOT NULL,
        `offday` smallint(6) NOT NULL,
        `user_id` int(11) NOT NULL,
          PRIMARY KEY (`setting_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_settingservices`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_settingservices` (
        `settingservice_id` int(11) NOT NULL AUTO_INCREMENT,
        `setting_id` int(11) NOT NULL,
        `service_id` int(11) NOT NULL,
        `user_id` int(11) NOT NULL,
          PRIMARY KEY (`settingservice_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_reviews`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_reviews` (
        `review_id` int(11) NOT NULL AUTO_INCREMENT,
        `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        `pros` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        `cons` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        `description` text COLLATE utf8_unicode_ci NOT NULL,
        `recommended` tinyint(1) NOT NULL DEFAULT "1",
        `user_id` int(11) UNSIGNED NOT NULL,
        `module_name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
        `service_id` int(11) UNSIGNED NOT NULL DEFAULT "0",
        `creation_date` datetime NOT NULL,
        `like_count` int(11) NOT NULL,
        `comment_count` int(11) NOT NULL,
        `view_count` int(11) NOT NULL,
        `rating` tinyint(1) DEFAULT NULL,
          PRIMARY KEY (`review_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;');
      $db->query('INSERT IGNORE INTO `engine4_core_settings` (`name`, `value`) VALUES
      ("booking.allow.for", "1"),
      ("booking.allow.owner", "1"),
      ("booking.allow.review", "1"),
      ("booking.allow.share", "1"),
      ("booking.booking.manifest", "booking"),
      ("booking.bookings.manifest", "bookings"),
      ("booking.category.enable", "1"),
      ("booking.enable.location", "1"),
      ("booking.prof.fav", "1"),
      ("booking.prof.follow", "1"),
      ("booking.prof.like", "1"),
      ("booking.prof.report", "1"),
      ("booking.rating.stars.five", "excellent"),
      ("booking.rating.stars.four", "very good"),
      ("booking.rating.stars.one", "terrible"),
      ("booking.rating.stars.three", "average"),
      ("booking.rating.stars.two", "poor"),
      ("booking.review.summary", "1"),
      ("booking.search.type", "1"),
      ("booking.service.fav", "1"),
      ("booking.service.like", "1"),
      ("booking.service.share", "1"),
      ("booking.show.cons", "1"),
      ("booking.show.pros", "1"),
      ("booking.show.recommended", "1"),
      ("booking.show.report", "1"),
      ("booking.show.tinymce", "1");');
      $db->query('INSERT IGNORE INTO `engine4_booking_durations` (`durations`, `type`, `active`, `durationorder`) VALUES
      ("30", "m", 1, 1),
      ("1", "h", 1, 2),
      ("2", "h", 1, 3);');
      
      $db->query('DELETE FROM `engine4_activity_notificationtypes` WHERE `engine4_activity_notificationtypes`.`type` = "booking_adminserapl" OR `engine4_activity_notificationtypes`.`type` = "booking_adminprofapd" OR `engine4_activity_notificationtypes`.`type` = "booking_profacceptuserreq" OR `engine4_activity_notificationtypes`.`type` = "booking_useracceptprofreq" OR `engine4_activity_notificationtypes`.`type` = "booking_profrejectuserreq" OR `engine4_activity_notificationtypes`.`type` = "booking_userrejectprofreq" OR `engine4_activity_notificationtypes`.`type` = "booking_profcanceluserreq" OR `engine4_activity_notificationtypes`.`type` = "booking_usercancelprofreq";');
      $db->query('UPDATE `engine4_core_menuitems` SET `order`=11 WHERE `name`= "booking_admin_main_support";');
      $db->query('INSERT IGNORE INTO `engine4_core_menus` (`name`, `type`, `title`) VALUES
      ("booking_main", "standard", "SNS - Booking & Appointments Main Navigation Menu");');
      $db->query('ALTER TABLE `engine4_booking_appointments` ADD `order_id` INT NOT NULL AFTER `complete`, ADD `state` enum("pending","cancelled","failed","incomplete","complete","refund") DEFAULT "incomplete" AFTER `order_id`;');
      $db->query('INSERT IGNORE INTO `engine4_core_menuitems` ( `name`, `module`, `label`, `plugin`, `params`, `menu`, `submenu`, `enabled`, `custom`, `order`) VALUES
      ("booking_admin_manageorders", "booking", "Manage Payments", "", \'{"route":"admin_default","module":"booking","controller":"manage-orders"}\', "booking_admin_main", "", 1, 0, 9),
      ("booking_admin_main_gateway", "booking", "Manage Gateways", "", \'{"route":"admin_default","module":"booking","controller":"gateway", "target":"_blank"}\', "booking_admin_main", "" ,1, 0, 10),
      ("booking_admin_main_manageordersub", "booking", "Payment Requests", "", \'{"route":"admin_default","module":"booking","controller":"manage-orders"}\', "booking_admin_manageorders", "",1,0, 1),
      ("booking_admin_main_managepaymentprofessionalsub", "booking", "Manage Payments Made", "", \'{"route":"admin_default","module":"booking","controller":"manage-orders","action":"manage-payment-professional"}\', "booking_admin_manageorders", "",1,0, 2);');
      
      $db->query('INSERT IGNORE INTO `engine4_activity_notificationtypes` (`type`, `module`, `body`, `is_request`, `handler`) VALUES
      ("booking_profpayment_request", "booking", \'Professional {item:$subject} {var:$adminApproveUrl} request payment {var:$requestAmount} for his services.\', 0, ""),
      ("booking_adminprofapd", "booking", \'Admin has been approved your Professional Profile. {var:$professionalLink}\', 0, ""),
      ("booking_profpayment_approve", "booking", \'Site admin {item:$subject} approved your payment request.\', 0, ""),
      ("booking_profpayment_reject", "booking", \'Site admin {item:$subject} rejected your payment request.\', 0, ""),
      ("booking_servautoapl", "booking", \'Professional {item:$subject} created a new service {item:$object}.\', 0, ""),
      ("booking_adminserapl", "booking", \'A New Service {var:$servicename} is waiting for your approval.\', 0, ""),
      ("booking_profautoapl", "booking", \'Professional {item:$object} has registered on your website.\', 0, ""),
      ("booking_profacceptuserreq", "booking", \'{var:$appointmentUrl} has accepted your appointment request.\', 0, ""),
      ("booking_useracceptprofreq", "booking", \'{var:$appointmentUrl} has accepted your appointment request.\', 0, ""),
      ("booking_profrejectuserreq", "booking", \'{var:$appointmentUrl} has rejected your appointment request.\', 0, ""),
      ("booking_userrejectprofreq", "booking", \'{var:$appointmentUrl} has rejected your appointment request.\', 0, ""),
      ("booking_profcanceluserreq", "booking", \'{var:$appointmentUrl} has cancelled your appointment.\', 0, ""),
      ("booking_usercancelprofreq", "booking", \'{var:$appointmentUrl} has cancelled your appointment.\', 0, ""),
      ("booking_userlikeserv", "booking", \'{item:$object} has liked your {var:$servicename} service.\', 0, ""),
      ("booking_userfavserv", "booking", \'{item:$subject} has marked your {var:$servicename} service as favourite.\', 0, "");');
      $db->query('INSERT IGNORE INTO `engine4_core_mailtemplates` (`type`, `module`, `vars`) VALUES
      ("booking_servautoapl", "booking", "[host],[email],[service_name],[professional_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_profpayment_request", "booking", "[host],[email],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[professional_name],[object_link],[buyer_name]"),
      ("booking_profpayment_approve", "booking", "[host],[email],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_profpayment_reject", "booking", "[host],[email],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]"),
      ("booking_userpayment_done", "booking", "[host],[email],[service_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]");');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_orders`;');
      $db->query('CREATE TABLE `engine4_booking_orders` (
      `order_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
      `professional_id` int(11) UNSIGNED NOT NULL,
      `owner_id` int(11) UNSIGNED NOT NULL,
      `gateway_id` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
      `fname` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
      `lname` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
      `email` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
      `company_title` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
      `mobile` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
      `ragistration_number` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
      `order_no` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
      `gateway_transaction_id` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
      `total_services` tinyint(11) NOT NULL DEFAULT "1",
      `durations` int(11) UNSIGNED NOT NULL,
      `commission_amount` float DEFAULT "0",
      `total_service_tax` float DEFAULT "0",
      `total_entertainment_tax` float DEFAULT "0",
      `order_note` text COLLATE utf8_unicode_ci,
      `private` tinyint(1) DEFAULT "0",
      `state` enum("pending","cancelled","failed","incomplete","complete","refund") COLLATE utf8_unicode_ci DEFAULT "incomplete",
      `change_rate` float DEFAULT "0",
      `total_amount` float DEFAULT "0",
      `currency_symbol` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
      `gateway_type` varchar(45) COLLATE utf8_unicode_ci NOT NULL DEFAULT "Paypal",
      `is_delete` tinyint(1) NOT NULL DEFAULT "0",
      `ip_address` varchar(55) COLLATE utf8_unicode_ci NOT NULL DEFAULT "0.0.0.0",
      `creation_date` datetime NOT NULL,
      `modified_date` datetime NOT NULL,
      PRIMARY KEY (`order_id`),
      KEY `professional_id` (`professional_id`),
      KEY `owner_id` (`owner_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_remainingpayments`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_remainingpayments` (
      `remainingpayment_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
      `professional_id` int(11) UNSIGNED NOT NULL,
      `remaining_payment` float DEFAULT "0",
      PRIMARY KEY (`remainingpayment_id`),
      KEY `professional_id` (`professional_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_userpayrequests`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_userpayrequests` (
      `userpayrequest_id` INT(11) unsigned NOT NULL auto_increment,
      `professional_id` INT(11) unsigned NOT NULL,
      `owner_id` INT(11) unsigned NOT NULL,
      `requested_amount` FLOAT DEFAULT "0",
      `release_amount` FLOAT DEFAULT "0",
      `user_message` TEXT,
      `admin_message` TEXT,
      `creation_date` datetime NOT NULL,
      `release_date` datetime NOT NULL,
      `is_delete` TINYINT(1) NOT NULL DEFAULT "0",
      `gateway_id` TINYINT (1) DEFAULT "2",
      `gateway_transaction_id` varchar(128) DEFAULT NULL,
      `state` ENUM("pending","cancelled","failed","incomplete","complete","refund") DEFAULT "pending",
      `currency_symbol` VARCHAR(45) NOT NULL,
      `gateway_type` VARCHAR(45) NOT NULL DEFAULT "Paypal",
      PRIMARY KEY (`userpayrequest_id`),
      KEY `professional_id` (`professional_id`),
      KEY `owner_id` (`owner_id`)
      ) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_transactions`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_transactions` (
      `transaction_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
      `user_id` int(10) unsigned NOT NULL default "0",
      `gateway_id` int(10) unsigned NOT NULL,
      `timestamp` datetime NOT NULL,
      `order_id` int(10) unsigned NOT NULL default "0",
      `type` varchar(64)  NULL,
      `state` varchar(64)  NULL,
      `gateway_transaction_id` varchar(128)  NOT NULL,
      `gateway_parent_transaction_id` varchar(128)  NULL,
      `gateway_order_id` varchar(128)  NULL,
      `amount` decimal(16,2) NOT NULL,
      `currency` char(3)  NOT NULL default "",
      `expiration_date` datetime NOT NULL,
      `professional_id` int(10) unsigned NOT NULL default "0",
      `gateway_profile_id` VARCHAR(128) DEFAULT NULL,
      `package_id` INT(11) NOT NULL,
      PRIMARY KEY  (`transaction_id`),
      KEY `user_id` (`user_id`),
      KEY `gateway_id` (`gateway_id`),
      KEY `type` (`type`),
      KEY `state` (`state`),
      KEY `gateway_transaction_id` (`gateway_transaction_id`),
      KEY `gateway_parent_transaction_id` (`gateway_parent_transaction_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_usergateways`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_usergateways` (
      `usergateway_id` int(11) unsigned NOT NULL auto_increment,
      `professional_id` int(11) unsigned NOT NULL,
      `user_id` int(11) unsigned NOT NULL,
      `title` varchar(128) NOT NULL,
      `description` text COLLATE utf8_unicode_ci,
      `enabled` tinyint(1) unsigned NOT NULL DEFAULT "0",
      `plugin` varchar(128) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
      `config` mediumblob,
      `test_mode` tinyint(1) unsigned NOT NULL DEFAULT "0",
      `gateway_type` VARCHAR(64) NULL DEFAULT "paypal",
      PRIMARY KEY (`usergateway_id`)
      ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_gateways`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_gateways` (
      `gateway_id` int(10) unsigned NOT NULL,
      `title` varchar(128) NOT NULL,
      `description` text ,
      `enabled` tinyint(1) unsigned NOT NULL DEFAULT "0",
      `plugin` varchar(128) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
      `config` mediumblob,
      `test_mode` tinyint(1) unsigned NOT NULL DEFAULT "0",
      PRIMARY KEY (`gateway_id`)
      ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;');
      $db->query('INSERT IGNORE INTO `engine4_booking_gateways` (`gateway_id`, `title`, `description`, `enabled`, `plugin`, `config`, `test_mode`) VALUES
      (1, "2Checkout", NULL, 0, "Booking_Plugin_Gateway_2Checkout", NULL, 0),
      (2, "PayPal", NULL, 0, "Booking_Plugin_Gateway_PayPal",NULL, 0),
      (3, "Testing", NULL, 0, "Booking_Plugin_Gateway_Testing", NULL, 1);');
      $db->query('DROP TABLE IF EXISTS `engine4_booking_deletedprofessionals`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_deletedprofessionals` (
      `deletedprofessional_id` int(11) unsigned NOT NULL auto_increment,
      `user_id` int(11) NOT NULL,
      PRIMARY KEY (`deletedprofessional_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;');
      
      $db->query('DROP TABLE IF EXISTS `engine4_booking_reviewvotes`;');
      $db->query('CREATE TABLE `engine4_booking_reviewvotes` (
            `reviewvote_id` int(11) unsigned NOT NULL auto_increment,
            `professional_id` int(11) UNSIGNED NOT NULL,
            `profreview_id` int(11) UNSIGNED NOT NULL,
            `user_id` int(11) NOT NULL,
            `type` tinyint(1) NOT NULL,
            PRIMARY KEY (`reviewvote_id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;');

      $db->query('DROP TABLE IF EXISTS `engine4_booking_profreviews`;');
      $db->query('CREATE TABLE IF NOT EXISTS `engine4_booking_profreviews` (
            `profreview_id` int(11) unsigned NOT NULL auto_increment,
            `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
            `pros` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
            `cons` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
            `description` text COLLATE utf8_unicode_ci DEFAULT NULL,
            `recommended` tinyint(1) NOT NULL DEFAULT "1",
            `owner_id` int(11) UNSIGNED NOT NULL,
            `professional_id` int(11) UNSIGNED NOT NULL DEFAULT "0",
            `like_count` int(11) NOT NULL,
            `comment_count` int(11) NOT NULL,
            `view_count` int(11) NOT NULL,
            `rating` tinyint(1) DEFAULT NULL,
            `useful_count` int(11) NOT NULL DEFAULT "0",
            `funny_count` int(11) NOT NULL DEFAULT "0",
            `cool_count` int(11) NOT NULL DEFAULT "0",
            `offtheday` tinyint(1) NOT NULL DEFAULT "0",
            `startdate` date DEFAULT NULL,
            `enddate` date DEFAULT NULL,
            `verified` tinyint(1) UNSIGNED NOT NULL DEFAULT "0",
            `featured` tinyint(1) UNSIGNED NOT NULL DEFAULT "0",
            `creation_date` datetime NOT NULL,
            `modified_date` datetime NOT NULL,
            `type` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
            PRIMARY KEY (`profreview_id`)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;');

      $db->query('INSERT IGNORE INTO `engine4_core_menuitems` ( `name`, `module`, `label`, `plugin`, `params`, `menu`, `submenu`, `enabled`, `custom`, `order`) VALUES
      ("booking_admin_main_servicerev", "booking", "Services Review Settings", "", \'{"route":"admin_default","module":"booking","controller":"review","action":"review-settings"}\', "booking_admin_main_reviewsetting", "", 1, 0, 1),
      ("booking_admin_main_professionalrev", "booking", "Professional Review Settings", "", \'{"route":"admin_default","module":"booking","controller":"review","action":"review-setting-professionals"}\', "booking_admin_main_reviewsetting", "", 1, 0, 2);');

       $db->query('INSERT IGNORE INTO `engine4_authorization_permissions`
        SELECT
        level_id as `level_id`,
        "booking_service" as `type`,
        "comment" as `name`,
        1 as `value`,
        NULL as `params`
        FROM `engine4_authorization_levels` WHERE `type` IN("moderator", "admin");');


      include_once APPLICATION_PATH . "/application/modules/Booking/controllers/defaultsettings.php";
      Engine_Api::_()->getApi('settings', 'core')->setSetting('booking.pluginactivated', 1);
      Engine_Api::_()->getApi('settings', 'core')->setSetting('booking.licensekey', $_POST['booking_licensekey']);
    }
    $domain_name = @base64_encode(str_replace(array('http://','https://','www.'),array('','',''),$_SERVER['HTTP_HOST']));
    $licensekey = Engine_Api::_()->getApi('settings', 'core')->getSetting('booking.licensekey');
    $licensekey = @base64_encode($licensekey);
    Engine_Api::_()->getApi('settings', 'core')->setSetting('booking.sesdomainauth', $domain_name);
    Engine_Api::_()->getApi('settings', 'core')->setSetting('booking.seslkeyauth', $licensekey);
    $error = 1;
  } else {
    $error = $this->view->translate('Please enter correct License key for this product.');
    $error = Zend_Registry::get('Zend_Translate')->_($error);
    $form->getDecorator('errors')->setOption('escape', false);
    $form->addError($error);
    $error = 0;
    Engine_Api::_()->getApi('settings', 'core')->setSetting('booking.sesdomainauth', '');
    Engine_Api::_()->getApi('settings', 'core')->setSetting('booking.seslkeyauth', '');
    Engine_Api::_()->getApi('settings', 'core')->setSetting('booking.licensekey', $_POST['booking_licensekey']);
    return;
    $this->_helper->redirector->gotoRoute(array());
  }
}
