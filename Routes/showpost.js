const express = require('express');
const router = express.Router();
const db = require('../Database/getQuery');
const pool = require('../Database/pool');
var authenticate = require('../authenticate');

router.use(express.json());
router.use(express.urlencoded({extended:true}));

// shows the full post
router.get('/showpost/:id', authenticate.verifyUser,async(req,res)=>{
    try{
        const postId = req.params.id;
        const userRegno = req.user.reg_no;
        const post = await getPostDetails(postId,userRegno);
        
        const authorRegno = post.regNo;
        const getAuthorsDetails = "SELECT * FROM user_info WHERE reg_no = '"+authorRegno+ "'";
        
        const authorDetails = await db.getQuery(getAuthorsDetails);
        console.log(authorDetails)
        res.send({post,authorDetails});
    }
    catch(err){
        console.log(err);
        res.status(404);
    }
})


// get comments of postid = id
router.get('/comment/:id',authenticate.verifyUser, async(req,res)=>{
    try{
        const postId = req.params.id;
        const comments = await getComments(postId);
    
        res.json(comments);
    }
    catch(err){
        console.log(err);
        res.sendStatus(404);
    }
})

async function getPostDetails(postId,userRegno){
    try{
        let post={
            'postId' : postId,
            'regNo' : "",
            'heading' : "",
            'body' : "",
            'upvotes' : 0,
            'postedOn' : "",
            'hasUserUpvoted' : false
        }
        const query1 = "SELECT * FROM posts WHERE post_id = " + postId;
        const results1 = await db.getQuery(query1);
        post.regNo = results1[0].reg_no;
        post.heading = results1[0].heading;
        post.body = results1[0].body;
        post.postedOn = results1[0].posted_on;
        post.upvotes = results1[0].upvotes;

        const query2 = "SELECT * FROM upvote WHERE post_id = " + postId + " AND reg_no = '" + userRegno +"'";
        const results2 = await db.getQuery(query2);
        if(results2.length == 1)
            post.hasUserUpvoted = true;

        return post;
    }
    catch(err){
        return err;
    }
}

async function getComments(postId){
    try{
        const sqlQuery = "SELECT * FROM comments WHERE post_id = " + postId;
        const comments = await db.getQuery(sqlQuery);
        return comments;
    }
    catch(err){
        return err;
    }
}

module.exports.getPostDetails = getPostDetails;
module.exports.getComments = getComments;
module.exports.router = router;