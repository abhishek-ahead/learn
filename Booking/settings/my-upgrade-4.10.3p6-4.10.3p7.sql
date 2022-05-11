DELETE FROM `engine4_activity_notificationtypes` WHERE `engine4_activity_notificationtypes`.`type` = 'booking_adminserapl' 
OR `engine4_activity_notificationtypes`.`type` = 'booking_adminprofapd' 
OR `engine4_activity_notificationtypes`.`type` = 'booking_profacceptuserreq' 
OR `engine4_activity_notificationtypes`.`type` = 'booking_useracceptprofreq'
OR `engine4_activity_notificationtypes`.`type` = 'booking_profrejectuserreq'
OR `engine4_activity_notificationtypes`.`type` = 'booking_userrejectprofreq'
OR `engine4_activity_notificationtypes`.`type` = 'booking_profcanceluserreq'
OR `engine4_activity_notificationtypes`.`type` = 'booking_usercancelprofreq';

UPDATE `engine4_core_menuitems` SET `order`=11 WHERE `name`= 'booking_admin_main_support';

INSERT IGNORE INTO `engine4_core_menus` (`name`, `type`, `title`) VALUES
("booking_main", "standard", "SNS - Booking & Appointments Main Navigation Menu");

ALTER TABLE `engine4_booking_appointments` ADD `order_id` INT NOT NULL AFTER `complete`, ADD `state` enum('pending','cancelled','failed','incomplete','complete','refund') DEFAULT 'incomplete' AFTER `order_id`;

INSERT IGNORE INTO `engine4_core_menuitems` ( `name`, `module`, `label`, `plugin`, `params`, `menu`, `submenu`, `enabled`, `custom`, `order`) VALUES
('booking_admin_manageorders', 'booking', 'Manage Payments', '', '{"route":"admin_default","module":"booking","controller":"manage-orders"}', 'booking_admin_main', '', 1, 0, 9),
('booking_admin_main_gateway', 'booking', 'Manage Gateways', '', '{"route":"admin_default","module":"booking","controller":"gateway", "target":"_blank"}', 'booking_admin_main', '' ,1, 0, 10),
('booking_admin_main_manageordersub', 'booking', 'Payment Requests', '', '{"route":"admin_default","module":"booking","controller":"manage-orders"}', 'booking_admin_manageorders', '',1,0, 1),
('booking_admin_main_managepaymentprofessionalsub', 'booking', 'Manage Payments Made', '', '{"route":"admin_default","module":"booking","controller":"manage-orders","action":"manage-payment-professional"}', 'booking_admin_manageorders', '',1,0, 2);

/*Notification types*/
INSERT IGNORE INTO `engine4_activity_notificationtypes` (`type`, `module`, `body`, `is_request`, `handler`) VALUES
('booking_profpayment_request', 'booking', 'Professional {item:$subject} {var:$adminApproveUrl} request payment {var:$requestAmount} for his services.', 0, ''),
('booking_adminprofapd', 'booking', 'Admin has been approved your Professional Profile. {var:$professionalLink}', 0, ''),
('booking_profpayment_approve', 'booking', 'Site admin {item:$subject} approved your payment request.', 0, ''),
('booking_profpayment_reject', 'booking', 'Site admin {item:$subject} rejected your payment request.', 0, ''),
('booking_servautoapl', 'booking', 'Professional {item:$subject} created a new service {item:$object}.', 0, ''),
('booking_adminserapl', 'booking', 'A New Service {var:$servicename} is waiting for your approval.', 0, ''),
('booking_profautoapl', 'booking', 'Professional {item:$object} has registered on your website.', 0, ''),
('booking_profacceptuserreq', 'booking', '{var:$appointmentUrl} has accepted your appointment request.', 0, ''),
('booking_useracceptprofreq', 'booking', '{var:$appointmentUrl} has accepted your appointment request.', 0, ''),
('booking_profrejectuserreq', 'booking', '{var:$appointmentUrl} has rejected your appointment request.', 0, ''),
('booking_userrejectprofreq', 'booking', '{var:$appointmentUrl} has rejected your appointment request.', 0, ''),
('booking_profcanceluserreq', 'booking', '{var:$appointmentUrl} has cancelled your appointment.', 0, ''),
('booking_usercancelprofreq', 'booking', '{var:$appointmentUrl} has cancelled your appointment.', 0, ''),
('booking_userlikeserv', 'booking', '{item:$object} has liked your {var:$servicename} service.', 0, ''),
('booking_userfavserv', 'booking', '{item:$subject} has marked your {var:$servicename} service as favourite.', 0, '');

/* Email */
INSERT IGNORE INTO `engine4_core_mailtemplates` (`type`, `module`, `vars`) VALUES
('booking_servautoapl', 'booking', '[host],[email],[service_name],[professional_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]'),
('booking_profpayment_request', 'booking', '[host],[email],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[professional_name],[object_link],[buyer_name]'),
('booking_profpayment_approve', 'booking', '[host],[email],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]'),
('booking_profpayment_reject', 'booking', '[host],[email],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]'),
('booking_userpayment_done', 'booking', '[host],[email],[service_name],[recipient_title],[recipient_link],[recipient_photo],[sender_title],[sender_link],[sender_photo],[object_title],[object_link],[object_photo],[object_description]');

DROP TABLE IF EXISTS `engine4_booking_orders`;
CREATE TABLE `engine4_booking_orders` (
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
  `total_services` tinyint(11) NOT NULL DEFAULT '1',
  `durations` int(11) UNSIGNED NOT NULL,
  `commission_amount` float DEFAULT '0',
  `total_service_tax` float DEFAULT '0',
  `total_entertainment_tax` float DEFAULT '0',
  `order_note` text COLLATE utf8_unicode_ci,
  `private` tinyint(1) DEFAULT '0',
  `state` enum('pending','cancelled','failed','incomplete','complete','refund') COLLATE utf8_unicode_ci DEFAULT 'incomplete',
  `change_rate` float DEFAULT '0',
  `total_amount` float DEFAULT '0',
  `currency_symbol` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `gateway_type` varchar(45) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Paypal',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `ip_address` varchar(55) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0.0.0.0',
  `creation_date` datetime NOT NULL,
  `modified_date` datetime NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `professional_id` (`professional_id`),
  KEY `owner_id` (`owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `engine4_booking_remainingpayments`;
CREATE TABLE IF NOT EXISTS `engine4_booking_remainingpayments` (
  `remainingpayment_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `professional_id` int(11) UNSIGNED NOT NULL,
  `remaining_payment` float DEFAULT "0",
  PRIMARY KEY (`remainingpayment_id`),
  KEY `professional_id` (`professional_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;

DROP TABLE IF EXISTS `engine4_booking_userpayrequests`;
CREATE TABLE IF NOT EXISTS `engine4_booking_userpayrequests` (
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

DROP TABLE IF EXISTS `engine4_booking_transactions`;
CREATE TABLE IF NOT EXISTS `engine4_booking_transactions` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;

DROP TABLE IF EXISTS `engine4_booking_usergateways`;
CREATE TABLE IF NOT EXISTS `engine4_booking_usergateways` (
  `usergateway_id` int(11) unsigned NOT NULL auto_increment,
  `professional_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `title` varchar(128) NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `enabled` tinyint(1) unsigned NOT NULL DEFAULT "0",
  `plugin` varchar(128) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `config` mediumblob,
  `test_mode` tinyint(1) unsigned NOT NULL DEFAULT "0",
  PRIMARY KEY (`usergateway_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `engine4_booking_gateways`;
CREATE TABLE IF NOT EXISTS `engine4_booking_gateways` (
  `gateway_id` int(10) unsigned NOT NULL,
  `title` varchar(128) NOT NULL,
  `description` text ,
  `enabled` tinyint(1) unsigned NOT NULL DEFAULT "0",
  `plugin` varchar(128) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `config` mediumblob,
  `test_mode` tinyint(1) unsigned NOT NULL DEFAULT "0",
  PRIMARY KEY (`gateway_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT IGNORE INTO `engine4_booking_gateways` (`gateway_id`, `title`, `description`, `enabled`, `plugin`, `config`, `test_mode`) VALUES
(1, "2Checkout", NULL, 0, "Booking_Plugin_Gateway_2Checkout", NULL, 0),
(2, "PayPal", NULL, 0, "Booking_Plugin_Gateway_PayPal",NULL, 0),
(3, "Testing", NULL, 0, "Booking_Plugin_Gateway_Testing", NULL, 1);

/* 06 June 2019 */
DROP TABLE IF EXISTS `engine4_booking_deletedprofessionals`;
CREATE TABLE IF NOT EXISTS `engine4_booking_deletedprofessionals` (
  `deletedprofessional_id` int(11) unsigned NOT NULL auto_increment,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`deletedprofessional_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/* 02 November 2019 */
ALTER TABLE `engine4_booking_usergateways` ADD `gateway_type` VARCHAR(64) NULL DEFAULT 'paypal' AFTER `test_mode`;

DELETE FROM `engine4_activity_actiontypes` WHERE `engine4_activity_actiontypes`.`type` = 'booking_adminserapl' 
OR `engine4_activity_actiontypes`.`type` = 'booking_userfavserv' 
OR `engine4_activity_actiontypes`.`type` = 'booking_pro_serv_cre' 
OR `engine4_activity_actiontypes`.`type` = 'booking_userfavpro' 
OR `engine4_activity_actiontypes`.`type` = 'booking_userfavser' 
OR `engine4_activity_actiontypes`.`type` = 'booking_userfollowpro' 
OR `engine4_activity_actiontypes`.`type` = 'booking_userlikepro' 
OR `engine4_activity_actiontypes`.`type` = 'booking_userlikeser';

INSERT IGNORE INTO `engine4_activity_actiontypes` (`type`, `module`, `body`, `enabled`, `displayable`, `attachable`, `commentable`, `shareable`, `editable`, `is_generated`) VALUES
('booking_pro_serv_cre', 'booking', '{item:$subject} creates a new service {item:$object}.',1, 5, 1, 3, 1, 0, 1),
('booking_userfavpro', 'booking', '{item:$subject} marks a professional {item:$object} as favourite.',1, 5, 1, 3, 1, 0, 1),
('booking_userfavser', 'booking', '{item:$subject} marks a service {item:$object} as favourite.', 1, 5, 1, 3, 1, 0, 1),
('booking_userfollowpro', 'booking', '{item:$subject} follow a professional {item:$object}.',1, 5, 1, 3, 1, 0, 1),
('booking_userlikepro', 'booking', '{item:$subject} likes a professional {item:$object}.',1, 5, 1, 3, 1, 0, 1),
('booking_userlikeser', 'booking', '{item:$subject} likes a service {item:$object}.',1, 5, 1, 3, 1, 0, 1);

UPDATE `engine4_core_menuitems` SET `order` = '1' WHERE `engine4_core_menuitems`.`name` = 'booking_main_services';
UPDATE `engine4_core_menuitems` SET `order` = '2' WHERE `engine4_core_menuitems`.`name` = 'booking_main_professionals';

ALTER TABLE `engine4_booking_professionals` ADD `is_deleted` INT NOT NULL DEFAULT '0' AFTER `favourite_count`;

UPDATE `engine4_core_menuitems` SET `name` = 'booking_admin_main_reviewsetting' WHERE `engine4_core_menuitems`.`name` = 'booking_admin_main_reviewsettings';

INSERT IGNORE INTO `engine4_core_menuitems` ( `name`, `module`, `label`, `plugin`, `params`, `menu`, `submenu`, `enabled`, `custom`, `order`) VALUES
("booking_admin_main_servicerev", "booking", "Services Review Settings", "", '{"route":"admin_default","module":"booking","controller":"review","action":"review-settings"}', "booking_admin_main_reviewsetting", "", 1, 0, 1),
("booking_admin_main_professionalrev", "booking", "Professional Review Settings", "", '{"route":"admin_default","module":"booking","controller":"review","action":"review-setting-professionals"}', "booking_admin_main_reviewsetting", "", 1, 0, 2);

DROP TABLE IF EXISTS `engine4_booking_profreviews`;
CREATE TABLE IF NOT EXISTS `engine4_booking_profreviews` (
  `profreview_id` int(11) unsigned NOT NULL auto_increment,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pros` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `cons` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `recommended` tinyint(1) NOT NULL DEFAULT '1',
  `owner_id` int(11) UNSIGNED NOT NULL,
  `professional_id` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `like_count` int(11) NOT NULL,
  `comment_count` int(11) NOT NULL,
  `view_count` int(11) NOT NULL,
  `rating` tinyint(1) DEFAULT NULL,
  `useful_count` int(11) NOT NULL DEFAULT '0',
  `funny_count` int(11) NOT NULL DEFAULT '0',
  `cool_count` int(11) NOT NULL DEFAULT '0',
  `offtheday` tinyint(1) NOT NULL DEFAULT '0',
  `startdate` date DEFAULT NULL,
  `enddate` date DEFAULT NULL,
  `verified` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `featured` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `creation_date` datetime NOT NULL,
  `modified_date` datetime NOT NULL,
  `type` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`profreview_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `engine4_booking_reviewvotes`;
CREATE TABLE `engine4_booking_reviewvotes` (
  `reviewvote_id` int(11) unsigned NOT NULL auto_increment,
  `professional_id` int(11) UNSIGNED NOT NULL,
  `profreview_id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL,
  PRIMARY KEY (`reviewvote_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;