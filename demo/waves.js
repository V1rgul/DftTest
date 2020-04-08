let utils = require("../src/utils")


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

function main(options){
	return genData(
		options.duration,
		options.samplingRate,
		options.waves
	)
}
utils.assign(main, {
	cosine: genCosine,
})

module.exports = main
