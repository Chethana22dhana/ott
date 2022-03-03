require.def('app/appui/components/subscriptioncomponent', [
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
            init.base.call(this, self.globals.SUBSCRIPTION_CONTAINER);

            self.addEventListener("beforerender", function (ev) {
                self._onBeforeRender(ev);
            });

            self.addEventListener("beforehide", function (evt) {});

            self.addEventListener("select", function (evt) {
                
                // console.log("dhdhfh")
                // self.attachEventListener();
                
               
            });
            self.addEventListener("mouseover",function(evt){
                
            })
            self.addEventListener("keydown", function (evt) {
                
                // self.keyEventsHandler(evt);
               
            });
            self.addEventListener("aftershow", function (evt) {
                // self._onAfterShow(evt);
               self.planButton4.focus();

            });
        },
        _onBeforeRender:function(evt){
            if(self.parentWidget){
                self.parentWidget.removeChildWidgets();
            }
            self.removeChildWidgets();
            self.createwidget();
            self.loadCarousels();
           self.attachEventListener();
             
        },
        
        createwidget:function(){
            var subscriptionContainer = new Container('subscriptionContainer')
            subscriptionContainer.addClass('subscription')
            self.appendChildWidget(subscriptionContainer)
        },
        loadCarousels:function(){
            var subPlanContainer = new Container('subPlanContainer')
            let logoImg = new Image('sub_logo_img','static/img/signinpage/logo.svg');
            logoImg.addClass("sublogoImg");
            let Label1 = new Label("sub_label1","Go Premium Now");
            Label1.addClass('subLabel1');
            
            let Label2 = new Label("sub_label2","Watch on any device no extra payment")
            Label2.addClass('subLabel2');
            let Label3 = new Label("sub_label3","Lorem ipsum dolor sit amet, pri ferri torquatos constituam an, pro an perfecto assueverit. Id omnium vidisse.Facer tacimates voluptatibus qui te. Sint graece expetenda pri et ")
            Label3.addClass('subLabel3');
            let favPlanBtn = new Button('favPlanBtn');
            let favPlanLabel = new Label('favPlanLabel',"POPULAR") 
            favPlanBtn.appendChildWidget(favPlanLabel)
            //activation using web or mobile label
            let activationLabel = new Label('activation_label','Activate your device using mobile or ErosNow website')

            let subPlans = new VerticalList('sub_plans');
            self.planButton1 = new Button('plan_button1');
            self.planButton1.addClass('planButton1')
            let yearPlanLabel = new Label("year_plan","Pay yearly")
            yearPlanLabel.addClass('plansLabel')
            let yearPlanLabel2 = new Label("year_plan2","Get 2 months YouTube Music Premium Free")
            yearPlanLabel2.addClass('plansLabel2')
            let yearPlanPrice = new Label("year_planPrice","₹499")
            yearPlanPrice.addClass('planPrice')
            self.planButton2 = new Button('plan_button2');
            self.planButton2.addClass('planButton2');
            let quarterPlanLabel = new Label("quarter_plan","Pay Quaterly")
            quarterPlanLabel.addClass('plansLabel')
            let quarterPlanLabel2 = new Label("quarter_plan2","Get 2 months YouTube Music Premium Free")
            quarterPlanLabel2.addClass('plansLabel2')
            let quarterPlanPrice = new Label("quarter_planPrice","₹99")
            quarterPlanPrice.addClass('planPrice')
            self.planButton3 = new Button('plan_button3');
            self.planButton3.addClass('planButton3')
            let monthPlanLabel = new Label("month_plan","Pay monthly")
            monthPlanLabel.addClass('plansLabel')
            let monthPlanLabel2 = new Label("month_plan2","Get 2 months YouTube Music Premium Free")
            monthPlanLabel2.addClass('plansLabel2')
            let monthPlanPrice = new Label("month_planPrice","₹49")
            monthPlanPrice.addClass('planPrice')
            //for activation using mobile and website display
            self.planButton4 = new Button('plan_button4');
            self.planButton4.addClass('plansButton4');
            let activationDisplay = new Label('act_display',"BACK");
            activationDisplay.addClass('actDisplay');

            self.planButton1.appendChildWidget(yearPlanLabel)
            self.planButton1.appendChildWidget(yearPlanLabel2)
            self.planButton1.appendChildWidget(yearPlanPrice)
            self.planButton2.appendChildWidget(quarterPlanLabel)
            // self.planButton2.appendChildWidget(quarterPlanLabel2)
            self.planButton2.appendChildWidget(quarterPlanPrice)
            self.planButton3.appendChildWidget(monthPlanLabel)
            // self.planButton3.appendChildWidget(monthPlanLabel2)
            self.planButton3.appendChildWidget(monthPlanPrice)
            self.planButton4.appendChildWidget(activationDisplay);

           
            // subPlans.appendChildWidget(self.planButton1)
            // subPlans.appendChildWidget(self.planButton2)
            // subPlans.appendChildWidget(self.planButton3)
            subPlans.appendChildWidget(self.planButton4);
            self.appendChildWidget(subPlans)

            subPlanContainer.appendChildWidget(logoImg);
            subPlanContainer.appendChildWidget(Label1);
            subPlanContainer.appendChildWidget(Label2);
            subPlanContainer.appendChildWidget(Label3);
            // subPlanContainer.appendChildWidget(favPlanBtn)
            subPlanContainer.appendChildWidget(activationLabel)
            // subPlanContainer.appendChildWidget(subPlans)
            self.appendChildWidget(subPlanContainer)
        },
       attachEventListener:function(evt){
        var ele1 = self.getActiveChildWidget().id
        var ele = self.getCurrentApplication()._focussedWidget.id
        
           self.planButton1.addEventListener("select",function(evt){
                self.loadSubscribeTermsPage();
               if(ele1 =="sub_plans"){
                
               
                   if(document.getElementById('subTermContainer')){
                    document.getElementById('subTermContainer').style.display='block';
                    
                   }
                   self.TermButton1.focus();
                   document.getElementById('term_label2').innerHTML = "This is a yearly subscripton and will be auto renewed for ₹499"
                  
                  }
                  self.attachTermEventListener(evt);
           });

          

           self.planButton2.addEventListener("select",function(evt){
            self.loadSubscribeTermsPage();
            if(ele1 =="sub_plans"){
                document.getElementById('term_label2').innerHTML = "This is a quarterly subscripton and will be auto renewed for ₹99"

               }
               self.TermButton1.focus();
               self.attachTermEventListener(evt);
            
           });
            self.planButton3.addEventListener("select",function(evt){
                self.loadSubscribeTermsPage();
                
                if(ele1 =="sub_plans"){
                   
                    document.getElementById('term_label2').innerHTML = "This is a monthly subscripton and will be auto renewed for ₹49"
                    
                   }
                   self.TermButton1.focus();

                   self.attachTermEventListener(evt);
        });
        self.planButton4.addEventListener("select",function(evt){
            console.log("hereeee")
            self.util.application.hideComponent(self.globals.SUBSCRIPTION_CONTAINER,self.globals.COMPONENT_PATH.SUBSCRIPTION_COMPONENT)

            self.util.application.showComponent(self.globals.ASSET_DETAIL_CONTAINER,self.globals.COMPONENT_PATH.ASSET_DETAIL_COMPONENT)
        
        })
            
        self.addEventListener("keydown",function(evt){
            if(evt.keyCode == KeyEvent.VK_BACK_SPACE){
                self.util.application.hideComponent(self.globals.SUBSCRIPTION_CONTAINER,self.globals.COMPONENT_PATH.SUBSCRIPTION_COMPONENT)

                self.util.application.showComponent(self.globals.ASSET_DETAIL_CONTAINER,self.globals.COMPONENT_PATH.ASSET_DETAIL_COMPONENT)
            }
        })
      
    },
    loadSubscribeTermsPage:function(evt){
        if(document.getElementById('sub_plans')){
            document.getElementById('sub_plans').style.display = 'none';
        }
        if(document.getElementById('subPlanContainer')){
            document.getElementById('subPlanContainer').style.display='none';
        }
        if(!subTermContainer){
        var subTermContainer = new Container('subTermContainer')
            let logoImg = new Image('sub_logo_img','static/img/signinpage/logo.svg');
            logoImg.addClass("sublogoImg");
            let termLabel1 = new Label('term_label1',"Subscription Terms")
            let termLabel2 = new Label('term_label2',"This is a yearly subscription")
            self.subTerms = new VerticalList('sub_terms')
            self.TermButton1 = new Button('term_button1');
            self.TermButton1.addClass('termButton1')
            let termbtnl1 = new Label("termBtnl1","Continue");
            termbtnl1.addClass('termBtnl')
            self.TermButton1.appendChildWidget(termbtnl1);

            self.TermButton2 = new Button('term_button2');
            self.TermButton2.addClass('termButton2')
            let termbtnl2 = new Label("termBtnl2","Cancel");
                termbtnl2.addClass('termBtnl')
            self.TermButton2.appendChildWidget(termbtnl2);
            self.subTerms.appendChildWidget(self.TermButton1);
            self.subTerms.appendChildWidget(self.TermButton2);
            self.appendChildWidget(self.subTerms)
            subTermContainer.appendChildWidget(logoImg);
            subTermContainer.appendChildWidget(termLabel1);
            subTermContainer.appendChildWidget(termLabel2);
            
            subTermContainer.appendChildWidget(self.subTerms)
            self.appendChildWidget(subTermContainer);
        }

    },
    attachTermEventListener:function(evt){
        self.TermButton1.addEventListener("select",function(evt){
            self.loadsubConfirmationPage();
            self.ConfirmButton1.focus();
            self.attachConfirmEventListener();
      })
           self.TermButton2.addEventListener("select",function(evt){
            self.util.application.pushComponent(self.globals.SUBSCRIPTION_CONTAINER,self.globals.COMPONENT_PATH.SUBSCRIPTION_COMPONENT)
            self.attachConfirmEventListener();
        })
        
    },
   loadsubConfirmationPage:function(evt){
       if(document.getElementById('subTermContainer')){
           document.getElementById('subTermContainer').style.display = 'none'
       }
           var subConfirmContainer = new Container('subConfirmContainer')
           let logoImg = new Image('sub_logo_img','static/img/signinpage/logo.svg');
            logoImg.addClass("sublogoImg");
            let confirmLabel1 = new Label('confirm_label1',"Confirm Subscription")
            let confirmLabel2 = new Label('confirm_label2',"The subscription will continue unless cancelled in Settings at least one day before the subscription period ends")

            

            self.subConfirm = new VerticalList('sub_confirm')
            self.ConfirmButton1 = new Button('confirm_button1');
            self.ConfirmButton1.addClass('confirmButton1')
            let confirmbtnl1 = new Label("confirmBtnl1","OK");
            confirmbtnl1.addClass('confirmBtnl')
            self.ConfirmButton1.appendChildWidget(confirmbtnl1);

            self.ConfirmButton2 = new Button('confirm_button2');
            self.ConfirmButton2.addClass('confirmButton2')
            let confirmbtnl2 = new Label("confirmBtnl2","Cancel");
                confirmbtnl2.addClass('confirmBtnl')
            self.ConfirmButton2.appendChildWidget(confirmbtnl2);
            self.subConfirm.appendChildWidget(self.ConfirmButton1);
            self.subConfirm.appendChildWidget(self.ConfirmButton2);
            self.appendChildWidget(self.subConfirm)

            subConfirmContainer.appendChildWidget(logoImg);
            subConfirmContainer.appendChildWidget(confirmLabel1)
            subConfirmContainer.appendChildWidget(confirmLabel2)
            subConfirmContainer.appendChildWidget(self.subConfirm)
            self.appendChildWidget(subConfirmContainer)
    //    }
   },
   attachConfirmEventListener:function(){
       self.ConfirmButton1.addEventListener("select",function(evt){
           self.util.application.hideComponent(self.globals.SUBSCRIPTION_CONTAINER,self.globals.COMPONENT_PATH.SUBSCRIPTION_COMPONENT)
        self.util.application.pushComponent(self.globals.ASSET_DETAIL_CONTAINER, self.globals.COMPONENT_PATH.ASSET_DETAIL_COMPONENT);

       })
       self.ConfirmButton2.addEventListener("select",function(evt){
        self.util.application.showComponent(self.globals.SUBSCRIPTION_CONTAINER,self.globals.COMPONENT_PATH.SUBSCRIPTION_COMPONENT)
    //  self.util.application.pushComponent(self.globals.ASSET_DETAIL_CONTAINER, self.globals.COMPONENT_PATH.ASSET_DETAIL_COMPONENT,{from:"player"});

    })
   }

       

    });
});


 


