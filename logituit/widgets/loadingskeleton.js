define('logituit/widgets/loadingskeleton', [
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
            this.addClass('loading_overlay');
        },
        render: function render(device) {
            this.outputElement = device._createElement('div', this.id, ['loading_overlay']);

            let spotlightSkeleton = device._createElement('div', 'spotlight_skeleton', ['spotlight_skeleton']);
            let spotlightBtnSkeleton = device._createElement('div', 'spotlight_btn_skltn', ['spotlight_btn_skltn']);
            let spotlightImgSkeleton = device._createElement('div', 'spotlight_img_skltn', ['spotlight_img_skltn'])
            device.appendChildElement(spotlightSkeleton, spotlightBtnSkeleton);
            device.appendChildElement(spotlightSkeleton, spotlightImgSkeleton);

            let carouselSkltnContainer = device._createElement('div', 'carousel_skltn_container', ['carousel_skltn_container']);

            for (let i = 0; i < 7; i++) {
                let carouselItem = device._createElement('div', 'carousel_item'+i, ['carousel_item']);
                device.appendChildElement(carouselSkltnContainer, carouselItem)
            }



            device.appendChildElement(this.outputElement, spotlightSkeleton);
            device.appendChildElement(this.outputElement, carouselSkltnContainer);
            return this.outputElement;

        },
        isFocusable: function isFocusable() {
            return true
        }
    })
})