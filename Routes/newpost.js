const express = require('express');
const router = express.Router();
const app = express();
const db = require('../Database/getQuery');
const pool = require('../Database/pool');
var bCrypt = require('bcrypt');
var authenticate = require('../authenticate');

router.use(express.json());
router.use(express.urlencoded({extended:true}));

// post the newpost 
<<<<<<< HEAD
router.post("/newpost",authenticate.verifyUser,(req,res)=>{
    console.log(req.body);
=======
router.post("/newpost",authenticate.verifyUser, async(req,res)=>{
>>>>>>> 38523c5b97264c10a6feb1851796550fec04c16a
    const userRegId = req.user.reg_no;
    const heading = req.body.heading;
    const body = req.body.body;
    const tags=req.body.tags;
    
    // changes all elements to lowercase...
    for(var i=0;i<tags.length;i++){
        tags[i] = tags[i].replace(/\s+/g, '-').toLowerCase();
    }

    const insertPostQuery = "INSERT INTO posts(reg_no,heading,body,posted_on,upvotes) VALUES ('" +userRegId+ "' , '" +heading+ "' , '" +body+ "', NOW(), 0);";
    pool.query(insertPostQuery, (err,results)=>{
<<<<<<< HEAD
        if(err) res.status(404);
=======
        if(err){
            res.status(404).send(err.message);
            return;
        }
>>>>>>> 38523c5b97264c10a6feb1851796550fec04c16a
        console.log("Post inserted in database.");
        
        const getPostId = "SELECT MAX(post_id) AS max FROM posts";
        
        pool.query(getPostId,(err2,id)=>{
<<<<<<< HEAD
            if(err2) 
            {
                console.log(err2);
                res.status(404);
                
=======
            if(err2){
                res.status(404).send(err2.message);
                return;
>>>>>>> 38523c5b97264c10a6feb1851796550fec04c16a
            }
            const postId = id[0].max;

            const linked = linkPostToTags(postId,tags);
            if(linked instanceof(Error)){
                res.sendStatus(404);
                return;
            }
            res.send("post added successfully!");
        })
    });
})


async function linkPostToTags(postId,tags){
    try{
        console.log('here');
        for(var i=0;i<tags.length;i++)
            await linkPostToTag(postId,tags[i]);
        return 1;
    }
    catch(err){
<<<<<<< HEAD
        res.status(404);
        
=======
        return err;
>>>>>>> 38523c5b97264c10a6feb1851796550fec04c16a
    }
}

async function linkPostToTag(postId,tagName){
    try{
        console.log(postId,tagName);
        const getCount = await db.getQuery(`SELECT * FROM tags WHERE tag_name='${tagName}'` );
        if(getCount.length==0){
            console.log("adding new tag...");
            await db.getQuery("INSERT INTO tags(tag_name) VALUES('" +tagName+ "')");
            const tagId = await db.getQuery("SELECT tag_id FROM tags WHERE tag_name = '" +tagName+ "'");
            await db.getQuery("INSERT INTO post_tag VALUES ("+postId+", "+tagId[0].tag_id+")");
        }
        else{
            console.log("tag already exists");
            const tagId = await db.getQuery("SELECT tag_id FROM tags WHERE tag_name = '" +tagName+ "'");
            const insertQuery = "INSERT INTO post_tag(post_id,tag_id) VALUES ("+postId+", "+tagId[0].tag_id+")";
            await db.getQuery(insertQuery);    
        }
    }
    catch(err){
        console.log(err.message);
        
    }
}

module.exports = router;
