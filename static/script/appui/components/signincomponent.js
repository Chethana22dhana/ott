require.def("app/appui/components/signincomponent", [
    "antie/widgets/component",
    "antie/widgets/verticallist",
    "antie/widgets/container",
    'app/appui/globals',
    "antie/widgets/image",
    "logituit/libs/util",
    'antie/events/keyevent',
    "antie/widgets/label",
    "antie/widgets/button",
], function (Component, VerticalList, Container, Globals, Image, Utils, KeyEvent, Label, Button,) {
    "use strict";
    var self;
    return Component.extend({
        init: function init() {
            self = this;
            self.globals = new Globals();
            self.util = new Utils();

            // It is important to call the constructor of the superclass
            init.base.call(this, self.globals.SIGNIN_CONTAINER);

            self.addEventListener("beforerender", function (ev) {
                self._onBeforeRender(ev);
            });

            self.addEventListener("beforehide", function (evt) {});

            self.addEventListener("select", function (evt) {});
            self.addEventListener("mouseover", function (evt) {})
            self.addEventListener("keydown", function (evt) {
                // self.keyEventsHandler(evt);
                // self.attachLogininEvtListeners(evt);
            });
            self.addEventListener("aftershow", function (evt) {
                self._onAfterShow(evt);
            });
        },
        // ToDo: can we execute these in load() and see what is the behavior
        _onBeforeRender: function (evt) {
            if (self.parentWidget) {
                self.parentWidget.removeChildWidgets();
            }
            self.isPollingStopped = false;
            self.activationCode = null;
            self.removeChildWidgets();
            self.createWidgets();
            // for siginpage
            self.auth_token = self.globals.getAccessToken();
            if(self.auth_token){
                //User Logged in
                self.loadLoginWidgets();
            }
            else{
                self.loadContainer();
                self.attachsigninEvtListeners();
            }
        },
        _onAfterShow: function () { // self.button1.focus();
            if(self.signinButton){
                self.signinButton.focus();
            }


        },
        //    keyEventsHandler:function(evt){

        //        console.log("Mainnnnnn")
        //     switch (evt.keyCode) {
        //         case KeyEvent.VK_BACK_SPACE:console.log("HEREEEEEE")
        //         // self.util.application.pushComponent(self.globals.MENU_CONTAINER,self.globals.COMPONENT_PATH.MENU_COMPONENT);
        //         // self._onBeforeRender(evt)
        //         self.util.application.pushComponent(self.globals.MAIN_CONTAINER,self.globals.COMPONENT_PATH.SIGNIN_COMPONENT);
        //             case KeyEvent.VK_BACK:console.log("2")

        //         case KeyEvent.VK_LEFT:
        //             console.log("heree")
        //             if (self.getCurrentApplication() && self.getCurrentApplication().getRootWidget() && self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MENU_CONTAINER)) {
        //                 self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MENU_CONTAINER).focus();
        //             }


        //     default: evt.stopPropagation();
        //         }
        //    },
        attachsigninEvtListeners: function (data) {
            try {

                self.signinButton.addEventListener("select", function (evt) {
                    self.util.application.hideComponent(self.globals.MENU_CONTAINER);
                    document.getElementById("signinlist").style.display = "none";
                    self.loadsigninPageWidgets();
                    self.callActivationApi();
                });
                self.addEventListener("keydown", function (evt) {
                    switch (evt.keyCode) {
                        case KeyEvent.VK_BACK:
                        case KeyEvent.VK_BACK_SPACE: self.util.application.showComponent(self.globals.MENU_CONTAINER, self.globals.COMPONENT_PATH.MENU_COMPONENT);

                            self.util.application.pushComponent(self.globals.MAIN_CONTAINER, self.globals.COMPONENT_PATH.SIGNIN_COMPONENT);

                            self.signinButton.focus();


                            break;
                            // case KeyEvent.VK_BACK:console.log("2")
                            // this.parentWidget.back()

                        case KeyEvent.VK_LEFT:
                            // if (self.getCurrentApplication() && self.getCurrentApplication().getRootWidget() && self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MENU_CONTAINER)) {
                            //     self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MENU_CONTAINER).focus();
                            // }
                            if (self.getCurrentApplication() && self.getCurrentApplication().getRootWidget() && self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MENU_CONTAINER)) {
                                self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MENU_CONTAINER).focus();
                            }
                            break;


                            // default: evt.stopPropagation();
                    }
                })

                // self.columnCarousel.addEventListener("click", function (evt) {});
                // self.columnCarousel.addEventListener("mouseover", function (evt) {
                //     if (! evt.target._isFocussed) {
                //         evt.target.focus();
                //     }
                // });

            } catch (error) {
                console.log("errorrrrr.......", error);
            }
        },
        callActivationApi: function(){
            self.globals.callForAPI(self.globals.XHR_METHOD_POST, '', '', self.globals.GENERATE_ACTIVATION_CODE, self.generatesuccessCallback, self.generateerrorCallback);
        },
        generatesuccessCallback: function (response) {
            if(self.authCodeLabel){
                self.authCodeLabel.setText(response.data.code);
                if (!self.pollingInterval) {
                    self.pollingInterval = setInterval(function () {
                        if (!self.isPollingStopped) {
                            self.callDeviceActivationApi(response.data.code);
                        }
                    }, Globals.ACTIVATION_CODE_POLL);
                }
            }
        },
        generateerrorCallback: function (error) {
            console.log(error)
        },

        callDeviceActivationApi: function (code) {
            let data = {"code": code}
            self.globals.callForAPI(self.globals.XHR_METHOD_POST, data, '', self.globals.ACTIVATE_DEVICE_CODE, self.activationSuccessCallback, self.activationErrorCallback);
        },
        activationSuccessCallback: function (response){
            self.isPollingStopped = true;
            clearInterval(self.pollingInterval);
            self.globals.setAccessToken(response.data.auth_token);
            self.util.showToast('Device registered successfully!');
            self.goToHome();
        },
        activationErrorCallback: function (e){
            console.log("error",e)
        },
        // creating a parent container Vertical List
        createWidgets: function () {
            self.containerreport = new Container("containerreport");

            self.containerreport.addClass("reportdetails");

        },
        goToHome: function () {
            self.util.application.popComponent(self.globals.MAIN_CONTAINER);
            self.util.application.pushComponent(self.globals.MENU_CONTAINER,
            self.globals.COMPONENT_PATH.MENU_COMPONENT);
            self.util.application.pushComponent(
            self.globals.MAIN_CONTAINER,
            self.globals.COMPONENT_PATH.HOME_COMPONENT,{pageId:1});
           
         },
        loadContainer: function () {
            self.signinButton = new Button("signinbutton");
            self.signinButton.addClass("signinbtn")
            var signinLabel = new Label("Label", "Sign In");
            signinLabel.addClass("signinLabel")
            self.signinButton.appendChildWidget(signinLabel);


            self.loginButton = new Button("supportbutton1");
            self.loginButton.addClass("signinbtn")
            var loginLabel = new Label("loginLabel", "Support");
            loginLabel.addClass("signinLabel")
            self.loginButton.appendChildWidget(loginLabel);

            self.signinpageList = new VerticalList("signinlist");
            self.signinpageList.appendChildWidget(self.containerreport);
            self.signinpageList.appendChildWidget(self.signinButton);
            self.signinpageList.appendChildWidget(self.loginButton);

            self.appendChildWidget(self.signinpageList);


        },
        loadsigninPageWidgets: function () {
            self.loadsigin = new Container("LoadSignin");
            self.loadsigin.appendChildWidget(self.containerreport);
            self.appendChildWidget(self.loadsigin);
            self.createSignInWidgets();
            self.signinEvtlisteners();
            // self.attachLogininEvtListeners();
        },
        createSignInWidgets: function () {
            self.signinWidgetContainer = new Container('signin_widget_container');
            let logoImg = new Image('logo_img', 'static/img/signinpage/logo.svg');
            logoImg.addClass("logoImg")
            let signpageLabel1 = new Label('slabel_1', "Link To Your TV");
            signpageLabel1.addClass("slabel1");
            let signpageLabel2 = new Label('slabel_2', "To Link your TV visit");
            signpageLabel2.addClass("slabel2");
            let signpageLabel3 = new Label('slabel_3', "erosnow.com/activate");
            signpageLabel3.addClass("slabel3");
            let signpageLabel4 = new Label('slabel_4', "Sign In > Subscribe > Enter Code Below");
            signpageLabel4.addClass("slabel4");
            let barcodeImg = new Image('barcode_img', 'static/img/signinpage/barcode.png');
            barcodeImg.addClass("barcodeImg");
            let barcodeLabel1 = new Label("barcode_label1", "Scan QR Code to visit");
            barcodeLabel1.addClass('barcodelabel');
            let barcodeLabel2 = new Label("barcode_label2", "erosnow.com/activate");
            barcodeLabel2.addClass('barcodelabel');

            self.generateCodeButton = new Button('gen_code_button');
            self.generateCodeButton.addClass('gencodeButton');
            let imgRefresh = new Image('refresh_img', 'static/img/signinpage/icon_refresh.svg');
            imgRefresh.addClass('refreshimg');
            let gencodeLabel = new Label("gen_code_Label", "Generate New Code")
            gencodeLabel.addClass('gencodelabel');
            self.generateCodeButton.appendChildWidget(imgRefresh);
            self.generateCodeButton.appendChildWidget(gencodeLabel);

            let authCodeButton = new Button('auth_code_button');
            authCodeButton.addClass('authcodeButton');
            self.authCodeLabel = new Label('auth_code_label', self.activationCode);
            self.authCodeLabel.addClass("authcodelabel")
            authCodeButton.appendChildWidget(self.authCodeLabel);


            var footerLabel = new Label("footer_label", "When your TV is linked this screen automatically updates")
            footerLabel.addClass('footerlabel');

            self.signinWidgetContainer.appendChildWidget(logoImg);
            self.signinWidgetContainer.appendChildWidget(signpageLabel1);
            self.signinWidgetContainer.appendChildWidget(signpageLabel2);
            self.signinWidgetContainer.appendChildWidget(signpageLabel3);
            self.signinWidgetContainer.appendChildWidget(signpageLabel4);
            self.signinWidgetContainer.appendChildWidget(barcodeImg);
            self.signinWidgetContainer.appendChildWidget(barcodeLabel1);
            self.signinWidgetContainer.appendChildWidget(barcodeLabel2);
            self.signinWidgetContainer.appendChildWidget(authCodeButton);
            self.signinWidgetContainer.appendChildWidget(footerLabel);
            self.gencodevlist = new VerticalList('gencodevlist');
            self.gencodevlist.appendChildWidget(self.generateCodeButton);

            self.signinWidgetContainer.appendChildWidget(self.gencodevlist);
            self.appendChildWidget(self.signinWidgetContainer);


            self.appendChildWidget(self.signinWidgetContainer);

        },
        signinEvtlisteners: function () {
            self.generateCodeButton.focus();
            self.generateCodeButton.addEventListener("select", function (evt) {
                clearInterval(self.pollingInterval);
                self.pollingInterval = null;
                self.isPollingStopped = false;
                self.callActivationApi();
                // localStorage.removeItem("abc")
                // console.log("nvvnnvvfnjnfjvn")
                // self.result = '';
                // var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                // var charactersLength = characters.length;
                // for (var i = 0; i < 5; i++) {
                //     self.result += characters.charAt(Math.floor(Math.random() * charactersLength));
                // }
                //    localStorage.setItem("abc",self.result);
                // localStorage.setItem('itemKey', JSON.stringify(self.result));
                // if (document.getElementById("auth_code_label")) {
                //     // let item = JSON.parse(localStorage.getItem('itemKey'))
                //     document.getElementById("auth_code_label").innerHTML = self.activationCode
                // }


                // self.loadsigninPageWidgets();
            })
        },
        loadLoginWidgets: function () {
            self.loadlogin = new Container("LoadLogin");
            self.loadlogin.appendChildWidget(self.containerreport);
            self.createLoginInWidgets();
            self.attachLogininEvtListeners();
        },
        createLoginInWidgets: function () {


            self.Account = new Button("accountbutton");
            self.Account.addClass("logpagebtn")
            var accLabel = new Label("Label1", "Account");
            accLabel.addClass("logpageLabel")
            self.Account.appendChildWidget(accLabel);

            self.LangPref = new Button("langPref");
            self.LangPref.addClass("logpagebtn")
            var langLabel = new Label("Label2", "Language Preference");
            langLabel.addClass("logpageLabel")
            self.LangPref.appendChildWidget(langLabel);

            self.GenrePref = new Button("genrePref");
            self.GenrePref.addClass("logpagebtn")
            var genreLabel = new Label("Label3", "Genre Preference");
            genreLabel.addClass("logpageLabel")
            self.GenrePref.appendChildWidget(genreLabel);

            self.Device = new Button("devicebutton");
            self.Device.addClass("logpagebtn")
            var deviceLabel = new Label("Label4", "Device");
            deviceLabel.addClass("logpageLabel")
            self.Device.appendChildWidget(deviceLabel);

            self.Support = new Button("supportbutton");
            self.Support.addClass("logpagebtn")
            var supportLabel = new Label("Label5", "Support");
            supportLabel.addClass("logpageLabel")
            self.Support.appendChildWidget(supportLabel);

            self.SignOut = new Button("signoutbutton");
            self.SignOut.addClass("logpagebtn")
            var signoutLabel = new Label("Label6", "Sign Out");
            signoutLabel.addClass("logpageLabel")
            self.SignOut.appendChildWidget(signoutLabel);
            self.SignOut.addEventListener('select', function(e){
                self.globals.setAccessToken('');
                self.util.showToast("Logged out successfully!");
                self.goToHome();
                e.stopPropagation();
            })

            // for Account
            self.profileImg = new Image('profile_img', 'static/img/signinpage/bharath-photo.jpg', {
                width: 350,
                height: 350
            });
            self.profileImg.addClass("profileImg");

            self.namebtn = new Button("namebutton");
            self.namebtn.addClass("profilebtn")
            var nameLabel = new Label("nameLabel", "Bharath Gowda");
            nameLabel.addClass("logpageLabel")
            self.namebtn.appendChildWidget(nameLabel);

            self.premiumbtn = new Button("premiumbutton");
            self.premiumbtn.addClass("profilebtn")
            var premiumLabel = new Label("premiumLabel", "premium subscription");
            premiumLabel.addClass("logpageLabel")
            self.premiumbtn.appendChildWidget(premiumLabel);

            self.infobtn = new Button("info_button");
            self.infobtn.addClass("infobtn")
            var infoLabel1 = new Label("infoLabel1", "To make changes, visit erosnow.com>sign in>my purchases");
            infoLabel1.addClass("infoLabel")
            self.infobtn.appendChildWidget(infoLabel1);

            // for Language
            self.Lang1 = new Label("lang1", "English Language")
            self.Lang1.addClass('langstyle')
            self.Lang2 = new Label("lang2", "Hindi Language")
            self.Lang2.addClass('langstyle')
            self.Lang3 = new Label("lang3", "Kannada Lanaguage")
            self.Lang3.addClass('langstyle')
            self.Lang4 = new Label("lang4", "Tamil Lanaguage")
            self.Lang4.addClass('langstyle')
            self.Lang5 = new Label("lang5", "Telugu Lanaguage")
            self.Lang5.addClass('langstyle')
            self.Lang6 = new Label("lang6", "Malayalam Lanaguage")
            self.Lang6.addClass('langstyle')

            self.togglebtn1 = new Button("tgbutton1")
            self.togglebtn1.addClass('tgbtn')
            var tgl1 = new Label('tgl1', 'ON')
            tgl1.addClass("tgl");
            self.togglebtn1.appendChildWidget(tgl1)

            self.togglebtn2 = new Button("tgbutton2")
            self.togglebtn2.addClass('tgbtn')
            var tgl2 = new Label('tgl2', 'OFF')
            tgl2.addClass("tgl");
            self.togglebtn2.appendChildWidget(tgl2)

            self.togglebtn3 = new Button("tgbutton3")
            self.togglebtn3.addClass('tgbtn')
            var tgl3 = new Label('tgl3', 'OFF')
            tgl3.addClass("tgl");
            self.togglebtn3.appendChildWidget(tgl3)

            self.togglebtn4 = new Button("tgbutton4")
            self.togglebtn4.addClass('tgbtn')
            var tgl4 = new Label('tgl4', 'OFF')
            tgl4.addClass("tgl");
            self.togglebtn4.appendChildWidget(tgl4)

            self.togglebtn5 = new Button("tgbutton5")
            self.togglebtn5.addClass('tgbtn')
            var tgl5 = new Label('tgl5', 'ON')
            tgl5.addClass("tgl");
            self.togglebtn5.appendChildWidget(tgl5)

            self.togglebtn6 = new Button("tgbutton6")
            self.togglebtn6.addClass('tgbtn')
            var tgl6 = new Label('tgl6', 'OFF')
            tgl6.addClass("tgl");
            self.togglebtn6.appendChildWidget(tgl6)

            // for genre
            self.Genre1 = new Label("Genre1", "Comedy Genre")
            self.Genre1.addClass('genrestyle')
            self.Genre2 = new Label("Genre2", "Action Genre")
            self.Genre2.addClass('genrestyle')
            self.Genre3 = new Label("Genre3", "Fanatasy Genre")
            self.Genre3.addClass('genrestyle')
            self.Genre4 = new Label("Genre4", "Horror Genre")
            self.Genre4.addClass('genrestyle')
            self.Genre5 = new Label("Genre5", "Drama Genre")
            self.Genre5.addClass('genrestyle')
            self.Genre6 = new Label("Genre6", "Science Fiction Genre")
            self.Genre6.addClass('genrestyle')

            self.genretgbtn1 = new Button("genre_1")
            self.genretgbtn1.addClass('gtgbtn')
            var gtgl1 = new Label('gtgl1', 'ON')
            gtgl1.addClass("gtgl");
            self.genretgbtn1.appendChildWidget(gtgl1)

            self.genretgbtn2 = new Button("genre_2")
            self.genretgbtn2.addClass('gtgbtn')
            var gtgl2 = new Label('gtgl2', 'OFF')
            gtgl2.addClass("gtgl");
            self.genretgbtn2.appendChildWidget(gtgl2)

            self.genretgbtn3 = new Button("genre_3")
            self.genretgbtn3.addClass('gtgbtn')
            var gtgl3 = new Label('gtgl3', 'OFF')
            gtgl3.addClass("gtgl");
            self.genretgbtn3.appendChildWidget(gtgl3)

            self.genretgbtn4 = new Button("genre_4")
            self.genretgbtn4.addClass('gtgbtn')
            var gtgl4 = new Label('gtgl4', 'OFF')
            gtgl4.addClass("gtgl");
            self.genretgbtn4.appendChildWidget(gtgl4)

            self.genretgbtn5 = new Button("genre_5")
            self.genretgbtn5.addClass('gtgbtn')
            var gtgl5 = new Label('gtgl5', 'ON')
            gtgl5.addClass("gtgl");
            self.genretgbtn5.appendChildWidget(gtgl5)

            self.genretgbtn6 = new Button("genre_6")
            self.genretgbtn6.addClass('gtgbtn')
            var gtgl6 = new Label('gtgl6', 'OFF')
            gtgl6.addClass("gtgl");
            self.genretgbtn6.appendChildWidget(gtgl6)

            // Device
            self.deviceLabelButton = new Button('device_lbtn')
            var dlabel = new Label('dlabel', 'De-register this device from your account')
            self.deviceLabelButton.appendChildWidget(dlabel)
            self.devicetgbtn = new Button('devicetgbtn');
            var dtglabel = new Label('dtglabel', "OFF");
            self.devicetgbtn.appendChildWidget(dtglabel);

            // Support
            self.support1Label = new Label('slabel1', "Visit: erosnow.com/getting_started");
            self.support1Label.addClass('slabel');
            self.support2Label = new Label('slabel2', "for F.A.Qs, Contact, Feedback, Privacy Policy, Terms & Conditions etc.");
            self.support2Label.addClass('slabel');
            // self.Genre1 = new Label("Genre1","Comedy Genre")
            // self.Genre1.addClass('genrestyle')
            // self.Genre2 = new Label("Genre2","Action Genre")
            // self.Genre2.addClass('genrestyle')


            self.loginpageList = new VerticalList("loginlist");
            self.loginpageList.appendChildWidget(self.loadlogin);
            self.loginpageList.appendChildWidget(self.Account);
            self.loginpageList.appendChildWidget(self.LangPref);
            self.loginpageList.appendChildWidget(self.GenrePref);
            self.loginpageList.appendChildWidget(self.Device);
            self.loginpageList.appendChildWidget(self.Support);
            self.loginpageList.appendChildWidget(self.SignOut);


            // self.loginpageList.appendChildWidget(self.profileImg);
            // self.loginpageList.appendChildWidget(self.namebtn);
            // self.loginpageList.appendChildWidget(self.premiumbtn);
            // self.loginpageList.appendChildWidget(self.infobtn)

            self.appendChildWidget(self.loginpageList)
        },
        attachLogininEvtListeners: function (evt) {

            self.Account.addEventListener("focus", function (evt) {
                if (! self.AccountContainer) {
                    self.AccountContainer = new VerticalList("account_container");
                    self.AccountContainer.addClass("accContainer")
                    self.AccountContainer.appendChildWidget(self.profileImg);
                    self.AccountContainer.appendChildWidget(self.namebtn);
                    self.AccountContainer.appendChildWidget(self.premiumbtn);
                    self.AccountContainer.appendChildWidget(self.infobtn);
                    self.appendChildWidget(self.AccountContainer)
                }


                if (document.getElementById('langpref_container')) {
                    document.getElementById('langpref_container').style.display = "none";
                }
                // document.getElementById('genrepref_container').style.display='none'
                // document.getElementById('support_container').style.display='none';
                // document.getElementById('device_container').style.display='none';
                document.getElementById('account_container').style.display = "block"
            });

            self.LangPref.addEventListener("focus", function (evt) {
                if (! self.LangPrefContainer) {
                    self.LangPrefContainer = new VerticalList("langpref_container")
                    self.LangPrefContainer.appendChildWidget(self.Lang1)
                    self.LangPrefContainer.appendChildWidget(self.Lang2)
                    self.LangPrefContainer.appendChildWidget(self.Lang3)
                    self.LangPrefContainer.appendChildWidget(self.Lang4)
                    self.LangPrefContainer.appendChildWidget(self.Lang5)
                    self.LangPrefContainer.appendChildWidget(self.Lang6)
                    self.LangPrefContainer.appendChildWidget(self.togglebtn1);
                    self.LangPrefContainer.appendChildWidget(self.togglebtn2);
                    self.LangPrefContainer.appendChildWidget(self.togglebtn3);
                    self.LangPrefContainer.appendChildWidget(self.togglebtn4);
                    self.LangPrefContainer.appendChildWidget(self.togglebtn5);
                    self.LangPrefContainer.appendChildWidget(self.togglebtn6);


                    self.appendChildWidget(self.LangPrefContainer)
                }

                if (document.getElementById('account_container')) {
                    document.getElementById('account_container').style.display = "none"
                }
                if (document.getElementById('genrepref_container')) {
                    document.getElementById('genrepref_container').style.display = 'none'
                }
                // document.getElementById('support_container').style.display='none';
                // document.getElementById('device_container').style.display='none';
                document.getElementById('langpref_container').style.display = "block";


            });
            self.GenrePref.addEventListener("focus", function (evt) {
                if (! self.GenrePrefContainer) {
                    self.GenrePrefContainer = new VerticalList("genrepref_container")
                    self.GenrePrefContainer.appendChildWidget(self.Genre1)
                    self.GenrePrefContainer.appendChildWidget(self.Genre2)
                    self.GenrePrefContainer.appendChildWidget(self.Genre3)
                    self.GenrePrefContainer.appendChildWidget(self.Genre4)
                    self.GenrePrefContainer.appendChildWidget(self.Genre5)
                    self.GenrePrefContainer.appendChildWidget(self.Genre6)
                    self.GenrePrefContainer.appendChildWidget(self.genretgbtn1);
                    self.GenrePrefContainer.appendChildWidget(self.genretgbtn2);
                    self.GenrePrefContainer.appendChildWidget(self.genretgbtn3);
                    self.GenrePrefContainer.appendChildWidget(self.genretgbtn4);
                    self.GenrePrefContainer.appendChildWidget(self.genretgbtn5);
                    self.GenrePrefContainer.appendChildWidget(self.genretgbtn6);
                    self.appendChildWidget(self.GenrePrefContainer);
                }

                //    document.getElementById('account_container').style.display='none';
                if (document.getElementById('langpref_container')) {
                    document.getElementById('langpref_container').style.display = "none";
                }
                if (document.getElementById('device_container')) {
                    document.getElementById('device_container').style.display = 'none';

                }
                //    document.getElementById('support_container').style.display='none';

                document.getElementById('genrepref_container').style.display = 'block'
            });
            self.Device.addEventListener("focus", function (evt) {
                if (! self.DeviceContainer) {
                    self.DeviceContainer = new VerticalList('device_container')
                    self.DeviceContainer.appendChildWidget(self.deviceLabelButton);
                    self.DeviceContainer.appendChildWidget(self.devicetgbtn);
                    self.appendChildWidget(self.DeviceContainer);
                }

                if (document.getElementById('genrepref_container')) {
                    document.getElementById('genrepref_container').style.display = 'none'
                }
                // document.getElementById('account_container').style.display='none';
                //    document.getElementById('langpref_container').style.display= "none";
                if (document.getElementById('support_container')) {
                    document.getElementById('support_container').style.display = 'none';
                }


                document.getElementById('device_container').style.display = 'block';

            });
            self.Support.addEventListener("focus", function (evt) {
                if (! self.SupportContainer) {
                    self.SupportContainer = new VerticalList('support_container')
                    self.SupportContainer.appendChildWidget(self.support1Label);
                    self.SupportContainer.appendChildWidget(self.support2Label);
                    self.appendChildWidget(self.SupportContainer);
                }

                // document.getElementById('genrepref_container').style.display='none'
                // document.getElementById('account_container').style.display='none';
                // document.getElementById('langpref_container').style.display= "none";
                if (document.getElementById('device_container')) {
                    document.getElementById('device_container').style.display = "none";
                }
                document.getElementById('support_container').style.display = 'block';
            });
            // self.SignOut.addEventListener("focus",function(evt){
            //     self.loadsiginCarousel();
            // })


            self.addEventListener("keydown", function (evt) {
                var ele1 = self.getActiveChildWidget().id
                var ele = self.getCurrentApplication()._focussedWidget.id

                if (evt.keyCode == KeyEvent.VK_RIGHT) {

                    if (ele == 'accountbutton') {
                        self.AccountContainer.focus();
                    }
                    if (ele == "langPref") {
                        self.LangPrefContainer.focus();
                    }
                    if (ele == "genrePref") {

                        self.GenrePrefContainer.focus();
                    }
                    if (ele == "devicebutton") {
                        self.devicetgbtn.focus();
                    }
                    if (ele == "supportbutton") {
                        self.SupportContainer.focus();
                    }


                    // if(ele == "AccountContainer")
                    // console.log("dhuhfuhfur")
                    // self.Account.focus();
                } else if (evt.keyCode == KeyEvent.VK_LEFT) {
                    if (ele1 == "loginlist") {
                        self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MENU_CONTAINER).focus();

                    }
                    if (ele1 == 'account_container') {
                        self.Account.focus();
                    }
                    if (ele1 == "langpref_container") {
                        self.LangPref.focus();

                    }
                    if (ele1 == "genrepref_container") {
                        self.GenrePref.focus();
                    }
                    if (ele1 == "device_container") {
                        self.Device.focus();
                    }
                    if (ele1 == "support_container") {
                        self.Support.focus();
                    }


                }


            });
            self.togglebtn1.addEventListener("select", function (evt) {
                if (document.getElementById('tgbutton1').innerHTML == "ON") {
                    document.getElementById('tgbutton1').innerHTML = "OFF"
                    document.getElementById('tgbutton1').style.backgroundColor = "gray"
                } else {
                    document.getElementById('tgbutton1').innerHTML = "ON"
                    document.getElementById('tgbutton1').style.backgroundColor = "green"
                }
            });
            self.togglebtn2.addEventListener("select", function (evt) {
                if (document.getElementById('tgbutton2').innerHTML == "ON") {
                    document.getElementById('tgbutton2').innerHTML = "OFF"
                    document.getElementById('tgbutton2').style.backgroundColor = "gray"
                } else {
                    document.getElementById('tgbutton2').innerHTML = "ON"
                    document.getElementById('tgbutton2').style.backgroundColor = "green"
                }
            });
            self.togglebtn3.addEventListener("select", function (evt) {
                if (document.getElementById('tgbutton3').innerHTML == "ON") {
                    document.getElementById('tgbutton3').innerHTML = "OFF"
                    document.getElementById('tgbutton3').style.backgroundColor = "gray"
                } else {
                    document.getElementById('tgbutton3').innerHTML = "ON"
                    document.getElementById('tgbutton3').style.backgroundColor = "green"
                }
            });
            self.togglebtn4.addEventListener("select", function (evt) {
                if (document.getElementById('tgbutton4').innerHTML == "ON") {
                    document.getElementById('tgbutton4').innerHTML = "OFF"
                    document.getElementById('tgbutton4').style.backgroundColor = "gray"
                } else {
                    document.getElementById('tgbutton4').innerHTML = "ON"
                    document.getElementById('tgbutton4').style.backgroundColor = "green"
                }
            });
            self.togglebtn5.addEventListener("select", function (evt) {
                if (document.getElementById('tgbutton5').innerHTML == "ON") {
                    document.getElementById('tgbutton5').innerHTML = "OFF"
                    document.getElementById('tgbutton5').style.backgroundColor = "gray"
                } else {
                    document.getElementById('tgbutton5').innerHTML = "ON"
                    document.getElementById('tgbutton5').style.backgroundColor = "green"
                }
            });
            self.togglebtn6.addEventListener("select", function (evt) {
                if (document.getElementById('tgbutton6').innerHTML == "ON") {
                    document.getElementById('tgbutton6').innerHTML = "OFF"
                    document.getElementById('tgbutton6').style.backgroundColor = "gray"
                } else {
                    document.getElementById('tgbutton6').innerHTML = "ON"
                    document.getElementById('tgbutton6').style.backgroundColor = "green"
                }
            });

            self.genretgbtn1.addEventListener("select", function (evt) {
                if (document.getElementById("genre_1").innerHTML == "ON") {
                    document.getElementById("genre_1").innerHTML = "OFF"
                    document.getElementById("genre_1").style.backgroundColor = "gray"
                } else {
                    document.getElementById("genre_1").innerHTML = "ON"
                    document.getElementById("genre_1").style.backgroundColor = "green"
                }
            });
            self.genretgbtn2.addEventListener("select", function (evt) {
                if (document.getElementById("genre_2").innerHTML == "ON") {
                    document.getElementById("genre_2").innerHTML = "OFF"
                    document.getElementById("genre_2").style.backgroundColor = "gray"
                } else {
                    document.getElementById("genre_2").innerHTML = "ON"
                    document.getElementById("genre_2").style.backgroundColor = "green"
                }
            });
            self.genretgbtn3.addEventListener("select", function (evt) {
                if (document.getElementById("genre_3").innerHTML == "ON") {
                    document.getElementById("genre_3").innerHTML = "OFF"
                    document.getElementById("genre_3").style.backgroundColor = "gray"
                } else {
                    document.getElementById("genre_3").innerHTML = "ON"
                    document.getElementById("genre_3").style.backgroundColor = "green"
                }
            });
            self.genretgbtn4.addEventListener("select", function (evt) {
                if (document.getElementById("genre_4").innerHTML == "ON") {
                    document.getElementById("genre_4").innerHTML = "OFF"
                    document.getElementById("genre_4").style.backgroundColor = "gray"
                } else {
                    document.getElementById("genre_4").innerHTML = "ON"
                    document.getElementById("genre_4").style.backgroundColor = "green"
                }
            });
            self.genretgbtn5.addEventListener("select", function (evt) {
                if (document.getElementById("genre_5").innerHTML == "ON") {
                    document.getElementById("genre_5").innerHTML = "OFF"
                    document.getElementById("genre_5").style.backgroundColor = "gray"
                } else {
                    document.getElementById("genre_5").innerHTML = "ON"
                    document.getElementById("genre_5").style.backgroundColor = "green"
                }
            });
            self.genretgbtn6.addEventListener("select", function (evt) {
                if (document.getElementById("genre_6").innerHTML == "ON") {
                    document.getElementById("genre_6").innerHTML = "OFF"
                    document.getElementById("genre_6").style.backgroundColor = "gray"
                } else {
                    document.getElementById("genre_6").innerHTML = "ON"
                    document.getElementById("genre_6").style.backgroundColor = "green"
                }
            });
            self.devicetgbtn.addEventListener("select", function (evt) {
                if (document.getElementById("devicetgbtn").innerHTML == "ON") {
                    document.getElementById("devicetgbtn").innerHTML = "OFF"
                    document.getElementById("devicetgbtn").style.backgroundColor = "gray"
                } else {
                    document.getElementById("devicetgbtn").innerHTML = "ON"
                    document.getElementById("devicetgbtn").style.backgroundColor = "green"
                }

            })


        },


        // loadsiginCarousel:function(){
        //    self.createWidgets();
        //     //for siginpage
        //     self.loadContainer();
        //     self.attachsigninEvtListeners();

        // }


    });
});


// var ele = self.getCurrentApplication()._focussedWidget.id


// try
// self.Account.addEventListener("keydown",function(evt){
//     console.log(evt);
//     var ele = self.getActiveChildWidget().id;

//     switch (evt.keyCode) {

//         case KeyEvent.VK_RIGHT:{
//             console.log("righttt")
//             console.log(ele)
//             console.log(self.AccountContainer)


//             self.AccountContainer.focus();
//             if(ele == "AccountContainer")
//             self.Account.focus();
//             break;
//         }
//         case KeyEvent.VK_LEFT:{
//             console.log(ele,"leftfffff")
//            if(ele == "loginlist")
//            self.getCurrentApplication().getRootWidget().getChildWidget(self.globals.MENU_CONTAINER).focus();


//             if (ele == "account_container")
//             self.Account.focus()
//         }
//     default: evt.stopPropagation();
//         }
// })
