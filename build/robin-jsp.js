var Robin;
Robin = {
    ButtonMaker: {},
    Animator:{},
    Utils: {
        PubSub: {},
        API: {},
        extend: function (destination, source) {
            for (var property in source) {
                if (destination[property] === undefined) {
                    destination[property] = source[property];
                }
                if (destination[property] !== source[property]) {
                    destination[property] = source[property];
                }
            }
        },
        log: function (message) {
            if (Robin.Settings.logging) {
                console.log(message);
            }
        }
    },
    Core: {},
    Storage: {},
    PopOver:{},
    Query: {},
    Settings: {
        apikey: false,
        logging: false,
        popup: {}
    }
};

Robin.Utils.extend(Robin.Settings, robin_JSP_settings);

console.log(Robin);
(function(p){
	"use strict";
	var topics = {},
	lastUid = -1;
	var publish = function( topic , data){
		if ( !topics.hasOwnProperty( topic ) ){
			return false;
		}
		var notify = function(){
			var subscribers = topics[topic],
			throwException = function(e){
				return function(){
					throw e;
				};
			}; 
			for ( var i = 0, j = subscribers.length; i < j; i++ ){
				try {
					subscribers[i].func(data ); 
				} catch( e ){
					setTimeout( throwException(e), 0);
				}
			}
		};
		setTimeout( notify , 0 );
		return true;
	};
	/**
	 *  Publishes the topic, passing the data to it's subscribers
	 *  @topic (String): The topic to publish
	 *  @data: The data to pass to subscribers
	 **/
	 p.trigger = function( topic, data ){
         console.log("trigger: ", topic, data);
	 	return publish( topic, data, false );
	 };
	/**
	 *  Subscribes the passed function to the passed topic. 
	 *  Every returned token is unique and should be stored if you need to unsubscribe
	 *  @topic (String): The topic to subscribe to
	 *  @func (Function): The function to call when a new topic is published
	 **/
	 p.on = function( topic, func ){
         console.log("on", topic);
		// topic is not registered yet
		if ( !topics.hasOwnProperty( topic ) ){
			topics[topic] = [];
		}
		var token = (++lastUid).toString();
		topics[topic].push( { token : token, func : func } );
		// return token for unsubscribing
		return token;
	};
	/**
	 *  Unsubscribes a specific subscriber from a specific topic using the unique token
	 *  @token (String): The token of the function to unsubscribe
	 **/
	 p.off = function( token ){
	 	for ( var m in topics ){
	 		if ( topics.hasOwnProperty( m ) ){
	 			for ( var i = 0, j = topics[m].length; i < j; i++ ){
	 				if ( topics[m][i].token === token ){
	 					topics[m].splice( i, 1 );
	 					return token;
	 				}
	 			}
	 		}
	 	}
	 	return false;
	 };
	}(Robin.Utils.PubSub));

Robin.Utils.extend(Robin, Robin.Utils.PubSub); //Give Robin pub/sub methods!
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
(function(self){
    var elementsList = {};

    self.robinFound = false;
    Robin.on('robin.button.made', function(elements){
        elementsList = elements;
        elements.robinTab.click(self.robinTabClick);
        elements.bubbleCloser.click(self.closeBubble);
    });

    Robin.on('robin.found.robin.var', function () {
        self.robinFound = true;
    });

    Robin.on('robin.pop_over.found', function(popOver){
       popOver.hide();
    });

    Robin.on('robin.rbn_cnv.found', function (querys) {
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

(function(self){
	"use strict";
    self.buttons = {
            chat : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAA7CAYAAADLjIzcAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAm5JREFUeNrsmtFxgkAQhhcm79JBSAViBZIKYgfRCmIqCHagHWAHdhDoADvADqACcpcshjCHgAgut/lndiZjzE32u9u9vb0zsiyDDrKFLYS5+PMU+lcqLEILhB26DGZcAcAStkQbwuEmQCQEH4G0kwTQwjxhSUZXgTC3jU9NV4CLhB9hHNoJ84QldV80GwwmB/ockfNSbxgOTpccIGN9K+wVxqsUc9WhLQALCU5BD60whBsD8Ec+8yrNcOuszQGehs4Drmi7bgW4mPB0VYg+KleAVRUnGmkubF0FYD2yre5aeTjZfwBYZTIaa1L0NQewxF9wkRIAJ03wFPsNYKhjLDWdASyAp84AXKYAZBg4pqo6YiTbZBr/uRwTmIs7AJs7AIs7gOg/Bwg7MfY/lgBi7gACxgACCeDA1PkwzwER0zxwKBZCHFeBXwSwZeb8HvDeMAcQ44dc5KnOAvLDlIHzu+LWXwQQF8loqlPZR9XdoKwL5poCeC7XPaqzgOyVHTV0/l1V9FXdDjv4ZV3uCmSCX1YdhpTHRPhplqY6O38JQA7BHnk4rKDm0qeuH5BgOGxGmO1n0OC2u2lDxMMBQ+KOpzhZNiheg6h0zUNJmRvk5eILsRn3saRP2vyh0eGprA2/z2TdO+wYR9ypgi6HOaPjW+EyEGkW5o2PBufxoMX4SWFZB7f6p28JoKy6gZ+AQDvuXl3hDRDpRfa5ApKKvJBiqCQUAPS5AqILWyoJ5+8RAicg1n0aGgC5l2hDAgiBYPPV5Dz7QwLYN63NdQSQAuFeY58A8kJnC4QvYPsGQG7bGzoESBU9Kj30XAmSv3P8EmAAdvt+hzaO0tAAAAAASUVORK5CYII=',
            down: 'data:image/png;base64,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',
            plus: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAIAAACQKrqGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODQyMjU2OTNDMTBFMTFFMjk4NUNENjE0NzA0NUQwQkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODQyMjU2OTRDMTBFMTFFMjk4NUNENjE0NzA0NUQwQkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NDIyNTY5MUMxMEUxMUUyOTg1Q0Q2MTQ3MDQ1RDBCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4NDIyNTY5MkMxMEUxMUUyOTg1Q0Q2MTQ3MDQ1RDBCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpoxXMkAAABLSURBVHjaYmbAAL39k6ytbQ7s38dAEPz////w0eOY4kwMRIMBV8rS2NTKw8uLJiojLQUMB2SRmzeuMwA9+58IgKZzGAUWCUoBAgwA3/A9XWNZyOEAAAAASUVORK5CYII=',
            up: 'data:image/png;base64,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'
        };
    if(!Robin.Storage.getItem('rbn_bubble_show')){
        Robin.Storage.setItem('rbn_bubble_show', 'yes');
    }
	self.elementsList = {};

	self.onlineStatus = false;

    Robin.on('robin.pop_over.found', function(popOver){
        self.elementsList.popOver = popOver;
        Robin.PopOver.restyle(self.elementsList.popOver);
    });

    Robin.on('robin.found.robin.var', function(){
        self.onlineStatus = robin_settings.isOnline;
//        if(self.onlineStatus === true){
//            self.setOnline();
//        }
//        else{
//            self.setOffline();
//        }
    });

	self.make = function(){
			Robin.Utils.log('Loading popup');
			var dfd = new $.Deferred();
        console.log($('#robin_popover').length);
		self.elementsList.robinTab = self.createRobinTab()
		.appendTo('body');
		self.elementsList.bubble = self.createBubble();
		if(Robin.Storage.getItem('rbn_bubble_show') === 'yes'){
			self.elementsList.bubble.appendTo('body');
		}

		self.elementsList.header = self.createHeader()
		.appendTo(self.elementsList.robinTab);

		self.elementsList.headerTitle = self.createHeaderTitle()
		.appendTo(self.elementsList.header);

		self.elementsList.buttonPlus = self.createButtonPlus()
		.appendTo(self.elementsList.headerTitle);

		self.elementsList.buttonChat = self.createButtonChat()
		.appendTo(self.elementsList.headerTitle);

		self.elementsList.buttonUp = self.createButtonUp()
		.appendTo(self.elementsList.header);

        Robin.trigger('robin.button.made', self.elementsList);

		dfd.resolve();
		return dfd.promise();
	};

	self.createRobinTab = function(){

		return $('<section id="robinTab"/>').css({
			position: 'fixed',
			bottom: '0px',
			right: '15px',
			width:  Robin.Settings.popup.buttonWidth + 'px',
			visibility: 'visible',
			zIndex: '2147483639',
			border: '0px',
			opacity: 1,
			background: 'transparent',
			height: '24px',
			padding: '10px 0 7px 0',
			mozBoxSizing: 'content-box',
			msBoxSizing: 'content-box',
			boxSizing: 'content-box',
			borderImage: 'none',
			borderStyle: 'solid solid none',
			borderWidth: '0px 0px 0px 1px',
			cursor: 'pointer',
			display: 'block',
			textDecoration: 'none',
			top: 'auto',
			// left: '20px', //to make it go left!
			backgroundColor:'#000000'
		});
	};
	self.createHeader = function(){
		return $('<header/>').css({
					fontFamily: "Helvetica, arial,sans-serif",
					fontSize: "14px",
					fontWeight: "bold",
					lineHeight: 1.6,
					paddingLeft: "25px",
					marginRight: "25px",
					textAlign: "left",
					textTransform: "uppercase",
					textDecoration: "none",
					top: 0,
					verticalAlign: "middle",
					width: "auto",
					mozBoxSizing:"content-box",
					msBoxSizing:"content-box",
					boxSizing: "content-box",
					webkitTouchCallout: "none",
					webkitUserSelect: "none",
					khtmlUserSelect: "none",
					mozUserSelect: "none",
					msUserSelect: "none",
					userSelect: "none",
					color: "#E8E8E8",
					textShadow: "1px 1px 1px #404040"
				});
	};

    self.getHeaderTitle = function() {
        return (self.onlineStatus) ? Robin.Settings.popup.textOnline : Robin.Settings.popup.textOffline;
    };

    self.createHeaderTitle = function(){
		var title = self.getHeaderTitle();
		return $('<div/>').html(title).css({
			left:'2%',
			position:'relative',
			width:149
		});
	};

	self.createButtonPlus = function(){
		return $('<img/>')
			.attr('src', self.buttons.plus)
			.css({
				cssFloat:'left',
				paddingRight: 10,
				position:'relative',
				top:3
			});
	};

	self.createButtonChat = function(){
		return $('<img/>')
			.attr('src', self.buttons.chat)
			.css({
				paddingLeft:10,
				width:25
			});
	};

	self.createButtonUp = function(){
		return $('<img/>')
			.attr('src', self.buttons.up)
			.css({
				position:'relative',
				top:-18,
				cssFloat:'right',
				width:15
			});
	};

	self.createBubble = function(){
		var bubble = $('<div/>').css({
				fontFamily: "Helvetica, arial,sans-serif",
				fontWeight: "bold",
			 	fontSize: "41pt",
				color:"#FFFFFF",
				textTransform:'uppercase',
				position: 'fixed',
				bottom: '109px',
				right: '5px',
				borderColor: "rgb(127, 127, 127)",
			 	borderTopLeftRadius: "0px",
			 	borderTopRightRadius: "0px",
			 	borderBottomRightRadius: "0px",
			 	borderBottomLeftRadius: "0px",
			 	padding: "4px",
			 	width: "198",
			 	height: "222px",
			 	borderWidth: "0px",
			 	backgroundColor: "rgb(0, 0, 0)",
			 	cursor:"pointer"
			});
		self.elementsList.bubbleCloser = $('<div />').css({
				fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
				color:"#ffffff",
				fontSize: "20px",
				fontWeight: "bold",
				lineHeight: "18px",
				opacity: "0.2",
				filter: "alpha(opacity=20)",
				textDecoration: "none",
				cssFloat: "right",
				paddingRight: "5px"
		}).attr('id','bubbleClose').html('x').appendTo(bubble);

		var pointer = $('<div/>')
			.css({
				content: "",
				position: "absolute",
				borderStyle: "solid",
				borderWidth: "64px 99px 0px",
				borderColor: "rgb(0, 0, 0) transparent",
				display: "block",
				width: "0px",
				zIndex: "1",
				bottom: "-64px",
				left: "0px"
			}).appendTo(bubble);

	return bubble.append(Robin.Settings.popup.bubbleText).click(self.openTab);
	};

    self.setOnline = function(){
            Robin.Utils.log("Setting widget to online state");
            //update styling
            self.elementsList.headerTitle.html(Robin.Settings.popup.textOnline);
            self.elementsList.buttonPlus.appendTo(self.elementsList.headerTitle);
            self.elementsList.buttonChat.appendTo(self.elementsList.headerTitle);
    };

    self.setOffline = function(){
        Robin.Utils.log("Setting widget to offline state");
        //update styling
        self.elementsList.headerTitle.html(Robin.Settings.popup.textOffline);
        self.elementsList.buttonPlus.appendTo(self.elementsList.headerTitle);
        self.elementsList.buttonChat.appendTo(self.elementsList.headerTitle);

    };

	return self;
})(Robin.ButtonMaker);
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

})(Robin.PopOver);

(function (self) {

    self.querys = {};

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
        self.querys = queryStrings;
        return queryStrings;
    };

    self.hasRobinConversationID = function(){
        var value = Robin.Storage.getItem('robin_cnv');
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
            Robin.Storage.setItem('robin_cnv', querys.rbn_cnv);
            Robin.Utils.querys = querys;
        }
        else{
            Robin.Utils.log('No robin query string found.');
            return false;
        }
        return true;
    };

    return self;

})(Robin.Query);

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