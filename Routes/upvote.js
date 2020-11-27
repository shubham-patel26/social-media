const express = require('express');
const router = express.Router();
const db = require('../Database/getQuery');
const pool = require('../Database/pool');
const showpost = require('./showpost');
var bCrypt = require('bcrypt');
var authenticate = require('../authenticate');

router.use(express.json());
router.use(express.urlencoded({extended:true}));


//  when user upvotes any post where id = postId
router.get('/upvote/:id', authenticate.verifyUser,async(req,res)=>{
    try{
        console.log("Upvoting...");
        const userRegNo = req.user.reg_no;
        const postId = req.params.id;

        const query1 = await updateInPostTable(postId,1); // increment count of upvotes in posts table
        const query2 = await insertInUpvoteTable(postId,userRegNo); // insert row in upvote table
        const post = await showpost.getPostDetails(postId,userRegNo); // fetch details of the same post
        
        if(query1 instanceof(Error) || query2 instanceof(Error) || post instanceof(Error)){
            res.sendStatus(404);
            return;
        }

        res.json(post);
    }
    catch(err){
        console.log(err);
        res.sendStatus(404);
    }
})

// remove the upvote by the user for postId = id
router.get('/downvote/:id',authenticate.verifyUser, async(req,res)=>{
    try{
        console.log("Removing upvote...");

        const userRegNo = req.user.reg_no;
        const postId = req.params.id;

        const query1 = await updateInPostTable(postId,-1); // decrement the count of upvotes in post table
        const query2 = await deleteInUpvoteTable(postId,userRegNo);
        const post = await showpost.getPostDetails(postId,userRegNo);
        
        if(query1 instanceof(Error) || query2 instanceof(Error) || post instanceof(Error)){
            res.sendStatus(404);
            return;
        }
        res.json(post);
    }
    catch(err){
        console.log(err);
        res.sendStatus(404);
    }
})

async function updateInPostTable(postId,val){
    try{
        var valString = "+1";
        if(val == -1) 
            valString = "-1";
        const sqlQuery = "UPDATE posts SET upvotes = upvotes " + valString +" WHERE post_id = " + postId;
        await db.getQuery(sqlQuery);
    }
    catch(err){
        console.log(err);
        return err;
    }
}

async function insertInUpvoteTable(postId,userRegNo){
    try{
        const sqlQuery = "INSERT INTO upvote(post_id,reg_no) VALUES (" +postId+ ",'" +userRegNo+  "')";
        await db.getQuery(sqlQuery);
    }
    catch(err){
        console.log(err);
        return err;
    }
}

async function deleteInUpvoteTable(postId,userRegNo){
    try{
        const sqlQuery = "DELETE FROM upvote WHERE post_id = " +postId+ " AND reg_no = '" +userRegNo+  "'";
        await db.getQuery(sqlQuery);
    }
    catch(err){
        console.log(err);
        return err;
    }
}

module.exports = router;