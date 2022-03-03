define(
  "app/appui/components/splashcomponent",
  [
    "antie/widgets/component",
    "antie/widgets/verticallist",
    "antie/datasource",
    "antie/widgets/carousel/binder",
    "app/appui/formatters/splashformatter",
    "app/appui/datasources/splashfeed",
    'app/appui/globals',
  ],
  function (Component, VerticalList,  DataSource, Binder,  SplashFormatter, SplashFeed, Globals) {

    // All components extend Component
    var self,  verticalListMenu;

    return Component.extend({
      init: function init () {

        self = this;
        self.globals = new Globals();

        // It is important to call the constructor of the superclass
        init.base.call(this, self.globals.SPLASH_CONTAINER);
        //===================================================================

       //create a new formatter and feed
        var Splashformatter=new SplashFormatter();
        var splashFeed= new SplashFeed();

      
        //create a DataSource
        self._splashDataSource=new DataSource(this, splashFeed , "loadSplash")
      
        this._verticalList = new VerticalList("verticalList", Splashformatter, self._splashDataSource)

        this._verticalList.setDataSource(this._splashDataSource)

        var binderSplash= new Binder(Splashformatter,this._splashDataSource)
        binderSplash.appendAllTo(this._verticalList)

        verticalListMenu=new VerticalList("mainmenuList")
        
        verticalListMenu.appendChildWidget(this._verticalList)
        this.appendChildWidget(verticalListMenu)

         

            // this.addEventListener("beforerender", function (ev){

            //   this._carousel.setDataSource(self._dataSource)
            // })
            
          },
         
        }
    )

  }
);