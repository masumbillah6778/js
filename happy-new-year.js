const newYear = "1 Jan 2025"
const timerDays = document.querySelector("#days");
const timerHours = document.querySelector("#hours");
const timerMinutes = document.querySelector("#minutes");
const timerSeconds = document.querySelector("#seconds");

function christmasCountdown() {
    const newYearDate = new Date(newYear);
    const nowDate = new Date();
    const countdown = (newYearDate - nowDate);

    // Values of timer
    const seconds = Math.floor((countdown / 1000) % 60);
    const minutes = Math.floor((countdown / 1000 / 60) % 60);
    const hours = Math.floor((countdown / 1000 / 60 / 60) % 24);
    const days = Math.floor(countdown / 1000 / 60 / 60 / 24);

    // Function to add leading zero if necessary
    function addLeadingZero(value) {
        return value < 10 ? `0${value}` : value.toString();
    }

    // Add leading zeros to the variables
    const formattedSeconds = addLeadingZero(seconds);
    const formattedMinutes = addLeadingZero(minutes);
    const formattedHours = addLeadingZero(hours);
    const formattedDays = addLeadingZero(days);

    // Timer display
    timerDays.innerText = formattedDays;
    timerHours.innerText = formattedHours;
    timerMinutes.innerText = formattedMinutes;
    timerSeconds.innerText = formattedSeconds;

    console.log(days, hours, minutes, seconds);

}

christmasCountdown();

setInterval(christmasCountdown, 1000);
