define("app/appui/formatters/homecarouselhorizontalformatter", [
    "antie/formatter",
    "antie/widgets/label",
    "antie/widgets/button",
    "antie/widgets/image",
    "antie/widgets/container",
    "logituit/libs/util",
    'app/appui/globals',
], function (Formatter, Label, Button, Image, Container, Utils, Globals) {
    "use strict";
    var self;
    return Formatter.extend({
        init: function () {
            self = this;
            this.carousel = null;
            this.utils = new Utils();
            self.globals = new Globals();
        },

        format: function (iterator) {
            var button,
                item,
                image,
                continueWatchbar,
                img;

            item = iterator.next();
            // console.log("iterator",item,iterator)
            // img = item.images && item.images[8] ? item.images[8] : item.images && item.images[15] ? item.images[15] : item.images && item.images[16] ? item.images[16] : '';
            img = item.images && item.images[0].cdn_url ? item.images[0].cdn_url : '';
            self.layout = self.getLayout(item.card_type_id);
            try{
            switch(self.layout){
                case self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT:
                case self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.CONTINUE_WATCH_LAYOUT:
                self.layoutdimension = this.utils.getCloudinaryUrl(self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT) + img;
                break;

                // case self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.PORTRAIT_LAYOUT:
                // self.layoutdimension = this.utils.getCloudinaryUrl(self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.PORTRAIT_LAYOUT) + img;
                // break;

                case self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.SQUARE_LAYOUT:
                self.layoutdimension = this.utils.getCloudinaryUrl(self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.SQUARE_LAYOUT) + img;
                break;
                default :
                // self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT:
                // case self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.CONTINUE_WATCH_LAYOUT:
                self.layoutdimension = this.utils.getCloudinaryUrl(self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT) + img;
                break;
            }
        }
        catch (e){
            self.layoutdimension = this.utils.getCloudinaryUrl(self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT) + 'static/img/home/6ne Maili.jpg';
            console.log("error********",e)
        }
            //    var layoutWidth = self.layoutdimension.width;
            //    var layoutHeight = self.layoutdimension.height;
            let id =item.banner_id ? item.banner_id : item.asset_id ? item.asset_id : '';
            button = new Button("movie" + id+iterator._currentIndex - 1);
            button.addClass(self.layout)

            try {

                if (img) {
                    image = new Image("img-item.id", self.layoutdimension);
                } else {
                    const carouselLayouts = this.utils.application.getLayout().carouselLayouts;
                    const {CAROUSEL_LAYOUT} = self.globals.API_CONSTANTS;
                    switch(self.layout){
                        case self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT:
                        case self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.CONTINUE_WATCH_LAYOUT:
                            self.layoutWidth = carouselLayouts[CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT].width;
                            self.layoutHeight = carouselLayouts[CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT].height;
                        break;
                        case self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.PORTRAIT_LAYOUT:
                            self.layoutWidth = carouselLayouts[CAROUSEL_LAYOUT.PORTRAIT_LAYOUT].width;
                            self.layoutHeight = carouselLayouts[CAROUSEL_LAYOUT.PORTRAIT_LAYOUT].height;
                        break;
                        case self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.SQUARE_LAYOUT:
                            self.layoutWidth = carouselLayouts[CAROUSEL_LAYOUT.SQUARE_LAYOUT].width;
                            self.layoutHeight = carouselLayouts[CAROUSEL_LAYOUT.SQUARE_LAYOUT].height;
                        break;
                        default: 
                        self.layoutWidth = carouselLayouts[CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT].width;
                        self.layoutHeight = carouselLayouts[CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT].height;
                        break;
                    }
                   
                    image = new Image("img-item.id", 'static/img/home/6ne Maili.jpg')
                }
            } catch (e) {

                if (e) {
                    const carouselLayouts = this.utils.application.getLayout().carouselLayouts;
                    const {CAROUSEL_LAYOUT} = self.globals.API_CONSTANTS;
                    switch(item.layout){
                        case self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT:
                        case self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.CONTINUE_WATCH_LAYOUT:
                            self.layoutWidth = carouselLayouts[CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT].width;
                            self.layoutHeight = carouselLayouts[CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT].height;
                        break;
                        case self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.PORTRAIT_LAYOUT:
                            self.layoutWidth = carouselLayouts[CAROUSEL_LAYOUT.PORTRAIT_LAYOUT].width;
                            self.layoutHeight = carouselLayouts[CAROUSEL_LAYOUT.PORTRAIT_LAYOUT].height;
                        break;
                        case self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.SQUARE_LAYOUT:
                            self.layoutWidth = carouselLayouts[CAROUSEL_LAYOUT.SQUARE_LAYOUT].width;
                            self.layoutHeight = carouselLayouts[CAROUSEL_LAYOUT.SQUARE_LAYOUT].height;
                        break;
                        default:
                            self.layoutWidth = carouselLayouts[CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT].width;
                            self.layoutHeight = carouselLayouts[CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT].height;
                        break;
                    }
                    image = new Image("img-item.id", 'static/img/home/6ne Maili.jpg', {width: self.layoutWidth, height: self.layoutHeight})
                }
            }

            // self.imageContainer = document.getElementById('img-item.id');
            // self.imageContainer.style.height = layoutHeight;
            // self.imageContainer.style.width = layoutWidth;
            button.appendChildWidget(image);

            var movie_title = new Label("movie-title", item.title);
            movie_title.addClass('movie-title');
            button.appendChildWidget(movie_title);
            var movie_shortDesc=new Label("moviesdesc",item.promo_text);
            movie_shortDesc.addClass('movie-shortdesc');
            button.appendChildWidget(movie_shortDesc);

            if(item.layout === self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.CONTINUE_WATCH_LAYOUT){
                continueWatchbar = new Container("continueWatchbar");
                continueWatchbar.addClass('continueWatchbar');
                var progressBar = new Label("progressbar", "");
                progressBar.addClass("progressbar");
                continueWatchbar.appendChildWidget(progressBar)
                button.appendChildWidget(continueWatchbar);
            }
            
            button.setDataItem(item);
            return button;
        },
        getLayout: function (layout_id){
            switch(layout_id){
                // case 1:
                //     return 'ads_layout';
                case 3:
                    return 'portrait_layout';
                case 5:
                    return 'square_layout';
                default: 
                    return 'landscape_layout'
            }
        },
        createBlankContainer: function () {
            let blankContainer = new Container('img-' + item.banner_id);
            blankContainer.addClass('carousel-image');
            blankContainer.addClass('blank_container');
            if (label.hasClass('removeSpace')) {
                label.removeClass('removeSpace');
            }
            button.addClass('no-bg');

            button.appendChildWidget(blankContainer);
        }
    })
});
