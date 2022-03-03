/**
* This is the slformatter.js page for ErosNow application.
* It is the formatter of the spotlight component
*/
// Including the required widgets
define(
    'app/appui/formatters/slformatter',
    [
        'antie/formatter',
        'antie/widgets/label',
        'antie/widgets/image',
        'antie/widgets/container',
        'app/appui/globals',
        "logituit/libs/util",
    ],
    // Initiating the fuction with required parameters and global variable declaration
    function (Formatter, Label, Image, Container, Globals, Util) {
        var self;
        return Formatter.extend({
            init: function () {
                self = this;
                self.util = new Util();
                self.globals = new Globals();
            },

            format: function (iterator) {
                // var converter = new Util();
                var imgcontainer, item, dotContainer, imglabel, img, title, subcontainer, imgLogo, imgMain;
                item = iterator.next();
                // var image = item.images && item.images[8] ? item.images[8] : item.images && item.images[15] ? item.images[15] : item.images && item.images[16] ? item.images[16] : '';
                var image = item.images && item.images[0].cdn_url ? item.images[0].cdn_url : '';
                if(image){
                    img = image;
                    // imgLogo = image;
                    // imgMain = image;
                    title = item.title || '';
                }
                imgcontainer = new Container('imgcontainer' + item.banner_id + Math.random());
                imgcontainer.addClass('mySlides fade');
                imgcontainer.addClass('imgcontainer');
                subcontainer = new Container('subcontainer');
                subcontainer.addClass('subcontainer');
                // appending masthead-background,foreground and logo to the container
                if(img){
                    imgcontainer.appendChildWidget(new Image('img-item.id', this.util.getCloudinaryUrl(this.globals.API_CONSTANTS.CAROUSEL_LAYOUT.SPOTLIGHT_LAYOUT) +img));
                }
                if(imgLogo){
                    subcontainer.appendChildWidget(new Image('spotlightLogo', this.util.getCloudinaryUrl(this.globals.API_CONSTANTS.CAROUSEL_LAYOUT.SPOTLIGHT_LOGO) +imgLogo));
                }
                if(imgMain){
                    subcontainer.appendChildWidget(new Image('spotlightMain', this.util.getCloudinaryUrl(this.globals.API_CONSTANTS.CAROUSEL_LAYOUT.SPOTLIGHT_LAYOUT) +imgMain));
                }
                imgcontainer.appendChildWidget(new Label(title));
                imgcontainer.appendChildWidget(subcontainer);
                item['contentid']=item.asset_id;
                imgcontainer.setDataItem(this.util.createSpotlightDataFormatHomecmp(item));
                return imgcontainer;
            }
        });
    }
);
