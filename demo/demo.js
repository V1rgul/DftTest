let gnuplot = require("gnu-plot")
let utils = require("../src/utils")
let waves = require("./waves")

let dft = require("..")

let data = waves({
	duration: 10,
	samplingRate: [50,200],
	waves: [
		(t) =>  0.5 * waves.cosine(  2, 0)(t),
		(t) =>  0.2 * waves.cosine( 10, 0)(t),
	],
})

let result = dft(data)

let peaks = [dft.peak(result)]

peaks.forEach(function (p, id){
	console.log(
		"Peak #"+id,
		"\n\tFrequency:", p[0], "Hz",
		"\n\tMagnitude:", p[1],
		"\n\tPhase    :", p[2], "rad",
	)
})

let plotF = gnuplot()
plotF.set({
	xlabel: "\"Frequency (Hz)\"",
	ylabel: "\"Magnitude\"",
	logscale:"x 10",
}).plot([
	{
		data: result,
	},{
		title: "peak",
		style: "points",
		data: peaks,
	}
])
