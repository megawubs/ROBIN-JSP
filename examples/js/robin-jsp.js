if(typeof(sessionStorage) == 'undefined')
{
	sessionStorage = {
		getItem: function(){},
		setItem: function(){}
    };
}

robin_JSP = {
	init: function() {
		//create reference to this
		self = this;
		self.settings = {
			apikey		: false,
			hideMobile  : true,  // Hide the ROBIN tab on mobile devices
			hideOffline : false, // Show the ROBIN tab even when you're offline
			logging     : false, //enable or disable logging
			theme       : false, //the theme of the tab
			customTop   : false, //The top offset of the widget
			popup		: false, //use a popup instead of the robin tab
			apiurl		: '//selfservice.robinhq.com', //the api url,
		};
		self.popup = {
				position:'right', //the position of the tab on your site (right or left)
				textOnline:'Live Chat', //text that will appear when you are online
				textOffline:'Contact Us', //text that will appear when you are offline,
				buttonWidth: 200,
				openWidth: 325,
				bubbleText:'need some help?'
		};

		$.extend(self.settings, robin_JSP_settings);
		if(typeof self.settings.popup === 'object'){
			$.extend(self.settings.popup, self.popup);
			self.popup = {};
			self.settings.popup.buttonMinWidth = 220;
			self.settings.popup.openMinWidth = 330;

			if(self.settings.popup.buttonWidth < self.settings.popup.buttonMinWidth){
				self.log('Your button width is to small, setting it to the minimum of ' + self.settings.popup.buttonMinWidth);
				self.settings.popup.buttonWidth = self.settings.popup.buttonMinWidth;
			}

			if(self.settings.popup.openWidth < self.settings.popup.openMinWidth){
				self.log('Your open width is to small, setting it to the minimum of ' + self.settings.popup.openMinWidth);
				self.settings.popup.openWidth = self.settings.popup.openMinWidth;
			}

			

		}
		//clear settings variable
		robin_JSP_settings = {};
		// Make sure settings are defined
		if(typeof self.settings.apikey === 'undefined' || self.settings.apikey === '' || self.settings.apikey === false) {
			self.log('API key is required but missing');
			return false; //stop initialization
		}
		self.buttons = {
			chat : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAA7CAYAAADLjIzcAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAm5JREFUeNrsmtFxgkAQhhcm79JBSAViBZIKYgfRCmIqCHagHWAHdhDoADvADqACcpcshjCHgAgut/lndiZjzE32u9u9vb0zsiyDDrKFLYS5+PMU+lcqLEILhB26DGZcAcAStkQbwuEmQCQEH4G0kwTQwjxhSUZXgTC3jU9NV4CLhB9hHNoJ84QldV80GwwmB/ockfNSbxgOTpccIGN9K+wVxqsUc9WhLQALCU5BD60whBsD8Ec+8yrNcOuszQGehs4Drmi7bgW4mPB0VYg+KleAVRUnGmkubF0FYD2yre5aeTjZfwBYZTIaa1L0NQewxF9wkRIAJ03wFPsNYKhjLDWdASyAp84AXKYAZBg4pqo6YiTbZBr/uRwTmIs7AJs7AIs7gOg/Bwg7MfY/lgBi7gACxgACCeDA1PkwzwER0zxwKBZCHFeBXwSwZeb8HvDeMAcQ44dc5KnOAvLDlIHzu+LWXwQQF8loqlPZR9XdoKwL5poCeC7XPaqzgOyVHTV0/l1V9FXdDjv4ZV3uCmSCX1YdhpTHRPhplqY6O38JQA7BHnk4rKDm0qeuH5BgOGxGmO1n0OC2u2lDxMMBQ+KOpzhZNiheg6h0zUNJmRvk5eILsRn3saRP2vyh0eGprA2/z2TdO+wYR9ypgi6HOaPjW+EyEGkW5o2PBufxoMX4SWFZB7f6p28JoKy6gZ+AQDvuXl3hDRDpRfa5ApKKvJBiqCQUAPS5AqILWyoJ5+8RAicg1n0aGgC5l2hDAgiBYPPV5Dz7QwLYN63NdQSQAuFeY58A8kJnC4QvYPsGQG7bGzoESBU9Kj30XAmSv3P8EmAAdvt+hzaO0tAAAAAASUVORK5CYII=',
			down: 'data:image/png;base64,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',
			plus: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAIAAACQKrqGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODQyMjU2OTNDMTBFMTFFMjk4NUNENjE0NzA0NUQwQkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODQyMjU2OTRDMTBFMTFFMjk4NUNENjE0NzA0NUQwQkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NDIyNTY5MUMxMEUxMUUyOTg1Q0Q2MTQ3MDQ1RDBCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4NDIyNTY5MkMxMEUxMUUyOTg1Q0Q2MTQ3MDQ1RDBCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpoxXMkAAABLSURBVHjaYmbAAL39k6ytbQ7s38dAEPz////w0eOY4kwMRIMBV8rS2NTKw8uLJiojLQUMB2SRmzeuMwA9+58IgKZzGAUWCUoBAgwA3/A9XWNZyOEAAAAASUVORK5CYII=',
			up: 'data:image/png;base64,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'
		};
		// Variables not to be defined by user
		self.settings.minWith = 325;
		self.settings.tabClosedBottom = 480;
		self.settings.animationDuration = 600;
		self.settings.tabOpened = false;
		// Variables to manage loading
		self.holdLoading = 0;
		self.abortLoading = false;
		
		//variable to manage elements
		self.elementsList = {};
		self.querys = {};
		self.settings.frameUrl = function(){
			var url = self.settings.apiurl + '/apikey/' + self.settings.apikey;
			if(self.hasRobinConversationID()){
				url += '/' + self.querys.rbn_cnv;
			}
			url += "?href=" + window.location.href;
			self.log(url);
			return url;
		};

		if(self.settings.hideMobile === true) {
			self.log('Setting "hideMobile : '+self.settings.hideMobile+'" detected');
			// Wait for callback before loading ROBIN
			self.holdLoading++;
			
			self.isMobile(function(response) {
				
				// Callback received
				self.holdLoading--;

				if(response !== true) {
					// Mobile false, continue loading
					
					// Logging
					self.log('Callback mobile is false, continue loading');
				} else {
					// Mobile true, cancel loading
					self.abortLoading = true;
					
					// Logging
					self.log('Callback mobile is true, abort loading');
				}
			});
		}
		if(self.settings.hideOffline === true) {
			//logging
			self.log('Setting "hideOffline : '+self.settings.hideOffline+'" detected');
			// Wait for callback before loading ROBIN
			self.holdLoading++;

			self.isOnline(function(response) {
			
				// Callback received
				self.holdLoading--;
			
				if(response === true) {
					// Online true, continue loading
					
					// Logging
					self.log('Callback online is true, continue loading');
					
				} else {
					// Online false, cancel loading
					self.abortLoading = true;
					
					// Logging
					self.log('Callback online is false, abort loading');
				}
			});
		}
		
		// Hide when online/offline
		if(self.settings.customTop !== false) {
			
			// Logging
			self.log('Setting "customTop : '+self.settings.customTop+'" detected');

			// Wait for callback before loading ROBIN
			self.holdLoading++;

			var css = 'a#robin_tab { top: '+self.settings.customTop+' !important; }';
			self.appendCSS(css,function(response) {
				// Callback received
				self.holdLoading--;
			});
		}
		if(typeof self.settings.popup === "object"){
			self.log('Setting "popup: ' + JSON.stringify(self.settings.popup) +'" detected');
			self.loadPopup().done(function(){
				if(self.urlHasRobinConversationID()){
					self.openTab();
				}
			});
		}
		else{
			self.load(function(response) {
				if(response === true) {
					self.log('Loading completed');
					if(self.settings.theme !== false){
						self.log('Setting "theme: ' + self.settings.theme + '" detected');
						//apply the theme
						self.applyTheme(self.settings.theme);
					}
				}
				else {
					self.log('Loading aborted');
				}
			});
		}
	},
	//Button themes
	themes: {
		'landscape':{
			left:{
				a:'right: auto !important; left: 35px !important; top: auto !important; bottom: 0px; height: 24px !important; transform: rotate(0deg) !important; -webkit-transform: rotate(0deg) !important; -moz-transform: rotate(0deg) !important; -o-transform: rotate(0deg) !important; -ms-transform: rotate(0deg) !important; border-bottom-left-radius: 0px !important; border-bottom-right-radius: 0px !important; border-top-right-radius: 10px; border-top-left-radius: 10px;',
				div:''
			},
			right:{
				a:'right: 35px !important; left: auto !important; top: auto !important; bottom: 0px; height: 24px !important; transform: rotate(0deg) !important; -webkit-transform: rotate(0deg) !important; -moz-transform: rotate(0deg) !important; -o-transform: rotate(0deg) !important; -ms-transform: rotate(0deg) !important; border-bottom-left-radius: 0px !important; border-bottom-right-radius: 0px !important; border-top-right-radius: 10px; border-top-left-radius: 10px;',
				div:''
			}
		},
	 	'ribbon':{
	 		left:{
	 			a:'top: auto !important; right: auto !important; bottom: 102px; left: -40px !important; transform: rotate(40deg) !important; -webkit-transform: rotate(40deg) !important; -moz-transform: rotate(40deg) !important; -o-transform: rotate(40deg) !important; -ms-transform: rotate(40deg) !important; border-bottom-left-radius: 0px !important; border-bottom-right-radius: 0px !important; border-top-right-radius: 0px !important; border-top-left-radius: 0px !important; width: 221px !important;',
	 			div:'background-position: 24%, 0% !important;'
	 		},
	 		right:{
	 			a:'top: auto !important; right: -4px !important; bottom: 94px; left: auto !important; transform: rotate(-40deg) !important; -webkit-transform: rotate(-40deg) !important; -moz-transform: rotate(-40deg) !important; -o-transform: rotate(-40deg) !important; -ms-transform: rotate(-40deg) !important; border-bottom-left-radius: 0px !important; border-bottom-right-radius: 0px !important; border-top-right-radius: 0px; border-top-left-radius: 0px; width: 221px !important;',
	 			div:'background-position: 24%, 0% !important;',
	 		}
	 		
	 	},
	 	'big-button':{
	 		left:{
	 			a:'top: auto !important; bottom: 30px; height: 30px; right:auto; left:35px !important; transform: rotate(0deg) !important; -webkit-transform: rotate(0deg) !important; -moz-transform: rotate(0deg) !important; -o-transform: rotate(0deg) !important; -ms-transform: rotate(0deg) !important; border-top-right-radius: 10px; border-top-left-radius: 10px; border-bottom-left-radius: 10px !important; border-bottom-right-radius: 10px !important;',
	 			div:''
	 		},
	 		right:{
	 			a:'top: auto !important; bottom: 30px; height: 30px; transform: rotate(0deg) !important; -webkit-transform: rotate(0deg) !important; -moz-transform: rotate(0deg) !important; -o-transform: rotate(0deg) !important; -ms-transform: rotate(0deg) !important; border-top-right-radius: 10px; border-top-left-radius: 10px; right: 35px !important;',
	 			div:''
	 		}
	 	}
	},
	log:function(string){
		if(self.settings.logging){
			console.log('ROBIN: ' + string);
		}
	},
	load: function(callback) {
		if(self.holdLoading === 0) {
			if(self.abortLoading !== true) {
				// Load ROBIN
				var script = document.createElement('script'),loaded;
				script.setAttribute('src', self.settings.apiurl+'/external/robin/'+self.settings.apikey+'.js');
				script.setAttribute('async', 'async');
				script.onreadystatechange = script.onload = function() { if (!loaded) { callback(true); } loaded = true; };
				document.getElementsByTagName('body')[0].appendChild(script);
			} else {
				// Loading aborted
				callback(false);
			}				
		} else {
			setTimeout(function(){
				self.Load(function(response)
				{
					callback(response);
				}
			);}, 500);
		}
	},
	API: function(service,callback) {
		var url = self.settings.apiurl +'/' + service;
		self.log('API: Requesting: ' + url);
		return $.get(url).done(callback);
	},
	isMobile: function(callback) {
		var check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		callback(check);		
	},
	isOnline: function(callback) {
		var check = false;
		return self.API('presence/'+self.settings.apikey+'/getstatus')
			.done(function(response) {
				if(response.Data.Status === 'online') {
					check = true;
				}
				self.onlineStatus = check;
				callback(check);
			}).fail(function(response){
				self.onlineStatus = false;
				callback(false);
			});
	},
	onlineStatus:false,

	appendCSS: function(css,callback) {
		var head = document.getElementsByTagName('head')[0];
		var s = document.createElement('style');
		s.setAttribute('type', 'text/css');
		if(s.styleSheet) {
		    s.styleSheet.cssText = css;
		} else {
		    s.appendChild(document.createTextNode(css));
		}
		head.appendChild(s);
		callback();	
	},
	getTheme: function(themeName){
		for(var theme in self.themes){
			if(theme === themeName){
				return self.themes[theme];
			}
		}
		return false;
	},
	applyTheme: function(themeName, callback){
		var theme, position, cssString;
		//check if the requested template exists
		theme = self.getTheme(themeName);
		position = robin_settings.tab_position;
		if(theme){
			cssString = 'a#robin_tab {' + theme[position].a + '} #robin_tab_div{ '+ theme[position].div + '}'; 
			self.appendCSS(cssString, function(){
				self.log('Theme "' + themeName + '" applied');
			});
		}
		else{
			self.log('The theme "' + themeName + '" does not exists');
		}
	},
	loadPopup:function(){
		self.log('Loading popup');
		var dfd = new $.Deferred();

		self.elementsList.robinTab = self.createRobinTab()
		.appendTo('body');

		self.elementsList.bubble = self.createBubble()
		.appendTo('body');

		self.elementsList.header = self.createHeader()
		.appendTo(self.elementsList.robinTab);

		self.elementsList.headerTitle = self.createHeaderTitle()
		.appendTo(self.elementsList.header);

		self.elementsList.buttonPlus = self.createButtonPlus()
		.appendTo(self.elementsList.headerTitle);

		self.elementsList.buttonChat = self.createButtonChat()
		.appendTo(self.elementsList.headerTitle);

		self.elementsList.buttonUp = self.createButtonUp()
		.appendTo(self.elementsList.header);

		self.elementsList.robinWrapper = self.createRobinWrapper()
		.appendTo(self.elementsList.robinTab);
		
		self.elementsList.robinFrame = self.createRobinFrame();

		self.startLoop(function(){
			var previousStatus = self.onlineStatus;
			self.log("Checking if you are online...");
			self.isOnline(function(isOnline){
				if(isOnline){
					self.log("You are online!");
					self.setOnline(previousStatus);
				}
				else{
					self.log("You are offline!");
					self.setOffline(previousStatus);
				}
			});
		});
		dfd.resolve();
		return dfd.promise();
	},

	robinTabClick: function(event){
		event.preventDefault();
		if($(this).css('bottom') === '0px'){
			self.openTab();
		}
		else{
			self.closeTab();
		}
	},

	createRobinTab:function(){
		
		return $('<section id="robinTab"/>').css({
			position: 'fixed',
			bottom: '0px',
			right: '15px',
			width:  self.settings.popup.buttonWidth + 'px',
			visibility: 'visible',
			zIndex: '2147483639',
			border: '0px',
			opacity: 1,
			background: 'transparent',
			height: '24px',
			padding: '10px 0 7px 0',
			mozBoxSizing: 'content-box',
			msBoxSizing: 'content-box',
			boxSizing: 'content-box',
			borderImage: 'none',
			borderStyle: 'solid solid none',
			borderWidth: '0px 0px 0px 1px',
			cursor: 'pointer',
			display: 'block',
			textDecoration: 'none',
			
			zIndex: 100000,
			top: 'auto',
			bottom: 0,
			// left: '20px', //to make it go left!
			backgroundColor:'#000000',
		}).click(self.robinTabClick);
	},
	createHeader:function(){
		return $('<header/>').css({
					fontFamily: "Helvetica, arial,sans-serif",
					fontSize: "14px",
					fontWeight: "bold",
					lineHeight: 1.6,
					paddingLeft: "25px",
					marginRight: "25px",
					textAlign: "left",
					textTransform: "uppercase",
					textDecoration: "none",
					top: 0,
					verticalAlign: "middle",
					width: "auto",
					mozBoxSizing:"content-box",
					msBoxSizing:"content-box",
					boxSizing: "content-box",
					webkitTouchCallout: "none",
					webkitUserSelect: "none",
					khtmlUserSelect: "none",
					mozUserSelect: "none",
					msUserSelect: "none",
					userSelect: "none",
					color: "#E8E8E8",
					textShadow: "1px 1px 1px #404040",
				});
	},

	createHeaderTitle: function(){
		title = (self.onlineStatus === false) ? self.settings.popup.textOffline : elf.settings.popup.textOnline;
		return $('<div/>').html(title).css({
			left:'2%',
			position:'relative',
			width:149
		});
	},

	createButtonPlus: function(){
		return $('<img/>')
			.attr('src', self.buttons.plus)
			.css({
				cssFloat:'left',
				paddingRight: 10,
				position:'relative',
				top:3
			});
	},

	createButtonChat:function(){
		return $('<img/>')
			.attr('src', self.buttons.chat)
			.css({
				paddingLeft:10,
				width:25
			});
	},

	createButtonUp: function(){
		return $('<img/>')
			.attr('src', self.buttons.up)
			.css({
				position:'relative',
				top:-18,
				cssFloat:'right',
				width:15
			});
	},

	createRobinWrapper:function(){
		return $('<div/>').css({
					width:  self.settings.popup.openWidth + 'px',
					height:479,
					top:0,
					borderImage: "none",
					borderStyle: "solid solid none",
					borderWidth: "0px .07em 0px .07em",
					borderColor: "#e8e8e8",
					background:"#FFFFFF url(https://robincontentdesktop.blob.core.windows.net/robinimages/loading.gif) no-repeat 50% 50%",
				});
	},

	createRobinFrame:function(){
		url = self.settings.frameUrl();
		self.log('building the robi frame with src:' + url);
		return $("<iframe>")
		.attr('src', url).css({
			width:"100%",
			height:"100%"
		}).attr('frameborder', 'no')
		.attr('allowtransparency', 'true');
	},

	createBubble: function(){
		var bubble = $('<div/>').css({
				fontFamily: "Helvetica, arial,sans-serif",
				fontWeight: "bold",
			 	fontSize: "41pt",
				color:"#FFFFFF",
				textTransform:'uppercase',
				position: 'fixed',
				bottom: '109px',
				right: '5px',
				borderColor: "rgb(127, 127, 127)",
			 	borderTopLeftRadius: "0px",
			 	borderTopRightRadius: "0px",
			 	borderBottomRightRadius: "0px",
			 	borderBottomLeftRadius: "0px",
			 	padding: "4px",
			 	width: "198",
			 	height: "222px",
			 	borderWidth: "0px",
			 	backgroundColor: "rgb(0, 0, 0)",
			 	cursor:"pointer"
			}),
		closer = $('<div />').css({
				fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
				color:"#ffffff",
				fontSize: "20px",
				fontWeight: "bold",
				lineHeight: "18px",
				opacity: "0.2",
				filter: "alpha(opacity=20)",
				textDecoration: "none",
				cssFloat: "right",
				paddingRight: "5px",
		}).attr('id','bubbleClose').html('x').appendTo(bubble).click(self.closeBubble),
		pointer = $('<div/>')
			.css({
				content: "",
				position: "absolute",
				borderStyle: "solid",
				borderWidth: "64px 99px 0px",
				borderColor: "rgb(0, 0, 0) transparent",
				display: "block",
				width: "0px",
				zIndex: "1",
				bottom: "-64px",
				left: "0px",
			}).appendTo(bubble);

	return bubble.append(self.settings.popup.bubbleText).click(self.openTab);
	},


	closeBubble:function(event){
		event.stopPropagation();
		self.log('closing bubble...');
		self.elementsList.bubble.remove();
	},

	openTab:function(event){
		if(event !== undefined){
			event.stopPropagation();
			if($(event.target).attr('id') === 'bubbleClose'){
				self.closeBubble()
				return;
			}
		}
		var bodyClick = function(event){
			event.stopPropagation();
			var $target = $(event.target);
			if ($target.parents('#robinTab').length === 0) {
				self.closeTab();
			}
		};

		if(!self.settings.tabOpened){
			self.elementsList.robinFrame.appendTo(self.elementsList.robinWrapper)
		}

		width = (self.settings.popup.openWidth < self.settings.popup.openMinWidth) ? self.settings.popup.openMinWith : self.settings.popup.openMinWidth;
		console.log(self.settings.popup.openMinWidth)
		
		self.elementsList.robinTab.css({bottom:self.settings.tabClosedBottom, width:width});
		$('body').one('click', bodyClick);
		self.elementsList.robinFrame.css({width:width}, self.settings.animationDuration);
		self.elementsList.buttonUp.attr('src', self.buttons.down)
		self.elementsList.bubble.hide();
		self.settings.tabOpened = true;
	},

	closeTab:function(){
		console.log(self.settings.popup.buttonWidth);
		self.elementsList.robinTab.css({bottom:0, width:self.settings.popup.buttonWidth}, self.settings.animationDuration)
		.promise().done(function(){
			self.elementsList.bubble.fadeIn(self.settings.animationDuration);
		});
		self.elementsList.buttonUp.attr('src', self.buttons.up)
	},

	setOnline:function(previousStatus){
		if(previousStatus === false && self.onlineStatus === true){
			self.log("Setting widget to online state");
			//update styling
			self.elementsList.headerTitle.html(self.settings.popup.textOnline);
			self.elementsList.buttonPlus.appendTo(self.elementsList.headerTitle)
			self.elementsList.buttonChat.appendTo(self.elementsList.headerTitle)
			//reload the iframe
			self.elementsList.robinFrame.attr('src', function(i, val){return val;});
		}
		
	},
	setOffline:function(previousStatus){
		if(previousStatus === true && self.onlineStatus === false){
			self.log("Setting widget to offline state");
			//update styling
			self.elementsList.headerTitle.html(self.settings.popup.textOffline);
			self.elementsList.buttonPlus.appendTo(self.elementsList.headerTitle)
			self.elementsList.buttonChat.appendTo(self.elementsList.headerTitle)
			self.elementsList.robinFrame.attr('src', function(i, val){return val;});
		}
	},

	getQueryStrings: function () {
		var queryStrings = {},
			query = window.location.search.substring(1),
			vars = query.split("&");

		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
			if (typeof queryStrings[pair[0]] === "undefined") {
				queryStrings[pair[0]] = pair[1];
			}
			else if (typeof queryStrings[pair[0]] === "string") {
				var arr = [ queryStrings[pair[0]], pair[1] ];
				queryStrings[pair[0]] = arr;
			}
			else {
				queryStrings[pair[0]].push(pair[1]);
			}
		}
		return queryStrings;
	},

	hasRobinConversationID:function(){
		var value = sessionStorage.getItem('rbn_cnv');
		if(typeof value === 'string'){
			self.querys.rbn_cnv = value;
			return true;
		}
		return self.urlHasRobinConversationID();
	},

	urlHasRobinConversationID:function(){
		var querys = self.getQueryStrings();
		if(typeof querys.rbn_cnv !== 'undefined'){
			self.log('Found Robin query string');
			self.querys = querys;
		}
		else{
			self.log('No robin query string found.');
			return false;
		}
		return true;
	},

	startLoop:function(loop){
		var repeat = function(){
			loop();
			setTimeout(repeat, 18000);
		};
		repeat();
	}
};

robin_JSP.init();