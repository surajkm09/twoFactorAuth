var express = require('express'); 
var router = express.Router();  

var Users = require('../controllers/Users')



router.post('/authenticate',Users.authUser)


//router.post('/verify',Users.verifyTwoFact);

router.post('/register',Users.saveUser)


module.exports=router ;