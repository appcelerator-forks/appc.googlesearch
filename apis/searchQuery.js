var Arrow = require('arrow'),
    Collection = Arrow.Collection,
    ORMError = Arrow.ORMError;
    
var config = Arrow.getGlobal().config;
var apiPrefix = config.apiPrefix
var apiPath = apiPrefix + '/customsearch/query'
var connector = Arrow.getConnector('appc.googlesearch');
var Model = Arrow.getModel('customsearch');
var client = connector.client;
var meta_context = {};
var _response = {};
var _error = {};

var searchQuery = Arrow.API.extend({
    group: 'Googel Search',
    path: apiPath,
    method: 'GET',
    nickname : 'Query',
    description: 'API endpoint that retrieves results from google custom search REST API. Use per_page, limit, skip parameters to page the results. Response also returns a context object, which holds extra information on the results (Total number of results, facets in this set etc.).',
    model: 'customsearch',
    parameters: {
        where: { description: 'where clause. Its query parameter is required', optional: false, default : '{"q" : "searchterm"}' },
        linkSite: { description: 'Link Site', optional: true },
        lowRange: { description: 'Low Range', optional: true },
        relatedSite: { description: 'Related Site', optional: true },
        searchType: { description: 'Search Type', optional: true },
        siteSearch: { description: 'Site Search', optional: true },
        siteSearchFilter: { description: 'Site Search Filter', optional: true },
        per_page: { description: 'Items per page', optional: true },
        limit: { description: 'Items limit', optional: true },
        skip: { description: 'Skip number of results', optional: true },
        // page: { description: 'Page ', optional: true },
        order: { description: 'Order By', optional: true },
    },
    action: function (req, resp, next) {
        //Initialize the object
        _response = {
            'success': true,
            'request-id': req.getId(),
            'key': 'customsearches',
            'customsearches': [],
            'context': meta_context
        }
        _error = {
            'success': false,
            'request-id': req.getId(),
            'message' : ''
        }
        
        //Create and send the response object
        _respond(req, resp, req.params, next);
    }
});

/**
 * Retrieve data from google REST service and return a response
 * This property also fills out the _response object.
 */
function _respond(req, resp, options, next) {
    return client
        .setParameters(options)
        .query(function (error, response, body) {
            if (error || body.error) {
                if (error) _error.message = error + ' ';
                if (body.error) _error.message += body.error.message;
                resp.send(_error)
            } else {
                //Success, let's create and return a Collection of models
                var results = client.prepareResults(body.items, Model);
                meta_context.title = body.context.title
                meta_context.facets = body.context.facets
                meta_context.totalResults = body.searchInformation.totalResults
                meta_context.restUrl = client.url;
                _response.context = meta_context;
                _response.customsearches = new Collection(Model, results);
                resp.send(_response, 'customsearches')
            }            
            next();
        });
}

module.exports = searchQuery;