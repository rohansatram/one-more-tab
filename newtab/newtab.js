const ASSUMED_LIFESPAN_YEARS = 73;

const countdownLineOne = document.getElementById("countdown-line-one");
const countdownLineTwo = document.getElementById("countdown-line-two");
const setupPrompt = document.getElementById("setup-prompt");
const resetButton = document.getElementById("reset-button");
const themeButton = document.getElementById("theme-button");
const showMoreSection = document.getElementById("show-more-section");
const showMoreButton = document.getElementById("show-more-button");
const showMoreLabel = document.getElementById("show-more-label");
const showMoreArrow = document.getElementById("show-more-arrow");
const expandedDetails = document.getElementById("expanded-details");

const THEME_ORDER = [
  { className: "theme-obsidian", displayName: "Obsidian" },
  { className: "theme-void", displayName: "Void" },
  { className: "theme-bone", displayName: "Bone" },
];

const livedLabel = document.getElementById("lived-label");
const remainingLabel = document.getElementById("remaining-label");
const progressBarFill = document.getElementById("progress-bar-fill");

const weekendsLeft = document.getElementById("weekends-left");
const morningsLeft = document.getElementById("mornings-left");
const booksLeft = document.getElementById("books-left");
const tripsLeft = document.getElementById("trips-left");

const probabilityThisYear = document.getElementById("probability-this-year");
const probabilityBefore60 = document.getElementById("probability-before-60");
const probabilityBefore80 = document.getElementById("probability-before-80");

// Pads a number to two digits (e.g. 3 → "03").
function padToTwoDigits(number) {
  return String(number).padStart(2, "0");
}

// Formats a number with commas as thousands separators (e.g. 2900 → "2,900").
function formatWithCommas(number) {
  return number.toLocaleString();
}

// Calculates the user's current age in fractional years from their date of birth.
function calculateCurrentAge(dateOfBirth) {
  const birthDate = new Date(dateOfBirth);
  const now = new Date();
  const ageInMilliseconds = now - birthDate;
  const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000;
  return ageInMilliseconds / millisecondsPerYear;
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

// Creates a span element with the given class and text content.
function createSpan(className, text) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  return span;
}

// Builds a countdown line element from an array of [value, label] pairs.
function buildCountdownLine(container, segments) {
  container.textContent = "";

  container.appendChild(createSpan("countdown-separator", "- "));

  segments.forEach((segment, index) => {
    container.appendChild(createSpan("countdown-number", segment[0]));
    container.appendChild(document.createTextNode(" "));
    container.appendChild(createSpan("countdown-label", segment[1]));

    if (index < segments.length - 1) {
      container.appendChild(createSpan("countdown-separator", " - "));
    }
  });

  container.appendChild(createSpan("countdown-separator", " -"));
}

// Renders the countdown values into the two display lines.
// Uses DOM manipulation instead of innerHTML for security compliance.
function renderCountdown(lifespanRemaining, timeLeftToday) {
  if (lifespanRemaining === null) {
    countdownLineOne.textContent = "";
    countdownLineOne.appendChild(createSpan("countdown-number", "Your time has come."));
    countdownLineTwo.textContent = "";
    return;
  }

  const formattedYears = padToTwoDigits(lifespanRemaining.years);
  const formattedMonths = padToTwoDigits(lifespanRemaining.months);
  const formattedDays = padToTwoDigits(lifespanRemaining.days);
  const formattedHours = padToTwoDigits(timeLeftToday.hours);
  const formattedMinutes = padToTwoDigits(timeLeftToday.minutes);
  const formattedSeconds = padToTwoDigits(timeLeftToday.seconds);

  buildCountdownLine(countdownLineOne, [
    [formattedYears, "Years"],
    [formattedMonths, "Months"],
    [formattedDays, "Days"],
  ]);

  buildCountdownLine(countdownLineTwo, [
    [formattedHours, "Hours"],
    [formattedMinutes, "Minutes"],
    [formattedSeconds, "Seconds"],
  ]);
}

// Populates the life completion percentage and progress bar.
function renderLifeCompletion(dateOfBirth) {
  const currentAge = calculateCurrentAge(dateOfBirth);
  const percentageLived = Math.min((currentAge / ASSUMED_LIFESPAN_YEARS) * 100, 100);
  const percentageRemaining = Math.max(100 - percentageLived, 0);

  livedLabel.textContent = `Lived: ${percentageLived.toFixed(1)}%`;
  remainingLabel.textContent = `Remaining: ${percentageRemaining.toFixed(1)}%`;
  progressBarFill.style.width = `${percentageLived.toFixed(1)}%`;
}

// Populates the "lived units" — remaining weekends, mornings, books, and trips.
function renderLivedUnits(dateOfBirth) {
  const currentAge = calculateCurrentAge(dateOfBirth);
  const remainingYears = Math.max(ASSUMED_LIFESPAN_YEARS - currentAge, 0);

  const remainingWeekends = Math.round(remainingYears * 52);
  const remainingMornings = Math.round(remainingYears * 365);
  const remainingBooks = Math.round(remainingYears * 12);
  const remainingTrips = Math.round(remainingYears * 4);

  weekendsLeft.textContent = `~${formatWithCommas(remainingWeekends)} weekends left`;
  morningsLeft.textContent = `~${formatWithCommas(remainingMornings)} mornings left`;
  booksLeft.textContent = `~${formatWithCommas(remainingBooks)} books (if you read 1/month)`;
  tripsLeft.textContent = `~${formatWithCommas(remainingTrips)} trips (if you take 4/year)`;
}

// Populates the death probability statistics using real actuarial data.
// Uses functions from data/mortality.js.
function renderDeathProbability(dateOfBirth) {
  const currentAge = Math.floor(calculateCurrentAge(dateOfBirth));

  const thisYearProbability = getAnnualDeathProbability(currentAge) * 100;
  probabilityThisYear.textContent =
    `Chance of dying this year: ${thisYearProbability.toFixed(2)}%`;

  if (currentAge < 60) {
    const before60 = calculateDeathProbabilityBeforeAge(currentAge, 60) * 100;
    probabilityBefore60.textContent = `Before age 60: ${before60.toFixed(1)}%`;
  } else {
    probabilityBefore60.textContent = `Before age 60: passed`;
  }

  if (currentAge < 80) {
    const before80 = calculateDeathProbabilityBeforeAge(currentAge, 80) * 100;
    probabilityBefore80.textContent = `Before age 80: ${before80.toFixed(1)}%`;
  } else {
    probabilityBefore80.textContent = `Before age 80: passed`;
  }
}

// Renders all expanded detail sections (called once on load, not every tick).
function renderExpandedDetails(dateOfBirth) {
  renderLifeCompletion(dateOfBirth);
  renderLivedUnits(dateOfBirth);
  renderDeathProbability(dateOfBirth);
}

// Toggles the expanded details section open/closed.
function toggleShowMore() {
  const isCurrentlyHidden = expandedDetails.classList.contains("hidden");

  if (isCurrentlyHidden) {
    expandedDetails.classList.remove("hidden");
    showMoreLabel.textContent = "Show Less";
    showMoreArrow.classList.add("rotated");
  } else {
    expandedDetails.classList.add("hidden");
    showMoreLabel.textContent = "Show More";
    showMoreArrow.classList.remove("rotated");
  }
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

// Applies the given theme by updating the body class and button label.
function applyTheme(themeClassName) {
  const themeEntry = THEME_ORDER.find(entry => entry.className === themeClassName);
  if (!themeEntry) return;

  THEME_ORDER.forEach(entry => document.body.classList.remove(entry.className));
  document.body.classList.add(themeClassName);
  themeButton.textContent = themeEntry.displayName;
}

// Cycles to the next theme in the list and saves the selection.
function handleThemeCycle() {
  const currentThemeIndex = THEME_ORDER.findIndex(
    entry => document.body.classList.contains(entry.className)
  );
  const nextThemeIndex = (currentThemeIndex + 1) % THEME_ORDER.length;
  const nextTheme = THEME_ORDER[nextThemeIndex];

  applyTheme(nextTheme.className);
  chrome.storage.local.set({ theme: nextTheme.className });
}

// Loads the stored date of birth and theme, then initializes the page.
function initialize() {
  chrome.storage.local.get(["dateOfBirth", "theme"], (result) => {
    const savedTheme = result.theme || "theme-obsidian";
    applyTheme(savedTheme);

    if (result.dateOfBirth) {
      resetButton.classList.remove("hidden");
      themeButton.classList.remove("hidden");
      showMoreSection.classList.remove("hidden");
      startCountdown(result.dateOfBirth);
      renderExpandedDetails(result.dateOfBirth);
    } else {
      setupPrompt.classList.remove("hidden");
    }
  });
}

showMoreButton.addEventListener("click", toggleShowMore);
resetButton.addEventListener("click", handleReset);
themeButton.addEventListener("click", handleThemeCycle);

initialize();
