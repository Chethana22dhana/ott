// import { LibraryTemplatePlugin } from "webpack";

require.def("app/appui/components/librarycomponent", [
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
    "antie/widgets/label",
    "antie/widgets/horizontallist",
    "app/appui/formatters/slformatter",
], function (Component, Carousel, Binder, ActivateFirstHandler, DataSource, HomeFormatter, HomeFeed, VerticalList, Container, Globals, Image, Util, KeyEvent, Button, Label, HorizontalList, SlFormatter) {
    "use strict";
    var self;
    return Component.extend({
        init: function init() {
            self = this;
            // self.homefeed = new HomeFeed();
            self.globals = new Globals();
            self.util = new Util();
            init.base.call(this, self.globals.LIBRARY_CONTAINER);
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
                if(!self.slContainerClick)
                self.onCarouselKeyDown(evt);
                // self._onComponentKeyDown(evt);
            });
            self.addEventListener("beforehide", function (evt) {
                evt.stopPropagation();
            });
        },
             // ToDo: can we execute these in load() and see what is the behavior
        _onBeforeRender: function (evt) {
            self.apiData = JSON.parse(localStorage.getItem("Libraryapiresponse"));
             self.sldata = self.apiData.containers[0];
            self.isLibraryEmpty= false;
            //  
            if(self.isLibraryEmpty){
                self.createText();
            }else{
                self.createWidgets();
                self.loadCarousels();
                self.createholdBtn();
                self.detailContainer.focus();
            }
        },
        _onAfterShow(evt) {
            if(!self.isLibraryEmpty){
             self.detailContainer.focus();
            }
             else{
                self.exploreBtn.focus();
             }
         
        },
        _onAfterHide(evt) {
           
            self.removeChildWidgets();
        },
        _onComponentKeyDown(evt) {},
         // creating a parent container Vertical List
         createWidgets: function () {
            self.detailContainer = new VerticalList("library_container");
            self.detailContainer.addClass("detail_background");
            self.appendChildWidget(self.detailContainer);
        },

        createText:function(){
            
           self.emptytext= new Label ("emptytext", "You haven't been watching anything. Let get to watching.")
           self.appendChildWidget(self.emptytext);
       
           self.emptytext1= new Label ("emptytext1", "Explore from our biggest collection of Movies, Shows and Originals")
           self.appendChildWidget(self.emptytext1);   
       
           self.exploreBtn = new Button("ExploreBtn");  
           self.appendChildWidget(self.exploreBtn); 
           self.btnLabel= new Label ("exploreBtnLabl", "Explore")
           self.exploreBtn.appendChildWidget(self.btnLabel);   
         },
         // Creating the carousel and passing the feed data
         loadCarousels: function () {
            self.createCarouselWidgets();
            self.appendCarouselWidgets();
            self.alignCarousel();
            self.attachCarouselEvtListeners();
            self.createCarousel();
           

        },

        createholdBtn:function(){
            self.holdbtn = new Button("holdbtn");  
            self.appendChildWidget(self.holdbtn); 
            self.holdbtnLabel= new Label ("holdBtnLabl", "Press and hold for more options")
            self.holdbtn.appendChildWidget(self.holdbtnLabel);
        },
        // Creating the horizontal carousel and attaching the handler for navigation
        createCarouselWidgets: function () {
            try {
                self.columnCarousel = new Carousel("verticalcarousel", Carousel.orientations.VERTICAL);
                self.carouselContainer = new Container("carousel_container");
                self.carouselContainer.addClass("carousel_container");

                var handler = new ActivateFirstHandler();
                handler.setAnimationOptions({skipAnim: true});
                handler.attach(self.columnCarousel);
               
                // console.log("carousal widget",self.getCurrentApplication().getRootWidget()._childWidgets.library_container._childWidgets.carouselComponent)
            } catch (error) {
                console.log("error:::", error);
            }
        },
        
        // Adding the carousel to detail container
        appendCarouselWidgets: function () {
            self.detailContainer.appendChildWidget(self.carouselContainer);
            
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
        },
           // Align the carousel index based on the childWidgets count
           attachCarouselEvtListeners: function (data) {
            try {
                // self.columnCarousel.addEventListener("focus", function (evt) {
                //     // self.createBanner();
                // });
                self.columnCarousel.addEventListener("keydown", function (evt) {
                    // if(evt.keyCode == 40){
                    //     let focusedRail = self.columnCarousel.getActiveChildWidget().getActiveChildWidget().getActiveChildWidget();
                    //     if(focusedRail.hasClass('buttonBlurred')){
                    //         focusedRail.removeClass('buttonBlurred');
                    //         focusedRail.addClass('buttonFocussed')
                    //     }
                    // }
                });
                self.columnCarousel.addEventListener("select", function (evt) {
                    self.util.application.hideComponent(self.globals.MENU_CONTAINER);
                    self.util.application.hideComponent(self.globals.HOME_CONTAINER);
                    let title = "";
                    if (self.columnCarousel.getActiveChildWidget() && self.columnCarousel.getActiveChildWidget().getActiveChildWidget() && self.columnCarousel.getActiveChildWidget().getActiveChildWidget().getActiveChildWidget() && self.columnCarousel.getActiveChildWidget().getActiveChildWidget().getActiveChildWidget().getChildWidgets() && self.columnCarousel.getActiveChildWidget().getActiveChildWidget().getActiveChildWidget().getChildWidgets()[1] && self.columnCarousel.getActiveChildWidget().getActiveChildWidget().getActiveChildWidget().getChildWidgets()[1].getText()) {
                        title = self.columnCarousel.getActiveChildWidget().getActiveChildWidget().getActiveChildWidget().getChildWidgets()[1].getText();
                    }
                    self.util.application.pushComponent(self.globals.ASSET_DETAIL_CONTAINER, self.globals.COMPONENT_PATH.ASSET_DETAIL_COMPONENT, {
                        src: self.lastElement,
                        title: title,
                        apidata: self.apiData,
                        from: "home"
                    });
                });
                self.columnCarousel.addEventListener("click", function (evt) {});
                self.columnCarousel.addEventListener("mouseover", function (evt) {
                    if (! evt.target._isFocussed) {
                        evt.target.focus();
                    }
                });
                // self.columnCarousel.addEventListener("databound", function (et) {
                //     self.setAlignForCulling(et);
                // });
            } catch (error) {
                console.log("errorrrrr.......", error);
            }
            
        },
         
        createCarousel: function () {
            try {
                self.coloumnCarouselDatabound();
               
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
            self.carouselContainer.appendChildWidget(self.columnCarousel);
        },
        onCarouselKeyDown: function (evt) {
            switch (evt.keyCode) {
                case KeyEvent.VK_LEFT:
                    if (self.getCurrentApplication() && self.getCurrentApplication().getRootWidget() && self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MENU_CONTAINER)) {
                        self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MENU_CONTAINER).focus();
                    }
                    break;

                // case KeyEvent.VK_UP:
                //     self.hideBanner();
                //     self.plusSlides(0);
                //     self.slbtnHorizontalList.focus();
                //     self.custcssbasedonslbtnfocus();
                //     break;

                default: evt.stopPropagation();
            }
        },

    });
});