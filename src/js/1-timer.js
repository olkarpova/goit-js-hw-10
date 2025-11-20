import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";  // щоб підключити стилі

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const refs = {
    startBtn: document.querySelector("[data-start]"),
    input: document.querySelector("#datetime-picker"),

    daysEl: document.querySelector("[data-days]"),
    hoursEl: document.querySelector("[data-hours]"),
    minutesEl: document.querySelector("[data-minutes]"),
    secondsEl: document.querySelector("[data-seconds]"),
};
console.log("JS підключений!")

refs.startBtn.disabled = true;  // неактивна при старті

let userSelectedDate = null;
let timerId = null;


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];

        if (selectedDate <= new Date()) {
            refs.startBtn.disabled = true;
            iziToast.error({
                title: 'Error',
                message: "Please choose a date in the future",
                position: 'topRight'
            });
            return;
        }
        userSelectedDate = selectedDate;
        refs.startBtn.disabled = false;
  },
};

flatpickr("#datetime-picker", options);

const timer = {
    intervalId: null,
    isActive: false,

    start() {
        if (this.isActive || !userSelectedDate) return;
        this.isActive = true;

        const initTime = userSelectedDate;

        this.intervalId = setInterval(() => {
            const currentTime = new Date();
            const diffMS = initTime - currentTime;
            if (diffMS <= 0) {
                clearInterval(this.intervalId);
                this.isActive = false;
                refs.daysEl.textContent = "00";
                refs.hoursEl.textContent = "00";
                refs.minutesEl.textContent = "00";
                refs.secondsEl.textContent = "00";
                refs.input.disabled = false;
                return;
            }

            const result = convertMs(diffMS);

            refs.daysEl.textContent = addLeadingZero(result.days);
            refs.hoursEl.textContent = addLeadingZero(result.hours);
            refs.minutesEl.textContent = addLeadingZero(result.minutes);
            refs.secondsEl.textContent = addLeadingZero(result.seconds);
            
        }, 1000);

        

    },
};

refs.startBtn.addEventListener('click', () => {
    timer.start();
    refs.input.disabled = true;
    refs.startBtn.disabled = true;
});

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}




