/*
Navicat MySQL Data Transfer

Source Server         : 虚拟机mysql
Source Server Version : 50722
Source Host           : 192.168.189.132:3306
Source Database       : teach_system

Target Server Type    : MYSQL
Target Server Version : 50722
File Encoding         : 65001

Date: 2018-06-14 09:57:11
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for announcement
-- ----------------------------
DROP TABLE IF EXISTS `announcement`;
CREATE TABLE `announcement` (
  `a_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `c_id` int(10) unsigned DEFAULT NULL,
  `topic` varchar(256) NOT NULL,
  `content` text NOT NULL,
  `start_time` bigint(20) NOT NULL,
  `end_time` bigint(20) NOT NULL,
  PRIMARY KEY (`a_id`),
  KEY `FK_Relationship_3` (`c_id`),
  CONSTRAINT `FK_Relationship_3` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for badge
-- ----------------------------
DROP TABLE IF EXISTS `badge`;
CREATE TABLE `badge` (
  `b_id` int(10) unsigned NOT NULL,
  `b_name` varchar(20) DEFAULT NULL,
  `b_img` varchar(30) NOT NULL,
  `get_condition` varchar(1024) NOT NULL,
  `next_level` int(11) DEFAULT NULL,
  `b_type` tinyint(4) NOT NULL,
  PRIMARY KEY (`b_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for class
-- ----------------------------
DROP TABLE IF EXISTS `class`;
CREATE TABLE `class` (
  `class_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `g_id` int(10) unsigned DEFAULT NULL,
  `content` varchar(50) NOT NULL,
  PRIMARY KEY (`class_id`),
  UNIQUE KEY `content_unique` (`content`,`g_id`),
  KEY `FK_Relationship_13` (`g_id`),
  CONSTRAINT `FK_Relationship_13` FOREIGN KEY (`g_id`) REFERENCES `grade` (`g_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for course
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `c_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `c_name` varchar(100) NOT NULL,
  `c_picture` varchar(100) NOT NULL,
  `c_intro` text NOT NULL,
  `teacher_intro` text NOT NULL,
  `first_course` text NOT NULL,
  `teach_plan` text NOT NULL,
  `exam_type` text NOT NULL,
  `reference_book` text NOT NULL,
  `update_time` bigint(20) NOT NULL,
  `create_time` bigint(20) NOT NULL,
  PRIMARY KEY (`c_id`),
  UNIQUE KEY `code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for courseware
-- ----------------------------
DROP TABLE IF EXISTS `courseware`;
CREATE TABLE `courseware` (
  `cw_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `c_id` int(10) unsigned DEFAULT NULL,
  `cw_name` varchar(30) NOT NULL,
  `create_time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`cw_id`),
  UNIQUE KEY `name_c_id_unique` (`c_id`,`cw_name`),
  CONSTRAINT `FK_Relationship_1` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for grade
-- ----------------------------
DROP TABLE IF EXISTS `grade`;
CREATE TABLE `grade` (
  `g_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `c_id` int(10) unsigned DEFAULT NULL,
  `content` varchar(50) NOT NULL,
  PRIMARY KEY (`g_id`),
  UNIQUE KEY `content_unique` (`content`,`g_id`),
  KEY `FK_Relationship_14` (`c_id`),
  CONSTRAINT `FK_Relationship_14` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for group_question
-- ----------------------------
DROP TABLE IF EXISTS `group_question`;
CREATE TABLE `group_question` (
  `qg_id` int(10) unsigned NOT NULL,
  `ql_id` int(10) unsigned NOT NULL,
  `score` smallint(6) NOT NULL,
  PRIMARY KEY (`qg_id`,`ql_id`),
  KEY `FK_Group_question2` (`ql_id`),
  CONSTRAINT `FK_Group_question` FOREIGN KEY (`qg_id`) REFERENCES `question_group` (`qg_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_Group_question2` FOREIGN KEY (`ql_id`) REFERENCES `question_library` (`ql_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for judge_program
-- ----------------------------
DROP TABLE IF EXISTS `judge_program`;
CREATE TABLE `judge_program` (
  `sc_id` int(10) unsigned NOT NULL,
  `ql_id` int(10) unsigned NOT NULL,
  `test_id` int(10) unsigned NOT NULL,
  `sum` text NOT NULL,
  `score` smallint(6) NOT NULL,
  `answer` text,
  PRIMARY KEY (`sc_id`,`ql_id`,`test_id`),
  KEY `FK_Judge_program2` (`ql_id`),
  KEY `FK_Judge_program3` (`test_id`),
  CONSTRAINT `FK_Judge_program` FOREIGN KEY (`sc_id`) REFERENCES `student_class` (`sc_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_Judge_program2` FOREIGN KEY (`ql_id`) REFERENCES `question_library` (`ql_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_Judge_program3` FOREIGN KEY (`test_id`) REFERENCES `test` (`test_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for jurisdiction
-- ----------------------------
DROP TABLE IF EXISTS `jurisdiction`;
CREATE TABLE `jurisdiction` (
  `j_id` int(10) NOT NULL AUTO_INCREMENT,
  `content` varchar(256) NOT NULL,
  PRIMARY KEY (`j_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for jurisdiction_resource
-- ----------------------------
DROP TABLE IF EXISTS `jurisdiction_resource`;
CREATE TABLE `jurisdiction_resource` (
  `j_id` int(10) NOT NULL,
  `r_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`j_id`,`r_id`),
  KEY `FK_Jurisdiction_resource2` (`r_id`),
  CONSTRAINT `FK_Jurisdiction_resource2` FOREIGN KEY (`r_id`) REFERENCES `resource` (`r_id`),
  CONSTRAINT `FK_j_id` FOREIGN KEY (`j_id`) REFERENCES `jurisdiction` (`j_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for knowledge_point
-- ----------------------------
DROP TABLE IF EXISTS `knowledge_point`;
CREATE TABLE `knowledge_point` (
  `kp_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `s_id` int(10) unsigned DEFAULT NULL,
  `content` varchar(256) NOT NULL,
  PRIMARY KEY (`kp_id`),
  KEY `FK_Relationship_16` (`s_id`),
  CONSTRAINT `FK_Relationship_16` FOREIGN KEY (`s_id`) REFERENCES `section` (`s_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for question_answer
-- ----------------------------
DROP TABLE IF EXISTS `question_answer`;
CREATE TABLE `question_answer` (
  `qa_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `c_id` int(10) unsigned DEFAULT NULL,
  `start_u_id` int(10) unsigned DEFAULT NULL,
  `reply_u_id` int(10) unsigned DEFAULT NULL,
  `is_closed` tinyint(4) DEFAULT '0',
  `is_new_question` tinyint(4) NOT NULL DEFAULT '0',
  `is_new_reply` tinyint(4) NOT NULL DEFAULT '0',
  `create_time` bigint(20) DEFAULT NULL,
  `last_update_time` bigint(20) DEFAULT NULL,
  `topic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`qa_id`),
  KEY `start_u_id_FK` (`start_u_id`),
  KEY `reply_u_id_fk` (`reply_u_id`),
  KEY `FK_Relationship_21` (`c_id`),
  CONSTRAINT `FK_Relationship_21` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_Relationship_22` FOREIGN KEY (`start_u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_Relationship_23` FOREIGN KEY (`reply_u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for question_answer_detail
-- ----------------------------
DROP TABLE IF EXISTS `question_answer_detail`;
CREATE TABLE `question_answer_detail` (
  `qad_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `u_id` int(10) unsigned DEFAULT NULL,
  `qa_id` int(10) unsigned DEFAULT NULL,
  `send_time` bigint(20) DEFAULT NULL,
  `content` text,
  PRIMARY KEY (`qad_id`),
  KEY `send_time_index` (`send_time`),
  KEY `FK_Relationship_24` (`u_id`),
  KEY `FK_Relationship_25` (`qa_id`),
  CONSTRAINT `FK_Relationship_24` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_Relationship_25` FOREIGN KEY (`qa_id`) REFERENCES `question_answer` (`qa_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for question_group
-- ----------------------------
DROP TABLE IF EXISTS `question_group`;
CREATE TABLE `question_group` (
  `qg_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `c_id` int(10) unsigned NOT NULL,
  `qg_name` varchar(256) NOT NULL,
  `difficulty` float NOT NULL COMMENT '根据作业题难度计算得出',
  `qg_type` tinyint(4) NOT NULL COMMENT '1:作业 2:考试',
  `score` smallint(6) NOT NULL DEFAULT '0',
  `is_random` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`qg_id`),
  KEY `FK_Relationship_11` (`c_id`),
  CONSTRAINT `FK_Relationship_11` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for question_knowledge
-- ----------------------------
DROP TABLE IF EXISTS `question_knowledge`;
CREATE TABLE `question_knowledge` (
  `ql_id` int(10) unsigned NOT NULL,
  `kp_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ql_id`,`kp_id`),
  KEY `FK_kp_id` (`kp_id`),
  CONSTRAINT `FK_kp_id` FOREIGN KEY (`kp_id`) REFERENCES `knowledge_point` (`kp_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ql_id` FOREIGN KEY (`ql_id`) REFERENCES `question_library` (`ql_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for question_library
-- ----------------------------
DROP TABLE IF EXISTS `question_library`;
CREATE TABLE `question_library` (
  `ql_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `c_id` int(10) unsigned DEFAULT NULL,
  `q_simple_description` varchar(1024) NOT NULL,
  `q_description` text NOT NULL,
  `is_exam` tinyint(4) NOT NULL,
  `q_range` tinyint(4) NOT NULL,
  `alternative_answer` varchar(4096) NOT NULL,
  `answer` varchar(4096) NOT NULL,
  `q_type` tinyint(4) NOT NULL COMMENT '1：单选题\r\n2：多选题\r\n3：填空题\r\n4：判断题',
  `count` int(11) NOT NULL DEFAULT '0',
  `right_count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ql_id`),
  KEY `FK_Relationship_12` (`c_id`) USING BTREE,
  CONSTRAINT `FK_Relationship_12` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for resource
-- ----------------------------
DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource` (
  `r_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(100) NOT NULL,
  `method` varchar(10) NOT NULL,
  `description` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`r_id`),
  UNIQUE KEY `url_method_unique` (`url`,`method`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=403 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for section
-- ----------------------------
DROP TABLE IF EXISTS `section`;
CREATE TABLE `section` (
  `s_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `c_id` int(10) unsigned DEFAULT NULL,
  `s_name` varchar(20) NOT NULL,
  PRIMARY KEY (`s_id`),
  UNIQUE KEY `s_name_unique` (`c_id`,`s_name`),
  CONSTRAINT `FK_Relationship_15` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for student_badge
-- ----------------------------
DROP TABLE IF EXISTS `student_badge`;
CREATE TABLE `student_badge` (
  `u_id` int(10) unsigned NOT NULL,
  `b_id` int(10) unsigned NOT NULL,
  `get_time` bigint(20) NOT NULL,
  PRIMARY KEY (`u_id`,`b_id`),
  KEY `FK_student_badge2` (`b_id`),
  CONSTRAINT `FK_student_badge` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`),
  CONSTRAINT `FK_student_badge2` FOREIGN KEY (`b_id`) REFERENCES `badge` (`b_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for student_class
-- ----------------------------
DROP TABLE IF EXISTS `student_class`;
CREATE TABLE `student_class` (
  `sc_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `u_id` int(10) unsigned DEFAULT NULL,
  `class_id` int(10) unsigned DEFAULT NULL,
  `coverage` float NOT NULL DEFAULT '0',
  `difficulty_1` int(11) DEFAULT '0',
  `difficulty_pass_1` int(11) DEFAULT '0',
  `difficulty_2` int(11) DEFAULT '0',
  `difficulty_pass_2` int(11) DEFAULT '0',
  `difficulty_3` int(11) DEFAULT '0',
  `difficulty_pass_3` int(11) DEFAULT '0',
  `difficulty_4` int(11) DEFAULT '0',
  `difficulty_pass_4` int(11) DEFAULT '0',
  `difficulty_5` int(11) DEFAULT '0',
  `difficulty_pass_5` int(11) DEFAULT '0',
  `evaluate` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`sc_id`),
  UNIQUE KEY `class_id_u_id_unique` (`u_id`,`class_id`) USING BTREE,
  KEY `FK_Relationship_18` (`class_id`),
  CONSTRAINT `FK_Relationship_18` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_Relationship_19` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for student_knowledge
-- ----------------------------
DROP TABLE IF EXISTS `student_knowledge`;
CREATE TABLE `student_knowledge` (
  `sc_id` int(10) unsigned NOT NULL,
  `kp_id` int(10) unsigned NOT NULL,
  `count` int(11) DEFAULT '0',
  `right_count` int(11) DEFAULT '0',
  PRIMARY KEY (`sc_id`,`kp_id`),
  KEY `FK_student_knowledge2` (`kp_id`),
  CONSTRAINT `FK_student_knowledge` FOREIGN KEY (`sc_id`) REFERENCES `student_class` (`sc_id`),
  CONSTRAINT `FK_student_knowledge2` FOREIGN KEY (`kp_id`) REFERENCES `knowledge_point` (`kp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for student_test
-- ----------------------------
DROP TABLE IF EXISTS `student_test`;
CREATE TABLE `student_test` (
  `sc_id` int(10) unsigned NOT NULL,
  `test_id` int(10) unsigned NOT NULL DEFAULT '0',
  `score` smallint(6) DEFAULT NULL,
  `start_time` bigint(20) DEFAULT NULL,
  `submit_time` bigint(20) NOT NULL DEFAULT '0',
  `qg_id` int(11) unsigned DEFAULT NULL,
  `answer` text,
  `sum` text,
  PRIMARY KEY (`sc_id`,`test_id`),
  KEY `FK_student_test2` (`test_id`),
  KEY `submit_time_index` (`submit_time`),
  KEY `FK_qg_id` (`qg_id`),
  CONSTRAINT `FK_qg_id` FOREIGN KEY (`qg_id`) REFERENCES `question_group` (`qg_id`),
  CONSTRAINT `FK_student_test` FOREIGN KEY (`sc_id`) REFERENCES `student_class` (`sc_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_student_test2` FOREIGN KEY (`test_id`) REFERENCES `test` (`test_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for teacher_course
-- ----------------------------
DROP TABLE IF EXISTS `teacher_course`;
CREATE TABLE `teacher_course` (
  `u_id` int(10) unsigned NOT NULL,
  `c_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`u_id`,`c_id`),
  KEY `FK_Teacher_course2` (`c_id`),
  CONSTRAINT `FK_Teacher_course` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_Teacher_course2` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for test
-- ----------------------------
DROP TABLE IF EXISTS `test`;
CREATE TABLE `test` (
  `test_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `role` text,
  `c_id` int(10) unsigned DEFAULT NULL,
  `qg_id` int(10) unsigned DEFAULT NULL,
  `score` int(11) DEFAULT '0',
  `t_type` tinyint(4) DEFAULT NULL COMMENT '1:作业 2:考试\r\n',
  `start_time` bigint(20) DEFAULT NULL,
  `end_time` bigint(20) DEFAULT NULL,
  `work_time` smallint(6) DEFAULT NULL,
  `test_name` varchar(255) DEFAULT NULL,
  `is_random` tinyint(4) DEFAULT NULL,
  `demand` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`test_id`),
  KEY `FK_c_id` (`c_id`),
  KEY `FK_Relationship_17` (`qg_id`),
  CONSTRAINT `FK_Relationship_17` FOREIGN KEY (`qg_id`) REFERENCES `question_group` (`qg_id`),
  CONSTRAINT `FK_c_id` FOREIGN KEY (`c_id`) REFERENCES `course` (`c_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for test_class
-- ----------------------------
DROP TABLE IF EXISTS `test_class`;
CREATE TABLE `test_class` (
  `test_id` int(10) unsigned NOT NULL,
  `class_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`test_id`,`class_id`),
  KEY `FK_test_class2` (`class_id`),
  CONSTRAINT `FK_test_class` FOREIGN KEY (`test_id`) REFERENCES `test` (`test_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_test_class2` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `u_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `j_id` int(11) NOT NULL,
  `u_name` varchar(50) NOT NULL,
  `u_type` tinyint(4) DEFAULT NULL COMMENT '1：管理员 2：教师 3：助教 4：学生',
  `password` varchar(20) NOT NULL,
  `email_addr` varchar(50) NOT NULL,
  `icon` varchar(50) NOT NULL,
  `last_login_time` bigint(20) NOT NULL,
  `create_time` bigint(20) NOT NULL,
  `sex` tinyint(4) NOT NULL DEFAULT '2' COMMENT '0:男 1:女 2:未知',
  `code` varchar(20) NOT NULL,
  PRIMARY KEY (`u_id`),
  UNIQUE KEY `code_unique` (`code`),
  KEY `FK_Relationship_7` (`j_id`),
  CONSTRAINT `FK_Relationship_7` FOREIGN KEY (`j_id`) REFERENCES `jurisdiction` (`j_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- View structure for judge_program_view
-- ----------------------------
DROP VIEW IF EXISTS `judge_program_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`manager`@`%` SQL SECURITY DEFINER VIEW `judge_program_view` AS select `a`.`sc_id` AS `sc_id`,`a`.`ql_id` AS `ql_id`,`a`.`test_id` AS `test_id`,`a`.`sum` AS `sum`,`a`.`score` AS `score`,`a`.`answer` AS `answer`,`c`.`u_id` AS `u_id`,`c`.`u_name` AS `u_name`,`d`.`q_simple_description` AS `q_simple_description`,`e`.`content` AS `class`,`f`.`content` AS `grade` from (((((`judge_program` `a` join `student_class` `b` on((`a`.`sc_id` = `b`.`sc_id`))) join `user` `c` on((`b`.`u_id` = `c`.`u_id`))) join `question_library` `d` on((`a`.`ql_id` = `d`.`ql_id`))) join `class` `e` on((`b`.`class_id` = `e`.`class_id`))) join `grade` `f` on((`e`.`g_id` = `f`.`g_id`))) ;

-- ----------------------------
-- View structure for question_answer_detail_view
-- ----------------------------
DROP VIEW IF EXISTS `question_answer_detail_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`manager`@`%` SQL SECURITY DEFINER VIEW `question_answer_detail_view` AS select `b`.`start_u_id` AS `start_u_id`,`b`.`reply_u_id` AS `reply_u_id`,`a`.`qa_id` AS `qa_id`,`a`.`qad_id` AS `qad_id`,`a`.`u_id` AS `u_id`,`a`.`content` AS `content`,`a`.`send_time` AS `send_time` from (`question_answer_detail` `a` join `question_answer` `b` on((`a`.`qa_id` = `b`.`qa_id`))) ;

-- ----------------------------
-- View structure for student_evaluate_view
-- ----------------------------
DROP VIEW IF EXISTS `student_evaluate_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`manager`@`%` SQL SECURITY DEFINER VIEW `student_evaluate_view` AS select `d`.`u_id` AS `u_id`,`d`.`u_name` AS `u_name`,`b`.`content` AS `class_name`,`a`.`content` AS `grade_name`,`c`.`evaluate` AS `evaluate`,`c`.`coverage` AS `coverage`,`c`.`sc_id` AS `sc_id`,`a`.`c_id` AS `c_id` from (((`grade` `a` join `class` `b` on((`a`.`g_id` = `b`.`g_id`))) join `student_class` `c` on((`b`.`class_id` = `c`.`class_id`))) join `user` `d` on((`c`.`u_id` = `d`.`u_id`))) ;

-- ----------------------------
-- View structure for student_knowledge_view
-- ----------------------------
DROP VIEW IF EXISTS `student_knowledge_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`manager`@`%` SQL SECURITY DEFINER VIEW `student_knowledge_view` AS select `a`.`c_id` AS `c_id`,`d`.`u_id` AS `u_id`,`c`.`kp_id` AS `kp_id`,`c`.`count` AS `count`,`c`.`right_count` AS `right_count` from (((`section` `a` join `knowledge_point` `b` on((`a`.`s_id` = `b`.`s_id`))) join `student_knowledge` `c` on((`b`.`kp_id` = `c`.`kp_id`))) join `student_class` `d` on((`d`.`sc_id` = `c`.`sc_id`))) ;

-- ----------------------------
-- View structure for student_test_view
-- ----------------------------
DROP VIEW IF EXISTS `student_test_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`manager`@`%` SQL SECURITY DEFINER VIEW `student_test_view` AS select `a`.`u_id` AS `u_id`,`a`.`u_name` AS `u_name`,`a`.`code` AS `code`,`g`.`content` AS `grade`,`f`.`content` AS `class`,`f`.`class_id` AS `class_id`,`c`.`sc_id` AS `sc_id`,`d`.`c_id` AS `c_id`,`d`.`test_id` AS `test_id`,`c`.`qg_id` AS `qg_id`,`c`.`score` AS `score`,`c`.`start_time` AS `start_do_time`,`c`.`submit_time` AS `submit_time`,`c`.`sum` AS `sum`,`c`.`answer` AS `answer`,`d`.`start_time` AS `start_time`,`d`.`end_time` AS `end_time`,`d`.`work_time` AS `work_time`,`d`.`test_name` AS `test_name`,`d`.`role` AS `role`,`d`.`t_type` AS `t_type`,`d`.`demand` AS `demand`,`e`.`c_name` AS `c_name` from ((((((`user` `a` join `student_class` `b` on((`a`.`u_id` = `b`.`u_id`))) join `student_test` `c` on((`b`.`sc_id` = `c`.`sc_id`))) join `test` `d` on((`c`.`test_id` = `d`.`test_id`))) join `course` `e` on((`d`.`c_id` = `e`.`c_id`))) join `class` `f` on((`f`.`class_id` = `b`.`class_id`))) join `grade` `g` on((`f`.`g_id` = `g`.`g_id`))) ;

-- ----------------------------
-- View structure for user_question_answer_view
-- ----------------------------
DROP VIEW IF EXISTS `user_question_answer_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`manager`@`%` SQL SECURITY DEFINER VIEW `user_question_answer_view` AS select `a`.`qa_id` AS `qa_id`,`a`.`c_id` AS `c_id`,`a`.`start_u_id` AS `start_u_id`,`b`.`u_name` AS `start_u_name`,`a`.`reply_u_id` AS `reply_u_id`,`c`.`u_name` AS `reply_u_name`,`a`.`is_new_question` AS `is_new_question`,`a`.`is_new_reply` AS `is_new_reply`,`a`.`topic` AS `topic`,`a`.`is_closed` AS `is_closed`,`a`.`last_update_time` AS `last_update_time` from ((`question_answer` `a` join `user` `b` on((`a`.`start_u_id` = `b`.`u_id`))) join `user` `c` on((`a`.`reply_u_id` = `c`.`u_id`))) ;
