var Event = cm.model('event');
var slug = require('slug');
var random = require('random-js')();
var multer  = require('multer');
var sizeOf = require('image-size');
const fs = require('fs');
module.exports = function(app){
    
    app.post('/event/getSearch', function(req, res){ 
        var regex = new RegExp(req.body.search, 'i');
        if(fn.isEmpty(req.body.shop_id)){ 
            Event.find({ $or : [ {'event_title.title_en': regex}, {'event_title.title_th': regex} ] }).lean().exec(function(err, result){
                res.json(result);
            });

        }else{ 
            Event.find({ 'shop_id':req.body.shop_id , $or : [ {'event_title.title_en': regex}, {'event_title.title_th': regex} ]}).lean().exec(function(err, result){
                res.json(result);
            });
        }
    }); 

    app.post('/event/getEvent', function(req, res){
        Event.find({'shop_id':req.body.shop_id}).populate('shop_id').lean().exec(function(err, result){
            res.json(result);
        });
    }); 

    app.post('/event/getAllEvent', function(req, res){
        Event.find({}).sort({'event_time.time_start':'desc'}).populate('shop_id').lean().exec(function(err, result){
            res.json(result);
        });
    }); 

    app.post('/event/checkEvent', function(req, res){ 
        Event.find({'shop_id':req.body.shop_id, 'event_slug':req.body.eventSlug}).lean().exec(function(err, result){
            if(!fn.isEmpty(result)){
                res.json(result);
            }else{
                res.json('empty');
            }
        });
    }); 

    app.post('/event/getOneEvent', function(req, res){
        Event.findOne({'_id':req.body._id}).lean().exec(function(err, result){
            res.json(result);
        });
    }); 

    app.post('/event/getStatusEvent', function(req, res){ 
        Event.findOne({'shop_id':req.body.shop_id, 'event_status':req.body.event_status}).lean().exec(function(err, result){ 
            res.json(result);
        });
    }); 

    app.post('/event/getEventByEventSlug', function(req, res){
        Event.findOne({'event_slug':req.body.eventSlug}).lean().exec(function(err, result){
            if(!fn.isEmpty(result)){
                res.json(result);
            }else{
                res.json('empty');
            }  
        });
    }); 


    app.post('/event/addEvent', function(req, res){ 
        Event.findOne({'shop_id':req.body.shop_id, 'event_status':0}).lean().exec(function(err, result){
            if(!fn.isEmpty(result)){
                res.json(result);
                
            }else{
                var value = random.integer(1, 10); 
                var data = {
                    shop_id : req.body.shop_id,
                    event_time : { 'time_start':'', 'time_end':'' },
                    event_title : { 'title_en':'', 'title_th':'' },
                    event_content : { 'content_en':'', 'content_th':'' },
                    event_slug : '',
                    event_cover : { 'path':'', 'width':'', 'height':'' },
                    event_img : { 'path':'', 'width':'', 'height':'' },  
                    event_expire : 1,
                    event_color : value,
                    event_status: 0,
                    date : fn.getTime(),  
                } 
        
                var insert = new Event(data);
                insert.save(function(err, result){
                    res.json(result);
                });
                
            }  
        }); 
    });

    app.post('/event/updateEvent', function(req, res){ 
        Event.findOneAndUpdate({'_id':req.body._id}, req.body.dataArr).lean().exec(function(err, result){
            res.json(result);
        });
    });

    app.post('/event/updateEventSlug', function(req, res){ 
        if(fn.isEmpty(req.body.slug)){
            var data = { 'event_slug' : Date.now() }
        }else{
            var data = { 'event_slug' : slug(req.body.slug) }
        } 
        Event.findOneAndUpdate({'_id':req.body._id}, data).lean().exec(function(err, result){});
    });

    app.post('/event/delEvent', function(req, res){ 
        getImg(req.body._id).then((img)=>{
            if(img != 'empty'){
                fs.unlink('.'+img);

                Event.remove({'_id':req.body._id}).lean().exec(function(err, result){
                    res.json(result);
                });
            } 
        });   
    }); 

 
    app.post('/event/getEventById', function(req, res){
        Event.findOne({'_id':req.body._id}).lean().exec(function(err, result){
            if(!fn.isEmpty(result)){
                res.json(result);
            }else{
                res.json('empty');
            }  
        });
    });  

    function getImg(_id, type){
        return new Promise(function(success,error){
            Event.findOne({'_id':_id}).lean().exec(function(err, result){ 
                if(type == 'main'){
                    if(fn.isEmpty(result.event_img.path)){
                        success('empty'); 
                    }else{
                        success(result.event_img.path);
                    }  
                }else{
                    if(fn.isEmpty(result.event_cover.path)){
                        success('empty'); 
                    }else{
                        success(result.event_cover.path);
                    }  
                } 
            });
        });
    }

    app.post('/event/uploadCoverEvent', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './resources/event');
            },
            filename: function (req, file, cb) { 
                cb(null, 'coverEvent_'+req.body._id+'_'+Date.now()+'_'+file.originalname);
            }
        })
        var upload = multer({ storage: storage }).any();
        upload(req,res,function(err){
            if(err){
                res.json(err);
            }else{
                getImg(req.body._id, 'cover').then((img)=>{
                    if(img != 'empty'){
                        fs.unlink('.'+img);
                    } 

                    var dimensions = sizeOf('./resources/event/'+req.files[0].filename);
                    var dataArr = {
                        '_id':req.body._id,
                        'event_cover.path':'/resources/event/'+req.files[0].filename,
                        'event_cover.width':dimensions.width,
                        'event_cover.height':dimensions.height,
                    }  

                    Event.findOneAndUpdate({'_id':req.body._id}, dataArr).lean().exec(function(err, result){
                        res.json(dataArr);
                    });
                });  
            }
        })
    });
    
    app.post('/event/uploadEvent', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './resources/event');
            },
            filename: function (req, file, cb) { 
                cb(null, 'mainEvent_'+req.body._id+'_'+Date.now()+'_'+file.originalname);
            }
        })
        var upload = multer({ storage: storage }).any();
        upload(req,res,function(err){
            if(err){
                res.json(err);
            }else{
                getImg(req.body._id, 'main').then((img)=>{
                    if(img != 'empty'){
                        fs.unlink('.'+img);
                    } 

                    var dimensions = sizeOf('./resources/event/'+req.files[0].filename);
                    var dataArr = {
                        '_id':req.body._id,
                        'event_img.path':'/resources/event/'+req.files[0].filename,
                        'event_img.width':dimensions.width,
                        'event_img.height':dimensions.height,
                    }  

                    Event.findOneAndUpdate({'_id':req.body._id}, dataArr).lean().exec(function(err, result){
                        res.json(dataArr);
                    });
                });  
            }
        })
    });
    
}