var request = require('request');
var Client = (function () {
    function Client() {
        this.options = {
            "url": "",
            "method": "GET",
            "bodyParams": {},
            "gzip": true,
            "json": true
        };
    }
    Client.prototype.connect = function (parent) {
        var config = parent.config;
        this.configure(config);
        this._connector = parent;
        parent.logger.trace('Connected to google custom search');
    };
    Client.prototype.disconnect = function (parent) {
        this.config = {};
        this.url = '';
        this._connector = parent;
        parent.logger.trace('Disconnected from google custom search');
    };
    Client.prototype.configure = function (config) {
        if (!config || !config.key)
            throw new Error('Configuration is not set.');
        this.key = config.key;
        this.config = config;
        if (config.cx)
            this.cx = config.cx;
        else if (config.cref)
            this.cref = config.cref;
        if (!this.cx && !this.cref)
            throw new Error('You must provide either cx or cref parameter in your configuration!');
        this.url = 'https://www.googleapis.com/customsearch/v1?key=' + this.key;
        if (this.cx)
            this.url += '&cx=' + this.cx;
        else if (this.cref)
            this.url += '&cref=' + this.cref;
        this.baseUrl = this.url;
        return true;
    };
    Client.prototype.setParameters = function (v) {
        if (!v.where)
            throw "You need to set a where clause and provide a query ('q') parameter";
        if (typeof v.where === 'string' || v.where instanceof String)
            v.where = JSON.parse(v.where);
        if (!v.where.q) {
            throw "You need to provide a query ('q') parameter in where clause.";
        }
        this._parseParameters(v);
        this._creteQuery();
        this.url = this.baseUrl + this._query;
        return this;
    };
    Client.prototype.query = function (callback) {
        this.options.url = this.url;
        return request(this.options, callback);
    };
    Client.prototype.prepareResults = function (results, model) {
        var tmp_results = [];
        if (results && results.length) {
            for (var i = 0; i < results.length; i++) {
                var p_model = this._createIndividualModel(model, results[i]);
                tmp_results.push(p_model);
            }
        }
        return tmp_results;
    };
    Client.prototype._creteQuery = function () {
        var params = this._params;
        var i = 0;
        for (var key in params) {
            if (i === 0) {
                this._query = '&' + key + '=' + params[key];
            }
            else {
                this._query += '&' + key + '=' + params[key];
            }
            i++;
        }
        return this._query;
    };
    Client.prototype._parseParameters = function (v) {
        if (!v.per_page)
            v.where.num = 10;
        else
            v.where.num = v.per_page;
        if (!v.skip)
            v.where.start = 1;
        else
            v.where.start = v.skip;
        if (v.limit)
            v.where.num = v.limit - v.where.start;
        if (v.page) {
            v.where.start = ((v.page - 1) * v.per_page + 1);
        }
        if (v.order)
            v.where.sort = v.order;
        if (v.linkSite)
            v.where.linkSite = v.linkSite;
        if (v.lowRange)
            v.where.lowRange = v.lowRange;
        if (v.relatedSite)
            v.where.relatedSite = v.relatedSite;
        if (v.searchType)
            v.where.searchType = v.searchType;
        if (v.siteSearch)
            v.where.siteSearch = v.siteSearch;
        if (v.siteSearchFilter)
            v.where.siteSearchFilter = v.siteSearchFilter;
        this._params = v.where;
        return true;
    };
    Client.prototype._createIndividualModel = function (Model, data) {
        var model = Model.instance(data, true);
        model.setPrimaryKey(data.cacheId);
        return model;
    };
    return Client;
})();
exports.Client = Client;
//# sourceMappingURL=client.js.map