let utils = require("./utils")


function doWindow(options, data){
	let dataStart = data[0][0], dataEnd = data[data.length-1][0]
	return data.map(function(d){
		let normalizedT = utils.mapFrom(dataStart, dataEnd, d[0])
		return [ d[0], d[1]*options.window(normalizedT) ]
	})
}


function cSample(t, f){
	c = t * Math.PI * 2 * f
	return [ Math.cos(c), -Math.sin(c) ]
}
function correlate(data, f){
	// console.log("correlate", f, data)
	return data.reduce(
		function(s,d){
			let cSamples = cSample(d[0], f)
			s[0] += cSamples[0]*d[1]
			s[1] += cSamples[1]*d[1]
			return s
		},
		[0,0]
	).map( d =>
		2 * d / data.length
	)
}

function calcMagnitude (d){ return Math.hypot(d[0], d[1]) }
function calcPhase     (d){ return Math.atan2(d[1], d[0]) }

// allowing to not calculate phase does not provide a significant perf increase : https://jsperf.com/dftcalcphase
function doDft(options, data){
	return options.frequencies.list.map(function(f){
		let corr = correlate(data, f)
		return [f, calcMagnitude(corr), calcPhase(corr)]
	})
}

module.exports = {
	doWindow,
	doDft
}
