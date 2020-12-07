const express = require('express');
const router = express.Router();
const app = express();
const db = require('../Database/getQuery');
const pool = require('../Database/pool');
var bCrypt = require('bcrypt');
var authenticate = require('../authenticate');


router.use(express.json());
router.use(express.urlencoded({extended:true}));

const limit = 10; // number of rows to show per page

// redirect to feed API as soon as user logs in.
router.get('/feed',authenticate.verifyUser,async(req,res)=>{
    console.log(req.query);

    var sortBy = 'posted_on', page = 1, order = 'desc'; // Base case
    if(req.query.sortBy)  sortBy = req.query.sortBy;
    if(req.query.page)  page = req.query.page;
    if(req.query.order)  order = req.query.order;

    // Database query to fetch 10 posts based on req.query
    const query1 = "SELECT * FROM posts ORDER BY " + sortBy +" "+ order +" LIMIT " + (page-1)*limit + ", "+limit;
    const posts = await db.getQuery(query1);

    // Database query to fetch distinct tags
    const query2 = "SELECT DISTINCT tag_name FROM tags";
    const tags = await db.getQuery(query2);

    if(posts instanceof(Error) || tags instanceof(Error))
        res.sendStatus(404);
    
    res.send(posts);    //send tags along with posts...
})

//  API when filter is only on branch
router.get('/feed/branch/:branch',authenticate.verifyUser,(req,res)=>{
    const branch = req.params.branch;

    var sortBy = 'posted_on', page = 1, order = 'desc';
    if(req.query.sortBy)  sortBy = req.query.sortBy;
    if(req.query.page)  page = req.query.page;
    if(req.query.order)  order = req.query.order;

    const query = "SELECT * FROM posts WHERE reg_no LIKE '______" + branch + "___' ORDER BY " + sortBy +" "+ order +" LIMIT " + (page-1)*limit + ", "+limit;

    pool.query(query, (err,results)=>{
        if(err) res.status(404).send(err.message);
        res.send(results);
    })

})

//  API when filter is only on tag
router.get('/feed/tag/:tag',authenticate.verifyUser,(req,res)=>{
    const tagId = req.params.tag;
    var sortBy = 'posted_on', page = 1, order = 'desc';
    if(req.query.sortBy)  sortBy = req.query.sortBy;
    if(req.query.page)  page = req.query.page;
    if(req.query.order)  order = req.query.order;

    const query = "SELECT posts.post_id,reg_no,heading,body,posted_on,upvotes FROM posts,post_tag WHERE posts.post_id = post_tag.post_id AND post_tag.tag_id=" + tagId +" ORDER BY " +sortBy+ " " + order + " LIMIT " + (page-1)*limit + ", "+limit;
    pool.query(query,(err,results)=>{
        if(err){
            res.status(404).send(err.message);
            return;
        }
        res.send(results);
    })
})

//  API when filter is branch and tag both
router.get('/feed/branch/:branch/tag/:tag',authenticate.verifyUser, (req,res)=>{
    const branch = req.params.branch;
    const tagId = req.params.tag;
    var sortBy = 'posted_on', page = 1, order = 'desc';
    if(req.query.sortBy)  sortBy = req.query.sortBy;
    if(req.query.page)  page = req.query.page;
    if(req.query.order)  order = req.query.order;

    const query = "SELECT posts.post_id,reg_no,heading,body,posted_on,upvotes FROM posts,post_tag WHERE posts.post_id = post_tag.post_id AND post_tag.tag_id=" + tagId +" AND posts.reg_no LIKE '______" + branch + "___' ORDER BY " +sortBy+ " " + order + " LIMIT " + (page-1)*limit + ", "+limit;
    pool.query(query,(err,results)=>{
        if(err)  res.status(404).send(err.message);
        res.send(results);
    })
})


module.exports = router;