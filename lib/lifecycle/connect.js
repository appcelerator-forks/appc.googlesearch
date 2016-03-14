var Client = require('../client').Client;
var search = new Client();
/**
 * Connects to your data store; this connection can later be used by your connector's methods.
 * @param next
 */
exports.connect = function (next) {
    this.client = search;
    search.connect(this);
    next();
};
