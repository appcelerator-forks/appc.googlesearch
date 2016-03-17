# Google Custom Search Connector for Appcelerator Arrow
An Arrow connector that connects to google custom search REST API. The Connector provides a single API endpoint which you can query.

## 1. Installation
You can use 
```sh 
npm install appc.googlesearch
```
or add 
```sh 
"appc.googlesearch" : "1.0.0"
``` 
to you **packacge.json** file.

## 2. Configuration
Register the connector in your **appc.json** file : 
```sh
"dependencies": {
    ...
    "connector/appc.googlesearch": "^0.0.5"
  },
  ...
```
Set the configuration object in your ``conf/default.js`` file :

```sh
    connectors: {
        'appc.googlesearch': {
            key: '<googleCustomSearchKey>',
            //One of the following two should be set
            cx: '<googleCustomSeachCX>', //provide this
            cref: '<googleCustomSearchCREF>' //or this
        }
    }
```
## 3. Usage
Take a look at all available options and query parameters, in the API documentation section of your arrow administration.
Options are available under the group **Google Search**.

## 4. Custom API result object
The connector returns a result object that slightly differs from the default API endpoint output. The connector adds ``"context"`` Object, as a first level object in the returned result:
```sh
{
    'success': true,
    'request-id': '<requId>',
    'key': 'customsearches',
    'customsearches': [],
    'context': {}
};
```
Where "context" has the following structure:

```sh
 {
     title : String,
     facets : Array,
     totalResults : Number
     restUrl : String
}
```

Where 
 - **title** - is the Custom Search title (set by Google)
 - **facets** - an Array holding all the facets, registered for this search
 - **totalResults** - the number of items in this set
 - **restUrl** - the actual REST url (to google search)

## 4. Testing
To test the connector, just run
```sh
npm test
```
