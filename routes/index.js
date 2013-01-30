//just render few static pages

exports.index = function(req, res){
	res.render('index', { title: 'Storage account' });
}

exports.login = function(req, res){
	res.render('login', { title: 'Login' });
}