function Counter(nrPeriod){
	this.nrStatus = 0;
	this.nrPeriod = nrPeriod;
	this.el = $("<div id='counter' ><span id='counter_status'>0</span>|<span id='counter_period'>"+nrPeriod+"</span></div>");
	this.done = false;
}
Counter.prototype.create = function($container){
		this.el.appendTo($container || $("body"));
}
Counter.prototype.increase = function(renderIt, callBack){
	this.nrStatus++;
	if(renderIt){
		this.render();
	}
	if(this.nrStatus === this.nrPeriod) this.done = true;
	if (typeof callBack === 'function') callBack();
}
Counter.prototype.render = function(){
	this.el.find("#counter_status").text(this.nrStatus);
}
Counter.prototype.reset = function(renderIt){
	this.nrStatus = 0;
	this.done = false;
	if (renderIt) this.render();
}