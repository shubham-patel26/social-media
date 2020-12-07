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
        if(tags instanceof(Error)){
            console.log(tags);
            res.sendStatus(404);
        }
        res.send(tags);
    }
    catch(err){
        res.sendStatus(404);
    }
})

router.get('/aboutus',(req,res)=>{
    console.log("hello");
    res.render('../views/aboutus/aboutus-admin.ejs');

})

module.exports = router;