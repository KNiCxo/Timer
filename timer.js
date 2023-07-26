// Input elements for timer
hourInput = document.querySelector('.js-hour');
hourInput.value = '0';

minuteInput = document.querySelector('.js-minute');
minuteInput.value = '0';

secondInput = document.querySelector('.js-second');
secondInput.value ='3';

// Element for alarm sound notification
sound = document.querySelector('.js-sound');

// Button elements
startStopButton = document.querySelector('.js-start-stop');
resetButton = document.querySelector('.js-reset');

// Used to check if timer is running
let isOn = false;

// Used to check if timer is running for the first time or has been freshly reset
let isFresh = true;

// Keeps ID of setInterval function for clearing
let intervalID;

// Stores total time in ms for countdown
let totalTime = 0;

// Stores time elapsed while timer is running
let timeElapsed = 0;

// Saves remaining time for when timer is paused
let timeBank = 0;

const setMax = (element, max) => {
  // Clears '0' digit placeholder with value that was input
  element.value = Number(element.value);

  // If input value is larger than max value, set to max value (i.e 45 --> 23)
  if (Number(element.value) > max) {
    element.value = number.toString();
  }

  // If input is cleared, adds '0' digit placeholder
  if (!element.value) {
    element.value = '0';
  }
};

// Main function of timer
const countDown = (hours, minutes, seconds) => {
  // Prevents timer from being adjusted unless reset or timer ends
  hours.readOnly = true;
  minutes.readOnly = true;
  seconds.readOnly = true;
  
  // If timer is not running, make the start button say 'Stop' and begin the timer function
  if (!isOn) {
    isOn = true;
    startStopButton.innerHTML = 'Stop';
    
    // If timer is 'fresh' take time values from input, add 0.5s delay, and convert to milliseconds
    if (isFresh) {
      totalTime = ((Number(hours.value) * 3600) + (Number(minutes.value) * 60) + Number(seconds.value) + 0.5) * 1000;
      isFresh = false; // Timer no longer 'fresh'
    } else {
      // Else, use the time remaining
      totalTime = timeBank; 
    }

    // Get current time to compare between each interval
    let startTime = Date.now();

    // Gets time elapsed every 1ms and updates timer elements
    intervalID = setInterval(() => {
      timeElapsed = Date.now() - startTime;
      //timeElapsed += 2000;

      // If time elapsed exceeds timer input, clear interval and play sound notification
      if ((totalTime - timeElapsed) <= 0) {
        clearInterval(intervalID);
        sound.innerHTML = '<audio autoplay loop src="alarm.mp3"></audio>';
      } else {
        // Else update timer elements with Math.trunc to remove decimal values
        console.log((totalTime - timeElapsed) / 1000);

        // Total Time Remaining / 1 Hour in Milliseconds = Hours Remaining
        hours.value = Math.trunc((totalTime - timeElapsed) / 3600000);

        // (Total Time Remaining / 1 Minute in Milliseconds) % 60 Minutes = Minutes Remaining
        minutes.value = Math.trunc(((totalTime - timeElapsed) / 60000) % 60);

        // (Total Time Remaining / 1 Second) % 60 Seconds = Seconds Remaining
        seconds.value = Math.trunc(((totalTime - timeElapsed) / 1000) % 60);
      }
    }, 1);
  } else {
    // Else, stops and store time remaining in timeBank
    stop()
    timeBank = totalTime - timeElapsed;
    console.log(timeBank);
  }
};

// Stops timer and changes stop button to 'Start'
function stop() {
  isOn = false;
  clearInterval(intervalID);
  startStopButton.innerHTML = 'Start';
}

// Checks if input exceeds maximum allowed values
hourInput.addEventListener('input', () => {
  setMax(hourInput, 23);
});

minuteInput.addEventListener('input', () => {
  setMax(minuteInput, 59);
});

secondInput.addEventListener('input', () => {
  setMax(secondInput, 59);
});

startStopButton.addEventListener('click', () => {
  countDown(hourInput, minuteInput, secondInput);
})