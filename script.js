document.getElementById("length").addEventListener("input", function () {
  document.getElementById("lengthDisplay").textContent = this.value;
});

function generatePassword() {
  const favWord = document.getElementById("favWord").value || "magic";
  const date = document.getElementById("specialDate").value || "20000101";
  const symbol = document.getElementById("luckySymbol").value || "#";
  const len = parseInt(document.getElementById("length").value);
  const complexity = document.getElementById("complexity").value;

  const base = favWord + date.replaceAll("-", "") + symbol;

  // Always include character pools
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}";

  // Combine all characters
  let allChars = [...base, ...lower, ...upper, ...numbers, ...symbols];

  // Randomize casing of base characters
  allChars = allChars.map(ch =>
    Math.random() > 0.5 ? ch.toUpperCase() : ch.toLowerCase()
  );

  // Shuffle and slice to desired length
  const shuffled = shuffle(allChars, complexity).slice(0, len);
  document.getElementById("result").value = shuffled.join('');
}

function shuffle(arr, mode) {
  const a = arr.slice();
  let m = mode === "Complex" ? 30 : mode === "Medium" ? 15 : 5;
  for (let i = 0; i < m; i++) {
    const x = Math.floor(Math.random() * a.length);
    const y = Math.floor(Math.random() * a.length);
    [a[x], a[y]] = [a[y], a[x]];
  }
  return a;
}

function copyPassword() {
  const pass = document.getElementById("result");
  pass.select();
  pass.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Password copied!");
}

// Setup slider label visuals
const lengthSlider = document.getElementById('length');
const lengthDisplay = document.getElementById('lengthDisplay');
const complexitySlider = document.getElementById('complexity');
const complexityLabels = document.querySelectorAll('#complexityLabels span');

function updateLengthDisplay(value) {
  lengthDisplay.textContent = value;
}

updateLengthDisplay(lengthSlider.value);

lengthSlider.addEventListener('input', () => {
  updateLengthDisplay(lengthSlider.value);
});

complexitySlider.addEventListener('input', () => {
  complexityLabels.forEach((label, index) => {
    label.classList.toggle('active', parseInt(complexitySlider.value) === index);
  });
});

// Set initial active state for complexity labels based on the initial slider value
complexityLabels.forEach((label, index) => {
  label.classList.toggle('active', parseInt(complexitySlider.value) === index);
});