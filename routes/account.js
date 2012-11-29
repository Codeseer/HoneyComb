var User = require("../models/user").Model;
var GUID = require("../lib/GUID");
var mailer = require("../lib/mailer");

module.exports = function(app) {

    // user account page
    app.get('/account', function(req, res) {
      if(req.user){
        res.render('account/account', { user: req.user });
      } else {
        res.redirect('/login');
      }
    });
    
    // desire promotion
    app.get('/dpromotion', function(req, res) {
      req.user.dpromotion = true;
      req.user.save(function(err){
        res.redirect('/account');
      });      
    });
    
    // promote user
    app.post('/promote', function(req, res) {
      var b;
      b = req.body;
      if(b.username) {
        User.findOne({username: b.username}).exec(function(err, user){
          if(!err){
            if (user.dpromotion)
            {
              user.dpromotion = false;
              if (user.student)
              {
                user.student=false;
              }
              else if (!user.admin)
              {
                user.admin = true;
              }
            }            
            user.save(function(err){                
              res.redirect('/adminapproval');
            });
          }
        });
      }
    });
    
    //view pending promotions
    app.get('/adminapproval', function(req, res) {
      if(typeof(req.user) != 'undefined'){
      if(req.user.admin == true){  
        User.find({dpromotion: true}).exec(function(err, users) {
          if(!err){
            res.locals.users = users
            res.render('adminapproval');
          }
        });        
      }
      else{
        res.redirect('/');
      }
      }
      else
      {
        res.redirect('/');
      }      
    });
    
    // step down
    app.get('/stepdown', function(req, res) {
      req.user.dpromotion = false;
      req.user.admin = false;
      req.user.student = true;
      req.user.save(function(err){
        if (!err){          
          res.redirect('/account');
        }
      });      
    });


    // logout
    app.get('/logout', function(req, res) {
        req.logOut();
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
                              text: "You just signed up for the HoneyComb. If this was you, please click this link here to set your password: http://honeycomb.herokuapp.com/reset/"+newUser.uvid // plaintext body
                          }, function (err, response){
                              if(err){
                                res.render('account/register', {
                                  message: err
                                });
                              } 
                              else{                           
                                res.render('index', {
                                  message: 'You have been successfully registered, please follow the instructions sent to your email <'+newUser.username+'@spsu.edu> to proceed.'
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
      res.render('account/reset', {uvid: req.params.uvid});
    });

    app.post('/reset', function(req, res){
      if(req.body.uvid !== ''){        
        User.findOne({uvid: req.body.uvid}).exec(function (err, user){
          if(!err){
            user.password = req.body.password;
            user.uvid = GUID.token();
            user.save(function (err){
              if(!err){
                res.render('index', {message: 'You have reset your password.'});
              }
              else{
                res.render('index', {message: err});
              }
            });
          } else {
            res.render('index', {message: 'Verfication ID unknown.'});
          }
        });
      }
    });

    app.get('/reset', function(req, res){
      res.render('account/sendreset', {user: req.user});
    });

    app.post('/resetRequest', function(req, res){
      if(req.body.username){
        User.findOne({username: req.body.username}).exec(function (err, user){
          if(err){
            res.render('account/sendrequest', {message: err});
          }
          else {
            user.uvid = GUID.token();
            user.save(function(err){
              if(err){                
                res.render('account/sendrequest', {message: err});
              }else{
                mailer.mail({
                              from: "HoneyComb Admin <group5honeycomb@gmail.com>", // sender address
                              to: user.username+"@spsu.edu", // list of receivers
                              subject: "Password Reset", // Subject line
                              text: "Someone has requested a password reset for the HoneyComb account associated with this email. If this was you please go to: http://honeycomb.herokuapp.com/reset/"+user.uvid // plaintext body
                          }, function (err, response){
                              if(err){
                                res.render('account/sendrequest', {
                                  message: err
                                });
                              } 
                              else{                           
                                res.render('index', {
                                  message: 'Please follow the instructions sent to your email <'+user.username+'@spsu.edu> to reset your password.'
                                });                                
                              }
                          });
              }
            });
          }
        });
      }else{
        res.render('account/sendreset', {message: 'Username required.'});
      }
    });
}

