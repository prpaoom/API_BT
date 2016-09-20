var User = cm.model('user');
var Shop = cm.model('shop');
var passwordHash = require('password-hash');
module.exports = function(app){
    
    app.post('/user/logout',permission.isLogin,function(req,res){
        permission.toBlackList(req.body.access_token,function(data){
            res.json(data);
        });
    });

    app.post('/user/checkPermission',permission.isLogin,function(req,res){
        res.json(req.user);
    });

    app.get('/user/ip',function(req,res){
        var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
        res.json(ip.replace(/^.*:/, ''));
    })
    
    app.post('/user/getUser',permission.isLogin,function(req,res){

        if(req.user.permission == 1){
            User.find({}).populate('shop_id').lean().exec(function(err,result){
                if(!fn.isEmpty(result)){
                    res.json(result);
                }
            });
        }else{
            User.find({'_id':req.user_id}).populate('shop_id').lean().exec(function(err,result){
                if(!fn.isEmpty(result)){
                    res.json(result);
                }
            });
        }
    });

    app.post('/user/addUser', function(req, res){    
        if(req.body.username != '' && req.body.password != '' && req.body.phone != '' && req.body.email != '' && req.body.permission+'' != ''){
             
            if(req.body.permission == 1){
                var data = {
                    username : req.body.username,
                    password : passwordHash.generate(req.body.password),
                    permission : req.body.permission,
                    email : req.body.email,
                    phone : req.body.phone,
                    date : fn.getTime()
                }
                var insert = new User(data);
                insert.save(function(err, result){
                    res.json({'msg':'success', 'result':result});
                });

            }else{

                if(req.body.shop_id != ''){
                    var data = {
                        username : req.body.username,
                        password : passwordHash.generate(req.body.password),
                        permission : req.body.permission,
                        email : req.body.email,
                        phone : req.body.phone,
                        shop_id : req.body.shop_id,
                        date : fn.getTime()
                    }
                    var insert = new User(data);
                    insert.save(function(err, result){
                        res.json({'msg':'success', 'result':result});
                    });

                }else{
                    res.json('err');
                }
            }
        }else{
            res.json('err');
        }   
    }); 

    app.post('/user/updateUser', function(req, res){
        if(fn.isEmpty(req.body.password)){   
            User.findOneAndUpdate({'_id':req.body._id}, {'username':req.body.username, 'email':req.body.email}).lean().exec(function(err, result){
                res.json({'msg':'success'});
            });

        }else{ 
            User.findOneAndUpdate({'_id':req.body._id}, {'username':req.body.username, 'email':req.body.email, 'password':passwordHash.generate(req.body.password)}).lean().exec(function(err, result){
                res.json({'msg':'success'});
            });
        } 
    }); 

    app.post('/user/editUser', function(req, res){   
        if(fn.isEmpty(req.body.password)){
            User.findOneAndUpdate({'_id':req.body._id}, {'username':req.body.username, 'email':req.body.email, 'permission':req.body.permission, 'shop_id':req.body.shop_id, 'phone':req.body.phone}).lean().exec(function(err, result){
                res.json({'msg':'success'});
            });
        }else{
            User.findOneAndUpdate({'_id':req.body._id}, {'username':req.body.username, 'email':req.body.email, 'password':passwordHash.generate(req.body.password), 'permission':req.body.permission, 'shop_id':req.body.shop_id, 'phone':req.body.phone}).lean().exec(function(err, result){
                res.json({'msg':'success'});
            });
        } 
    });
    
    app.get('/user/checkToken',permission.isLogin,function(req,res){
      res.json(req.user);
    });

    app.post('/user/updatePassword', function(req, res){
        var newPass = passwordHash.generate(req.body.password);
        User.findOneAndUpdate({'_id':req.body.id}, {'password':newPass}).lean().exec(function(err, result){
            res.json(result);
        }); 
    });

    app.post('/user/delUser', function(req, res){
        User.remove({'_id':req.body._id}).lean().exec(function(err, result){
            res.json(result);
        });
    }); 
    
    app.post('/user/checkLogin', function(req, res){ 
        if(fn.isEmpty(req.body.username) && fn.isEmpty(req.body.password)){
            res.json({'msg':'err1'});

        }else{
            User.findOne({'username':req.body.username}).lean().exec(function(err, result){
                if(fn.isEmpty(result)){
                    res.json({'msg':'err2'});

                }else{ 

                    if(passwordHash.verify(req.body.password, result.password)){
                      var token = permission.createToken(result,req);
                      res.json({'msg':'success', 'result':result,'token':token});
                    }else{
                      res.json({'msg':'err3'});
                    }
                }
            });
        }
    });

    app.post('/user/checkUser', function(req, res){
        User.findOne({'_id':req.body._id}).lean().exec(function(err, result){
            res.json({'result':result});
        });
    });

    app.post('/user/getAllUser', function(req, res){
        User.find().populate('shop_id').lean().exec(function(err, result){
            res.json(result);
        }); 
    });
}