var Robin = {
		ButtonMaker:{},
		Utils:{
			PubSub:{},
			API:{},
			extend:function (destination, source) {
				for (var property in source) {
					if (destination[property] === undefined) {
						destination[property] = source[property];
					}
				}
			},
			log:function(message){
				if(Robin.Settings.logging){
					console.log(message);
				}
			}
		},
		Core:{},
		Settings:{
			apikey		: false,
			logging     : false,
			popup : {
				textOnline:'Live Chat', //text that will appear when you are online
				textOffline:'Contact Us', //text that will appear when you are offline,
				buttonWidth: 200,
				openWidth: 325
			}

		}
};

Robin.Utils.extend(Robin.Settings, robin_JSP_settings);