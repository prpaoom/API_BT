var Get = cm.model('get');
var Shop = cm.model('shop');    
var slug = require('slug'); 
module.exports = function(app){

    app.post('/get/getTypeNotFollow', function(req, res){ 
        Get.find({'slug':{ $ne:'Get-Follow'}}).sort({'index':'asc'}).lean().exec(function(err, result){ 
            res.json(result);
        });
    }); 

    app.post('/get/getAllStatus1', function(req, res){ 
        Get.find({'status':1}).sort({'index':'asc'}).lean().exec(function(err, result){
            res.json(result);
        });
    });

    app.post('/get/getTypePopulate', function(req, res){ 
        Get.find({'slug':{ $ne:'Get-Follow'}, 'status':1}).populate('shop_id').sort({'index':'asc'}).lean().exec(function(err, result){ 
            res.json(result);
        });
    }); 

    app.post('/get/getTypeNotSelect', function(req, res){ 
        Get.find({'status':0, 'slug': {$ne:'Get-Follow'} }).sort({'index':'asc'}).lean().exec(function(err, result){ 
            res.json(result);
        });
    }); 
    
    app.post('/get/getFollow', function(req, res){ 
        Get.find({'index':99}).populate('shop_id').lean().exec(function(err, result){ 
            res.json(result);
        });
    }); 

    app.post('/get/addType', function(req, res){  
        Get.findOne({'name':req.body.dataArr.slug}).lean().exec(function(err, result){
            if(!fn.isEmpty(result)){
                res.json('err');
                
            }else{
                var data = {
                    'name' : req.body.dataArr.slug,
                    'slug' : slug(req.body.dataArr.slug),
                    'status' : 0,
                    'index' : req.body.dataArr.max,
                } 
                
                var insert = new Get(data);
                insert.save(function(err, result){
                    res.json(result);
                }); 
            }  
        }); 
    }); 

    app.post('/get/delType', function(req, res){ 
        Get.remove({'_id':req.body._id}).lean().exec(function(err, result){
            res.json(result);
        }); 
    }); 

    app.post('/get/assignGet', function(req, res){ 
        Get.findOneAndUpdate({'_id':req.body._id}, req.body.dataArr).lean().exec(function(err, result){
            res.json(result);
        });
    });

    app.post('/get/associateGet', function(req, res){ 
        Get.find({'status':1, 'slug': {$ne:'Get-Follow'}}).populate('shop_id').sort({'index':'asc'}).lean().exec(function(err, result){
            res.json(result);
        });
    });

    app.post('/get/removeAssociation', function(req, res){ 
        Get.findOneAndUpdate({'_id':req.body._id}, req.body.data_get).lean().exec(function(err, result){
            Shop.findOneAndUpdate({'_id':req.body.shop_id}, req.body.data_shop).lean().exec(function(err, result){
                res.json(result);
            });
        });
    });

    app.post('/get/upIndex', function(req, res){  
        if(req.body.type == 'up'){
            Get.findOneAndUpdate({'index':req.body.index - 1}, {'index':req.body.index}).lean().exec(function(err, result){ 
                Get.findOneAndUpdate({'_id':req.body._id}, {'index':req.body.index - 1}).lean().exec(function(err, result2){
                    res.json(result2);
                }); 
            });

        }else{ 
            Get.findOneAndUpdate({'index':req.body.index + 1}, {'index':req.body.index}).lean().exec(function(err, result){ 
                Get.findOneAndUpdate({'_id':req.body._id}, {'index':req.body.index + 1}).lean().exec(function(err, result2){
                    res.json(result2);
                }); 
            }); 
        }
    });
    
}