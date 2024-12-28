SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Database: `bigdata_research`

-- --------------------------------------------------------

-- Table structure for table `dim_author`
CREATE TABLE `dim_author` (
  `author_id` bigint(20) NOT NULL,
  `version` int(11) DEFAULT NULL,
  `date_from` datetime DEFAULT NULL,
  `date_to` datetime DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Table structure for table `dim_country`
CREATE TABLE `dim_country` (
  `country_id` bigint(20) NOT NULL,
  `version` int(11) DEFAULT NULL,
  `date_from` datetime DEFAULT NULL,
  `date_to` datetime DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Table structure for table `dim_doi`
CREATE TABLE `dim_doi` (
  `doi_id` bigint(20) NOT NULL,
  `version` int(11) DEFAULT NULL,
  `date_from` datetime DEFAULT NULL,
  `date_to` datetime DEFAULT NULL,
  `doi` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Table structure for table `dim_issn`
CREATE TABLE `dim_issn` (
  `issn_id` bigint(20) NOT NULL,
  `version` int(11) DEFAULT NULL,
  `date_from` datetime DEFAULT NULL,
  `date_to` datetime DEFAULT NULL,
  `issn` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Table structure for table `dim_journal`
CREATE TABLE `dim_journal` (
  `journal_id` bigint(20) NOT NULL,
  `version` int(11) DEFAULT NULL,
  `date_from` datetime DEFAULT NULL,
  `date_to` datetime DEFAULT NULL,
  `journal` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Table structure for table `dim_keyword`
CREATE TABLE `dim_keyword` (
  `keyword_id` bigint(20) NOT NULL,
  `version` int(11) DEFAULT NULL,
  `date_from` datetime DEFAULT NULL,
  `date_to` datetime DEFAULT NULL,
  `keyword` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Table structure for table `dim_month`
CREATE TABLE `dim_month` (
  `month_id` bigint(20) NOT NULL,
  `version` int(11) DEFAULT NULL,
  `date_from` datetime DEFAULT NULL,
  `date_to` datetime DEFAULT NULL,
  `month` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Table structure for table `dim_quartile`
CREATE TABLE `dim_quartile` (
  `quartile_id` bigint(20) NOT NULL,
  `version` int(11) DEFAULT NULL,
  `date_from` datetime DEFAULT NULL,
  `date_to` datetime DEFAULT NULL,
  `quartile` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Table structure for table `dim_title`
CREATE TABLE `dim_title` (
  `title_id` bigint(20) NOT NULL,
  `version` int(11) DEFAULT NULL,
  `date_from` datetime DEFAULT NULL,
  `date_to` datetime DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Table structure for table `dim_university`
CREATE TABLE `dim_university` (
  `university_id` bigint(20) NOT NULL,
  `version` int(11) DEFAULT NULL,
  `date_from` datetime DEFAULT NULL,
  `date_to` datetime DEFAULT NULL,
  `university` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Table structure for table `dim_year`
CREATE TABLE `dim_year` (
  `year_id` bigint(20) NOT NULL,
  `version` int(11) DEFAULT NULL,
  `date_from` datetime DEFAULT NULL,
  `date_to` datetime DEFAULT NULL,
  `year` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Table structure for table `publication_fait`
CREATE TABLE `publication_fait` (
  `publication_fait_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` int(11) DEFAULT NULL,
  `date_from` datetime DEFAULT NULL,
  `date_to` datetime DEFAULT NULL,
  `title_id` int(11) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `university_id` int(11) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `keyword_id` int(11) DEFAULT NULL,
  `doi_id` int(11) DEFAULT NULL,
  `issn_id` int(11) DEFAULT NULL,
  `journal_id` int(11) DEFAULT NULL,
  `year_id` int(11) DEFAULT NULL,
  `month_id` int(11) DEFAULT NULL,
  `quartile_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`publication_fait_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Indexes for all tables with varchar columns limited to 255 bytes
ALTER TABLE `dim_author`
  ADD PRIMARY KEY (`author_id`),
  ADD KEY `idx_dim_author_lookup` (`author`);

ALTER TABLE `dim_country`
  ADD PRIMARY KEY (`country_id`),
  ADD KEY `idx_dim_country_lookup` (`country`);

ALTER TABLE `dim_doi`
  ADD PRIMARY KEY (`doi_id`),
  ADD KEY `idx_dim_doi_lookup` (`doi`);

ALTER TABLE `dim_issn`
  ADD PRIMARY KEY (`issn_id`),
  ADD KEY `idx_dim_issn_lookup` (`issn`);

ALTER TABLE `dim_journal`
  ADD PRIMARY KEY (`journal_id`),
  ADD KEY `idx_dim_journal_lookup` (`journal`);

ALTER TABLE `dim_keyword`
  ADD PRIMARY KEY (`keyword_id`),
  ADD KEY `idx_dim_keyword_lookup` (`keyword`);

ALTER TABLE `dim_month`
  ADD PRIMARY KEY (`month_id`),
  ADD KEY `idx_dim_month_lookup` (`month`);

ALTER TABLE `dim_quartile`
  ADD PRIMARY KEY (`quartile_id`),
  ADD KEY `idx_dim_quartile_lookup` (`quartile`);

ALTER TABLE `dim_title`
  ADD PRIMARY KEY (`title_id`),
  ADD KEY `idx_dim_title_lookup` (`title`);

ALTER TABLE `dim_university`
  ADD PRIMARY KEY (`university_id`),
  ADD KEY `idx_dim_university_lookup` (`university`);

ALTER TABLE `dim_year`
  ADD PRIMARY KEY (`year_id`),
  ADD KEY `idx_dim_year_lookup` (`year`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


