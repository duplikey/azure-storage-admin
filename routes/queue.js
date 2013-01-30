var azure = require('azure');

/**
 * class managing queue operations
 * @param {string} endpoint string for the connection to the azure services
 */
function Queue(endpoint) {
	this._queueService = azure.createQueueService(endpoint);
}

Queue.prototype = {

	/**
	 * show all the queues for the logged user
	 * @param  {object} req http request
	 * @param  {object} res http response
	 */
	showAll : function(req, res) {
		var self = this;

		console.log('Called Queue.showAll');

		self._queueService.listQueues(function(err, queues) {
			res.render('queues', {title: 'Queues list', queues: queues});
		});
	},

	/**
	 * show the queue content
	 * the queue ID is passed in request parameters
	 * @param  {object} req http request
	 * @param  {object} res http response
	 */
	showQueue : function(req, res) {
		var self = this;

		var queueName = req.params.queue;

		console.log('Called Queue.showQueue on ' + queueName);

		self._queueService.peekMessages(queueName, 
			//32 is the max number of messages for a single call
			{numofmessages: 32},
			function(err, messages){
				if(!err)
					res.render('queue', {title: 'Messages list', messages: messages});
				else
					console.log('error peeking messages ' + err);
			}
		);
	}
}

module.exports = Queue;