define("logituit/keyhandlers/keyhandler", [
  "antie/class",
  "antie/events/keyevent",
  "antie/runtimecontext",
  "antie/datasource",
  "antie/widgets/carousel/binder",
  "app/appui/globals",
  "app/appui/formatters/homecarouselhorizontalformatter",
  "app/appui/datasources/homecarouselhorizontalfeed",
  "logituit/libs/util",
], function (
  Class,
  KeyEvent,
  RuntimeContext,
  DataSource,
  Binder,
  Globals,
  HorizontalFormatter,
  HorizontalFeed,
  Util
) {
  "use strict";
  return Class.extend({
    init: function init() {
      this._animationOptions = {};
      this.count = 0;
      this.timeInMilliSeconds = 100;
      this.isLongKeyPressReleased = true;
      this.movetoRight = false;
      this.rightArrowSelected = false;
      this.leftArrowSelected = false;
      this.getHeight = true;
      this.lastDataItemId = null;
      this.verticalSize = 0;
      this.globals = new Globals();
      this.util = new Util();
      this.horizontalPaginationInprogress = false;
    },

    attach: function attach(carousel) {
      this._carousel = carousel;
      this._addKeyListeners();
      this._addAlignmentListeners();
    },

    setAnimationOptions: function setAnimationOptions(options) {
      this._animationOptions = options;
    },

    _addKeyListeners: function _addKeyListeners() {
      var previousKey, nextKey, carousel, self;
      var device = RuntimeContext.getDevice();
      self = this;
      carousel = this._carousel;
      previousKey = carousel.orientation().defaultKeys().PREVIOUS;
      nextKey = carousel.orientation().defaultKeys().NEXT;
      carousel.addEventListener("keydown", function (ev) {
        var size;
        if (carousel.orientation().styleClass() === "horizontal") {
          size = self.getStopPoint(carousel);
        } else {
          if (
            self.getHeight ||
            self.verticalSize !== carousel.getChildWidgetCount()
          ) {
            self.verticalSize = carousel.getChildWidgetCount();
          }
          size = self.verticalSize;
          self.getHeight = false;
        }
        switch (ev.keyCode) {
          case previousKey:
            self.scrollToPrev(carousel, size, ev, self);
            break;
          case nextKey:
            self.scrollToNext(carousel, size, ev, self);
            break;
          case device.VK_LB:
            if (self.checkCarouselForXboxNavigation(carousel)) {
              self.scrollToPrev(carousel, size, ev, self);
            }
            break;
          case device.VK_RB:
            if (self.checkCarouselForXboxNavigation(carousel)) {
              self.scrollToNext(carousel, size, ev, self);
            }
            break;
        }
      });
      carousel.addEventListener("keypress", function (ev) {
        var size;
        if (carousel.orientation().styleClass() === "horizontal") {
          size = self.getStopPoint(carousel);
        } else {
          if (self.getHeight) {
            self.verticalSize = carousel.getChildWidgetCount();
          }
          size = self.verticalSize;
          self.getHeight = false;
        }
        switch (ev.keyCode) {
          case previousKey:
            self.previousKeyPress(carousel, size, ev, self);
            break;
          case nextKey:
            self.nextKeyPress(carousel, size, ev, self);
            break;
          case device.VK_LB:
            if (self.checkCarouselForXboxNavigation(carousel)) {
              self.previousKeyPress(carousel, size, ev, self);
            }
            break;
          case device.VK_RB:
            if (self.checkCarouselForXboxNavigation(carousel)) {
              self.nextKeyPress(carousel, size, ev, self);
            }
            break;
        }
      });

      carousel.addEventListener("focus", function () {
        if (
          carousel.orientation().styleClass() === "vertical" &&
          carousel.getActiveChildIndex() === 0
        ) {
          self.isLongKeyPressReleased = true;
        }
      });
      carousel.addEventListener("mouseover",function(evt){
        //console.log('mouseover');
        var size = null;
        self.showRailArrows(evt,carousel, size,self);
      
      })
      carousel.addEventListener("keyup", function () {
        self.isLongKeyPressReleased = true;
        clearInterval(self.timer);
      });
    },
    rightArrowClick: function(carousel, size, evt, self, arrowId){
      if(!document.getElementById("rightArrowimage_"+arrowId)){
        return;
      }
      let dataItem = carousel.getDataItem();
      if(!dataItem.rightArrowHandled){
        document.getElementById("rightArrowimage_"+arrowId).addEventListener('click',function(ev){
          if(carousel.nextIndex() == carousel.getChildWidgetCount()-1){
            sessionStorage.setItem("hideRightArrow", "true");
            document.getElementById("rightArrowimage_"+arrowId).classList.add("hide");
         }
         self.rightArrowSelected = true;
         self.scrollToNext(carousel, size, evt, self);
        });
        dataItem.rightArrowHandled = true;
        carousel.setDataItem(dataItem);
      }      
    },
    leftArrowClick: function(carousel, size, evt, self, arrowId){
      if(!document.getElementById("leftArrowimage_"+arrowId)){
        return;
      }
      let dataItem = carousel.getDataItem();
      if(!dataItem.leftArrowHandled){
        document.getElementById("leftArrowimage_"+arrowId).addEventListener('click',function(ev){
          if(carousel.nextIndex() == carousel.getChildWidgetCount()-1){
            sessionStorage.setItem("hideRightArrow", "true");
            document.getElementById("leftArrowimage_"+arrowId).classList.add("hide");
         }
         self.leftArrowSelected = true;
         self.scrollToPrev(carousel, size, evt, self);
        });
        dataItem.leftArrowHandled = true;
        carousel.setDataItem(dataItem);
      }
      
    },
    showOrHideArrow : function(carousel, arrowId, evt, self){
      var size = 0;
      if (carousel.orientation().styleClass() === "horizontal") {
           size = self.getStopPoint(carousel);
      }
      let dataItem = carousel.getDataItem();
      if(!dataItem){
        carousel.setDataItem({leftArrowHandled : false, rightArrowHandled: false});
      }      
      let itemCount = carousel.getChildWidgetCount();
      if(itemCount > 0){
         if(carousel.getChildWidgets()[0].outputElement && carousel.getChildWidgets()[0].outputElement.clientWidth > 0){
          if(document.getElementById("leftArrowimage_"+arrowId)){ 
            document.getElementById("leftArrowimage_"+arrowId).classList.add("hide");
          }
         }else{
          if(document.getElementById("leftArrowimage_"+arrowId)){ 
            document.getElementById("leftArrowimage_"+arrowId).classList.remove("hide");
            self.leftArrowClick(carousel, size, evt, self, arrowId);
          }
         }
         if(carousel.getChildWidgets()[itemCount -1] && carousel.getChildWidgets()[itemCount -1].outputElement && carousel.getChildWidgets()[itemCount -1].outputElement.clientWidth > 0 
         || carousel.getChildWidgets()[itemCount -3] && carousel.getChildWidgets()[itemCount -3].outputElement && carousel.getChildWidgets()[itemCount -3].outputElement.clientWidth > 0){
          if(document.getElementById("rightArrowimage_"+arrowId)){ 
            if(self.util.isElementVisible(carousel.getChildWidgets()[itemCount -1].outputElement) &&(itemCount < 8 || !self.util.isElementVisible(carousel.getChildWidgets()[itemCount -8].outputElement))){
              document.getElementById("rightArrowimage_"+arrowId).classList.add("hide");              
            }else{
              document.getElementById("rightArrowimage_"+arrowId).classList.remove("hide");
              self.rightArrowClick(carousel, size, evt, self, arrowId);
            }
          }
         }else{
          if(document.getElementById("rightArrowimage_"+arrowId)){ 
            document.getElementById("rightArrowimage_"+arrowId).classList.remove("hide");
            self.rightArrowClick(carousel, size, evt, self, arrowId);
          }
         }
      }

    },
    showRailArrows: function(evt,carousel, size,self){
      let arrowId = (carousel.parentWidget && carousel.parentWidget._dataItem && carousel.parentWidget._dataItem.id ) ? carousel.parentWidget._dataItem.id :  null;
      self.showOrHideArrow(carousel, arrowId, evt, self);
    },
    _addAlignmentListeners: function _addAlignmentListeners() {},

    checkMenuHide: function checkMenuHide(carousel) {
      return (
        carousel.id === "menubar" && carousel.hasClass("menuHide") === true
      );
    },

    scrollToNext: function scrollToNext(carousel, size, ev, self) {
      self.movetoRight = true;
      const isWrappingCarousel = carousel.hasClass(
        this.globals.CSS_CONSTANTS.CLASS_WRAPPING_STRIP
      );
      var isFilterCarousel = (carousel.parentWidget) ? carousel.parentWidget.id === "liveNow_filterbtn_container" : false;
      var isEpisodeCarousel = (carousel.parentWidget) ? carousel.parentWidget.id === this.globals.EPISODE_CONTAINER : false;
      if (
        self.checkMenuHide(carousel) === false &&
        carousel.nextIndex() !== null &&
        !isWrappingCarousel && !isFilterCarousel
      ) {
        if (carousel.orientation().styleClass() === "horizontal") {
          if (
            (carousel.getActiveChildIndex() >=
            (carousel.getChildWidgetCount() + 7) - (size))
          ) {
            carousel
              .getChildWidgets()
              [carousel.getActiveChildIndex() + 1].focus();
              if(self.rightArrowSelected){
                carousel.completeAlignment();
                carousel.alignNext(self._animationOptions);
              if(!isEpisodeCarousel)
                ev.stopPropagation();
                self.rightArrowSelected = false;
              }
          } else {
            let activeIndex = carousel.getActiveChildIndex();
            carousel.completeAlignment();
            carousel.alignNext(self._animationOptions);
            if(activeIndex === carousel.getActiveChildIndex() && carousel.nextIndex() != null){
              carousel.getChildWidgets()[carousel.getActiveChildIndex() + 1].focus();
            }
            if(!isEpisodeCarousel)
               ev.stopPropagation();
          }
        } else if (carousel.getActiveChildIndex() >= size - 2) {
          carousel
            .getChildWidgets()
            [carousel.getActiveChildIndex() + 1].focus();
        } else {
          self.hideTop(carousel);
          carousel.completeAlignment();
          carousel.alignNext(self._animationOptions);
          ev.stopPropagation();
        }
      } else if (
        carousel.nextIndex() == null &&
        carousel.orientation().styleClass() === "horizontal" &&
        ( carousel.parentWidget && carousel.parentWidget.id != this.globals.EPISODE_CONTAINER)
      ) {
        // change align index to first if the focus in at last item.
        carousel.completeAlignment();
        carousel.alignToIndex(0);
        carousel.setActiveChildIndex(0);
        carousel.getChildWidgets()[0].focus();
        ev.stopPropagation();
      } else if (carousel.nextIndex() != null && (isWrappingCarousel || isFilterCarousel)) {
        carousel.completeAlignment();
        carousel.alignNext(self._animationOptions);
        ev.stopPropagation();
        self.handleHorizontalPagination(carousel, self);
      }
      // self.handleHorizontalPagination(carousel, self);
    },

    scrollToPrev: function scrollToPrev(carousel, size, ev, self) {
      if(carousel && carousel.getChildWidgetCount()){
        let dataItemLength = carousel.getChildWidgetCount();
        let dataItem = carousel.getDataItem();
        if(carousel.parentWidget && carousel.parentWidget._dataItem && carousel.parentWidget._dataItem.id && dataItem && dataItem.rightArrowHandled){
        sessionStorage.setItem("hideRightArrow", "false");
      }
      }
      const isWrappingCarousel = carousel.hasClass(
        this.globals.CSS_CONSTANTS.CLASS_WRAPPING_STRIP
      );
      var isEpisodeCarousel = (carousel.parentWidget) ? carousel.parentWidget.id === this.globals.EPISODE_CONTAINER : false;
      var isFilterCarousel = (carousel.parentWidget) ? carousel.parentWidget.id === "liveNow_filterbtn_container" : false;
      if (
        self.checkMenuHide(carousel) === false &&
        carousel.previousIndex() !== null &&
        !isWrappingCarousel && !isFilterCarousel
      ) {
        if (carousel.orientation().styleClass() === "horizontal") {
            if (
              carousel.getActiveChildIndex() >
              (carousel.getChildWidgetCount() + 4) - (size)
            ) {
            carousel
              .getChildWidgets()
              [carousel.getActiveChildIndex() - 1].focus();
              if(self.leftArrowSelected){
                carousel.completeAlignment();
                carousel.alignPrevious(self._animationOptions);
                self.leftArrowSelected = false;
              }
              if(!isEpisodeCarousel)
                 ev.stopPropagation();
          } else {

            let activeIndex = carousel.getActiveChildIndex();            
            carousel.completeAlignment();
            carousel.alignPrevious(self._animationOptions);
            if(activeIndex === carousel.getActiveChildIndex() + 2 && carousel.previousIndex() != null){
              carousel.getChildWidgets()[carousel.getActiveChildIndex() - 1].focus();
            }
            if(!isEpisodeCarousel)
               ev.stopPropagation();
          }
        } else if (carousel.getActiveChildIndex() - 1 >= size - 1) {
          carousel
            .getChildWidgets()
            [carousel.getActiveChildIndex() - 1].focus();
        } else {
          self.revealTop(carousel);
          carousel.completeAlignment();
          carousel.alignPrevious(self._animationOptions);
          ev.stopPropagation();
        }
      } else if (
        carousel.previousIndex() != null &&
        carousel.getActiveChildIndex() != 0 &&
        carousel.orientation().styleClass() === "horizontal"
      ) {
        // handle the previous movement except the first item in case of wrapping carousel
        carousel.completeAlignment();
        carousel.alignPrevious(self._animationOptions);
        ev.stopPropagation();
      }
    },

    hideTop: function hideTop(carousel) {
      if (
        carousel.orientation().styleClass() === "vertical" &&
        carousel.nextIndex()
      ) {
        for (var i = 0; i <= carousel.getActiveChildIndex(); i++) {
          carousel.getChildWidgets()[i].addClass("display-none");
        }
      }
    },

    revealTop: function revealTop(carousel) {
      if (carousel.orientation().styleClass() === "vertical") {
        if (carousel.nextIndex()) {
          carousel
            .getChildWidgets()
            [carousel.getActiveChildIndex() - 1].removeClass("display-none");
        }
      }
    },

    previousKeyPress: function previousKeyPress(carousel, size, ev, self) {
      if (self.isLongKeyPressReleased) {
        self.isLongKeyPressReleased = false;
        self.timer = setTimeout(function () {
          if (carousel.previousIndex() !== null) {
            self.scrollToPrev(carousel, size, ev, self);
            self.isLongKeyPressReleased = true;
          }
        }, self.timeInMilliSeconds);
      }
    },

    nextKeyPress: function nextKeyPress(carousel, size, ev, self) {
      if (self.isLongKeyPressReleased) {
        self.isLongKeyPressReleased = false;
        self.timer = setTimeout(function () {
          if (carousel.nextIndex() !== null) {
            self.scrollToNext(carousel, size, ev, self);
            self.isLongKeyPressReleased = true;
          }
        }, self.timeInMilliSeconds);
      }
    },

    checkCarouselForXboxNavigation: function (carousel) {
      return (
        carousel.id !== "menubar" &&
        carousel.id !== "genreCarousel" &&
        carousel.id !== "verticalcarousel"
      );
    },

    getStopPoint: function (carousel) {
      var size = 0;
      if(carousel.getActiveChildWidget().outputElement){
        size = Math.floor(
          carousel._mask.getLength() /
            carousel.getActiveChildWidget().outputElement.clientWidth
        );
      }
        
        
      switch (carousel.id) {
        case "nowcarousel":
        case "nextcarousel":
        case "epgCarousel":
        case "liveCarousel":
          size++;
          break;
        case "menubar":
          size = 5;
          break;
        case (carousel.id.match(/_offer_page$/) || {}).input:
          size = 3;
          break;
        case "genreCarousel":
          size = 1;
          break;
        case "profileCarousel":
        case "avatarCarousel":
          size = 0;
        case "premiumcarousel":
          break;
        case "show_btn_carousel":
          size = this.util.getFitLayoutCount(carousel.getActiveChildWidget().outputElement.clientWidth);
          break; 
        case "filter_btn_carousel":
          size = 4;
          break;
        case "liveNow_filterbtn_carousel":
          size = this.util.getFitLayoutCount(carousel.getActiveChildWidget().outputElement.clientWidth);
          break;
        case "episode_carousel":
          var isEpisodeCarousel = (carousel.parentWidget) ? carousel.parentWidget.id === this.globals.EPISODE_CONTAINER : false;
          if(isEpisodeCarousel){
            if(carousel.parentWidget.hasClass('forkeyhandler')){
              size = 2;
            }
            else{
              size--;
            }
          }
          break;       
        default :
          size--;
          var isEpisodeCarousel = (carousel.parentWidget) ? carousel.parentWidget.id === this.globals.EPISODE_CONTAINER : false;
          if(!isEpisodeCarousel && size > 1){
            size = size - 1 ;
          }
          break;
      }
      return size;
    },

    handleHorizontalPagination: function (carousel, self) {
      let dataItem = carousel.parentWidget.getDataItem();
      if (
        !self.horizontalPaginationInprogress &&
        dataItem &&
        dataItem &&
        dataItem.total &&
        dataItem.total - 1 > dataItem.to
      ) {
        if (self.isEndOfView(carousel)) {
          // self.horizontalPaginationInprogress = true;
          const from = dataItem.to + 1;
          const to =
            dataItem.to + 5 > dataItem.total - 1
              ? dataItem.total - 1
              : dataItem.to + 5;
          if (!dataItem.widgetLength) {
            dataItem["widgetLength"] = carousel.getChildWidgets()[
              carousel.getActiveChildIndex()
            ].outputElement
              ? carousel.getChildWidgets()[carousel.getActiveChildIndex()]
                  .outputElement.clientWidth
              : "";
          }
          self
            .getPaginatingItems(dataItem, from, to, self)
            .then((resp) => {
              self.horizontalPaginationInprogress = false;
              if (resp && resp.data && resp.data.length > 0) {
                dataItem.data = resp.data;
                let previousRank = 0;
                if(carousel && carousel.getChildWidgetCount()> 0){
                  let lastElemInCarousel = carousel.getChildWidgets()[carousel.getChildWidgetCount() - 1];
                  previousRank =   (lastElemInCarousel.getDataItem() && lastElemInCarousel.getDataItem().rank) ? lastElemInCarousel.getDataItem().rank : 0;   
                }
                          
                dataItem.data.map((elem, i)=>{ 
                  			elem.rank =  previousRank + i + 1; 
                  		}); 
                dataItem["activeIndex"] = carousel.getActiveChildIndex();
                self.appendItemsToHorizontalCarousel(carousel, dataItem);
              }
            })
            .catch((error) => {
              self.horizontalPaginationInprogress = false;
              console.log(`Error${error}`);
            });
          /* const resp = await self.getPaginatingItems(dataItem, from, to, self);
          if (resp && resp.containers && resp.containers.length > 0) {
            dataItem.assets.containers = resp.containers;
            dataItem["activeIndex"] = carousel.getActiveChildIndex();
            self.appendItemsToHorizontalCarousel(carousel, dataItem);
          } */
        }
      }
    },

    isEndOfView: function (carousel) {
      if (carousel.getChildWidgetCount() > 3) {
        if(carousel.getChildWidgets()[carousel.getChildWidgetCount() - 3].outputElement){
          return (
            carousel.getChildWidgets()[carousel.getChildWidgetCount() - 3]
              .outputElement.clientWidth > 0
          );
        }        
      }
      return false;
    },

    getPaginatingItems: function (dataItem, from, to, self) {
      return new Promise((resolve, reject) => {
        // Here we have to handlle pagination logic of Horizontal pagination of cards
        // if (dataItem.retrieveItems && dataItem.retrieveItems.uri) {
          const collectionExtApi = self.globals.HOME_PAGE_API
          self.globals.callForAPI(
            self.globals.XHR_METHOD_GET,
            null,
            "",
            collectionExtApi,
            function (response) {
              if (response) {
                dataItem["from"] = from;
                dataItem["content_limit"] = to
                dataItem["to"] = to;
                resolve(response.data);
              } else {
                console.log(response.error);
                resolve(null);
              }
            },
            function (error) {
              console.log(error);
              resolve(null);
            }
          );
        // } else {
        //   resolve(null);
        // }
      });
    },

    appendItemsToHorizontalCarousel: function (carousel, item) {
      var dataSource = new DataSource(
        null,
        new HorizontalFeed(item),
        "loadData"
      );
      var binder = new Binder(new HorizontalFormatter(item), dataSource);
      binder.appendAllTo(carousel);
    },
  });
});
