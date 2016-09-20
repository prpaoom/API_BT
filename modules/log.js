var Log = cm.model('log');  
var express = require('express');
var app = express();
var useragent = require('express-useragent'); 

module.exports = function(app){ 

    app.use(useragent.express()); 
    app.get('/log/agent',function(req,res){
        res.json(req.useragent);
    });
    
    function daysInMonth(month,year) {
        return new Date(year, month, 0).getDate();
    }
    function getDay(number){
        var today = new Date();
        var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - number);
        var d = new Date(lastWeek);
        var dateLast = d.getTime()/1000;
        return  dateLast;       
    }
    function getDayFull(digi){
       var d = new Date(digi * 1000);

       return d;
    }
    function makeid(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function getResult(current,last){
        if(current || last){
            var result =  100 / ((last + current) / (current - last)) ;
            return result.toFixed(2);    
        }else{
            return 0;
        }
        
    }
    app.get('/log/getDaily',permission.isLogin,function(req,res){
        var dateLast = getDay(30);
        var data = [];
        var dataTest = [];
        var query = {}
        var day = [];
        var d = getDayFull(dateLast);
        if(req.query.shopid != 'undefined' && req.query.shopid){
            query = {'shop_id':req.query.shopid,'date':{$gt: dateLast,$lt: fn.getTime()}};
        }else{
            query = {'date':{$gt: dateLast,$lt: fn.getTime()}};
        }
        var current = getDayFull(fn.getTime());
        var month = [{'day':d.getDate(),'month':d.getMonth()+1,'year':d.getFullYear()},{'day':current.getDate(),'month':current.getMonth()+1,'year':d.getFullYear()}];
        Log.find(query).sort({'date':'asc'}).lean().exec(function(err,resultLogs){
            var dayi = d.getDate()+1;
           
            resultLogs.forEach(function(logs){
                var d = getDayFull(logs.date);
                var indexes = data.findIndex(function(log){

                    return log.day+'' == d.getDate()+'' && log.month+'' == (d.getMonth()+1)+'';
                })
                if(indexes == -1 ){
                    if(data.length != 0 ){
                        var x = data[data.length - 1].day;
                        var LimitDay = daysInMonth(d.getMonth()+1,d.getFullYear());
                        if(x != d.getDate()-1 && x  <= LimitDay){
                            data.push({'day':(x+1),'month':data[data.length - 1].month,'year':data[data.length - 1].year,'result':0});    
                        }else{
                            data.push({'day':d.getDate(),'month':d.getMonth()+1,'year':d.getFullYear(),'result':1});    
                        }
                    }else{
                        data.push({'day':d.getDate(),'month':d.getMonth()+1,'year':d.getFullYear(),'result':1});     
                    }
                }else{
                   data[indexes].result += 1;
                }
               
            });
            res.json(data);    
        });
    });
    app.get('/log/referrer',permission.isLogin,function(req,res){
        var social = {};
        var query = {};
        if(req.query.shopid != 'undefined' && req.query.shopid){
            query = {'shop_id':req.query.shopid};
        }
        Log.find(query).lean().exec(function(err ,resultLogs){
            resultLogs.forEach(function(logs){
                if(!social[logs.referrer]){
                    social[logs.referrer] = 1;
                }else{
                    social[logs.referrer] += 1;
                }
              
            });
            res.json(social); 
        });   
    });
    app.get('/log/getLogPageView',permission.isLogin,function(req,res){
        var dateLast = getDay(7);
        var last = getDay(14);
        var last7day = [];
        var all;
        var query = [];
        var current7day = [];
        var weekday = new Array(7);
        var lastweekday = new Array(7);
        weekday[0] = 0;lastweekday[0] = 0
        weekday[1] = 0;lastweekday[1] = 0
        weekday[2] = 0;lastweekday[2] = 0
        weekday[3] = 0;lastweekday[3] = 0
        weekday[4] = 0;lastweekday[4] = 0
        weekday[5] = 0;lastweekday[5] = 0
        weekday[6] = 0;lastweekday[6] = 0
        if(req.query.shopid != 'undefined' && req.query.shopid){
            query[0] = {'shop_id':req.query.shopid,'date':{$gt: dateLast,$lt: fn.getTime()}};
            query[1] = {'shop_id':req.query.shopid,'date':{$gt: last,$lte: dateLast}}
        }else{
            query[0] = {'date':{$gt: dateLast,$lt: fn.getTime()}};
            query[1] = {'date':{$gt: last,$lte: dateLast}}
        }
        Log.find(query[0]).lean().exec(function(err ,result){
            result.forEach(function(data){
                 var d = getDayFull(data.date);
                 weekday[d.getDay()] = weekday[d.getDay()] + 1;
                 current7day.push(data); 
            });
            Log.find(query[1]).lean().exec(function(err ,resultLast){
                resultLast.forEach(function(data){
                    var d = getDayFull(data.date);
                    lastweekday[d.getDay()] = lastweekday[d.getDay()] + 1;
                    last7day.push(data); 
                });
                var result = getResult(current7day.length,last7day.length);
               
                all = {'current7day':current7day,'last7day':last7day,'weekday':weekday,'lastweekday':lastweekday,'result':result};
                res.json(all);   
            });
            
        });    
    });
     app.get('/log/device',permission.isLogin,function(req,res){
        var deviceData = [];
        var query = {};
        var platform = {};
        if(req.query.shopid != 'undefined' && req.query.shopid){
            query = {'shop_id':req.query.shopid};
        }
        //device['Safari'] = 0;
        Log.find(query).lean().exec(function(err,resultDevice){
            resultDevice.forEach(function(device){
                var logs = deviceData.filter(function(logs){ return logs.ip == device.ip && logs.platform == device.platform }); 
                if(!logs[0]){
                    
                    if(!platform[device.platform]){
                       platform[device.platform] = 1; 
                    }else{
                        platform[device.platform] = platform[device.platform] + 1;  
                    }
                    
                    deviceData.push(device);
                }   
            });
           
            res.json({'device':deviceData,platform});
        });
    });
    app.get('/log/browser',permission.isLogin,function(req,res){
        var deviceData = [];
        var query = {};
        var browser = {};
        if(req.query.shopid != 'undefined' && req.query.shopid){
            query = {'shop_id':req.query.shopid};
        }
        Log.find(query).lean().exec(function(err,resultDevice){
            resultDevice.forEach(function(device){
                var logs = deviceData.filter(function(logs){ return logs.ip == device.ip && logs.browser == device.browser }); 
                if(!logs[0]){
                    
                    if(!browser[device.browser]){
                       browser[device.browser] = 1; 
                    }else{
                        browser[device.browser] = browser[device.browser] + 1;  
                    }
                    
                    deviceData.push(device);
                }   
            });
           
            res.json({'device':deviceData,browser});
        });
    });
    app.get('/log/allResult',permission.isLogin,function(req,res){
        var visitus = [];
        var unique = [];
        var query = {};
        var pageView = [];

        if(req.query.shopid != 'undefined' && req.query.shopid){
            query = {'shop_id':req.query.shopid};
        }
        
        Log.find(query).lean().exec(function(err ,resultLogs){

            resultLogs.forEach(function(data){
                pageView.push(data);
                var logs = visitus.filter(function(logs){ return logs.ip == data.ip && logs.page == data.page})
                //var d = getDayFull(data.date);
                if(!logs[0]){
                   visitus.push(data); 
                }
            });
            resultLogs.forEach(function(data){
                var logs = unique.filter(function(logs){ return logs.ip == data.ip })
                var d = getDayFull(data.date);
                if(!logs[0]){
                    unique.push(data); 
                }
            });
           
            res.json({'visitus':visitus.length,'unique':unique.length,'pageView':pageView.length});         
        });
         
    });
    app.get('/log/getLogUnique',permission.isLogin, function (req, res){
        var current7day = [];
        var last7day = [];
        var all;
        var query = [];
        var dateLast = getDay(7);
        var last = getDay(14);
        var weekday = new Array(7);
        var lastweekday = new Array(7);
        weekday[0] = 0;lastweekday[0] = 0
        weekday[1] = 0;lastweekday[1] = 0
        weekday[2] = 0;lastweekday[2] = 0
        weekday[3] = 0;lastweekday[3] = 0
        weekday[4] = 0;lastweekday[4] = 0
        weekday[5] = 0;lastweekday[5] = 0
        weekday[6] = 0;lastweekday[6] = 0
        if(req.query.shopid != 'undefined' && req.query.shopid){
            query[0] = {'shop_id':req.query.shopid,'date':{$gt: dateLast,$lt: fn.getTime()}};
            query[1] = {'shop_id':req.query.shopid,'date':{$gt: last,$lte: dateLast}}
        }else{
            query[0] = {'date':{$gt: dateLast,$lt: fn.getTime()}};
            query[1] = {'date':{$gt: last,$lte: dateLast}}
        }
        Log.find(query[0]).lean().exec(function(err ,result){
            result.forEach(function(data){
                var logs = current7day.filter(function(logs){ return logs.ip == data.ip })
                var d = getDayFull(data.date);
                if(!logs[0]){
                    weekday[d.getDay()] = weekday[d.getDay()] + 1;
                    current7day.push(data); 
                }
            });
            
            Log.find(query[1]).lean().exec(function(err ,resultLast){
                resultLast.forEach(function(data){
                    var logs = last7day.filter(function(logs){ return logs.ip == data.ip })
                    var d = getDayFull(data.date);
                    if(!logs[0]){
                        lastweekday[d.getDay()] = lastweekday[d.getDay()] + 1;
                        last7day.push(data); 
                    }
                });
                var result = getResult(current7day.length,last7day.length);
                all = {'current7day':current7day,'last7day':last7day,'weekday':weekday,'lastweekday':lastweekday,'result':result};
                res.json(all);
            });
        });
    });   
    app.get('/log/getLog',permission.isLogin, function (req, res){
        
        var current7day = [];
        var last7day = [];
        var all;
        var dateLast = getDay(7);
        var last = getDay(14);
        var query = [];
        var day = [];
        var weekday = new Array(7);
        var lastweekday = new Array(7);
        weekday[0] = 0;lastweekday[0] = 0
        weekday[1] = 0;lastweekday[1] = 0
        weekday[2] = 0;lastweekday[2] = 0
        weekday[3] = 0;lastweekday[3] = 0
        weekday[4] = 0;lastweekday[4] = 0
        weekday[5] = 0;lastweekday[5] = 0
        weekday[6] = 0;lastweekday[6] = 0
        
        if(req.query.shopid != 'undefined' && req.query.shopid){
            query[0] = {'shop_id':req.query.shopid,'date':{$gt: dateLast,$lt: fn.getTime()}};
            query[1] = {'shop_id':req.query.shopid,'date':{$gt: last,$lte: dateLast}}
        }else{
           
            query[0] = {'date':{$gt: dateLast,$lt: fn.getTime()}};
            query[1] = {'date':{$gt: last,$lte: dateLast}}
        }
        Log.find(query[0]).lean().exec(function(err ,result){
            //console.log(result)
            result.forEach(function(data){
                var logs = current7day.filter(function(logs){ return logs.ip == data.ip && logs.page == data.page})
                var d = getDayFull(data.date);
                if(!logs[0]){
                    weekday[d.getDay()] = weekday[d.getDay()] + 1;
                    current7day.push(data); 
                }
            });

            
            Log.find(query[1]).lean().exec(function(err ,resultLast){

                resultLast.forEach(function(data){
                    var logs = last7day.filter(function(logs){ return logs.ip == data.ip && logs.page == data.page})
                    var d = getDayFull(data.date);
                    if(!logs[0]){
                        lastweekday[d.getDay()] = lastweekday[d.getDay()] + 1;
                        last7day.push(data); 
                    }
                });
                var result = getResult(current7day.length,last7day.length);
                all = {'current7day':current7day,'last7day':last7day,'weekday':weekday,'lastweekday':lastweekday,'result':result};
                res.json(all);
            });
        });
    });

    app.get('/log/logWeb', function(req, res){
         
        var ref = req.header('Referrer');  
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress; 
        var new_ip = ip.replace(/^.*:/, ''); 
        
        if(fn.isEmpty(ref)){
            var r = '';
        }else{
            var r = ref;
        }

        if(fn.isEmpty(req.body.shop_id)){
            var s = '';
        }else{
            var s = req.body.shop_id;
        }
        var today = new Date();
        
        var arr_ip = [];
        var web = ['www.facebook.com','www.twitter.com','www.google.com'];
        for(var i =1 ;i<20;i++){
            var name = makeid();
            web.push('www.'+name+'.com');
        }
        for(var i = 0;i<50;i++){
            arr_ip.push('192.168.0.'+i); 
        }
        
        var page = ['/about','/visitus','/community','/home'];
        var browser = ['Chrome','Firefox','Opera','Safari'];
        var platform = ['Android','Microsoft Windows','iPad','iPhone']
        var useragent = req.useragent
        
        
        for(i=0;i<100;i++){

            var item = arr_ip[ Math.floor(Math.random()*arr_ip.length)];
            var route = page[Math.floor(Math.random()*page.length)];
            var bro = browser[Math.floor(Math.random()*browser.length)];
            var plat = platform[Math.floor(Math.random()*platform.length)];
            
            var referrer = web[Math.floor(Math.random()*web.length)];
            // var a2 = Math.floor(Math.random() * 16 );
            // var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - a2);
            var a2 = Math.floor(Math.random() * 30 );
            var lastWeek = new Date(today.getFullYear(), today.getMonth()-1, a2);
            var d = new Date(lastWeek);
            var dateLast = d.getTime() / 1000;
            // req.useragent.browser = bro;
            // req.useragent.platform = plat;

            //setTimeout(function(){
                var data = {
                    'shop_id':s,
                    'ip':item,
                    'browser':bro,
                    'platform':plat,
                    'referrer':referrer, 
                    'date':dateLast,
                    'page':route
                } 
               
            
             var insert =  new Log(data);
               insert.save(function(err){ 
                    
                    
                }); 
            
            
        }

        res.send('success');
        
            

        // var data = {
        //     'shop_id':s,
        //     'ip':new_ip,
        //     'useragent':req.useragent, 
        //     'referrer':r, 
        //     'data':Date.now(),
        // } 

        // var insert = new Log(data);
        // insert.save(function(err, result){
        //     if(err){
        //         res.send(err);
        //     }else{
        //         res.send(result);
        //     } 
        // }); 
    });
}