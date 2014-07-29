(function(core){

	var pubsub = Robin.Utils.PubSub;

	core.addEvent = function(element, event, action){
		if(element.addEventListener){
			element.addEventListener(event, action, false);
		}
		else if (element.attachEvent){
			element.attachEvent(event, action, false);
		}
	};

	core.init =  function(){
		core.checkForRobin();
		// Robin.Utils.log(Robin.ButtonMaker);
		Robin.ButtonMaker.make();
	};

	core.checkForRobin = function(){
		if(typeof __robin === 'undefined'){
			console.log('undefined');
			setTimeout(core.checkForRobin, 5000);
		}
		else{
			Robin.Utils.PubSub.trigger('core.found.robin', __robin);
		}
	};


	core.setListener = function(tab){
		core.addEvent(tab, 'onmouseover', function(){
			console.log('blaat');
		});
		core.addEvent(tab, 'click', function(event){
			console.log(event);
		});
	};
	return core;
})(Robin.Core);



Robin.Core.init();