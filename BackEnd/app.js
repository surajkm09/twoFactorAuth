const express = require('express');
var app = express();
const bodyParser = require('body-parser');

const config = require('./config');

require('./models/db')

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();

});
app.use('/app_api', require('./routes/router'));

app.listen(config.port);