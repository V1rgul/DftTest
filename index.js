let  _ = require('lodash')
let utils = require("./utils"), plot = require("./plot")



// waves: [{freq, offset, amplitude}]
function genSample(t, waves){
	let amplitudeSum = 0
	let s = waves.reduce(function(s, w){
		let amplitude = w.amplitude || 1
		amplitudeSum += amplitude
		return s + Math.cos(Math.PI*2*(t*w.freq+w.offset))*amplitude
	}, 0)
	return s / amplitudeSum
}
function genData(duration, freq, waves){
	let r = []
	for( let t=0; t<duration; t+=utils.map( Math.random(), [0,1], [1/freq[0], 1/freq[1]]) ){
		r.push( [ t, genSample(t, waves) ] )
	}
	return r
}


let duration = 20; //s
let samplingRate = [5,200]; //Hz

let data = genData(duration, samplingRate, [
	{ freq:1/40, offset:0  , amplitude:1  },
	{ freq:1/20, offset:0  , amplitude:1  },
	{ freq:1   , offset:0.1, amplitude:.5 },
])

let windowFn = require("./windowFn")

function dftDoWindow(data, fn){
	return data.map(function(d){
		let normT = d[0]/duration
		return [ d[0], d[1]*fn(normT) ]
	})
}

let dataWindowed = _.mapValues(windowFn, function(v,k){
	return dftDoWindow(data, v)
})




plot.plotWindows( _.map(dataWindowed, function(v,k){
	return {title:k, data:v}
}) )



function cSample(t, f){
	c = t * Math.PI * 2 * f
	return [ Math.cos(c), -Math.sin(c) ]
}


function correlate(data, f){
	return data.reduce(function(s,d){
		let cSamples = cSample(d[0], f)
		s[0] += cSamples[0]*d[1]/data.length
		s[1] += cSamples[1]*d[1]/data.length
		return s
	}, [0,0])
}

let minF = 0.5;//1 / duration
let maxF = 2;//samplingRate / 2
let stepF = 0.01

function dft(d){
	let r = []
	for(let f=minF; f<maxF; f+=stepF){
		let corr = correlate(d, f)
		//let v = Math.sqrt(Math.pow(corr[0], 2) + Math.pow(corr[1], 2)) / d.length
		r.push([f, corr])
	}
	return r
}



let resultWindowed = _.mapValues(dataWindowed, function(v,k){
	return dft(v, k)
})

function calcMean (d){ return Math.hypot(d[0], d[1]); }
function calcPhase(d){ return Math.atan2(d[1], d[0])/(Math.PI*2); }

function refineData(data, fn){
	return data.map(function(d){
		return [d[0], fn(d[1])]
	})
}

let resultWindowedMean = _.mapValues(resultWindowed, function(v,k){
	return refineData(v, calcMean)
})
let resultWindowedPhase = _.mapValues(resultWindowed, function(v,k){
	return refineData(v, calcPhase)
})
//console.log("resultWindowedMean",resultWindowedMean)



function findMax(data){
	let m = [0,0]
	let id = 0
	data.forEach(function(d, i){
		if(d[1] > m[1]){
			m = d
			id = i
		}
	})
	return id
}
let maximumsIds = _.mapValues(resultWindowedMean,findMax)
let maximumsValues = _.mapValues(maximumsIds, function(v,k){
	return [ resultWindowedMean[k][v], resultWindowedPhase[k][v] ]
})
console.log("maximums", maximumsValues)


plot.plotFreq(
	_.map(resultWindowedMean, function(v,k){
		return { title:k, data:v, /*style:"histeps linewidth 1.5"*/ }
	}),
	_.map(maximumsValues,function(v,k){
		return {
			data:[ v[0] ],
			style:"points"
		}
	})
)


plot.plotPhase(
	_.map(resultWindowedPhase, function(v,k){
		return { title:k, data:v, /*style:"histeps linewidth 1.5"*/ }
	}),
	_.map(maximumsValues,function(v,k){
		return {
			data:[ v[1] ],
			style:"points"
		}
	})
)




