var LOCAL_HOST = '';
var appVersion = '0.0.1';
var buildNumber = '1';
var sonyDataLayer = {}; // eslint-disable-line no-unused-vars
var cmsdk;
var intervalID;
var intervalIDLaunch;
var DICTIONARY;

requirejs.config = { // eslint-disable-line no-unused-vars
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

function loadApplication() {
    require(['app/appui/app'], function (App) {
        new App(document.getElementById('app'), 'static/style/',
            'static/img/');
    });
}
loadApplication();