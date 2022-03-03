require.def("app/appui/components/assetdetailcomponent", [
    "antie/widgets/component",
    "antie/widgets/verticallist",
    "antie/widgets/container",
    'app/appui/globals',
    "antie/widgets/image",
    "logituit/libs/util",
    'antie/events/keyevent',
    "antie/widgets/label",
    "antie/widgets/button",
    "antie/widgets/carousel",
    "antie/widgets/carousel/binder",
    "antie/widgets/carousel/keyhandlers/activatefirsthandler",
    "antie/datasource",
    "app/appui/formatters/assetdetailformatter",
    "app/appui/datasources/assetdetailfeed",
    'antie/widgets/grid',
    "app/appui/formatters/homeformatter",
    "app/appui/datasources/homefeed",
    "app/appui/datasources/footerfeed",
    "app/appui/formatters/footerformatter",
    "antie/widgets/horizontallist",
], function (Component, VerticalList, Container, Globals, Image, Utils, KeyEvent, Label, Button, Carousel, Binder, ActivateFirstHandler, DataSource, AssetDetailFormatter, 
        AssetDetailFeed, Grid, HomeFormatter, HomeFeed, FooterFeed, FooterFormatter, HorizontalList) {
    "use strict";
    var self;
    return Component.extend({
        init: function init() {
            self = this;
            self.globals = new Globals();
            self.converter = new Utils();
            self.util = new Utils();
            // It is important to call the constructor of the superclass
            init.base.call(this, self.globals.ASSET_DETAIL_CONTAINER);
            self.addEventListener("beforerender", function (ev) {
                self._onBeforeRender(ev);
            });
            self.addEventListener("beforehide", function (evt) {});
            self.addEventListener("select", function (evt) {
                self.contentId = self.detailPageResponse.play_state && self.detailPageResponse.play_state[0] && self.detailPageResponse.play_state[0].content_id ? self.detailPageResponse.play_state[0].content_id : null;
                if(self.contentId){
                    self.util.application.hideComponent(self.globals.ASSET_DETAIL_CONTAINER);
                    self.util.application.pushComponent(self.globals.PLAYER_CONTAINER, self.globals.COMPONENT_PATH.PLAYER_COMPONENT, {pageId: self.pageId, contentId: self.contentId, asset_id: self.asset_id});
                    // self.util.application.pushComponent(self.globals.SUBSCRIPTION_CONTAINER, self.globals.COMPONENT_PATH.SUBSCRIPTION_COMPONENT);
                }
            });
            self.addEventListener("keydown", function (e) {
                self.handleDetailsEvtListener(e);
            });
            self.addEventListener("aftershow", function (evt) {
                self._onAfterShow(evt);
            });
        },
        // ToDo: can we execute these in load() and see what is the behavior
        _onBeforeRender: function (evt) {
            self.removeChildWidgets();
            self.assetDetailContainer = new Container("assetDetailContainer");
            if (evt.args && evt.args.from != "player") {
                self.src = evt.args && evt.args.src ? evt.args.src : null;
                self.title = evt.args && evt.args.title ? evt.args.title : null;
                self.from = evt.args && evt.args.from ? evt.args.from : null;
                self.apiData = evt.args && evt.args.apidata ? evt.args.apidata : null;
            }
            if(evt.args && evt.args.assetId){
                self.asset_id = evt.args.assetId;
                localStorage.setItem('assetId',self.asset_id);
            }
            if(evt.args && evt.args.pageId){
                self.pageId = evt.args.pageId;
            }
            self.getAssetDetail();
            self.createWidgets();
            self.loadContainer();
            self.loadLanguageContainer();
            self.loadCarousels();
        },
        _onAfterShow: function () {
            self.optioncontainer.focus();
            self.appendBgImange();
        },
        getAssetDetail: function () {
            self.globals.callForAPI(self.globals.XHR_METHOD_GET, '', '', self.globals.ASSET_DETAILS + self.asset_id, self.assetDetailSucess, self.assetDetailFaluire)
        },
        assetDetailSucess: function (response) {
            self.detailPageResponse = response.data;
            if(self.detailPageResponse.seasons && self.detailPageResponse.seasons.length){
                self.coloumnCarouselDatabound();
            }
            if (self.detailPageResponse.genres.length) {
                self.setGenre()
            }
            if (self.detailPageResponse.cbfc_certificate) {
                self.Label2.setText(self.detailPageResponse.cbfc_certificate);
                self.Label2.addClass("UAicon");
            }
            if (self.detailPageResponse.language.length) {
                self.Label4.setText(self.detailPageResponse.release_year + ' • ' + self.detailPageResponse.language[0].name);
                self.Label4.addClass("labelTitle5");
            }
            if (self.detailPageResponse.description) {
                self.Label6.setText(self.detailPageResponse.description);
                self.Label6.addClass("labelTitle7");
            }
            if (self.detailPageResponse.season_count) {
                self.container.removeChildWidgets();
                self.Label3.setText(self.detailPageResponse.season_count + ' Seasons')
            } else if (self.detailPageResponse.total_duration) {
                var hours = Math.floor(self.detailPageResponse.total_duration / 60 / 60);
                var minutes = Math.floor(self.detailPageResponse.total_duration / 60) - (hours * 60);
                if (minutes < 10) {
                    minutes = '0' + minutes + ' min'
                }
                self.Label3.setText(hours + 'hr ' + minutes)
                var image = new Image("img-item.id", "static/img/icon_asset_duration.svg");
                self.container.addClass("clock1");
                self.container.appendChildWidget(image);
            }
            if (self.detailPageResponse.ratings.en_rating) {
                for (let i = 0; i < self.detailPageResponse.ratings.en_rating.total; i++) {
                    if (i < self.detailPageResponse.ratings.en_rating.value) {
                        var container1 = new Container("starcontainer" + i);
                        var image1 = new Image("img-item" + i, "static/img/star.svg");
                        container1.addClass("clock" + i);
                        container1.appendChildWidget(image1);
                        self.verticalListMenu.appendChildWidget(container1);
                    } else {
                        var container1 = new Container("starcontainer" + i);
                        var image1 = new Image("img-item" + i, "static/img/icons-star.png");
                        container1.addClass("clock" + i);
                        container1.appendChildWidget(image1);
                        self.verticalListMenu.appendChildWidget(container1);
                    }
                }
            }
            if(self.detailPageResponse.recommended_assets && self.detailPageResponse.recommended_assets.length){
                self.apiResponse = {items:[{items:self.detailPageResponse.recommended_assets,title:'Suggested for you'}]}
                self.recommendationCarouselDatabound();
            }
        },
        assetDetailFaluire: function (e) {
            console.log(e);
        },
        setGenre: function () {
            let gener = ''
            self.detailPageResponse.genres.forEach((genre, index) => {
                gener = gener + genre.genre_name;
                if (index < self.detailPageResponse.genres.length - 1) {
                    gener = gener + ' • ';
                }
            })
            self.Label5.setText(gener);
            self.Label5.addClass("labelTitle6");
        },
        // Creating the carousel and passing the feed data
        loadCarousels: function () {
            self.createCarouselWidgets();
            self.appendCarouselWidgets();
            self.alignCarousel();
            self.addCarouselEventListener();
        },
        handleDetailsEvtListener: function (evt) {
            switch (evt.keyCode) {
                case KeyEvent.VK_BACK_SPACE:
                case KeyEvent.VK_BACK:
                case KeyEvent.VK_Q:
                    // this.parentWidget.back()
                    if (self.from === 'home') {
                        self.util.application.popComponent(self.globals.ASSET_DETAIL_CONTAINER);
                        self.util.application.showComponent(self.globals.MENU_CONTAINER, self.globals.COMPONENT_PATH.MENU_COMPONENT);
                        self.util.application.showComponent(self.globals.MAIN_CONTAINER, self.globals.COMPONENT_PATH.HOME_COMPONENT, {
                            apidata: self.apiData,
                            pageId: self.pageId
                        });
                    }
                    else if(self.from === self.globals.COMPONENT_PATH.SEARCH_COMPONENT){
                        self.util.application.popComponent(self.globals.ASSET_DETAIL_CONTAINER);
                        self.util.application.showComponent(self.globals.MAIN_CONTAINER, self.globals.COMPONENT_PATH.SEARCH_COMPONENT,{
                            pageId: self.pageId
                        });
                    }
                    break;
                case KeyEvent.VK_UP:
                    if (self.carouselContainer._isFocussed) {
                        self.grid.getChildWidgets()[0].focus();
                    }
                    break;
            }
        },
        _onComponentKeyDown(evt) {},

        // creating a parent container Vertical List
        createWidgets: function () {
            self.containerreport = new Container("containerreport");
            self.containerreport.addClass("reportdetail");
        },

        loadContainer: function () {
            var assetdetail = new Container("assetdetailscontainer");
            self.verticalListMenu = new VerticalList("assetDetailsPage");
            assetdetail.addClass("assetdetails");
            var Label1 = new Label("label1", self.title);
            Label1.addClass("labelTitle1");
            self.container = new Container("containerClock");
            self.Label2 = new Label("label2",'');
            self.Label3 = new Label("label3", "");
            self.Label3.addClass("labelTitle3");
            self.Label4 = new Label("label4",'');
            self.Label5 = new Label("label5",'');
            self.Label6 = new Label("label6",'');
            self.optioncontainer = new HorizontalList("optioncontainer");
            self.optioncontainer.addClass("optioncontainer")
            self.footerDataBound();
            self.verticalListMenu.appendChildWidget(self.containerreport);
            self.verticalListMenu.appendChildWidget(assetdetail);
            self.verticalListMenu.appendChildWidget(Label1);
            self.verticalListMenu.appendChildWidget(self.container);
            self.verticalListMenu.appendChildWidget(self.Label2);
            self.verticalListMenu.appendChildWidget(self.Label3);
            self.verticalListMenu.appendChildWidget(self.Label4);
            self.verticalListMenu.appendChildWidget(self.Label5);
            self.verticalListMenu.appendChildWidget(self.Label6);

            self.assetDetailContainer.appendChildWidget(self.verticalListMenu)
            self.appendChildWidget(self.assetDetailContainer);
            self.optioncontainer.addEventListener("keydown", function (evt) {
                switch (evt.keyCode) {
                    case KeyEvent.VK_DOWN: self.grid.getChildWidgets()[0].focus();
                        self.converter.moveElement(self.assetDetailContainer.outputElement, Utils.DIRECTION_Y, -300);
                        break;
                }
            });
        },
        appendBgImange: function () {
            self.containerreport.outputElement.style.backgroundImage = 'linear-gradient(to top, rgba(0,0,0,1) 0%,rgba(0,0,0,0.2) 50%),url("' + self.util.getCloudinaryUrl(self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.BACKGROUND_IMG_LAYOUT, 70) + self.src + '")'
        },


        // create Available language tabs using grid layout
        loadLanguageContainer: function () {
            self.languageArray = ["Hindi", "Marathi", "Gujarati"]
            self.regionlLangArray = ["हिन्दी", "मराठी", "ગુજરાતી"]

            self.column = self.languageArray.length;

            self.row = 1;
            self.grid = new Grid('language_landscape_grid', self.column, self.row, false, false);
            self.RegLanggrid = new Grid('reglanguage_landscape_grid', self.column, self.row, false, false);

            self.langauagecontainer = new Container("langauagecontainer");
            var langaugeHeader = new Label("LangaugeHeader", "Also Available In");
            self.langauagecontainer.appendChildWidget(langaugeHeader)


            for (self.grid_i = 0; self.grid_i < self.column; self.grid_i ++) {
                for (self.grid_j = 0; self.grid_j < self.row; self.grid_j ++) {
                    self.buts = new Button('languageBut_' + self.grid_i);
                    // self.buts.addClass('inline')
                    self.buts.addClass("languagLabel");
                    // self.innerlangcontainer = new Container("innerlang");
                    self.LangaugeLabel = new Label("LangaugeLabel_" + self.grid_i, self.languageArray[self.grid_i]);
                    self.LangaugeLabel.addClass("langlabelclass")
                    self.RegLangaugeLabel = new Label("RegLangaugeLabel_" + self.grid_i, self.regionlLangArray[self.grid_i]);
                    self.RegLangaugeLabel.addClass("reglanglabel")
                    // self.innerlangcontainer.addClass("languagLabel");
                    self.buts.appendChildWidget(self.LangaugeLabel)
                    self.buts.appendChildWidget(self.RegLangaugeLabel)
                    // self.buts.appendChildWidget(self.innerlangcontainer);
                    self.grid.setWidgetAt(self.grid_i, self.grid_j, self.buts);
                }
            }

            self.langauagecontainer.appendChildWidget(self.grid)
            self.assetDetailContainer.appendChildWidget(self.langauagecontainer)
            // self.appendChildWidget(self.langauagecontainer)

            self.langauagecontainer.addEventListener("keydown", function (evt) {
                switch (evt.keyCode) {
                    case KeyEvent.VK_UP: self.optioncontainer.focus();
                        self.converter.moveElement(self.assetDetailContainer.outputElement, Utils.DIRECTION_Y, 0);
                        break;

                    default: self.carouselContainer.focus();
                        self.converter.moveElement(self.assetDetailContainer.outputElement, Utils.DIRECTION_Y, -700);
                }
                // console.log('grid event', evt)


            });
        },
        addCarouselEventListener: function () {
            self.columnCarousel.addEventListener('select', function(evt){
                let data = evt.target.getDataItem() ? evt.target.getDataItem() : null;
                let assetId = data.asset_id ? data.asset_id : null;
                self.lastElement = data.images && data.images[0].cdn_url ? data.images[0].cdn_url : '';
                self.assetTitle = data.asset_title ? data.asset_title : '';
                if(assetId){
                    self.util.application.hideComponent(self.globals.ASSET_DETAIL_CONTAINER);
                    self.util.application.pushComponent(self.globals.ASSET_DETAIL_CONTAINER, self.globals.COMPONENT_PATH.ASSET_DETAIL_COMPONENT, {
                        src: self.lastElement,
                        title: self.assetTitle,
                        pageId : self.pageId,
                        from: "home",
                        assetId: assetId
                    });
                }
            })
        },
        footerDataBound: function () {
            let dataSource = new DataSource(null, new FooterFeed(), "loadData");
            let binder = new Binder(new FooterFormatter(), dataSource);
            binder.appendAllTo(self.optioncontainer);
            self.verticalListMenu.appendChildWidget(self.optioncontainer);
            // self.carouselContainer.appendChildWidget(self.columnCarousel);
        },
        // binding the dataSource for carousel by using the AssetDetailFormatter
        coloumnCarouselDatabound: function () {
            let dataSource = new DataSource(null, new AssetDetailFeed(self.detailPageResponse.seasons), "loadData");
            let binder = new Binder(new AssetDetailFormatter(), dataSource);
            binder.appendAllTo(self.columnCarousel);
            self.carouselContainer.appendChildWidget(self.columnCarousel);
        },
        recommendationCarouselDatabound: function () {
            var callback = function (data) {};
            let dataSource = new DataSource(null, new HomeFeed(self.apiResponse, callback), "loadData");
            let binder = new Binder(new HomeFormatter(), dataSource);
            binder.appendAllTo(self.columnCarousel);
            self.carouselContainer.appendChildWidget(self.columnCarousel);
        },
        // Creating the horizontal carousel and attaching the handler for navigation
        createCarouselWidgets: function () {
            try {
                self.columnCarousel = new Carousel("verticalcarousel", Carousel.orientations.VERTICAL);
                self.carouselContainer = new Container("show_carousel_container");
                self.carouselContainer.addClass("season_carousal_container");

                var handler = new ActivateFirstHandler();
                handler.setAnimationOptions({skipAnim: true});
                handler.attach(self.columnCarousel);
            } catch (error) {
                console.log("error:::", error);
            }
        },
        // Adding the carousel to detail container
        appendCarouselWidgets: function () {
            self.assetDetailContainer.appendChildWidget(self.carouselContainer)
        },
        // Align the carousel index based on the childWidgets count
        alignCarousel: function () {
            try {
                if (self.columnCarousel && self.columnCarousel.getChildWidgetCount()) {
                    self.columnCarousel.alignToIndex(1);
                }
            } catch (error) {
                console.log("errror::::", error);
            }
        }

    });
});
