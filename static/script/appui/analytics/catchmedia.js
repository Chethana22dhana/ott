require.def('app/appui/analytics/catchmedia', [
    'antie/class', 'tata/libs/util', 'app/appui/globals'
], function (Class, Util, Globals) {
    var self;
    var Catchmedia = Class.extend({

        init: function () {
            self = this;
            this.globals = new Globals();
            this.utils = new Util();
        },


        /**
         * 
         * @param {Object} userInfo -  userInfo: {userName: 'userName', signupType: 'signupType' , extraData, mergeData, profile, isChildProfile}
         */
        setUserCall: function (userInfo) {
            cmsdk.register(true);
            cmsdk.setUser(userInfo.username, userInfo.signupType, userInfo.extra, true);

        },

        updateUserInfo: function (info) {
            cmsdk.updateUserExtraData(info);
        },

        setProfileCall: function (profile, isChildProfile) {
            try {
                cmsdk.setProfile(profile, isChildProfile)
            } catch (error) {
                console.log("CATCH MEDIA", error);
            }

        },

        unsetUserCall: function () {
            try {
                cmsdk.unsetUser();
            } catch (error) {
                console.log("CATCH MEDIA", error);
            }
        },

        mediaEventCall: function (mediaId, contentType, eventType, extraInfo) {
            try {
                cmsdk.reportMediaEvent(mediaId, contentType, eventType, extraInfo);
            } catch (error) {
                console.log("CATCH MEDIA EVENT REPORT ", error);
            }
        },

        appEventCall: function (evtInfo) {
            try {
                cmsdk.reportAppEvent(evtInfo.eventType, evtInfo.extra);

            } catch (error) {
                console.log("APP EVENT CALL ERROR", error);
            }
        },

        pageNavigationCall: function (info, extra) {
            //pageId, pageCategory, source
            self.globals.setCMTargetPage(info.pageId);
            self.globals.setCMPageLoadEndTime();

            let data = {
                target_page_id: self.globals.getCMTargetPage(),
                page_id: self.globals.getCMStartPage(),
                load_time: `${self.globals.getCMpageLoadTime()}`,
                source_element:'page_visit'
            }
            if (self.globals.getCMPageCategory()) {
                data.page_category = self.globals.getCMPageCategory()
            }

            if (self.globals.getCmSrcElem()) {
                data.source_element = self.globals.getCmSrcElem();
            }

            if (self.globals.getCmMenuTitle()) {
                data.menu_item_title = self.globals.getCmMenuTitle();
            }

            if (self.globals.getCmMenuPos()) {
                data.position_in_list = (self.globals.getCmMenuPos()).toString();
            }

            if(extra) {
                data = self.utils.mergeObjects(data, extra);
            }

            try {
                cmsdk.reportAppEvent(Globals.CATCHMEDIA.EVT_SUBTYPE.NAVIGATE, data);

            } catch (error) {
                console.log("APP EVENT CALL ERROR", error);
            }


            //For next CM event
            self.globals.setCMStartPage(info.pageId);

            if (info.pageCategory) {
                self.globals.setCMPageCategory(info.pageCategory);
            }


            self.globals.setCmSrcElem(null);
            self.globals.setCmMenuTitle(null);
            self.globals.setCmMenuPos(null);

        },

        cmSubscriptionBannerView: function (id, obj) {
            let cmEvt = {
                eventType: Globals.CATCHMEDIA.EVT_SUBTYPE.SUB_BANNER_VIEW,
                extra: {
                    content_id: id ? (id).toString() : '',
                    banner_id: obj.editorialMetadata.s_promotion_id || '',
                    banner_name: obj.editorialMetadata.button_title || '',
                    page_id: self.globals.getCMStartPage(),
                    page_category: self.globals.getCMPageCategory(),
                    
                }
            }
            this.appEventCall(cmEvt);
        },
        cmRailItemClickEvt: function (obj,info) {                  
                var extra = {
                    content_id: (obj.metadata && obj.metadata.contentId) ? (obj.metadata.contentId).toString() : '',
                    position_in_list: obj.content_position? (obj.content_position).toString(): '',
                    source_element: Globals.CATCHMEDIA.SOURCE_ELEM.THUMBNAIL_CLICK,
                    page_id: info.page_id,
                    page_category: info.page_category,
                    band_id: obj.metadata.rail_id,
                    band_title: obj.metadata.rail_label,
                    grid_name: obj.metadata.layout,
                    target_page_id:info.target_page_id
                }
                switch(extra.target_page_id){
                    case Globals.CATCHMEDIA.PAGE_CATEGORY.DETAILS:
                        this.mediaEventCall(obj.metadata.contentId, Globals.CATCHMEDIA.MEDIA_KIND.VIDEO, Globals.CATCHMEDIA.EVT_SUBTYPE.NAVIGATE_CONTENT, extra);
                    break;
                    case  Globals.CATCHMEDIA.PAGE_CATEGORY.LISTING:
                        var eventInfo = {
                            eventType: Globals.CATCHMEDIA.EVT_SUBTYPE.NAVIGATE
                        }
                        eventInfo["extra"] = extra;
                        this.appEventCall(eventInfo)
                    break;
                }  
        },
        clearMenuSavings:function(){
            self.globals.setCmSrcElem(null);
            self.globals.setCmMenuTitle(null);
            self.globals.setCmMenuPos(null);
        },
        mastheadImpression:function(data){
            data['isAutoplay'] = data.platformVariants[0].hasPromotion || data.platformVariants[0].hasTrailer || false;
            var cmEvt = {
                eventType: Globals.CATCHMEDIA.EVT_SUBTYPE.MASTHEAD_IMP,
                extra: {
                    content_id: (data && data.id) ? (data.id).toString() : '',
                    page_id:self.globals.getCMStartPage(),
                    page_category:self.globals.getCMPageCategory(),
                    spotlight_name:data.metadata.title,
                    spotlight_type:data.isAutoplay ? 'video' : 'image',
                    position_in_list:(data.position).toString(),
                    autoplayed:data.isAutoplay ? 'Yes': 'No',
                    autoplayed_duration:'',
                    swipe_mode:'manual'     
                }
            }
            this.appEventCall(cmEvt)
        },

        setPageId(navId){
            var pageId;
            // switch(navId){
                // case 'home':
                // pageId = 'home';
                // break; 
                // case 'home_show':
                //  pageId = 'tvshows';
                // break;
                // case 'nav_premium':
                // pageId = 'premium';
                // break;
                // case 'home_sports':
                // pageId = 'sports';
                // break;
                // case 'home_channels':
                // pageId = 'channels';
                // break;
                // case 'home_movies':
                // pageId = 'movies';
                // break;
            //     default:
            //     pageId = navId;
            //     break;
            // }
            pageId = navId;
            return pageId;
        }
    })

    return Catchmedia
})
