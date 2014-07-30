(function(self){
	"use strict";

    self.init =  function(){
        //check until __robin to becomes defined.
		self.checkForRobin();
        //check until #robin_popover exists in DOM
		self.checkForPopOver();
        //delete the #robin_close buttons
        self.deleteRobinClose();

        //set default settings for this script
        self.setDefaultSettings();

        //start when __robin is defined.
        Robin.on('robin.found.robin.var', self.start);

	};

    self.checkForRobin = function(){
        if(typeof __robin === 'undefined'){
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

    self.setDefaultSettings = function () {
        Robin.Settings.minWith = 325;
        Robin.Settings.tabClosedBottom = 480;
        Robin.Settings.animationDuration = 600;
        Robin.Settings.tabOpened = false;
        Robin.Settings.popup.buttonMinWidth = 220;
        Robin.Settings.popup.openMinWidth = 330;

        if (Robin.Settings.popup.buttonWidth < Robin.Settings.popup.buttonMinWidth) {
            Robin.Utils.log('Your button width is to small, setting it to the minimum of ' + Robin.Settings.popup.buttonMinWidth);
            Robin.Settings.popup.buttonWidth = Robin.Settings.popup.buttonMinWidth;
        }

        if (Robin.Settings.popup.openWidth < Robin.Settings.popup.openMinWidth) {
            Robin.Utils.log('Your open width is to small, setting it to the minimum of ' + Robin.Settings.popup.openMinWidth);
            Robin.Settings.popup.openWidth = Robin.Settings.popup.openMinWidth;
        }
    };

    self.start = function(){
        Robin.ButtonMaker.make();
        Robin.Query.getQueryStrings();
        if(Robin.Query.hasRobinConversationID()){
            Robin.trigger('robin.rbn_cnv.found', Robin.Query.querys);
        }
    };

	return self;
})(Robin.Core);



Robin.Core.init();