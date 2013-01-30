var azure = require('azure');

/**
 * class managing table operations
 * @param {string} endpoint string for the connection to the azure services
 */
function Table(endpoint) {
	this._tableService = azure.createTableService(endpoint);
}

Table.prototype = {

	/**
	 * show all the tables for the logged user
	 * @param  {object} req http request
	 * @param  {object} res http response
	 */
	showAll : function(req, res) {
		var self = this;

		console.log('Called Table.showTables');

		self._tableService.queryTables(function(err, tables) {
			res.render('tables', {title: 'Tables list', tables: tables});
		});
	},

	/**
	 * show the table content
	 * the queue ID is passed in request parameters
	 * @param  {object} req http request
	 * @param  {object} res http response
	 */
	showTable : function(req, res) {
		var self = this;

		var tableName = req.params.table;

		console.log('Called Table.showTable on ' + tableName);

		var query = azure.TableQuery
			.select()
			.from(tableName);

			self._tableService.queryEntities(query, function(err, entities){
				if (!err) {
					var results = [];

					//organize the results in a better way, easier to show in the template
					for (i in entities) {
						var entity = {};
						entity.id = entities[i].id;
						delete entities[i].id;
						entity.link = entities[i].link;
						delete entities[i].link;
						entity.updated = entities[i].updated;
						delete entities[i].updated;
						entity.etag = entities[i].etag;
						delete entities[i].etag;
						entity.PartitionKey = entities[i].PartitionKey;
						delete entities[i].PartitionKey;
						entity.RowKey = entities[i].RowKey;
						delete entities[i].RowKey;
						entity.Timestamp = entities[i].Timestamp;
						delete entities[i].Timestamp;
						entity.entity = entities[i];

						results.push(entity);
					}

					res.render('table', {title: 'Entities list', entities: results});
				}
				else
					console.log('error query entities' + err);
			});
	}
}

module.exports = Table;