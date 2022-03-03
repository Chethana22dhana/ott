require.def("app/appui/components/searchcomponent", [
    "antie/widgets/component",
    "app/appui/globals",
    "logituit/libs/util",
    "antie/widgets/verticallist",
    "antie/widgets/container",
    "logituit/widgets/button",
    "logituit/widgets/textbox",
    "logituit/widgets/keyboard",
    "antie/widgets/label",
    "antie/widgets/carousel",
    "antie/widgets/carousel/keyhandlers/activatefirsthandler",
    "logituit/widgets/loadingsearchskeleton",
    "antie/widgets/image",
    "app/appui/formatters/searchcarouselhorizontalformatter",
    "app/appui/datasources/homecarouselhorizontalfeed",
    "antie/datasource",
    "antie/widgets/carousel/binder",
    "antie/events/keyevent",
    "app/appui/formatters/homecarouselhorizontalformatter",
], function (Component, Globals, Util, VerticalList, Container, Button, Textbox, Keyboard, Label, Carousel, ActivateFirstHandler, LoadingSearchSkeleton, Image, SearchFormatter, HomeCarouselHorizontalFeed, DataSource, Binder, KeyEvent, Homeform) {
    "use strict";
    var self;
    var TAG = "SearchComponent";
    var searchRailLabel = "Trending Searches";
    return Component.extend({
        init: function init() {
            self = this;
            self.globals = new Globals();
            self.util = new Util();
            init.base.call(this, self.globals.SEARCH_CONTAINER);
            self.loadingSearchSkeleton = new LoadingSearchSkeleton();
            self.addEventListener("beforerender", function (evt) {
                self._onBeforeRender(evt);
            });
            // Triggering the functiton when user click back from the page
            self.addEventListener("afterhide", function (evt) {
                self._onAfterHide(evt);
            });
            self.addEventListener("aftershow", function (evt) { // setTimeout(function(){
                self.isPopUpshown = false;
                // self.getCurrentApplication().ready();
                self._onAfterShow(evt);
                // },5000)
            });
            // Triggering the remote key events like Left,Right,Down & Up naviagtion
            self.addEventListener("keydown", function (evt) {
                self.isPopUpshown = false;
                self.changeFocus(evt);
            });
            self.addEventListener("beforehide", function (evt) {
                evt.stopPropagation();
            });
            this.addEventListener("select", function (evt) {
                console.log("abcd");
                self.onKeyBoardSelectEvt(evt);
            });
            this.addEventListener("click", function (evt) {
                console.log("efgh");
                // debugger
                // self.onKeyBoardSelectEvt(evt);
            });

            this.addEventListener("mouseover", function (evt) {
                if (! evt.target._isFocussed) {
                    var ele = self.getActiveChildWidget().id;
                    var ele1 = self.getCurrentApplication()._focussedWidget.id;

                    evt.target.focus();
                    console.log(ele, ele1, "mouseover");
                }
            });
        },

        _onBeforeRender: function (evt) {
            // self.apiData = JSON.parse(localStorage.getItem('Showsapiresponse'));
            // self.sldata  = self.apiData.containers[1];
            if (self.parentWidget) {
                self.parentWidget.removeChildWidgets();
            }
            self.selectedKeyVal = "";
            // self.removeChildWidgets();
            self.activeCarouselIndex = 1;
            self.carouselWidth = 320;
            self.callTrendingsearchapi();
            
            // self.appendChildWidget(self.loadingSearchSkeleton);
            self.loadCarousels();
        },

        _onAfterShow: function (evt) { 
            self.searchKeyboard.focus();
        },
        _onAfterHide: function (evt) {
            self.removeChildWidgets();
        },
        callTrendingsearchapi: function () {
            self.globals.callForAPI(this.globals.XHR_METHOD_GET, "", "", this.globals.TRENDING_SEARCH, self.searchSuccessCallback, self.searchErrorCallback);
            self.trendingSeartch = true;
        },
        searchSuccessCallback: function (response) {
            self.columnSearchCarousel.removeChildWidgets();
            console.log(response);
            console.log(response);
            self.apiData = response.data;
            // self.sldata  = response.data
            console.log(self.apiData, self.sldata, "sldata");
            self.createSearchCarousel();
            
        },
        searchErrorCallback: function (error) {
            console.log(error);
        },
        loadCarousels: function () {
            self.createWidgets();
            self.createSearchCarouselWidgets();
            self.appendWidgets();
            self.appendSearchCarouselWidgets();
            self.attachfocusHandler();
            self.appendCarouselEventListener();
        },
        createWidgets: function (evt) {
            self.globals.logger().info("createWidgets", "Entering function.");
            try {
                self.searchVerticlList = new VerticalList("searchverticallist");
                self.searchVerticlList.addClass("search_verticalList");

                self.searchKeyboardContainerTopLeft = new Container("searchkeyboard_container_top_left");
                self.searchKeyboardContainerTopRight = new Container("searchkeyboard_container_top_right");
                self.miccontainer = new Container("mic");
                self.image = new Image("micImage", "static/img/search/voice_search.svg");
                self.miccontainer.addClass("micedit");
                self.miccontainer.appendChildWidget(self.image);
                self.SearchButton = new Button("SearchButton");
                self.SearchButton.addClass("searchButton");
                // self.searchCarouselContainer = new Container('searchCarouselContainer');
                // self.searchCarouselContainer.addClass('searchCarousles');
                // self.searchCarouselContainer.appendChildWidget(self.loadingSearchSkeleton);
                self.searchheader = new Label("searchHeader", "Today's Top Searches");
                self.searchheader.addClass("searchHead");

                self.searchCompText = new Textbox("searchcompTextBox", "", false, "text", "", "Search Movies/Actors/TV Shows...");
                self.keys = [
                    "abc123",
                    "1",
                    "2",
                    "3",
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "g",
                    "Delete",
                    "@#?",
                    "4",
                    "5",
                    "6",
                    "h",
                    "i",
                    "j",
                    "k",
                    "l",
                    "m",
                    "n",
                    "Search",
                    null,
                    "7",
                    "8",
                    "9",
                    "o",
                    "p",
                    "q",
                    "r",
                    "s",
                    "t",
                    "u",
                    "Space",
                    null,
                    ",",
                    "0",
                    ".",

                    "v",
                    "w",
                    "x",
                    "y",
                    "z",
                    null,
                    null,
                    "Arrow",
                ];

                self.searchKeyboard = new Keyboard("search_keyboard", 12, 4, self.keys, false, false);
                self.searchHistoryContainer = new Container("searchhistorycontainer");
                self.searchHistoryVerticalList = new VerticalList("searchhistoryverticallist");
                self.recentsearchtitle = new Label("recentsearchlabel", "Recent Searches");
                self.a = new Label("testing0", localStorage["testing" + 0]);
                self.b = new Label("testing1", localStorage["testing" + 1]);
                self.c = new Label("testing2", localStorage["testing" + 2]);
                self.d = new Label("testing3", localStorage["testing" + 3]);
                self.e = new Label("testing4", localStorage["testing" + 4]);
                self.f = new Label("testing5", localStorage["testing" + 5]);

                self.searchHistoryVerticalList.appendChildWidget(self.recentsearchtitle);
                self.searchHistoryVerticalList.appendChildWidget(self.a);
                self.searchHistoryVerticalList.appendChildWidget(self.b);
                self.searchHistoryVerticalList.appendChildWidget(self.c);
                self.searchHistoryVerticalList.appendChildWidget(self.d);
                self.searchHistoryVerticalList.appendChildWidget(self.e);
                self.searchHistoryVerticalList.appendChildWidget(self.f);

                self.searchHistoryContainer1 = new Button("searchhistorycontainer1");
                self.searchHistoryContainer2 = new Button("searchhistorycontainer2");
                self.searchHistoryContainer3 = new Button("searchhistorycontainer3");
                self.searchHistoryContainer4 = new Button("searchhistorycontainer4");
                self.searchHistoryLabel = new Label("searchhistorylabel", searchRailLabel);
                self.searchHistoryLabel.addClass("searchLabel");
                self.searchKeyboard.setActiveChildKey("a");
            } catch (error) {
            }
        },
        // Function to append widgets
        appendWidgets: function () {
            try {
                self.searchKeyboardContainerTopLeft.appendChildWidget(self.searchKeyboard);
                self.searchKeyboardContainerTopLeft.appendChildWidget(self.miccontainer);
                // self.searchKeyboard.addEventListener('select', self.dHandler);
                // self.searchKeyboard.addEventListener('click', self.dHandler);

                // for search history

                // self.createSearchHistoryList();
                self.searchHistoryContainer.appendChildWidget(self.searchHistoryLabel);
                self.searchHistoryContainer.appendChildWidget(self.searchHistoryVerticalList);

                self.searchKeyboardContainerTopLeft.appendChildWidget(self.searchHistoryContainer);
                self.searchKeyboardContainerTopLeft.appendChildWidget(self.searchHistoryContainer1);
                self.searchKeyboardContainerTopLeft.appendChildWidget(self.searchHistoryContainer2);
                self.searchKeyboardContainerTopLeft.appendChildWidget(self.searchHistoryContainer3);
                self.searchKeyboardContainerTopLeft.appendChildWidget(self.searchHistoryContainer4);

                self.appendChildWidget(self.searchKeyboardContainerTopLeft);
                self.SearchButton.appendChildWidget(self.searchCompText);
                self.searchKeyboardContainerTopRight.appendChildWidget(self.SearchButton);
                self.appendChildWidget(self.searchKeyboardContainerTopRight);
                // console.log(self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MAIN_CONTAINER)._currentArgs.apidata.containers[0].data[0])
                // self.searchCarouselContainer.appendChildWidget(self.searchheader);

                // self.searchKeyboardContainerTopRight.appendChildWidget(self.searchCarouselContainer);
                // self.appendChildWidget(self.searchKeyboardContainerTopRight);
                if (self.SearchButton) { // self.addEvtListner();
                }
            } catch (error) {
            }
        },
        // Function to create search carousel widgets
        createSearchCarouselWidgets: function () {
            try {
                self.columnSearchCarousel = new Carousel("horizontalCullingCarousel", Carousel.orientations.HORIZONTAL);
                self._attachCarouselHandler(animationFlag);
                self.carouselSearchContainer = new Container("carousel_search_container");
                self.carouselSearchContainer.addClass("carousel_search_container");
                var animationFlag = {
                    skipAnim: false
                };
            } catch (error) {
            }
        },

        _attachCarouselHandler: function (animationFlag) {
            try {
                var handler;
                handler = new ActivateFirstHandler();
                handler.setAnimationOptions(animationFlag);
                handler.attach(self.columnSearchCarousel);
            } catch (error) {
            }
        },
        changeFocus: function (evt) {
            console.log("abcdefgh");
            try {
                // if(evt.keyCode ===  KeyEvent.VK_BACK_SPACE && self.converter.isTizen()) {
                //     // return;
                //     console.log("came here")
                //     self
                //             .getCurrentApplication()
                //             .getRootWidget()
                //             .getChildWidget(self.globals.MENU_CONTAINER)
                //             .focus();
                // }

                self.isPopUpshown = false;
                var ele = self.getActiveChildWidget().id;
                // console.log(ele,"element");
                var keycode = evt.keyCode;

                switch (keycode) {
                    case KeyEvent.VK_UP:
                        //    evt.stopPropagation();
                        var ele1 = self.getActiveChildWidget().id;
                        var ele = self.getCurrentApplication()._focussedWidget.id;
                        self.SearchButton.focus();
                        console.log(ele, ele1, "mainvkup");
                        //
                        // self.searchVerticlList.focus();

                        console.log("here");
                        break;
                    case KeyEvent.VK_RIGHT:
                        console.log("Entered here");
                        // self.searchKeyboardContainerTopLeft.blur()
                        self.carouselSearchContainer.focus();
                        self.searchKeyboard.focus();
                        break;
                    case KeyEvent.VK_LEFT:
                        if (ele == "searchkeyboard_container_top_left") {
                            self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MENU_CONTAINER).focus();
                        } else if (ele == "searchkeyboard_container_top_right") {
                            self.searchKeyboard.focus();
                        }
                        break;

                    case KeyEvent.VK_DOWN: self.searchKeyboard.focus();
                        break;
                    case KeyEvent.VK_BACK: 
                        self.util.application.pushComponent(self.globals.MENU_CONTAINER, self.globals.COMPONENT_PATH.MENU_COMPONENT);
                        self.util.application.showComponent(self.globals.MAIN_CONTAINER, self.globals.COMPONENT_PATH.HOME_COMPONENT);
                        break;
                    case KeyEvent.VK_BACK_SPACE:
                        for (var i = 0; i <= 5; i++) {
                            var trail = true;
                            if (localStorage["testing" + i] === undefined) {
                                localStorage.setItem("testing" + i, self.selectedKeyVal);
                                console.log(localStorage["testing" + i], "testttttt" + i);
                                trail = false;
                                break;
                            } else {
                                console.log(localStorage["testing" + i], "testttttt" + i);
                            }
                        }
                        if (trail) {
                            if (self.selectedKeyVal !== "") {
                                for (i = 5; i >= 1; i--) {
                                    var j = i - 1;
                                    localStorage.setItem("testing" + i, localStorage["testing" + j]);
                                }

                                localStorage.setItem("testing" + 0, self.selectedKeyVal);
                                self.selectedKeyVal = "";
                            }
                        }
                        console.log(typeof self.selectedKeyVal, "sllslslslls");
                        console.log(localStorage["testing" + 0], "test0");
                        console.log(localStorage["testing" + 1], "test1");
                        console.log(localStorage["testing" + 2], "test2");
                        console.log(localStorage["testing" + 3], "test3");
                        console.log(localStorage["testing" + 4], "test4");
                        console.log(localStorage["testing" + 5], "test5");
                        // localStorage.setItem('test0', self.selectedKeyVal);
                        // localStorage.setItem('test1', 'testing 2');
                        // localStorage.setItem('test2', 'testing 3');

                        // for(var i in localStorage)
                        // {
                        //     console.log(localStorage[i]);
                        // }

                        // //test for firefox 3.6 see if it works
                        // for(var i=0, len=localStorage.length; i<len; i++) {
                        //     var key = 'test'+i;
                        //     var value = localStorage[key];
                        //     console.log(key + " => " + value);
                        // }

                        self.util.application.pushComponent(self.globals.MENU_CONTAINER, self.globals.COMPONENT_PATH.MENU_COMPONENT);
                        self.util.application.showComponent(self.globals.MAIN_CONTAINER, self.globals.COMPONENT_PATH.HOME_COMPONENT);
                        break;
                    case KeyEvent.VK_Q:
                        if (evt._defaultPrevented) {
                            return;
                        } else {
                            self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MAIN_CONTAINER).getChildWidgets()[0].addClass("home_container_blur");
                            self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MENU_CONTAINER).getChildWidgets()[0].addClass("home_container_blur");
                            self.converter.pushErrorComponent("homeExit", self.globals.MAIN_CONTAINER, true, self.globals.callbackExit, "search_component");
                        }
                        break;
                }
            } catch (error) {
            }
        },
        onKeyBoardSelectEvt: function (evt) {
            self.isPopUpshown = false;
            var keypressval = evt.target && evt.target.getChildWidgets().length && evt.target.getChildWidgets()[0].getText && typeof evt.target.getChildWidgets()[0].getText !== "undefined" ? evt.target.getChildWidgets()[0].getText() : "";
            if (keypressval === "Mic") {
                return;
            } else {
                self.SelectedCharcollection(evt);
                // self.onSelect(evt);
            }
        },
        // function which gets the searched value on select
        SelectedCharcollection: function (evt) {
            try {
                if (evt.target.parentWidget.id === "search_keyboard") {
                    var keypressval = evt.target.getChildWidgets()[0].getText();
                    self.textVal = document.getElementById("searchcompTextBox").value;
                    switch (keypressval) {
                        case "Delete":
                            var textValAfterDelete = self.textVal.substring(0, self.textVal.length - 1);
                            if (textValAfterDelete.length === 0 && self.selectedKeyVal.length > 0) { // self.searchInitiated = true;
                            }self.selectedKeyVal = textValAfterDelete;
                            break;
                        case "Space": self.selectedKeyVal = self.selectedKeyVal + " ";
                            break;
                            // case 'Search':
                            //     self.searchCarouselContainer.focus();
                            //     break;
                        case "Mic": self.searchType = "voice";
                            break;
                        case "abc123":
                            break;
                        case "Search":
                            break;
                        case "Arrow":
                            break;
                        case "@#?":
                            break;
                        default:
                            var charEntered = evt.target.getChildWidgets()[0].getText();
                            if (charEntered) {
                                if (self.moveToIndex > 0) {
                                    self.moveToIndex = 0;
                                }
                                self.selectedKeyVal = self.selectedKeyVal + charEntered;
                            }
                    }
                    self.selectedKeyVal = self.selectedKeyVal.charAt(0).toUpperCase() + self.selectedKeyVal.substr(1);
                    document.getElementById("searchcompTextBox").value = self.selectedKeyVal;
                    if (self.searchInitiated && self.selectedKeyVal.length == 0) {
                        self._onBeforeRender(evt);
                        self.searchKeyboard.focus();
                        self.searchInitiated = false;
                    }

                    if (self.selectedKeyVal.length >= 3) {
                        document.getElementById("searchhistorylabel").innerHTML = "Content Search";
                        console.log(self.selectedKeyVal.length, "length");
                        self.globals.callForAPI(this.globals.XHR_METHOD_GET, "", "", this.globals.CONTENT_SEARCH + self.selectedKeyVal, self.searchSuccessCallback, self.searchErrorCallback);
                        self.trendingSeartch = false;
                    } else {
                        if(!self.trendingSeartch){
                            document.getElementById("searchhistorylabel").innerHTML = "Trending Searches";
                            self.callTrendingsearchapi();
                            self.trendingSeartch = true;
                        }
                    }
                }
            } catch (error) {
            }
        },

        createSearchCarousel: function () {
            try {
                self.coloumnCarouselDatabound();
            } catch (error) {
                console.log("rerreererer", error);
            }
        },
        // binding the dataSource for carousel by using the homeformatter
        coloumnCarouselDatabound: function () {
            var callback = function (data) {};
            let dataSource = new DataSource(null, new HomeCarouselHorizontalFeed(self.apiData, callback), "loadData");
            let binder = new Binder(new SearchFormatter(), dataSource);
            binder.appendAllTo(self.columnSearchCarousel);
            if(!self.trendingSeartch){
                document.getElementById('horizontalCullingCarousel_WidgetStrip').style.left = "5px";
            }
        },
        appendSearchCarouselWidgets: function () { 
            // self.searchVerticlList.appendChildWidget(self.searchCarouselContainer);
            self.carouselSearchContainer.appendChildWidget(self.columnSearchCarousel);
            self.searchVerticlList.appendChildWidget(self.carouselSearchContainer);
            // self.searchCarouselContainer.appendChildWidget(self.searchVerticlList);
            // self.searchVerticlList.appendChildWidget(
            //     self.carouselSearchContainer
            // );
            self.searchKeyboardContainerTopRight.appendChildWidget(self.searchVerticlList);
            self.appendChildWidget(self.searchKeyboardContainerTopRight);
        },
        attachfocusHandler: function () {
            self.searchKeyboardContainerTopLeft.addEventListener("keydown", function (evt) {
                var ele1 = self.getActiveChildWidget().id;
                var ele = self.getCurrentApplication()._focussedWidget.id;
                console.log("fhfhifjfijijifjif", ele, ele1);
                var keycode = evt.keyCode;

                switch (keycode) {
                    case KeyEvent.VK_UP:
                        {
                            // let active_childWidget_id = (self.getActiveChildWidget() && self.getActiveChildWidget().id) ? self.getActiveChildWidget().id : null;
                            // console.log(active_childWidget_id)
                            console.log(self.columnSearchCarousel.getActiveChildWidget());
                            // let childWidgets = (self.columnSearchCarousel.getActiveChildWidget() && self.columnSearchCarousel.getActiveChildWidget().getChildWidgets()) ? self.columnSearchCarousel.getActiveChildWidget().getChildWidgets() : null;
                            // console.log(!self.setActiveChildWidget(childWidgets[0].parentWidget))
                            // if (active_childWidget_id && (active_childWidget_id == 'searchkeyboard_container_top_left' || active_childWidget_id == 'carousel_search_container') ) {
                            //     console.log("hereeeee cameeeeeeeeee")
                            //     childWidgets[0].setActiveChildWidget(childWidgets[0]);
                            //     console.log(childWidgets[0].parentWidget.id)
                            //     document.getElementById(childWidgets[0].parentWidget).classList.add('buttonFocussed')
                            //     //     debugger
                            //     debugger
                            //     }

                            if (ele1 == "searchkeyboard_container_top_left") {
                                console.log("working here");
                                self.columnSearchCarousel.getActiveChildWidget().focus();
                                // debugger
                                //    self.searchVerticlList.focus()
                                console.log(ele, ele1);
                                evt.stopPropagation();
                            }
                        }
                        // console.log("bharath",ele,ele1)
                        // if(document.getElementById('search_keyboard'))
                        // document.getElementById('search_keyboard').style.display = 'none';
                }
            });
        },
        appendCarouselEventListener: function () {
            self.columnSearchCarousel.addEventListener('keydown', function(e){
                if(!self.trendingSeartch){
                    self.handleEventListener(e);
                }
            });
            self.columnSearchCarousel.addEventListener('select', function(evt){
                let data = evt.target.getDataItem();
                let assetId = data && data.asset_id ? data.asset_id : null;
                self.lastElement = null;
                if(assetId){
                    self.assetTitle = data && data.asset_title ? data.asset_title : '';
                    if(data && data.images && data.images[0] && data.images[0].cdn_url){
                        self.lastElement =data.images[0].cdn_url;
                    } 
                    self.util.application.hideComponent(self.globals.MAIN_CONTAINER);
                    self.util.application.pushComponent(self.globals.ASSET_DETAIL_CONTAINER, self.globals.COMPONENT_PATH.ASSET_DETAIL_COMPONENT, {
                        src: self.lastElement,
                        title: self.assetTitle,
                        pageId : 0,
                        from: self.globals.COMPONENT_PATH.SEARCH_COMPONENT,
                        assetId: assetId
                    });
                }
            })
        },
        handleEventListener: function(evt){
            switch (evt.keyCode) {
                case KeyEvent.VK_LEFT:
                    self.getActiveChildWidget().getActiveChildWidget().getActiveChildWidget().getActiveChildWidget().setActiveChildIndex(self.activeCarouselIndex);
                    if(self.activeCarouselIndex > 0){
                        document.getElementById('horizontalCullingCarousel_WidgetStrip').style.left = '-'+self.carouselWidth+'px';
                        if(self.leftClick){
                            self.activeCarouselIndex --;
                            self.leftClick = false;
                        }
                        self.activeCarouselIndex --;
                        self.carouselWidth -= 160;
                        self.rightClick = true;
                    }
                    evt.stopPropagation();
                    break;
                case KeyEvent.VK_RIGHT: 
                    self.getActiveChildWidget().getActiveChildWidget().getActiveChildWidget().getActiveChildWidget().setActiveChildIndex(self.activeCarouselIndex);
                    if(self.getActiveChildWidget().getActiveChildWidget().getActiveChildWidget().getActiveChildWidget().getChildWidgetCount() > self.activeCarouselIndex){
                        document.getElementById('horizontalCullingCarousel_WidgetStrip').style.left = '-'+self.carouselWidth+'px';
                        if(self.rightClick){
                            self.activeCarouselIndex ++;
                            self.rightClick = false;
                        }
                        self.leftClick = true;
                        self.activeCarouselIndex ++;
                        self.carouselWidth += 80;
                    }
                    evt.stopPropagation();
                    break;
            }
        }
    });
});

// try {

//     var keycode = evt.keyCode;

//     switch (keycode) {
//         case KeyEvent.VK_UP:
//            evt.stopPropagation();
//            var ele1 = self.getActiveChildWidget().id
//            var ele = self.getCurrentApplication()._focussedWidget.id
//             self.carouselSearchContainer.focus();

//         console.log("here")
//         break;
//     case KeyEvent.VK_RIGHT:
//         console.log("Entered here")
//         // self.searchKeyboardContainerTopLeft.blur()
//         self.carouselSearchContainer.focus();
//         self.searchKeyboard.focus();
//         break;
//     case KeyEvent.VK_LEFT:
//         if (ele == 'searchkeyboard_container_top_left') {
//             self
//                 .getCurrentApplication()
//                 .getRootWidget()
//                 .getChildWidget(self.globals.MENU_CONTAINER)
//                 .focus();
//         } else if (ele == 'searchkeyboard_container_top_right') {
//             self.searchKeyboard.focus();
//         }
//         break;

//     case KeyEvent.VK_DOWN:
//         self.searchVerticalList.focus();
//         break;
//     }
// } catch (error) {
//     self.globals.logger().error(
//         TAG + 'changeFocus',
//         'Error in function, so displaying error ' + error + 'stack ' + error.stack || ''
//     );
// }
// self.globals.logger().info(TAG + 'changeFocus', 'Exiting function.');
