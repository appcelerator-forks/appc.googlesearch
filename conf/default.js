/**
 * this is your configuration file defaults.
 *
 * You can create additional configuration files to that the server will load based on your
 * environment.  For example, if you want to have specific settings for production which are different
 * than your local development environment, you can create a production.js and a local.js.  Any changes
 * in those files will overwrite changes to this file (a object merge is performed). By default, your
 * local.js file will not be commited to git or the registry.
 *
 * This is a JavaScript file (instead of JSON) so you can also perform logic in this file if needed.
 */
module.exports = {
    // these are your generated API keys.  They were generated uniquely when you created this project.
    // DO NOT SHARE these keys with other projects and be careful with these keys since they control
    // access to your API using the default configuration.  if you don't want two different keys for
    // production and test (not recommended), use the key 'apikey'.  To simulate running in production,
    // set the environment variable NODE_ENV to production before running such as:
    //
    // NODE_ENV=production appc run
    //
    // production key, this is the key that will be required when you are running in production
    apikey_production: 'BmUpFLz51qDcfP4+GWdWZXWRvHTJhY+2',
    // development key, this is the key that will be required when you are testing non-production (such as locally)
    apikey_development: 's4MePBdzWrYxHozqx9DBGhToK0tub8jV',
    // preproduction key, this is the key that will be required when you are testing non-production (such as locally)
    apikey_preproduction: '2dB143lc3+5kn4YS0dDxR5K3pSl9XGuX',

    // by default the authentication strategy is 'basic' which will use HTTP Basic Authorization where the
    // usename is the key and the password is blank.  the other option is 'apikey' where the value of the
    // APIKey header is the value of the key.  you can also set this to 'plugin' and define the key 'APIKeyAuthPlugin'
    // which points to a file or a module that implements the authentication strategy
    APIKeyAuthType: 'basic',
	
    // The number of milliseconds before timing out a request to the server.
    timeout: 120000,

    // logging configuration
    logLevel: 'debug', // Log level of the main logger.
    logging: {
        // location of the logs if enabled
        logdir: './logs',
        // turn on transaction logs
        transactionLogEnabled: true
    },

    // prefix to use for apis
    apiPrefix: '/api',

    // control the settings for the admin website
    admin: {
        // control whether the admin website is available
        enabled: true,
        // the prefix to the admin website
        prefix: '/arrow',
        // the prefix for the public apidocs website
        apiDocPrefix: '/apidoc',
        // if you set disableAuth, in production only your API docs will show up
        disableAuth: false,
        // if you set disableAPIDoc, your API docs will not show up (regardless of disableAuth)
        disableAPIDoc: false,
        // if you set disableDefault404, Arrow will not register a default 404 handler
        disableDefault404: false,
        // set to true to allow the admin website to be accessed in production. however, you will still need a
        // login unless disableAuth is false. if you set this to false, the admin website will not be enabled
        // when in production (still respects enabled above)
        enableAdminInProduction: true,
        // set the email addresses you want to be able to log in to the admin website
        validEmails: ["mvasilev@axway.com"],
        // set the organization ids you want to be able to log in to the admin website
        validOrgs: [100102077]
    },

    // you can generally leave this as-is since it is generated for each new project you created.
    session: {
        encryptionAlgorithm: 'aes256',
        encryptionKey: 'qK7lkzgpBOYFllryB5CnuF7Dv1W9KbVVu6md3zgpS6Q=',
        signatureAlgorithm: 'sha512-drop256',
        signatureKey: 'FbcUz9hH+FrvLHQgO7VAC/N5XVcrbWxANnkKLPcWO5D1UJtrYAv5b9VAiUE4vXlg9WHHQCANiYX3qcEI0AHuaw==',
        secret: 'L96+myGFJ0pJOxVLVOvKwkuK5XXYS5M5', // should be a large unguessable string
        duration: 86400000, // how long the session will stay valid in ms
        activeDuration: 300000 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
    },

    // your connector configuration goes here
    connectors: {
        'appc.googlesearch': {
            key: 'AIzaSyCMGfdDaSfjqv5zYoS0mTJnOT3e9MURWkU',
            cx: '000921716086157048707:jywf5jqy7ps',
            cref: ''
        }
    }
};