// Keeps track of update cycles for updating the clock intermittantly
var blinkingText = false;
var progressPacer = 0;
// Start time with real datetime
var timeProgressRate = "regular";
// For holding time calculations
var dateHolder = new Date();
var regularTimeDateHolder = new Date();
var secondsCounterRegularTimeProgress = 0;

// Variables to hold normalized text for sending to flipClock
var writeSecs, writeMinutes, writeHours, writeDays, writeMonths, writeYears;

var baseTimerTickInterval = 100;
var baseIntervalTimer = setInterval(baseTimer, baseTimerTickInterval);
var rateChanged = false;
// Variables to hold time changing speed
var addSeconds, addMinutes, addHours, addMonts, addYears;
var positiveYear = true;
var clockOnly = false;

var divIDs = ["clock","date","message"];
var marginDivIDs = ["top_div_spacer"];
var progressSpeeds = ["ff2","ff3","ff4","ff5","rw2","rw3","rw4","rw5"];
var ignoreKeys = ["Alt","F5","F11","F12","Shift"];
var messageKeys = ["f","F","p","P","b","B","g","G","r","R","t","T","1","2","3","4","5","6","7"];

var audioCounter = 0;
var audio = new Audio('sound/flip_sound.wav');
var audio1 = new Audio('sound/flip_sound.wav');
var audio2 = new Audio('sound/flip_sound.wav');
var audio3 = new Audio('sound/flip_sound.wav');
var audio4 = new Audio('sound/flip_sound.wav');
var audio5 = new Audio('sound/flip_sound.wav');
var audio6 = new Audio('sound/flip_sound.wav');
var audio7 = new Audio('sound/flip_sound.wav');
var audio8 = new Audio('sound/flip_sound.wav');
var audio9 = new Audio('sound/flip_sound.wav');
var audioVars = [audio, audio1, audio2, audio3, audio4, audio5, audio6, audio7, audio8, audio9];
var muted = true;

var marginLeftCalc = 0;
// Array to hold normalized text
var months = [
	'JAN',
	'FEB',
	'MAR',
	'APR',
	'MAY',
	'JUN',
	'JUL',
	'AUG',
	'SEP',
	'OCT',
	'NOV',
	'DEC'
];

window.addEventListener("keydown", function (e) {
	if(blinkingText) {
		blinkingText = false;
		document.getElementById("blinking-message").style.display = "none";
	}
	if (e.key == "ArrowRight") {
		switch(timeProgressRate) {
			case 'ff':
				timeProgressRate = "ff2";
				break;
			case 'ff2':
				timeProgressRate = "ff3";
				break;
			case 'ff3':
				timeProgressRate = "ff4";
				break;
			case 'ff4':
				timeProgressRate = "ff5";
				break;
			default:
				timeProgressRate = "ff";
				break;
		}
		rateChanged = true;
	} else if (e.key == "ArrowLeft") {
		switch(timeProgressRate) {
			case 'rw':
				timeProgressRate = "rw2";
				break;
			case 'rw2':
				timeProgressRate = "rw3";
				break;
			case 'rw3':
				timeProgressRate = "rw4";
				break;
			case 'rw4':
				timeProgressRate = "rw5";
				break;
			default:
				timeProgressRate = "rw";
				break;
		}
		rateChanged = true;
	} else if (e.key == "ArrowDown") {
		timeProgressRate = "paused";
		rateChanged = true;
	} else if (e.key == "ArrowUp") {
		timeProgressRate = "regular";
	} else if (e.key == "m" || e.key == "M") {
		// Increase font size for all clocks
		increaseFontSize();
	} else if (e.key == "j" || e.key == "J") {
		increaseTopMargin();
	} else if (e.key == "k" || e.key == "K") {
		decreaseTopMargin();
	} else if (e.key == "n" || e.key == "N") {
		// Decrease font size for all clocks
		decreaseFontSize();
	} else if (e.key == "a" || e.key == "A") {
		hideDate();
		//clockOnly = true;
		timeProgressRate = "ff";		
		rateChanged = true;
		dateHolder.setSeconds(43);
		dateHolder.setMinutes(59);
		dateHolder.setHours(6);
	} else if (messageKeys.includes(e.key)) {
		// Display future message
		timeProgressRate = "paused";
		switch(e.key.toLowerCase()) {
			case 'p':
				showMessage("The Big Bang");
				break;
			case 'f':
				showMessage("The Future");
				break;
			case 'b':
				showMessage("The Beginning of Life");
				break;
			case 'r':
				showMessage("Reptile Era");
				break;
			case 't':
				showMessage("Today");
				break;
			case 'g':
				document.getElementById("message").style.display = "none";
				blinkingText = true;
				showMessage("88:88:88");
				break;
			case '1':
				showMessage("Omri Raveh");
				break;
			case '2':
				showMessage("Yinon Cohen");
				break;
			case '3':
				showMessage("Chihiro Tazuro");
				break;
			case '4':
				showMessage("Kobe shmuely");
				break;
			case '5':
				showMessage("Shachar Montlake");
				break;
			case '6':
				showMessage("Zvi Sahar");
				break;
			case '7':
				showMessage("Hen David");
				break;
			default:
				showMessage("Error displaying message: " + e.key);
				break;
		}
	} else if (e.key == "s" || e.key == "S") {
		muted = (muted == true ? false : true);
		playSound(audio);
	} else if (e.key == "c" || e.key == "C") {
		// Display counters
		timeProgressRate = "ff";
		clockOnly = false;
		showCounters();
		rateChanged = true;
	} else if (!ignoreKeys.includes(e.key)) {
		alert("Unknown key pressed: " + e.key);
	}
})

function baseTimer() {
	if(timeProgressRate == "regular" && new Date().getSeconds() !== dateHolder.getSeconds()) {
		playSound(audio);
	} else if (progressSpeeds.includes(timeProgressRate)) {
		playSound(audioVars[audioCounter]);
		audioCounter++;
		if(audioCounter == 10) {audioCounter = 0;}
	}
	
	
	if(timeProgressRate == "regular") {
		// Regular time follows the computer clock
		// Get latest accurate time
		dateHolder = new Date();
	} else if(rateChanged) {
		if (timeProgressRate == "ff") {
			regularTimeDateHolder = new Date();
			secondsCounterRegularTimeProgress = regularTimeDateHolder.getSeconds();
			addSeconds = 1;
			addMinutes = null;
			addHours = null;
			addMonts = null;
			addYears = null;
		} else if (timeProgressRate == "ff2") {
			addSeconds = 2;
			addMinutes = 4;
			addHours = 4;
			addMonts = 1;
			addYears = 19;
		} else if (timeProgressRate == "ff3") {
			addYears = 29;
		} else if (timeProgressRate == "ff4") {
			addSeconds = 3;
			addMinutes = 6;
			addHours = 6;
			addYears = 41;
		} else if (timeProgressRate == "ff5") {
			addYears = 61;
		} else if (timeProgressRate == "rw") {
			regularTimeDateHolder = new Date();
			secondsCounterRegularTimeProgress = regularTimeDateHolder.getSeconds();
			addSeconds = -1;
			addMinutes = null;
			addHours = null;
			addMonts = null;
			addYears = null;
		} else if (timeProgressRate == "rw2") {
			addSeconds = -2;
			addMinutes = -4;
			addHours = -4;
			addMonts = -1;
			addYears = -19;
		} else if (timeProgressRate == "rw3") {
			addYears = -29;
		} else if (timeProgressRate == "rw4") {
			addSeconds = -3;
			addMinutes = -6;
			addHours = -6;
			addYears = -41;
		} else if (timeProgressRate == "rw5") {
			addYears = -61;
		} else if (timeProgressRate == "paused") {
			addSeconds = 0;
			addMinutes = 0;
			addHours = 0;
			addMonts = 0;
			addYears = 0;
		} else {
			alert("Error in timeProgressRate, unknown rate requested: " + timeProgressRate);
		}
		rateChanged = false;
	}
	
	if(timeProgressRate != "paused" && timeProgressRate != "regular") {
		// Convert seconds to double digits
		if(timeProgressRate == "ff" || timeProgressRate == "rw") {
			regularTimeDateHolder = new Date();
			if( secondsCounterRegularTimeProgress != regularTimeDateHolder.getSeconds()) {
				secondsCounterRegularTimeProgress = regularTimeDateHolder.getSeconds();
				dateHolder.setSeconds(dateHolder.getSeconds() + addSeconds)
				playSound(audio);
			}
		} else if(progressPacer % 2 == 0) {
			dateHolder.setSeconds(dateHolder.getSeconds() + addSeconds);	
		}

		//Add minutes
		if(addMinutes != null) {
			if(progressPacer % 2 == 0) {
				dateHolder.setMinutes(dateHolder.getMinutes() + addMinutes);	
			}
		}

		//Add house
		if(addHours != null) {
			if(progressPacer % 2 == 0) {
				dateHolder.setHours(dateHolder.getHours() + addHours);	
			}
		}

		//Add months
		if(addMonts != null) {
			if(progressPacer % 2 == 0) {
				dateHolder.setMonth(dateHolder.getMonth() + addMonts);	
			}
		}
		
		// Add years
		if(addYears != null) {
			dateHolder.setFullYear(dateHolder.getFullYear() + addYears);
		}
	}

	if(timeProgressRate != "paused") {
		// Convert date format to printable format
		writeSecs = dateHolder.getSeconds();
		if(writeSecs < 10) {
			writeSecs = "0" + writeSecs.toString();
		}
		
		writeMinutes = dateHolder.getMinutes();
		if(writeMinutes < 10) {
			writeMinutes = "0" + writeMinutes.toString();
		}
		
		writeHours = dateHolder.getHours();
		if(writeHours < 10) {
			writeHours = "0" + writeHours.toString();
		}

		writeDays = dateHolder.getDate();
		if(writeDays < 10) {
			writeDays = "0" + writeDays.toString();
		}

		if(dateHolder.getFullYear() < 0) {
			writeMonths = "BC";
		} else {
			writeMonths = months[dateHolder.getMonth()];
		}

		var tempYearString = "";
		writeYears = dateHolder.getFullYear();
		if (writeYears.toString().length < 4) {
			for (var i = 0; i < 4 - writeYears.toString().length; i++) {
				tempYearString = tempYearString + "0";
			}
			writeYears = tempYearString + writeYears;
		}

		if(dateHolder.getFullYear() < 0) {
			document.getElementById("date").innerHTML = writeMonths + "&nbsp;&emsp;" + writeYears;
		} else {
			document.getElementById("date").innerText =  writeDays + "/" + writeMonths + "/" + writeYears;
		}
		document.getElementById("clock").innerText = writeHours + ":" + writeMinutes + ":" + writeSecs;
	}
	// To keep track of rounds in case variable does not require updating every round
	progressPacer = progressPacer < 10 ? progressPacer + 1 : 0;
} 

function hideCounters() {
	document.getElementById("date").style.display = "none";
	document.getElementById("clock").style.display = "none";
}
function hideDate() {
	document.getElementById("date").style.display = "none";
	document.getElementById("clock").style.display = "block";

	document.getElementById("message").style.display = "none";
}
function showDate() {
	document.getElementById("date").style.display = "block";
	document.getElementById("clock").style.display = "block";

	document.getElementById("message").style.display = "none";
}
function showCounters() {
	document.getElementById("message").style.display = "none";

	document.getElementById("date").style.display = "block";
	document.getElementById("clock").style.display = "block";
}
function increaseFontSize(elementClassName) {
	for ( var i = 0; i < divIDs.length; i ++ ) {
		var el = document.getElementById(divIDs[i]);
		changeFontSize(el, 2);
	}
}
function decreaseFontSize() {
	for ( var i = 0; i < divIDs.length; i ++ ) {
		var el = document.getElementById(divIDs[i]);
		changeFontSize(el, -2);
	}
}
function increaseTopMargin() {
	for ( var i = 0; i < marginDivIDs.length; i ++ ) {
		var el = document.getElementById(marginDivIDs[i]);
		changeMarginTop(el, 2);
	}
}
function decreaseTopMargin() {
	for ( var i = 0; i < marginDivIDs.length; i ++ ) {
		var el = document.getElementById(marginDivIDs[i]);
		changeMarginTop(el, -2);
	}
}
function changeMarginTop(element, changedValue) {
	var style = window.getComputedStyle(element, null).getPropertyValue('padding-top');
	var paddingSize = parseFloat(style);
	element.style.paddingTop = (paddingSize + changedValue) + 'px';
}	

function changeFontSize(element, changedValue) {
	var style = window.getComputedStyle(element, null).getPropertyValue('font-size');
	var fontSize = parseFloat(style);
	element.style.fontSize = (fontSize + changedValue) + 'px';
}	
function playSound(audioElement) {
	if(!muted) {
		audioElement.play();
	}
}
function showMessage(messageText) {
	if(blinkingText) {
		document.getElementById("blinking-message").innerText = messageText;
		document.getElementById("blinking-message").style.display = "block";
	} else {
		document.getElementById("message").innerText = messageText;
		document.getElementById("message").style.display = "block";
	}
	document.getElementById("date").style.display = "none";
	document.getElementById("clock").style.display = "none";
}