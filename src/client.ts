/// <reference path="require.d.ts" />
var request = require('request');

export class Client {

    public key: string;
    public cx: string;
    public cref: string;
    public baseUrl: string;
    public url: string;
    public config: Object;

    public options: RequestOptions;

    private _connector;
    private _query: String;
    private _params: any;

    /**
     * Set request options initialy
     */
    public constructor() {
        this.options = {
            "url": "",
            "method": "GET",
            "bodyParams": {},
            "gzip": true,
            "json": true
        };
    }

    /**
     * Sets module's configuration
     */
    public connect(parent) {
        var config = parent.config;
        this.configure(config);
        this._connector = parent;
        parent.logger.trace('Connected to google custom search');
    }

    /**
     * Unsets module's configurations
     */
    public disconnect(parent) {
        this.config = {};
        this.url = '';
        this._connector = parent;
        parent.logger.trace('Disconnected from google custom search');
    }


    /**
     * Configures the module
     */
    protected configure(config): Boolean {
        if (!config || !config.key)
            throw new Error('Configuration is not set.');
        this.key = config.key;
        this.config = config;
        if (config.cx)
            this.cx = config.cx
        else if (config.cref)
            this.cref = config.cref;
        if (!this.cx && !this.cref)
            throw new Error('You must provide either cx or cref parameter in your configuration!');
        this.url = 'https://www.googleapis.com/customsearch/v1?key=' + this.key;
        if (this.cx)
            this.url += '&cx=' + this.cx;
        else if (this.cref)
            this.url += '&cref=' + this.cref;
        //set the base url (query parameters will be added to it)
        this.baseUrl = this.url;
        return true;
    }

    public setParameters(v: Parameters): Client {
        if (!v.where)
            throw "You need to set a where clause and provide a query ('q') parameter";
        //Check if v.where is passed propperly
        if (typeof v.where === 'string' || v.where instanceof String)
            v.where = JSON.parse(v.where);
        if (!v.where.q) {
            throw "You need to provide a query ('q') parameter in where clause.";
        }
        //Set query parameters
        this._parseParameters(v);
        //Create the query string
        this._creteQuery();
        this.url = this.baseUrl + this._query;
        return this;
    }

    /**
     * Query Google APIs
     * @param funciton callback, a callback function. error, response, body are passed to it 
     */
    public query(callback) {
        this.options.url = this.url;
        return request(this.options, callback);
    }

    /**
     * Return a collection of models
     */
    public prepareResults(results, model) {
        var tmp_results = [];

        if (results && results.length) {
            for (var i = 0; i < results.length; i++) {
                //Create individual model
                var p_model = this._createIndividualModel(model, results[i]);
                tmp_results.push(p_model);
            }
        }
        return tmp_results;
    }



    /**
     * Creates query string from an object 
     */
    private _creteQuery(): String {
        var params: WhereQueryParamers = this._params;
        var i = 0;
        for (var key in params) {
            if (i === 0) {
                this._query = '&' + key + '=' + params[key];
            } else {
                this._query += '&' + key + '=' + params[key];
            }
            //increment
            i++;
        }
        return this._query;
    }



    /**
     * Parse provided parameters
     * 
     */
    private _parseParameters(v: Parameters): boolean {
        // if (v.where.dateRestrict) {
        //     this._params.dateRestrict = v.where.dateRestrict;
        // }
        // if (v.where.exactTerms) {
        //     this._params.exactTerms = v.where.exactTerms;
        // }
        // if (v.where.excludeTerms) {
        //     this._params.excludeTerms = v.where.excludeTerms;
        // }
        //Results per Page
        if (!v.per_page)
            v.where.num = 10;
        else
            v.where.num = v.per_page;
        if (!v.skip)
            v.where.start = 1;
        else
            v.where.start = v.skip
        if (v.limit)
            v.where.num = v.limit - v.where.start;
        //Set the page to be displayed
        if (v.page) {
            v.where.start = ((v.page - 1) * v.per_page + 1);
        }
        if (v.order)
            v.where.sort = v.order;

        if (v.linkSite) v.where.linkSite = v.linkSite;
        if (v.lowRange) v.where.lowRange = v.lowRange;
        if (v.relatedSite) v.where.relatedSite = v.relatedSite;
        if (v.searchType) v.where.searchType = v.searchType;
        if (v.siteSearch) v.where.siteSearch = v.siteSearch;
        if (v.siteSearchFilter) v.where.siteSearchFilter = v.siteSearchFilter;

        //Set self::_params
        this._params = v.where;
        return true;
    }

    /**
     * Creates and returns a single model to populate a collection
     */
    private _createIndividualModel(Model, data) {
        var model = Model.instance(data, true);
        model.setPrimaryKey(data.cacheId);
        return model;
    }

}


/**
 * Parametes interface
 */
interface Parameters {
    limit: number;
    skip: number;
    where: WhereQueryParamers;
    order: string;
    sel: Object;
    unsel: Object;
    page: number;
    per_page: number;
    linkSite: string;
    lowRange: string;
    relatedSite: string;
    searchType: string;
    siteSearch: string;
    siteSearchFilter: string;
    sort: string;
}

interface WhereQueryParamers {
    q: string;
    dateRestrict: number;
    exactTerms: string;
    excludeTerms: string;
    fileType: string;
    filter: string;
    gl: string;
    googlehost: string;
    highRange: string;
    hl: string;
    hq: string;
    imgColorType: string;
    imgDominantColor: string;
    linkSite: string;//--
    lowRange: string;//--
    relatedSite: string;//--
    searchType: string;//--
    siteSearch: string;//--
    siteSearchFilter: string;//--
    imgSize: string;
    orTerms: string;
    rights: string;
    safe: string;
    num: number;
    start: number;
    sort: string;
}

export interface RequestOptions {
    url: string;
    method: string;
    bodyParams: Object;
    gzip: boolean;
    json: boolean;

}
