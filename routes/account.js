User = require("../models/user").Model;
GUID = require("../lib/GUID");
mailer = require("../lib/mailer");

module.exports = function(app) {

    // user account page
    app.get('/account', function(req, res) {
        res.render('account/account', { user: req.user });
    });

    // logout
    app.get('/logout', function(req, res) {
        res.redirect('/');
    });

    // login
    app.get('/login', function(req, res) {
        res.render('account/login');
    });

    app.get('/register', function(req, res){
      res.render('account/register');
    });

    app.post('/register', function(req, res) {
      var b, newUser;
      b = req.body;
      if (b.username) {
          newUser = new User();
          newUser.username = b.username;
          newUser.uvid = GUID.token();
          return newUser.save(function(err) {
            if (err) {
              return res.render('account/register', {
                message: err
              });
            } else {
              mailer.mail({
                              from: "HoneyComb Admin <group5honeycomb@gmail.com>", // sender address
                              to: newUser.username+"@spsu.edu", // list of receivers
                              subject: "Account Verification", // Subject line
                              text: "You just signed up for the HoneyComb. If this was you, please click this link here to set your password: http://HoneyComb.jit.su/reset/"+newUser.uvid // plaintext body
                          }, function (err, response){
                              if(err){
                                res.render('account/register', {
                                  message: err
                                });
                              } 
                              else{                           
                                res.render('index', {
                                  message: 'You have been successfully registered, please follow the instructions sent to your email to proceed.'
                                });                                
                              }
                          });
            }
          });
      } else{
        return res.render('account/register', {
          message: 'username is required'
        });
      }
    });

    app.get('/reset/:uvid', function(req, res){
      
    });
}

