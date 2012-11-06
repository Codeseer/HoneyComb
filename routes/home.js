module.exports = function(app) {

    // home page
    app.get('/', function(req, res) {        
        res.render('index', {user: req.user});
    });

    // about page
    app.get('/about', function(req, res) {
        res.render('about', {user: req.user});
    });
}
