var appVersion = '0.0.1';
var buildNumber = '1';
var sonyDataLayer = {}; // eslint-disable-line no-unused-vars
var require = { // eslint-disable-line no-unused-vars
    baseUrl: '',
    paths: {
        app: 'static/script',
        antie: 'tal/static/script',
        logituit: 'logituit',    
    },
    urlArgs: 'bust=' +  appVersion,
    priority: [],
    callback: function () {
    }
};
var cmsdk;
var intervalID;
var intervalIDLaunch;
var DICTIONARY;


