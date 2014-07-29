(function(self){
	"use strict";

	self.addEvent = function(element, event, action){
		if(element.addEventListener){
			element.addEventListener(event, action, false);
		}
		else if (element.attachEvent){
			element.attachEvent(event, action, false);
		}
	};

	self.init =  function(){
		self.checkForRobin();
		self.checkForPopOver();
        self.deleteRobinClose();
        self.querys = self.getQueryStrings();
        if(self.hasRobinConversationID()){
            Robin.trigger('robin.convid.found', self.querys);
        }

		Robin.Settings.minWith = 325;
		Robin.Settings.tabClosedBottom = 480;
		Robin.Settings.animationDuration = 600;
		Robin.Settings.tabOpened = false;
		Robin.Settings.popup.buttonMinWidth = 220;
		Robin.Settings.popup.openMinWidth = 330;

		if(Robin.Settings.popup.buttonWidth < Robin.Settings.popup.buttonMinWidth){
            Robin.Utils.log('Your button width is to small, setting it to the minimum of ' + Robin.Settings.popup.buttonMinWidth);
            Robin.Settings.popup.buttonWidth = Robin.Settings.popup.buttonMinWidth;
        }

        if(Robin.Settings.popup.openWidth < Robin.Settings.popup.openMinWidth){
            Robin.Utils.log('Your open width is to small, setting it to the minimum of ' + Robin.Settings.popup.openMinWidth);
            Robin.Settings.popup.openWidth = Robin.Settings.popup.openMinWidth;
        }

		Robin.ButtonMaker.make();
	};

	self.checkForRobin = function(){
		if(typeof __robin === 'undefined'){
			console.log('undefined');
			setTimeout(self.checkForRobin, 0.1);
		}
		else{
			Robin.trigger('robin.found.robin.var', __robin);
		}
	};

    self.checkForPopOver = function(){
        var popOver = document.getElementById('robin_popover');
        if( popOver === null){
            setTimeout(self.checkForPopOver, 0.1);
        }
        else{
            Robin.trigger('robin.pop_over.found', $(popOver));
        }
    };

    self.deleteRobinClose = function () {
        var buttons = document.getElementById('robin_close');
        if( buttons === null){
            setTimeout(self.deleteRobinClose, 0.1);
        }
        else{
            $(buttons).remove();
        }
    };

    self.getQueryStrings = function () {
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
    };

    self.hasRobinConversationID = function(){
        var value = sessionStorage.getItem('rbn_cnv');
        if(typeof value === 'string'){
            self.querys.rbn_cnv = value;
            return true;
        }
        return self.urlHasRobinConversationID();
    };

    self.urlHasRobinConversationID = function(){
        var querys = self.getQueryStrings();
        if(typeof querys.rbn_cnv !== 'undefined'){
            Robin.Utils.log('Found Robin query string');
            sessionStorage.setItem('rbn_cnv', querys.rbn_cnv);
            Robin.Utils.querys = querys;
        }
        else{
            Robin.Utils.log('No robin query string found.');
            return false;
        }
        return true;
    };

	return self;
})(Robin.Core);



Robin.Core.init();