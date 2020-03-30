let  _ = require('lodash')
let utils = require("./utils"), plot = require("./plot")



let windowFn = require("./windowFn")

function dftDoWindow(data, fn){
	return data.map(function(d){
		let normT = d[0] / duration
		return [ d[0], d[1]*fn(normT) ]
	})
}


let waves = require("./waves")
let duration = waves[waves.length-1][0]

let dataWindowed = _.mapValues(windowFn, function(v,k){
	return dftDoWindow(waves, v)
})

// console.log(dataWindowed)

plot.plotWindows( _.map(dataWindowed, function(v,k){
	return {title:k, data:v}
}) )



function cSample(t, f){
	c = t * Math.PI * 2 * f
	return [ Math.cos(c), -Math.sin(c) ]
}


function correlate(data, f){
	// console.log("correlate", f, data)
	return data.reduce(function(s,d){
		let cSamples = cSample(d[0], f)
		s[0] += cSamples[0]*d[1]/data.length
		s[1] += cSamples[1]*d[1]/data.length
		return s
	}, [0,0])
}


let dftMinF = 0.5 //1 / duration
let dftMaxF = 2 //samplingRate / 2
let dftStepF = 0.01

function dft(d){
	let r = []
	for(let f=dftMinF; f<dftMaxF; f+=dftStepF){
		let corr = correlate(d, f)
		//let v = Math.sqrt(Math.pow(corr[0], 2) + Math.pow(corr[1], 2)) / d.length
		r.push([f, corr])
	}
	return r
}
let resultWindowed = _.mapValues(dataWindowed, function(v,k){
	// console.log(k)
	return dft(v, k)
})




function calcMean (d){ return Math.hypot(d[0], d[1]); }
function calcPhase(d){ return Math.atan2(d[1], d[0])/(Math.PI*2); }

function refineData(data, fn){
	return data.map(function(d){
		// console.log("refine", "t:", "d:", d[1], "->", fn(d[1]))
		return [d[0], fn(d[1])]
	})
}

let resultWindowedMean = _.mapValues(resultWindowed, function(v,k){
	return refineData(v, calcMean)
})
let resultWindowedPhase = _.mapValues(resultWindowed, function(v,k){
	return refineData(v, calcPhase)
})
// console.log("resultWindowedMean",JSON.stringify(resultWindowedMean) )



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




