var Queue = require('../routes/queue');
var Table = require('../routes/table');

/**
 * class defining the use behaviour
 */
function User() {
	//azure services to use queues and tables
	this.queue = null;
	this.table = null;
}

User.prototype = {

	/**
	 * create the user session
	 * @param  {object} req http request
	 * @param  {object} res http response
	 */
	login : function(req, res) {
		var self = this;

		console.log('Called User.login');

		req.session.account_name = req.body.account_name;
		req.session.account_key = req.body.account_key;

		//create the endpoint for the azure connection
		req.session.endpoint = 'DefaultEndpointsProtocol=https' +
			';AccountName=' + req.session.account_name +
			';AccountKey=' + req.session.account_key;

		//create the azure storage services
		self.queue = new Queue(req.session.endpoint);
		self.table = new Table(req.session.endpoint);

		res.redirect('/');
	},

	/**
	 * test if the user is logged in
	 * @param  {req}   req  http request
	 * @param  {res}   res  http response
	 * @param  {function} next function to call if the user is logged in
	 */
	isLoggedIn : function(req, res, next) {
		console.log('Called User.isLoggedIn');

		if (req.session.account_name != undefined && 
				req.session.account_key != undefined){
			next();
		}
		else
			res.redirect('/login');
	},

	/**
	 * delete the user session
	 * @param  {req}   req  http request
	 * @param  {res}   res  http response
	 */
	logout : function(req, res) {
		console.log('Called User.logout');
		
		req.session = null;
		res.redirect('/');
	}
}

module.exports = User;