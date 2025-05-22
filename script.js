// Fetch header for all pages
fetch('header.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('nav-placeholder').innerHTML = data;
    });

// Password generator
document.addEventListener('DOMContentLoaded', () => {

    const favWordInput = document.getElementById('fav-word');
    const specialDateInput = document.getElementById('special-date');
    const luckySymbolInput = document.getElementById('lucky-symbol');

    const passwordLengthInput = document.getElementById('password-length');
    const lengthDisplay = document.getElementById('length-display');
    const generateBtn = document.getElementById('generate-btn');
    const resultInput = document.getElementById('result');
    const complexitySlider = document.getElementById('complexity');
    const complexityLabels = document.querySelectorAll('#complexityLabels span');

    const favWordError = document.getElementById('fav-word-error');
    const specialDateError = document.getElementById('special-date-error');
    const luckySymbolError = document.getElementById('lucky-symbol-error');

    const copyBtn = document.getElementById('copy-btn');

    let complexity = 'basic';

    const complexityLevels = ['basic', 'medium', 'complex'];
    const complexityRules = {
        basic: { letterSubstitutionChance: 0.05, caseChangeChance: 0.2, symbolInsertionChance: 0.1 },
        medium: { letterSubstitutionChance: 0.1, caseChangeChance: 0.4, symbolInsertionChance: 0.2 },
        complex: { letterSubstitutionChance: 0.2, caseChangeChance: 0.6, symbolInsertionChance: 0.5 },
    };

    const substitutions = {
        a: ['@', '4'],
        b: ['8'],
        c: ['('],
        e: ['3'],
        g: ['9'],
        h: ['#'],
        i: ['1', '!'],
        l: ['1'],
        o: ['0'],
        s: ['$', '5'],
        t: ['7', '+'],
        z: ['2'],
    };

    function updateLengthDisplay(val) {
        lengthDisplay.textContent = val;
    }

    passwordLengthInput.addEventListener('input', e => updateLengthDisplay(e.target.value));

    complexitySlider.addEventListener('input', () => {
        const value = parseInt(complexitySlider.value);
        complexity = complexityLevels[value];
        complexityLabels.forEach((label, index) => {
            label.classList.toggle('active', index === value);
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

    specialDateInput.addEventListener('input', () => {
        if (!specialDateInput.value) {
            setFieldError(specialDateInput, specialDateError, 'Please select a date.');
        } else {
            clearFieldError(specialDateInput, specialDateError);
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
        const specialDate = specialDateInput.value;
        const luckySymbol = luckySymbolInput.value.trim();

        if (!favWord) {
            setFieldError(favWordInput, favWordError, 'Key in phrases up to 50 chars.');
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

        if (!specialDate) {
            setFieldError(specialDateInput, specialDateError, 'Please select a date.');
            isValid = false;
        } else {
            clearFieldError(specialDateInput, specialDateError);
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

    // ✅ Updated password generator with logic applied across all levels
    function generatePassword() {
        if (!validateInputs()) return;

        const favWord = favWordInput.value.trim();
        const specialDate = specialDateInput.value.replaceAll('-', '');
        const luckySymbol = luckySymbolInput.value.trim();
        const rules = complexityRules[complexity];
        const targetLength = parseInt(passwordLengthInput.value);

        let result = [];

        // Split favWord by words and process each
        let words = favWord.split(' ');
        let processedWords = words.map((word, index) => {
            let chars = [];

            for (let char of word) {
                if (substitutions[char.toLowerCase()] && Math.random() < rules.letterSubstitutionChance) {
                    const subOptions = substitutions[char.toLowerCase()];
                    char = subOptions[Math.floor(Math.random() * subOptions.length)];
                }

                if (/[a-z]/i.test(char) && Math.random() < rules.caseChangeChance) {
                    char = Math.random() < 0.5 ? char.toLowerCase() : char.toUpperCase();
                }

                chars.push(char);

                if (Math.random() < rules.symbolInsertionChance && luckySymbol.length > 0) {
                    chars.push(luckySymbol[Math.floor(Math.random() * luckySymbol.length)]);
                }
            }

            // Join with lucky symbol as separator between words
            return chars.join('') + (index < words.length - 1 ? luckySymbol : '');
        });

        // Join all parts of the password
        let base = processedWords.join('') + specialDate + luckySymbol;

        for (let char of base) {
            result.push(char);

            if (Math.random() < rules.symbolInsertionChance && luckySymbol.length > 0) {
                const randSymbol = luckySymbol[Math.floor(Math.random() * luckySymbol.length)];
                result.push(randSymbol);
            }
        }

        let finalPassword = result.join('').replaceAll(' ', '');

        while (finalPassword.length < 8) {
            finalPassword += luckySymbol[Math.floor(Math.random() * luckySymbol.length)];
        }

        resultInput.value = finalPassword.slice(0, Math.min(targetLength, 20));
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
        responseDiv.textContent = `Thanks, ${name || 'friend'}! We'll get back to you soon.`;
        form.reset();
    });
});
