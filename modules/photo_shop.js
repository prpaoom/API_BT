var Photo_shop = cm.model('photo_shop');
var slug = require('slug');
var random = require('random-js')();
var multer  = require('multer');
var sizeOf = require('image-size');
const fs = require('fs');
module.exports = function(app){
    
    app.post('/photo_shop/uploadBio', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './resources/shop');
            },
            filename: function (req, file, cb) { 
                cb(null, 'shopBio_'+req.body.shop_id+'_'+Date.now()+'_'+file.originalname);
            }
        })
        
        var upload = multer({ storage: storage }).any(); 
        upload(req, res, function(err){ 
            if(err){
                res.json(err);

            }else{  
                req.files.forEach((p,i) => {
                    var dimensions = sizeOf('./resources/shop/'+p.filename);
                    var data = {
                        'shop_id':req.body.shop_id,
                        'img':'/resources/shop/'+p.filename,
                        'width':dimensions.width,
                        'height':dimensions.height,
                        'date': Date.now(),
                    }    

                    var insert = new Photo_shop(data);
                    insert.save(function(err, result){
                        if(req.files.length == (i+1)){
                            res.json(req.body.shop_id);
                        } 
                    });   
                });  
            }
        })
    }); 

    app.post('/photo_shop/getImgBio', function(req, res){
        Photo_shop.find({'shop_id':req.body.shop_id}).lean().exec(function(err, result){
            res.json(result);
        });
    }); 

    app.post('/photo_shop/removeImgBio', function(req, res){
        getImg(req.body._id).then((img)=>{
            if(img != 'empty'){
                fs.unlink('.'+img);
            }

            Photo_shop.remove({'_id':req.body._id}).lean().exec(function(err, result){
                res.json(result);
            }); 
        }); 
    }); 

    function getImg(_id){
        return new Promise(function(success,error){
            Photo_shop.findOne({'_id':_id}).lean().exec(function(err, result){ 
                if(fn.isEmpty(result.img)){
                    success('empty'); 
                }else{
                    success(result.img);
                }  
            });
        });
    }
    
}