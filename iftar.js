

const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;

  if (distance < 0) {
    clearInterval(interval);
    document.querySelector(".iftar").textContent = "সময় হয়েছে";
  }
};

const interval = setInterval(updateCountdown, 1000);
updateCountdown();
