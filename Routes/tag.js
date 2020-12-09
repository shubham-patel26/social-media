const express = require('express');
const router = express.Router();
const app = express();
const db = require('../Database/getQuery');
const pool = require('../Database/pool');
var authenticate = require('../authenticate');
const ejs = require("ejs");

router.use(express.json());
router.use(express.urlencoded({extended:true}));


router.get('/tag',async(req,res)=>{
    try{
        const query = "SELECT * FROM tags";
        const tags = await db.getQuery(query);
        res.send(tags);
    }
    catch(err){
        console.log(err);
        res.sendStatus(404);
    }
})


module.exports = router;