define('logituit/widgets/loadingsearchskeleton', [
    'antie/widgets/container', 'antie/widgets/button'
], function (Container, Button) {
    'use strict'
    return Button.extend({
        /**
         * @constructor
         * @ignore
         */
        init: function init(id, animationEnabled) {
            init.base.call(this, id)
            this.addClass('search_loading_overlay');
        },
        render: function render(device) {
            this.outputElement = device._createElement('div', this.id, ['search_loading_overlay']);
            let searchskpopularcarouselcontainer = device._createElement('div', 'searchskpopularcarouselcontainer', ['searchskpopularcarouselcontainer']);
            let searchsklsgridcontainer = device._createElement('div', 'searchsklsgridcontainer', ['searchsklsgridcontainer']);
            let searchskportgridcontainer = device._createElement('div', 'searchskportgridcontainer', ['searchskportgridcontainer']);
            for (let i = 0; i < 4; i++) {
                let searchskpopularcarouselItem = device._createElement('div', 'search_sk_carousel_item'+i, ['search_sk_carousel_item']);
                device.appendChildElement(searchskpopularcarouselcontainer, searchskpopularcarouselItem);
            }
            for (let i = 0; i < 2; i++) {
                let searchsklsgridItem = device._createElement('div', 'search_sk_ls_grid_item'+i, ['search_sk_ls_grid_item']);
                device.appendChildElement(searchsklsgridcontainer, searchsklsgridItem);
            }
            for (let i = 0; i < 4; i++) {
                let searchskportgridItem = device._createElement('div', 'search_sk_port_grid_item'+i, ['search_sk_port_grid_item']);
                device.appendChildElement(searchskportgridcontainer, searchskportgridItem);
            }
            device.appendChildElement(this.outputElement, searchskpopularcarouselcontainer);
            device.appendChildElement(this.outputElement, searchsklsgridcontainer);
            device.appendChildElement(this.outputElement, searchskportgridcontainer);
            return this.outputElement;
        },
        isFocusable: function isFocusable() {
            return true
        }
    })
})