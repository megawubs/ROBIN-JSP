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
			}
		},
		Core:{}
};