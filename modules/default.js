var Default = cm.model('default');
var multer  = require('multer');
var sizeOf = require('image-size');
const fs = require('fs');

module.exports = function(app){
    app.post('/default/getDefault',function(req,res){ 
         Default.findOne().lean().exec(function(err,result){
             res.json(result);
         });
    });
    
    app.post('/default/updateDefault', function(req, res){
        Default.findOneAndUpdate({'_id':req.body._id}, req.body.dataArr).lean().exec(function(err, result){
            res.json(result);
        });
    });
    
    app.post('/default/updateVisit', function(req, res){ 
        Default.findOneAndUpdate({'_id':req.body._id}, req.body.dataArr).lean().exec(function(err, result){
            res.json(result);
        });
    });

    app.post('/default/uploadAbout', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) { 
                cb(null, './resources/commons');
            },
            filename: function (req, file, cb) { 
                cb(null, 'aboutHomePage_'+req.body._id+'_'+Date.now()+'_'+file.originalname);
            }
        })
        var upload = multer({ storage: storage }).single('file');
        upload(req,res,function(err){
            if(err){
                res.json(err);
            }else{ 
                getImg(req.body._id).then((img)=>{
                    if(img != 'empty'){ 
                        fs.unlink('.'+img);
                    }  
                    var dimensions = sizeOf('./resources/commons/'+req.file.filename);
                    var dataArr = {
                        'cm_img.path':'/resources/commons/'+req.file.filename,
                        'cm_img.width':dimensions.width,
                        'cm_img.height':dimensions.height,
                    }  

                    Default.findOneAndUpdate({'_id':req.body._id}, dataArr).lean().exec(function(err, result){
                        res.json(dataArr);
                    });
                });  
            }
        })
    });

    function getImg(_id){ 
        return new Promise(function(success,error){
            Default.findOne({'_id':_id}).lean().exec(function(err, result){  
                if(fn.isEmpty(result.cm_img.path)){
                    success('empty'); 
                }else{
                    success(result.cm_img.path);
                }   
            });
        });
    }
    
}