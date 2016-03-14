/* global Arrow, connector, server */
var Client = {};
require('promise');
var base = require('./_base'),
    should = require('should'),
    assert = require('assert'),
    async = require('async'),
    request = require('request'),
    path = require('path'),
    m_client = require('../lib/client').Client;

describe('Connector', function() {
    var Model;

    before(function(next) {
        Model = server.getModel('customsearch');
        //Get an instance of the newly created client
        Client = connector.client;
        //Model should exist
        should(Model).be.an.object;
        //Model should not be generated
        should(Model.generated).be.false;
        //Model should not expose apis
        should(Model.autogen).be.false;
        //Client should be ok
        should(Client).be.ok();
        should(Client).be.instanceOf(m_client);
        next();
    });

    after(function(next) {
        //void
        next();
    });

    it('should be able to fetch metadata', function(next) {
        connector.fetchMetadata(function(err, meta) {
            should(err).be.not.ok;
            should(meta).be.an.object;
            should(Object.keys(meta)).containEql('fields');
            next();
        });
    });


    // Endpoint generation is disabled...
    it('should not be able to findAll', function(next) {

        Model.findAll(function(err, coll) {
            should(err).be.ok;
            next();
        });
    });

    //Check if API is properly registered with the server
    it('should initialize api', function(next) {
        should(server.getAPI('Query')).be.ok();
        next();
    });

    /**
     * Model tests
     */
    describe('customsearch Model', function() {

        //should not generate endpoints
        it('should not generate endpoints', function(next) {
            //No autogen
            should(Model.autogen).be.false();
            next();
        });

    });


    /**
     * Connector script tests
     */
    describe('client.js', function() {

        it('should be initialized properly', function(next) {
            var options = Client.options;
            //check if options exist
            should(options).be.an.Object();
            //check if config isset (should not be set just yet)
            should(Client.config.cx).be.not.ok();
            should(Client.config.cref).be.not.ok();
            next();
        });

        it('should connect to google', function(next) {
            Client.connect(connector);
            var config = Client.config;
            //check if config exists
            should(config).be.an.Object();
            should(Client.url.indexOf('https://www.googleapis.com/customsearch/v1')).be.eql(0);
            next();
        });

        //Check if google search error result is intercepted
        it('should generate url', function() {
            var self = Client;
            self.connect(connector);
            var opts = {
                where: '{"q":"custom search"}',
                per_page: 14,
                start: 1
            };
            self.setParameters(opts);
            should(self.url).be.endWith('&q=custom search&num=14&start=1', "query parameters should be set");
        });

        //Check if google search error result is intercepted
        it('should not search correctly', function() {
            var self = Client;
            self.connect(connector);
            var opts = {
                where: '{"q":"custom search"}',
                per_page: 14,
                start: 1,
                end: 15,
                order_by: 14 // this one is not supported
            };
            self.setParameters(opts).query(function(error, response, body) {
                should(error).not.be.an.Object();
                should(body.error).be.an.Object();
            });
        });

        //should check if where clause exists
        it('should check if where clause exists', function(next) {
            var self = Client;
            self.connect(connector);
            var opts = {
                per_page: 14,
                start: 1
            };
            //where clause is not set
            (function() { self.setParameters(opts); })
                .should.throw();
            next();
        });

        //should check if q isset
        it('should check if where clause exists', function(next) {
            var self = Client;
            self.connect(connector);
            var opts = {
                where: JSON.stringify({ "query": "custom search" }),
                per_page: 14,
                start: 1
            };
            //where.q is not set
            (function() { self.setParameters(opts); })
                .should.throw();
            next();
        });

        //Disconnects to google
        it('should disconnect properly', function(next) {
            Client.disconnect(connector);
            var self = Client;
            should(self.config.key).be.not.ok();
            should(self.url).be.not.ok();
            next();
        });

        //Check if returns results
        it('should return results', function() {
            var self = Client;
            self.connect(connector);
            var opts = {
                where: '{"q":"custom search"}',
                skip: 1,
                per_page: 3
            };
            //Make a request using the client
            self.setParameters(opts);
            self.query(function(error, response, body) {
                should(body).be.an.Object();//be an Object
                //Should have no errors in response
                should(body.error).be.not.ok();
            });

        });

    });


    /**
     * Endpoint tests
     */
    describe('customSearch API', function() {
        var auth = {},
            accessToken,
            instanceUrl;
        var self;
        var promise;
        var query_params;

        before(function(next) {
            //Set server Authentication to 'basic'
            server.APIKeyAuthType = 'basic';
            //Configure authemtication
            auth = {
                user: server.config.apikey,
                password: ''
            };
            //Query Parameters
            var _query_params = {
                where: JSON.stringify({ 'q': 'search document' })
            };
            query_params = _creteQuery(_query_params);
            //Just in case check the final format
            should(query_params).be.a.String();
            //proCeed
            next();
        });
        
        //Checks if authentication is properly set
        it('should allow authenticated requests only', function checkAuthIsON(next) {
            var api = server.getAPI('Query');
            var url = 'http://localhost:' + server.port + api.path + query_params;
            //Auth type should be set to basic, in order for future requests to succeed
            should(server.APIKeyAuthType).containEql('basic');
            //Make an authenticated request to the API
            request({
                method: 'GET',
                uri: url,
                json: true
            }, function(err, response, body) {
				should(body.success).be.false;
				should(body.message).containEql('Unauthorized');
                next();
            });
        });


        it('should have a context field', function checkContext(next) {
            var api = server.getAPI('Query');
            var url = 'http://localhost:' + server.port + api.path + query_params;
            //Make an authenticated request to the API
            request({
                method: 'GET',
                uri: url,
                auth: auth,
                json: true
            }, function(err, response, body) {
                should(body).be.an.Object();
                should(body.success).be.true;
                //Context should be set
                should(body.context).be.an.Object();
                should(body.context.title).be.a.String();
                //Facets as well
                should(body.context.facets).be.an.Object();
                next();
            });
        });
        
        /**
         * Checks API's error response (if google returns an error)
         */
        it('should display error status and message', function makeWrongRequest(next) {
            var api = server.getAPI('Query');
            var _q = {
                where: JSON.stringify({ 'q': 'search document' }),
                per_page : 14,
                custom: 1
            };
            var query = _creteQuery(_q);
            var url = 'http://localhost:' + server.port + api.path + query;
            //Make an authenticated request to the API
            request({
                method: 'GET',
                uri: url,
                auth: auth,
                json: true
            }, function(err, response, body) {
                should(body).be.an.Object();
                should(body.success).be.false;
                should(body.message).be.a.String();
                next();
            });
        });

    });

});
/**
 * Creates query string from an object 
 */
function _creteQuery(params) {
    var i = 0;
    for (var key in params) {
        if (i === 0) {
            this._query = '?' + key + '=' + params[key];
        } else {
            this._query += '&' + key + '=' + params[key];
        }
        //increment
        i++;
    }
    return this._query;
}