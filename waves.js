let utils = require("./utils")


let duration = 20; //s
let samplingRate = [50,200]; //Hz







function genSample(t, waves){
	let amplitudeSum = 0
	let s = waves.reduce(function(s, w){
		let amplitude = w.amplitude || 1
		amplitudeSum += amplitude
		return s + amplitude * w.fn(t)
	}, 0)
	return s / amplitudeSum
}
function genData(duration, freq, waves){
	let r = []
	for( let t=0; t<duration; t+=utils.mapTo(1/freq[0], 1/freq[1], Math.random()) ){
		r.push( [ t, genSample(t, waves) ] )
	}
	return r
}






// phase goes from 0 to 1
function genCosine(freq, phase){
	return function (t) {
		return Math.cos( Math.PI*2*( t*freq + phase ) )
	}
}

let data = genData(duration, samplingRate, [
	// { fn: (t) => (1), amplitude: 1},
	{ fn: genCosine(1/40, 0  ), amplitude:1 },
	{ fn: genCosine(1/20, 0  ), amplitude:1 },
	{ fn: genCosine(1   , 0.1), amplitude:0.5 },
])



// console.log(data)



module.exports = data
