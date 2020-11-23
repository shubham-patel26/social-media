const jwt = require('jsonwebtoken');
var config = require('./config.js');

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

exports.verifyUser = (req,res,next)=>{
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        // console.log(bearerToken);
      jwt.verify(bearerToken,config.secretKey,(err,authData)=>{
            if(err){
                res.sendStatus(403);
                res.json('invalid token');
            }
            else{
                // console.log(authData);
                req.user=authData;
                console.log(req.user.reg_no);
                next();
            }
        })
    }
    else{
        res.sendStatus(403);
    }
    
}
// exports.verifyAdmin= (req,res,next)=>{
//     if(req.user.user.admin)
//     {
//         next();
//     }
//     else{
//         err=new Error('You are not allowed to perform this operation!');
//         next(err);
//     }
// }