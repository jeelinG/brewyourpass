document.addEventListener('DOMContentLoaded', () => {
    // Password generator - references
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

    // complexity of password and probability
    let complexity = 'basic';

    const complexityLevels = ['basic', 'medium', 'complex'];
    const complexityRules = {
        basic: { letterSubstitutionChance: 0.05, caseChangeChance: 0.2, symbolInsertionChance: 0.1 },
        medium: { letterSubstitutionChance: 0.1, caseChangeChance: 0.4, symbolInsertionChance: 0.2 },
        complex: { letterSubstitutionChance: 0.2, caseChangeChance: 0.6, symbolInsertionChance: 0.5 },
    };

    // Password generator - substitution dictionary
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
        t: ['7'],
        z: ['2'],
    };

    // update preferred length of password in range slider
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

    // Reusable function for setting field errors
    function setFieldError(input, errorElem, message) {
        input.classList.add('input-error');
        errorElem.textContent = message;
        errorElem.classList.remove('hidden');
    }

    // Reusable function for clearing field errors
    function clearFieldError(input, errorElem) {
        input.classList.remove('input-error');
        errorElem.textContent = '';
        errorElem.classList.add('hidden');
    }

    // Real-time validation for input fields
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

    // Function to validate all input fields before generating password
    function validateInputs() {
        let isValid = true;

        const favWord = favWordInput.value.trim();
        const specialDate = specialDateInput.value;
        const luckySymbol = luckySymbolInput.value.trim();

        // Favourite word validation
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

        // Special date validation
        if (!specialDate) {
            setFieldError(specialDateInput, specialDateError, 'Please select a date.');
            isValid = false;
        } else {
            clearFieldError(specialDateInput, specialDateError);
        }

        // Lucky symbol validation
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

    // Main function to generate the password
    function generatePassword() {
        if (!validateInputs()) return;

        const favWord = favWordInput.value.trim();
        const specialDate = specialDateInput.value.replaceAll('-', '');
        const luckySymbol = luckySymbolInput.value.trim();
        const rules = complexityRules[complexity];
        const targetLength = parseInt(passwordLengthInput.value);

        let base = (favWord + specialDate + luckySymbol).split('');
        let result = [];

        base.forEach(char => {
            if (substitutions[char] && Math.random() < rules.letterSubstitutionChance) {
                char = substitutions[char][Math.floor(Math.random() * substitutions[char].length)];
            } else if (/[a-z]/i.test(char) && Math.random() < rules.caseChangeChance) {
                char = char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase();
            }
            result.push(char);
            if (Math.random() < rules.symbolInsertionChance) {
                const randSymbol = luckySymbol[Math.floor(Math.random() * luckySymbol.length)];
                result.push(randSymbol);
            }
        });

        result = result.sort(() => 0.5 - Math.random()).join('').slice(0, targetLength);

        while (result.length < 8) {
            result += luckySymbol[Math.floor(Math.random() * luckySymbol.length)];
        }

        resultInput.value = result.slice(0, 20);
    }

    // Function to copy the generated password to the clipboard
    function copyPassword() {
        const pass = document.getElementById('result').value;
        navigator.clipboard.writeText(pass).then(() => {
            alert('Password copied!');
        }).catch(err => {
            console.error('Failed to copy password: ', err);
            alert('Failed to copy password. Please try again.');
        });
    }

    // Attach the event listener to the copy button
    if (copyBtn) {
        copyBtn.addEventListener('click', copyPassword);
    }

    // Function to open a specific tab (for potential tabbed interface)
    function openTab(tabName) {
        // Hide all sections with the class 'tabcontent'
        document.querySelectorAll('.tabcontent').forEach(el => el.style.display = 'none');
        // Show the selected section by its ID
        document.getElementById(tabName).style.display = 'block';
    }
});

// Form submission handling (for a contact form, likely in a different section)
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const responseDiv = document.getElementById('formResponse');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent actual form submission

            // Get form values (optional)
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;

            // Simulate form submission and display a dummy response
            responseDiv.textContent = `Thanks, ${name || 'friend'}! We've received your message and will get back to you soon.`;

            // Optionally clear the form after submission
            form.reset();
        });
    }
});