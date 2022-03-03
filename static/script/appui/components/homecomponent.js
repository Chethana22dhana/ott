require.def("app/appui/components/homecomponent", [
    "antie/widgets/component",
    "antie/widgets/carousel",
    "antie/widgets/carousel/binder",
    "antie/widgets/carousel/keyhandlers/activatefirsthandler",
    "antie/datasource",
    "app/appui/formatters/homeformatter",
    "app/appui/datasources/homefeed",
    "antie/widgets/verticallist",
    "antie/widgets/container",
    "app/appui/globals",
    "antie/widgets/image",
    "logituit/libs/util",
    "antie/events/keyevent",
    "logituit/widgets/button",
    "antie/widgets/horizontallist",
    "app/appui/formatters/slformatter",
    "antie/widgets/label",
    'logituit/widgets/loadingskeleton',
], function (Component, Carousel, Binder, ActivateFirstHandler, DataSource, HomeFormatter, HomeFeed, VerticalList, Container, 
        Globals, Image, Util, KeyEvent, Button, HorizontalList, SlFormatter, Label, LoadingSkeleton) {
    "use strict";
    var self;
    return Component.extend({
        init: function init() {
            self = this;
            // self.homefeed = new HomeFeed();
            self.globals = new Globals();
            self.util = new Util();
            init.base.call(this, self.globals.HOME_CONTAINER);
            self.loadingSkeleton = new LoadingSkeleton();
            self.addEventListener("beforerender", function (evt) {
                self._onBeforeRender(evt);
            });
            // Triggering the functiton when user click back from the page
            self.addEventListener("afterhide", function (evt) {
                self._onAfterHide(evt);
            });
            self.addEventListener("aftershow", function (evt) {
                self._onAfterShow(evt);
            });
            // Triggering the remote key events like Left,Right,Down & Up naviagtion
            self.addEventListener("keydown", function (evt) {
                if (! self.slContainerClick) {
                    try{
                        self.onCarouselKeyDown(evt);

                    }
                    catch(e){
                        console.log("error catched",e)
                    }
                }                

                setTimeout(function () {
                    self._onHomeKeydown(evt);
                }, 200);
                // self._onComponentKeyDown(evt);
            });
            self.addEventListener("beforehide", function (evt) {
                evt.stopPropagation();
            });
            self.loadingSkeleton.addEventListener('keydown', function (evt) {
                self._onSkeltonKeydown(evt);
                console.log('keydown event' + evt);
            });
        },
        // ToDo: can we execute these in load() and see what is the behavior
        _onBeforeRender: function (evt) {
            self.callForVerticalPagination = true;
            // self.apiData = JSON.parse(localStorage.getItem("Homeapiresponse"));
            // self.sldata = self.apiData.containers[0];
            self.pageId = evt.args && evt.args.pageId ? evt.args.pageId : 1;
            localStorage.setItem('activeTabIndex',self.pageId);
            // self.apiData = JSON.parse(localStorage.getItem("Homeapiresponse"));
            // self.sldata = self.apiData.items[0];
            self.offset = 11;
            if (self.parentWidget) {
                self.parentWidget.removeChildWidgets();
            }
            self.callForPageAPI(self.pageId);
            self.removeChildWidgets();
            self.createWidgets();
            self.loadCarousels();
            self.appendChildWidget(self.loadingSkeleton);
            // self.slbtn.focus();
            // self.slContainerClick = false;
        },
        _onAfterShow(evt) {
            if (self.slbtn) 
                self.slbtn.focus();
            

        },
        _onAfterHide(evt) {
            self.removeChildWidgets();
        },
        _onComponentKeyDown(evt) {},
        // creating a parent container Vertical List
        createWidgets: function () {
            self.detailContainer = new VerticalList("detail_container");
            self.detailContainer.addClass("detail_background");
            self.appendChildWidget(self.detailContainer);
        },
         //component skeleton 'keydown' event-listener callback 
         _onSkeltonKeydown: function (evt) {
            // self.globals.logger().info(TAG + '_onSkeltonKeydown', 'Entering function.');

            try {
                console.log('_onSkeltonKeydown' + evt.keyCode);
                
                switch (evt.keyCode) {
                case KeyEvent.VK_LEFT:
                    console.log("HERE here")
                    
                    self.getCurrentApplication().getRootWidget().getChildWidget('menu_container').focus();
                    break;
                }
            } catch (error) {
                // self.globals.logger().error(
                //     TAG + '_onSkeltonKeydown',
                //     'Error in function, so displaying error ' + error + 'stack ' + error.stack || ''
                // );
            }
            // self.globals.logger().info(TAG + '_onSkeltonKeydown', 'Exiting function.');
        },

        _onHomeKeydown: function (evt) {

            try { // console.log('_onHomeKeydown' + evt.keyCode);
                switch (evt.keyCode) {
                        // case KeyEvent.VK_BACK:
                        // case KeyEvent.VK_BACK_SPACE:
                        //     if (evt._defaultPrevented) {
                        //         return;
                        //     } else {
                        //         // self.utils.pushErrorComponent('homeExit', self.globals.MAIN_CONTAINER, true, self.callbackExit);
                        //     }
                        //     break;
                    case KeyEvent.VK_DOWN:
                        let active_childWidget_id = (self.getActiveChildWidget() && self.getActiveChildWidget().id) ? self.getActiveChildWidget().id : null;
                        let childWidgets = (self.columnCarousel.getActiveChildWidget() && self.columnCarousel.getActiveChildWidget().getChildWidgets()) ? self.columnCarousel.getActiveChildWidget().getChildWidgets() : null;
                        if (active_childWidget_id && (active_childWidget_id === 'slcontainer' || active_childWidget_id === 'carousel_container') && childWidgets && childWidgets.length && childWidgets[0].getChildWidgets() && childWidgets[0].getChildWidgets().length) {
                            childWidgets[0].setActiveChildWidget(childWidgets[0].getChildWidgets()[0]);
                        }
                        break;
                }
            } catch (error) {
                // self.globals.logger().error(
                //     TAG + '_onHomeKeydown',
                //     'Error in function, so displaying error ' + error + 'stack ' + error.stack || ''
                // );
            }
            // self.globals.logger().info(TAG + '_onHomeKeydown', 'Exiting function.');
        },
        callForPageAPI: function (pageID){
            let user_state = self.globals.getAccessToken();
            user_state = user_state ? 'logged_in' : 'guest';
            let pageUrl = self.globals.HOME_PAGE_API+pageID+'?limit=10&offset=0&user_state='+user_state;
            self.globals.callForAPI(self.globals.XHR_METHOD_GET,'','', pageUrl, self.pageSuccessCallback, self.pageErrorCallback)
        },

        pageSuccessCallback: function (response){
            self.removeChildWidget(self.loadingSkeleton);
            self.apiData = response.data;
            self.limit = response.data.items.length;
            self.sldata = self.apiData.items[0];
            // self.coloumnCarouselDatabound();
            
            //this is not required,but temporarily using as there is no listing pageapi
            localStorage.setItem("Homeapiresponse",JSON.stringify(self.apiData) );

            self.createCarousel();
        },
        pageErrorCallback: function (error){
            console.log(error);
        },

        // Creating the carousel and passing the feed data
        loadCarousels: function () {
            self.createCarouselWidgets();
            self.appendCarouselWidgets();
            self.alignCarousel();
            self.attachCarouselEvtListeners();
        },
        // Creating the horizontal carousel and attaching the handler for navigation
        createCarouselWidgets: function () {
            try {
                self.columnCarousel = new Carousel("verticalcarousel", Carousel.orientations.VERTICAL);
                self.carouselContainer = new Container("carousel_container");
                self.carouselContainer.addClass("carousel_container");
                self.createBanner();
                var handler = new ActivateFirstHandler();
                handler.setAnimationOptions({skipAnim: true});
                handler.attach(self.columnCarousel);
            } catch (error) {
                console.log("error:::", error);
            }
        },
        // Adding the carousel to detail container
        appendCarouselWidgets: function () {
            self.appendChildWidget(self.carouselContainer);
        },
        createBanner: function () {
            self.image = new Image("banner_Image",);
            self.image.addClass("bannerImage");
            self.title = new Label("banner_Title",'')
            self.title.addClass("bannerTitle");
            self.desc = new Label('banner_Desc','');
            self.desc.addClass('bannerDesc')
            self.genre = new Label('banner_Genre','')
            self.genre.addClass('bannerGenre')
            self.shadowBtn = 'shadowButton'
            self.eroslogo = new Image('eroslogo');
            self.shadowButton = new Button(self.shadowBtn);
            self.image.appendChildWidget(self.eroslogo);
            self.appendChildWidget(self.shadowButton);
            self.image.appendChildWidget(self.title);
            self.image.appendChildWidget(self.desc);
            self.image.appendChildWidget(self.genre);
            self.appendChildWidget(self.image)
        },
        // Align the carousel index based on the childWidgets count
        alignCarousel: function () {
            try {
                if (self.columnCarousel.getChildWidgetCount()) {
                    for (var i = 0; i < self.columnCarousel.getChildWidgetCount(); i++) {
                        self.columnCarousel.getChildWidgets()[i].getChildWidgets()[1].alignToIndex(0);
                        self.columnCarousel.getChildWidgets()[i]
                            .removeClass('display-none');
                    }
                    self.columnCarousel.alignToIndex(0);
                }
            } catch (error) {
                // self.globals.logger().error(
                //     TAG + 'alignCarousel',
                //     'Error in function, so displaying error ' + error + 'stack ' + error.stack || ''
                // );
            }
        },
        // Align the carousel index based on the childWidgets count
        attachCarouselEvtListeners: function (data) {
            try {
                self.columnCarousel.addEventListener("focus", function (evt) {
                    self.getLargeImage(evt);
                });
                self.columnCarousel.addEventListener("keydown", function (evt) {
                    var activeIndex = self.columnCarousel.getActiveChildIndex();
                    var totalCarouselItems = self.columnCarousel.getChildWidgets().length;
                    if(self.limit !== self.offset - 1){
                        self.offset = self.limit;
                    }
                    if (self.callForVerticalPagination && self.limit !== self.offset) {
                        if (activeIndex === (totalCarouselItems - 3) || activeIndex === (totalCarouselItems - 2) || activeIndex === (totalCarouselItems - 1)) {
                            self.callForVerticalPagination = false;
                            let user_state = self.globals.getAccessToken();
                            user_state = user_state ? 'logged_in' : 'guest';
                            self.path = self.globals.HOME_PAGE_API+self.pageId+'?limit=10&offset='+self.offset+'&user_state='+user_state;
                            self.globals.callForAPI(self.globals.XHR_METHOD_GET,'','',self.globals.getDetailApi(self.path), function (response) {
                                self.apiData = response.data;
                                self.offset += 10;
                                self.limit += response.data.items.length;
                                self.coloumnCarouselDatabound();
                            }, self.successCallback, self.errorCallback)
                        }
                    }
                });
                self.columnCarousel.addEventListener("select", function (evt) {
                    console.log("evt",evt);
                    let assetId = evt.target.getDataItem() && evt.target.getDataItem().asset_id ? evt.target.getDataItem().asset_id : null;
                    if(assetId){
                        self.util.application.hideComponent(self.globals.MENU_CONTAINER);
                        self.util.application.hideComponent(self.globals.MAIN_CONTAINER);
                        self.util.application.pushComponent(self.globals.ASSET_DETAIL_CONTAINER, self.globals.COMPONENT_PATH.ASSET_DETAIL_COMPONENT, {
                            src: self.lastElement,
                            title: self.assetTitle,
                            apidata: self.apiData,
                            pageId : self.pageId,
                            from: "home",
                            assetId: assetId
                        });
                    }
                });
                self.columnCarousel.addEventListener("click", function (evt) {});
                self.columnCarousel.addEventListener("mouseover", function (evt) {
                    if (! evt.target._isFocussed) {
                        evt.target.focus();
                    }
                });
                self.columnCarousel.addEventListener("databound", function (et) {
                    // if (!self.carouselContainer.hasChildWidget('verticalcarousel')) {
                        self.carouselContainer.appendChildWidget(self.columnCarousel);
                    // }
                    self.setAlignForCulling(et);
                });
            } catch (error) {
                console.log("errorrrrr.......", error);
            }
        },

        getLargeImage: function (evt) {
            let data = evt.target.getDataItem();
                self.assetTitle = data && data.asset_title ? data.asset_title : '';
                if(data && data.images && data.images[0] && data.images[0].cdn_url){
                    self.lastElement =data.images[0].cdn_url;
                }            
        },
        // addkeydown event
        onCarouselKeyDown: function (evt) {
            switch (evt.keyCode) {
                case KeyEvent.VK_LEFT:
                    // if(self.slScroll){
                    //     self.autoSlide();
                    // }
                    console.log("hereerer")
                //    console.log("here",self.dotContainer._childWidgetOrder[0].focus()) 
                //    console.log(self.dotContainer._childWidgetOrder[0]._isFocussed,"check")
                //   if(!self.dotContainer._childWidgets.dot0._isFocussed){
                //       console.log("here");
                //       self.dotContainer._childWidgets.dot0._isFocussed=true
                //       console.log(self.dotContainer._childWidgets.dot0._isFocussed)
                //   }
                
                
                    if (self.getCurrentApplication() && self.getCurrentApplication().getRootWidget() && self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MENU_CONTAINER)) {
                        self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MENU_CONTAINER).focus();
                    }
                    break;

                case KeyEvent.VK_UP: self.plusSlides(0);
                    if (document.getElementById("dotContainer")) {
                        document.getElementById("dotContainer").style.display = "block";
                    }
                    if (document.getElementById('slcontainer')) {
                        document.getElementById('slcontainer').style.display = "block";
                    }
                    if(self.slbtnHorizontalList){
                        self.slbtnHorizontalList.focus();
                    }
                    self.custcssbasedonslbtnfocus();
                    break;

                default: evt.stopPropagation();
            }
        },

        // creating the banner and setting the alignment of culling
        setAlignForCulling: function () {
            try {
                setTimeout(function () {
                    self.callForVerticalPagination = true;
                    if (self.columnCarousel && self.columnCarousel.getChildWidgetCount()) {
                        for (var i = 0; i < self.columnCarousel.getChildWidgetCount(); i++) {
                            if (self.columnCarousel && self.columnCarousel.getChildWidgets()[i].getChildWidgets().length > 1) {
                                const focusToIndex = self.columnCarousel.getChildWidgets()[i].getChildWidgets()[1].getActiveChildIndex();
                                if (focusToIndex === 0 && self.columnCarousel.getChildWidgets()[i].getChildWidgets()[1].getChildWidgets()) {
                                    self.columnCarousel.getChildWidgets()[i].getChildWidgets()[1].recalculate();
                                    self.columnCarousel.getChildWidgets()[i].getChildWidgets()[1].alignToIndex(0);
                                    const length = self.columnCarousel.getChildWidgets()[i].getChildWidgets()[1].getChildWidgets()[0].outputElement ? self.columnCarousel.getChildWidgets()[i].getChildWidgets()[1].getChildWidgets()[0].outputElement.clientWidth : 0;
                                    try{
                                        self.columnCarousel.getChildWidgets()[i].getChildWidgets()[1].setWidgetLengths(length);
                                    }catch(e){
                                        console.error("error caougt",e)
                                    }                                
                                }
                            }
                        }
                    }
                }, self.globals.DELAY.HOMECOMPONENT);
            } catch (error) {
                console.log("erroor", error);
            }
        },

        createCarousel: function () {
            try {
                self.coloumnCarouselDatabound();
                self.createSpotlightBanner(self.sldata);
            } catch (error) {
                console.log("rerreererer", error);
            }
        },
        // binding the dataSource for carousel by using the homeformatter
        coloumnCarouselDatabound: function () {
            var callback = function (data) {};
            let dataSource = new DataSource(null, new HomeFeed(self.apiData, callback), "loadData");
            let binder = new Binder(new HomeFormatter(), dataSource);
            binder.appendAllTo(self.columnCarousel);
            // self.carouselContainer.appendChildWidget(self.columnCarousel);
        },

        // Function for creating the spolight banner and adding eventlistners
        createSpotlightBanner: function (data) { // self.globals.logger().info(TAG + 'createBanner', 'Entering function.');
            try {
                self.createSpotlightWidgets(data);
                self.appendSpotlightWidgets();
                self.startSpotLightDataBinding();

                if (! self.slideIndex) {
                    self.slideIndex = 1;
                }
                this.plusSlides(0);
                setTimeout(function () {
                    self.showSlides(self.slideIndex);
                }, self.globals.DELAY.DELAY_1000);
                self.slcontainer.addEventListener("focus", function (evt) {
                    if (evt.target.id === "slcontainer") {
                        self.fromLOne = false;
                        if (!self.slScroll) {
                            // self.autoSlide();
                        }
                    }
                });
                self.slcontainer.addEventListener("keydown", function (evt) {
                    self._onSlComponentKeyDown(evt);
                });
                self.slcontainer.addEventListener("mouseover", function (evt) {
                    if (! evt.target._isFocussed) {

                        evt.target.focus();

                    }
                    if (document.getElementById("sloptionshorizontalList")) {
                        document.getElementById("sloptionshorizontalList").style.display = "-webkit-flex";
                    }
                    var childWidgets = self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MAIN_CONTAINER);
                    if (childWidgets.getChildWidgets() && childWidgets.getChildWidgets().length && childWidgets.getChildWidgets()[0] && childWidgets.getChildWidgets()[0].getChildWidgets() && childWidgets.getChildWidgets()[0].getChildWidgets().length && childWidgets.getChildWidgets()[0].getChildWidgets()[1]) {
                        childWidgets.getChildWidgets()[0].getChildWidgets()[1].removeClass("move_homecarousel_container");
                    }
                    if (document.getElementById("dotContainer")) {
                        document.getElementById("dotContainer").style.display = "block";
                    }
                    if (document.getElementsByClassName("mySlides") && self.slideIndex && document.getElementsByClassName("mySlides")[self.slideIndex - 1]) {
                        document.getElementsByClassName("mySlides")[self.slideIndex - 1].style.display = "block";

                    }
                });
                self.optBtnPos1.addEventListener("keydown", function (evt) {
                    if (self.slOptionsHorizontalList._childWidgetOrder.length > 1) { // self.slBtnpos1eventlistner(evt);
                    }
                });
                self.optBtnPos2.addEventListener("keydown", function (evt) { // self.slBtnpos2eventlistner(evt);
                });
                self.optBtnPos3.addEventListener("keydown", function (evt) { // self.slBtnpos3eventlistner(evt);
                });

            } catch (error) { // self.globals.logger().error(TAG + 'createBanner', 'Error in function, so displaying error ' + error + 'stack ' + error.stack || '');
            }
            // self.globals.logger().info(TAG + 'createBanner', 'Exiting function.');
        },

        // Function call back for autoslide of the spotlight
        autoSlide: function () { // self.globals.logger().info(TAG + 'autoSlide', 'Entering function.');
            try {

                self.self.slScroll = setInterval(function () {
                    self.slScrollCounter ++;
                    self.plusSlides(1);

                }, 2000);
            } catch (error) {
                // self.globals.logger().error(
                //     TAG + 'autoSlide',
                //     'Error in function, so displaying error ' + error + 'stack ' + error.stack || ''
                // );
            }
            // self.globals.logger().info(TAG + 'autoSlide', 'Exiting function.');
        },

        _onSlComponentKeyDown: function (evt) { // self.globals.logger().info('_onSlComponentKeyDown', 'Entering function.');
            try {
                // self.autoPlayStylesReset();
                // self.onColumnCarouselFocus();
                self.fromslbtfocus = false;

                if (evt.keyCode == KeyEvent.VK_DOWN) {
                    self.slContainerClick = false;
                    self.stopAutoScroll();
                    self.fromslbtfocus = true;
                    // if (self.slbtn._isFocussed === true || (!self.optBtnPos1._isFocussed && !self.optBtnPos2._isFocussed && !self.optBtnPos3._isFocussed)) {
                    //     self.slOptionsHorizontalList.focus();
                    // if (document.getElementById('sloptionpos1')) {
                    //     if(self.getChildWidget('slcontainer') && self.getChildWidget('slcontainer').getChildWidget('sloptionshorizontalList') && self.getChildWidget('slcontainer').getChildWidget('sloptionshorizontalList').getChildWidgets().length){
                    //         self.optBtnPos1 = self.getChildWidget('slcontainer').getChildWidget('sloptionshorizontalList').getChildWidgets()[0];
                    //     }
                    //     self.optBtnPos1.focus();
                    //     self.custcssbasedonslbtnfocus();
                    // } else {
                    self._Focussed = true;
                    self.slsubdetailscontainer.removeChildWidgets();
                    if (document.getElementById('sloptionshorizontalList')) {
                        document.getElementById('sloptionshorizontalList').style.display = 'none';
                    }
                    if (document.getElementById('dotContainer')) {
                        document.getElementById('dotContainer').style.display = 'none';
                    }
                    if (document.getElementsByClassName('mySlides') && self.slideIndex) {
                        document.getElementsByClassName('mySlides')[self.slideIndex - 1].style.display = 'none';
                    }
                    if (document.getElementById('slcontainer')) {
                        document.getElementById('slcontainer').style.display = "none";
                    }
                    self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MAIN_CONTAINER).getChildWidgets()[0].getChildWidgets()[1].addClass('move_homecarousel_container');
                    self.carouselContainer.focus();
                    // self.addClassesBasedOnFoccussedLayout();
                    //     }
                    // }
                    //     else if (self.optBtnPos1._isFocussed === true || self.optBtnPos2._isFocussed === true || self.optBtnPos3._isFocussed === true) {


                    //     self.topFocussed = true;
                    //         self.slsubdetailscontainer.removeChildWidgets();
                    //         if (document.getElementById('sloptionshorizontalList')) {
                    //             document.getElementById('sloptionshorizontalList').style.display = 'none';
                    //         }
                    //         if (document.getElementById('dotContainer')) {
                    //             document.getElementById('dotContainer').style.display = 'none';
                    //         }
                    //         if (document.getElementsByClassName('mySlides') && self.slideIndex) {
                    //             document.getElementsByClassName('mySlides')[self.slideIndex - 1].style.display = 'none';
                    //         }
                    //         self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MAIN_CONTAINER).getChildWidgets()[0].getChildWidgets()[1].addClass('move_homecarousel_container');
                    //         self.carouselContainer.focus();
                    //         // self.addClassesBasedOnFoccussedLayout();
                    //     }
                } else if (evt.keyCode == KeyEvent.VK_RIGHT) {
                    self.slContainerClick = true;

                    if (self.slbtn._isFocussed === true) {

                        if (self.self.slScroll) {
                            clearInterval(self.self.slScroll);
                            self.fromLOne = true;
                            // self.autoSlide()
                        }

                        self.plusSlides(1);
                        // console.log(self.getCurrentApplication().getRootWidget()._childWidgets.home_container._childWidgets.carouselComponent.slcontainer._childWidgets.slbtnhorizontalList._childWidgets.slbtn._childWidgets.slideshowcontainer.id
                        // )
                    } else if (self.slOptionsHorizontalList._childWidgetOrder.length == 1) {
                        self.optBtnPos1.removeClass('sloption-btn-bg');
                        self.slbtn.focus();
                    } else if (self.slOptionsHorizontalList._childWidgetOrder.length == 2) {
                        self.optBtnPos2.removeClass('sloption-icon-bg');
                        self.slbtn.focus();
                    } else if (self.slOptionsHorizontalList._childWidgetOrder.length == 3) {
                        self.optBtnPos3.removeClass('sloption-icon-bg');
                        self.slbtn.focus();
                    }
                } else if (evt.keyCode == KeyEvent.VK_LEFT) {
                    self.slContainerClick = true;
                    console.log("here here here")
                    
                    // if (self.optBtnPos1._isFocussed === true) {
                    //     // self.playerDestroyonMenuFocus();
                    //     self.getCurrentApplication().getRootWidget()
                    //         .getChildWidget(self.globals.MENU_CONTAINER).focus();
                    if (self.self.slScroll) {
                        clearInterval(self.self.slScroll);
                        self.fromLOne = true;
                        // self.autoSlide()
                    }

                    self.plusSlides(-1);
                    self.custcssbasedonslbtnfocus();
                    // }
                } else if (evt.keyCode == KeyEvent.VK_UP) { // self.playerDestroyonMenuFocus();
                    self.slbtnHorizontalList.focus();
                    self.custcssbasedonslbtnfocus();
                }
            } catch (error) {
                // self.globals.logger().error(
                //      '_onSlComponentKeyDown',
                //     'Error in function, so displaying error ' + error + 'stack ' + error.stack || ''
                // );
            }
            // self.globals.logger().info( '_onSlComponentKeyDown', 'Exiting function.');
        },

        // To set CSS to spotlight buttons based on the button focussed on the spotlight
        custcssbasedonslbtnfocus: function () { // self.globals.logger().info(TAG + 'custcssbasedonslbtnfocus', 'Entering function.');
            try {
                if (self.slOptionsHorizontalList._childWidgetOrder.length == 1) {
                    self.optBtnPos1.removeClass('sloption-btn-bg');
                    if (self.slOptionsHorizontalList._childWidgetOrder[0]._isFocussed == true) {
                        self.optBtnPos1.addClass('sloption-btn-bg');
                    }
                } else if (self.slOptionsHorizontalList._childWidgetOrder.length == 2) {
                    self.optBtnPos1.removeClass('sloption-icon-bg');
                    self.optBtnPos2.removeClass('sloption-btn-bg');
                    if (self.slOptionsHorizontalList._childWidgetOrder[0]._isFocussed == true) {
                        self.optBtnPos1.addClass('sloption-icon-bg');
                    }
                    if (self.slOptionsHorizontalList._childWidgetOrder[1]._isFocussed == true) {
                        self.optBtnPos2.addClass('sloption-btn-bg');
                    }
                } else if (self.slOptionsHorizontalList._childWidgetOrder.length == 3) {
                    self.optBtnPos1.removeClass('sloption-icon-bg');
                    self.optBtnPos2.removeClass('sloption-btn-bg');
                    self.optBtnPos3.removeClass('sloption-icon-bg');
                    if (self.slOptionsHorizontalList._childWidgetOrder[0]._isFocussed == true) {
                        self.optBtnPos1.addClass('sloption-icon-bg');
                    } else if (self.slOptionsHorizontalList._childWidgetOrder[1]._isFocussed == true) {
                        self.optBtnPos2.addClass('sloption-btn-bg');
                    } else if (self.slOptionsHorizontalList._childWidgetOrder[2]._isFocussed == true) {
                        self.optBtnPos3.addClass('sloption-icon-bg');
                    }
                }
            } catch (error) {
                // self.globals.logger().error(
                //     TAG + 'custcssbasedonslbtnfocus',
                //     'Error in function, so displaying error ' + error + 'stack ' + error.stack || ''
                // );
            }
            // self.globals.logger().info(TAG + 'custcssbasedonslbtnfocus', 'Exiting function.');
        },

        // Creating spotlight

        createSpotlightWidgets: function (data) { // self.globals.logger().info(TAG + 'createSpotlightWidgets', 'Entering function.');
            try { // console.log('createSpotlightWidgets SELF' + self);
                self.slcontainer = new Container("slcontainer");
                // self.slcontainer.addClass("slideshow-container");
                self.onFocusbackgroundImage = new Button("onFocusbackgroundImage");
                self.slbtnHorizontalList = new HorizontalList("slbtnhorizontalList");
                self.slInfoContainer = new Container("slInfoContainer");
                self.slInfoContainer.addClass("sl_container");
                self.slbtn = new Button("slbtn");
                // self.slplayContainer = new Container("main_video");
                // self.slplayContainer.addClass("sl_player");
                self.slideshowcontainer = new Container("slideshowcontainer");
                self.slsubdetailscontainer = new Container("slsubdetailscontainer");
                self.epflogoContainer = new Container("epglogcontainer");
                self.carouselmastheadlogocontainer = new Container("carouselmastheadlogo");
                self.slOptionsHorizontalList = new HorizontalList("sloptionshorizontalList");
                self.optBtnPos1 = new Button("sloptionpos1");
                self.optBtnPos2 = new Button("sloptionpos2");

                self.optBtnPos3 = new Button("sloptionpos3");
                self.dotContainer = new Container("dotContainer");
            } catch (error) {
                console.log("error catched in appending:::::", error);
                // self.globals.logger().error(TAG + 'createSpotlightWidgets', 'Error in function, so displaying error ' + error + 'stack ' + error.stack || '');
            }
            // self.globals.logger().info(TAG + 'createSpotlightWidgets', 'Exiting function.');
        },

        appendSpotlightWidgets: function () { // self.globals.logger().info(TAG + 'appendSpotlightWidgets', 'Entering function.');
            try { // console.log('appendSpotlightWidgets SELF' + self);
                self.slcontainer.appendChildWidget(self.onFocusbackgroundImage);
                self.slbtn.appendChildWidget(self.slideshowcontainer);
                self.slcontainer.appendChildWidget(self.slInfoContainer);
                self.slbtnHorizontalList.appendChildWidget(self.slbtn);
                self.slcontainer.appendChildWidget(self.slbtnHorizontalList);
                // self.slcontainer.appendChildWidget(self.slplayContainer);
                self.slcontainer.appendChildWidget(self.dotContainer);
                self.slcontainer.appendChildWidget(self.slsubdetailscontainer);
                self.slcontainer.appendChildWidget(self.carouselmastheadlogocontainer);
                self.slcontainer.appendChildWidget(self.epflogoContainer);
                self.appendChildWidget(self.slcontainer);
                // console.log('appendSpotlightWidgets' + self.slcontainer);
            } catch (error) {
                console.log("rooororor", error);
                // self.globals.logger().error(TAG + 'appendSpotlightWidgets', 'Error in function, so displaying error ' + error + 'stack ' + error.stack || '');
            }
            // self.globals.logger().info(TAG + 'appendSpotlightWidgets', 'Exiting function.');
        },
        // Binding spotlight data to the widgets
        startSpotLightDataBinding: function () { // self.globals.logger().info(TAG + 'startSpotLightDataBinding', 'Entering function.');
            try {
                var dataSource,
                    formatter,
                    newDataSource = [],
                    binder;
                (dataSource = self.sldata.items),
                dataSource.forEach(function (value, index) {
                    value = {
                        ... value,
                        metadata: {
                            retrieveItems_uri: value.images[15],
                            rail_label: value.title
                        }
                    };
                    value["total"] = self.sldata.items.length;
                    // value['metadata']['rail_label'] = value.title;
                    // value['total'] = self.sldata.data.length;
                    newDataSource[index] = value;
                });
                (formatter = new SlFormatter()),
                (binder = new Binder(formatter, newDataSource));
                binder.appendAllTo(self.slideshowcontainer);
                self.slcontainer.focus();
                // console.log(self.slcontainer.focus());
            } catch (error) {
                console.log("err>>>>>>>>>>>", error);
                // self.globals.logger().error(TAG + 'startSpotLightDataBinding', 'Error in function, so displaying error ' + error + 'stack ' + error.stack || '');
            }
            // self.globals.logger().info(TAG + 'startSpotLightDataBinding', 'Exiting function.');
        },
        // Function to set the css for dotcontainer based on the slides length
        showSlides: function (n) { // self.globals.logger().info(TAG + 'showSlides', 'Entering function.');
            try {
                var i,
                    j;
                var slides = document.getElementsByClassName("mySlides");
                if (n > slides.length) {
                    self.slideIndex = 1;
                }
                if (n < 1) {
                    self.slideIndex = slides.length;
                }
                for (i = 0; i < slides.length; i++) {

                    slides[self.slideIndex - 1].style.transition = 5 + "s";
                    slides[self.slideIndex - 1].style.left = -100 + "%";
                    slides[i].style.display = "none";
                    self.createDotWidget(i);

                }

                var dots = document.getElementsByClassName("dot");
                // if (window.screen.height === self.globals.CSS_CONSTANTS.HD) {
                //     var60 = slides.length < 5 ? 96 - slides.length : slides.length <= 8 ? 93 - slides.length : 90 - slides.length;
                // } else {
                //     var setleft = slides.length <= 5 ? 96 - slides.length : slides.length < 8 ? 93 - slides.length : 90 - slides.length;
                // }

                for (i = 0; i < dots.length; i++) {
                    dots[i].className = dots[i].className.replace(" active", "");
                }
                slides[self.slideIndex - 1].style.display = "block";
                dots[self.slideIndex - 1].className += " active";
                document.getElementById("dotContainer").style.left = 60 + "%";
                for (i = 0; i < dots.length; i++) {
                    if (i == self.slideIndex - 1) {
                        dots[i].style.height = 8 + "px";
                        dots[i].style.width = 40 + "px";
                    } else {
                        dots[i].style.height = 3 + "px";
                        dots[i].style.width = 30 + "px";
                    }
                }


            } catch (error) {
               
            }
        },
        createDotWidget: function (i) { 
            try {
                var dot;
                dot = new Container("dot" + i);
                dot.addClass("dot");
                self.dotContainer.appendChildWidget(dot);
            } catch (error) {
                // self.globals.logger().error(
                //     TAG + 'createDotWidget',
                //     'Error in function, so displaying error ' + error + 'stack ' + error.stack || ''
                // );
            }
            // self.globals.logger().info(TAG + 'createDotWidget', 'Exiting function.');
        },

        plusSlides: function (n) { // self.globals.logger().info(TAG + 'plusSlides', 'Entering function.');
            try {
                if (self.optBtnPos1) { // self.slbtn.focus();
                    self.optBtnPos1.removeClass("sloption-btn-bg");
                }
                if (self.optBtnPos2) { // self.slbtn.focus()
                    self.optBtnPos2.removeClass("sloption-btn-bg");
                }
                if (self.optBtnPos3) {
                    self.slbtn.focus();
                    self.optBtnPos3.removeClass("sloption-btn-bg");
                }
                self.isSpotLightFocussed();
                // self.slbtn.focus();
                self.watchlist_option_type = "";
                self.playnow_option_type = "";
                self.plusslidesIndex += n;
                if(self.slsubdetailscontainer){
                    self.slsubdetailscontainer.removeChildWidgets();
                    self.slsubdetailscontainer.removeClass("slsubdetailscontainer-cust");
                    self.slsubdetailscontainer.removeClass("railssubdetailscontainer-cust");
                }
                if (self.slideIndex != 0) {
                    self.showSlides((self.slideIndex += n));
                }
                // console.log(self.slbtn._childWidgets.slideshowcontainer._childWidgetOrder[self.slideIndex - 1]._childWidgets);

                self.optionsData = self.slbtn._childWidgets.slideshowcontainer._childWidgetOrder[self.slideIndex - 1]._dataItem;
                // self.optionsData = self.slbtn._childWidgets.slideshowcontainer._childWidgetOrder[self.slideIndex - 1]._childWidgets;

                var optionsParseData = self.optionsData.editorialMetadata.spotlight_items ? JSON.parse(self.optionsData.editorialMetadata.spotlight_items) : null;
                self.contentId = self.optionsData.id;
                self.content_title = self.optionsData.metadata.title;
                let sltypeDetails = self.optionsData.metadata.pcVodLabel + " . " + self.optionsData.metadata.genres + " . " + self.optionsData.metadata.language;
                self.slpcvodLabel = self.optionsData.metadata.pcVodLabel;
                if (self.optionsData.metadata.genres && self.optionsData.metadata.genres.length) {
                    self.slgenres = self.optionsData.metadata.genres.join(", ");
                }
                self.langfullname = self.optionsData.metadata.language;
                let res = self.langfullname ? self.langfullname.toLowerCase() : null;
                // self.sllanguage = self.getLanguageFullName(res);
                self.slsubdetailscontainer.addClass("slsubdetailscontainer-cust");
                if (self.slpcvodLabel) {
                    self.slsubdetailscontainer.appendChildWidget(new Label(self.slpcvodLabel + ""));
                }
                if (self.slgenres) {
                    self.slsubdetailscontainer.appendChildWidget(new Label(self.slgenres + ""));
                }
                // self.sllanguage
                //     ? self.slsubdetailscontainer.appendChildWidget(
                //         new Label(self.sllanguage)
                //       )
                //     : "";
                self.optionsData["position"] = self.slideIndex;
                // try {
                //     self.catchMedia.mastheadImpression(self.optionsData,self.autoplay_duration);
                // } catch (err) {
                //     console.error('catchmedia error: self.catchMedia.mastheadImpression');
                // }

                // this.formatSlOptions(optionsParseData, self.contentId);
                let playerDestroyFlag = localStorage.getItem("PLAYER_DESTROY");
                if (playerDestroyFlag && playerDestroyFlag == "true") {
                    localStorage.setItem("PLAYER_DESTROY", "false");
                }
                // self.stopAutoScroll();
            } catch (error) {
                console.log(error)
            }
            // self.globals.logger().info(TAG + "plusSlides", "Exiting function.");
        },
        isSpotLightFocussed: function () {
            var activeWidget = self.getActiveChildWidget();
            if ((self.optBtnPos1 || self.optBtnPos2 || self.optBtnPos3) && activeWidget && activeWidget["id"] === "slcontainer") {
                self.slbtn.focus();
                return true;
            }
            return false;
        },
        // To get the full name of metadta language on the spotlight
        getLanguageFullName: function (langCode) {
            // self.globals
            // .logger()
            // .info(TAG + "getLanguageFullName", "Entering function.");
            try {
                if (! langCode) {
                    return "";
                }
                let lang;
                self.langfullTitle = self.globals.getConfigData().config.language_iso_code;
                if (self.langfullTitle) {
                    for (lang = 0; lang < self.langfullTitle.length; lang++) {
                        if (self.langfullTitle[lang].code == langCode) {
                            return self.langfullTitle[lang].title;
                        }
                    }
                } else {
                    return "";
                }
            } catch (error) {
                // self.globals
                //     .logger()
                //     .error(
                //       TAG + "getLanguageFullName",
                //       "Error in function, so displaying error " +
                //         error +
                //         "stack " +
                //         error.stack || ""
                //     );
            }
            // self.globals
            // .logger()
            // .info(TAG + "getLanguageFullName", "Exiting function.");
        },


        // Function for formatting the spotlight options
        formatSlOptions: function (sloptions, contentid) {
            // self.globals
            // .logger()
            // .info(TAG + "formatSlOptions", "Entering function.");
            try {
                self.watchlistFlag = false;
                self.remainderFlag = true;
                self.sl_options_arr = [];
                var opt_i,
                    opt_len,
                    opt_type,
                    opt,
                    cust_opt_len,
                    mli,
                    mllength;
                opt_len = sloptions !== null && sloptions.length;
                if (self.WatchListData != null) {
                    mllength = self.WatchListData.length;
                    for (mli = 0; mli < mllength; mli++) {
                        if (self.WatchListData[mli].id == contentid) {
                            self.watchlistFlag = true;
                        }
                    }
                } else {
                    self.watchlistFlag = false;
                }
                if (self.channelLive == true) {
                    self.GetRemainderGlobalData = self.GetRemainderEPGAllData;
                } else if (self.sportsLive == true) {
                    self.GetRemainderGlobalData = self.GetRemainderAllData;
                }
                if (self.GetRemainderGlobalData != null) {
                    var rem_indx,
                        remaide_len;
                    remaide_len = self.GetRemainderGlobalData.length;
                    for (rem_indx = 0; rem_indx < remaide_len; rem_indx++) {
                        if (self.GetRemainderGlobalData[rem_indx].assetId == contentid) {
                            self.remainderFlag = true;
                        }
                    }
                } else {
                    self.remainderFlag = true;
                }
                for (opt_i = 0; opt_i < opt_len; opt_i++) {
                    opt = sloptions[opt_i];
                    opt_type = sloptions[opt_i].type;
                    if (opt_type != Globals.DOWNLOAD && opt_type != Globals.SHARE) {
                        self.sl_options_arr.push(opt);
                    }
                }
                this.createsloptions(self.sl_options_arr);
                var deviceSpotlight = localStorage.getItem("deviceSpotlight");
                if (! self.WatchListData && !JSON.parse(deviceSpotlight)) {
                    if (self.sl_options_arr && self.sl_options_arr.length && self.sl_options_arr[0].type === "Watchlist") {
                        if (!(self.optionsData && self.optionsData.platformVariants && self.optionsData.platformVariants.length && self.optionsData.platformVariants[0].hasTrailer)) {
                            var rippleContainer = new Container("sloptionpos-ripple");
                            rippleContainer.appendChildWidget(new Container("sloption-ripple-effect"));
                            self.optBtnPos1.appendChildWidget(rippleContainer);
                            self.addRippleEffect();
                        }
                    }
                }
            } catch (error) { // self.globals.logger().error(TAG + "formatSlOptions", "Error in function, so displaying error " + error + "stack " + error.stack || "");
            }
            // self.globals.logger().info(TAG + "formatSlOptions", "Exiting function.");
        },
        // Function callback for stopping the auto scrolling on the spotlight
        stopAutoScroll: function () {
            // self.globals
            // .logger()
            // .info(TAG + "stopAutoScroll", "Entering function.");
            try {
                if (self.self.slScroll) {
                    clearInterval(self.self.slScroll);
                    self.self.slScroll = null;
                    var playerMetadata = self.playerObj; // localStorage.getItem("playerObj")
                    if (playerMetadata) {
                        let playerDestroyFlag = localStorage.getItem("PLAYER_DESTROY");
                        if (! playerDestroyFlag || playerDestroyFlag == "false") {
                            self.playerMetadata = null;
                            playerDestroy(playerMetadata.player);
                            localStorage.setItem("PLAYER_DESTROY", "true");
                            self.playerObj = null;
                            self.trayAutoPlay = null;
                        }
                    }
                }
                if (self.slTimeout) {
                    clearTimeout(self.slTimeout);
                    self.slTimeout = null;
                }
            } catch (error) { // self.globals.logger().error(TAG + "stopAutoScroll", "Error in function, so displaying error " + error + "stack " + error.stack || "");
            }
            // self.globals.logger().info(TAG + "stopAutoScroll", "Exiting function.");
        }
    });
});
