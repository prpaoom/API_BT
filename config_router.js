module.exports = function(app){
    require('./modules/user')(app);
    require('./modules/about')(app);
    require('./modules/default')(app);
    require('./modules/send_mail')(app);
    require('./modules/getshop')(app);
    require('./modules/log')(app);
    require('./modules/activity')(app);
    require('./modules/slide')(app);
    require('./modules/slide_about')(app);
    require('./modules/event')(app);
    require('./modules/logtest')(app);
    require('./modules/photo_event')(app);
    require('./modules/photo_shop')(app);
    require('./modules/getImg')(app); 
    require('./modules/get')(app);
    
}