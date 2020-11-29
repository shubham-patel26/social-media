const express = require('express');
const router = express.Router();
const db = require('../Database/getQuery');
const pool = require('../Database/pool');
const showpost = require('./showpost');
var bCrypt = require('bcrypt');
var authenticate = require('../authenticate');

router.use(express.json());
router.use(express.urlencoded({extended:true}));

// id = postId in which comment is to be added
router.post('/addcomment/:id',authenticate.verifyUser,async(req,res)=>{
    try{
        const postId = req.params.id;
        const newComment = req.body.newComment;
        const userRegno = req.user.reg_no;

        const addcomment = "INSERT INTO comments(post_id,reg_no,comment,comment_time) VALUES (" +postId+ ",'" +userRegno+ "','" +newComment+ "',NOW())";
        const query1 = await db.getQuery(addcomment);
        const comment = await showpost.getComments(postId);
        // if(query1 instanceof(Error) || comment instanceof(Error)){
        //     res.sendStatus(404);
        //     return;
        // }
        res.json(comment);
    }
    catch(err){
        console.log(err);
        res.sendStatus(404);
    }
})

module.exports = router;