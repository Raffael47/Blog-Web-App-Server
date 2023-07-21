USE mini_project;

CREATE TABLE mini_project.blog (
	blogId INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(40) NOT NULL,
    userId INT NOT NULL,
    createdAt VARCHAR(20) NOT NULL,
    imageURL VARCHAR(100) NOT NULL,
    categoryId INT NOT NULL,
    content VARCHAR(500) NOT NULL,
    videoURL VARCHAR(100),
    country VARCHAR(20) NOT NULL,
    PRIMARY KEY (blogId),
    UNIQUE INDEX `blogId_UNIQUE` (blogId ASC) VISIBLE );
    
ALTER TABLE `mini_project`.`blog` 
CHANGE COLUMN `blogId` `blogId` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
CHANGE COLUMN `userId` `userId` INT UNSIGNED NOT NULL ,
CHANGE COLUMN `categoryId` `categoryId` INT UNSIGNED NOT NULL ;
    
SELECT * FROM blog;
    