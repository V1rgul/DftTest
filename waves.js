let utils = require("./utils")


let duration = 10; //s
let samplingRate = [50,200]; //Hz







function genSample(t, waves){
	let s = waves.reduce(function(s, w){
		return s + w(t)
	}, 0)
	return s
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
	(t) => utils.dB.toRatio( -2) * genCosine(  2, 0)(t),
	(t) => utils.dB.toRatio(-10) * genCosine( 10, 0)(t),
])



// console.log(data)



module.exports = data
