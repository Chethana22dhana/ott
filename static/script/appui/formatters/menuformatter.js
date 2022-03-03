define(
    "app/appui/formatters/menuformatter",
    [
      "antie/formatter",
      "antie/widgets/label",
      "antie/widgets/button",
      "antie/widgets/image"
    ],
    function(Formatter, Label, Button, Image) {
      return Formatter.extend({
        format : function (iterator) {
          var button, item, image, title, button;
          item = iterator.next();
          let pageid;
          if(item.page_id == null ){
            pageid = 8;
          }
          else{
            pageid = item.page_id;
          }
          button = new Button("menu" + item.title.toLowerCase());

          let imageurl = item.title.toLowerCase() == 'search' ? 'static/img/menu/icon_search.svg' : item.title.toLowerCase() == 'home' ? 'static/img/menu/icon_home.svg' : item.title.toLowerCase() == 'movie' ? 'static/img/menu/icon_movies.svg':
          item.title.toLowerCase() == 'shows' ? 'static/img/menu/icon_shows.svg' : item.title.toLowerCase() == 'music' ? 'static/img/menu/icon_music.svg' : item.title.toLowerCase() == 'tv' ? 'static/img/menu/icon_tv.svg' : item.title.toLowerCase() == 'prime' ? 'static/img/menu/icon_prime.svg' : 'static/img/menu/icon_user.svg'
          button.addClass("iconButton")
          image=new Image("img-item.id", imageurl)

          image.addClass("iconImg")
          button.appendChildWidget(image);

          title=new Label(item.title)
          title.addClass("iconLabel")
          button.appendChildWidget(title);
          button.setDataItem(item);
          
          return button;
          
        }
      });
    }
  );