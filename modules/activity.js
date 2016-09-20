var Activity = cm.model('activity');
var mongoose = require('mongoose');
var multer = require('multer');
var sizeOf = require('image-size');
const fs = require('fs');
module.exports = function(app) {

    app.post('/activity/getActivity', function(req, res) {
        Activity.find({
            'shop_id': req.body.shop_id
        }).sort({
            '_id': 'desc'
        }).lean().exec(function(err, result) {
            res.json(result);
        });
    });
    app.post('/activity/getActivitySkip', function(req, res) {
        Activity.find({
            'shop_id': req.body.shop_id
        }).sort({
            '_id': 'desc'
        }).skip(req.body.start).limit(6).lean().exec(function(err, result) {
            res.json(result);
        });
    });

    app.post('/activity/getAllActivity', function(req, res) {
        Activity.find().lean().exec(function(err, result) {
            res.json(result);
        });
    });

    app.post('/activity/getActivityLimit', function(req, res) {
        Activity.find({
            'shop_id': req.body.shop_id
        }).sort({
            '_id': 'desc'
        }).limit(6).lean().exec(function(err, result) {
            res.json(result);
        });
    });

    app.post('/activity/getIndexActivity', function(req, res) {
        Activity.findOne({
            'index': req.body.index
        }).lean().exec(function(err, result) {
            res.json(result);
        });
    });

    app.post('/activity/addActivity', function(req, res) {
        upload(req, res, function(err) {
            console.log(req.body);
            if (err) {
                res.json(err)
            } else {
                var dimensions = sizeOf('./upload/' + req.file.filename);
                console.log(dimensions.width, dimensions.height);
                var ac = new Activity({
                    shop_id: req.body.shop_id,
                    activity_img: '/upload/' + req.file.filename,
                    width: dimensions.width,
                    height: dimensions.height,
                    caption_en: req.body.en_message,
                    caption_th: req.body.th_message
                });
                ac.save(function(err) {
                    if (err) {
                        res.json(err)
                    } else {
                        res.json(ac)
                    }
                })
            }
        })
    });

    app.post('/activity/updateActivity', function(req, res) {
        Activity.findOneAndUpdate({
            '_id': req.body.id
        }, req.body.dataArr).lean().exec(function(err, result) {
            res.json(result);
        });
    });

    app.post('/activity/delActivity', function(req, res) {
        Activity.findOne({
            '_id': req.body._id
        }).lean().exec(function(err, result2) {
            if (result2.activity_img != 'empty') {
                fs.unlink('.' + result2.activity_img);
                res.json(result2);
            }
            Activity.remove({
                '_id': req.body._id
            }).lean().exec(function(err, result) {

            });
        });

    });

    app.post('/activity/changeIndex', function(req, res) {
        Activity.findOne({
            'shop_id': req.body.shop_id,
            'index': req.body.index
        }).lean().exec(function(err, data1) {
            console.log(data1.index - 1);
        });
    });

    app.post('/activity/getActivityById', function(req, res) {
        Activity.findOne({
            '_id': req.body._id
        }).lean().exec(function(err, result) {
            res.json(result);
        });
    });

    app.post('/activity/editActivity', function(req, res) {
        Activity.findOneAndUpdate({
            '_id': req.body._id
        }, req.body.dataArr).lean().exec(function(err, result) {
            res.json(result);
        });
    });

    app.post('/activity/uploadActivity', function(req, res) {
        var storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, './resources/activity');
            },
            filename: function(req, file, cb) {
                cb(null, 'mainActivity_' + Date.now() + '_' + file.originalname);
            }
        })
        var upload = multer({
            storage: storage
        }).any();
        upload(req, res, function(err) {
            if (err) {
                res.json(err);
            } else {
                var dimensions = sizeOf('./resources/activity/' + req.files[0].filename);

                if(req.body.event_id == 'undefined'){
                    var dataArr = {
                        'shop_id': req.body.shop_id,
                        'activity_img': '/resources/activity/' + req.files[0].filename,
                        'width': dimensions.width,
                        'height': dimensions.height,
                        'caption_en': req.body.caption_en,
                        'caption_th': req.body.caption_th, 
                        'date': Date.now()
                    }
                   
                }else{
                     var dataArr = {
                        'shop_id': req.body.shop_id,
                        'activity_img': '/resources/activity/' + req.files[0].filename,
                        'width': dimensions.width,
                        'height': dimensions.height,
                        'caption_en': req.body.caption_en,
                        'caption_th': req.body.caption_th,
                        'event_id': req.body.event_id,
                        'date': Date.now()
                    }

                }


                var insert = new Activity(dataArr);
                insert.save(function(err, result) {
                    res.json(result);
                });
            }
        })
    });

    app.post('/activity/EdituploadActivity', function(req, res) {

        var storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, './resources/activity');
            },
            filename: function(req, file, cb) {
                cb(null, 'mainActivity_' + Date.now() + '_' + file.originalname);
            }
        })
        var upload = multer({
            storage: storage
        }).any();
        upload(req, res, function(err) {
            if (err) {
                res.json(err);
            } else {

                Activity.findOne({
                    '_id': req.body._id
                }).lean().exec(function(err, result2) {
                    if (result2.activity_img != 'empty') {
                        fs.unlink('.' + result2.activity_img);
                    }
                });

                var dimensions = sizeOf('./resources/activity/' + req.files[0].filename);
                var dataArr = {

                    // '_id':req.body._id,
                    'shop_id': req.body.shop_id,
                    'activity_img': '/resources/activity/' + req.files[0].filename,
                    'width': dimensions.width,
                    'height': dimensions.height,
                    'caption_en': req.body.caption_en,
                    'caption_th': req.body.caption_th,
                    'event_id': req.body.event_id ? mongoose.Types.ObjectId(req.body.event_id) : '',
                    'date': Date.now()
                }
 
                Activity.findOneAndUpdate({
                    '_id': req.body._id
                }, dataArr).lean().exec(function(err, result) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(result);
                    }

                    //console.log(dataArr);
                });
            }
        })
    });
}