const express = require('express');
const router = express.Router();
const app = express();
const db = require('../Database/getQuery');
const pool = require('../Database/pool');
var authenticate = require('../authenticate');

router.use(express.json());
router.use(express.urlencoded({extended:true}));


router.get('/tag',authenticate.verifyUser,async(req,res)=>{
    const query = "SELECT * FROM tags";
    const tags = await db.getQuery(query);

    res.send(tags);
})


module.exports = router;