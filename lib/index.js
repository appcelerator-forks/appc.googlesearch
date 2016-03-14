var _ = require('lodash'),
    semver = require('semver');


exports.create = function (Arrow) {
    var min = '1.7.0';
    if (semver.lt(Arrow.Version || '0.0.1', min)) {
        throw new Error('This connector requires at least version ' + min + ' of Arrow; please run `appc use latest`.');
    }
    var Connector = Arrow.Connector,
        Capabilities = Connector.Capabilities;
    var server = Arrow.getGlobal();

    /**
     * Register a custom api endpoint with the application
     * This should be done after the app registers all Models (inlucing customsearch Model)
     */
    server.on('starting', function () {
        require('./api/searchQuery.js');
    });

    return Connector.extend({
        filename: module.filename,
        capabilities: [
            Capabilities.ConnectsToADataSource,
            Capabilities.ValidatesConfiguration,
            Capabilities.ContainsModels,
            // Capabilities.CanRetrieve
        ]
    });
};
