var express = require('express');
var router = express.Router();
var bodyParser=require('body-parser');
var db=require('../Database/pool');

var authenticate = require('../authenticate');

router.use(bodyParser.json());

router.get('/messages/:senderRegNo/:receiverRegNo',authenticate.verifyUser,(req,res,next)=>{
    console.log('shu');
    var sql = `SELECT * FROM messages WHERE sender_reg_no='${req.params.senderRegNo}' AND receiver_reg_no='${req.params.receiverRegNo}'`;
    db.query(sql,[])
    .then(resp=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch(err=>next(err));
})

router.post('/messages/post',authenticate.verifyUser,(req,res,next)=>{
    var sql = `INSERT INTO messages(sender_reg_no,receiver_reg_no,message) VALUE (?,?,?)`;

    db.query(sql,
        [
            req.body.senderRegNo,
            req.body.receiverRegNo,
            req.body.message
        ])
        .then(resp=>{
            console.log(req.user.reg_no);
            console.log(req.body.receiverRegNo);
            var sql = `SELECT * FROM messages WHERE sender_reg_no='${req.body.senderRegNo}' AND receiver_reg_no='${req.body.receiverRegNo}'`;
                db.query(sql,[])
                .then(data=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    
                    res.json(data);
                })
                .catch(err=>next(err));
        })
        .catch(err=>next(err));
})
module.exports = router;