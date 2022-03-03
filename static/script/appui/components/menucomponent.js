define("app/appui/components/menucomponent", [
    "antie/widgets/component",
    "antie/widgets/verticallist",
    "antie/datasource",
    "antie/widgets/carousel/binder",
    "app/appui/formatters/menuformatter",
    "app/appui/datasources/menufeed",
    "antie/events/keyevent",
    'app/appui/globals',
    "logituit/libs/util",

], function (Component, VerticalList, DataSource, Binder, MenuFormatter, MenuFeed, KeyEvent, Globals, Utils) { // All components extend Component
    var self;
    return Component.extend({
        init: function init() {
            self = this;
            self.util = new Utils();
            self.globals = new Globals();
            self.activeElementIndex = 1;  
            localStorage.removeItem('activeTabIndex');       
            // It is important to call the constructor of the superclass
            init.base.call(this, self.globals.SIDEMENU_CONTAINER);
            // ===================================================================
            this.addEventListener("beforerender", function (ev) {
                self._onBeforeRender(ev);
            })
            this.addEventListener('aftershow', function (evt) {})
            this.addEventListener('afterhide', function (evt) {
                self.removeChildWidgets();
            })
            this.addEventListener("keydown", function (evt) { 
                self.selectedItem = evt.target;
                self.onCarouselKeydown(evt)
            })
            this.addEventListener("select", function (evt) {
                self.onCarouselSelect(evt)
            });
            self.addEventListener("aftershow", function (evt) {
                // if(self.activeElementIndex === 1){
                //     self.menuList._childWidgets.menu1.focus();
                // }  
                // else{
                //     let currentIndex = 'menu'+(self.activeElementIndex+1)
                //     self.menuList._childWidgets[currentIndex].focus()
                // }    
            });
        },

        _onBeforeRender: function (ev) {
            self.callForMenuAPI();
            // self.menuList._childWidgets.menu3.focus(); 
                    
        },
        callForMenuAPI: function () {
            self.globals.callForAPI(self.globals.XHR_METHOD_GET, '', '', self.globals.GET_MENU, self.menuSucess, self.menuError)
        },
        menuSucess: function (result,evt){
            if(!self.globals.getAccessToken()){
                self.MenuItem = result.data.guest.top_bar;
            }
            else if(self.globals.getAccessToken()){
                self.MenuItem = result.data.logged_in.top_bar;
            }
            self.createMenu(evt);
        },
        menuError: function (e){
            console.log(e);
        },
        createMenu: function (evt) {
            // self.menuFormatter = new MenuFormatter();
            // new MenuFeed();
            
            // create a DataSource
            self._menuDataSource = new DataSource(this, new MenuFeed(self.MenuItem), "loadMenu")

            self.menuList = new VerticalList("verticallist")
            
            // Binding the data
            var binderMenu = new Binder(new MenuFormatter(), self._menuDataSource)
            binderMenu.appendAllTo(self.menuList);
            let activeTabIndex = localStorage.getItem('activeTabIndex');
            if(activeTabIndex){
                activeTabIndex = parseInt(activeTabIndex);
                
                activeTabIndex = 'menu'+self.getTabName(activeTabIndex)
                self.activeElementIndex = activeTabIndex;
            }
            if(!activeTabIndex && (self.activeElementIndex === 1 && self.menuList._childWidgets && self.menuList._childWidgets.menu1)){
                self.menuList._childWidgets.menu1.focus();
            }  
            else{
                let currentIndex = 'menu'+(self.activeElementIndex)
                if(activeTabIndex && self.menuList._childWidgets && self.menuList._childWidgets[activeTabIndex]){
                    self.menuList._childWidgets[activeTabIndex].focus()
                }
                else  if(self.menuList._childWidgets && self.menuList._childWidgets[currentIndex]){
                    self.menuList._childWidgets[currentIndex].focus()
                }
            }  

            this.appendChildWidget(self.menuList);
            
        },
        getTabName: function(index){
            switch(index){
                case 0:
                    return 'search';
                case 1:
                    return 'home';
                case 2:
                    return 'movie';
                case 3: 
                    return 'shows';
                case 4: 
                    return 'music';
                case 5:
                    return 'tv';
                case 6:
                    return 'prime';
                default: return 'account';
            }
        },
        onCarouselSelect: function (evt){
            if (evt.target && evt.target.parentWidget._selectedIndex === 0) {
                
                if(evt.target.parentWidget._selectedIndex !== self.activeElementIndex){
                    self.showsapidata = JSON.parse(localStorage.getItem('Showsapiresponse'));
                    self.activeElementIndex = evt.target.parentWidget._selectedIndex;
                    if(this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.main_container.focus()){
                        self.util.application.popComponent(self.globals.MAIN_CONTAINER)
                    }
                    // if(this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.home_container.focus()){
                    //     self.util.application.popComponent(self.globals.HOME_CONTAINER);
                    // }
                    self.util.application.popComponent(self.globals.MENU_CONTAINER)
                    self.util.application.pushComponent(self.globals.MAIN_CONTAINER, 
                        self.globals.COMPONENT_PATH.SEARCH_COMPONENT,{apidata :self.showsapidata});
                }
                else{
                    self.util.application.popComponent(self.globals.MENU_CONTAINER)
                    self.util.application.pushComponent(self.globals.MAIN_CONTAINER, 
                        self.globals.COMPONENT_PATH.SEARCH_COMPONENT,{apidata :self.showsapidata});
                    this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.home_container.focus()
                }
               
            }
            if (evt.target && (evt.target.parentWidget._selectedIndex === 1 || evt.target.parentWidget._selectedIndex === 2 || evt.target.parentWidget._selectedIndex === 3 || evt.target.parentWidget._selectedIndex === 4 || evt.target.parentWidget._selectedIndex === 5 || (evt.target.parentWidget._selectedIndex === 6 && self.globals.getAccessToken()))) {
                if(evt.target.parentWidget._selectedIndex !== self.activeElementIndex){
                    // self.homeapidata = JSON.parse(localStorage.getItem('Homeapiresponse'));
                    self.activeElementIndex = evt.target.parentWidget._selectedIndex;
                    if(this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.main_container.focus()){
                        self.util.application.popComponent(self.globals.MAIN_CONTAINER)
                    }
                    // if(this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.home_container.focus()){
                    //     self.util.application.popComponent(self.globals.HOME_CONTAINER);
                    // }
                    self.util.application.pushComponent(self.globals.MAIN_CONTAINER, 
                        self.globals.COMPONENT_PATH.HOME_COMPONENT,{pageId: evt.target._dataItem.page_id});
                        
                }
                else{
                    this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.home_container.focus()
                }
            }
            // if (evt.target && (evt.target.parentWidget._selectedIndex === 2 || evt.target.parentWidget._selectedIndex === 3 || evt.target.parentWidget._selectedIndex === 4 || evt.target.parentWidget._selectedIndex === 5 || evt.target.parentWidget._selectedIndex === 6 || evt.target.parentWidget._selectedIndex === 8) ) {
            //     if(evt.target.parentWidget._selectedIndex !== self.activeElementIndex){
            //         self.showsapidata = JSON.parse(localStorage.getItem('Showsapiresponse'));
            //         self.activeElementIndex = evt.target.parentWidget._selectedIndex;
            //         // if(this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.main_container.focus()){
            //             self.util.application.popComponent(self.globals.MAIN_CONTAINER)
            //         // }
            //         // if(this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.home_container.focus()){
            //         //     self.util.application.popComponent(self.globals.HOME_CONTAINER);
            //         // }
            //         self.util.application.pushComponent(self.globals.MAIN_CONTAINER, 
            //             self.globals.COMPONENT_PATH.SHOWS_COMPONENT,{apidata :self.showsapidata});
            //     }
            //     else{
            //         this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.main_container.focus()
            //     }
               
            // }
            // if (evt.target && evt.target.parentWidget._selectedIndex === 2) {
            //     if(evt.target.parentWidget._selectedIndex !== self.activeElementIndex){
            //         self.moviesapidata = JSON.parse(localStorage.getItem('Moviesapiresponse'));
            //         self.activeElementIndex = evt.target.parentWidget._selectedIndex;
            //         if(this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.main_container.focus()){
            //             self.util.application.popComponent(self.globals.MAIN_CONTAINER)
            //         }
            //         // self.util.application.popComponent(self.globals.HOME_CONTAINER);
            //         self.util.application.pushComponent(self.globals.MAIN_CONTAINER, 
            //             self.globals.COMPONENT_PATH.MOVIES_COMPONENT,{apidata :self.moviesapidata});
            //     }
            //     else{
            //         this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.main_container.focus()
            //     }
               
            // }

            // if (evt.target && evt.target.parentWidget._selectedIndex === 4 ) {
            //     if(evt.target.parentWidget._selectedIndex !== self.activeElementIndex){
            //         self.homeapidata = JSON.parse(localStorage.getItem('Homeapiresponse'));
            //         self.activeElementIndex = evt.target.parentWidget._selectedIndex;
            //         if(this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.main_container.focus()){
            //             self.util.application.popComponent(self.globals.MAIN_CONTAINER)
            //         }
            //         // if(this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.home_container.focus()){
            //         //     self.util.application.popComponent(self.globals.HOME_CONTAINER);
            //         // }
            //         self.util.application.pushComponent(self.globals.MAIN_CONTAINER, 
            //             self.globals.COMPONENT_PATH.CHANNEL_COMPONENT,{apidata :self.homeapidata});
            //     }
            //     else{
            //         this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.home_container.focus()
            //     }
            // }
            
            if (evt.target && ((evt.target.parentWidget._selectedIndex === 6 && (!self.globals.getAccessToken())) || (evt.target.parentWidget._selectedIndex === 7 && self.globals.getAccessToken())) ) {
                if(evt.target.parentWidget._selectedIndex !== self.activeElementIndex){
                    // self.showsapidata = JSON.parse(localStorage.getItem('Showsapiresponse'));
                    self.activeElementIndex = evt.target.parentWidget._selectedIndex;
                    if(this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.main_container.focus()){
                        self.util.application.popComponent(self.globals.MAIN_CONTAINER)
                    }
                    // if(this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.home_container.focus()){
                    //     self.util.application.popComponent(self.globals.HOME_CONTAINER);
                    // }
                    self.util.application.pushComponent(self.globals.MAIN_CONTAINER, 
                        self.globals.COMPONENT_PATH.SIGNIN_COMPONENT);
                }
                else{
                    this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.main_container.focus()
                }
               
            }
            // if (evt.target && evt.target.parentWidget._selectedIndex === 8) {
            //     if(evt.target.parentWidget._selectedIndex !== self.activeElementIndex){
            //         self.libraryapidata = JSON.parse(localStorage.getItem('Libraryapiresponse'));
            //         self.activeElementIndex = evt.target.parentWidget._selectedIndex;
            //         if(this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.main_container.focus()){
            //             self.util.application.popComponent(self.globals.MAIN_CONTAINER)
            //         }
            //         // self.util.application.popComponent(self.globals.HOME_CONTAINER);
            //         self.util.application.pushComponent(self.globals.MAIN_CONTAINER, 
            //             self.globals.COMPONENT_PATH.LIBRARY_COMPONENT,{apidata :self.libraryapidata});
            //     }
            //     else{
            //         this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.main_container.focus()
            //     }
               
            // }
        },

        onCarouselKeydown: function (evt) {           
            switch(evt.keyCode){
                case KeyEvent.VK_RIGHT:
                    var data = self.selectedItem;
                    // if(self.activeElementIndex === 1){
                    //     this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.home_container.focus()
                    // }
                    // else if(self.activeElementIndex === 3){
                    //     this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.main_container.focus()
                    // }
                    // else if(self.activeElementIndex === 0){
                        this.getCurrentApplication().getRootWidget().getActiveChildWidget().parentWidget._childWidgets.main_container.focus();
                //  if(document.getElementsByClassName('iconLabel')){
                //      document.getElementsByClassName('iconLabel').style.display="none"
                //  }
                    // }
                    
            }
        }

    })


});
