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
        Robin.Utils.log('closing bubble...');
        elementsList.bubble.remove();
        Robin.Storage.setItem('rbn_bubble_show', 'no');
    };

    Robin.on('robin.button.made', function(elements){
        elementsList = elements;
        elements.robinTab.click(robinTabClick);
        elements.bubbleCloser.click(closeBubble);
    });

    self.open = function () {
        var popOver = $('#robin_popover');
        if (popOver.length === 0) {
            console.log('retrying to openup...');
            __robin.open();
        }
        else {
            var width = (Robin.Settings.popup.openWidth < Robin.Settings.popup.openMinWidth) ? Robin.Settings.popup.openMinWith : Robin.Settings.popup.openMinWidth;
            //default robin script wants to open, but button isn't build yet, lets retry!
            if (typeof elementsList.robinTab === "undefined") {
                var id = Robin.on('robin.button.made', function () {
                    Robin.Animator.open();
                    Robin.off(id);
                });
            }
            else {
                elementsList.robinTab.css({bottom: Robin.Settings.tabClosedBottom, width: width});
                elementsList.buttonUp.attr('src', Robin.ButtonMaker.buttons.down);
                elementsList.bubble.hide();
                Robin.Settings.tabOpened = true;
                Robin.PopOver.show();
            }
        }
    };

    self.close = function () {
        elementsList.robinTab.css({bottom:0, width:Robin.Settings.popup.buttonWidth}, Robin.Settings.animationDuration)
            .promise().done(function(){
                elementsList.bubble.fadeIn(Robin.Settings.animationDuration);
            });

        elementsList.buttonUp.attr('src', Robin.ButtonMaker.buttons.up);
        Robin.PopOver.down();
    };

})(Robin.Animator);
