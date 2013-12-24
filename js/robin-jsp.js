robin_JSP = {
	Init: function() {
		
		// Make sure settings are defined
		if(typeof robin_JSP_settings.apikey == 'undefined') {
			// Logging
			if(robin_JSP_settings.logging == true) {
				console.log('ROBIN: Settings are required and missing');
			}
			return false;
		}
		
		// Variables not to be defined by user
		robin_JSP_settings.apiurl = '//selfservice.robinhq.com';

		// Variables to manage loading
		robin_JSP.holdLoading = 0;
		robin_JSP.abortLoading = false;
		
		// Hide for mobile
		if(typeof robin_JSP_settings.hideMobile != 'undefined') {	
		
			// Logging
			if(robin_JSP_settings.logging == true) {
				console.log('ROBIN: Setting "hideMobile : '+robin_JSP_settings.hideMobile+'" detected');
			}		
				
			if(robin_JSP_settings.hideMobile == true) {
			
				// Wait for callback before loading ROBIN
				robin_JSP.holdLoading++;
				
				robin_JSP.isMobile(function(response) {
					
					// Callback received
					robin_JSP.holdLoading--;

					if(response != true) {
						// Mobile false, continue loading
						
						// Logging
						if(robin_JSP_settings.logging == true) {
							console.log('ROBIN: Callback mobile is false, continue loading');
						}						
					} else {
						// Mobile true, cancel loading
						robin_JSP.abortLoading = true;
						
						// Logging
						if(robin_JSP_settings.logging == true) {
							console.log('ROBIN: Callback mobile is true, abort loading');
						}					
					}
				});
			}
		}
		
		// Hide when online/offline
		if(typeof robin_JSP_settings.hideOffline != 'undefined') {	
		
			// Logging
			if(robin_JSP_settings.logging == true) {
				console.log('ROBIN: Setting "hideOffline : '+robin_JSP_settings.hideOffline+'" detected');
			}			
			
			if(robin_JSP_settings.hideOffline == true) {
			
				// Wait for callback before loading ROBIN
				robin_JSP.holdLoading++;

				robin_JSP.isOnline(function(response) {
				
					// Callback received
					robin_JSP.holdLoading--;
				
					if(response == true) {
						// Online true, continue loading
						
						// Logging
						if(robin_JSP_settings.logging == true) {
							console.log('ROBIN: Callback online is true, continue loading');
						}						
					} else {
						// Online false, cancel loading
						robin_JSP.abortLoading = true;
						
						// Logging
						if(robin_JSP_settings.logging == true) {
							console.log('ROBIN: Callback online is false, abort loading');
						}																	
					}
				});
			}			
		}
		
		// Hide when online/offline
		if(typeof robin_JSP_settings.customTop != 'undefined') {		
			
			// Logging
			if(robin_JSP_settings.logging == true) {
				console.log('ROBIN: Setting "customTop : '+robin_JSP_settings.customTop+'" detected');
			}			

			// Wait for callback before loading ROBIN
			robin_JSP.holdLoading++;

			var css = 'a#robin_tab { top: '+robin_JSP_settings.customTop+' !important; }';
			robin_JSP.appendCSS(css,function(response) {
				// Callback received
				robin_JSP.holdLoading--;
			});				
		}
		
		robin_JSP.Load(function(response) {
			// Logging
			if(robin_JSP_settings.logging == true) {
				if(response == true) {
					console.log('ROBIN: Loading completed');
				} else {
					console.log('ROBIN: Loading aborted');
				}
			}
		});
	},
	Load: function(callback) {
		if(robin_JSP.holdLoading == 0) {
			if(robin_JSP.abortLoading !== true) {
				// Load ROBIN
				var script = document.createElement('script'),loaded;
				script.setAttribute('src', robin_JSP_settings.apiurl+'/external/robin/'+robin_JSP_settings.apikey+'.js');
				script.setAttribute('async', 'async');
				script.onreadystatechange = script.onload = function() { if (!loaded) { callback(true); } loaded = true; };
				document.getElementsByTagName('body')[0].appendChild(script);
			} else {
				// Loading aborted
				callback(false);
			}				
		} else {
			setTimeout(function(){robin_JSP.Load(function(response){callback(response);})},500);
		}
	},
	API: function(service,callback) {
		var request;
		if(window.XMLHttpRequest){
			request=new XMLHttpRequest;
		}
		else{
			request=new ActiveXObject('Microsoft.XMLHTTP');
		}
		request.onreadystatechange=function(){
			if(request.readyState == 4 && request.status == 200){
				var response = JSON.parse(request.responseText);
				callback(response);
			}
		}
		request.open('GET',robin_JSP_settings.apiurl+'/'+service,true);
		request.send();	
	},
	isMobile: function(callback) {
		var check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		callback(check);		
	},
	isOnline: function(callback) {
		var check = false;
		robin_JSP.API('presence/'+robin_JSP_settings.apikey+'/getstatus',function(response) {
			if(response.Data.Status == 'online') {
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
	}
}

robin_JSP.Init();