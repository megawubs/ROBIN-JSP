(function(self){
	"use strict";

	if(typeof(sessionStorage) == 'undefined'){
		self.getItem = function(name){
			if (document.cookie.length > 0) {
				var start = document.cookie.indexOf(name + "=");
				if (start != -1) {
					start = start + name.length + 1;
					var end = document.cookie.indexOf(";", start);
					if (end == -1) {
						end = document.cookie.length;
					}
					return unescape(document.cookie.substring(start, end));
				}
			}
			return '';
		};

		self.setItem = function(name, value){
			document.cookie = name + "=" + value + "; path=/";
		};

        self.removeItem = function(name){
            self.setItem(name, '');
        };
	}
	else{
		self.getItem = function(name){
           return sessionStorage.getItem(name);
        };

		self.setItem = function (name, value) {
           return sessionStorage.setItem(name, value);
        };
        self.removeItem = function (name) {
           return sessionStorage.removeItem(name);
        };
	}
	return self;
})(Robin.Storage);