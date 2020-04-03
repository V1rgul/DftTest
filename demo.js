let gnuplot = require("gnu-plot")
let utils = require("./utils")

let waves = require("./waves")

let dft = require(".")
let result = dft(waves)

let plotF = gnuplot()
plotF.set({
	xlabel: "\"Hz\"",
	ylabel: "\"dB\"",
	logscale:"x 10",
})
plotF.plot([{
	data: result.map((d) => [d[0], utils.dB.fromRatio(d[1])]),
}])
