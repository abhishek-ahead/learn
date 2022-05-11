INSERT IGNORE INTO `engine4_authorization_permissions`
  SELECT
  level_id as `level_id`,
  "booking_service" as `type`,
  "comment" as `name`,
  1 as `value`,
  NULL as `params`
  FROM `engine4_authorization_levels` WHERE `type` IN("moderator", "admin");