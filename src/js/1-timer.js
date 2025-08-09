import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimeInput = document.getElementById('datetime-picker');
const startBtn = document.querySelector('[data-start]');
startBtn.disabled = true;

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    console.log(userSelectedDate);

    if (userSelectedDate < new Date()) {
      iziToast.warning({
        title: 'Warning',
        message: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 3000,
        pauseOnHover: true,
      });

      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
};

flatpickr(datetimeInput, options);

startBtn.addEventListener('click', () => {
  datetimeInput.disabled = true;
  startBtn.disabled = true;

  const intervalId = setInterval(() => {
    const timeDifference = userSelectedDate - new Date();

    if (timeDifference <= 0) {
      clearInterval(intervalId);
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      datetimeInput.disabled = false;
      return;
    }

    const time = convertMs(timeDifference);
    daysEl.textContent = addLeadingZero(time.days);
    hoursEl.textContent = addLeadingZero(time.hours);
    minutesEl.textContent = addLeadingZero(time.minutes);
    secondsEl.textContent = addLeadingZero(time.seconds);
  }, 1000);
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
