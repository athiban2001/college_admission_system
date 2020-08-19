-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2020 at 08:55 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `admission`
--

-- --------------------------------------------------------

--
-- Table structure for table `academics`
--

CREATE TABLE `academics` (
  `studentid` int(11) NOT NULL,
  `dob` date DEFAULT NULL,
  `maths` int(3) DEFAULT NULL,
  `physics` int(3) DEFAULT NULL,
  `chemistry` int(3) DEFAULT NULL,
  `cutoff` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `adminid` int(11) NOT NULL,
  `adminname` varchar(20) DEFAULT NULL,
  `pwd` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `admitted`
--

CREATE TABLE `admitted` (
  `studentid` int(11) NOT NULL,
  `collegecode` char(6) DEFAULT NULL,
  `coursecode` char(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `admitted`
--
DELIMITER $$
CREATE TRIGGER `availablemodifier` AFTER INSERT ON `admitted` FOR EACH ROW BEGIN
        UPDATE has
        SET available = available-1
        WHERE   collegecode = new.collegecode
            AND coursecode = new.coursecode;
    END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `choice`
--

CREATE TABLE `choice` (
  `studentid` int(11) NOT NULL,
  `collegecode` char(6) NOT NULL,
  `coursecode` char(6) NOT NULL,
  `choiceno` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `college`
--

CREATE TABLE `college` (
  `collegecode` char(6) NOT NULL,
  `collegename` varchar(50) DEFAULT NULL,
  `dean` varchar(30) DEFAULT NULL,
  `city` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `coursecode` char(6) NOT NULL,
  `coursename` varchar(50) DEFAULT NULL,
  `coursetag` varchar(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Stand-in structure for view `grade`
-- (See below for the actual view)
--
CREATE TABLE `grade` (
`studentid` int(11)
,`rank` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `has`
--

CREATE TABLE `has` (
  `collegecode` char(6) NOT NULL,
  `coursecode` char(6) NOT NULL,
  `totalseats` int(11) DEFAULT NULL,
  `available` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `image`
--

CREATE TABLE `image` (
  `studentid` int(11) NOT NULL,
  `imagename` longtext DEFAULT NULL,
  `status` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `studentid` int(11) NOT NULL,
  `name` tinytext DEFAULT NULL,
  `fname` tinytext DEFAULT NULL,
  `email` tinytext DEFAULT NULL,
  `address` varchar(40) DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `phone` bigint(20) DEFAULT NULL,
  `nationality` tinytext DEFAULT NULL,
  `pwd` longtext DEFAULT NULL,
  `lockchoice` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `student`
--
DELIMITER $$
CREATE TRIGGER `imgstatus` AFTER INSERT ON `student` FOR EACH ROW INSERT INTO image(studentid,imagename,status) VALUES(NEW.studentid,'profiledefault.jpg','0')
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `views`
--

CREATE TABLE `views` (
  `page` varchar(20) NOT NULL,
  `view` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `webdata`
--

CREATE TABLE `webdata` (
  `id` varchar(20) NOT NULL,
  `value` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure for view `grade`
--
DROP TABLE IF EXISTS `grade`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `grade`  AS  select `academics`.`studentid` AS `studentid`,rank() over ( order by `academics`.`cutoff` desc,`academics`.`maths` desc,`academics`.`physics` desc,`academics`.`chemistry` desc,`academics`.`dob` desc) AS `rank` from `academics` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academics`
--
ALTER TABLE `academics`
  ADD PRIMARY KEY (`studentid`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`adminid`);

--
-- Indexes for table `admitted`
--
ALTER TABLE `admitted`
  ADD PRIMARY KEY (`studentid`),
  ADD KEY `collegecode` (`collegecode`),
  ADD KEY `coursecode` (`coursecode`);

--
-- Indexes for table `choice`
--
ALTER TABLE `choice`
  ADD PRIMARY KEY (`studentid`,`collegecode`,`coursecode`),
  ADD KEY `collegecode` (`collegecode`),
  ADD KEY `coursecode` (`coursecode`);

--
-- Indexes for table `college`
--
ALTER TABLE `college`
  ADD PRIMARY KEY (`collegecode`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`coursecode`);

--
-- Indexes for table `has`
--
ALTER TABLE `has`
  ADD PRIMARY KEY (`collegecode`,`coursecode`),
  ADD KEY `coursecode` (`coursecode`);

--
-- Indexes for table `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`studentid`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`studentid`);

--
-- Indexes for table `views`
--
ALTER TABLE `views`
  ADD PRIMARY KEY (`page`);

--
-- Indexes for table `webdata`
--
ALTER TABLE `webdata`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `adminid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `studentid` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `academics`
--
ALTER TABLE `academics`
  ADD CONSTRAINT `academics_ibfk_1` FOREIGN KEY (`studentid`) REFERENCES `student` (`studentid`);

--
-- Constraints for table `admitted`
--
ALTER TABLE `admitted`
  ADD CONSTRAINT `admitted_ibfk_1` FOREIGN KEY (`studentid`) REFERENCES `student` (`studentid`),
  ADD CONSTRAINT `admitted_ibfk_2` FOREIGN KEY (`collegecode`) REFERENCES `college` (`collegecode`),
  ADD CONSTRAINT `admitted_ibfk_3` FOREIGN KEY (`coursecode`) REFERENCES `course` (`coursecode`);

--
-- Constraints for table `choice`
--
ALTER TABLE `choice`
  ADD CONSTRAINT `choice_ibfk_1` FOREIGN KEY (`studentid`) REFERENCES `student` (`studentid`),
  ADD CONSTRAINT `choice_ibfk_2` FOREIGN KEY (`collegecode`) REFERENCES `college` (`collegecode`),
  ADD CONSTRAINT `choice_ibfk_3` FOREIGN KEY (`coursecode`) REFERENCES `course` (`coursecode`);

--
-- Constraints for table `has`
--
ALTER TABLE `has`
  ADD CONSTRAINT `has_ibfk_1` FOREIGN KEY (`collegecode`) REFERENCES `college` (`collegecode`),
  ADD CONSTRAINT `has_ibfk_2` FOREIGN KEY (`coursecode`) REFERENCES `course` (`coursecode`);

--
-- Constraints for table `image`
--
ALTER TABLE `image`
  ADD CONSTRAINT `image_ibfk_1` FOREIGN KEY (`studentid`) REFERENCES `student` (`studentid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
