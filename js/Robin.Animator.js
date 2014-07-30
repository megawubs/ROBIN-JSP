(function(self){
    var elementsList = {};

    self.robinFound = false;
    Robin.on('robin.button.made', function(elements){
        elementsList = elements;
        elements.robinTab.click(self.robinTabClick);
        elements.bubbleCloser.click(self.closeBubble);
    });

    Robin.on('robin.found.robin.var', function (robin) {
        self.robinFound = true;
    });

    Robin.on('robin.pop_over.found', function(popOver){
       popOver.hide();
    });

    Robin.on('robin.convid.found', function (querys) {
        function check() {
            if (!self.open(querys.rbn_cnv)) {
                setTimeout(function () {
                    check();
                }, 0.1);
            }
        }

        check();
    });
    self.robinTabClick = function(event){
        event.preventDefault();
        if($(this).css('bottom') === '0px'){
            self.open(null, null);
        }
        else{
            self.close();
        }
    };

    self.open = function (conversation, rating) {
        if(self.robinFound){
            var width = (Robin.Settings.popup.openWidth < Robin.Settings.popup.openMinWidth) ? Robin.Settings.popup.openMinWith : Robin.Settings.popup.openMinWidth;

            elementsList.robinTab.css({bottom:Robin.Settings.tabClosedBottom, width:width});

            elementsList.buttonUp.attr('src', Robin.ButtonMaker.buttons.down);
            elementsList.bubble.hide();
            Robin.Settings.tabOpened = true;
            __robin.show(conversation, rating, function () {
                var popOver = Robin.ButtonMaker.elementsList.popOver;
                Robin.PopOver.restyle(popOver);
                popOver.css({
                    bottom:0
                });
            });
            return true;
        }
        else{
            return false;
        }
    };

    self.close = function () {
        if(self.robinFound){
            console.log(Robin.Settings.popup.buttonWidth);
            elementsList.robinTab.css({bottom:0, width:Robin.Settings.popup.buttonWidth}, Robin.Settings.animationDuration)
                .promise().done(function(){
                    elementsList.bubble.fadeIn(Robin.Settings.animationDuration);
                });
            elementsList.buttonUp.attr('src', Robin.ButtonMaker.buttons.up);
            Robin.ButtonMaker.elementsList.popOver.css({
                bottom:"-480px"
            });
        }
    };

    self.closeBubble = function(event){
        event.stopPropagation();
        Robin.Utils.log('closing bubble...');
        elementsList.bubble.remove();
        Robin.Storage.setItem('rbn_bubble_show', 'no');
    };

})(Robin.Animator);