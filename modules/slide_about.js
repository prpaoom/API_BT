var Slide_about = cm.model('slide_about');
var multer  = require('multer'); 
const fs = require('fs');
var sizeOf = require('image-size');

module.exports = function(app){
     
    app.post('/slide_about/uploadAboutSlide', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './resources/commons');
            },
            filename: function (req, file, cb) { 
                cb(null, 'slideAbout_'+Date.now()+'_'+file.originalname);
            }
        })
        
        var upload = multer({ storage: storage }).any(); 
        upload(req, res, function(err){ 
            if(err){
                res.json(err);

            }else{  
                req.files.forEach((p,i) => {
                    var dimensions = sizeOf('./resources/commons/'+p.filename);
                    var data = {
                        'type':req.body.type,
                        'img':'/resources/commons/'+p.filename,
                        'width':dimensions.width,
                        'height':dimensions.height,
                        'date':fn.getTime(),
                    }    

                    var insert = new Slide_about(data);
                    insert.save(function(err, result){
                        if(req.files.length == (i+1)){
                            res.json('success');
                        } 
                    });   
                });  
            }
        })
    }); 

    app.post('/slide_about/uploadConceptSlide', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './resources/commons');
            },
            filename: function (req, file, cb) { 
                cb(null, 'slideConcept_'+Date.now()+'_'+file.originalname);
            }
        })
        
        var upload = multer({ storage: storage }).any(); 
        upload(req, res, function(err){ 
            if(err){
                res.json(err);

            }else{  
                req.files.forEach((p,i) => {
                    var dimensions = sizeOf('./resources/commons/'+p.filename);
                    var data = {
                        'type':req.body.type,
                        'img':'/resources/commons/'+p.filename,
                        'width':dimensions.width,
                        'height':dimensions.height,
                        'date':fn.getTime(),
                    }    

                    var insert = new Slide_about(data);
                    insert.save(function(err, result){
                        if(req.files.length == (i+1)){
                            res.json('success');
                        } 
                    });   
                });  
            }
        })
    }); 

    app.post('/slide_about/getSlideByType', function(req, res){
        Slide_about.find({'type':req.body.type}).sort({'date':'desc'}).lean().exec(function(err, result){
            res.json(result);
        });
    });

    app.post('/slide_about/getSlideArea', function(req, res){
        Slide_about.find({'type':req.body.type}).limit(6).sort({'date':'desc'}).lean().exec(function(err, result){
            res.json(result);
        });
    });

    app.post('/slide_about/getSlide', function(req, res){
        Slide_about.findOne({'_id':req.body._id}).lean().exec(function(err, result){
            res.json(result);
        });
    });

    app.post('/slide_about/delSlide', function(req, res){  
        getImg(req.body._id).then((img)=>{
            if(img != 'empty'){
                fs.unlink('.'+img);

                Slide_about.remove({'_id':req.body._id}).lean().exec(function(err, result){
                    res.json(result);
                });
            } 
        });   
    });

    app.post('/slide_about/updateSlide', function(req, res){ 
        Slide_about.findOneAndUpdate({'_id':req.body._id}, req.body.dataArr).lean().exec(function(err, result){
            res.json(result);
        });
    });

    app.post('/slide_about/uploadAreaSlide', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './resources/commons');
            },
            filename: function (req, file, cb) { 
                cb(null, 'slideArea_'+Date.now()+'_'+file.originalname);
            }
        })
        
        var upload = multer({ storage: storage }).any(); 
        upload(req, res, function(err){ 
            if(err){
                res.json(err);

            }else{  
                req.files.forEach((p,i) => {
                    var dimensions = sizeOf('./resources/commons/'+p.filename);
                    var dataArr = {
                        'caption.caption_en': req.body.caption_en,
                        'caption.caption_th': req.body.caption_th,
                        'img':'/resources/commons/'+p.filename,
                        'width':dimensions.width,
                        'height':dimensions.height,
                    }    
                    Slide_about.findOneAndUpdate({'_id':req.body._id}, dataArr).lean().exec(function(err, result){
                        res.json(result);
                    });
 
                });  
            }
        })
    });

    app.post('/slide_about/uploadArea', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './resources/commons');
            },
            filename: function (req, file, cb) { 
                cb(null, 'slideArea_'+Date.now()+'_'+file.originalname);
            }
        })
        
        var upload = multer({ storage: storage }).any(); 
        upload(req, res, function(err){ 
            if(err){
                res.json(err);

            }else{  
                req.files.forEach((p,i) => {
                    var dimensions = sizeOf('./resources/commons/'+p.filename);
                    var data = {
                        'type': 'area',
                        'caption.caption_en': req.body.caption_en,
                        'caption.caption_th': req.body.caption_th,
                        'img':'/resources/commons/'+p.filename,
                        'width':dimensions.width,
                        'height':dimensions.height,
                        'date':fn.getTime(),
                    }       
 
                    var insert = new Slide_about(data);
                    insert.save(function(err, result){
                        if(req.files.length == (i+1)){
                            res.json('success');
                        } 
                    });   
                });  
            }
        })
    });   

    function getImg(_id){
        return new Promise(function(success,error){
            Slide_about.findOne({'_id':_id}).lean().exec(function(err, result){    
                if(fn.isEmpty(result.img)){
                    success('empty'); 
                }else{
                    success(result.img);
                }  
            });
        });
    }

}