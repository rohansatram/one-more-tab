const setupForm = document.getElementById("setup-form");
const dateOfBirthInput = document.getElementById("date-of-birth");

// Saves the date of birth to local storage and navigates to the new tab page.
function handleFormSubmit(event) {
  event.preventDefault();

  const dateOfBirth = dateOfBirthInput.value;

  if (!dateOfBirth) {
    return;
  }

  chrome.storage.local.set({ dateOfBirth }, () => {
    window.location.href = "../newtab/newtab.html";
  });
}

setupForm.addEventListener("submit", handleFormSubmit);
