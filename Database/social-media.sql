create database social_media;
use social_media;

create table user_info (reg_no varchar(12) PRIMARY KEY NOT NULL, email_id varchar(30) UNIQUE NOT NULL,name varchar(256), password varchar(256),intro varchar(256),facebook_link VARCHAR(128) UNIQUE, linkedin_link VARCHAR(128) UNIQUE);

CREATE TABLE posts(post_id INT AUTO_INCREMENT PRIMARY KEY,reg_no VARCHAR(12) NOT NULL, heading VARCHAR(512) NOT NULL,body MEDIUMTEXT NOT NULL,posted_on DATETIME, upvotes INT,comment_count INT);

CREATE TABLE tags(tag_id INT AUTO_INCREMENT primary key, tag_name VARCHAR(64) );

CREATE TABLE post_tag(post_id INT, tag_id INT);

CREATE TABLE comments(post_id INT, reg_no VARCHAR(12) , comment VARCHAR(3000), comment_time DATETIME);

CREATE TABLE messages(sender_reg_no VARCHAR(12) , receiver_reg_no VARCHAR(12) , message VARCHAR(512) );

CREATE TABLE upvote(post_id INT,reg_no VARCHAR(12), FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE);
show tables;