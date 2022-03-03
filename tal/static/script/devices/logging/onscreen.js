/**
 * @fileOverview Requirejs module containing base antie.devices.logging.onscreen class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

//logs to the screen
define(
    'antie/devices/logging/onscreen',
    [
        'module',
        'antie/devices/device'
    ],
    function( Module, Device) {
        'use strict';

        var div = null;
        var logItems = [];

        function prependItem(text) {
            if(!div) {
                div = document.createElement('div');
                div.id = '__onScreenLogging';
                document.body.appendChild(div);
            }
            logItems.push(text);
            if(logItems.length > 10) {
                logItems.shift();
            }
            div.innerHTML = logItems.join('<hr />');
        }
        var loggingMethods = {
            /**
             * Sets the iterator pointer to the first item
             */
            log: function log () {
                prependItem.call(this, '[LOG] ' + Array.prototype.join.call(arguments, '<br/>'));
            },
            debug: function debug () {
                prependItem.call(this, '[DEBUG] ' +  Array.prototype.join.call(arguments, '<br/>'));
            },
            info: function info () {
                prependItem.call(this, '[INFO] ' +  Array.prototype.join.call(arguments, '<br/>'));
            },
            warn: function warn () {
                prependItem.call(this, '[WARN] ' +  Array.prototype.join.call(arguments, '<br/>'));
            },
            error: function error () {
                prependItem.call(this, '[ERROR] ' +  Array.prototype.join.call(arguments, '<br/>'));
            }
        };

        Device.addLoggingStrategy(Module.id, loggingMethods);
    }
);
