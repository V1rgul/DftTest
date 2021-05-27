let gnuplot = require("gnu-plot")
let utils = require("../src/utils")

let dft = require("..")

let CONFIG = {
	duration: 1000,
	samplingRate: [10,10],
}

console.log(CONFIG)


function randomGauss(){
	// https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
	// http://www.dspguide.com/ch2/6.htm
	let radius = Math.sqrt( -2 * Math.log( Math.random() ))
	let angle = 2 * Math.PI * Math.random()
	let value = radius * Math.cos( angle )
	return value
}

let data = []
for( let t=0; t<CONFIG.duration; t+=utils.mapTo(1/CONFIG.samplingRate[0], 1/CONFIG.samplingRate[1], Math.random()) ){

	// let sample = 50 * randomGauss()
	let sample = Math.random() - .5
	data.push( [ t, sample ] )
}


let result = dft(data)

let sumAmplitude = result.reduce( (acc, d) => (acc + d[1]), 0 )
let meanAmplitude =  sumAmplitude / result.length
console.log("mean Amplitude : ", meanAmplitude)

let resultConverted = result.map((e) => [
	e[0],
	utils.dB.fromRatio(e[1]),
	(e[2]+Math.PI) / (Math.PI*2), // convert to turns,  [0;1]
])


let plotD = gnuplot()
plotD.set({
	xlabel: "\"Time (s)\"",
	ylabel: "\"Value\"",
}).plot([
	{
		data: data,
	}
])

let plotF = gnuplot()
plotF.set({
	xlabel: "\"Frequency (Hz)\"",
	ylabel: "\"Magnitude (dB)\"",
	logscale:"x 10",
}).plot([
	{
		data: resultConverted,
	}
])
