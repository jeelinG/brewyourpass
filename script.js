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
        basic: { letterSubstitutionChance: 0.3, caseChangeChance: 0.4, symbolInsertionChance: 0.2 },
        medium: { letterSubstitutionChance: 0.5, caseChangeChance: 0.6, symbolInsertionChance: 0.3 },
        complex: { letterSubstitutionChance: 0.7, caseChangeChance: 0.8, symbolInsertionChance: 0.4 },
    };

    // Enhanced character substitutions for better security
    const substitutions = {
        a: ['@', '4', 'A'],
        b: ['8', '6', 'B'],
        c: ['(', '<', 'C'],
        d: ['D', '[)'],
        e: ['3', 'E'],
        f: ['F'],
        g: ['9', '6', 'G'],
        h: ['H'],
        i: ['1', '!', 'I', '|'],
        j: ['J'],
        k: ['K', '<'],
        l: ['1', 'L'],
        m: ['M'],
        n: ['N'],
        o: ['0', 'O', '()'],
        p: ['P', '9'],
        q: ['Q', '9'],
        r: ['R', '2'],
        s: ['$', '5', 'S'],
        t: ['7', '+', 'T'],
        u: ['U', 'v'],
        v: ['V'],
        w: ['W', 'vv'],
        x: ['X', '><'],
        y: ['Y'],
        z: ['2', 'Z'],
    };

    // Additional random characters for padding
    const additionalChars = {
        letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{};:,.<>?'
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

    // Get random character from additional character sets
    function getRandomAdditionalChar() {
        const charTypes = [additionalChars.letters, additionalChars.numbers, additionalChars.symbols];
        const selectedType = charTypes[Math.floor(Math.random() * charTypes.length)];
        return selectedType[Math.floor(Math.random() * selectedType.length)];
    }

    // Process individual character with substitution and case changes
    function processCharacter(char, rules) {
        let processedChar = char.toLowerCase();
        
        // Apply character substitution
        if (substitutions[processedChar] && Math.random() < rules.letterSubstitutionChance) {
            const subOptions = substitutions[processedChar];
            processedChar = subOptions[Math.floor(Math.random() * subOptions.length)];
        }
        
        // Apply case changes for letters that weren't substituted with symbols
        if (/[a-z]/i.test(processedChar) && Math.random() < rules.caseChangeChance) {
            processedChar = Math.random() < 0.5 ? processedChar.toLowerCase() : processedChar.toUpperCase();
        }
        
        return processedChar;
    }

    // Enhanced password generator
    function generatePassword() {
        if (!validateInputs()) return;

        const favWord = favWordInput.value.trim();
        const specialDate = specialDateInput.value.replaceAll('-', '');
        const luckySymbol = luckySymbolInput.value.trim();
        const rules = complexityRules[complexity];
        const targetLength = parseInt(passwordLengthInput.value);

        // Process favorite words
        let processedWords = [];
        const words = favWord.split(' ').filter(word => word.length > 0);
        
        for (let word of words) {
            let processedWord = '';
            for (let char of word) {
                processedWord += processCharacter(char, rules);
                
                // Occasionally insert lucky symbol within words
                if (Math.random() < rules.symbolInsertionChance * 0.5) {
                    const randomLuckyChar = luckySymbol[Math.floor(Math.random() * luckySymbol.length)];
                    processedWord += randomLuckyChar;
                }
            }
            processedWords.push(processedWord);
        }

        // Combine all base components
        let basePassword = processedWords.join('') + specialDate + luckySymbol;
        
        // If base password is longer than target, intelligently truncate
        if (basePassword.length > targetLength) {
            // Ensure we keep recognizable parts of words and essential components
            let truncated = '';
            let wordsUsed = Math.max(1, Math.floor(targetLength * 0.4 / (processedWords.length || 1)));
            
            // Add portions of processed words
            for (let i = 0; i < processedWords.length && truncated.length < targetLength - luckySymbol.length - 2; i++) {
                let wordPortion = processedWords[i].substring(0, Math.max(2, wordsUsed));
                truncated += wordPortion;
            }
            
            // Add part of date and lucky symbol
            let remainingLength = targetLength - truncated.length;
            if (remainingLength > luckySymbol.length) {
                truncated += specialDate.substring(0, remainingLength - luckySymbol.length);
            }
            truncated += luckySymbol;
            
            basePassword = truncated.substring(0, targetLength);
        }
        // If base password is shorter than target, add random elements
        else if (basePassword.length < targetLength) {
            let additionalLength = targetLength - basePassword.length;
            
            for (let i = 0; i < additionalLength; i++) {
                if (Math.random() < 0.4) {
                    // Add lucky symbol character
                    basePassword += luckySymbol[Math.floor(Math.random() * luckySymbol.length)];
                } else {
                    // Add random character
                    basePassword += getRandomAdditionalChar();
                }
            }
        }

        // Final security pass - ensure minimum character diversity
        let finalPassword = basePassword.substring(0, targetLength);
        
        // Ensure minimum length of 8
        while (finalPassword.length < 8) {
            finalPassword += luckySymbol[Math.floor(Math.random() * luckySymbol.length)];
        }

        // Apply final random transformations for additional security
        let passwordArray = finalPassword.split('');
        for (let i = 0; i < passwordArray.length; i++) {
            if (Math.random() < 0.1) { // 10% chance for final transformation
                if (/[a-z]/i.test(passwordArray[i])) {
                    passwordArray[i] = Math.random() < 0.5 ? passwordArray[i].toLowerCase() : passwordArray[i].toUpperCase();
                }
            }
        }

        resultInput.value = passwordArray.join('').slice(0, Math.min(targetLength, 128));
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