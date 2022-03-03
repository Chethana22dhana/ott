require.def("app/appui/components/playercomponent", [
    "antie/widgets/component",
    "antie/widgets/verticallist",
    "antie/widgets/container",
    "app/appui/globals",
    "logituit/libs/util",
    "antie/events/keyevent",
    "logituit/widgets/button",
    "antie/widgets/label",
],
function(Component, VerticalList, Container, Globals, Util, KeyEvent, Button, Label){
    "use strict";
    var self;
    return Component.extend({
        init: function init() {
            self = this;
            // self.homefeed = new HomeFeed();
            self.globals = new Globals();
            self.util = new Util();
            init.base.call(this, self.globals.PLAYER_CONTAINER);

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
                self.onCarouselKeyDown(evt);
                // self._onComponentKeyDown(evt);
            });
            self.addEventListener("beforehide", function (evt) {
                evt.stopPropagation();
            });
        },
        // ToDo: can we execute these in load() and see what is the behavior
        _onBeforeRender: function (evt) {
            //call player
            let contentId = evt.args && evt.args.contentId ? evt.args.contentId : null;
            self.getContentProfile(contentId);
            self.pageId = evt.args && evt.args.pageId ? evt.args.pageId : null;
            self.asset_id = evt.args && evt.args.asset_id ? evt.args.asset_id : null;
            // self.apiData = JSON.parse(localStorage.getItem("Homeapiresponse"));
            // self.sldata = self.apiData.containers[0];
            self.createWidgets();
            self.createCarouselWidgets();
            self.appendCarouselWidgets();
            // self.loadCarousels();
            self.button1.focus();
             // self.slContainerClick = false;


            // self.slContainerClick = false;
        },
        _onAfterShow(evt) {
            self.button1.focus();
        },
        _onAfterHide(evt) {
            // self.hideBanner();
            self.removeChildWidgets();
        },
        getContentProfile: function (contentId){
            self.globals.callForAPI(self.globals.XHR_METHOD_GET, '', '', self.globals.CONTENT_PROFILE_API+ contentId, self.contentProfileSuccess, self.contentProfileFailure)

        },
        contentProfileSuccess: function ( res) {
            self.url = res.data.profiles[0].url
            self.asset_title = res.data.asset_title;
            self.asset_subtext = res.data.content_title;
            if(!self.asset_subtext){
                self.asset_subtext = '';
            }
            InitPlayer(true, true,"vod",self);
        },
        contentProfileFailure: function (e){
            if(e.error_code === "E037"){
                self.util.application.hideComponent(self.globals.PLAYER_CONTAINER);
                if(self.globals.getAccessToken()){
                    self.util.application.pushComponent(self.globals.SUBSCRIPTION_CONTAINER, self.globals.COMPONENT_PATH.SUBSCRIPTION_COMPONENT);
                }
                else{
                    self.util.showToast('Please do sign in to watch this content!');
                    localStorage.setItem('activeTabIndex',7);
                    self.util.application.pushComponent(self.globals.MENU_CONTAINER,
                        self.globals.COMPONENT_PATH.MENU_COMPONENT);
                    self.util.application.pushComponent(self.globals.MAIN_CONTAINER, 
                        self.globals.COMPONENT_PATH.SIGNIN_COMPONENT);
                }
            }
        },
        onCarouselKeyDown(evt) {
            switch (evt.keyCode) {
                case KeyEvent.VK_BACK_SPACE:
                case KeyEvent.VK_BACK:
                case KeyEvent.VK_Q:
                    self.goToDetailsPage();
                break;

                // bellow code is not require for desktop browser
                // case KeyEvent.VK_ENTER:
                // (document.getElementById('backbuttonid').style.backgroundColor === "black")
                
            }
        },
        // creating a parent container Vertical List
        createWidgets: function () {
            self.containerreport = new Container("containerreport");

            self.containerreport.addClass("reportdetail");
        },
        createCarouselWidgets: function () {
            self.button1 = new Button("buynow");
            var Label9 = new Label("label9", "");
            self.button1.appendChildWidget(Label9);
            self.button1.addClass("buynow");
            self.verticalListMenu = new VerticalList("assetDetailsPage");
            self.verticalListMenu.appendChildWidget(self.button1);

        },
         // Adding the carousel to detail container
         appendCarouselWidgets: function () {
            self.appendChildWidget(self.verticalListMenu);
        },
        goToDetailsPage: function(){
            document.getElementById('app').style.display = "block"
            self.util.application.hideComponent(self.globals.PLAYER_CONTAINER);
                    // let title = "";
                    // if (self.columnCarousel.getActiveChildWidget() && self.columnCarousel.getActiveChildWidget().getActiveChildWidget() && self.columnCarousel.getActiveChildWidget().getActiveChildWidget().getActiveChildWidget() && self.columnCarousel.getActiveChildWidget().getActiveChildWidget().getActiveChildWidget().getChildWidgets() && self.columnCarousel.getActiveChildWidget().getActiveChildWidget().getActiveChildWidget().getChildWidgets()[1] && self.columnCarousel.getActiveChildWidget().getActiveChildWidget().getActiveChildWidget().getChildWidgets()[1].getText()) {
                    //     title = self.columnCarousel.getActiveChildWidget().getActiveChildWidget().getActiveChildWidget().getChildWidgets()[1].getText();
                    // }
            self.util.application.pushComponent(self.globals.ASSET_DETAIL_CONTAINER, self.globals.COMPONENT_PATH.ASSET_DETAIL_COMPONENT,{from:"player", pageId: self.pageId, assetId: self.asset_id});
        },
    })

})