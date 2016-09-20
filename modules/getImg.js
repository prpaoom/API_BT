var express = require('express');
var app = express();

module.exports = function(app){
    app.use("/resources/shop", express.static(__dirname + './../resources/shop'));
    app.use("/resources/event", express.static(__dirname + './../resources/event')); 
    app.use("/resources/activity", express.static(__dirname + './../resources/activity'));
    app.use("/resources/slide", express.static(__dirname + './../resources/slide'));
    app.use("/resources/commons", express.static(__dirname + './../resources/commons'));
}