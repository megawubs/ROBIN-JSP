robin_JSP = {
	init: function() {
		//create reverence to this
		self = this;
		self.settings = {
			apikey:'',
			hideMobile  : true,  // Hide the ROBIN tab on mobile devices
			hideOffline : false, // Show the ROBIN tab even when you're offline
			logging     : false, //enable or disable logging
			theme       : '', //the theme of the tab
			customTop   : false,
			popup		: false //use a popup instead of the robin tab
		}
		$.extend(self.settings, robin_JSP_settings);
		//clear settings variable
		robin_JSP_settings = {};
		// Make sure settings are defined
		if(typeof self.settings.apikey === 'undefined' || self.settings.apikey === '') {
			self.log('Settings are required and missing')
			return false;
		}
		// Variables not to be defined by user
		self.settings.apiurl = '//selfservice.robinhq.com';

		// Variables to manage loading
		self.holdLoading = 0;
		self.abortLoading = false;
		

		if(self.settings.hideMobile === true) {
			self.log('Setting "hideMobile : '+self.settings.hideMobile+'" detected');
			// Wait for callback before loading ROBIN
			self.holdLoading++;
			
			self.isMobile(function(response) {
				
				// Callback received
				self.holdLoading--;

				if(response != true) {
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
		if(self.settings.popup){
			self.log('Setting "popup: ' + self.settings.popup +'" detected');
			self.loadPopup();
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
			)},500);
		}
	},
	API: function(service,callback) {
		self.log('requesting: ' + service);
		var request;
		if(window.XMLHttpRequest){
			request=new XMLHttpRequest;
		}
		else{
			request=new ActiveXObject('Microsoft.XMLHTTP');
		}
		request.onreadystatechange=function(){
			if(request.readyState === 4 && request.status === 200){
				var response = JSON.parse(request.responseText);
				callback(response);
			}
		}
		request.open('GET',self.settings.apiurl+'/'+service,true);
		request.send();	
	},
	isMobile: function(callback) {
		var check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		callback(check);		
	},
	isOnline: function(callback) {
		var check = false;
		self.API('presence/'+self.settings.apikey+'/getstatus',function(response) {
			if(response.Data.Status === 'online') {
				check = true;
			}
			callback(check);
		});
	},
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
		var theme = self.getTheme(themeName),
			position = robin_settings.tab_position;
		if(theme){
			var cssString = 'a#robin_tab {' + theme[position].a + '} #robin_tab_div{ '+ theme[position].div + '}'; 
			self.appendCSS(cssString, function(){
				self.log('Theme "' + themeName + '" applied')
			});
		}
		else{
			self.log('The theme "' + themeName + '" does not exists');
		}
	},
	loadPopup:function(){
		self.log('loading popup');
		var bottom = 480,
			animationDuration = 600,
			robinTabClick = function(event){
				event.preventDefault();
				if($(this).css('bottom') === '0px'){
					$(this).animate({bottom:bottom}, animationDuration);
				}
				else{
					$(this).animate({bottom:0}, animationDuration);
				}
			},

			robinTab = $('<section/>').css({
				mozBoxSizing: 'content-box',
				msBoxSizing: 'content-box',
				boxSizing: 'content-box',
				borderImage: 'none',
				borderStyle: 'solid solid none',
				borderWidth: '0px 0px 0px 1px',
				position: 'fixed',
				cursor: 'pointer',
				display: 'block',
				textDecoration: 'none',
				height: '24px',
				padding: '10px 0 7px 0',
				zIndex: 100000,
				top: 'auto',
				bottom: 0,
				left: '20px',
				width: '327px',
				background:'-moz-linear-gradient(left, rgba(75,185,255,1) 0%, rgba(36,125,218,1) 65%, rgba(22,102,185,1) 100%)',
				background: '-o-linear-gradient(left, rgba(75,185,255,1) 0%,rgba(36,125,218,1) 65%,rgba(22,102,185,1) 100%)',
				background: '-ms-linear-gradient(left, rgba(75,185,255,1) 0%,rgba(36,125,218,1) 65%,rgba(22,102,185,1) 100%)',
				background: 'linear-gradient(to right, rgba(75,185,255,1) 0%,rgba(36,125,218,1) 65%,rgba(22,102,185,1) 100%)',
				filter: 'progid:DXImageTransform.Microsoft.gradient( startColorstr="#4bb9ff", endColorstr="#1666b9",GradientType=0)',
				borderColor: '#83edff'
			}).click(robinTabClick).appendTo('body'),

			header = $('<header/>').css({
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
			}).appendTo(robinTab),

			title = $('<div/>').html('Contact').appendTo(header);

			frameUrl = self.settings.apiurl + '/apikey/' + self.settings.apikey,

			robinWrapper = $('<div/>').css({
				width:324,
				height:470,
				borderWidth:0,
				position:'relative',
				top:9,
				borderImage: "none",
				borderStyle: "solid solid none",
				borderWidth: "0px .07em 0px .07em",
				borderColor: "#e8e8e8"
			}).appendTo(robinTab);

			robinFrame = $("<iframe>")
			.attr('src', frameUrl).css({
				width:"100%",
				height:"100%"
			}).attr('frameborder', 'no')
			.attr('allowtransparency', 'true').appendTo(robinWrapper);
	}
}
robin_JSP.init();