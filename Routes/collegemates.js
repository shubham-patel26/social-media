const express = require('express');
const router = express.Router();
const app = express();
const db = require('../Database/getQuery');
const pool = require('../Database/pool');
var bCrypt = require('bcrypt');
var authenticate = require('../authenticate');

router.use(express.json());
router.use(express.urlencoded({extended:true}));


router.get('/collegemates/:year/:branch',authenticate.verifyUser,async(req,res)=>{
    try{
        const year = req.params.year;
        const branch = req.params.branch;

        const query = "SELECT * FROM user_info WHERE reg_no LIKE '" + year +"__" + branch + "___'";
        const collegemates = await db.getQuery(query);
        
        if(collegemates instanceof(Error)){
            console.log(collegemates);
            res.sendStatus(404);
        }
        res.send(collegemates);
    }
    catch(err){
        res.sendStatus(404);
    }
})

module.exports = router;