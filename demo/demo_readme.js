let data = [
	[0.00,  1],
	[0.25,  0],
	[0.50, -1],
	[0.75,  0],
	[1.00,  1],
	[1.25,  0],
	[1.50, -1],
	[1.75,  0],
]
let dftResult = require("../")(data)
require("gnu-plot")().plot([ {data: dftResult} ])

let dftResult2 = require("../")(data, {frequencies:{list:[0.5,1,2]}})
console.log(dftResult2)
