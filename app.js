var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var memwatch = require('memwatch');
var routes = require('./routes');
var util = require('util');

var hd = new memwatch.HeapDiff();

app.configure(function(){
	app.set('name', 'Azure Storage Admin started on port');
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	//app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.cookieSession({'secret':'qaz321jhy78ilkf9999d30'}));
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

var User = require('./modules/user');
var user = new User();

//main routes
app.get('/', user.isLoggedIn, routes.index);
app.get('/login', routes.login);
app.get('/logout', user.logout);
app.post('/login', user.login.bind(user));

//queues routes
app.get('/queues', user.isLoggedIn, function(req, res) {
	user.queue.showAll(req, res);
});

app.get('/queues/:queue', user.isLoggedIn, function(req, res) {
	user.queue.showQueue(req, res);
});

//tables routes
app.get('/tables', user.isLoggedIn, function(req, res) {
	user.table.showAll(req, res);
});

app.get('/tables/:table', user.isLoggedIn, function(req, res) {
	user.table.showTable(req, res);
})

http.createServer(app).listen(app.get('port'), function() {
	console.log(app.get('name') + ' ' + app.get('port'));

	var diff = hd.end();
	//console.log(util.inspect(diff, false, 4, true));
});