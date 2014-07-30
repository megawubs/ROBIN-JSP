(function(self){



    self.restyle = function (popOver) {
        popOver.attr('style', '');
        popOver.css({
            position: "fixed",
            right: "15px",
            bottom: "-480px",
            height: "479px",
            width: "331px",
            zIndex:" 999998",
            boxShadow: "rgba(50, 50, 50, 0.498039) 0px 0px 10px",
            display: "block"
        });
    };

    Robin.on('robin.pop_over.found', self.restyle);

})(Robin.PopOver);
