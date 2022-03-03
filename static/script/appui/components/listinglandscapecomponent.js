/**
 * This is the listinglandscapecomponent.js page for ErosNow Application
 * This page is called from all the other key components to display carousels on click of navigation button in rail labels
 */
//Including the required widgets
define('app/appui/components/listinglandscapecomponent',
    [
        'antie/widgets/component',
        'antie/widgets/carousel',
        'antie/datasource',
        'app/appui/globals',
        'antie/widgets/carousel/binder',
        'antie/widgets/carousel/keyhandlers/activatefirsthandler',
        'antie/widgets/container',
        'logituit/libs/util',
        'antie/events/keyevent',
        'logituit/widgets/button',
        'antie/widgets/label',
        'antie/widgets/grid',
        'antie/widgets/textpager',
        'logituit/widgets/image',
    ],
    // Initiating the function with required parameters and global variable declaration
    function (Component, Carousel, DataSource, Globals, Binder, ActivateFirstHandler,
        Container, Util, KeyEvent, Button, Label, Grid, TextPager, Image) {
        'use strict';
        var self;
        return Component
            .extend({
                init: function () {
                    self = this;
                    self.globals = new Globals();
                    self.converter = new Util();
                    self.util = new Util();
                    this.init.base.call(this, self.globals.LISTING_CONTAINER);
                    self.itemsToBeRefreshed = [];
                    self.listingResult = [];
                    self.topFocussed = false;
                    self.leftFocussed = false;
                    self.firstIndex = 0;
                    self.lastIndex = 0;
                    self.count = 0;
                    self.pcount = 0;
                    self.gridData = {};
                    self.activeIndex = 0;
                    //Triggering the function before render in the DOM Elements
                    self.addEventListener('beforerender', function (evt) {
                        self._onBeforeRender(evt);
                    });
                    //Triggering the function when user selects navigation button to listing page 
                    self.addEventListener('aftershow', function (evt) {
                        self.getCurrentApplication().ready();
                        self._onAfterShow(evt);
                    });
                    //Triggering the function to clear refresh timer
                    self.addEventListener('afterhide', function () {
                        self.componentDestroyed = true;
                        self.clearRefreshTimer();
                    });

                    self.addEventListener('networkstatuschange', function (
                        evt) {
                    });
                    //Triggering the remote select event
                    self.addEventListener('select', function (evt) {
                    });
                },
                 //component 'beforerender' event-listener callback 
                 _onBeforeRender: function (evt) {
                    self.declareVariable();
                    self.listPageLabel = null;
                    self.gridLayout = null;
                    
                    
                    if (evt.args && evt.args.id) {
                        self.id = evt.args.id;
                    }
                    if(evt.args && evt.args.layout){
                        self.gridLayout = evt.args.layout; 
                    }
                    if(evt.args && evt.args.title){
                        self.title = evt.args.title;
                    }
                    if(evt.args && evt.args.image){
                        self.img = evt.args.image
                        console.log(self.img,evt.args.image,"imagggeee plwasee")
                    }
                    self.data = JSON.parse(localStorage.getItem("Homeapiresponse"));
                    // self.data = self.img
                    self.apiData = evt.args && evt.args.apidata ? evt.args.apidata : null;
                    console.log(self.apiData,"apidata")
                    self.removeChildWidgets(evt);
                    self.createListingUi(self.data);
                
                    
                    // self.appendChildWidget(self.loadingListSkeleton);
                    // self.pageCategory = Globals.CATCHMEDIA.PAGE_CATEGORY.LISTING;
                    // self.callListingApi();
                },
                 //component 'aftershow' event-listener callback
                 _onAfterShow: function (evt) {
                    self.focus();
                    self.removeChildWidget(self.loadingListSkeleton);
                },
                 //Function to clear the timers
                 clearRefreshTimer: function () {
                    self.itemsToBeRefreshed = [];
                },
                // 
                 //Function to declare variables
                 declareVariable: function () {
                    // self.icon_not_subscribed = self.globals.PREMIUM_ICON;
                    // self.icon_subscribed = self.globals.PREMIUM_SUBSCRIBED;
                    // self.pageId =  Globals.CATCHMEDIA.PAGE_ID.LISTING;
                    // self.pageCategory = Globals.CATCHMEDIA.PAGE_CATEGORY.LISTING;
                    self.targetPage = null;
                    self.hasSeasons = false;
                    self.hasEpisodes = false;
                },
                
                //Success callback of listing api
                createListingUi: function (data) {
                    // if (data && data.resultObj && data.resultObj.containers && data.resultObj.containers.length && data.resultObj.containers[0].assets && data.resultObj.containers[0].assets.total) {
                        let bingeInf0 = {};
                        console.log(data,"datattatatattata")
                        
                        let listingData = data.items[1];
                        
                        // bingeInf0['retreive_url'] = listingData.retrieveItems ? listingData.retrieveItems : null;
                        // bingeInf0['total'] = listingData.assets.total;
                        // bingeInf0['rail_label'] =  (listingData.metadata && listingData.metadata.label) ? listingData.metadata.label : null ;
                        // bingeInf0['layout'] = self.gridLayout ? self.gridLayout : (listingData.layout) ? (listingData.layout) : null;
                        // self.carouselData = listingData.items;
                        self.carouselData = self.img.items
                        console.log(self.carouselData,"cdcdcdcd")
                        self.listPageLabel = (listingData.title) ? listingData.title : '';
                        self.createWidgets();
                        self.gridData = self.carouselData;
                        self.reset();
                        self.createGrid(self.carouselData,bingeInf0);
                        self.appendChildWidget(self.gridContainer);
                        self.grid.focus();
                        self.focus();
                        // self.removeChildWidget(self.loadingListSkeleton);
                    // } else {
                    //     self.removeChildWidget(self.loadingListSkeleton);
                    //     self.emptyContainer = new Container('mylist_container');
                    //     self.sampleButton = new Button('myListTitleButton');
                    //     self.emptyContainer.appendChildWidget(self.sampleButton);
                    //     self.myListIcon = new Image('mylist_icon', self.globals.MYLIST_ICON);
                    //     self.noDataLabel = new Label('noData', 'Currently there is no content');
                    //     self.emptyContainer.appendChildWidget(self.myListIcon);
                    //     self.emptyContainer.appendChildWidget(self.noDataLabel);
                    //     self.appendChildWidget(self.emptyContainer);
                    //     self.sampleButton.focus();
                    //     self.sampleButton.addEventListener('keydown', function (evt) {
                    //         self.getCurrentApplication().popComponent(self.globals.MAIN_CONTAINER);
                    //     });
                    // }
                    // let info = {
                    //     pageId: self.pageId,
                    //     pageCategory: self.pageCategory
                    // };
    
                },
                createWidgets: function () {
                    self.listingTitle = new Button('landscapelistingTitle');
                    var listingTitleLabel = new Label('listingTitleLabel');
                    listingTitleLabel.setText(self.title);
                    console.log(self.image,"imghhghghghgh")
                    self.listingTitle.appendChildWidget(listingTitleLabel);
                    self.appendChildWidget(self.listingTitle);
                    self.gridContainer = new Container('series_grid_container_landingscreen');
                    self.gridContainer.addClass('landscape_listing');
                    self.scrollContainer = new Container('scrollContainer');
                },
                createGrid: function (data,bingeInfo=null) {
                    var item, railName, id;
                    var currentItem, episodeTitle, title, thumbnailTitle;
                    self.dataCount = 0;
                    let activeChildIndex = 0;
                    if (data) {
                        if (self.grid && self.activeIndex < self.grid.getChildWidgetCount()) {
                            activeChildIndex = self.activeIndex;
                        } else {
                            activeChildIndex = 0;
                        }
                        self.column = 5;
                        self.row = data.length / self.column;
                        self.grid = new Grid('series_landscape_grid', self.column, self.row, false, false);
                        for (self.grid_i = 0; self.grid_i < self.row; self.grid_i++) {
                            for (self.grid_j = 0; self.grid_j < self.column; self.grid_j++) {
                                self.buts = new Button('searchBut_' + String(Math.random()));
                                if (data[self.dataCount]) {
                                    console.log(self.dataCount,"self.dataCount")
                                    
                                    if (data[self.dataCount] && data[self.dataCount]) {
                                        var imgVal = data[self.dataCount].images && data[self.dataCount].images[0] ? data[self.dataCount].images[0].cdn_url : '';
                                        // let img = data[self.dataCount].images[0] ? data[self.dataCount].images[0] : data[self.dataCount].images[1] ? data[self.dataCount].images[1] : data[self.dataCount].images[2] ? data[self.dataCount].images[2] : '';
                                        var landscapeImagePath = self.converter.getCloudinaryUrl(self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.LISTING_LANDSCAPE_LAYOUT) + imgVal;
                                        self.images = new Image('landscape_listing_image', landscapeImagePath);
                                    } 
                                    // else if (data.containers[self.dataCount].metadata && data.containers[self.dataCount].metadata.emfAttributes && data.containers[self.dataCount].metadata.emfAttributes.thumbnail) {
                                    //     var landscapeImagePath = self.converter.getCloudinaryUrl(self.globals.API_CONSTANTS.CAROUSEL_LAYOUT.LISTING_LANDSCAPE_LAYOUT) + data.containers[self.dataCount].metadata.emfAttributes.thumbnail;
                                    //     self.images = new Image('landscape_listing_image', landscapeImagePath);
                                    // } else {
                                    //     self.images = new Container('landscape_listing_image');
                                    //     self.images.addClass('blankContainer');
                                    // }
                                    let gradient = new Container();
                                    gradient.addClass('bg_gradient_grid');
                                    self.images.appendChildWidget(gradient);
                                    // if (data ) {
                                    //     self.icon_not_subscribed = self.globals.getPremiumIconNotSubscribed(data.containers[self.dataCount].metadata);
                                    //     self.icon_subscribed = self.globals.getPremiumIconSubscribed(data.containers[self.dataCount].metadata);
                                    // }
                                    // var premiumImage = new Image('premium-icon', self.icon_not_subscribed);
                                    // var premiumSubscribed = new Image('premium-subscribed', self.icon_subscribed);
                                    // if (
                                    //     data.containers[self.dataCount].metadata.emfAttributes && data.containers[self.dataCount].metadata.emfAttributes.value &&
									// 	data.containers[self.dataCount].metadata.emfAttributes.value === self.globals.SUBSCRIPTION_MODE.SVOD
                                    // ) {
                                    //     if (localStorage.getItem('user_state') === '2') {
                                    //         self.packOfCurrentAsset = data.containers[self.dataCount].metadata.emfAttributes.packageid;
                                    //         if (self.converter.isUserEntitled(self.packOfCurrentAsset)) {
                                    //             self.images.appendChildWidget(premiumSubscribed);
                                    //         } else {
                                    //             self.images.appendChildWidget(premiumImage);
                                    //         }
                                    //     } else {
                                    //         self.images.appendChildWidget(premiumImage);
                                    //     }
                                    // }
                                    
                                    var showTitle = new TextPager('showTitle', true);
                                    // if (data.containers[self.dataCount] && data.containers[self.dataCount].metadata && data.containers[self.dataCount].metadata.contentSubtype && data.containers[self.dataCount].metadata.contentSubtype === self.globals.API_CONSTANTS.OBJECT_SUBTYPE.EPISODE || data.containers[self.dataCount].metadata.contentSubtype === self.globals.API_CONSTANTS.OBJECT_SUBTYPE.BEHIND_THE_SCENES || data.containers[self.dataCount].metadata.contentSubtype === self.globals.API_CONSTANTS.OBJECT_SUBTYPE.CLIPS || data.containers[self.dataCount].metadata.contentSubtype === self.globals.API_CONSTANTS.OBJECT_SUBTYPE.CLIP) {
                                    //     if (data.containers[self.dataCount].metadata && data.containers[self.dataCount].metadata.title) {
                                    //         showTitle.setText(data.containers[self.dataCount].metadata.title);
                                    //         self.buts.appendChildWidget(showTitle);
                                    //         if (!data.containers[self.dataCount].metadata.episodeTitle) {
                                    //             showTitle.addClass('decreaseBottom');
                                    //         }
                                    //     }
                                    // }
                                    // var gridLabel = new TextPager('gridLabel', true);
                                    // if (data.containers[self.dataCount].metadata && data.containers[self.dataCount].metadata.episodeTitle && data.containers[self.dataCount].metadata.episodeNumber) {
                                    //     gridLabel.setText(
                                    //         `E${data.containers[self.dataCount].metadata.episodeNumber}. ${data.containers[self.dataCount].metadata.episodeTitle}`
                                    //     );
                                    // } else {
                                    //     episodeTitle = ((data.containers[self.dataCount].metadata && data.containers[self.dataCount].metadata.episodeTitle) ? data.containers[self.dataCount].metadata.episodeTitle + '-' : '');
                                    //     title = ((data.containers[self.dataCount].metadata && data.containers[self.dataCount].metadata.title) ? data.containers[self.dataCount].metadata.title : '');
                                    //     thumbnailTitle = episodeTitle.concat(title);
                                    //     gridLabel.setText((thumbnailTitle));
                                    // }
                                    self.buts.appendChildWidget(self.images);
                                    // DetailPageService.ageRatingLabelForLayout(data, self.buts, 'LISTING');
                                    self.buts.addClass('inline');
                                    // self.buts.appendChildWidget(gridLabel);

                                    self.currentItem = data;
                                    self.currentItem['index'] = self.dataCount;
                                    // if(bingeInfo){
                                    //     if(bingeInfo && bingeInfo.retreive_url && bingeInfo.retreive_url.uri && bingeInfo.retreive_url.uri.indexOf(self.globals.PLAYER_RETREIVEURI.RETREIVEURI) > -1){
                                    //         if(self.currentItem.metadata){
                                    //             self.currentItem.metadata['retrieveItems_uri'] = bingeInfo.retreive_url.uri;
                                    //             self.currentItem.metadata['rail_label'] = bingeInfo.rail_label ? bingeInfo.rail_label : null;
                                    //             self.currentItem.metadata['layout'] = bingeInfo.layout ? bingeInfo.layout : null;
                                    //             self.currentItem['total'] = bingeInfo.total ? bingeInfo.total : null;
                                    //         }
                                    //     }
                                    // }
                                    // self.buts.setDataItem(self.currentItem);
                                    self.grid.setWidgetAt(self.grid_j, self.grid_i, self.buts);
                                }
                                self.dataCount++;
                                if (!data) {
                                    break;
                                }
                            }
                            self.count = self.count + 1;
                        }
                        self.gridContainer.removeChildWidgets();
                        self.gridContainer.appendChildWidget(self.grid);
                        self.scrollContainer.appendChildWidget(self.gridContainer);
                        if (self.grid && self.activeIndex < self.grid.getChildWidgetCount()) {
                            self.grid.setActiveChildIndex(activeChildIndex);
                            self.grid._activeChildWidget.focus();
                        }
                        self.appendChildWidget(self.scrollContainer);
                    }
                    self.gridEventListener();
                    // self.grid.addEventListener('select', self.gridSelect);
                    self.grid.addEventListener('click', function (evt) {
                        self.grid.focus();
                    });
                    self.grid.addEventListener('mouseover', function (evt) {
                        if (!evt.target._isFocussed) {
                            evt.target.focus();
                        }
                    });
                },
                 //Function to reset grid parameters
                 reset: function () {
                    self.row = 0;
                    self.column = 7;
                    self.top = 0;
                    self.activeRow = 0;
                    self.prevRow = 0;
                    self.amountToBeScrolled = 0;
                    self.verticalCount = 0;
                    self.bottom = 1;
                    self.horizonatalCount = 0;
                    self.right = 1;
                    self.left = 0;
                    self.activeRowSuggest = 0;
                },
                
                //Callback function for 'keydown' eventlistener in the grid
                gridEventListener: function () {
                    self.grid.addEventListener('keydown', function (evt) {
                        // if(evt.keyCode ===  KeyEvent.VK_BACK_SPACE && self.converter.isTizen()) {
                        //     return;
                        // }
                        switch (evt.keyCode) {
                        case KeyEvent.VK_DOWN:
                            let active_indexs_col = self.grid._selectedCol;
                            self.grid_row = Math.trunc(self.grid._rows);
                            self.activeIndex = self.grid_row * 7 + active_indexs_col;
                            if (self.grid._selectedRow == self.grid_row) {
                                self.dum += 1;
                                var countryCode = localStorage.getItem('countryCode');
                                if (countryCode == 'null') {
                                    countryCode = "IN";
                                }
                            }
                            break;
                        case KeyEvent.VK_BACK:
                        case KeyEvent.VK_BACK_SPACE:

                            self.util.application.popComponent(self.globals.MAIN_CONTAINER);
                            self.util.application.showComponent(self.globals.MENU_CONTAINER, self.globals.COMPONENT_PATH.MENU_COMPONENT);
                            self.util.application.showComponent(self.globals.MAIN_CONTAINER, self.globals.COMPONENT_PATH.HOME_COMPONENT, { apidata: self.apiData });
                        // sessionStorage.setItem("startingFromListingLandscape", '');
                        //     if (Globals.refreshHome) {
                        //         let lastArgs = self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.HOME_CONTAINER)._currentArgs;
                        //         self.navigationService.redirectToLanding(lastArgs,{from: self.globals.SIGNIN });
                        //         Globals.refreshHome = false;
                        //         self.targetPage = Globals.CATCHMEDIA.PAGE_ID.HOME;
                        //     } else {
                        //         self.targetPage = Globals.CATCHMEDIA.PAGE_ID.HOME;
                        //         self.hide();
                        //         self.converter.showContainer(self.globals.MENU_CONTAINER);
                        //         self.converter.showContainer(self.globals.HOME_CONTAINER);
                        //     }
                            // self.cmBackClick();
                            break;
                        }
                        setTimeout(function () {
                            self.handleFocusHorizontalList(evt);
                        }, 100);
                    });
                    self.grid.addEventListener('select', function (evt) {
                        self.onSelect(evt); 
                        console.log("hereee")
                    });
                    self.grid.addEventListener('click', function (evt) {
                        // self.onSelect(evt); 
                    });
                },
                
                //Function called when user exits from listing page to handle focus,key events in horizontal carousel
                handleFocusHorizontalList: function (evt) {
                     if (window.screen.height === self.globals.CSS_CONSTANTS.HD) {
                        self.amountToBeScrolled = (self.grid.getWidgetAt(0, 0).outputElement.clientHeight + (self.grid
                            .getWidgetAt(0, 0).outputElement.offsetTop) + 2);
                     } else {
                         self.amountToBeScrolled = (self.grid.getWidgetAt(0, 0).outputElement.clientHeight + (self.grid
                            .getWidgetAt(0, 0).outputElement.offsetTop) + 2);
                    }
                    if (self.grid.parentWidget != null) {
                        if ((evt.keyCode === KeyEvent.VK_UP && self.activeRow === 0)) {
                        }
                    }
                    if (evt.keyCode === KeyEvent.VK_DOWN &&
						self.activeRow < self.row - 1) {
                        if ((self.grid._selectedRow) > self.prevRow) {
                            self.activeRow++;
                        } else {
                            self.activeRow++;
                            for (var i = 0; i < self.grid.getChildWidgetCount(); i++) {
                                if (self.grid.getChildWidgets()[i] == null) {
                                    break;
                                }
                            }
                            self.grid.getChildWidgets()[i - 1].focus();
                        }
                    }
                    if (evt.keyCode === KeyEvent.VK_UP && self.activeRow > 0) {
                        self.activeRow--;
                    }
                    if (self.activeRow === self.bottom) {
                        if ((self.grid._selectedRow) > self.prevRow) {
                            self.bottom += 1;
                            self.top += 1;
                            self.verticalCount -= self.amountToBeScrolled - 5;
                            self.moveGrid(self.verticalCount);
                        }
                    }
                    if (self.activeRow === self.top - 1 && self.top > 0) {
                        self.bottom -= 1;
                        self.top -= 1;
                        self.verticalCount += self.amountToBeScrolled;
                        self.moveGrid(self.verticalCount);
                    }
                    self.prevRow = self.grid._selectedRow;
                },
                 //Function to relocate a grid element
                 moveGrid: function (verticalCount) {
                    self.converter.moveElement(self.grid.outputElement, Util.DIRECTION_Y,
                        verticalCount);
                },
                onSelect:function(evt){
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
                        from: self.globals.COMPONENT_PATH.LISTING_PAGE_COMPONENT,
                        assetId: assetId
                    });
                }


                }
            })
    }
);