skipIntro = false;
var canPlay = true;



$messageWrap = $('#messageWrap');
$gameWrap = $('#gameWrap');
$body = $("body");
$stats = $('#stats');

$messageWrap.hide();

wx = $(window).width()/2;
wy = $(window).height()/2;
arBalls =[];
speed = 0;
mousedown = false;
useKeys = false;
emptyHoleExists = false;
timeNextHole = 0;
nrLimitHoles = 5;
nrLimitTime = 60;

obCounter = new Counter(nrLimitHoles);
obCounter.create($stats);

obTimer = new Timer(nrLimitTime);
obTimer.create($stats);


skipIntro ? resetGame() : showMessage("<h1>MiniGolf</h1>",0,resetGame);

function resetGame(){
	console.log('resetGame');
	obCounter.reset(true);
	obTimer.reset(true);
	obTimer.start(true,timesUp);
	startRound()
	
}
obPipe = {
	el:$("<div/>").addClass('pipe').appendTo($gameWrap),
	x:wx,
	y:wy,
	a:0,
	ad:0,
	w:200,
	h:20,
	speed:.1
}
obPipe.el.css({
	left: obPipe.x-obPipe.w/2,
	top: obPipe.y-obPipe.h/2
});

function createBall(){
	return {
		el:$("<div/>").addClass('ball').appendTo($gameWrap),
		x:wx,
		y:wy,
		vy:0,
		vx:0,
		h:20,
		w:20,
		r:10,
		tx:wx,
		ty:wy,
		speed:0,
		isInPipe: false,
		hasStopped: false,
		alive:true
	};
};

function createHole(){
	return {
		el: $('.hole').length ? $('.hole') : $("<div/>").addClass('hole').appendTo($gameWrap),
		x:Math.floor(Math.random()*$(window).width()),
		y:Math.floor(Math.random()*$(window).height()),
		h:30,
		w:30,
		r:15,
		empty:true
	};
};

if(!useKeys){

	$(window).mousemove(function(e){
		if(canPlay){
		
			mx=e.clientX;
			my=e.clientY;
			dx=mx-obPipe.x;
			dy=my-obPipe.y;
			obPipe.a = Math.atan2(dy,dx);
			obPipe.ad = obPipe.a * (180/Math.PI);
		}	

	});
}
$body.mousedown(function(e){
	if(canPlay){
		mousedown = true;
		ballInPipe = true;
		obCurrentBall = createBall();
		obCurrentBall.isInPipe = true;
		arBalls.push(obCurrentBall);
		
	}
	
})
$body.mouseup(function(e){
	if(canPlay){
		if(ballInPipe){
			mousedown = false;
			ballInPipe = false;
			obCurrentBall.isInPipe = false;
			obCurrentBall.timeToHide = 0;
			obCurrentBall.ty = Math.sin(obPipe.a)*obCurrentBall.speed + obCurrentBall.y;
			obCurrentBall.tx = Math.cos(obPipe.a)*obCurrentBall.speed + obCurrentBall.x;

		}
	}	
});

function render(){

	
	obPipe.el.css('transform',' rotate('+obPipe.ad+'deg)');
	nrBalls = arBalls.length;

	if(nrBalls){
		for(i=0; i<nrBalls; i++){
			
			b = arBalls[i];
			if(b.alive){
				if(mousedown && i===nrBalls-1){
					b.speed += 10;
					b.ty=(Math.sin(obPipe.a)*(b.speed/100))*-1 + b.y;
					b.tx=(Math.cos(obPipe.a)*(b.speed/100))*-1 + b.x;
				}
				b.dy = b.ty - b.y;
				b.dx = b.tx - b.x;
				b.vy = b.dy/10;
				b.vx = b.dx/10;
				b.y = b.y+b.vy;
				b.x = b.x+b.vx;
				b.el.css({
					left: b.x-b.r,
					top: b.y-b.r
				});

				dhx = b.x - obHole.x;
				dhy = b.y - obHole.y;
				distHole = Math.sqrt(dhx*dhx+dhy*dhy);
				if(distHole<20){

					if(b.vx<3 && b.vy<3){
						// ball is in hole
						canPlay = false;
						b.tx = obHole.x;
						b.ty = obHole.y;
						b.el.addClass('tr').addClass('inHole');
						timeNextHole++;
						if(timeNextHole>50){
							canPlay = true;
							timeNextHole = 0;
							
							
							arBalls=[];
							emptyHoleExists = false;
							
							$('.ball').fadeOut('fast',function(){
								$(this).remove();
								
							})
							
							obCounter.increase(true);

							if(obCounter.done){
								obTimer.stop();
								showOutro();
							} else {
								showMessage("<h1>Great!</h1>",500,startRound);
							}
							
						}
					} else {
						b.tx += Math.floor(Math.random()*20)-10;
						b.ty += Math.floor(Math.random()*20)-10;
					}

				}
				
				if(Math.abs(b.vx)<.1 && !b.isInPipe){
					b.hasStopped = true;
				}
				if(b.hasStopped){
					b.timeToHide ++;
				}
				if(b.timeToHide > 50){
					b.alive = false;
					b.el.remove();
				}
			}		
		}		
	}	
		
	requestAnimationFrame(render)
}
render();

function startRound(){

	obHole = createHole();
	obHole.el.css({
		left: obHole.x-obHole.r,
		top: obHole.y-obHole.r,
		width: obHole.w,
		height: obHole.h
	});
	emptyHoleExists = true;

}
function showOutro(){
	showMessage("<h1>Done!</h1><p>You made "+obCounter.nrStatus+" Putts in "+obTimer.nrTime +"sec</p>",0,resetGame);
}
function timesUp(){
	showMessage("<h1>Times up!</h1>",0,resetGame);
}
function showMessage(message,duration,callBack){
	canPlay = false;
	$messageWrap.find("#message").html(message);
	
		
	$messageWrap.show();
	//$messageWrap.find("h1").fitText(.5,{ minFontSize:"15", maxFontSize:"100" });

	$messageWrap.css('opacity', '0').transition({
		scale: '1.2',
		y: '-20',
		opacity: '1'
	},500);
	
	$gameWrap.fadeOut(50);
	if(duration>0){
		setTimeout(function(){
			hideMessage(callBack);
			
		},duration)	
		
	} else {
		$messageWrap.one( "click", function() {
			hideMessage(callBack);
			
		});
	}
}
function hideMessage(callBack){
	$messageWrap.transition({
		scale: '1',
		y: '0',
		opacity: '0'
	},500, function(){
		$(this).hide();
	})
	$gameWrap.fadeIn(50);
	
	canPlay = true;
	if(typeof callBack === "function") callBack();

}

$(window).keydown(function(e){
	if(e.keyCode==37){
		obPipe.a-=obPipe.speed;
		obPipe.ad = obPipe.a*180/Math.PI;
	};
	if(e.keyCode==39){
		obPipe.a+=obPipe.speed;
		obPipe.ad = obPipe.a*180/Math.PI;
	};
	if(e.keyCode==38){
		startRound();
		
	}
})
