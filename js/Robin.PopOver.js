(function(self){

    var down = "-480px",
        up = 0,
        setStyle = function(style){
            var popOver = $('#robin_popover');
            popOver.css(style);
        },
        clearStyle = function () {
            var popOver = $('#robin_popover');
            popOver.attr('style', '');
        };

    self.restyle = function () {
        clearStyle();
        setStyle({
            position: "fixed",
            right: "15px",
            bottom: down,
            height: "479px",
            width: Robin.ButtonMaker.elementsList.robinTab.width() + "px",
            zIndex:" 999998",
            boxShadow: "rgba(50, 50, 50, 0.498039) 0px 0px 10px",
            display: "block"
        });
    };

    self.show = function () {
        self.restyle();
        setStyle({
            bottom:up
        });
    };

    self.down = function () {
        setStyle({
            bottom:down
        });
    };

    self.setListener = function () {
        var popOver = $('#robin_popover');

        popOver.hover(function () {
            console.log('hello world!');
        });
    };

})(Robin.PopOver);
