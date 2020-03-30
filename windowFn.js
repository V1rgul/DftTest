
function interpolate(arr, t){
	t *= arr.length-1;
	var i = Math.floor(t);
	var d = t % 1;
	var r = (1-d)*arr[i]+(d)*arr[i+1];
	// console.log("interpolate",t,i,d, "[",arr[i], ",", arr[i+1], "] ->", r);
	return r;
}

var taylor = require('taylorwin');
function taylorWindowFn(n, nbar, sll){
	var taylorWindowArr = taylor(n, nbar, sll);
	return function(t){
		return interpolate(taylorWindowArr, t);
	};
}

function cosineWindowFn(p){ return function(t){
	return p.reduce(function(s, a, i){
		var dir = (i%2) ? -1 : 1;
		return s += dir*a*Math.cos(t*2*Math.PI*i);
	}, 0);
}; }
function tukeyWindowFn(alpha){ return function(t){
	if        (t<alpha/2) {
		return 0.5+0.5*Math.cos( Math.PI*( 2*t/alpha-1 ) );
	} else if (t<(1-alpha/2)) {
		return 1;
	} else {
		return 0.5+0.5*Math.cos( Math.PI*( (2*(t-1))/alpha + 1 ) );
	}
}; }




module.exports = {
	// Door           : function(t){ return 1; },
	Triangular     : function(t){ return (t<.5) ? t*2 : (1-t)*2; },
	Welch          : function(t){ return 1 - Math.pow( 2*t-1 , 2 ); },
	Hann           : cosineWindowFn([0.5, 0.5]),
	Hamming        : cosineWindowFn([0.53836, 0.46164]),
	Blackman       : cosineWindowFn([0.42659, 0.49656, 0.076849]),
	// Nuttal         : cosineWindowFn([0.355768, 0.487396, 0.012604]),
	BlackmanNuttal : cosineWindowFn([0.3635819, 0.4891775, 0.0106411]),
	// BlackmanHarris : cosineWindowFn([0.35875, 0.48829, 0.01168]),
	// FlatTop        : cosineWindowFn([1, 1.93, 1.29, 0.388, 0.028]),
	Taylor         : taylorWindowFn(256, 4, 35),
	Tukey          : tukeyWindowFn(0.5),
};