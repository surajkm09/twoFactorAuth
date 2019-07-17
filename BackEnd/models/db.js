var mongoose = require('mongoose');

const config = require('../config')




mongoose.connect(config.mongoURL);


mongoose.connection.on('connected',()=>{
    console.log('mongooose connected to ' + config.mongoURL);
    
})

mongoose.connection.on('error',(error)=>{
    console.log('mogoose encountered an error ');
    console.error(error);
    
    
})

mongoose.connection.on('disconnect',()=>{
    console.log('mongoose disconnected ');
})

require('./User')