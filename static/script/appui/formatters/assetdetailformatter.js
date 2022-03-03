define("app/appui/formatters/assetdetailformatter", [
    "antie/formatter",
    "antie/widgets/container",
    "antie/widgets/carousel",
    "antie/datasource",
    "antie/widgets/carousel/binder",
    "antie/widgets/carousel/keyhandlers/activatefirsthandler",
    "logituit/libs/util",
    "antie/widgets/horizontallist",
    "app/appui/formatters/assetdetailcarouselhorizontalformatter",
    "app/appui/datasources/assetdetailcarouselhorizontalfeed",
    'app/appui/globals',
    'antie/widgets/textpager',
    "antie/widgets/label",
    "antie/widgets/button",
    "antie/widgets/image",
], function (Formatter, Container, Carousel, DataSource, Binder, ActivateFirstHandler, Utils, HorizontalList, AssetdetailHorizontalFormatter, AssetdetailCarouselHorizontalFeed, Globals, TextPager, Label, Button,Image) {   "use strict";
    var self;
    return Formatter.extend({
        init: function () {
            self = this;
            this.carousel = null;
            self.utils = new Utils();
            self.globals = new Globals();
        },
        format: function (iterator) {
            var button,
                item,
                container,
                id,
                labelContainer,
                label,
                liveLabel,
                verticalList,
                horizontalList,
                image,
                titlecontainer;

            item = iterator.next();
            container = new Container();

            horizontalList = new HorizontalList('headerHotizontalList');
            horizontalList.addEventListener('keydown', function (evt) {
                switch (evt.keyCode) {
                case KeyEvent.VK_DOWN:
                    // container.setActiveChildWidget(container.getChildWidgets()[1]);
                    // evt.stopPropagation();
                }			
            });
            // console.log("iterator",item)
            let ids =  item.contents[iterator._currentIndex-1].content_id ? item.contents[iterator._currentIndex-1].content_id : iterator._currentIndex-1
            container.addClass("container" + ids);

            labelContainer = new Container('label_container');
            labelContainer.addClass('label_container');
            container.setDataItem(item);

            self.liveLabel = new TextPager(item.contents[iterator._currentIndex -1].content_title, true);
            // self.liveLabel.setText("Episode"+iterator._currentIndex);
            self.liveLabel.setText("Season "+iterator._currentIndex);
            labelContainer.appendChildWidget(self.liveLabel);
            // labelContainer.appendChildWidget(label);
            horizontalList.appendChildWidget(labelContainer);
            container.appendChildWidget(horizontalList);

            this.carousel = new Carousel("container_" +ids, Carousel.orientations.HORIZONTAL);
            this.addCarouselEventListener();

            this.carousel.setAlignPoint(1);
            // this.carousel.addClass('WRAPPING');
            this.carousel.autoCalculate(false);
            this.addCarouselHandler();
            container.appendChildWidget(this.carousel);
            var dataSource = new DataSource(null, new AssetdetailCarouselHorizontalFeed(item), "loadData");
            var binder = new Binder(new AssetdetailHorizontalFormatter(item), dataSource);
            binder.appendAllTo(this.carousel);
           
            // titlecontainer = new Container('title_container');
            // var episode_title = new Label("episode-title", item.rows[iterator._currentIndex-1].asset_id);
            // episode_title.addClass('episode-title');
            // titlecontainer.appendChildWidget(episode_title);
           
            // var episodeNo = new Label("episode-number", item.rows[iterator._currentIndex-1].contents[0].title +"|"+item.rows[iterator._currentIndex-1].contents[0].duration);
            // episodeNo.addClass('episode_number');
            // titlecontainer.appendChildWidget(episodeNo);

            // var episodedesc = new Label("episode-description",item.rows[iterator._currentIndex-1].contents[0].short_description);
            // episodedesc.addClass('episode_desc');
            // titlecontainer.appendChildWidget(episodedesc);
            // container.appendChildWidget(titlecontainer);
            return container;

            // var spotlightContainer = self.spotlightFormat(item);
        },
        // Carousel event listner for focus, blur,select,click
        addCarouselEventListener: function () { // var self = this;
            this.carousel.addEventListener("databound", function (iterator) {
                let carousel = iterator.target;
                let dataItem = carousel.parentWidget.getDataItem();
                let activeIndex = 0;
                    // widgetLength = self._lengths;
                // if (dataItem) {
                    // widgetLength = dataItem.widgetLength ? dataItem.widgetLength : self._lengths;
                    activeIndex = dataItem.activeIndex ? dataItem.activeIndex : 0;
                // }
               
                if(self.utils.application.getLayout().requiredScreenSize.height === 720){
                    carousel.setWidgetLengths(300);
                }
                else{
                    carousel.setWidgetLengths(400);
                }
                carousel.recalculate();
                setTimeout(function () {
                    if (carousel.outputElement) {
                        if (! carousel.getActiveChildIndex()) {
                            carousel.alignToIndex(activeIndex);
                            carousel.setActiveChildIndex(activeIndex);
                        }
                    }
                }, self.globals.DELAY.HOMECOMPONENT);
            });
            self.carousel.addEventListener("focus", function (evt) {
                
            });
            self.carousel.addEventListener("blur", function (evt) {
               
            });
            self.carousel.addEventListener("select", function (evt) { // self.clearBannerImprsnEvntOnSelect(evt);
            });
            self.carousel.addEventListener("click", function (evt) { // self.clearBannerImprsnEvntOnSelect(evt);
            });
        },
        addCarouselHandler: function () {
            const handler = new ActivateFirstHandler();
            handler.setAnimationOptions({skipAnim: false});
            handler.attach(this.carousel);
        },

        // spotlightFormat: function (item) {
        // imgMain = item.img;
        // title = item.title || '';
        // imgcontainer = new Container('imgcontainer' + item.id + Math.random());
        // imgcontainer.addClass('mySlides fade');
        // imgcontainer.addClass('imgcontainer');
        // subcontainer = new Container('subcontainer');
        // subcontainer.addClass('subcontainer');
        // // appending masthead-background,foreground and logo to the container
        // // if(img){
        // //     imgcontainer.appendChildWidget(new Image('img-item.id', img));
        // // }
        // if (imgMain) {
        //     subcontainer.appendChildWidget(new Image('spotlightMain', imgMain));
        // }
        // imgcontainer.appendChildWidget(new Label(title));
        // imgcontainer.appendChildWidget(subcontainer);

        // return imgcontainer;
        // }
    });
});
