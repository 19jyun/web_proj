-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: blackboard
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `idx` int NOT NULL AUTO_INCREMENT,
  `lecture_id` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `maintext` text NOT NULL,
  `regdate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idx`),
  KEY `lecture_idx` (`lecture_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES (7,'COSE461-00','첫 테스트 게시물','<p>안녕하세요.&nbsp;<strong>제대로 되는지&nbsp;<em>테스트를 해보자!</em></strong></p>\r\n','2024-09-02 18:45:02'),(8,'COSE001-00','두번째 게시물. 시간대로 스트림에 업데이트 되는지 확인해보자','<p>테스트.</p>\r\n','2024-09-02 18:45:38'),(9,'COSE002-00','얘도 테스트!','<p>안녕하세요. 세번째 게시물입니다.</p>\r\n','2024-09-02 18:45:53'),(11,'COSE100-01','마지막 게시물','<p>ㄴㅇㄻㄴㅇ</p>\r\n','2024-09-02 19:10:35');
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lectures`
--

DROP TABLE IF EXISTS `lectures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lectures` (
  `idx` int NOT NULL AUTO_INCREMENT,
  `lecture_id` varchar(255) NOT NULL,
  `lecture_name` varchar(255) NOT NULL,
  `professor_id` varchar(255) DEFAULT NULL,
  `max_num` int NOT NULL,
  `cur_num` int NOT NULL,
  PRIMARY KEY (`idx`),
  UNIQUE KEY `lecture_id` (`lecture_id`),
  KEY `professor_id` (`professor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lectures`
--

LOCK TABLES `lectures` WRITE;
/*!40000 ALTER TABLE `lectures` DISABLE KEYS */;
INSERT INTO `lectures` VALUES (6,'COSE001-00','이름이특이하군','as',5,3),(7,'COSE002-00','이것도특이하군','as',2,0),(8,'COSE100-01','테스트수업1','asd',10,2),(9,'COSE461-00','수업1','asdf',1,1);
/*!40000 ALTER TABLE `lectures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `idx` int NOT NULL AUTO_INCREMENT,
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `studentnum` varchar(255) DEFAULT NULL,
  `identity` enum('student','teacher') NOT NULL,
  PRIMARY KEY (`idx`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (7,'qw','qw','$2b$10$mS17HNe738xtLsIJKcsg6OQmUrDCOK1qkamYJAITiJIpXAAcRNvWq','12','student'),(8,'qwe','qwe','$2b$10$BsyVhXfNJVfERsKTGaP0keXsvAdFZ9JH5U0muSNCddRUfNJtolW4W','123','student'),(9,'qwer','qwer','$2b$10$mRW5Y3bK2V3vGFMNQrYjGOPrqQnysqm8GDiq0IijGVKxTRXz.drva','1234','student'),(10,'as','as','$2b$10$FdgertIXAwqOTA6NElnp6u7h7GFKNT.ebztKn/ZUf71hOGVAhS/f6','12345','teacher'),(11,'asd','asd','$2b$10$92Gt5x4sJFThAfC5KPU79eOQfOcTkPXvOWlE/x7LLBsx1Me4Qhk4m','12345','teacher'),(12,'asdf','asdf','$2b$10$gZ6KR5zL0T7UyAWJuPzf1u9ctP3RDtIPwFAUsdBgg4LSJO459iJ4.','1234','teacher');
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_lecture`
--

DROP TABLE IF EXISTS `student_lecture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_lecture` (
  `idx` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(255) DEFAULT NULL,
  `lecture_id` varchar(255) DEFAULT NULL,
  `lecture_name` varchar(255) NOT NULL,
  PRIMARY KEY (`idx`),
  KEY `student_lecture_ibfk_1` (`student_id`),
  KEY `student_lecture_ibfk_2` (`lecture_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_lecture`
--

LOCK TABLES `student_lecture` WRITE;
/*!40000 ALTER TABLE `student_lecture` DISABLE KEYS */;
INSERT INTO `student_lecture` VALUES (8,'qw','COSE001-00','이름이특이하군'),(9,'qwe','COSE001-00','이름이특이하군'),(10,'qwe','COSE002-00','이것도특이하군'),(11,'qwe','COSE100-01','테스트수업1'),(12,'qwer','COSE001-00','이름이특이하군'),(13,'qwer','COSE100-01','테스트수업1'),(14,'qw','COSE461-00','수업1'),(16,'qw','COSE002-00','이것도특이하군'),(17,'qw','COSE100-01','테스트수업1');
/*!40000 ALTER TABLE `student_lecture` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-02 19:11:57
