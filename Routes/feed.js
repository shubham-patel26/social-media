const express = require('express');
const router = express.Router();
const app = express();
const db = require('../Database/getQuery');
const pool = require('../Database/pool');
var authenticate = require('../authenticate');


router.use(express.json());
router.use(express.urlencoded({extended:true}));

const limit = 10; // number of rows to show per page

// redirect to feed API as soon as user logs in.
router.get('/feed',authenticate.verifyUser,async(req,res)=>{
    try{
        console.log(req.query);

        var sortBy = 'posted_on', page = 1, order = 'desc'; // Base case
        if(req.query.sortBy)  sortBy = req.query.sortBy;
        if(req.query.page)  page = req.query.page;
        if(req.query.order)  order = req.query.order;

        // Database query to fetch 10 posts based on req.query
        const query1 = "SELECT * FROM posts ORDER BY " + sortBy +" "+ order +" LIMIT " + (page-1)*limit + ", "+limit;
        const posts = await db.getQuery(query1);
        const tags = await getTagsMap(posts);
        
        // tags can be accessed as tags[post_id] which will be an array of strings...
        res.send({posts,tags});
    }
    catch(err){
        console.log(err);
        res.sendStatus(404);
    }
})

router.get('/feed/user/:userId' , authenticate.verifyUser , (req,res,next)=>{
    var sql = `SELECT heading,posted_on,post_id from posts WHERE reg_no='${req.params.userId}'`;
    db.getQuery(sql,[])
    .then(posts=>{
        console.log('the')
        res.statusCode=200;
        res.json(posts);
    })
    .catch(err=>console.log(err));
})

//  API when filter is only on branch
router.get('/feed/branch/:branch',authenticate.verifyUser,async(req,res)=>{
    try{
        const branch = req.params.branch;

        var sortBy = 'posted_on', page = 1, order = 'desc';
        if(req.query.sortBy)  sortBy = req.query.sortBy;
        if(req.query.page)  page = req.query.page;
        if(req.query.order)  order = req.query.order;

        const query1 = "SELECT * FROM posts WHERE reg_no LIKE '______" + branch + "___' ORDER BY " + sortBy +" "+ order +" LIMIT " + (page-1)*limit + ", "+limit;

        const posts = await db.getQuery(query1);
        const tags = await getTagsMap(posts);
        
        // tags can be accessed as tags[post_id] which will be an array of strings...
        res.send({posts,tags});
    }
    catch(err){
        console.log(err);
        res.sendStatus(404);
    }

})

//  API when filter is only on tag
router.get('/feed/tag/:tag',authenticate.verifyUser,async(req,res)=>{
    try{
        const tagId = req.params.tag;
        var sortBy = 'posted_on', page = 1, order = 'desc';
        if(req.query.sortBy)  sortBy = req.query.sortBy;
        if(req.query.page)  page = req.query.page;
        if(req.query.order)  order = req.query.order;

        const query1 = "SELECT posts.post_id,reg_no,heading,body,posted_on,upvotes FROM posts,post_tag WHERE posts.post_id = post_tag.post_id AND post_tag.tag_id=" + tagId +" ORDER BY " +sortBy+ " " + order + " LIMIT " + (page-1)*limit + ", "+limit;
        const posts = await db.getQuery(query1);
        const tags = await getTagsMap(posts);
        
        // tags can be accessed as tags[post_id] which will be an array of strings...
        res.send({posts,tags});
    }
    catch(err){
        console.log(err);
        res.sendStatus(404);
    }
})

//  API when filter is branch and tag both
router.get('/feed/branch/:branch/tag/:tag',authenticate.verifyUser, async(req,res)=>{
    try{
        const branch = req.params.branch;
        const tagId = req.params.tag;
        var sortBy = 'posted_on', page = 1, order = 'desc';
        if(req.query.sortBy)  sortBy = req.query.sortBy;
        if(req.query.page)  page = req.query.page;
        if(req.query.order)  order = req.query.order;

        const query1 = "SELECT posts.post_id,reg_no,heading,body,posted_on,upvotes FROM posts,post_tag WHERE posts.post_id = post_tag.post_id AND post_tag.tag_id=" + tagId +" AND posts.reg_no LIKE '______" + branch + "___' ORDER BY " +sortBy+ " " + order + " LIMIT " + (page-1)*limit + ", "+limit;
        const posts = await db.getQuery(query1);
        const tags = await getTagsMap(posts);
        
        // tags can be accessed as tags[post_id] which will be an array of strings...
        res.send({posts,tags});
    }
    catch(err){
        console.log(err);
        res.sendStatus(404);
    }
})

async function getTagsMap(posts){
    try{
        var postIdsString = "(";
        for(var i=0;i<posts.length;i++){
            postIdsString+=posts[i].post_id;
            if(i<posts.length-1)
                postIdsString+=",";
            else
                postIdsString += ")";
        }
        
        console.log(postIdsString);
        const query2 = "select post_id,tag_name from tags,post_tag where tags.tag_id = post_tag.tag_id AND post_tag.post_id in "+ postIdsString;
        
        const arr = await db.getQuery(query2);
        var tags = new Map();
        
        for(var i=0;i<arr.length;i++){
            if(tags[arr[i].post_id]){
                tags[arr[i].post_id].push(arr[i].tag_name);
            }
            else{
                tags[arr[i].post_id]=[arr[i].tag_name];
            }
        }
        return tags;
    }
    catch(err){
        return err;
    }
}

module.exports = router;