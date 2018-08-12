/*
 Navicat Premium Data Transfer

 Source Server         : 本地root
 Source Server Type    : MySQL
 Source Server Version : 50711
 Source Host           : localhost:3306
 Source Schema         : teach_system

 Target Server Type    : MySQL
 Target Server Version : 50711
 File Encoding         : 65001

 Date: 12/08/2018 19:49:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for announcement
-- ----------------------------
DROP TABLE IF EXISTS `announcement`;
CREATE TABLE `announcement`  (
  `a_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `c_id` int(10) UNSIGNED DEFAULT NULL,
  `topic` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `start_time` bigint(20) NOT NULL,
  `end_time` bigint(20) NOT NULL,
  PRIMARY KEY (`a_id`) USING BTREE,
  INDEX `FK_Relationship_3`(`c_id`) USING BTREE,
  CONSTRAINT `FK_Relationship_3` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for badge
-- ----------------------------
DROP TABLE IF EXISTS `badge`;
CREATE TABLE `badge`  (
  `b_id` int(10) UNSIGNED NOT NULL,
  `b_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `b_img` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `get_condition` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `next_level` int(11) DEFAULT NULL,
  `b_type` tinyint(4) NOT NULL,
  PRIMARY KEY (`b_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of badge
-- ----------------------------
INSERT INTO `badge` VALUES (2, '初出茅庐', 'badge_2.png', '拥有1门及以上注册课程', 3, 1);
INSERT INTO `badge` VALUES (3, '渐入佳境', 'badge_3.png', '拥有4门及以上注册课程', 4, 1);
INSERT INTO `badge` VALUES (4, '走火入魔', 'badge_4.png', '拥有7门及以上注册课程', NULL, 1);
INSERT INTO `badge` VALUES (5, '青铜', 'badge_5.png', '平均能力值<2(仅统计做题数超过20的课程)', 6, 2);
INSERT INTO `badge` VALUES (6, '白银', 'badge_6.png', '平均能力值>=2,<4(仅统计做题数超过20的课程)', 7, 2);
INSERT INTO `badge` VALUES (7, '黄金', 'badge_7.png', '平均能力值>=4,<6(仅统计做题数超过20的课程)', 8, 2);
INSERT INTO `badge` VALUES (8, '铂金', 'badge_8.png', '平均能力值>=6,<8(仅统计做题数超过20的课程)', 9, 2);
INSERT INTO `badge` VALUES (9, '砖石', 'badge_9.png', '平均能力值>=8,<9(仅统计做题数超过20的课程)', 10, 2);
INSERT INTO `badge` VALUES (10, '王者', 'badge_10.png', '平均能力值>=9,<=10(仅统计做题数超过20的课程)', NULL, 2);

-- ----------------------------
-- Table structure for class
-- ----------------------------
DROP TABLE IF EXISTS `class`;
CREATE TABLE `class`  (
  `class_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `g_id` int(10) UNSIGNED DEFAULT NULL,
  `content` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`class_id`) USING BTREE,
  UNIQUE INDEX `content_unique`(`content`, `g_id`) USING BTREE,
  INDEX `FK_Relationship_13`(`g_id`) USING BTREE,
  CONSTRAINT `FK_Relationship_13` FOREIGN KEY (`g_id`) REFERENCES `grade` (`g_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of class
-- ----------------------------
INSERT INTO `class` VALUES (9, 6, '软件1班');

-- ----------------------------
-- Table structure for course
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course`  (
  `c_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `c_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `c_picture` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `c_intro` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `teacher_intro` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `first_course` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `teach_plan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `exam_type` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `reference_book` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `update_time` bigint(20) NOT NULL,
  `create_time` bigint(20) NOT NULL,
  PRIMARY KEY (`c_id`) USING BTREE,
  UNIQUE INDEX `code_unique`(`code`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of course
-- ----------------------------
INSERT INTO `course` VALUES (7, '1', 'c++', '', '', '', '', '', '', '', 1528949421389, 1528949421389);

-- ----------------------------
-- Table structure for courseware
-- ----------------------------
DROP TABLE IF EXISTS `courseware`;
CREATE TABLE `courseware`  (
  `cw_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `c_id` int(10) UNSIGNED DEFAULT NULL,
  `cw_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`cw_id`) USING BTREE,
  UNIQUE INDEX `name_c_id_unique`(`c_id`, `cw_name`) USING BTREE,
  CONSTRAINT `FK_Relationship_1` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for grade
-- ----------------------------
DROP TABLE IF EXISTS `grade`;
CREATE TABLE `grade`  (
  `g_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `c_id` int(10) UNSIGNED DEFAULT NULL,
  `content` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`g_id`) USING BTREE,
  UNIQUE INDEX `content_unique`(`content`, `g_id`) USING BTREE,
  INDEX `FK_Relationship_14`(`c_id`) USING BTREE,
  CONSTRAINT `FK_Relationship_14` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of grade
-- ----------------------------
INSERT INTO `grade` VALUES (6, 7, '2013级');

-- ----------------------------
-- Table structure for group_question
-- ----------------------------
DROP TABLE IF EXISTS `group_question`;
CREATE TABLE `group_question`  (
  `qg_id` int(10) UNSIGNED NOT NULL,
  `ql_id` int(10) UNSIGNED NOT NULL,
  `score` smallint(6) NOT NULL,
  PRIMARY KEY (`qg_id`, `ql_id`) USING BTREE,
  INDEX `FK_Group_question2`(`ql_id`) USING BTREE,
  CONSTRAINT `FK_Group_question` FOREIGN KEY (`qg_id`) REFERENCES `question_group` (`qg_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_Group_question2` FOREIGN KEY (`ql_id`) REFERENCES `question_library` (`ql_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group_question
-- ----------------------------
INSERT INTO `group_question` VALUES (30, 108, 20);

-- ----------------------------
-- Table structure for judge_program
-- ----------------------------
DROP TABLE IF EXISTS `judge_program`;
CREATE TABLE `judge_program`  (
  `sc_id` int(10) UNSIGNED NOT NULL,
  `ql_id` int(10) UNSIGNED NOT NULL,
  `test_id` int(10) UNSIGNED NOT NULL,
  `sum` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `score` smallint(6) NOT NULL,
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`sc_id`, `ql_id`, `test_id`) USING BTREE,
  INDEX `FK_Judge_program2`(`ql_id`) USING BTREE,
  INDEX `FK_Judge_program3`(`test_id`) USING BTREE,
  CONSTRAINT `FK_Judge_program` FOREIGN KEY (`sc_id`) REFERENCES `student_class` (`sc_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_Judge_program2` FOREIGN KEY (`ql_id`) REFERENCES `question_library` (`ql_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_Judge_program3` FOREIGN KEY (`test_id`) REFERENCES `test` (`test_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of judge_program
-- ----------------------------
INSERT INTO `judge_program` VALUES (33, 108, 28, '{\"err\":null,\"data\":[{\"error\":0,\"memory\":1531904,\"exit_code\":0,\"test_case\":\"2\",\"output_md5\":\"45c48cce2e2d7fbdea1afc51c7c6ad26\",\"signal\":0,\"cpu_time\":0,\"output\":null,\"real_time\":1,\"result\":0,\"right\":true},{\"error\":0,\"memory\":1658880,\"exit_code\":0,\"test_case\":\"1\",\"output_md5\":\"a87ff679a2f3e71d9181a67b7542122c\",\"signal\":0,\"cpu_time\":0,\"output\":null,\"real_time\":1,\"result\":0,\"right\":true}]}', 20, '[\"cpp\",\"#include <cstdio>\\n\\nint main() {\\n    int T_T, a, b;\\n\\n\\n        scanf(\\\"%d%d\\\", &a, &b);\\n        printf(\\\"%d\\\\n\\\", a+b);\\n\\n    return 0;\\n}\"]');
INSERT INTO `judge_program` VALUES (34, 108, 28, '{\"err\":null,\"data\":[{\"error\":0,\"memory\":1523712,\"exit_code\":0,\"test_case\":\"2\",\"output_md5\":\"45c48cce2e2d7fbdea1afc51c7c6ad26\",\"signal\":0,\"cpu_time\":0,\"output\":null,\"real_time\":3,\"result\":0,\"right\":true},{\"error\":0,\"memory\":1581056,\"exit_code\":0,\"test_case\":\"1\",\"output_md5\":\"a87ff679a2f3e71d9181a67b7542122c\",\"signal\":0,\"cpu_time\":0,\"output\":null,\"real_time\":1,\"result\":0,\"right\":true}]}', 20, '[\"cpp\",\"#include <cstdio>\\n\\nint main() {\\n    int T_T, a, b;\\n\\n\\n        scanf(\\\"%d%d\\\", &a, &b);\\n        printf(\\\"%d\\\\n\\\", a+b);\\n\\n    return 0;\\n}\"]');

-- ----------------------------
-- Table structure for jurisdiction
-- ----------------------------
DROP TABLE IF EXISTS `jurisdiction`;
CREATE TABLE `jurisdiction`  (
  `j_id` int(10) NOT NULL AUTO_INCREMENT,
  `content` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`j_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of jurisdiction
-- ----------------------------
INSERT INTO `jurisdiction` VALUES (1, '教师');
INSERT INTO `jurisdiction` VALUES (3, '学生');
INSERT INTO `jurisdiction` VALUES (4, '管理员');

-- ----------------------------
-- Table structure for jurisdiction_resource
-- ----------------------------
DROP TABLE IF EXISTS `jurisdiction_resource`;
CREATE TABLE `jurisdiction_resource`  (
  `j_id` int(10) NOT NULL,
  `r_id` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`j_id`, `r_id`) USING BTREE,
  INDEX `FK_Jurisdiction_resource2`(`r_id`) USING BTREE,
  CONSTRAINT `FK_Jurisdiction_resource2` FOREIGN KEY (`r_id`) REFERENCES `resource` (`r_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_j_id` FOREIGN KEY (`j_id`) REFERENCES `jurisdiction` (`j_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of jurisdiction_resource
-- ----------------------------
INSERT INTO `jurisdiction_resource` VALUES (1, 321);
INSERT INTO `jurisdiction_resource` VALUES (3, 321);
INSERT INTO `jurisdiction_resource` VALUES (1, 322);
INSERT INTO `jurisdiction_resource` VALUES (3, 322);
INSERT INTO `jurisdiction_resource` VALUES (1, 323);
INSERT INTO `jurisdiction_resource` VALUES (3, 323);
INSERT INTO `jurisdiction_resource` VALUES (1, 324);
INSERT INTO `jurisdiction_resource` VALUES (1, 325);
INSERT INTO `jurisdiction_resource` VALUES (1, 326);
INSERT INTO `jurisdiction_resource` VALUES (3, 327);
INSERT INTO `jurisdiction_resource` VALUES (3, 328);
INSERT INTO `jurisdiction_resource` VALUES (1, 329);
INSERT INTO `jurisdiction_resource` VALUES (3, 329);
INSERT INTO `jurisdiction_resource` VALUES (1, 330);
INSERT INTO `jurisdiction_resource` VALUES (1, 331);
INSERT INTO `jurisdiction_resource` VALUES (1, 332);
INSERT INTO `jurisdiction_resource` VALUES (1, 333);
INSERT INTO `jurisdiction_resource` VALUES (1, 334);
INSERT INTO `jurisdiction_resource` VALUES (1, 335);
INSERT INTO `jurisdiction_resource` VALUES (1, 336);
INSERT INTO `jurisdiction_resource` VALUES (1, 337);
INSERT INTO `jurisdiction_resource` VALUES (3, 337);
INSERT INTO `jurisdiction_resource` VALUES (1, 338);
INSERT INTO `jurisdiction_resource` VALUES (3, 338);
INSERT INTO `jurisdiction_resource` VALUES (1, 339);
INSERT INTO `jurisdiction_resource` VALUES (3, 339);
INSERT INTO `jurisdiction_resource` VALUES (1, 340);
INSERT INTO `jurisdiction_resource` VALUES (3, 340);
INSERT INTO `jurisdiction_resource` VALUES (1, 341);
INSERT INTO `jurisdiction_resource` VALUES (3, 341);
INSERT INTO `jurisdiction_resource` VALUES (1, 342);
INSERT INTO `jurisdiction_resource` VALUES (3, 342);
INSERT INTO `jurisdiction_resource` VALUES (1, 343);
INSERT INTO `jurisdiction_resource` VALUES (3, 343);
INSERT INTO `jurisdiction_resource` VALUES (1, 346);
INSERT INTO `jurisdiction_resource` VALUES (1, 348);
INSERT INTO `jurisdiction_resource` VALUES (3, 348);
INSERT INTO `jurisdiction_resource` VALUES (1, 349);
INSERT INTO `jurisdiction_resource` VALUES (1, 350);
INSERT INTO `jurisdiction_resource` VALUES (1, 351);
INSERT INTO `jurisdiction_resource` VALUES (1, 352);
INSERT INTO `jurisdiction_resource` VALUES (1, 353);
INSERT INTO `jurisdiction_resource` VALUES (1, 354);
INSERT INTO `jurisdiction_resource` VALUES (3, 354);
INSERT INTO `jurisdiction_resource` VALUES (1, 355);
INSERT INTO `jurisdiction_resource` VALUES (3, 355);
INSERT INTO `jurisdiction_resource` VALUES (1, 356);
INSERT INTO `jurisdiction_resource` VALUES (1, 357);
INSERT INTO `jurisdiction_resource` VALUES (1, 358);
INSERT INTO `jurisdiction_resource` VALUES (3, 358);
INSERT INTO `jurisdiction_resource` VALUES (1, 359);
INSERT INTO `jurisdiction_resource` VALUES (3, 359);
INSERT INTO `jurisdiction_resource` VALUES (1, 360);
INSERT INTO `jurisdiction_resource` VALUES (3, 360);
INSERT INTO `jurisdiction_resource` VALUES (1, 361);
INSERT INTO `jurisdiction_resource` VALUES (3, 361);
INSERT INTO `jurisdiction_resource` VALUES (1, 362);
INSERT INTO `jurisdiction_resource` VALUES (3, 362);
INSERT INTO `jurisdiction_resource` VALUES (1, 363);
INSERT INTO `jurisdiction_resource` VALUES (1, 364);
INSERT INTO `jurisdiction_resource` VALUES (1, 365);
INSERT INTO `jurisdiction_resource` VALUES (1, 366);
INSERT INTO `jurisdiction_resource` VALUES (1, 367);
INSERT INTO `jurisdiction_resource` VALUES (1, 368);
INSERT INTO `jurisdiction_resource` VALUES (1, 369);
INSERT INTO `jurisdiction_resource` VALUES (1, 370);
INSERT INTO `jurisdiction_resource` VALUES (1, 371);
INSERT INTO `jurisdiction_resource` VALUES (1, 372);
INSERT INTO `jurisdiction_resource` VALUES (1, 373);
INSERT INTO `jurisdiction_resource` VALUES (1, 374);
INSERT INTO `jurisdiction_resource` VALUES (1, 375);
INSERT INTO `jurisdiction_resource` VALUES (1, 376);
INSERT INTO `jurisdiction_resource` VALUES (1, 377);
INSERT INTO `jurisdiction_resource` VALUES (1, 378);
INSERT INTO `jurisdiction_resource` VALUES (3, 378);
INSERT INTO `jurisdiction_resource` VALUES (1, 379);
INSERT INTO `jurisdiction_resource` VALUES (3, 379);
INSERT INTO `jurisdiction_resource` VALUES (1, 380);
INSERT INTO `jurisdiction_resource` VALUES (3, 380);
INSERT INTO `jurisdiction_resource` VALUES (1, 381);
INSERT INTO `jurisdiction_resource` VALUES (3, 381);
INSERT INTO `jurisdiction_resource` VALUES (1, 382);
INSERT INTO `jurisdiction_resource` VALUES (3, 382);
INSERT INTO `jurisdiction_resource` VALUES (1, 383);
INSERT INTO `jurisdiction_resource` VALUES (1, 384);
INSERT INTO `jurisdiction_resource` VALUES (1, 385);
INSERT INTO `jurisdiction_resource` VALUES (3, 385);
INSERT INTO `jurisdiction_resource` VALUES (1, 386);
INSERT INTO `jurisdiction_resource` VALUES (3, 386);
INSERT INTO `jurisdiction_resource` VALUES (1, 387);
INSERT INTO `jurisdiction_resource` VALUES (3, 387);
INSERT INTO `jurisdiction_resource` VALUES (1, 388);
INSERT INTO `jurisdiction_resource` VALUES (1, 389);
INSERT INTO `jurisdiction_resource` VALUES (1, 390);
INSERT INTO `jurisdiction_resource` VALUES (3, 390);
INSERT INTO `jurisdiction_resource` VALUES (1, 391);
INSERT INTO `jurisdiction_resource` VALUES (1, 392);
INSERT INTO `jurisdiction_resource` VALUES (1, 393);
INSERT INTO `jurisdiction_resource` VALUES (3, 393);
INSERT INTO `jurisdiction_resource` VALUES (1, 395);
INSERT INTO `jurisdiction_resource` VALUES (1, 396);
INSERT INTO `jurisdiction_resource` VALUES (3, 396);
INSERT INTO `jurisdiction_resource` VALUES (1, 397);
INSERT INTO `jurisdiction_resource` VALUES (3, 397);
INSERT INTO `jurisdiction_resource` VALUES (1, 398);
INSERT INTO `jurisdiction_resource` VALUES (3, 398);
INSERT INTO `jurisdiction_resource` VALUES (1, 399);
INSERT INTO `jurisdiction_resource` VALUES (1, 401);
INSERT INTO `jurisdiction_resource` VALUES (3, 401);
INSERT INTO `jurisdiction_resource` VALUES (1, 402);
INSERT INTO `jurisdiction_resource` VALUES (3, 402);

-- ----------------------------
-- Table structure for knowledge_point
-- ----------------------------
DROP TABLE IF EXISTS `knowledge_point`;
CREATE TABLE `knowledge_point`  (
  `kp_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `s_id` int(10) UNSIGNED DEFAULT NULL,
  `content` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`kp_id`) USING BTREE,
  INDEX `FK_Relationship_16`(`s_id`) USING BTREE,
  CONSTRAINT `FK_Relationship_16` FOREIGN KEY (`s_id`) REFERENCES `section` (`s_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for question_answer
-- ----------------------------
DROP TABLE IF EXISTS `question_answer`;
CREATE TABLE `question_answer`  (
  `qa_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `c_id` int(10) UNSIGNED DEFAULT NULL,
  `start_u_id` int(10) UNSIGNED DEFAULT NULL,
  `reply_u_id` int(10) UNSIGNED DEFAULT NULL,
  `is_closed` tinyint(4) DEFAULT 0,
  `is_new_question` tinyint(4) NOT NULL DEFAULT 0,
  `is_new_reply` tinyint(4) NOT NULL DEFAULT 0,
  `create_time` bigint(20) DEFAULT NULL,
  `last_update_time` bigint(20) DEFAULT NULL,
  `topic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`qa_id`) USING BTREE,
  INDEX `start_u_id_FK`(`start_u_id`) USING BTREE,
  INDEX `reply_u_id_fk`(`reply_u_id`) USING BTREE,
  INDEX `FK_Relationship_21`(`c_id`) USING BTREE,
  CONSTRAINT `FK_Relationship_21` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_Relationship_22` FOREIGN KEY (`start_u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_Relationship_23` FOREIGN KEY (`reply_u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for question_answer_detail
-- ----------------------------
DROP TABLE IF EXISTS `question_answer_detail`;
CREATE TABLE `question_answer_detail`  (
  `qad_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `u_id` int(10) UNSIGNED DEFAULT NULL,
  `qa_id` int(10) UNSIGNED DEFAULT NULL,
  `send_time` bigint(20) DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`qad_id`) USING BTREE,
  INDEX `send_time_index`(`send_time`) USING BTREE,
  INDEX `FK_Relationship_24`(`u_id`) USING BTREE,
  INDEX `FK_Relationship_25`(`qa_id`) USING BTREE,
  CONSTRAINT `FK_Relationship_24` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_Relationship_25` FOREIGN KEY (`qa_id`) REFERENCES `question_answer` (`qa_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for question_group
-- ----------------------------
DROP TABLE IF EXISTS `question_group`;
CREATE TABLE `question_group`  (
  `qg_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `c_id` int(10) UNSIGNED NOT NULL,
  `qg_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `difficulty` float NOT NULL COMMENT '根据作业题难度计算得出',
  `qg_type` tinyint(4) NOT NULL COMMENT '1:作业 2:考试',
  `score` smallint(6) NOT NULL DEFAULT 0,
  `is_random` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`qg_id`) USING BTREE,
  INDEX `FK_Relationship_11`(`c_id`) USING BTREE,
  CONSTRAINT `FK_Relationship_11` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of question_group
-- ----------------------------
INSERT INTO `question_group` VALUES (30, 7, 'adf', 3, 1, 20, 0);

-- ----------------------------
-- Table structure for question_knowledge
-- ----------------------------
DROP TABLE IF EXISTS `question_knowledge`;
CREATE TABLE `question_knowledge`  (
  `ql_id` int(10) UNSIGNED NOT NULL,
  `kp_id` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`ql_id`, `kp_id`) USING BTREE,
  INDEX `FK_kp_id`(`kp_id`) USING BTREE,
  CONSTRAINT `FK_kp_id` FOREIGN KEY (`kp_id`) REFERENCES `knowledge_point` (`kp_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ql_id` FOREIGN KEY (`ql_id`) REFERENCES `question_library` (`ql_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for question_library
-- ----------------------------
DROP TABLE IF EXISTS `question_library`;
CREATE TABLE `question_library`  (
  `ql_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `c_id` int(10) UNSIGNED DEFAULT NULL,
  `q_simple_description` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `q_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `is_exam` tinyint(4) NOT NULL,
  `q_range` tinyint(4) NOT NULL,
  `alternative_answer` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `answer` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `q_type` tinyint(4) NOT NULL COMMENT '1：单选题\r\n2：多选题\r\n3：填空题\r\n4：判断题',
  `count` int(11) NOT NULL DEFAULT 0,
  `right_count` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ql_id`) USING BTREE,
  INDEX `FK_Relationship_12`(`c_id`) USING BTREE,
  CONSTRAINT `FK_Relationship_12` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 109 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of question_library
-- ----------------------------
INSERT INTO `question_library` VALUES (108, 7, 'a+b', '<p>&nbsp;&nbsp;&nbsp;&nbsp;使用[blank_space]表示此处需要留空</p>', 0, 3, '\"\"', '[{\"input\":\"1 3\",\"output\":\"4\"},{\"input\":\"2 7\",\"output\":\"9\"}]', 4, 2, 2);

-- ----------------------------
-- Table structure for resource
-- ----------------------------
DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource`  (
  `r_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `url` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `method` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`r_id`) USING BTREE,
  UNIQUE INDEX `url_method_unique`(`url`, `method`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 403 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of resource
-- ----------------------------
INSERT INTO `resource` VALUES (321, '/announcement', 'GET', '');
INSERT INTO `resource` VALUES (322, '/course/:c_id/announcement/open', 'GET', '');
INSERT INTO `resource` VALUES (323, '/announcement/:a_id/content', 'GET', '');
INSERT INTO `resource` VALUES (324, '/announcement/:a_id/switch', 'PUT', '');
INSERT INTO `resource` VALUES (325, '/announcement', 'POST', '');
INSERT INTO `resource` VALUES (326, '/announcement/:a_id', 'DELETE', '');
INSERT INTO `resource` VALUES (327, '/user/:u_id/badge', 'GET', '');
INSERT INTO `resource` VALUES (328, '/user/:u_id/badge/:b_id', 'GET', '');
INSERT INTO `resource` VALUES (329, '/class/:class_id/user', 'GET', '');
INSERT INTO `resource` VALUES (330, '/class', 'POST', '');
INSERT INTO `resource` VALUES (331, '/class/:class_id/add_one_student', 'POST', '');
INSERT INTO `resource` VALUES (332, '/class/:class_id/add_many_student', 'POST', '');
INSERT INTO `resource` VALUES (333, '/class/:class_id/user/:u_id', 'DELETE', '');
INSERT INTO `resource` VALUES (334, '/class/:class_id', 'DELETE', '');
INSERT INTO `resource` VALUES (335, '/course', 'GET', '');
INSERT INTO `resource` VALUES (336, '/course/:c_id/statistics', 'GET', '');
INSERT INTO `resource` VALUES (337, '/course/:c_id/teacher', 'GET', '');
INSERT INTO `resource` VALUES (338, '/course/:c_id/top30', 'GET', '');
INSERT INTO `resource` VALUES (339, '/user/:u_id/course/:c_id/rank', 'GET', '');
INSERT INTO `resource` VALUES (340, '/user/:u_id/course', 'GET', '');
INSERT INTO `resource` VALUES (341, '/course/base_info', 'GET', '');
INSERT INTO `resource` VALUES (342, '/course/tree', 'GET', '');
INSERT INTO `resource` VALUES (343, '/course/:c_id/knowledge_point_tree', 'GET', '');
INSERT INTO `resource` VALUES (344, '/course', 'POST', '');
INSERT INTO `resource` VALUES (345, '/course/:c_id', 'PUT', '');
INSERT INTO `resource` VALUES (346, '/course/:c_id/base_info', 'PUT', '');
INSERT INTO `resource` VALUES (347, '/course/:c_id', 'DELETE', '');
INSERT INTO `resource` VALUES (348, '/course/:c_id/courseware', 'GET', '');
INSERT INTO `resource` VALUES (349, '/course/:c_id/courseware', 'POST', '');
INSERT INTO `resource` VALUES (350, '/course/:c_id/courseware/:cw_id', 'DELETE', '');
INSERT INTO `resource` VALUES (351, '/course/:c_id/grade', 'GET', '');
INSERT INTO `resource` VALUES (352, '/grade', 'POST', '');
INSERT INTO `resource` VALUES (353, '/grade/:g_id', 'DELETE', '');
INSERT INTO `resource` VALUES (354, '/course/:c_id/knowledge_point', 'GET', '');
INSERT INTO `resource` VALUES (355, '/user/:u_id/course/:c_id/knowledge_point/condition', 'GET', '');
INSERT INTO `resource` VALUES (356, '/knowledge_point', 'POST', '');
INSERT INTO `resource` VALUES (357, '/knowledge_point/:kp_id', 'DELETE', '');
INSERT INTO `resource` VALUES (358, '/question_answer', 'GET', '');
INSERT INTO `resource` VALUES (359, '/question_answer/:qa_id/detail', 'GET', '');
INSERT INTO `resource` VALUES (360, '/question_answer', 'POST', '');
INSERT INTO `resource` VALUES (361, '/question_answer/:qa_id/question_answer_detail', 'POST', '');
INSERT INTO `resource` VALUES (362, '/question_answer/:qa_id/close', 'PUT', '');
INSERT INTO `resource` VALUES (363, '/question_group', 'GET', '');
INSERT INTO `resource` VALUES (364, '/question_group/:qg_id/all_question', 'GET', '');
INSERT INTO `resource` VALUES (365, '/course/:c_id/question_group', 'POST', '');
INSERT INTO `resource` VALUES (366, '/course/:c_id/question_group/:qg_id', 'DELETE', '');
INSERT INTO `resource` VALUES (367, '/question_library', 'GET', '');
INSERT INTO `resource` VALUES (368, '/question_library/:ql_id/show_question', 'GET', '');
INSERT INTO `resource` VALUES (369, '/question_library', 'POST', '');
INSERT INTO `resource` VALUES (370, '/question_library/:ql_id', 'DELETE', '');
INSERT INTO `resource` VALUES (371, '/course/:c_id/question_library', 'DELETE', '');
INSERT INTO `resource` VALUES (372, '/course/:c_id/section', 'GET', '');
INSERT INTO `resource` VALUES (373, '/section', 'POST', '');
INSERT INTO `resource` VALUES (374, '/section/:s_id', 'DELETE', '');
INSERT INTO `resource` VALUES (375, '/test', 'GET', '');
INSERT INTO `resource` VALUES (376, '/test/statistics/test_num', 'GET', '');
INSERT INTO `resource` VALUES (377, '/test/:test_id/code_check', 'GET', '');
INSERT INTO `resource` VALUES (378, '/user/:u_id/course/:c_id/test', 'GET', '');
INSERT INTO `resource` VALUES (379, '/user/:u_id/course/:c_id/knowledge_test', 'GET', '');
INSERT INTO `resource` VALUES (380, '/user/:u_id/test/undo', 'GET', '');
INSERT INTO `resource` VALUES (381, '/user/:u_id/course/:c_id/test/:test_id/detail', 'GET', '');
INSERT INTO `resource` VALUES (382, '/user/:u_id/course/:c_id/test/:test_id/answer', 'GET', '');
INSERT INTO `resource` VALUES (383, '/test/:test_id/detail', 'GET', '');
INSERT INTO `resource` VALUES (384, '/test', 'POST', '');
INSERT INTO `resource` VALUES (385, '/user/:u_id/course/:c_id/test', 'POST', '');
INSERT INTO `resource` VALUES (386, '/user/:u_id/course/:c_id/test/:test_id/submit_answer', 'PUT', '');
INSERT INTO `resource` VALUES (387, '/user/:u_id/course/:c_id/test/:test_id/knowledge', 'DELETE', '');
INSERT INTO `resource` VALUES (388, '/course/:c_id/test/:test_id', 'DELETE', '');
INSERT INTO `resource` VALUES (389, '/user', 'GET', '');
INSERT INTO `resource` VALUES (390, '/user/:u_id', 'GET', '');
INSERT INTO `resource` VALUES (391, '/user/statistics/login_time', 'GET', '');
INSERT INTO `resource` VALUES (392, '/user/statistics/online', 'GET', '');
INSERT INTO `resource` VALUES (393, '/user/teachers/all', 'GET', '');
INSERT INTO `resource` VALUES (394, '/user/change_person_info', 'PUT', '');
INSERT INTO `resource` VALUES (395, '/user/:u_id/change_student_info', 'PUT', '');
INSERT INTO `resource` VALUES (396, '/user/change_simple_info', 'PUT', '');
INSERT INTO `resource` VALUES (397, '/user/change_email', 'PUT', '');
INSERT INTO `resource` VALUES (398, '/user/change_password', 'PUT', '');
INSERT INTO `resource` VALUES (399, '/user', 'POST', '');
INSERT INTO `resource` VALUES (400, '/user/:u_id', 'DELETE', '');
INSERT INTO `resource` VALUES (401, '/public/system_time', 'GET', NULL);
INSERT INTO `resource` VALUES (402, '/public/img_upload', 'POST', NULL);

-- ----------------------------
-- Table structure for section
-- ----------------------------
DROP TABLE IF EXISTS `section`;
CREATE TABLE `section`  (
  `s_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `c_id` int(10) UNSIGNED DEFAULT NULL,
  `s_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`s_id`) USING BTREE,
  UNIQUE INDEX `s_name_unique`(`c_id`, `s_name`) USING BTREE,
  CONSTRAINT `FK_Relationship_15` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for student_badge
-- ----------------------------
DROP TABLE IF EXISTS `student_badge`;
CREATE TABLE `student_badge`  (
  `u_id` int(10) UNSIGNED NOT NULL,
  `b_id` int(10) UNSIGNED NOT NULL,
  `get_time` bigint(20) NOT NULL,
  PRIMARY KEY (`u_id`, `b_id`) USING BTREE,
  INDEX `FK_student_badge2`(`b_id`) USING BTREE,
  CONSTRAINT `FK_student_badge` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_student_badge2` FOREIGN KEY (`b_id`) REFERENCES `badge` (`b_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of student_badge
-- ----------------------------
INSERT INTO `student_badge` VALUES (1, 2, 1528512739511);
INSERT INTO `student_badge` VALUES (1, 5, 1528512739516);
INSERT INTO `student_badge` VALUES (5, 2, 1526555967741);
INSERT INTO `student_badge` VALUES (5, 5, 1526189703839);
INSERT INTO `student_badge` VALUES (6, 5, 1526192311658);
INSERT INTO `student_badge` VALUES (7, 2, 1526974711918);
INSERT INTO `student_badge` VALUES (8, 5, 1526190187618);
INSERT INTO `student_badge` VALUES (10, 2, 1526193326948);
INSERT INTO `student_badge` VALUES (11, 2, 1526722048381);
INSERT INTO `student_badge` VALUES (21, 2, 1526722108710);
INSERT INTO `student_badge` VALUES (21, 7, 1528939941655);
INSERT INTO `student_badge` VALUES (22, 2, 1526722108711);
INSERT INTO `student_badge` VALUES (22, 5, 1528949738819);
INSERT INTO `student_badge` VALUES (23, 2, 1526722108710);
INSERT INTO `student_badge` VALUES (23, 5, 1526984354197);
INSERT INTO `student_badge` VALUES (24, 2, 1526722108737);
INSERT INTO `student_badge` VALUES (24, 5, 1526736503743);
INSERT INTO `student_badge` VALUES (25, 2, 1526722108789);
INSERT INTO `student_badge` VALUES (25, 7, 1526977293363);
INSERT INTO `student_badge` VALUES (26, 2, 1526722108791);
INSERT INTO `student_badge` VALUES (27, 2, 1526722108793);
INSERT INTO `student_badge` VALUES (27, 5, 1526977606120);
INSERT INTO `student_badge` VALUES (28, 2, 1526722108788);
INSERT INTO `student_badge` VALUES (28, 5, 1526818797525);
INSERT INTO `student_badge` VALUES (29, 2, 1526722108776);
INSERT INTO `student_badge` VALUES (29, 5, 1526977466326);
INSERT INTO `student_badge` VALUES (30, 2, 1526722108740);
INSERT INTO `student_badge` VALUES (30, 5, 1526818003677);
INSERT INTO `student_badge` VALUES (31, 2, 1526722229689);
INSERT INTO `student_badge` VALUES (31, 5, 1526790666021);
INSERT INTO `student_badge` VALUES (32, 2, 1526722229686);
INSERT INTO `student_badge` VALUES (32, 5, 1526981729810);
INSERT INTO `student_badge` VALUES (33, 2, 1526722229686);
INSERT INTO `student_badge` VALUES (33, 5, 1526983254775);
INSERT INTO `student_badge` VALUES (34, 2, 1526722229685);
INSERT INTO `student_badge` VALUES (35, 2, 1526722229698);
INSERT INTO `student_badge` VALUES (35, 5, 1526983068386);
INSERT INTO `student_badge` VALUES (36, 2, 1526722229743);
INSERT INTO `student_badge` VALUES (37, 2, 1526722229772);
INSERT INTO `student_badge` VALUES (38, 2, 1526722229771);
INSERT INTO `student_badge` VALUES (39, 2, 1526722229770);
INSERT INTO `student_badge` VALUES (40, 2, 1526722229719);

-- ----------------------------
-- Table structure for student_class
-- ----------------------------
DROP TABLE IF EXISTS `student_class`;
CREATE TABLE `student_class`  (
  `sc_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `u_id` int(10) UNSIGNED DEFAULT NULL,
  `class_id` int(10) UNSIGNED DEFAULT NULL,
  `coverage` float NOT NULL DEFAULT 0,
  `difficulty_1` int(11) DEFAULT 0,
  `difficulty_pass_1` int(11) DEFAULT 0,
  `difficulty_2` int(11) DEFAULT 0,
  `difficulty_pass_2` int(11) DEFAULT 0,
  `difficulty_3` int(11) DEFAULT 0,
  `difficulty_pass_3` int(11) DEFAULT 0,
  `difficulty_4` int(11) DEFAULT 0,
  `difficulty_pass_4` int(11) DEFAULT 0,
  `difficulty_5` int(11) DEFAULT 0,
  `difficulty_pass_5` int(11) DEFAULT 0,
  `evaluate` float NOT NULL DEFAULT 0,
  PRIMARY KEY (`sc_id`) USING BTREE,
  UNIQUE INDEX `class_id_u_id_unique`(`u_id`, `class_id`) USING BTREE,
  INDEX `FK_Relationship_18`(`class_id`) USING BTREE,
  CONSTRAINT `FK_Relationship_18` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_Relationship_19` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 35 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of student_class
-- ----------------------------
INSERT INTO `student_class` VALUES (33, 21, 9, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 1);
INSERT INTO `student_class` VALUES (34, 22, 9, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 1);

-- ----------------------------
-- Table structure for student_knowledge
-- ----------------------------
DROP TABLE IF EXISTS `student_knowledge`;
CREATE TABLE `student_knowledge`  (
  `sc_id` int(10) UNSIGNED NOT NULL,
  `kp_id` int(10) UNSIGNED NOT NULL,
  `count` int(11) DEFAULT 0,
  `right_count` int(11) DEFAULT 0,
  PRIMARY KEY (`sc_id`, `kp_id`) USING BTREE,
  INDEX `FK_student_knowledge2`(`kp_id`) USING BTREE,
  CONSTRAINT `FK_student_knowledge` FOREIGN KEY (`sc_id`) REFERENCES `student_class` (`sc_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_student_knowledge2` FOREIGN KEY (`kp_id`) REFERENCES `knowledge_point` (`kp_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for student_test
-- ----------------------------
DROP TABLE IF EXISTS `student_test`;
CREATE TABLE `student_test`  (
  `sc_id` int(10) UNSIGNED NOT NULL,
  `test_id` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `score` smallint(6) DEFAULT NULL,
  `start_time` bigint(20) DEFAULT NULL,
  `submit_time` bigint(20) NOT NULL DEFAULT 0,
  `qg_id` int(11) UNSIGNED DEFAULT NULL,
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `sum` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`sc_id`, `test_id`) USING BTREE,
  INDEX `FK_student_test2`(`test_id`) USING BTREE,
  INDEX `submit_time_index`(`submit_time`) USING BTREE,
  INDEX `FK_qg_id`(`qg_id`) USING BTREE,
  CONSTRAINT `FK_qg_id` FOREIGN KEY (`qg_id`) REFERENCES `question_group` (`qg_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_student_test` FOREIGN KEY (`sc_id`) REFERENCES `student_class` (`sc_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_student_test2` FOREIGN KEY (`test_id`) REFERENCES `test` (`test_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of student_test
-- ----------------------------
INSERT INTO `student_test` VALUES (33, 28, 20, 1528950495256, 1528950507410, 30, '{\"108\":[\"cpp\",\"#include <cstdio>\\n\\nint main() {\\n    int T_T, a, b;\\n\\n\\n        scanf(\\\"%d%d\\\", &a, &b);\\n        printf(\\\"%d\\\\n\\\", a+b);\\n\\n    return 0;\\n}\"]}', '{\"108\":1}');
INSERT INTO `student_test` VALUES (34, 28, 20, 1528950439678, 1528950470266, 30, '{\"108\":[\"cpp\",\"#include <cstdio>\\n\\nint main() {\\n    int T_T, a, b;\\n\\n\\n        scanf(\\\"%d%d\\\", &a, &b);\\n        printf(\\\"%d\\\\n\\\", a+b);\\n\\n    return 0;\\n}\"]}', '{\"108\":1}');

-- ----------------------------
-- Table structure for teacher_course
-- ----------------------------
DROP TABLE IF EXISTS `teacher_course`;
CREATE TABLE `teacher_course`  (
  `u_id` int(10) UNSIGNED NOT NULL,
  `c_id` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`u_id`, `c_id`) USING BTREE,
  INDEX `FK_Teacher_course2`(`c_id`) USING BTREE,
  CONSTRAINT `FK_Teacher_course` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_Teacher_course2` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teacher_course
-- ----------------------------
INSERT INTO `teacher_course` VALUES (1, 7);

-- ----------------------------
-- Table structure for test
-- ----------------------------
DROP TABLE IF EXISTS `test`;
CREATE TABLE `test`  (
  `test_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `role` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `c_id` int(10) UNSIGNED DEFAULT NULL,
  `qg_id` int(10) UNSIGNED DEFAULT NULL,
  `score` int(11) DEFAULT 0,
  `t_type` tinyint(4) DEFAULT NULL COMMENT '1:作业 2:考试\r\n',
  `start_time` bigint(20) DEFAULT NULL,
  `end_time` bigint(20) DEFAULT NULL,
  `work_time` smallint(6) DEFAULT NULL,
  `test_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_random` tinyint(4) DEFAULT NULL,
  `demand` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`test_id`) USING BTREE,
  INDEX `FK_c_id`(`c_id`) USING BTREE,
  INDEX `FK_Relationship_17`(`qg_id`) USING BTREE,
  CONSTRAINT `FK_Relationship_17` FOREIGN KEY (`qg_id`) REFERENCES `question_group` (`qg_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_c_id` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of test
-- ----------------------------
INSERT INTO `test` VALUES (28, NULL, 7, 30, 20, 1, 1528950426000, 1530160027000, 0, 'asd', 0, '');

-- ----------------------------
-- Table structure for test_class
-- ----------------------------
DROP TABLE IF EXISTS `test_class`;
CREATE TABLE `test_class`  (
  `test_id` int(10) UNSIGNED NOT NULL,
  `class_id` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`test_id`, `class_id`) USING BTREE,
  INDEX `FK_test_class2`(`class_id`) USING BTREE,
  CONSTRAINT `FK_test_class` FOREIGN KEY (`test_id`) REFERENCES `test` (`test_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_test_class2` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of test_class
-- ----------------------------
INSERT INTO `test_class` VALUES (28, 9);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `u_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `j_id` int(11) NOT NULL,
  `u_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `u_type` tinyint(4) DEFAULT NULL COMMENT '1：管理员 2：教师 3：助教 4：学生',
  `password` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email_addr` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_login_time` bigint(20) NOT NULL,
  `create_time` bigint(20) NOT NULL,
  `sex` tinyint(4) NOT NULL DEFAULT 2 COMMENT '0:男 1:女 2:未知',
  `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`u_id`) USING BTREE,
  UNIQUE INDEX `code_unique`(`code`) USING BTREE,
  INDEX `FK_Relationship_7`(`j_id`) USING BTREE,
  CONSTRAINT `FK_Relationship_7` FOREIGN KEY (`j_id`) REFERENCES `jurisdiction` (`j_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 43 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 0, '刘翔', 0, '123456', 'fanxb.tl@gmail.com', '1_4mejgon2x2.jpg', 1528950766171, 0, 0, '123456');
INSERT INTO `user` VALUES (2, 3, '张三', 3, '123456', '', 'default.jpg', 0, 1523068148944, 2, '12345678');
INSERT INTO `user` VALUES (3, 3, '阿斯顿发', 3, '123456', 'fxb@hnu.edu.cn', '3_mhiqz3ooxy.jpg', 1526620128446, 1523068248348, 1, '1234567');
INSERT INTO `user` VALUES (4, 3, 'a1', 3, '123456789', '', '4_8v5z1kvowx.jpg', 1525944855917, 1523068340200, 0, '123456789');
INSERT INTO `user` VALUES (5, 3, 'a3', 3, 's123456', '2728474645@qq.com', 'default.jpg', 1526705610904, 1523068340203, 2, 's123456');
INSERT INTO `user` VALUES (6, 3, 'a2', 3, 'sc123456', '', 'default.jpg', 1526213129732, 1523068340204, 2, 'sc123456');
INSERT INTO `user` VALUES (7, 3, '徽章测试', 3, '123456', '', 'default.jpg', 0, 1525227949607, 2, '201426010311');
INSERT INTO `user` VALUES (8, 3, 's2', 3, 'b123456', '', 'default.jpg', 1526190190191, 1526025014202, 2, 'b123456');
INSERT INTO `user` VALUES (9, 3, 'af', 2, 'asdf', 'asdf', 'asd', 12, 12, 1, 'sdfa');
INSERT INTO `user` VALUES (10, 3, 'asdf', 3, '123456', '', 'default.jpg', 0, 1526193326923, 2, 'asdfasdf');
INSERT INTO `user` VALUES (11, 3, '100001', 3, '123456', '啊手动阀手动阀', 'default.jpg', 0, 1526722048273, 2, '1号');
INSERT INTO `user` VALUES (21, 3, '100001', 3, '123456', 'asdfasdfasdf', '21_jqmvrucukf.jpg', 1528950746648, 1526722108493, 0, '100001');
INSERT INTO `user` VALUES (22, 3, '100002', 3, '123456', '', 'default.jpg', 1528950474928, 1526722108497, 2, '100002');
INSERT INTO `user` VALUES (23, 3, '100003', 3, '123456', '', 'default.jpg', 1526984353338, 1526722108498, 2, '100003');
INSERT INTO `user` VALUES (24, 3, '100004', 3, '123456', '', 'default.jpg', 1526972317383, 1526722108498, 2, '100004');
INSERT INTO `user` VALUES (25, 3, '100005', 3, '123456', '', 'default.jpg', 1526977286278, 1526722108498, 2, '100005');
INSERT INTO `user` VALUES (26, 3, '100006', 3, '123456', '', 'default.jpg', 0, 1526722108498, 2, '100006');
INSERT INTO `user` VALUES (27, 3, '100007', 3, '123456', '', 'default.jpg', 1526987463806, 1526722108498, 2, '100007');
INSERT INTO `user` VALUES (28, 3, '100008', 3, '123456', '', 'default.jpg', 1526978164532, 1526722108498, 2, '100008');
INSERT INTO `user` VALUES (29, 3, '100009', 3, '123456', '', 'default.jpg', 1526977563264, 1526722108499, 2, '100009');
INSERT INTO `user` VALUES (30, 3, '100010', 3, '123456', '', 'default.jpg', 1527339604163, 1526722108499, 2, '100010');
INSERT INTO `user` VALUES (31, 3, '200001', 3, '123456', '', 'default.jpg', 1526981646171, 1526722229484, 2, '200001');
INSERT INTO `user` VALUES (32, 3, '200002', 3, '123456', '', 'default.jpg', 1526982551199, 1526722229484, 2, '200002');
INSERT INTO `user` VALUES (33, 3, '200003', 3, '123456', '', 'default.jpg', 1526983869436, 1526722229484, 2, '200003');
INSERT INTO `user` VALUES (34, 3, '200004', 3, '123456', '', 'default.jpg', 0, 1526722229484, 2, '200004');
INSERT INTO `user` VALUES (35, 3, '200005', 3, '123456', '', 'default.jpg', 1526983076429, 1526722229484, 2, '200005');
INSERT INTO `user` VALUES (36, 3, '200006', 3, '123456', '', 'default.jpg', 0, 1526722229485, 2, '200006');
INSERT INTO `user` VALUES (37, 3, '200007', 3, '123456', '', 'default.jpg', 0, 1526722229485, 2, '200007');
INSERT INTO `user` VALUES (38, 3, '200008', 3, '123456', '', 'default.jpg', 0, 1526722229485, 2, '200008');
INSERT INTO `user` VALUES (39, 3, '200009', 3, '123456', '', 'default.jpg', 0, 1526722229488, 2, '200009');
INSERT INTO `user` VALUES (40, 3, '200010', 3, '123456', '', 'default.jpg', 0, 1526722229489, 2, '200010');
INSERT INTO `user` VALUES (42, 1, '教师1', 1, '123456', '', 'default.jpg', 0, 1526970799303, 2, 'a123456');

-- ----------------------------
-- View structure for judge_program_view
-- ----------------------------
DROP VIEW IF EXISTS `judge_program_view`;
CREATE ALGORITHM = UNDEFINED DEFINER = `manager`@`%` SQL SECURITY DEFINER VIEW `judge_program_view` AS select `a`.`sc_id` AS `sc_id`,`a`.`ql_id` AS `ql_id`,`a`.`test_id` AS `test_id`,`a`.`sum` AS `sum`,`a`.`score` AS `score`,`a`.`answer` AS `answer`,`c`.`u_id` AS `u_id`,`c`.`u_name` AS `u_name`,`d`.`q_simple_description` AS `q_simple_description`,`e`.`content` AS `class`,`f`.`content` AS `grade` from (((((`judge_program` `a` join `student_class` `b` on((`a`.`sc_id` = `b`.`sc_id`))) join `user` `c` on((`b`.`u_id` = `c`.`u_id`))) join `question_library` `d` on((`a`.`ql_id` = `d`.`ql_id`))) join `class` `e` on((`b`.`class_id` = `e`.`class_id`))) join `grade` `f` on((`e`.`g_id` = `f`.`g_id`))) ;

-- ----------------------------
-- View structure for question_answer_detail_view
-- ----------------------------
DROP VIEW IF EXISTS `question_answer_detail_view`;
CREATE ALGORITHM = UNDEFINED DEFINER = `manager`@`%` SQL SECURITY DEFINER VIEW `question_answer_detail_view` AS select `b`.`start_u_id` AS `start_u_id`,`b`.`reply_u_id` AS `reply_u_id`,`a`.`qa_id` AS `qa_id`,`a`.`qad_id` AS `qad_id`,`a`.`u_id` AS `u_id`,`a`.`content` AS `content`,`a`.`send_time` AS `send_time` from (`question_answer_detail` `a` join `question_answer` `b` on((`a`.`qa_id` = `b`.`qa_id`))) ;

-- ----------------------------
-- View structure for student_evaluate_view
-- ----------------------------
DROP VIEW IF EXISTS `student_evaluate_view`;
CREATE ALGORITHM = UNDEFINED DEFINER = `manager`@`%` SQL SECURITY DEFINER VIEW `student_evaluate_view` AS select `d`.`u_id` AS `u_id`,`d`.`u_name` AS `u_name`,`b`.`content` AS `class_name`,`a`.`content` AS `grade_name`,`c`.`evaluate` AS `evaluate`,`c`.`coverage` AS `coverage`,`c`.`sc_id` AS `sc_id`,`a`.`c_id` AS `c_id` from (((`grade` `a` join `class` `b` on((`a`.`g_id` = `b`.`g_id`))) join `student_class` `c` on((`b`.`class_id` = `c`.`class_id`))) join `user` `d` on((`c`.`u_id` = `d`.`u_id`))) ;

-- ----------------------------
-- View structure for student_knowledge_view
-- ----------------------------
DROP VIEW IF EXISTS `student_knowledge_view`;
CREATE ALGORITHM = UNDEFINED DEFINER = `manager`@`%` SQL SECURITY DEFINER VIEW `student_knowledge_view` AS select `a`.`c_id` AS `c_id`,`d`.`u_id` AS `u_id`,`c`.`kp_id` AS `kp_id`,`c`.`count` AS `count`,`c`.`right_count` AS `right_count` from (((`section` `a` join `knowledge_point` `b` on((`a`.`s_id` = `b`.`s_id`))) join `student_knowledge` `c` on((`b`.`kp_id` = `c`.`kp_id`))) join `student_class` `d` on((`d`.`sc_id` = `c`.`sc_id`))) ;

-- ----------------------------
-- View structure for student_test_view
-- ----------------------------
DROP VIEW IF EXISTS `student_test_view`;
CREATE ALGORITHM = UNDEFINED DEFINER = `manager`@`%` SQL SECURITY DEFINER VIEW `student_test_view` AS select `a`.`u_id` AS `u_id`,`a`.`u_name` AS `u_name`,`a`.`code` AS `code`,`g`.`content` AS `grade`,`f`.`content` AS `class`,`f`.`class_id` AS `class_id`,`c`.`sc_id` AS `sc_id`,`d`.`c_id` AS `c_id`,`d`.`test_id` AS `test_id`,`c`.`qg_id` AS `qg_id`,`c`.`score` AS `score`,`c`.`start_time` AS `start_do_time`,`c`.`submit_time` AS `submit_time`,`c`.`sum` AS `sum`,`c`.`answer` AS `answer`,`d`.`start_time` AS `start_time`,`d`.`end_time` AS `end_time`,`d`.`work_time` AS `work_time`,`d`.`test_name` AS `test_name`,`d`.`role` AS `role`,`d`.`t_type` AS `t_type`,`d`.`demand` AS `demand`,`e`.`c_name` AS `c_name` from ((((((`user` `a` join `student_class` `b` on((`a`.`u_id` = `b`.`u_id`))) join `student_test` `c` on((`b`.`sc_id` = `c`.`sc_id`))) join `test` `d` on((`c`.`test_id` = `d`.`test_id`))) join `course` `e` on((`d`.`c_id` = `e`.`c_id`))) join `class` `f` on((`f`.`class_id` = `b`.`class_id`))) join `grade` `g` on((`f`.`g_id` = `g`.`g_id`))) ;

-- ----------------------------
-- View structure for user_question_answer_view
-- ----------------------------
DROP VIEW IF EXISTS `user_question_answer_view`;
CREATE ALGORITHM = UNDEFINED DEFINER = `manager`@`%` SQL SECURITY DEFINER VIEW `user_question_answer_view` AS select `a`.`qa_id` AS `qa_id`,`a`.`c_id` AS `c_id`,`a`.`start_u_id` AS `start_u_id`,`b`.`u_name` AS `start_u_name`,`a`.`reply_u_id` AS `reply_u_id`,`c`.`u_name` AS `reply_u_name`,`a`.`is_new_question` AS `is_new_question`,`a`.`is_new_reply` AS `is_new_reply`,`a`.`topic` AS `topic`,`a`.`is_closed` AS `is_closed`,`a`.`last_update_time` AS `last_update_time` from ((`question_answer` `a` join `user` `b` on((`a`.`start_u_id` = `b`.`u_id`))) join `user` `c` on((`a`.`reply_u_id` = `c`.`u_id`))) ;

SET FOREIGN_KEY_CHECKS = 1;
