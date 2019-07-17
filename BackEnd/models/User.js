var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username:{
        type:String , 
        unique:true ,
        required:true 
    },
    password :{
        required:true , 
        type:String
    },
    secretkey:{
        type:String 
    },
    twoFactorAuthEnabled :{
        type:Boolean
    }


})

userSchema.methods.validatePassword =function(password){

    console.log(this.password +'comparing with password '+password)

    return this.password === password ; 
}

module.exports = mongoose.model('User',userSchema,"users2");