var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var requestStats = require('request-stats');
//var app = express.createServer();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');//https://www.bazarn.com
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control, Accept, Origin, X-Session-ID');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Max-Age', '86400');

    next();
}

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/resources', express.static('public'));
app.get('/',function(req,res){
    res.send('<h1>Express working</h1>')
});

fn = require('./tools.js');
require('./lib/database.js');
permission = require('./modules/permission');
require('./config_router')(app);


var server = app.listen(3000,function(){
    console.log('Server Running')
});
var stats = requestStats(server);
stats.on('complete', function (details) {
    var size = details.req.bytes; 
});