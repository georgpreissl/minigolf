function Timer(nrTime){
	this.nrStartTime = nrTime;
	this.nrTime = nrTime;
	this.el = $("<div id='timer' ><span id='timer_time'>"+nrTime+"</span></div>");
	this.done = false;
}
Timer.prototype.create = function($container){
	
	this.el.appendTo($container || $("body"));
}
Timer.prototype.start = function(renderIt, callBack){
	self = this;
	self.iv = setInterval(function(){
		self.nrTime--;
		if(renderIt){
			self.render();
		}
		if(self.nrTime===0){

			self.stop(callBack);
			
		}
	},1000)

	
	
}
Timer.prototype.stop = function(callBack){
	self.done = true;
	clearInterval(self.iv);
	delete self.iv;
	if (typeof callBack === 'function') callBack();	
}
Timer.prototype.reset = function(renderIt){
	this.nrTime = this.nrStartTime;
	if (renderIt) this.render();
}
Timer.prototype.render = function(){
	// console.log('render');
	this.el.find("#timer_time").text(self.nrTime);	
}