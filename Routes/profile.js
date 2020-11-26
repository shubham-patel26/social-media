const express = require('express');
const router = express.Router();
const db = require('../Database/getQuery');
const pool = require('../Database/pool');
var bCrypt = require('bcrypt');
var authenticate = require('../authenticate');

router.use(express.json());
router.use(express.urlencoded({extended:true}));


router.get('/user/:regId',authenticate.verifyUser, async(req,res)=>{
    try{
        const profileRegno = req.params.regId;
        const query1 = "SELECT * FROM user_info where reg_no = '" + profileRegno + "'";
        const result = await db.getQuery(query1);
        const query2 = "SELECT * FROM posts WHERE reg_no = '" + profileRegno + "' ORDER BY posted_on DESC";
        const usersPosts = await db.getQuery(query2);

        const userDetails = {
            "regNo": result[0].reg_no,
            "email": result[0].email_id,
            "name": result[0].name,
            "intro": result[0].intro,
            "facebook_link": result[0].facebook_link,
            "linkedin_link": result[0].linkedin_link
        }
        console.log(userDetails);
        console.log(usersPosts);
        res.send(userDetails);  //send usersPosts along with userDetails
    }
    catch(err){
        console.log(err);
        res.sendStatus(404);
    }
})


module.exports = router;