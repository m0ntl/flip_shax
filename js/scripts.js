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

var divIDs = ["clock","date","message","blinking-message"];
var marginDivIDs = ["top_div_spacer"];
var progressSpeeds = ["ff2","ff3","ff4","ff5","rw2","rw3","rw4","rw5"];
var ignoreKeys = ["Alt","F5","F11","F12","Shift","Control"];
var messageKeys = ["y","u","i","o","f","p","b","g","r","t","1","2","3","4","5","6","7","8","9","0"];

var audioCounter = 0;
var audio  = new Audio('sound/flip_sound.wav');
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

var matrixInterval;

var marginLeftCalc = 0;
// Array to hold normalized text month name
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
				hideClock();
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
				hideClock();
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
			case 'rw5':
				timeProgressRate = "rw6";
				break;
			case 'rw6':
				timeProgressRate = "rw7";
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
	} else if (e.key.toLowerCase() == "m") {
		// Increase font size for all clocks
		increaseFontSize();
	} else if (e.key.toLowerCase() == "j") {
		increaseTopMargin();
	} else if (e.key.toLowerCase() == "k") {
		decreaseTopMargin();
	} else if (e.key.toLowerCase() == "n") {
		// Decrease font size for all clocks
		decreaseFontSize();
	} else if (e.key.toLowerCase() == "a") {
		hideDate();
		//clockOnly = true;
		timeProgressRate = "ff";		
		rateChanged = true;
		dateHolder.setSeconds(43);
		dateHolder.setMinutes(59);
		dateHolder.setHours(6);
	} else if (messageKeys.includes(e.key.toLowerCase())) {
		// Display future message
		timeProgressRate = "paused";
		switch(e.key.toLowerCase()) {
			case 'p':
				showMessage("המפץ הגדול");
				break;
			case 'f':
				showMessage("העתיד");
				break;
			case 'b':
				showMessage("ניצוץ ראשון של חיים");
				break;
			case 'r':
				showMessage("עידן הזוחלים  התקופה הפרה-היסטורית");
				break;
			case 't':
				showMessage("היום");
				break;
			case 'g':
				document.getElementById("message").style.display = "none";
				blinkingText = true;
				showMessage("88:88:88");
				break;
			case '1':
				showMessage("עמרי רווה");
				break;
			case '2':
				showMessage("ינון כהן");
				break;
			case '3':
				showMessage("צ'יהירו טזורו");
				break;
			case '4':
				showMessage("מוסיקה: קובי שמואלי");
				break;
			case '5':
				showMessage("עיצוב תאורה: שחר מונטלייק");
				break;
			case '6':
				showMessage("בימוי: צבי סהר");
				break;
			case '7':
				showMessage("קליפ - אנימציה");
				break;
			case '8':
				showMessage("אנסמבל עיתים             Puppet Cinema");
				break;
			case '9':
				showMessage("itimensemble.com");
				break;
			case '0':
				showMessage("המשך יבוא");
				break;
			case 'y':
				showMessage("למחרת");
				break;
			case 'u':
				showMessage("Scene 2");
				break;
			case 'i':
				showMessage("Scene 3");
				break;
			case 'o':
				showMessage("Scene 4");
				break;				
			default:
				showMessage("Error displaying message: " + e.key);
				break;
		}
	} else if (e.key.toLowerCase() == "s") {
		muted = (muted == true ? false : true);
		playSound(audio);
	} else if (e.key == "[") {
		showMatrix();
	}  else if (e.key == "]") {
		hideMatrix();
	} else if (e.key.toLowerCase() == "c") {
		// Display counters
		timeProgressRate = "ff";
		clockOnly = false;
		showCounters();
		showDate();
		rateChanged = true;
	} else if (!ignoreKeys.includes(e.key)) {
		//alert("Unknown key pressed: " + e.key);
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
			addYears = -90;
		} else if (timeProgressRate == "rw6") {
			addYears = -150;
		} else if (timeProgressRate == "rw7") {
			addYears = -2004;
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
			writeMonths = "";
		} else {
			writeMonths = dateHolder.getMonth();
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
			document.getElementById("date").innerHTML = writeYears;

			if(dateHolder.getFullYear() < -269000 && timeProgressRate.startsWith("rw")) {		
				timeProgressRate = "paused";
				rateChanged = true;
			}
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
function hideClock() {
	document.getElementById("clock").style.display = "none";
}
function hideDate() {
	document.getElementById("date").style.display = "none";
	document.getElementById("clock").style.display = "block";

	document.getElementById("message").style.display = "none";
}
function hideBlinkingMessage() {
	document.getElementById("blinking-message").style.display = "none";
}
function hideTopDivSpacer() {
	document.getElementById("top_div_spacer").style.display = "none";
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

function hideMatrix() {
	clearInterval(matrixInterval);
	var canvas = document.getElementById("q");
	canvas.remove(); 

	showDate();
	showCounters();
}
function showMatrix() {
	hideDate()
	hideCounters();
	hideBlinkingMessage();
	hideTopDivSpacer();	

	document.getElementById("matrixCol").style.paddingLeft = "0px"; 
	document.getElementById("matrixCol").style.paddingRight = "0px"; 

	var screen = window.screen;

	var canvas = document.createElement("canvas");
	canvas.id = "q";
	var width = canvas.width = screen.width;
	var height = canvas.height = screen.height;

	canvas.style.paddingLeft  = "0 px";
	canvas.style.paddingRight  = "0 px";

	var matrixHolder = document.getElementById("matrixCol");
	matrixHolder.appendChild(canvas);

	var yPositions = Array(screen.height/2).join(0).split('');
	var ctx = canvas.getContext('2d');

	var draw = function () {
		ctx.fillStyle='rgba(0,0,0,.05)';
		ctx.fillRect(0,0,width,height);
		ctx.fillStyle='#0F0';
		ctx.font = '10pt Georgia';
		yPositions.map(function(y, index){
			text = String.fromCharCode(1e2+Math.random()*33);
			x = (index * 10)+10;
			canvas.getContext('2d').fillText(text, x, y);
			if(y > 100 + Math.random()*1e4) {
				yPositions[index]=0;
			} else {
				yPositions[index] = y + 10;
			}
		});
	};
	RunMatrix();
	function RunMatrix() {
		if(typeof matrixInterval != "undefined") clearInterval(matrixInterval);
		matrixInterval = setInterval(draw, 33);
	}
}
