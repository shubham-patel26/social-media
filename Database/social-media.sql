create database social_media;
use social_media;

create table user_info (reg_no varchar(11) PRIMARY KEY NOT NULL, email varchar(30) UNIQUE,name varchar(256), password varchar(256),intro varchar(64),facebook_link VARCHAR(40), linkedin_link VARCHAR(40));

CREATE TABLE posts(post_id INT AUTO_INCREMENT PRIMARY KEY,reg_no VARCHAR(9) NOT NULL, heading VARCHAR(128) NOT NULL,body VARCHAR(1000) NOT NULL,posted_on DATETIME, upvotes INT);

CREATE TABLE tags(tag_id INT AUTO_INCREMENT primary key, tag_name VARCHAR(32) );

CREATE TABLE post_tag(post_id INT, tag_id INT);

CREATE TABLE comments(post_id INT, reg_no VARCHAR(9) , comment VARCHAR(512), comment_time DATETIME);

CREATE TABLE messages(sender_reg_no VARCHAR(9) , receiver_reg_no VARCHAR(9) , message VARCHAR(256) );

show tables;