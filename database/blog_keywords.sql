USE mini_project;

CREATE TABLE mini_project.blog_keywords (
	blogId INT NOT NULL,
    keywordsId INT NOT NULL,
    PRIMARY KEY (blogId, keywordsId));
    
SELECT * FROM blog_keywords;
    