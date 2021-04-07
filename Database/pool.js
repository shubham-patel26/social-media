// const express=require('express');
const mysql = require('mysql');
const config = require('../config.js');

const util = require('util');

/* 
*   Connection to the database
*/

const pool = mysql.createPool({
    connectionLimit: 5,
    host: config.host,
    user: config.user,
    password:config.password,
    database:config.database
});

pool.getConnection((err,connection)=>{
    if(err)
        console.log(err);
    else
        console.log("Connected to database.");

    if(connection)
        connection.release();
    return;    
});

pool.query = util.promisify(pool.query);

module.exports = pool;