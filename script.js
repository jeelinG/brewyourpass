    document.addEventListener('DOMContentLoaded', () => {
      const favWordInput = document.getElementById('fav-word');
      const specialDateInput = document.getElementById('special-date');
      const luckySymbolInput = document.getElementById('lucky-symbol');
      const passwordLengthInput = document.getElementById('password-length');
      const lengthDisplay = document.getElementById('length-display');
      const generateBtn = document.getElementById('generate-btn');
      const errorMessage = document.getElementById('error-message');
      const resultInput = document.getElementById('result');
      const complexitySlider = document.getElementById('complexity');
      const complexityLabels = document.querySelectorAll('#complexityLabels span');
    

      let complexity = 'basic';

      const complexityLevels = ['basic', 'medium', 'complex'];
      const complexityRules = {
        basic: { letterSubstitutionChance: 0.1, caseChangeChance: 0.2, symbolInsertionChance: 0.1 },
        medium: { letterSubstitutionChance: 0.25, caseChangeChance: 0.4, symbolInsertionChance: 0.25 },
        complex: { letterSubstitutionChance: 0.4, caseChangeChance: 0.5, symbolInsertionChance: 0.5 },
      };

      const substitutions = {
        a: ['@', '4'], e: ['3'], i: ['1', '!'], o: ['0'], s: ['$', '5'],
        t: ['7'], l: ['1'], b: ['8'], z: ['2'], g: ['9']
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

      function showError(msg) {
        errorMessage.textContent = msg;
      }

      function validateInputs() {
        if (!favWordInput.value.trim()) return showError('Enter your favourite word.');
        if (!specialDateInput.value) return showError('Select a special date.');
        if (!luckySymbolInput.value.trim()) return showError('Enter your lucky symbol.');
        errorMessage.textContent = '';
        return true;
      }

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
    });

    function copyPassword() {
      const pass = document.getElementById('result').value;
      navigator.clipboard.writeText(pass).then(() => alert('Password copied!'));
    }
  
    function openTab(tabName) {
  // Hide all sections
  document.querySelectorAll('.tabcontent').forEach(el => el.style.display = 'none');
  
  // Show the selected section
  document.getElementById(tabName).style.display = 'block';
}
