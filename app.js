
/**
* MODULE DEPENDENCIES
* -------------------------------------------------------------------------------------------------
* include any modules you will use through out the file
**/

var express = require('express')
  , http = require('http')
  , path = require('path')
  , less = require('less')
  , connect = require('connect')  
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('mongoose')
  , User = require('./models/user').Model;
/**
Setup the GridFS database connection
**/
require('./models/file').setupFiles();
mongoose.connect('mongodb://nodejitsu:86d59b25b056ab3ce0a7a1c3c966499b@alex.mongohq.com:10064/nodejitsudb840119704884');
var app = module.exports = express();

/**
* CONFIGURATION
* -------------------------------------------------------------------------------------------------
* set up view engine (jade), css preprocessor (less), and any custom middleware (errorHandler)
**/

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: '28FFB9ABAB6B0961799D52E171D2E06352B9A0BB8679708A42C98B20AC6680A6' }));
    app.use(passport.initialize());
    app.use(passport.session());  
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  User.findOne(username, function(err, user) {
    done(err, user);
  });
});

passport.use('local', new LocalStrategy(function(username, password, done) {
  User.findOne({
    'username': username
  }, function(err, user) {
    if (err) {
      done(err);
    } else if (!user) {
      done(null, false, {
        message: 'Uknown User'
      });
    } else {
      user.validPassword(password, done);
    }
  });
}));

app.post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }));

/**
* ERROR MANAGEMENT
* -------------------------------------------------------------------------------------------------
* error management - instead of using standard express / connect error management, we are going
* to show a custom 404 / 500 error using jade and the middleware errorHandler (see ./middleware/errorHandler.js)
**/
var errorOptions = { dumpExceptions: true, showStack: true }
app.configure('development', function() { });
app.configure('production', function() {
    errorOptions = {};
});



/**
* ROUTING
* -------------------------------------------------------------------------------------------------
* include a route file for each major area of functionality in the site
**/

require('./routes/home')(app);
require('./routes/account')(app);
require('./routes/file')(app);


/**
* RUN
* -------------------------------------------------------------------------------------------------
* this starts up the server on the given port
**/


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



