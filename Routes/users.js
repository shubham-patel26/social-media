var express = require('express');
var router = express.Router();
var bodyParser=require('body-parser');
var bCrypt = require('bcrypt');
var db=require('../Database/pool');
const database = require('../Database/getQuery');

var authenticate = require('../authenticate');

router.use(bodyParser.json());

// req.user.reg_no;      to get the reg_no of loggedin user

/* GET user list. */
router.get('/getuserdetails/:reg_no',authenticate.verifyUser,(req,res,next)=>{
     console.log(req.params.reg_no);
     
     var sql = `SELECT * from user_info WHERE reg_no='${req.params.reg_no}'`;
     db.query(sql,[])
     .then(user=>{
          console.log(user[0]);
          res.statusCode=200;
         res.contentType('Content-Type', 'application/json');
         res.json(user[0]);
     })
     .catch(err=>next(err));
})
//Middleware
router.get('/getuser',authenticate.verifyUser,(req,res,next)=>{
     console.log('here');
     // console.log(req.user);
     var sql = `SELECT * from user_info WHERE reg_no='${req.user.reg_no}'`;
     db.query(sql,[])
     .then(user=>{
          res.statusCode=200;
         res.contentType('Content-Type', 'application/json');
         res.json(user);
     })
     .catch(err=>next(err));
})
router.post('/signup',(req,res,next)=>{
    var sql = `SELECT email_id from user_info where email_id ='${req.body.email_id}'`;

    var generateHash = function(password) {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
     }
    db.query(sql,[])
    .then(result=>{
         console.log(result[0]);
         if(result[0])
         {
              res.statusCode=400;
              res.setHeader('Content-Type', 'application/json');
              res.json({status: false, message: 'this email_id already exist in the data base'});
         }
         else
         {
               
               let pass = generateHash(req.body.password);
                var newUserMysql = {
                    reg_no: req.body.reg_no,
                    email_id: req.body.email_id,
                    password : pass,  // use the generateHash function in our user model
                    name: req.body.name,
                    intro: req.body.intro,
                    facebook_link: req.body.facebook,
                    linkedin_link: req.body.linkedin

                };

                var insertQuery = "INSERT INTO user_info ( reg_no,email_id, password,name,intro,facebook_link,linkedin_link ) values (?,?,?,?,?,?,?)";
            
                db.query(insertQuery,
                    [   newUserMysql.reg_no,
                        newUserMysql.email_id, 
                        newUserMysql.password,
                        newUserMysql.name,
                        newUserMysql.intro,
                        newUserMysql.facebook_link,
                        newUserMysql.linkedin_link
                    ])
                .then(user=>{
                     res.statusCode= 200;
                     res.setHeader('Content-Type','application/json');
                     res.json({success: 'true', message: 'you have been registered successfully'});
                })
                .catch(err=>next(err));
         }
    })
    .catch(err=>next(err));
}

) ;

router.post('/login', (req, res,next) => {
//   console.log(req.body);

     var sql = `SELECT * from user_info WHERE email_id= '${req.body.email_id}'`;
     
     db.query(sql,[])
     .then(user=>{
          
          if(!user[0]){
               res.statusCode=404;
               res.setHeader('Content-Type', 'application/json');
               res.json({message: 'either email_id or password is wrong'});
          }
          else{
               async function comparePassword(password,hash){
                    // console.log(password);
                    // console.log(hash);
                    let result= await bCrypt.compare(password,hash );
                    console.log(result);
                    
                    if(result==false){
                         res.statusCode=404;
                         res.setHeader('Content-Type', 'application/json');
                         res.json(' password is wrong');
                    }
                    else{
                         var token = authenticate.getToken({reg_no : user[0].reg_no});
                         console.log(token);
                         res.statusCode = 200;
                         res.setHeader('Content-Type', 'application/json');
                         res.json({success: true, token: token,user:user[0], status: 'You are successfully logged in!'});
                    }
               }
               comparePassword(req.body.password,user[0].password);
               
               
          }
     })
     .catch(err=>next(err));
     
});


// router.get('/logout', function(req, res) {
// //   if(req.session)
// //   {
// //     req.session.destroy();
// //     res.clearCookie('session-id');
// //     res.redirect('/');
// //   }
// //   else{
// //     var err=new Error('You are not logged in');
// //     err.status=403;
// //     next(err);
// //   }
  
// });

router.get('/search/:name',authenticate.verifyUser, async(req,res)=>{
     try{
          const limit = 10; // number of search results to show
          const name = req.params.name;
          const sqlQuery = "SELECT * FROM user_info WHERE name LIKE '%"+name+"%' LIMIT "+limit;

          const searchResult = await database.getQuery(sqlQuery);
          res.send(searchResult);
     }
     catch(err){
          console.log(err);
          res.sendStatus(404);
     }
})


module.exports = router;