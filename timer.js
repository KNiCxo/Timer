// Input elements for timer
hourInput = document.querySelector('.js-hour');
hourInput.value = '00';

minuteInput = document.querySelector('.js-minute');
minuteInput.value = '00';

secondInput = document.querySelector('.js-second');
secondInput.value ='00';

// Elements for +/- buttons
upDownButtons = document.querySelectorAll('.js-up-down');
hourAdd = document.querySelector('.js-add-hour');
hourSubtract = document.querySelector('.js-subtract-hour');
minuteAdd = document.querySelector('.js-add-minute');
minuteSubtract = document.querySelector('.js-subtract-minute');
secondAdd = document.querySelector('.js-add-second');
secondSubtract = document.querySelector('.js-subtract-second');

// Element for alarm sound notification
sound = document.querySelector('.js-sound');

// Button elements
startStopButton = document.querySelector('.js-start-stop');
resetButton = document.querySelector('.js-reset');

// Disables buttons so that valid input can be entered before starting timer
startStopButton.disabled = true;
resetButton.disabled = true;

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

// Ensures input is correct and formatted properly
const handleInput = (element, max) => {
  // If element is less than 10, add leading 0
  if (Number(element.value < 10)) {
    element.value = '0' + Number(element.value);
  } else {
    // Else remove leading zero
    element.value = Number(element.value);
  }

  // If input value is larger than max value, set to max value (i.e 45 --> 23)
  if (Number(element.value) > max) {
    element.value = max.toString();
  }

  // If input is cleared, adds '0' digit placeholder
  if (!element.value) {
    element.value = '00';
  }

  isEmpty();
};

// Disables buttons until there is a valid input
const isEmpty = () => {
  if (Number(hourInput.value) + Number(minuteInput.value) + Number(secondInput.value) > 0) {
    startStopButton.disabled = false;
    resetButton.disabled = false;
  } else {
    startStopButton.disabled = true;
    resetButton.disabled = true;
  }
}

// Increases element value by 1 or -1
const changeInput = (element, value) => {
  element.value = Number(element.value) + value;
}

// Main function of timer
const countDown = (hours, minutes, seconds) => {
  // Prevents timer from being adjusted unless reset or timer ends
  hours.readOnly = true;
  minutes.readOnly = true;
  seconds.readOnly = true;
  
  // Removes increase/decrease arrows from input
  hours.type = "text";
  minutes.type = "text";
  seconds.type = "text";

  // Decreases input width and removes buttons for cleaner look
  upDownButtons[0].classList.add('hide');
  upDownButtons[1].classList.add('hide');
  upDownButtons[2].classList.add('hide');
  hours.classList.add("running");
  minutes.classList.add("running");
  seconds.classList.add("running");

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

      // If time elapsed exceeds timer input, clear interval, change title, and play sound notification
      if ((totalTime - timeElapsed) <= 0) {
        clearInterval(intervalID);
        sound.innerHTML = '<audio autoplay loop src="alarm.mp3"></audio>';
        document.title = 'Time is up!';
      } else {
        // Else update timer elements with Math.trunc to remove decimal values
        console.log((totalTime - timeElapsed) / 1000);

        // Total Time Remaining / 1 Hour in Milliseconds = Hours Remaining
        hours.value = Math.trunc((totalTime - timeElapsed) / 3600000);

        // If hour input is less than 10, add leading 0
        if (Number(hours.value) < 10) {
          hours.value = '0' + hours.value;
        }

        // (Total Time Remaining / 1 Minute in Milliseconds) % 60 Minutes = Minutes Remaining
        minutes.value = Math.trunc(((totalTime - timeElapsed) / 60000) % 60);

        // If minute input is less than 10, add leading 0
        if (Number(minutes.value) < 10) {
          minutes.value = '0' + minutes.value;
        }

        // (Total Time Remaining / 1 Second) % 60 Seconds = Seconds Remaining
        seconds.value = Math.trunc(((totalTime - timeElapsed) / 1000) % 60);

        // If second input is less than 10, add leading 0
        if (Number(seconds.value) < 10) {
          seconds.value = '0' + seconds.value;
        }

        // Shows timer in title
        document.title = `${hours.value}:${minutes.value}:${seconds.value} - Timer`;
      }
    }, 1);
  } else {
    // Else, stops and store time remaining in timeBank
    if ((totalTime - timeElapsed) <= 0 ) {
      reset();
    } else {
      stop();
      timeBank = totalTime - timeElapsed;
      console.log(timeBank);
    }
  }
};

// Stops timer, changes stop button to 'Start', changes title, and removes sound
// notification (if it is playing)
function stop() {
  isOn = false;
  clearInterval(intervalID);
  startStopButton.innerHTML = 'Start';
  document.title = 'Timer';
  sound.innerHTML = '';
}

// Stops timer and sets it to 'fresh' state
function reset() {
  stop();

  // Clear input values
  hourInput.value = '00';
  minuteInput.value = '00';
  secondInput.value = '00';

  // Allow for values to be input again
  hourInput.readOnly = false;
  minuteInput.readOnly = false;
  secondInput.readOnly = false;

  // Add back increase/decrease arrows
  hourInput.type = "number";
  minuteInput.type = "number";
  secondInput.type = "number";

  // Increase width of input boxes and add back +/- buttons
  upDownButtons[0].classList.remove('hide');
  upDownButtons[1].classList.remove('hide');
  upDownButtons[2].classList.remove('hide');

  hourInput.classList.remove('running');
  minuteInput.classList.remove('running');
  secondInput.classList.remove('running');

  // Buttons are renabled
  startStopButton.disabled = true;
  resetButton.disabled = true;

  // timeBank is cleared and timer is now 'fresh'
  timeBank = 0;
  isFresh = true;
  console.log(timeBank);
}

// Checks if input exceeds maximum allowed values or is empty
hourInput.addEventListener('input', () => {
  handleInput(hourInput, 23);
  isEmpty();
});

minuteInput.addEventListener('input', () => {
  handleInput(minuteInput, 59);
  isEmpty();
});

secondInput.addEventListener('input', () => {
  handleInput(secondInput, 59);
  isEmpty();
});

// Functionality for +/- buttons
hourAdd.addEventListener('click', () => {
  changeInput(hourInput, 1);
  handleInput(hourInput, 23);
});

hourSubtract.addEventListener('click', () => {
  changeInput(hourInput, -1);
  handleInput(hourInput, 23);
});

minuteAdd.addEventListener('click', () => {
  changeInput(minuteInput, 1);
  handleInput(minuteInput, 59);
});

minuteSubtract.addEventListener('click', () => {
  changeInput(minuteInput, -1);
  handleInput(minuteInput, 59);
});

secondAdd.addEventListener('click', () => {
  changeInput(secondInput, 1);
  handleInput(secondInput, 59);
});

secondSubtract.addEventListener('click', () => {
  changeInput(secondInput, -1);
  handleInput(secondInput, 59);
});

startStopButton.addEventListener('click', () => {
  countDown(hourInput, minuteInput, secondInput);
});

resetButton.addEventListener('click', reset);