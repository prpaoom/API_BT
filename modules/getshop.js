var Shop = cm.model('shop');
var multer  = require('multer');
var sizeOf = require('image-size');
var slug = require('slug');
const fs = require('fs');

module.exports = function(app){
    
    app.post('/getshop/getAllShop',function(req,res){  
         Shop.find({}).sort({'date':'asc'}).lean().exec(function(err,result){
             res.json(result);
         });
    });

    app.post('/getshop/getAllShopNotFollow',function(req,res){  
         Shop.find({'shop_slug' : { $ne: 'getfollow'}, 'add_follow' : 0 }).sort({'date':'asc'}).lean().exec(function(err,result){
             res.json(result);
         });
    });

    app.post('/getshop/getShopAddFollow',function(req,res){  
         Shop.find({ 'add_follow' : 1 }).sort({'date':'asc'}).lean().exec(function(err,result){
             res.json(result);
         });
    });

    app.post('/getshop/getShopNotFollow',function(req,res){  
         Shop.find({'shop_slug' : { $ne: 'getfollow'}}).sort({'date':'asc'}).lean().exec(function(err,result){
             res.json(result);
         });
    });

    app.post('/getshop/getShopNotSelect',function(req,res){  
         Shop.find({'status_get' : 0}).sort({'date':'asc'}).lean().exec(function(err,result){ 
             res.json(result);
         });
    });
    
    app.post('/getshop/getShop',function(req,res){  
         Shop.findOne({'_id':req.body._id}).lean().exec(function(err,result){
             if(!fn.isEmpty(result)){
                 res.json(result);
             }else{
                 res.json('empty');
             }  
         });
    });

    app.post('/getshop/getShopByShopSlug',function(req,res){  
         Shop.findOne({'shop_slug':req.body.shop_slug}).lean().exec(function(err,result){
             if(!fn.isEmpty(result)){
                 res.json(result);
             }else{
                 res.json('empty');
             } 
         });
    });
    
    app.post('/getshop/updateShop', function(req, res){ 
        Shop.findOneAndUpdate({'_id':req.body._id}, req.body.dataArr).lean().exec(function(err, result){
            res.json(result);
        });
    });
    
    app.post('/getshop/updateShopTitle', function(req, res){
        Shop.findOneAndUpdate({'_id':req.body._id}, req.body.dataArr).lean().exec(function(err, result){
            res.json(result);
        });
    });

    app.post('/getshop/updateShopContact', function(req, res){
        Shop.findOneAndUpdate({'_id':req.body._id}, req.body.dataArr).lean().exec(function(err, result){
            res.json(result);
        });
    });

    app.post('/getshop/getShopInFollow', function(req, res){
        Shop.findOne({'status_follow':req.body.status_follow}).lean().exec(function(err, result){
            res.json(result);
        });
    })
    
    app.post('/getshop/updateShopContent', function(req, res){
        Shop.findOneAndUpdate({'_id':req.body._id}, req.body.dataArr).lean().exec(function(err, result){
            res.json(result);
        });
    }); 

    app.post('/getshop/uploadCover', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './resources/shop');
            },
            filename: function (req, file, cb) { 
                cb(null, 'shopCover_'+req.body._id+'_'+Date.now()+'_'+file.originalname);
            }
        })
        var upload = multer({ storage: storage }).single('file');
        upload(req,res,function(err){
            if(err){
                res.json(err);
            }else{
                getImg(req.body._id, 'cover').then((img)=>{
                    if(img != 'empty'){
                        fs.unlink('.'+img);
                    } 

                    var dimensions = sizeOf('./resources/shop/'+req.file.filename);
                    var dataArr = {
                        '_id':req.body._id,
                        'shop_cover.path':'/resources/shop/'+req.file.filename,
                        'shop_cover.width':dimensions.width,
                        'shop_cover.height':dimensions.height,
                    }  

                    Shop.findOneAndUpdate({'_id':req.body._id}, dataArr).lean().exec(function(err, result){
                        res.json(dataArr);
                    });
                });  
            }
        })
    });

    app.post('/getshop/uploadAvatar', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) { 
                cb(null, './resources/shop');
            },
            filename: function (req, file, cb) { 
                cb(null, 'shopAvatar_'+req.body._id+'_'+Date.now()+'_'+file.originalname);
            }
        })
        var upload = multer({ storage: storage }).single('file');
        upload(req,res,function(err){
            if(err){
                res.json(err);
            }else{
                getImg(req.body._id, 'avatar').then((img)=>{
                    if(img != 'empty'){
                        fs.unlink('.'+img);
                    } 

                    var dimensions = sizeOf('./resources/shop/'+req.file.filename);
                    var dataArr = {
                        '_id':req.body._id,
                        'shop_avatar.path':'/resources/shop/'+req.file.filename,
                        'shop_avatar.width':dimensions.width,
                        'shop_avatar.height':dimensions.height,
                    }  

                    Shop.findOneAndUpdate({'_id':req.body._id}, dataArr).lean().exec(function(err, result){
                        res.json(dataArr);
                    });
                });  
            }
        })
    });

    app.post('/getshop/uploadLayout', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './resources/shop');
            },
            filename: function (req, file, cb) { 
                cb(null, 'shopLayout_'+req.body._id+'_'+Date.now()+'_'+file.originalname);
            }
        })
        var upload = multer({ storage: storage }).single('file');
        upload(req,res,function(err){
            if(err){
                res.json(err);
            }else{
                getImg(req.body._id, 'layout').then((img)=>{
                    if(img != 'empty'){
                        fs.unlink('.'+img);
                    } 

                    var dimensions = sizeOf('./resources/shop/'+req.file.filename);
                    var dataArr = {
                        '_id':req.body._id,
                        'shop_layout_img.path':'/resources/shop/'+req.file.filename,
                        'shop_layout_img.width':dimensions.width,
                        'shop_layout_img.height':dimensions.height,
                    }  

                    Shop.findOneAndUpdate({'_id':req.body._id}, dataArr).lean().exec(function(err, result){
                        res.json(dataArr);
                    });
                });  
            }
        })
    });

    app.post('/getshop/uploadDefault', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './resources/shop');
            },
            filename: function (req, file, cb) { 
                cb(null, 'shopDefalut_'+req.body._id+'_'+Date.now()+'_'+file.originalname);
            }
        })
        var upload = multer({ storage: storage }).single('file');
        upload(req,res,function(err){
            if(err){
                res.json(err);
            }else{
                getImg(req.body._id, 'defalut').then((img)=>{
                    if(img != 'empty'){
                        fs.unlink('.'+img);
                    } 

                    var dimensions = sizeOf('./resources/shop/'+req.file.filename);
                    var dataArr = {
                        '_id':req.body._id,
                        'img_default.path':'/resources/shop/'+req.file.filename,
                        'img_default.width':dimensions.width,
                        'img_default.height':dimensions.height,
                    }   
                    Shop.findOneAndUpdate({'_id':req.body._id}, dataArr).lean().exec(function(err, result){
                        res.json(dataArr);
                    });
                });  
            }
        })
    });

    app.post('/getshop/uploadLogo', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './resources/shop');
            },
            filename: function (req, file, cb) { 
                cb(null, 'shopLogo_'+req.body._id+'_'+Date.now()+'_'+file.originalname);
            }
        })

        var upload = multer({ storage: storage }).single('file');
        upload(req,res,function(err){
            if(err){
                res.json(err);

            }else{
                getImg(req.body._id, 'logo').then((img)=>{
                    if(img != 'empty'){
                        fs.unlink('.'+img);
                    } 

                    var dimensions = sizeOf('./resources/shop/'+req.file.filename);
                    var dataArr = {
                        '_id':req.body._id,
                        'shop_logo.path':'/resources/shop/'+req.file.filename,
                        'shop_logo.width':dimensions.width,
                        'shop_logo.height':dimensions.height,
                    } 
                    Shop.findOneAndUpdate({'_id':req.body._id}, dataArr).lean().exec(function(err, result){
                        res.json(dataArr);
                    }); 
                });  
            }
        })
    });

    app.post('/getshop/uploadLogoLandscape', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './resources/shop');
            },
            filename: function (req, file, cb) { 
                cb(null, 'shopLogoLandscape_'+req.body._id+'_'+Date.now()+'_'+file.originalname);
            }
        })

        var upload = multer({ storage: storage }).single('file');
        upload(req,res,function(err){
            if(err){
                res.json(err);

            }else{
                getImg(req.body._id, 'logolandscape').then((img)=>{
                    if(img != 'empty'){
                        fs.unlink('.'+img);
                    } 

                    var dimensions = sizeOf('./resources/shop/'+req.file.filename);
                    var dataArr = {
                        '_id':req.body._id,
                        'shop_logo_landscape.path':'/resources/shop/'+req.file.filename,
                        'shop_logo_landscape.width':dimensions.width,
                        'shop_logo_landscape.height':dimensions.height,
                    } 
                    Shop.findOneAndUpdate({'_id':req.body._id}, dataArr).lean().exec(function(err, result){
                        res.json(dataArr);
                    }); 
                });  
            }
        })
    });


    function getImg(shop_id, type){
        return new Promise(function(success,error){
            Shop.findOne({'_id':shop_id}).lean().exec(function(err, result){

                if(type == 'logo'){
                    if(fn.isEmpty(result.shop_logo.path)){
                        success('empty'); 
                    }else{
                        success(result.shop_logo.path);
                    }  
                }else if(type == 'logolandscape'){
                    if(fn.isEmpty(result.shop_logo_landscape.path)){
                        success('empty'); 
                    }else{
                        success(result.shop_logo_landscape.path);
                    } 
                }else if(type == 'cover'){
                    if(fn.isEmpty(result.shop_cover.path)){
                        success('empty'); 
                    }else{
                        success(result.shop_cover.path);
                    } 
                }else if(type == 'avatar'){
                    if(fn.isEmpty(result.shop_avatar.path)){
                        success('empty'); 
                    }else{
                        success(result.shop_avatar.path);
                    } 
                }else if(type == 'layout'){
                    if(fn.isEmpty(result.shop_layout_img.path)){
                        success('empty'); 
                    }else{
                        success(result.shop_layout_img.path);
                    } 
                }else if(type == 'defalut'){
                    if(fn.isEmpty(result.img_default.path)){
                        success('empty'); 
                    }else{
                        success(result.img_default.path);
                    } 
                }
            });
        });
    }
 
    app.post('/getshop/uploadSide', function(req, res){
        upload(req,res,function(err){
            if(err){res.json(err)}
            else{
                var dimensions = sizeOf('./upload/'+req.file.filename);
                var dataArr = {
                    '_id':req.body._id,
                    'img_side.path':'/upload/'+req.file.filename,
                    'img_side.width':dimensions.width,
                    'img_side.height':dimensions.height,
                }
                
                Shop.findOneAndUpdate({'_id':req.body._id}, dataArr).lean().exec(function(err, result){
                    res.json(result);
                }); 
            }
        })
    });

    app.post('/getshop/updateShopSlug', function(req, res){ 
        if(fn.isEmpty(req.body.shop_name_short)){
            var shop_slug = Date.now();
        }else{
            var shop_slug = slug(req.body.shop_name_short);
        }
        
        Shop.findOneAndUpdate({'_id':req.body._id}, {'shop_slug':shop_slug}).lean().exec(function(err, result){
            res.json(result);
        });
    });

}