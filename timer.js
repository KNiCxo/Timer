hourInput = document.querySelector('.js-hour');
hourInput.value = '0';

minuteInput = document.querySelector('.js-minute');
minuteInput.value = '0';

secondInput = document.querySelector('.js-second');
secondInput.value = '0';

const setMax = (element, number) => {
  element.value = Number(element.value);

  if (Number(element.value) > number) {
    element.value = number.toString();
  }

  if (!element.value) {
    element.value = '0';
  }
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