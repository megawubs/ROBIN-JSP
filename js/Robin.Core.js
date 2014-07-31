(function(self){
	"use strict";

    self.init =  function(){
        Robin.Utils.log('Initializing...');
        Robin.on('__robin.defined', function () {
            Robin.Utils.log('Staring up');
            Robin.Utils.extend(Robin.Settings, robin_settings);
            Robin.ButtonMaker.make();

            Robin.Utils.log('Starting loop');
            self.startLoop(function () {
               self.isOnline().done(function (response) {
                   if(response.Data.Status === 'online') {
                       if(Robin.Settings.isOnline === false){
                           Robin.Animator.setOnline();
                           Robin.Settings.isOnline = true;
                       }
                   }
                   else{
                       if(Robin.Settings.isOnline === true){
                           Robin.Animator.setOffline();
                           Robin.Settings.isOnline = false;
                       }
                   }
               });
            });
        });

        //check until __robin becomes defined.
		self.checkForRobin();

        //set default settings for this script
        self.setDefaultSettings();

        //bubble related settings
        if (!Robin.Storage.getItem('rbn_bubble_show')) {
            Robin.Storage.setItem('rbn_bubble_show', 'yes');
        }
	};

    self.checkForRobin = function(){
        if(typeof __robin === 'undefined'){
            setTimeout(self.checkForRobin, 0);
        }
        else{
            Robin.trigger('__robin.defined', __robin);
        }
    };

    self.setDefaultSettings = function () {
        Robin.Settings.minWith = 325;
        Robin.Settings.tabOpenedBottom = 479;
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
    self.isOnline = function() {
        var check = false;
        return self.api('presence/'+Robin.Settings.apikey+'/getstatus')
            .done(function(response) {
                if(response.Data.Status === 'online') {
                    check = true;
                }
            });
    };

    self.api = function(service) {
        var url = Robin.Settings.baseUrl +'/' + service;
        Robin.Utils.log('API: Requesting: ' + url);
        return $.get(url);
    };

    self.startLoop = function(loop){
        var repeat = function(){
            loop();
            setTimeout(repeat, 18000);
        };
        repeat();
    };

	return self;
})(Robin.Core);

Robin.Core.init();