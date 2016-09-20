var Slide = cm.model('slide');
var multer  = require('multer'); 
const fs = require('fs');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload')
  },
  filename: function (req, file, cb) {
    cb(null, 'shop_'+file.fieldname + '-' + Date.now()+'-'+Math.floor(Math.random() * 1000000000)+'-'+file.originalname)
  }
})
var sizeOf = require('image-size');
var upload = multer({ storage: storage }).single('file')

module.exports = function(app){
    
    app.post('/slide/getSlideByShopId', function(req, res){  
        Slide.find({'shop_id':req.body.shop_id}).sort({'_id':'asc'}).lean().exec(function(err, result){
            res.json(result);
        });

    });
    
    app.post('/getshop/uploadSlide', function(req, res){
        upload(req,res,function(err){
            if(err){res.json(err)}
            else{
                var dimensions = sizeOf('./upload/'+req.file.filename);  
                var dataArr = {
                    '_id':req.body._id,
                    'shop_layout_img.path':'/upload/'+req.file.filename,
                    'shop_layout_img.width':dimensions.width,
                    'shop_layout_img.height':dimensions.height,
                }
                
                Shop.findOneAndUpdate({'_id':req.body._id}, dataArr).lean().exec(function(err, result){
                    res.json(result);
                }); 
            }
        })
    });

    app.post('/slide/getSlideByShopIdInArr', function(req, res){ 
        Slide.find({'shop_id':{ $in: req.body.shop_id }}).sort({'_id':'asc'}).lean().exec(function(err, result){
            res.json(result);
        });
    });  

    app.post('/slide/uploadPhoto', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './resources/slide');
            },
            filename: function (req, file, cb) { 
                cb(null, 'slide_'+req.body.shop_id+'_'+Date.now()+'_'+file.originalname);
            }
        })
        
        var upload = multer({ storage: storage }).any(); 
        upload(req, res, function(err){ 
            if(err){
                res.json(err);

            }else{  
                req.files.forEach((p,i) => {
                    var dimensions = sizeOf('./resources/slide/'+p.filename);
                    var data = {
                        'shop_id':req.body.shop_id,
                        'img':'/resources/slide/'+p.filename,
                        'width':dimensions.width,
                        'height':dimensions.height,
                    }    

                    var insert = new Slide(data);
                    insert.save(function(err, result){
                        if(req.files.length == (i+1)){
                            res.json('success');
                        } 
                    });   
                });  
            }
        })
    }); 

    app.post('/slide/delSlide', function(req, res){  
        getImg(req.body._id).then((img)=>{
            if(img != 'empty'){
                fs.unlink('.'+img);

                Slide.remove({'_id':req.body._id}).lean().exec(function(err, result){
                    res.json(result);
                });
            } 
        });   
    }); 

    function getImg(_id){
        return new Promise(function(success,error){
            Slide.findOne({'_id':_id}).lean().exec(function(err, result){    
                if(fn.isEmpty(result.img)){
                    success('empty'); 
                }else{
                    success(result.img);
                }  
            });
        });
    }

}