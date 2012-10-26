module.exports = function(app) {

    // home page
    app.get('/', function(req, res) {        
        res.render('index', { title: 'HoneyComb' })
    });

    // about page
    app.get('/about', function(req, res) {
        res.render('about', { title: 'About Me' })
    });
    
    // test page
    app.get('/member', function(req, res){
        res.render('member', { title: "Member's page" })
    });    
}
