var http = require('http')
var useragent = require('express-useragent'); 

module.exports = function(app){ 

    app.use(useragent.express()); 

    app.get('/logtest', function(req, res){
        res.send(req.useragent);
    });
}