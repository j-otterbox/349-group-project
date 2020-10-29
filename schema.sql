PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS posts;
  DROP TABLE IF EXISTS comments;

  CREATE TABLE users (
    id 			INTEGER PRIMARY KEY autoincrement,
    username		TEXT UNIQUE,
    createDate 	DATETIME
  );

  CREATE TABLE posts (
    id INTEGER PRIMARY KEY autoincrement,
    author text,
    title text, 
    caption text, 
    imgPath text, 
    createDate DATETIME
    /*FOREIGN KEY (author) REFERENCES users(username)*/
  );

  create TABLE comments (
    id integer PRIMARY key AUTOINCREMENT,
    parent_id integer,
    author text,
    content text,
    createDate DATETIME
    /*FOREIGN key (parent_id) REFERENCES posts(id)*/
  );

  /* users test data */
  INSERT INTO users VALUES (null, 'jasonotter17@gmail.com', CURRENT_TIMESTAMP);

  /* posts test data */
  INSERT into posts values (null, 'test-author-1', 'test-title-1', 'test-caption-1', '/stock-imgs/beef-ribs.jpg', '2020-01-23 01:26:12');
  INSERT into posts values (null, 'test-author-2', 'test-title-2', 'test-caption-2', '/stock-imgs/beef-taco.jpg', '2020-01-26 07:57:32');
  INSERT into posts values (null, 'test-author-3', 'test-title-3', 'test-caption-3', '/stock-imgs/big-salad.jpg', '2020-01-27 08:21:12');
  INSERT into posts values (null, 'test-author-2', 'test-title-4', 'test-caption-4', '/stock-imgs/burger-and-fries.jpg','2020-02-03 07:21:12');
  INSERT into posts values (null, 'test-author-2', 'test-title-5', 'test-caption-5', '/stock-imgs/cake.jpg', '2020-02-11 11:33:12');
  INSERT into posts values (null, 'test-author-1', 'test-title-6', 'test-caption-6', '/stock-imgs/cheese-and-crackers.jpg', '2020-02-15 11:21:12');
  INSERT into posts values (null, 'test-author-4', 'test-title-7', 'test-caption-7', '/stock-imgs/ciabatta-burger.jpg', '2020-03-05 04:21:12');
  INSERT into posts values (null, 'test-author-2', 'test-title-8', 'test-caption-8', '/stock-imgs/egg-on-toast.jpg', '2020-03-10 05:33:12');
  INSERT into posts values (null, 'test-author-4', 'test-title-9', 'test-caption-9', '/stock-imgs/egg-salad.jpg', '2020-03-16 11:21:12');
  INSERT into posts values (null, 'test-author-4', 'test-title-10', 'test-caption-10', '/stock-imgs/english-breakfast.jpg', '2020-04-05 05:21:12');
  INSERT into posts values (null, 'test-author-3', 'test-title-11', 'test-caption-11', '/stock-imgs/fancy-french-toast.jpg', '2020-04-11 06:33:12');
  INSERT into posts values (null, 'test-author-2', 'test-title-12', 'test-caption-12', '/stock-imgs/fancy-oatmeal.jpg', '2020-04-17 11:21:12');
  INSERT into posts values (null, 'test-author-3', 'test-title-13', 'test-caption-13', '/stock-imgs/french-toast.jpg', '2020-05-05 06:21:12');
  INSERT into posts values (null, 'test-author-3', 'test-title-14', 'test-caption-14', '/stock-imgs/fried-chicken.jpg', '2020-05-12 07:33:12');
  INSERT into posts values (null, 'test-author-1', 'test-title-15', 'test-caption-15', '/stock-imgs/grilled-cheese.jpg', '2020-05-18 11:21:12');
  INSERT into posts values (null, 'test-author-1', 'test-title-16', 'test-caption-16', '/stock-imgs/grilled-steak.jpg', '2020-06-05 07:21:12');
  INSERT into posts values (null, 'test-author-2', 'test-title-17', 'test-caption-17', '/stock-imgs/meatballs.jpg', '2020-06-13 08:33:12');
  INSERT into posts values (null, 'test-author-2', 'test-title-18', 'test-caption-18', '/stock-imgs/pancakes.jpg', '2020-06-19 11:21:12');
  INSERT into posts values (null, 'test-author-4', 'test-title-19', 'test-caption-19', '/stock-imgs/panini.jpg', '2020-07-05 08:21:12');
  INSERT into posts values (null, 'test-author-3', 'test-title-20', 'test-caption-20', '/stock-imgs/pie.jpg', '2020-07-14 09:33:12');
  INSERT into posts values (null, 'test-author-4', 'test-title-21', 'test-caption-21', '/stock-imgs/pizza.jpg', '2020-07-20 11:21:12');
  INSERT into posts values (null, 'test-author-3', 'test-title-22', 'test-caption-22', '/stock-imgs/seafood.jpg', '2020-08-05 09:21:12');
  INSERT into posts values (null, 'test-author-2', 'test-title-23', 'test-caption-23', '/stock-imgs/sushi.jpg', '2020-08-15 10:33:12');
  INSERT into posts values (null, 'test-author-1', 'test-title-24', 'test-caption-24', '/stock-imgs/tacos.jpg', '2020-08-21 11:21:12');

  /* comments test data */
  INSERT INTO comments VALUES (null, 1, 'test1@gmail.com', 'test1/parent_id=1', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 1, 'test2@gmail.com', 'test2/parent_id=1', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 1, 'test3@gmail.com', 'test3/parent_id=1', '2020-10-26 05:41:32');
  INSERT INTO comments VALUES (null, 2, 'test4@gmail.com', 'test1/parent_id=2', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 2, 'test5@gmail.com', 'test2/parent_id=2', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 3, 'test6@gmail.com', 'test1/parent_id=3', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 3, 'test7@gmail.com', 'test2/parent_id=3', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 3, 'test8@gmail.com', 'test3/parent_id=3', '2020-10-26 05:41:32');
  INSERT INTO comments VALUES (null, 4, 'test9@gmail.com', 'test1/parent_id=4', '2020-10-26 05:41:32');
  INSERT INTO comments VALUES (null, 5, 'test10@gmail.com', 'test1/parent_id=5', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 5, 'test11@gmail.com', 'test2/parent_id=5', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 5, 'test12@gmail.com', 'test3/parent_id=5', '2020-10-26 05:41:32');
  INSERT INTO comments VALUES (null, 6, 'test13@gmail.com', 'test1/parent_id=6', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 6, 'test14@gmail.com', 'test2/parent_id=6', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 7, 'test15@gmail.com', 'test1/parent_id=7', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 7, 'test16@gmail.com', 'test2/parent_id=7', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 7, 'test17@gmail.com', 'test3/parent_id=7', '2020-10-26 05:41:32');
  INSERT INTO comments VALUES (null, 8, 'test18@gmail.com', 'test1/parent_id=8', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 8, 'test19@gmail.com', 'test2/parent_id=8', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 9, 'test20@gmail.com', 'test1/parent_id=9', '2020-10-26 05:41:32');
  INSERT INTO comments VALUES (null, 10, 'test21@gmail.com', 'test1/parent_id=10', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 10, 'test22@gmail.com', 'test2/parent_id=10', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 11, 'test23@gmail.com', 'test1/parent_id=11', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 11, 'test24@gmail.com', 'test2/parent_id=11', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 11, 'test25@gmail.com', 'test3/parent_id=11', '2020-10-26 05:41:32');
  INSERT INTO comments VALUES (null, 12, 'test26@gmail.com', 'test1/parent_id=12', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 12, 'test27@gmail.com', 'test2/parent_id=12', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 13, 'test28@gmail.com', 'test1/parent_id=13', '2020-10-26 05:41:32');
  INSERT INTO comments VALUES (null, 14, 'test29@gmail.com', 'test1/parent_id=14', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 14, 'test30@gmail.com', 'test2/parent_id=14', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 14, 'test31@gmail.com', 'test3/parent_id=14', '2020-10-26 05:41:32');
  INSERT INTO comments VALUES (null, 15, 'test32@gmail.com', 'test1/parent_id=15', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 15, 'test33@gmail.com', 'test2/parent_id=15', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 16, 'test34@gmail.com', 'test1/parent_id=16', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 16, 'test35@gmail.com', 'test2/parent_id=16', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 17, 'test36@gmail.com', 'test1/parent_id=17', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 17, 'test37@gmail.com', 'test2/parent_id=17', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 17, 'test38@gmail.com', 'test3/parent_id=17', '2020-10-26 05:41:32');
  INSERT INTO comments VALUES (null, 18, 'test39@gmail.com', 'test1/parent_id=18', '2020-10-26 05:41:32');
  INSERT INTO comments VALUES (null, 19, 'test32@gmail.com', 'test1/parent_id=19', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 19, 'test33@gmail.com', 'test2/parent_id=19', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 20, 'test34@gmail.com', 'test1/parent_id=20', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 20, 'test35@gmail.com', 'test2/parent_id=20', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 21, 'test36@gmail.com', 'test1/parent_id=21', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 21, 'test37@gmail.com', 'test2/parent_id=21', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 21, 'test38@gmail.com', 'test3/parent_id=21', '2020-10-26 05:41:32');
  INSERT INTO comments VALUES (null, 22, 'test39@gmail.com', 'test1/parent_id=22', '2020-10-26 05:41:32');
  INSERT INTO comments VALUES (null, 23, 'test26@gmail.com', 'test1/parent_id=23', '2020-09-22 11:21:12');
  INSERT INTO comments VALUES (null, 23, 'test27@gmail.com', 'test2/parent_id=23', '2020-10-24 09:31:22');
  INSERT INTO comments VALUES (null, 24, 'test28@gmail.com', 'test1/parent_id=24', '2020-10-26 05:41:32');

COMMIT TRANSACTION;