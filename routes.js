module.exports = function (app) {

	app.get('/', function(req, res) {
		res.render('index', {title: "Main page"});
	});

	app.get('/facebook', function(req, res) {
		res.render('facebook', {title: "Facebook app"});
	});

	app.post('/facebook/*', function(req, res) {
		res.redirect('facebook');
	})

};