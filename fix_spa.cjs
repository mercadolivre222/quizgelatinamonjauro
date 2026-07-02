const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const newScript = `<script>
  window.addEventListener('DOMContentLoaded', () => {
    let currentStep = 0;
    const totalSteps = 26; // Adjust if needed
    let stepHistory = [];

    function goToNextStep() {
      if (currentStep < totalSteps - 1) {
        stepHistory.push(currentStep);
        const currEl = document.getElementById('step-' + currentStep);
        if(currEl) currEl.style.display = 'none';
        
        currentStep++;
        
        const nextEl = document.getElementById('step-' + currentStep);
        if(nextEl) {
          nextEl.style.display = 'block';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        window.location.href = 'https://pay.cakto.com.br/bnfh62c';
      }
    }

    function goBack() {
      if (stepHistory.length > 0) {
        const prevStep = stepHistory.pop();
        const currEl = document.getElementById('step-' + currentStep);
        if(currEl) currEl.style.display = 'none';
        
        currentStep = prevStep;
        
        const prevEl = document.getElementById('step-' + currentStep);
        if(prevEl) {
          prevEl.style.display = 'block';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }

    // Force hide all steps except step-0 initially (assuming step-0 is the first)
    // Actually the HTML might have them visible/hidden by default, we just manage them.
    
    document.querySelectorAll('div[id^="step-"]').forEach((stepEl) => {
      // --- 1. Fix Back Button ---
      // Find back buttons (look for arrowLeft svg or text 'voltar'/'back')
      const allButtons = Array.from(stepEl.querySelectorAll('button, a, div[role="button"]'));
      const backButtons = allButtons.filter(el => 
        el.innerHTML.includes('arrowLeft') || 
        el.textContent.trim().toLowerCase() === 'back' || 
        el.textContent.trim().toLowerCase() === 'voltar'
      );

      backButtons.forEach(btn => {
        // Strip native onclick
        btn.removeAttribute('onclick');
        // Replace with clone to remove native event listeners
        const clone = btn.cloneNode(true);
        btn.parentNode.replaceChild(clone, btn);
        clone.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          goBack();
        });
      });

      // --- 2. Fix Quiz Options ---
      // Find options (classes containing option-background)
      const options = Array.from(stepEl.querySelectorAll('.option-background-default, .option-background-contrast, .option-background-bubble, .option-background-fetured, .btn-theme'));
      
      // Also some options might just be buttons that are not back or continuar
      const otherButtons = allButtons.filter(el => 
        !el.innerHTML.includes('arrowLeft') && 
        !el.textContent.trim().toLowerCase().includes('continuar') &&
        !el.innerHTML.includes('M8 5v14l11-7z') && // Ignore play buttons
        el.textContent.trim().length > 0 // Must have text
      );
      
      const allOptions = Array.from(new Set([...options, ...otherButtons]));

      // --- 3. Fix Continuar Button ---
      const continuarButtons = allButtons.filter(el => 
        el.textContent.trim().toLowerCase().includes('continuar')
      );

      if (continuarButtons.length > 0) {
        // Step HAS a Continuar button. Options just toggle selection, do not advance.
        allOptions.forEach(opt => {
          // Remove native onclick
          opt.removeAttribute('onclick');
          const clone = opt.cloneNode(true);
          opt.parentNode.replaceChild(clone, opt);
          
          clone.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (clone.classList.contains('selected')) {
              clone.classList.remove('selected');
              clone.style.opacity = '1';
              clone.style.transform = 'scale(1)';
              clone.style.border = '';
            } else {
              clone.classList.add('selected');
              clone.style.opacity = '0.7';
              clone.style.transform = 'scale(0.98)';
              clone.style.border = '2px solid #a855f7';
            }
          });
        });

        continuarButtons.forEach(btn => {
          btn.removeAttribute('onclick');
          const clone = btn.cloneNode(true);
          btn.parentNode.replaceChild(clone, btn);
          
          clone.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const hasSelection = stepEl.querySelectorAll('.selected').length > 0;
            const textInput = stepEl.querySelector('input[type="text"], input[type="number"], input[type="email"]');
            const hasInput = textInput && textInput.value.trim() !== '';
            
            if (hasSelection || hasInput) {
              clone.style.opacity = '0.7';
              clone.style.transform = 'scale(0.98)';
              setTimeout(goToNextStep, 150);
            } else {
              alert('Por favor, selecione uma opção ou preencha o campo para continuar.');
            }
          });
        });
      } else {
        // Step DOES NOT have a Continuar button. Clicking an option advances immediately.
        allOptions.forEach(opt => {
          opt.removeAttribute('onclick');
          const clone = opt.cloneNode(true);
          opt.parentNode.replaceChild(clone, opt);
          
          clone.addEventListener('click', (e) => {
            // Check if it's inside a slider or video, do not intercept if so!
            // Sliders usually have images and no quiz text options.
            // If it's a known option, we advance.
            e.preventDefault();
            e.stopPropagation();
            clone.style.opacity = '0.7';
            clone.style.transform = 'scale(0.98)';
            setTimeout(goToNextStep, 150);
          });
        });
      }
      
      // Note: We leave the slider arrows completely untouched because they don't have text "continuar" 
      // and they don't have text so otherButtons won't match them, 
      // and they are not back buttons. They will retain their native behavior!
    });
  });
</script>`;

html = html.replace(/<script>\s*window\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>/, newScript);

fs.writeFileSync('index.html', html, 'utf8');
console.log('SPA script fixed');

