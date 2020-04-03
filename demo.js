let gnuplot = require("gnu-plot")
let utils = require("./utils")

let waves = require("./waves")

let dft = require(".")
let result = dft(waves)


let peak = dft.peak(result)
let peakText = {
	frequency: peak[0],
	magnitude: utils.dB.fromRatio(peak[1]) + "dB",
	phase    : peak[2],
}
console.log("peak:", peakText)

let plotF = gnuplot()
plotF.set({
	xlabel: "\"Hz\"",
	ylabel: "\"dB\"",
	logscale:"x 10",
})

plotF.plot([{
	data: result.map((d) =>
		[d[0], utils.dB.fromRatio(d[1])]
	),
},{
	title: "peak",
	style: "points",
	data: [
		[ peak[0], utils.dB.fromRatio(peak[1]) ]
	],
}])
