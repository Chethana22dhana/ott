define("app/appui/formatters/assetdetailcarouselhorizontalformatter", [
    "antie/formatter",
    "antie/widgets/label",
    "antie/widgets/button",
    "antie/widgets/image",
    "antie/widgets/container",
    "logituit/libs/util",
    'app/appui/globals',
    "antie/widgets/verticallist",
    'antie/widgets/textpager',
], function (Formatter, Label, Button, Image, Container, Utils, Globals,VerticalList, TextPager) {
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
                img;

            item = iterator.next();

            img = item.images && item.images[0].cdn_url ? item.images[0].cdn_url : '';
            self.layoutdimension = this.utils.getCloudinaryUrl(self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT) + img;
            //    var layoutWidth = self.layoutdimension.width;
            //    var layoutHeight = self.layoutdimension.height;
            button = new Button("movie" + item.content_id);

            try {

                if (img) {
                    image = new Image("img-item.id", self.layoutdimension);
                } else {
                    const carouselLayouts = this.utils.application.getLayout().carouselLayouts;
                    const {CAROUSEL_LAYOUT} = self.globals.API_CONSTANTS;
                    var layoutWidth = carouselLayouts[CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT].width;
                    var layoutHeight = carouselLayouts[CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT].height;
                    image = new Image("img-item.id", 'static/img/home/6ne Maili.jpg', {width: layoutWidth, height: layoutHeight})
                }
            } catch (e) {

                if (e) {
                    const carouselLayouts = this.utils.application.getLayout().carouselLayouts;
                    const {CAROUSEL_LAYOUT} = self.globals.API_CONSTANTS;
                    var layoutWidth = carouselLayouts[CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT].width;
                    var layoutHeight = carouselLayouts[CAROUSEL_LAYOUT.LANDSCAPE_LAYOUT].height;
                    image = new Image("img-item.id", 'static/img/home/6ne Maili.jpg', {width: layoutWidth, height: layoutHeight})
                }
            }

            // self.imageContainer = document.getElementById('img-item.id');
            // self.imageContainer.style.height = layoutHeight;
            // self.imageContainer.style.width = layoutWidth;
            button.appendChildWidget(image);
            button.setDataItem(item);
            var titlecontainer = new Container('title_container');
            titlecontainer.addClass('titleContainer')
            var episode_title = new Label("episode-title", item.content_title);
            episode_title.addClass('episode-title');
            titlecontainer.appendChildWidget(episode_title);
           
            var episodeNo = new Label("episode-number",'');
            episodeNo.setText('Episode '+iterator._currentIndex +" | "+self.getDuration(item.duration))
            episodeNo.addClass('episode_number');
            titlecontainer.appendChildWidget(episodeNo);

           var episodedesc = new TextPager("episode-description");
            // var episodedesc = new Label("episode-description", item.contents[0].short_description);
            episodedesc.setText(item.description);
            episodedesc.addClass('episode_desc');
            titlecontainer.appendChildWidget(episodedesc);
            // return episode_title;
            // self.verticalListMenu = new VerticalList("assetDetailsPageformatter");
            // self.verticalListMenu.appendChildWidget(episode_title);
            // self.verticalListMenu.appendChildWidget(episodeNo);
            // self.verticalListMenu.appendChildWidget(episodedesc);
            button.appendChildWidget(titlecontainer);
            button.addEventListener('select', function (evt) {
                let data = evt && evt.target && evt.target.getDataItem() ? evt.target.getDataItem() : null;
                self.contentId = data && data.content_id ? data.content_id : null;
                self.asset_id = localStorage.getItem('assetId');
                if(self.asset_id){
                    self.asset_id = parseInt(self.asset_id);
                }
                let activeTabIndex = localStorage.getItem('activeTabIndex');

                self.pageId = parseInt(activeTabIndex);
                evt.stopPropagation();
                evt.preventDefault();
                if(self.contentId){
                    self.utils.application.hideComponent(self.globals.ASSET_DETAIL_CONTAINER);
                    self.utils.application.pushComponent(self.globals.PLAYER_CONTAINER, self.globals.COMPONENT_PATH.PLAYER_COMPONENT, {pageId: self.pageId, contentId: self.contentId, asset_id: self.asset_id});
                }
            });

            return button;
        },
        getDuration: function (duration){
            var mind = duration % (60 * 60);
            var minutes = Math.floor(mind / 60);
            return minutes +' min';
        },
        createBlankContainer: function () {
            let blankContainer = new Container('img-' + item.id);
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
