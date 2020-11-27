const express = require('express');
const router = express.Router();
const app = express();
const db = require('../Database/getQuery');
const pool = require('../Database/pool');
var bCrypt = require('bcrypt');
var authenticate = require('../authenticate');


router.get('/collegemates/:year/:branch',authenticate.verifyUser,async(req,res)=>{
    const year = req.params.year;
    const branch = req.params.branch;

    const query = "SELECT * FROM user_info WHERE reg_no LIKE '" + year +"__" + branch + "___'";
    const collegemates = await db.getQuery(query);
    res.send(collegemates);
})

module.exports = router;