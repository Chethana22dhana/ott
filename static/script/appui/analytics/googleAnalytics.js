require.def('app/appui/analytics/googleAnalytics',
	[
		'antie/class', 'tata/libs/util', 'app/appui/globals'
	], function (Class, Util, Globals) {
		var self;
		var GoogleAnalytics = Class.extend({
			init: function () {
				self = this;
				this.globals = new Globals();
				this.utils = new Util();
			},

			triggerEvents: function (eventDetails) {
								
				if(!eventDetails.subscriptionStatus){
					eventDetails["subscriptionStatus"] = this.utils.getSubscriptionType();
				}
				if(!eventDetails.cpid){
					eventDetails["cpid"] = this.utils.getCPID();
				}
				
				var analyticsOptions = {};				
				this.createGAEventProperty(analyticsOptions , eventDetails, "event", "eventName");
				this.createGAEventProperty(analyticsOptions , eventDetails, "eventCategory", "eventCategory");
				this.createGAEventProperty(analyticsOptions , eventDetails, "eventAction", "eventAction");
				this.createGAEventProperty(analyticsOptions , eventDetails, "eventLabel", "eventLabel");
				this.createGAEventProperty(analyticsOptions , eventDetails, "ShowName", "showName");
				this.createGAEventProperty(analyticsOptions , eventDetails, "VideoGenre", "videoGenre");
				this.createGAEventProperty(analyticsOptions , eventDetails, "VideoLength", "videoLength");
				this.createGAEventProperty(analyticsOptions , eventDetails, "VideoTitle", "VideoTitle");
				this.createGAEventProperty(analyticsOptions , eventDetails, "VideoLanguage", "videoLanguage");
				this.createGAEventProperty(analyticsOptions , eventDetails, "VideoCategory", "videoCategory");
				this.createGAEventProperty(analyticsOptions , eventDetails, "VideoSubType", "videoSubType");
				this.createGAEventProperty(analyticsOptions , eventDetails, "VideoValue", "videoValue");
				this.createGAEventProperty(analyticsOptions , eventDetails, "ContentID", "contentID");
				this.createGAEventProperty(analyticsOptions , eventDetails, "screen_name", "screen_name");
				this.createGAEventProperty(analyticsOptions , eventDetails, "PageId", "pageId");
				this.createGAEventProperty(analyticsOptions , eventDetails, "page_name", "page_name");
				this.createGAEventProperty(analyticsOptions , eventDetails, "SubscriptionStatus", "subscriptionStatus");
				this.createGAEventProperty(analyticsOptions , eventDetails, "CPID", "cpid");
				this.createGAEventProperty(analyticsOptions , eventDetails, "BroadcastChannel", "broadcastChannel");
				this.createGAEventProperty(analyticsOptions , eventDetails, "ExternalID", "externalID");
				this.createGAEventProperty(analyticsOptions , eventDetails, "AdSupport", "adSupport");
				this.createGAEventProperty(analyticsOptions , eventDetails, "EpisodeNumber", "episodeNumber");
				this.createGAEventProperty(analyticsOptions , eventDetails, "SeasonNumber", "seasonNumber");
				this.createGAEventProperty(analyticsOptions , eventDetails, "LastBroadcastDate", "lastBroadcastDate");
				this.createGAEventProperty(analyticsOptions , eventDetails, "OriginalAirDate", "originalAirDate");
				this.createGAEventProperty(analyticsOptions , eventDetails, "AVSPlatform", "avsPlatform");
				this.createGAEventProperty(analyticsOptions , eventDetails, "AVSPlatformQuality", "avsPlatformQuality");
				this.createGAEventProperty(analyticsOptions , eventDetails, "RadioButtonClick", "radioButtonClick");
				this.createGAEventProperty(analyticsOptions , eventDetails, "SubscriptionDuration", "subscriptionDuration");
				this.createGAEventProperty(analyticsOptions , eventDetails, "CouponDetails", "couponDetails");
				this.createGAEventProperty(analyticsOptions , eventDetails, "PackName", "packName");
				this.createGAEventProperty(analyticsOptions , eventDetails, "PackPrice", "packPrice");
				this.createGAEventProperty(analyticsOptions , eventDetails, "PaymentMethod", "paymentMethod");
				this.createGAEventProperty(analyticsOptions , eventDetails, "CouponCodeName", "couponCodeName");
				this.createGAEventProperty(analyticsOptions , eventDetails, "NumberOfDevices", "numberOfDevices");
				this.createGAEventProperty(analyticsOptions , eventDetails, "error_text", "error_text");
				this.createGAEventProperty(analyticsOptions , eventDetails, "error_id", "error_id");
				this.createDefaultGAProperties(analyticsOptions);				
				this.sendAnalytics(analyticsOptions);					
			},

			createGAEventProperty: function( targetObject, sourceObject, targetProperty, sourceProperty){
				if(sourceObject[sourceProperty]){
					targetObject[targetProperty] = sourceObject[sourceProperty];
				}
			},

			createDefaultGAProperties: function(targetObject){
				const currentTime = new Date();
				const plateform = this.utils.getDeviceData().platform;
				targetObject["TimesStamp"] = currentTime;
				targetObject["ChromeCast"] = `${this.globals.GA_CHROME_CAST}`;
				targetObject["AppName"] = `${this.globals.GA_APP_NAME}`;
				targetObject["tvc_client_id"] = `${this.globals.GA_CLIENT_ID}`;
				targetObject["Platform"] = plateform || `${this.globals.GA_PLATFORM}`;
				targetObject["Version"] = `${this.globals.APP_VERSION}`;
				targetObject["UserType"] = this.utils.getUserType();
				targetObject["GTMContainerVersion"] = `${this.globals.GTMversion}`;
			},

			sendAnalytics: function (analyticsOptions) {
				dataLayer.push(analyticsOptions);
			}
		});

		return GoogleAnalytics;
	});