-- $ sqlite3 db1.db <postssq

-- PRAGMA foreign_keys=ON;
BEGIN TRANSACTION;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS comments;



CREATE TABLE  posts (
	post_id INTEGER primary key,
	post_title VARCHAR,
	post_text VARCHAR,
	post_community VARCHAR,
	post_url VARCHAR,
	post_user_name VARCHAR,
	post_date VARCHAR,
	UNIQUE(post_id)
);


CREATE TABLE  comments(
	ID INTEGER PRIMARY KEY,
	p_id INTEGER,
	comment_text VARCHAR,
	comment_user_name VARCHAR,
	comment_date VARCHAR,
	FOREIGN KEY(p_id) REFERENCES posts(post_id)
);

INSERT INTO posts (post_id,post_title,post_text,post_community,post_url,post_user_name,post_date) VALUES (1,"Title 1","Text1","Community1","https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/beef-ribs.jpg","User1","0/0/0");
INSERT INTO posts (post_id,post_title,post_text,post_community,post_url,post_user_name,post_date) VALUES (2,"Title 2","Text2","Community2","https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/egg-on-toast.jpg","User2","0/0/0");
INSERT INTO posts (post_id,post_title,post_text,post_community,post_url,post_user_name,post_date) VALUES (3,"Title 3","Text3","Community3","https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/french-toast.jpg","User3","0/0/0");
INSERT INTO posts (post_id,post_title,post_text,post_community,post_url,post_user_name,post_date) VALUES (4,"Title 4","Text4","Community4","https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/pizza.jpg","User4","0/0/0");
INSERT INTO posts (post_id,post_title,post_text,post_community,post_url,post_user_name,post_date) VALUES (5,"Title 5","Text5","Community5","https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/tacos.jpg","User5","0/0/0");
INSERT INTO posts (post_id,post_title,post_text,post_community,post_url,post_user_name,post_date) VALUES (6,"Title 1","Text1","Community1","https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/burger-and-fries.jpg","User2","1/0/0");
INSERT INTO posts (post_id,post_title,post_text,post_community,post_url,post_user_name,post_date) VALUES (7,"Title 2","Text2","Community1","https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/english-breakfast.jpg","User3","1/0/0");
INSERT INTO posts (post_id,post_title,post_text,post_community,post_url,post_user_name,post_date) VALUES (8,"Title 3","Text3","Community1","https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/1.png","User4","1/0/0");
INSERT INTO posts (post_id,post_title,post_text,post_community,post_url,post_user_name,post_date) VALUES (9,"Title 4","Text4","Community1","Post URL 4","User4","1/0/0");
INSERT INTO posts (post_id,post_title,post_text,post_community,post_url,post_user_name,post_date) VALUES (10,"Title 5","Text5","Community1","Post URL 5","User5","1/0/0");




INSERT INTO comments(p_id,comment_text, comment_user_name, comment_date) VALUES(1,'Comment text 1', 'User1', '10/5/2020');
INSERT INTO comments(p_id,comment_text, comment_user_name, comment_date) VALUES(1,'Comment text 2', 'User2', '10/5/2020');
INSERT INTO comments(p_id,comment_text, comment_user_name, comment_date) VALUES(1,'Comment text 3', 'User3', '10/5/2020');
INSERT INTO comments(p_id,comment_text, comment_user_name, comment_date) VALUES(1,'Comment text 4', 'User4', '10/5/2020');
INSERT INTO comments(p_id,comment_text, comment_user_name, comment_date) VALUES(1,'Comment text 5', 'User5', '10/5/2020');
INSERT INTO comments(p_id,comment_text, comment_user_name, comment_date) VALUES(2,'Comment text 1', 'User1', '10/5/2020');
INSERT INTO comments(p_id,comment_text, comment_user_name, comment_date) VALUES(2,'Comment text 2', 'User2', '10/5/2020');
INSERT INTO comments(p_id,comment_text, comment_user_name, comment_date) VALUES(2,'Comment text 3', 'User3', '10/5/2020');
INSERT INTO comments(p_id,comment_text, comment_user_name, comment_date) VALUES(2,'Comment text 4', 'User4', '10/5/2020');
INSERT INTO comments(p_id,comment_text, comment_user_name, comment_date) VALUES(2,'Comment text 5', 'User5', '10/5/2020');


COMMIT;
