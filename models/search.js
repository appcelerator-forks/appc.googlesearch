var Arrow = require('arrow');

/**
 * Note that autogen is set to false. This service provides only one Endpoint
 * It uses this ("customsearch") Model and is registered in ../lib/index.js
 */
var customsearch = Arrow.createModel('customsearch', {
    fields: {
        kind: { type: String, required: false },
        title: { type: String, required: true },
        link: { type: String, required: true },
        displayLink: { type: String, required: false },
        snippet: { type: String, required: true },
        htmlSnippet: { type: String },
        cacheId: { type: String },
        formattedUrl: { type: String },
        htmlFormattedUrl: { type: String },
        pagemap: { type: Array },
        labels: { type: Array },
    },
    connector: 'appc.googlesearch',
    autogen: false
});

module.exports = customsearch;