Dft-Easy
===============================================
Discrete Fourrier Transform made easy

## example
```js
let utils = require("./utils")
let data = [
	[0.00,  1],
	[0.25,  0],
	[0.50, -1],
	[0.75,  0],
]
let dftResult = require("dft-easy")(data)

require("gnu-plot").plot([{
	data: dftResult,
	xlabel: "\"Frequency (Hz)\"",
	ylabel: "\"Magnitude\"",
	logscale:"x 10",
}])
```
For exemples using realistic data please see:  
 - Linear scale: [demo.js](demo/demo.js)  
 - Logarithmic scale: [demo_dB.js](demo/demo_dB.js)  

# methods

## dft(data, options)
execute dft

### return
result formatted as 
```js
[
	[frequency0, frequency0Magnitude, frequency0Phase],
	[frequency1, frequency1Magnitude, frequency1Phase],
	...
]
```

### data
data formatted as 
```js
[
	[sample0Time, sample0Amplitude],
	[sample1Time, sample1Amplitude],
	...
]
```

### options
See constructOptions()

## constructOptions(options, data)

### options.window(t)
*default: dft.windows.Taylor()*  
Function taking t from 0->1 and returning a multiplication factor 
integral(window(t), 0, 1) should be equal to 1 
you can provide your own window function or pick one from this list : 
```js
[ Box, Triangular, Welch , Hann, Hamming, Blackman, Nuttal, BlackmanNuttal, BlackmanHarris, FlatTop , Taylor , Tukey ]
```
(Please note that some are configurable)

### options.start
*default: minimum data[0]*  
lowest time in data. 
Used to calculate automatic options.duration 

### options.end
*default: maximum data[0]*  
highest time in data. 
Used to calculate automatic options.duration 

### options.duration
*default: maximum data[0] - minimum data[0]*  
duration of data list 
Used to calculate automatic minimum frequency 

### options.frequencies 
*default: {}*  
List of frequencies to correlate data against 
You can provide an Array of frequencies, or options to generate one 

#### options.frequencies using generator  

##### options.frequencies.min
*default: 1/options.duration.duration*  
maximum frequency of the dft 

##### options.frequencies.max 
*default: (1/options.timeDelta.min) / 2*  
minimum frequency of the dft 

##### options.frequencies.number 
*default: 4096*  
number of equally spaced points (at log options.frequencies.logBase) 

##### options.frequencies.logBase
*default: 10*  
base of the logarithmic spacing of frequencies 

##### options.frequencies.list
*default: <Array containining options.frequencies.number frequencies in [options.frequencies.min, options.frequencies.max] equally spaced in a logarithmic space of base options.frequencies.logBase>* 
Array of frequencies where the dft will calculate the Magnitude and Phase

## dft.peak(dftResult)
Utility to find Magnitude peak in dftResult 
returns [frequency, magnitude] 

### dftResult
result returned from dft
