var Client = require('../client').Client
var search = new Client();

/**
 * Disconnects from your data store.
 * @param next
 */
exports.disconnect = function (next) {
	search.disconnect(this);
    next();
};
