USE mini_project;

CREATE TABLE `mini_project`.`keywords` (
  `keywordId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `keyword` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`keywordId`),
  UNIQUE INDEX `keywordId_UNIQUE` (`keywordId` ASC) VISIBLE);
  
ALTER TABLE `mini_project`.`blog_keywords` 
CHANGE COLUMN `blogId` `blogId` INT UNSIGNED NOT NULL ,
CHANGE COLUMN `keywordsId` `keywordsId` INT UNSIGNED NOT NULL ;
  
SELECT * FROM keywords;