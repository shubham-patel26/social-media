const http=require('http');
const express=require('express');
const mysql=require('mysql');
const app=express();
const morgan= require('morgan');
const bodyParser=require('body-parser');
var flash = require('connect-flash');

var path = require('path');
var cors = require('cors');
const db=require('./Database/pool');
const userRouter = require('./Routes/users');

const hostname='localhost';
const port=3000;

var config=require('./config');

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(flash());

app.use('/users',userRouter);



app.use((req,res,next)=>{
    console.log(req.headers);
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    console.log(req.user)
    res.end('<html><body><h1>This is an express server</h1></body></html>');

});


const server=http.createServer(app);

server.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}`);
});
 