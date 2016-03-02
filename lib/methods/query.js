var Arrow = require('arrow'),
    Collection = Arrow.Collection,
    ORMError = Arrow.ORMError;

exports.query = function findAll(Model, options, callback) {

    var client = this.client;

    client.setParameters(options)
        .query(function (error, response, body) {
            if (error || body.error) {
                this.logger.error(error + "\r\n" + body.error);
                return callback(new ORMError('ERROR: Could not retrieve data from Google!'));
            } else {
                //Success, let's create and return a Collection of models
                var results = client.prepareResults(body.items, Model);
                return callback(null, new Collection(Model, results));
            }
        });
};


exports.count = function (Model, options, callback) {
    var client = this.client;
    var self = this;
    client.setParameters(options)
        .query(function (error, response, body) {
            if (error || body.error) {
                self.logger.error(error + "\r\n" + body.error);
                return callback(new ORMError('ERROR: Could not retrieve data from Google!'));
            } else {
                self.logger.trace("Google returned " + body.searchInformation.totalResults + " results");
                return callback(null, body.searchInformation.totalResults);
            }
        });
}