define('app/appui/events/pausedevent', [
    'antie/events/event'
], function (Event) {
    'use strict';
    return Event.extend({
        init: function init (target) {
            this.target = target;
            init.base.call(this, 'paused');
        }
    });
});
