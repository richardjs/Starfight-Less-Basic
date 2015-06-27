'use strict';

function setTimer(func, interval){
	var lastTime = Date.now()
	var drift = 0;
	function timeHit(){
		var now = Date.now()
		var delta = now - lastTime;
		lastTime = now;
		drift += delta - interval;

		if(drift > interval * 10){
			drift = 0;
			console.log('skipping frames');
		}

		func();
		
		setTimeout(timeHit, Math.max(interval - drift, 0));
	}

	setTimeout(timeHit, interval);
}

if(typeof(module) !== 'undefined'){
	module.exports = setTimer;
}
