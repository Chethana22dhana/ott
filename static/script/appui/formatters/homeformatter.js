define("app/appui/formatters/homeformatter", [
    "antie/formatter",
    "antie/widgets/container",
    "antie/widgets/carousel",
    "antie/datasource",
    "antie/widgets/carousel/binder",
    'logituit/keyhandlers/activatefirsthandler',
    "logituit/libs/util",
    "antie/widgets/horizontallist",
    "app/appui/formatters/homecarouselhorizontalformatter",
    "app/appui/datasources/homecarouselhorizontalfeed",
    'app/appui/globals',
    'antie/widgets/textpager',
    "antie/events/keyevent",
    "antie/widgets/image",
    "antie/widgets/label",
    "logituit/widgets/button",
], function (Formatter, Container, Carousel, DataSource, Binder, ActivateFirstHandler, Utils, HorizontalList, HomeHorizontalFormatter, HomeCarouselHorizontalFeed, Globals, TextPager, KeyEvent, Image, Label, Button) {
    "use strict";
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
                horizontalList;

            item = iterator.next();
            container = new Container();
            let layout = item.carousel_type ? item.carousel_type : item.entity_type ? item.entity_type : item.playlist_type ? response.playlist_type : null;
            id = (layout);

            horizontalList = new HorizontalList('headerHotizontalList');
            horizontalList.addEventListener('keydown', function (evt) {
                switch (evt.keyCode) {
                    case KeyEvent.VK_DOWN:
                        // container.setActiveChildWidget(container.getChildWidgets()[1]);
                        // evt.stopPropagation();
                        if (container.getActiveChildWidget() && container.getActiveChildWidget().getActiveChildWidget()) {
                            let id = container.getActiveChildWidget().getActiveChildWidget().id;
                            let child_widgets = (container.getActiveChildWidget() && container.getActiveChildWidget().getChildWidgets()) ? container.getActiveChildWidget().getChildWidgets() : null;
                            if (id === "label_container" && child_widgets && child_widgets.length > 1 && child_widgets[1].id === "liveNow_filterbtn_container") {
                                container.getActiveChildWidget().setActiveChildWidget(child_widgets[1]);
                            } else {
                                container.setActiveChildWidget(container.getChildWidgets()[1]);
                            } evt.stopPropagation();
                        }
                        break;
                    case KeyEvent.VK_UP:
                        let active_widget = container.getActiveChildWidget() ? container.getActiveChildWidget() : null;
                        if (active_widget && active_widget.getChildWidgets() && active_widget.getChildWidgets().length) {
                            let id = container.getActiveChildWidget().getActiveChildWidget().id;
                            if (id === "liveNow_filterbtn_container") {
                                container.getActiveChildWidget().setActiveChildWidget(container.getActiveChildWidget().getChildWidgets()[0]);
                                evt.stopPropagation();
                            }
                        }
                        break;
                }
            });
            const ids = item.items[iterator._currentIndex - 1] && item.items[iterator._currentIndex - 1].banner_id ? item.items[iterator._currentIndex - 1].banner_id : item.items[iterator._currentIndex - 1] && item.items[iterator._currentIndex - 1].asset_id ? item.items[iterator._currentIndex - 1].asset_id : iterator._currentIndex - 1
            container.addClass("container" + ids);

            labelContainer = new Container('label_container');
            labelContainer.addClass('label_container');
            container.setDataItem(item);
            label = new TextPager(id, true);
            // self.button = new Button(item.asset_id)
            liveLabel = new Container(id + '_live');
            // liveLabel.setText(item.asset_id);
            label.setText(item.title);
            labelContainer.appendChildWidget(liveLabel);
            labelContainer.appendChildWidget(label);
            self.navToListingScreen = new Button('home_to_listing');
            self.navToListingScreen.addClass('navigate_to_listing');
            self.arrowLabel = new Image('arrow', 'static/img/right_chevrons.png');
            self.arrowLabel.addClass('hide');
            self.navToListingScreen.appendChildWidget(self.arrowLabel);
            self.navToListingScreen.setDataItem(item);
            labelContainer.appendChildWidget(self.navToListingScreen);
            // self.button.appendChildWidget(labelContainer)
            // labelContainer.appendChildWidget(label);
            horizontalList.appendChildWidget(labelContainer);
            container.appendChildWidget(horizontalList);
            self.navToListingScreen.addEventListener('keydown', function (evt) {
                if (self.deleteElem && evt.keyCode != KeyEvent.VK_RIGHT) {
                    self.deleteElem.outputElement.classList.add('hide');
                }
                if (evt.keyCode == KeyEvent.VK_LEFT) {
                    self.utils.showContainer(self.globals.MENU_CONTAINER);
                }
            });
            self.navToListingScreen.addEventListener("select", function (evt) {
                self.utils.application.hideComponent(self.globals.MENU_CONTAINER);
                self.utils.application.hideComponent(self.globals.MAIN_CONTAINER)
                self.utils.application.pushComponent(self.globals.MAIN_CONTAINER, self.globals.COMPONENT_PATH.LISTING_PAGE_COMPONENT, {title: evt.target._dataItem.title,image:evt.target._dataItem});
                evt.stopPropagation();
            });
            self.navToListingScreen.addEventListener("focus", function (evt) {
                self.setBannerImage('')
            });
            this.carousel = new Carousel("container_" + ids, Carousel.orientations.HORIZONTAL);
            this.addCarouselEventListener();
            this.carousel.addEventListener('keydown', function (evt) {
                switch (evt.keyCode) {
                    case KeyEvent.VK_UP:
                        let horizontalList_widgets = (container.getChildWidgets() && container.getChildWidgets().length && container.getChildWidgets()[0].getChildWidgets()) ? container.getChildWidgets()[0].getChildWidgets() : null;
                        if ((horizontalList_widgets && horizontalList_widgets.length > 1) || (horizontalList_widgets && horizontalList_widgets.length && horizontalList_widgets[0].getActiveChildWidget() && horizontalList_widgets[0].getActiveChildWidget().id === 'home_to_listing')) {
                            container.setActiveChildWidget(container.getChildWidgets()[0]);
                            evt.stopPropagation();
                        }
                        break;
                }
            });
            this.carousel.addEventListener('focus', function (evt) {
                let data = evt && evt.target && evt.target.getDataItem() ? evt.target.getDataItem() : null;
                let imgurl = data && data.images && data.images[0].cdn_url ? data.images[0].cdn_url : '';
                let title = data && data.asset_title ? data.asset_title : null;
                let desc = data && data.promo_text ? data.promo_text : null;
                let genre = "Action • Drama • Thriller";
                self.setBannerImage(imgurl, title, desc, genre);

                // self.eroslogo = new Image('eroslogo','static/img/home/en_logo_overlay(watermark).svg');
                // self.shadowBtn = 'shadowButton'
            });

            this.carousel.addEventListener('select', function (evt) {
                if (evt.target.getDataItem() && evt.target.getDataItem().asset_id) 
                    self.setBannerImage('');
                
            });


            this.carousel.setAlignPoint(1);
            // this.carousel.addClass('WRAPPING');
            this.carousel.autoCalculate(false);
            this.addCarouselHandler();
            container.appendChildWidget(this.carousel);

            // console.log
            var dataSource = new DataSource(null, new HomeCarouselHorizontalFeed(item), "loadData");
            // console.log("HomeHorizontalFormatter", item, dataSource)
            var binder = new Binder(new HomeHorizontalFormatter(item), dataSource);
            binder.appendAllTo(this.carousel);

            return container;

            // var spotlightContainer = self.spotlightFormat(item);
        },
        setBannerImage: function (url, title, desc, genre) {
            if (url && document.getElementById('banner_Image')) {
                document.getElementById('banner_Image_img').src = self.utils.getCloudinaryUrl(self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.SPOTLIGHT_LAYOUT) + url;
                document.getElementById('banner_Title').innerHTML = title;
                document.getElementById('banner_Desc').innerHTML = desc;
                document.getElementById('banner_Genre').innerHTML = genre;
                document.getElementById('eroslogo_img').src = 'static/img/home/en_logo_overlay(watermark).svg'

            } else if (! url && document.getElementById('banner_Image')) {
                document.getElementById('banner_Image_img').src = '';
                document.getElementById('banner_Image').style.background = '#0d1118';
                document.getElementById('banner_Title').innerHTML = '';
                document.getElementById('banner_Desc').innerHTML = '';
                document.getElementById('banner_Genre').innerHTML = '';
                document.getElementById('eroslogo_img').src = ''
            }
        },

        // Carousel event listner for focus, blur,select,click
        addCarouselEventListener: function () { // var self = this;
            this.carousel.addEventListener("databound", function (iterator) {
                let carousel = iterator.target;
                let dataItem = carousel.parentWidget.getDataItem();
                let activeIndex = 0,
                    widgetLength = self._lengths;
                if (dataItem) {
                    widgetLength = dataItem.widgetLength ? dataItem.widgetLength : self._lengths;
                    activeIndex = (dataItem.activeIndex) ? dataItem.activeIndex : 0;
                }
                carousel.setWidgetLengths(widgetLength);

                if (! widgetLength) {
                    if (self.utils.application.getLayout().requiredScreenSize.height === 720) {
                        const {CAROUSEL_LAYOUT} = self.globals.API_CONSTANTS;
                        if (dataItem.layout === CAROUSEL_LAYOUT.PORTRAIT_LAYOUT || dataItem.layout === CAROUSEL_LAYOUT.SQUARE_LAYOUT) {
                            carousel.setWidgetLengths(200);
                        } else {
                            carousel.setWidgetLengths(300);
                        }
                    } else {
                        const {CAROUSEL_LAYOUT} = self.globals.API_CONSTANTS;
                        if (dataItem.layout === CAROUSEL_LAYOUT.PORTRAIT_LAYOUT) {
                            carousel.setWidgetLengths(230);
                        } else if (dataItem.layout === CAROUSEL_LAYOUT.SQUARE_LAYOUT) {
                            carousel.setWidgetLengths(280);
                        } else {
                            carousel.setWidgetLengths(400);
                        }
                    }
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
            self.carousel.addEventListener("focus", function (evt) {});
            self.carousel.addEventListener("blur", function (evt) {});
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
