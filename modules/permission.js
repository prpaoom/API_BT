var jwt = require('jsonwebtoken');
var secrat_key = 'common@!back!@office!!@#';
var token_blacklist = cm.model('token_blacklist');
module.exports = new function() {
    this.createToken = function(user, req) {
        delete user["password"];
        var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
        user.ip = ip.replace(/^.*:/, '');
        var token = jwt.sign(user, secrat_key, {
            expiresIn: '1 days'
        });
        return token;
    }
    this.toBlackList = function(token, cb) {
        token_blacklist.find({}).lean().exec(function(err, result) {
            result.forEach(function(t) {
                jwt.verify(t.token, secrat_key, function(err_token, user) {
                    if (err_token) {
                        if (err_token.message == 'jwt expired') {
                            token_blacklist.remove({
                                '_id': t._id
                            }).exec();
                        }
                    }
                });
            });
        });
        var blacklist = token_blacklist({
            'token': token
        });
        blacklist.save(function(err) {
            if (err) {
                cb({
                    'status': false,
                    'message': 'add data error'
                });
            } else {
                cb({
                    'status': true
                });
            }
        })
    }
    this.isLogin = function(req, res, next) {
        var access_token = '';
        if (req.query.access_token) {
            access_token = req.query.access_token;
        } else {
            access_token = req.body.access_token;
        }
        jwt.verify(access_token, secrat_key, function(err, user) {
            if (err) {
                res.json(getMessageErrorToken(err));
            } else {
                var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;

                if (user.ip == ip.replace(/^.*:/, '')) {
                    token_blacklist.findOne({
                        'token': access_token
                    }).lean().exec(function(err, result) {
                        if (!result) {
                            var user = jwt.verify(access_token, secrat_key);
                            user.statusLogin = true;
                            req.user = user;
                            return next();
                        } else {
                            res.json({
                                statusLogin: false,
                                message: 'token in blacklist'
                            })
                        }
                    });
                } else {
                    res.json({
                        statusLogin: false,
                        message: 'ip invalid'
                    })
                }
            }
        });
    }

    function getMessageErrorToken(err) {
        err.statusLogin = false
        if (err.message == 'invalid signature') {
            err.message = 'การเข้าถึง Token ผิดพลาด';
            return err;
        } else if (err.message == 'jwt must be provided') {
            err.message = 'ไม่พบข้อมูล token';
            return err;
        } else {
            return err;
        }

    }
}