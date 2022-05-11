 /**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: my.sql  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */

INSERT IGNORE INTO `engine4_core_menuitems` ( `name`, `module`, `label`, `plugin`, `params`, `menu`, `submenu`, `enabled`, `custom`, `order`) VALUES
("core_admin_main_plugins_booking", "booking", "SNS - Booking & Appointments", "", '{"route":"admin_default","module":"booking","controller":"settings"}', "core_admin_main_plugins", "", 1, 0, 800),
("booking_admin_main_settings", "booking", "Global Settings", "", '{"route":"admin_default","module":"booking","controller":"settings"}', "booking_admin_main", "", 1, 0, 1);