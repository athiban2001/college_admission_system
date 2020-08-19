-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2020 at 05:55 PM
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
-- Database: `collegeadmission`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `allocation` ()  MODIFIES SQL DATA
    DETERMINISTIC
    SQL SECURITY INVOKER
BEGIN
	DECLARE college_code CHAR(6);
	DECLARE course_code CHAR(6);
	DECLARE student_id INT(11);
    DECLARE available_seats INT(11);
    DECLARE admitted_count INT(11);
    DECLARE is_done INTEGER DEFAULT 0;
	DECLARE rank_student CURSOR FOR 
        SELECT grade.studentid
            ,choice.collegecode
            ,choice.coursecode
        FROM grade,choice
        WHERE grade.studentid=choice.studentid
        ORDER BY grade.rank,choice.choiceno;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET is_done = 1;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
    	ROLLBACK;
    END;
    OPEN rank_student;
START TRANSACTION;
	UPDATE lockchoices SET lockchoice=1;
	allocation:LOOP
    	FETCH rank_student INTO 
            student_id,
            college_code,
            course_code;
        IF is_done=1 THEN
        	LEAVE allocation;
        END IF;
        SELECT has.available
            INTO available_seats
            FROM has
            WHERE has.collegecode=college_code AND
                has.coursecode=course_code;
        IF available_seats=0 THEN
        	ITERATE allocation;
        END IF;
        SELECT COUNT(admitted.studentid)
            INTO admitted_count
            FROM admitted
            WHERE admitted.studentid=student_id;
        IF admitted_count>0 THEN
        	ITERATE allocation;
        END IF;
        INSERT INTO admitted VALUES
        	(student_id,college_code,course_code);
    END LOOP allocation;
    CLOSE rank_student;
COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_student` (IN `id` INT(11))  MODIFIES SQL DATA
    SQL SECURITY INVOKER
BEGIN
	DECLARE email_delete VARCHAR(100);
    SELECT student.email INTO email_delete FROM student WHERE 			student.studentid=id; 
	DELETE FROM academics WHERE studentid=id;
    DELETE FROM image WHERE studentid=id;
    DELETE FROM choice WHERE studentid=id;
    DELETE FROM admitted WHERE studentid=id;
    DELETE FROM rejected WHERE studentid=id;
    DELETE FROM lockchoices WHERE studentid=id;
    DELETE FROM student WHERE studentid=id;
    DELETE FROM studdata WHERE email=email_delete;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `rejected_adder` ()  MODIFIES SQL DATA
BEGIN
	DECLARE student_id INT(11);
    DECLARE rank BIGINT;
    DECLARE is_done INTEGER DEFAULT 0;
    DECLARE cursorrejected CURSOR FOR
    	SELECT student.studentid,rank
        FROM student,grade
        WHERE student.studentid=grade.studentid
        AND student.studentid NOT IN
        (SELECT studentid FROM admitted);
     DECLARE CONTINUE HANDLER FOR NOT FOUND SET is_done = 1;
     OPEN cursorrejected;
     rejection:LOOP
     	FETCH cursorrejected INTO student_id,rank;
        IF is_done=1 THEN
        	LEAVE rejection;
        END IF;
        INSERT INTO rejected VALUES(student_id,rank);
    END LOOP rejection;
    CLOSE cursorrejected;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `reset` (IN `college_delete` INT(2))  NO SQL
BEGIN
    DELETE FROM academics;
    DELETE FROM admitted;
    DELETE FROM choice;
    UPDATE has SET available=totalseats;
    DELETE FROM image;
    DELETE FROM lockchoices;
    DELETE FROM rejected;
    UPDATE views SET view='0';
    UPDATE webdata SET value='0';
    DELETE FROM student;
    DELETE FROM studdata;
    IF college_delete=1 THEN
        DELETE FROM has;
    	DELETE FROM college;
        DELETE FROM course;
    END IF;
END$$

--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `college_details` (`course_code` CHAR(6)) RETURNS LONGTEXT CHARSET utf8 READS SQL DATA
BEGIN
	DECLARE return_val LONGTEXT DEFAULT '';
    DECLARE college_name VARCHAR(50);
    DECLARE college_code CHAR(6);
    DECLARE is_done INTEGER DEFAULT 0;
    DECLARE college_info CURSOR FOR
    	SELECT college.collegecode,college.collegename 
        FROM college,has
        WHERE has.coursecode=course_code AND
        	has.collegecode=college.collegecode;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET is_done = 1;
    OPEN college_info;
    college:LOOP
    	FETCH college_info INTO
        	college_code,college_name;
        IF is_done=1 THEN
        	LEAVE college;
        END IF;
        SELECT CONCAT(return_val,college_code,':',
                          college_name,';') INTO return_val;
    END LOOP college;
    CLOSE college_info;
    RETURN return_val;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `course_details` (`college_code` CHAR(6)) RETURNS LONGTEXT CHARSET utf8 READS SQL DATA
BEGIN
	DECLARE return_val LONGTEXT DEFAULT '';
    DECLARE course_name VARCHAR(50);
    DECLARE course_tag VARCHAR(4);
    DECLARE is_done INTEGER DEFAULT 0;
    DECLARE course_info CURSOR FOR
    	SELECT course.coursetag,course.coursename 
        FROM course,has
        WHERE has.collegecode=college_code AND
        	has.coursecode=course.coursecode;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET is_done = 1;
    OPEN course_info;
    course:LOOP
    	FETCH course_info INTO
        	course_tag,course_name;
        IF is_done=1 THEN
        	LEAVE course;
        END IF;
        SELECT CONCAT(return_val,course_tag,':',
                          course_name,';') INTO return_val;
    END LOOP course;
    CLOSE course_info;
    RETURN return_val;
END$$

DELIMITER ;

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

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`adminid`, `adminname`, `pwd`) VALUES
(1, 'admin', 'admin');

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
CREATE TRIGGER `available_delete` AFTER DELETE ON `admitted` FOR EACH ROW BEGIN
        UPDATE has
        SET available = available+1
        WHERE   collegecode = old.collegecode
            AND coursecode = old.coursecode;
    END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `available_insert` AFTER INSERT ON `admitted` FOR EACH ROW BEGIN
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
  `coursetag` varchar(4) DEFAULT NULL,
  `coursedescription` longtext DEFAULT NULL
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
-- Table structure for table `lockchoices`
--

CREATE TABLE `lockchoices` (
  `studentid` int(11) NOT NULL,
  `lockchoice` int(2) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `rejected`
--

CREATE TABLE `rejected` (
  `studentid` int(11) NOT NULL,
  `rank` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `studdata`
--

CREATE TABLE `studdata` (
  `email` varchar(100) NOT NULL,
  `fname` tinytext DEFAULT NULL,
  `lname` varchar(20) DEFAULT NULL,
  `address` varchar(40) DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `phone` bigint(20) DEFAULT NULL,
  `nationality` tinytext DEFAULT NULL,
  `pwd` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `studentid` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `student`
--
DELIMITER $$
CREATE TRIGGER `student_init` AFTER INSERT ON `student` FOR EACH ROW BEGIN
    INSERT INTO image(studentid,imagename,status) 			       VALUES(NEW.studentid,'profiledefault.jpg','0');
    INSERT INTO lockchoices(studentid,lockchoice)
    VALUES(NEW.studentid,'0');
    
END
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

--
-- Dumping data for table `views`
--

INSERT INTO `views` (`page`, `view`) VALUES
('index', 0),
('login', 0),
('register', 0);

-- --------------------------------------------------------

--
-- Table structure for table `webdata`
--

CREATE TABLE `webdata` (
  `id` varchar(20) NOT NULL,
  `value` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `webdata`
--

INSERT INTO `webdata` (`id`, `value`) VALUES
('allocation', 0),
('getChoices', 0),
('showRank', 0);

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
-- Indexes for table `lockchoices`
--
ALTER TABLE `lockchoices`
  ADD PRIMARY KEY (`studentid`);

--
-- Indexes for table `rejected`
--
ALTER TABLE `rejected`
  ADD PRIMARY KEY (`studentid`);

--
-- Indexes for table `studdata`
--
ALTER TABLE `studdata`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`studentid`),
  ADD KEY `email` (`email`);

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
  MODIFY `adminid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `studentid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
-- Constraints for table `lockchoices`
--
ALTER TABLE `lockchoices`
  ADD CONSTRAINT `lockchoices_ibfk_1` FOREIGN KEY (`studentid`) REFERENCES `student` (`studentid`);

--
-- Constraints for table `rejected`
--
ALTER TABLE `rejected`
  ADD CONSTRAINT `rejected_ibfk_1` FOREIGN KEY (`studentid`) REFERENCES `student` (`studentid`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`email`) REFERENCES `studdata` (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
