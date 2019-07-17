var User = require('../models/User')
var speakEasy = require('speakeasy');
var qrCode = require('qrcode') 

module.exports.authUser = function(req,res){

    User.findOne({
        username:req.body.username 
    },function(error,user){
        if(error) throw error ; 
        if(!user)
        {
            res.send({
                success:false ,
                message:"authentication failed "
            });
        }
        else {
            if(user.validatePassword(req.body.password))
            {
                data ={
                    success:true,
                    token:user._id 

                } ;
                console.log(data)
                res.json({
                    success:true,
                    token: user._id 

                })
               // res.redirect('/verify')
            }
            else {
                res.send({success:false ,message:"authentication failed "});
            }
        }

    })

};

module.exports.saveUser=function(req,res){
    var user = new User() ; 
    console.log('saving')
    console.log(req.body)
    user.username = req.body.username ; 
    user.password = req.body.password ; 
    user.twoFactorAuthEnabled = false ;
    user.save((err,result)=>{
        if(err) throw err   
        console.log('saved')
        res.send({
            success:true
        })

    })
}
module.exports.verifyTwoFact = function(req,res){

    if(req.body.token === undefined || req.body.token === '' )
    {
        res.send({
            success:false , 
            message:" Token or otp missing "
        })
    }
    User.findById(req.body.token,(err,result)=>{
        if(err || !result) 
        {
            res.send({
                success:false ,
                message:" token error"
            })

        }
        else 
        {
            if(!result.twoFactorAuthEnabled){
                secret = speakEasy.generateSecret({secret:'base32',name:"my app"});
                qrCode.toDataURL(secret.otpauth_url,function(error,data){
                    if(error) throw error ;
                    User.findByIdAndUpdate(result._id,{$set:{twoFactorAuthEnabled:true,secretkey:secret.base32}},(err,res)=>{
                        if(err) throw err ; 
                        console.log('updated')
                    })
                    res.send({
                        success:true , 
                        requiresQr:true , 
                        image :data
                    })
                })
                

            }
            else{
                if( req.body.otp === ''|| req.body.otp === undefined)
                {
                    res.send({
                        success:false , 
                        message:"otp not provided"
                    })
                }
                else 
                {

                    var actualOTP =  speakEasy.totp({
                        secret:result.secretkey,
                        encoding:'base32',
                    })
                    if(req.body.otp === actualOTP)
                    {
                        console.log('otp entered is correct')
                        res.send({
                            success:true ,
                            message:"authenticated"
                        });
                    }
                    else{
                        console.log('otp entered is incorrect')
                        res.send({
                            success:false ,
                            message:"otp is wrong"
                        });

                    }
                    
                }

            }

        }
    })



};

