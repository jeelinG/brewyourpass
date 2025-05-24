// Fetch header for all pages
fetch('header.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('nav-placeholder').innerHTML = data;
    });

// Password generator
document.addEventListener('DOMContentLoaded', () => {

  const favWordInput = document.getElementById('fav-word');
  const luckySymbolInput = document.getElementById('lucky-symbol');
  const passwordLengthInput = document.getElementById('password-length');
  const lengthDisplay = document.getElementById('length-display');
  const generateBtn = document.getElementById('generate-btn');
  const resultInput = document.getElementById('result');

  const favWordError = document.getElementById('fav-word-error');
  const luckySymbolError = document.getElementById('lucky-symbol-error');
  const copyBtn = document.getElementById('copy-btn');

  let complexity = 'basic';

  const complexityLevels = ['basic', 'medium', 'complex'];
  const complexityRules = {
    basic: { letterSubstitutionChance: 0.3, caseChangeChance: 0.4, symbolInsertionChance: 0.2 },
    medium: { letterSubstitutionChance: 0.5, caseChangeChance: 0.6, symbolInsertionChance: 0.3 },
    complex: { letterSubstitutionChance: 0.7, caseChangeChance: 0.8, symbolInsertionChance: 0.4 },
  };

  const substitutions = {
    a: ['@', '4', 'A'], b: ['8', '6', 'B'], c: ['(', '<', 'C'], d: ['D', '[)'],
    e: ['3', 'E'], f: ['F'], g: ['9', 'G'], h: ['#', 'H'], i: ['1', '!', 'I'],
    j: ['J'], k: ['K', '<'], l: ['1', '|', 'L'], m: ['M'], n: ['N'],
    o: ['0', 'O', '()'], p: ['P', '9'], q: ['Q', '9'], r: ['R', '2'],
    s: ['$', '5', 'S'], t: ['7', '+', 'T'], u: ['U', 'v'], v: ['V'],
    w: ['W', 'vv'], x: ['X', '><'], y: ['Y'], z: ['2', 'Z', '%'],
  };

  const additionalChars = {
    letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%&*()_+-=<>?'
  };

  passwordLengthInput.addEventListener('input', e => lengthDisplay.textContent = e.target.value);

const complexityRadios = document.querySelectorAll('input[name="complexity"]');

complexityRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      complexity = radio.value;
    }
  });
});

  generateBtn.addEventListener('click', generatePassword);

  function setFieldError(input, errorElem, message) {
    input.classList.add('input-error');
    errorElem.textContent = message;
    errorElem.classList.remove('hidden');
  }

  function clearFieldError(input, errorElem) {
    input.classList.remove('input-error');
    errorElem.textContent = '';
    errorElem.classList.add('hidden');
  }

  favWordInput.addEventListener('input', () => {
    const value = favWordInput.value.trim();
    if (!value) {
      setFieldError(favWordInput, favWordError, 'Key in phrases up to 50 chars.');
    } else if (!/^[A-Za-z\s]+$/.test(value)) {
      setFieldError(favWordInput, favWordError, 'Only letters and spaces are allowed.');
    } else if (value.length > 50) {
      setFieldError(favWordInput, favWordError, 'Maximum 50 characters allowed.');
    } else {
      clearFieldError(favWordInput, favWordError);
    }
  });

  luckySymbolInput.addEventListener('input', () => {
    const value = luckySymbolInput.value.trim();
    if (!value) {
      setFieldError(luckySymbolInput, luckySymbolError, 'Lucky number or symbol is required.');
    } else if (/^[A-Za-z\s]+$/.test(value)) {
      setFieldError(luckySymbolInput, luckySymbolError, 'Letters and spaces are not allowed.');
    } else {
      clearFieldError(luckySymbolInput, luckySymbolError);
    }
  });

  function validateInputs() {
    let isValid = true;

    const favWord = favWordInput.value.trim();
    const luckySymbol = luckySymbolInput.value.trim();

    if (!favWord) {
      setFieldError(favWordInput, favWordError, 'Key in words up to 50 chars.');
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(favWord)) {
      setFieldError(favWordInput, favWordError, 'Only letters and spaces are allowed.');
      isValid = false;
    } else if (favWord.length > 50) {
      setFieldError(favWordInput, favWordError, 'Maximum 50 characters allowed.');
      isValid = false;
    } else {
      clearFieldError(favWordInput, favWordError);
    }

    if (!luckySymbol) {
      setFieldError(luckySymbolInput, luckySymbolError, 'Lucky number or symbol is required.');
      isValid = false;
    } else if (/^[A-Za-z\s]+$/.test(luckySymbol)) {
      setFieldError(luckySymbolInput, luckySymbolError, 'Letters and spaces are not allowed.');
      isValid = false;
    } else {
      clearFieldError(luckySymbolInput, luckySymbolError);
    }

    return isValid;
  }

  function getRandomAdditionalChar() {
    const charTypes = [additionalChars.letters, additionalChars.numbers, additionalChars.symbols];
    const selectedType = charTypes[Math.floor(Math.random() * charTypes.length)];
    return selectedType[Math.floor(Math.random() * selectedType.length)];
  }

  function processCharacter(char, rules) {
    let processedChar = char.toLowerCase();

    if (substitutions[processedChar] && Math.random() < rules.letterSubstitutionChance) {
      const subOptions = substitutions[processedChar];
      processedChar = subOptions[Math.floor(Math.random() * subOptions.length)];
    }

    if (/[a-z]/i.test(processedChar) && Math.random() < rules.caseChangeChance) {
      processedChar = Math.random() < 0.5 ? processedChar.toLowerCase() : processedChar.toUpperCase();
    }

    return processedChar;
  }

  // [UPDATED] Enhanced password generator — enforces selected length
  function generatePassword() {
    if (!validateInputs()) return;

    const favWord = favWordInput.value.trim();
    const luckySymbol = luckySymbolInput.value.trim();
    const rules = complexityRules[complexity];
    const targetLength = parseInt(passwordLengthInput.value);

    let processed = '';
    const words = favWord.split(' ').filter(Boolean);

    for (let word of words) {
      for (let char of word) {
        processed += processCharacter(char, rules);
        if (Math.random() < rules.symbolInsertionChance * 0.5) {
          processed += luckySymbol[Math.floor(Math.random() * luckySymbol.length)];
        }
      }
    }

    processed += luckySymbol;

    while (processed.length < targetLength) {
      processed += Math.random() < 0.5
        ? getRandomAdditionalChar()
        : luckySymbol[Math.floor(Math.random() * luckySymbol.length)];
    }

    if (processed.length > targetLength) {
      processed = processed.slice(0, targetLength);
    }

    resultInput.value = processed;
  }

  function copyPassword() {
    const pass = document.getElementById('result').value;
    navigator.clipboard.writeText(pass).then(() => {
      alert('Password copied!');
    }).catch(err => {
      console.error('Failed to copy password: ', err);
      alert('Failed to copy password. Please try again.');
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', copyPassword);
  }

});


// Form submission handling
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const responseDiv = document.getElementById('formResponse');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('contactName').value;
        responseDiv.textContent = `Thanks, ${name || 'friend'}! We'll get back to you soon 😄`;
        form.reset();
    });
});

// === Password Strength Logic ===
const passwordInput = document.getElementById('passwordInput');
const toggleBtn = document.getElementById('toggleBtn');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const scoreDisplay = document.getElementById('scoreDisplay');

const lengthReq = document.getElementById('lengthReq');
const uppercaseReq = document.getElementById('uppercaseReq');
const lowercaseReq = document.getElementById('lowercaseReq');
const numberReq = document.getElementById('numberReq');
const specialReq = document.getElementById('specialReq');
const noCommonReq = document.getElementById('noCommonReq');

const commonPasswords = [
  'password', 'secret', 'iloveyou', '111111', '11111111', '123456', '12345678', '123456789', 'qwerty', 'qwerty123', 'abc123', 'password123',
  'admin', 'letmein', 'welcome'
];

// Toggle password visibility
toggleBtn.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
});

// Live password input check
passwordInput.addEventListener('input', () => {
  checkPasswordStrength(passwordInput.value);
});

function checkPasswordStrength(password) {
  if (password.length === 0) {
    resetStrength();
    return;
  }

  let score = 0;
  const lengthOK = password.length >= 8;
  const upperOK = /[A-Z]/.test(password);
  const lowerOK = /[a-z]/.test(password);
  const numberOK = /\d/.test(password);
  const specialOK = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const uncommonOK = !commonPasswords.includes(password.toLowerCase());

  updateRequirement(lengthReq, lengthOK);
  updateRequirement(uppercaseReq, upperOK);
  updateRequirement(lowercaseReq, lowerOK);
  updateRequirement(numberReq, numberOK);
  updateRequirement(specialReq, specialOK);
  updateRequirement(noCommonReq, uncommonOK);

  if (lengthOK) score++;
  if (upperOK) score++;
  if (lowerOK) score++;
  if (numberOK) score++;
  if (specialOK) score++;
  if (uncommonOK) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  updateStrengthUI(score);
}

function updateRequirement(el, pass) {
  if (pass) {
    el.classList.add('met');
    el.querySelector('.requirement-icon').textContent = '✓';
  } else {
    el.classList.remove('met');
    el.querySelector('.requirement-icon').textContent = '✗';
  }
}

function updateStrengthUI(score) {
  const levels = ['very-weak', 'weak', 'fair', 'good', 'strong'];
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const levelIndex = Math.min(Math.floor(score / 2), levels.length - 1);

  strengthBar.className = `strength-bar ${levels[levelIndex]}`;
  strengthBar.style.width = `${(score / 8) * 100}%`;
  strengthText.textContent = labels[levelIndex];
  strengthText.className = `strength-text ${levels[levelIndex]}`;
  scoreDisplay.textContent = `Strength Score: ${score}/8`;
}

function resetStrength() {
  strengthBar.style.width = '0%';
  strengthBar.className = 'strength-bar';
  strengthText.textContent = 'Enter a password to check its strength';
  strengthText.className = 'strength-text';
  scoreDisplay.textContent = '';

  [lengthReq, uppercaseReq, lowercaseReq, numberReq, specialReq, noCommonReq].forEach(req => {
    req.classList.remove('met');
    req.querySelector('.requirement-icon').textContent = '✗';
  });
}

