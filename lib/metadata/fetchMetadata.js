var Arrow = require('arrow');

/**
 * Fetches metadata describing your connector's proper configuration.
 * @param next
 */
exports.fetchMetadata = function fetchMetadata(next) {
	next(null, {
		fields: [
			// TODO: Add a field for each config property and customize the type, name, and description.
			Arrow.Metadata.Text({
				name: 'key',
				description: 'Google Search API Key',
				required: true
			}),
            Arrow.Metadata.Text({
				name: 'cx',
				description: 'The custom search engine ID to use for this request. If both cx and cref are specified, the cx value is used.',
				required: false
			}),
            Arrow.Metadata.Text({
				name: 'cref',
				description: 'The URL of a linked custom search engine specification to use for this request.',
				required: false
			}),
			// TODO: After defining your fields, try an `appc run` to see it error!
			// TODO: Then, go update your conf/local.js and conf/example.config.js so it passes validation.
		]
	});
};
