const ASSUMED_LIFESPAN_YEARS = 73;

const countdownLineOne = document.getElementById("countdown-line-one");
const countdownLineTwo = document.getElementById("countdown-line-two");
const setupPrompt = document.getElementById("setup-prompt");
const resetButton = document.getElementById("reset-button");

// Pads a number to two digits (e.g. 3 → "03").
function padToTwoDigits(number) {
  return String(number).padStart(2, "0");
}

// Calculates the remaining years, months, and days between now and the estimated death date.
// Returns null if the estimated death date has already passed.
function calculateLifespanRemaining(dateOfBirth) {
  const deathDate = new Date(dateOfBirth);
  deathDate.setFullYear(deathDate.getFullYear() + ASSUMED_LIFESPAN_YEARS);

  const now = new Date();

  if (now >= deathDate) {
    return null;
  }

  let years = deathDate.getFullYear() - now.getFullYear();
  let months = deathDate.getMonth() - now.getMonth();
  let days = deathDate.getDate() - now.getDate();

  if (days < 0) {
    const previousMonth = new Date(deathDate.getFullYear(), deathDate.getMonth(), 0);
    days += previousMonth.getDate();
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  return { years, months, days };
}

// Calculates the hours, minutes, and seconds remaining until midnight in the user's local timezone.
function calculateTimeLeftToday() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const remainingMilliseconds = midnight - now;

  const hours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMilliseconds % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

// Renders the countdown values into the two display lines.
function renderCountdown(lifespanRemaining, timeLeftToday) {
  if (lifespanRemaining === null) {
    countdownLineOne.textContent = "Your time has come.";
    countdownLineTwo.textContent = "";
    return;
  }

  const formattedYears = padToTwoDigits(lifespanRemaining.years);
  const formattedMonths = padToTwoDigits(lifespanRemaining.months);
  const formattedDays = padToTwoDigits(lifespanRemaining.days);
  const formattedHours = padToTwoDigits(timeLeftToday.hours);
  const formattedMinutes = padToTwoDigits(timeLeftToday.minutes);
  const formattedSeconds = padToTwoDigits(timeLeftToday.seconds);

  countdownLineOne.textContent =
    `- ${formattedYears} Years - ${formattedMonths} Months - ${formattedDays} Days -`;
  countdownLineTwo.textContent =
    `- ${formattedHours} Hours - ${formattedMinutes} Minutes - ${formattedSeconds} Seconds -`;
}

// Starts the live countdown, updating every second.
function startCountdown(dateOfBirth) {
  function tick() {
    const lifespanRemaining = calculateLifespanRemaining(dateOfBirth);
    const timeLeftToday = calculateTimeLeftToday();
    renderCountdown(lifespanRemaining, timeLeftToday);
  }

  tick();
  setInterval(tick, 1000);
}

// Clears the stored date of birth and redirects to the setup page.
function handleReset() {
  chrome.storage.local.remove("dateOfBirth", () => {
    window.location.href = "../setup/setup.html";
  });
}

// Loads the stored date of birth and initializes the countdown.
// If no date of birth is stored, shows the setup prompt instead.
function initialize() {
  chrome.storage.local.get("dateOfBirth", (result) => {
    if (result.dateOfBirth) {
      resetButton.classList.remove("hidden");
      startCountdown(result.dateOfBirth);
    } else {
      setupPrompt.classList.remove("hidden");
    }
  });
}

resetButton.addEventListener("click", handleReset);

initialize();
