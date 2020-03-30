var colors = (function (){
	var list = ["dark-violet","#009e73","#56b4e9","#e69f00","#f0e442","#0072b2","#e51e10","black","gray50"];
	var o = {};
	list.forEach(function(c, i){
		o["linetype "+(i+1)] = "lc rgb \""+c+"\""; 
	});
	o["linetype"] = "cycle "+list.length;
	return o;
})();

function map(v, rangeIn, rangeOut) { 
	if(rangeOut) v = (v - rangeIn[0]) / (rangeIn[1] - rangeIn[0])
	else         rangeOut = rangeIn;
	return v * (rangeOut[1] - rangeOut[0]) + rangeOut[0]; 
}


var _ = require('lodash');

// waves: [timeCoeff, offset, multiplier]
function genSample(t, waves){
	var nM = 0;
	var s = waves.reduce(function(s, w){
		var m = w[2] || 1;
		nM += m;
		return s + Math.cos(Math.PI*2*(t*w[0]+w[1]))*m;
	}, 0);
	return s / nM;
};
function genData(duration, freq, waves){
	var r = [];
	for( var t=0; t<duration; t+=map( Math.random(), [0,1], [1/freq[0], 1/freq[1]]) ){
		r.push( [ t, genSample(t, waves) ] );
	}
	return r;
}


var duration = 20; //s
var samplingRate = [5,200]; //Hz

var data = genData(duration, samplingRate, [
	[  1/40, 0  , 1 ],
	[  1/20, 0  , 1 ],
	[   1, 0.1  , .5 ],
]);

var windowFn = require("./windowFn");

function dftDoWindow(data, fn){
	return data.map(function(d){
		var normT = d[0]/duration;
		return [ d[0], d[1]*fn(normT) ];
	});
}

var dataWindowed = _.mapValues(windowFn, function(v,k){
	return dftDoWindow(data, v);
});




var gnuplot = require('gnu-plot');

var plotT = gnuplot();
plotT.set(colors);
plotT.plot( _.map(dataWindowed, function(v,k){
	return {title:k, data:v};
}) );



function cSample(t, f){
	c = t * Math.PI * 2 * f;
	return [ Math.cos(c), -Math.sin(c) ];
}


function correlate(data, f){
	return data.reduce(function(s,d){
		var cSamples = cSample(d[0], f);
		s[0] += cSamples[0]*d[1]/data.length;
		s[1] += cSamples[1]*d[1]/data.length;
		return s;
	}, [0,0]);
}

var minF = 0.5;//1 / duration;
var maxF = 2;//samplingRate / 2;
var stepF = 0.01;

function dft(d){
	var r = [];
	for(var f=minF; f<maxF; f+=stepF){
		var corr = correlate(d, f);
		//var v = Math.sqrt(Math.pow(corr[0], 2) + Math.pow(corr[1], 2)) / d.length;
		r.push([f, corr]);
	}
	return r;
}



var resultWindowed = _.mapValues(dataWindowed, function(v,k){
	return dft(v, k);
});

function calcMean (d){ return Math.hypot(d[0], d[1]); }
function calcPhase(d){ return Math.atan2(d[1], d[0])/(Math.PI*2); }

function refineData(data, fn){
	return data.map(function(d){
		return [d[0], fn(d[1])];
	});
}

var resultWindowedMean = _.mapValues(resultWindowed, function(v,k){
	return refineData(v, calcMean);
});
var resultWindowedPhase = _.mapValues(resultWindowed, function(v,k){
	return refineData(v, calcPhase);
});
//console.log("resultWindowedMean",resultWindowedMean);



function findMax(data){
	var m = [0,0];
	var id = 0;
	data.forEach(function(d, i){
		if(d[1] > m[1]){
			m = d;
			id = i;
		}
	});
	return id;
}
var maximumsIds = _.mapValues(resultWindowedMean,findMax);
var maximumsValues = _.mapValues(maximumsIds, function(v,k){
	return [ resultWindowedMean[k][v], resultWindowedPhase[k][v] ];
});
console.log("maximums", maximumsValues);

var plotF = gnuplot();
//plotF.set(colors);
//plotF.set({yrange:"[0:]"});
//plotF.set({logscale:"x 2"});
plotF.set({logscale:"y 10"});

plotF.plot(
	_.map(resultWindowedMean, function(v,k){
		return { title:k, data:v, /*style:"histeps linewidth 1.5"*/ };
	}).concat(_.map(maximumsValues,function(v,k){
		return {
			data:[ v[0] ],
			style:"points"
		}
	}))
);

var plotP = gnuplot();
//plotF.set(colors);
plotP.plot(
	_.map(resultWindowedPhase, function(v,k){
		return { title:k, data:v, /*style:"histeps linewidth 1.5"*/ };
	}).concat(_.map(maximumsValues,function(v,k){
		return {
			data:[ v[1] ],
			style:"points"
		}
	}))
);





