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
router.post("/newpost",authenticate.verifyUser, async(req,res)=>{
    console.log(req.body);
    const userRegId = req.user.reg_no;
    const heading = req.body.heading;
    const body = req.body.body;
    const tags=req.body.tags;
    
    // changes all elements to lowercase...
    for(var i=0;i<tags.length;i++){
        tags[i] = tags[i].replace(/\s+/g, '-').toLowerCase();
        console.log(tags[i]);
    }

    const insertPostQuery = "INSERT INTO posts(reg_no,heading,body,posted_on,upvotes) VALUES ('" +userRegId+ "' , '" +heading+ "' , '" +body+ "', NOW(), 0);";
    pool.query(insertPostQuery, (err,results)=>{
        if(err){
            res.status(404).send(err.message);
            return;
        }
        console.log("Post inserted in database.");
        
        const getPostId = "SELECT MAX(post_id) AS max FROM posts";
        
        pool.query(getPostId,(err2,id)=>{
            if(err2){
                res.status(404).send(err2.message);
                return;
            }
            const postId = id[0].max;

            const linked = linkPostToTags(postId,tags);
            if(linked instanceof(Error)){
                res.sendStatus(404);
                return;
            }
            const tagsToSend = db.getQuery("SELECT * FROM tags");

            res.json({message:"post added successfully!", success:true,tagsToSend});
        })
    });
})


async function linkPostToTags(postId,tags){
    try{
        for(var i=0;i<tags.length;i++)
            await linkPostToTag(postId,tags[i]);
        return 1;
    }
    catch(err){
        return err;
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
        return err;
    }
}

module.exports = router;