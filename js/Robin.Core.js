(function(robin){

	Robin.Utils.extend(robin, PubSub);

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
		core.checkForTab();
		core.makeTab();
		core.on('core.found', core.overwriteShow);
		
		core.on('core.tab.made', core.setListener);
	};

	core.setStyle = function (element, style) {
		console.log(style);
		if (document.all && !document.querySelector) { // IE7 or lower 
			element.style.cssText = style;
		} else {
			element.setAttribute('style', style);
		}
	};

	core.removeStyle = function(element){
		core.setStyle(element, "");
	};

	core.styles = {
		robinTab :  'position: fixed;'+
					'bottom: 0px;' +
					'right: 15px;' +
					'width: 220px;' +
					'visibility: visible;' +
					'z-index: 100000;' +
					'border-width: 0px 0px 0px 1px;' +
					'border-style: solid solid none;' +
					'border-image-source: none;' +
					'opacity: 1;' +
					'height: 24px;' +
					'padding: 10px 0px 7px;' +
					'box-sizing: content-box;' +
					'cursor: pointer;' +
					'display: block;' +
					'text-decoration: none;' +
					'top: auto;' +
					'background: rgb(0, 0, 0);',
	};

	core.checkForRobin = function(){
		if(typeof __robin === 'undefined'){
			console.log('undefined');
			setTimeout(core.checkForRobin, 5000);
		}
		else{
			core.trigger('robin.found', __robin);
		}
	};

	core.checkForTab = function(){
		var tab = document.getElementById('robin_tab');
		if( tab === null){
			setTimeout(core.checkForTab, 0.1);
		}
		else{
			core.trigger('core.tab.found', tab);
		}
	};

	core.overwriteShow = function(robin){
		console.log('robin found');
		__core.show = function(convId, rating){
			console.log('showing robin!');
		};
	};

	core.overwriteStyleTab = function(oldTab){
		var tab = oldTab.cloneNode(true);
		oldTab.parentNode.replaceChild(tab, oldTab);

		core.removeStyle(tab);

		core.setStyle(tab, core.styles.robinTab);

		core.trigger('core.tab.overwritten', tab);
	};

	core.setListener = function(tab){
		core.addEvent(tab, 'onmouseover', function(){
			console.log('blaat');
		});
		core.addEvent(tab, 'click', function(event){
			console.log(event);
		});
	};
	return robin;
})(Robin.Core);



Robin.Core.Init();