document.getElementById("length").addEventListener("input", function () {
  document.getElementById("lengthDisplay").textContent = this.value;
});

function generatePassword() {
  const favWord = document.getElementById("favWord").value || "magic";
  const date = document.getElementById("specialDate").value || "20000101";
  const symbol = document.getElementById("luckySymbol").value || "#";

  const len = parseInt(document.getElementById("length").value);
  const useCase = document.getElementById("useCase").checked;
  const useNum = document.getElementById("useNumbers").checked;
  const useSym = document.getElementById("useSymbols").checked;
  const complexity = document.getElementById("complexity").value;

  let base = favWord + date.replaceAll("-", "") + symbol;
  let chars = base.split("");

  // Mix case
  if (useCase) {
    chars = chars.map(ch => Math.random() > 0.5 ? ch.toUpperCase() : ch.toLowerCase());
  }

  // Add numbers
  if (useNum) {
    chars.push(..."1234567890");
  }

  // Add symbols
  if (useSym) {
    chars.push(..."!@#$%^&*()_+-=[]{}");
  }

  // Shuffle based on complexity
  let shuffled = shuffle(chars, complexity).slice(0, len);
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


    // Set initial display based on default value
    updateDisplay(slider.value);

    // Update display on slider input
    slider.addEventListener("input", function() {
      updateDisplay(this.value);
    });

        const slider = document.getElementById('complexity');
    const labels = document.querySelectorAll('.slider-labels span');

    slider.addEventListener('input', () => {
      labels.forEach((label, index) => {
        label.classList.toggle('active', index == slider.value);
      });
    });

    // Set default active
    labels[slider.value].classList.add('active');