var About = cm.model('about');
var multer  = require('multer');
var sizeOf = require('image-size');
const fs = require('fs');

module.exports = function(app){
    app.post('/about/getAbout',function(req,res){ 
        About.findOne().lean().exec(function(err,result){
            res.json(result);
        });
    });
    
    app.post('/about/updateAbout', function(req, res){   
        About.findOneAndUpdate({'_id':req.body._id}, req.body.dataArr).lean().exec(function(err, result){
            res.json(result);
           
        });
    });
    
    app.post('/about/updateConcept', function(req, res){  
        About.findOneAndUpdate({'_id':req.body._id}, req.body.dataArr).lean().exec(function(err, result){
            res.json(result);
           
        });
    });

    app.post('/about/uploadAboutStatic', function(req, res){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) { 
                cb(null, './resources/commons');
            },
            filename: function (req, file, cb) { 
                cb(null, 'aboutAboutStatic_'+req.body._id+'_'+Date.now()+'_'+file.originalname);
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
                        'about_img.path':'/resources/commons/'+req.file.filename,
                        'about_img.width':dimensions.width,
                        'about_img.height':dimensions.height,
                    }  
                   
                    About.findOneAndUpdate({'_id':req.body._id}, dataArr).lean().exec(function(err, result){
                        res.json(dataArr);
                    });
                });  
            }
        })
    });

    function getImg(_id){ 
        return new Promise(function(success,error){
            About.findOne({'_id':_id}).lean().exec(function(err, result){  
                if(fn.isEmpty(result.about_img.path)){
                    success('empty'); 
                }else{
                    success(result.about_img.path);
                }   
            });
        });
    } 
}