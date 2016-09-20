var Photo_event = cm.model('photo_event');
var slug = require('slug');
var random = require('random-js')();
var multer  = require('multer');
var sizeOf = require('image-size');
const fs = require('fs');
module.exports = function(app){
    
    app.post('/photo_event/uploadMoreEvent', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './resources/event');
            },
            filename: function (req, file, cb) { 
                cb(null, 'moreEvent_'+req.body.event_id+'_'+Date.now()+'_'+file.originalname);
            }
        })
        
        var upload = multer({ storage: storage }).any(); 
        upload(req, res, function(err){ 
            if(err){
                res.json(err);

            }else{  
                req.files.forEach((p,i) => {
                    var dimensions = sizeOf('./resources/event/'+p.filename);
                    var data = {
                        'event_id':req.body.event_id,
                        'img':'/resources/event/'+p.filename,
                        'width':dimensions.width,
                        'height':dimensions.height,
                        'date': Date.now(),
                    }    

                    var insert = new Photo_event(data);
                    insert.save(function(err, result){
                        if(req.files.length == (i+1)){
                            res.json('success');
                        } 
                    });   
                });  
            }
        })
    }); 

    app.post('/photo_event/getMoreImgEvent', function(req, res){
        Photo_event.find({'event_id':req.body.event_id}).lean().exec(function(err, result){
            res.json(result);
        });
    }); 

    app.post('/photo_event/removeImgEvent', function(req, res){
        getImg(req.body._id, 'cover').then((img)=>{
            if(img != 'empty'){
                fs.unlink('.'+img);
            }

            Photo_event.remove({'_id':req.body._id}).lean().exec(function(err, result){
                res.json(result);
            }); 
        }); 
    }); 

    app.post('/photo_event/removeAllImgEvent', function(req, res){
         Photo_event.find({'event_id':req.body._id}).lean().exec(function(err, result){
            result.forEach((i, p) => {
                if(!fn.isEmpty(i.img)){
                    fs.unlink('.'+i.img);
                }
                 
                if(result.length == (p+1)){ 
                    Photo_event.remove({'event_id':req.body._id}).lean().exec(function(err, result){
                        res.json('success');
                    });  
                } 
            });
        });
    }); 

    function getImg(_id){
        return new Promise(function(success,error){
            Photo_event.findOne({'_id':_id}).lean().exec(function(err, result){ 
                if(fn.isEmpty(result.img)){
                    success('empty'); 
                }else{
                    success(result.img);
                }  
            });
        });
    }
    
}