module.exports = function(app){
    app.post('/send_mail/sendMail',function(req,res){  
        var api_key = 'key-878e35f184113b9e514598e5628dd59a';
        var domain = 'sandbox4f22399a413a49df887fb06b3c64f974.mailgun.org';
        var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
        
        var data = {
          from: req.body.from,
          to: req.body.to,
          subject: req.body.subject,
          text: req.body.message
        }; 
         
       mailgun.messages().send(data, function (error, body) {
         if(error){
             res.json(error);
             
         }else{
             res.json('success');
         }
        });
      
    });
}