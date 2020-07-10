// Keeps track of update cycles for updating the clock intermittantly
var progressPacer = 0;
// Start time with real datetime
var timeProgressRate = "regular";
// For holding time calculations
var dateHolder = new Date();
var secondElement, minuteElement, hourElement, dayElement, monthElement, yearElement;

// Variables to hold normalized text for sending to flipClock
var writeSecs, writeMinutes, writeHours, writeDays, writeMonths, writeYears;

var baseTimerTickInterval = 100;
var baseIntervalTimer = setInterval(baseTimer, baseTimerTickInterval);

// Variables to hold time changing speed
var addSeconds, addMinutes, addHours, addMonts, addYears;

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
	if (e.key == "ArrowRight") {
		switch(timeProgressRate) {
			case 'ff':
				timeProgressRate = "ff2";
				break;
			case 'ff2':
				timeProgressRate = "ff3";
				break;
			default:
				timeProgressRate = "ff";
				break;
		}
	} else if (e.key == "ArrowLeft") {
		switch(timeProgressRate) {
			case 'rw':
				timeProgressRate = "rw2";
				break;
			case 'rw2':
				timeProgressRate = "rw3";
				break;
			default:
				timeProgressRate = "rw";
				break;
		}
	} else if (e.key == "ArrowDown") {
		timeProgressRate = "paused";
	} else if (e.key == "ArrowUp") {
		timeProgressRate = "regular";
		showDay();
	} else if (e.key == "m" || e.key == "M") {
		// Increase font size for all clocks
		increaseFontSize(".tick_font_6");
		increaseFontSize(".tick_font_7");
		increaseFontSize(".tick_font_10");
	} else if (e.key == "n" || e.key == "N") {
		// Decrease font size for all clocks
		decreaseFontSize(".tick_font_6");
		decreaseFontSize(".tick_font_7");
		decreaseFontSize(".tick_font_10");
	} else if (e.key == "f" || e.key == "F") {
		// Display future message
		timeProgressRate = "paused";
		hideCounters();
		document.getElementById("past-message").style.display = "none";
		document.getElementById("future-message").style.display = "block";
		hideDay();
	} else if (e.key == "p" || e.key == "P") {
		// Display past message
		timeProgressRate = "paused";
		hideCounters();
		hideDay();
		document.getElementById("future-message").style.display = "none";
		document.getElementById("past-message").style.display = "block";
	} else if (e.key == "c" || e.key == "C") {
		// Display counters
		showCounters();
	} else if (e.key != "Alt" && e.key != "F5" && e.key != "F11" && e.key != "F12") {
		alert("Unknown key pressed: " + e.key);
	}
})

function baseTimer() {

	if(timeProgressRate == "regular") {
		// Regular time follows the computer clock
		// Get latest accurate time
		dateHolder = new Date();
	} else if (timeProgressRate == "ff") {
		addSeconds = 1;
		addMinutes = 3;
		addHours = 3;
		addMonts = 1;
		addYears = 11;
	} else if (timeProgressRate == "ff2") {
		addSeconds = 2;
		addMinutes = 4;
		addHours = 4;
		addYears = 19;
	} else if (timeProgressRate == "ff3") {
		addYears = 29;
	} else if (timeProgressRate == "rw") {
		addSeconds = -1;
		addMinutes = -3;
		addHours = -3;
		addMonts = -1;
		addYears = -11;
	} else if (timeProgressRate == "rw2") {
		addSeconds = -2;
		addMinutes = -4;
		addHours = -4;
		addYears = -19;
	} else if (timeProgressRate == "rw3") {
		addYears = -29;
	} else if (timeProgressRate == "paused") {
		addSeconds = 0;
		addMinutes = 0;
		addHours = 0;
		addMonts = 0;
		addYears = 0;
	} else {
		alert("Error in timeProgressRate, unknown rate requested: " + timeProgressRate);
	}
	
	if(timeProgressRate != "paused" && timeProgressRate != "regular") {
		// Convert seconds to double digits
		if(progressPacer % 2 == 0) {
			dateHolder.setSeconds(dateHolder.getSeconds() + addSeconds);	
		}

		//Add minutes
		if(progressPacer % 2 == 0) {
			dateHolder.setMinutes(dateHolder.getMinutes() + addMinutes);	
		}

		//Add house
		if(progressPacer % 2 == 0) {
			dateHolder.setHours(dateHolder.getHours() + addHours);	
		}

		//Add months
		if(progressPacer % 2 == 0) {
			dateHolder.setMonth(dateHolder.getMonth() + addMonts);	
		}
		
		// Add years
		dateHolder.setFullYear(dateHolder.getFullYear() + addYears);
	}
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
		writeMonths = " BC";
		hideDay();
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

	// Update flipClock
	secondTickHandler(secondElement, writeSecs);
	minuteTickHandler(minuteElement, writeMinutes);
	hourTickHandler(hourElement, writeHours);
	dayTickHandler(dayElement, writeDays);
	monthTickHandler(monthElement, writeMonths);	
	yearTickHandler(yearElement, writeYears);	

	// To keep track of rounds in case variable does not require updating every round
	progressPacer = progressPacer < 10 ? progressPacer + 1 : 0;

	
} 

function secondTickHandler(tick, calcSecond) {
	tick.value = calcSecond;
}
function minuteTickHandler(tick, calcMinute) {
	tick.value = calcMinute;
}
function hourTickHandler(tick, calcHour) {
	tick.value = calcHour;
}
function dayTickHandler(tick, calcDay) {
	tick.value = calcDay;
}
function monthTickHandler(tick, calcMonth) {
	tick.value = calcMonth;
}
function yearTickHandler(tick, calcYear) {
	tick.value = calcYear;
}

function readElements() {
	//Find elements to update
	var second = document.querySelector('#secondID');
	var minute = document.querySelector('#minuteID');
	var hour = document.querySelector('#hourID');
	var day = document.querySelector('#dayID');
	var month = document.querySelector('#monthID');
	var year = document.querySelector('#yearID');
	
	//Retreive Tick Objects
	secondElement = Tick.DOM.find(second);
	minuteElement = Tick.DOM.find(minute);
	hourElement = Tick.DOM.find(hour);
	dayElement = Tick.DOM.find(day);
	monthElement = Tick.DOM.find(month);
	yearElement = Tick.DOM.find(year);
}
function hideDay() {
		document.getElementById("dayID").style.display = "none";
}
function showDay() {
		document.getElementById("dayID").style.display = "block";
}
function hideCounters() {
	document.getElementById("secondID").style.display = "none";
	document.getElementById("minuteID").style.display = "none";
	document.getElementById("hourID").style.display = "none";
	document.getElementById("dayID").style.display = "none";
	document.getElementById("monthID").style.display = "none";
	document.getElementById("yearID").style.display = "none";
	document.getElementById("colon1").style.display = "none";
	document.getElementById("colon2").style.display = "none";
}
function showCounters() {
	document.getElementById("future-message").style.display = "none";
	document.getElementById("past-message").style.display = "none";

	document.getElementById("secondID").style.display = "block";
	document.getElementById("minuteID").style.display = "block";
	document.getElementById("hourID").style.display = "block";
	document.getElementById("monthID").style.display = "block";
	document.getElementById("yearID").style.display = "block";
	document.getElementById("colon1").style.display = "block";
	document.getElementById("colon2").style.display = "block";
	if(dateHolder.getFullYear() >= 0) {
		showDay();
	}
	
}
function increaseFontSize(elementClassName) {
		var el = document.querySelectorAll(elementClassName);
		changeFontSize(el, 2);
}
function decreaseFontSize(elementClassName) {
		var el = document.querySelectorAll(elementClassName);
		changeFontSize(el, -2);
}

function changeFontSize(elementColloction, changedValue) {
		for ( var i = 0; i < elementColloction.length; i ++ ) {
		var style = window.getComputedStyle(elementColloction[i], null).getPropertyValue('font-size');
		var fontSize = parseFloat(style);
		elementColloction[i].style.fontSize = (fontSize + changedValue) + 'px';
	}
}	