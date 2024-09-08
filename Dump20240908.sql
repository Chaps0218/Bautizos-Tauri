-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: bautizos_arcadia
-- ------------------------------------------------------
-- Server version	8.0.37

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
-- Table structure for table `bautizado`
--

DROP TABLE IF EXISTS `bautizado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bautizado` (
  `bau_id` int NOT NULL AUTO_INCREMENT,
  `bau_nombres` varchar(150) COLLATE utf8mb3_spanish_ci NOT NULL,
  `bau_apellidos` varchar(150) COLLATE utf8mb3_spanish_ci NOT NULL,
  `bau_cedula` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `bau_fecha_nac` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `bau_lugar_nac` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `bau_min_bau` int NOT NULL,
  `bau_padre` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `bau_madre` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `bau_padrinos` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `bau_min_cert` int NOT NULL,
  `bau_fecha_bau` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `bau_tomo` int DEFAULT '0',
  `bau_pag` int DEFAULT '0',
  `bau_num` int DEFAULT '0',
  `bau_fecha_acta` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT '',
  `bau_anio_acta` int DEFAULT '0',
  `bau_tomo_nac` int DEFAULT '0',
  `bau_pag_nac` int DEFAULT '0',
  `bau_acta_nac` int DEFAULT '0',
  `bau_nota` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  PRIMARY KEY (`bau_id`),
  KEY `ministroBautiza_idx` (`bau_min_bau`),
  KEY `ministroCertifica_idx` (`bau_min_cert`),
  CONSTRAINT `ministroBautiza` FOREIGN KEY (`bau_min_bau`) REFERENCES `ministro` (`min_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ministroCertifica` FOREIGN KEY (`bau_min_cert`) REFERENCES `ministro` (`min_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bautizado`
--

LOCK TABLES `bautizado` WRITE;
/*!40000 ALTER TABLE `bautizado` DISABLE KEYS */;
INSERT INTO `bautizado` VALUES (13,'Nombre1 Nombre2','Apellido1 Apellido2','1712420742','2024-07-25','Aquí mismito',25,'Padre Papá','Madre Mamá','Muchos - Tantos - Padrinos',26,'2024-09-06',1,1,1,NULL,NULL,1,1,1,'No hay notas'),(14,'Nombre App','Apellido App1','1234567890','2024-07-23','Aquí pero App1',26,'Padre App1','Madre App1','Padrinos - Muchos - Tantos - App1',25,'2024-08-02',1,1,1,NULL,NULL,1,1,1,''),(15,'SOLO','NECESARIO','','','',26,'','','',25,'2024-09-08',0,0,0,'2024-09-19',0,0,0,0,'');
/*!40000 ALTER TABLE `bautizado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ministro`
--

DROP TABLE IF EXISTS `ministro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ministro` (
  `min_id` int NOT NULL AUTO_INCREMENT,
  `min_nombre` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `min_b_parroco` tinyint NOT NULL DEFAULT '0',
  `min_parroco_actual` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`min_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ministro`
--

LOCK TABLES `ministro` WRITE;
/*!40000 ALTER TABLE `ministro` DISABLE KEYS */;
INSERT INTO `ministro` VALUES (25,'Ministro Párroco',1,0),(26,'Ministro no párroco',0,0),(27,'Ministro Párroco Actual',1,1);
/*!40000 ALTER TABLE `ministro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `usu_id` int NOT NULL AUTO_INCREMENT,
  `usu_username` varchar(50) COLLATE utf8mb3_spanish_ci NOT NULL,
  `usu_nombre` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `usu_apellido` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `usu_password` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `usu_rol` varchar(45) COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`usu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (16,'maguevara','Mathias','Guevara','$2b$12$OLP4N2AwSGugN0QFjI46We04TOnXk3pqnHvD9nXnNaFrzmAqtji3O','SuperAdmin'),(18,'usnormal','Usuario','Normal','$2b$12$NquVva.qyZcsSnH0qxbmreKfdukisK86MSOnUelXutsJvzRfJV06y','Usuario');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-08 13:49:27
