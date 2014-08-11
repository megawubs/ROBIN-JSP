(function(self){
    var elementsList = {},

    robinTabClick = function(event){
        event.preventDefault();
        if($(this).css('bottom') === '0px'){
            __robin.show();
        }
        else{
            __robin.hide();
        }
    },

    closeBubble = function(event){
        event.stopPropagation();
        Robin.Utils.log('Closing the bubble');
        elementsList.bubble.remove();
        Robin.Storage.setItem('rbn_bubble_show', 'no');
    };

    Robin.on('robin.button.made', function(elements){
        Robin.Utils.log('Adding events to the button');
        elementsList = elements;
        elements.robinTab.click(robinTabClick);
        elements.bubbleCloser.click(closeBubble);
        elements.bubble.click(__robin.show);
    });

    self.open = function () {
        Robin.Utils.log('Opening the Robin window...');
        var popOver = $('#robin_popover');
        if (popOver.length === 0) {
            Robin.Utils.log('Failed, retrying...');
            __robin.open();
        }
        else {
            var width = (Robin.Settings.popup.openWidth < Robin.Settings.popup.openMinWidth) ? Robin.Settings.popup.openMinWith : Robin.Settings.popup.openWidth;

            //default robin script wants to open, but button isn't build yet, lets retry!
            if (typeof elementsList.robinTab === "undefined") {
                Robin.Utils.log('Button is not made yet, setting up a listener for "robin.button.made"');
                var id = Robin.on('robin.button.made', function () {
                    self.open();
                    Robin.off(id);
                });
            }
            else {
                elementsList.robinTab.css({bottom: Robin.Settings.tabOpenedBottom, width: width});
                if(Robin.Settings.useDefaultImages){
                    elementsList.buttonUp.attr('src', Robin.ButtonMaker.buttons.down);
                }
                else{
                    elementsList.buttonUp.attr('id', "arrowImageDown");
                }

                elementsList.bubble.hide();
                Robin.Settings.tabOpened = true;
                Robin.PopOver.show();
                Robin.Utils.log('Robin window is opened!');

            }
        }
    };

    self.close = function () {
        Robin.Utils.log('Closing the Robin window');
        elementsList.robinTab.css({bottom:0, width:Robin.Settings.popup.buttonWidth}, Robin.Settings.animationDuration)
            .promise().done(function(){
                elementsList.bubble.fadeIn(Robin.Settings.animationDuration);
            });

        if(Robin.Settings.useDefaultImages){
            elementsList.buttonUp.attr('src', Robin.ButtonMaker.buttons.up);
        }
        else{
            elementsList.buttonUp.attr('id', "arrowImageUp");
        }
        Robin.PopOver.down();
    };

    self.setOnline = function(){
        Robin.Utils.log("Setting widget to online state");
        //update styling
        elementsList.headerTitle.html(Robin.Settings.onlineText);
        elementsList.buttonPlus.appendTo(elementsList.headerTitle);
        elementsList.buttonChat.appendTo(elementsList.headerTitle);
    };

    self.setOffline = function () {
        elementsList.headerTitle.html(Robin.Settings.offlineText);
        elementsList.buttonPlus.appendTo(elementsList.headerTitle);
        elementsList.buttonChat.appendTo(elementsList.headerTitle);
    };

})(Robin.Animator);
