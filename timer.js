sound = document.querySelector('.js-sound');

hourInput = document.querySelector('.js-hour');
hourInput.value = '0';

minuteInput = document.querySelector('.js-minute');
minuteInput.value = '0';

secondInput = document.querySelector('.js-second');
secondInput.value ='3';

startStopButton = document.querySelector('.js-start-stop');
resetButton = document.querySelector('.js-reset');

// Used to check if timer is running
let isOn = false;

// Keeps ID of setInterval function for clearing
let intervalID;

// Stores total time elapsed for when timer is paused
let timeBank = 0;

// Stores time elapsed while timer is running
let timeElapsed = 0;

const setMax = (element, number) => {
  element.value = Number(element.value);

  if (Number(element.value) > number) {
    element.value = number.toString();
  }

  if (!element.value) {
    element.value = '0';
  }
};

const countDown = (hours, minutes, seconds) => {
  hours.readOnly = true;
  minutes.readOnly = true;
  seconds.readOnly = true;

  let totalTime = ((Number(hours.value) * 3600) + (Number(minutes.value) * 60) + Number(seconds.value) + 0.5) * 1000;
  let startTime = Date.now();
  intervalID = setInterval(() => {
    timeElapsed = Date.now() - startTime;
    //timeElapsed += 2000;
    if ((totalTime - timeElapsed) <= 0) {
      clearInterval(intervalID);
      sound.innerHTML = '<audio autoplay src="alarm.mp3"></audio>';
    } else {
      console.log((totalTime - timeElapsed) / 1000);
      hours.value = Math.floor((totalTime - timeElapsed) / 3600000);
      minutes.value = Math.floor((((totalTime - timeElapsed) / 1000) / 60) % 60);
      seconds.value = Math.trunc(((totalTime - timeElapsed) / 1000) % 60);
    }
  }, 1);
};


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