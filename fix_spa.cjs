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

    document.querySelectorAll('div[id^="step-"]').forEach((stepEl) => {
      // --- 1. Fix Back Button ---
      const allButtons = Array.from(stepEl.querySelectorAll('button, a, div[role="button"]'));
      const backButtons = allButtons.filter(el => 
        el.innerHTML.includes('arrowLeft') || 
        el.textContent.trim().toLowerCase() === 'back' || 
        el.textContent.trim().toLowerCase() === 'voltar'
      );

      backButtons.forEach(btn => {
        btn.removeAttribute('onclick');
        const clone = btn.cloneNode(true);
        btn.parentNode.replaceChild(clone, btn);
        clone.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          goBack();
        });
      });

      // --- 2. Fix Quiz Options ---
      const allOptions = Array.from(stepEl.querySelectorAll('.option-background-default, .option-background-contrast, .option-background-bubble, .option-background-fetured, .btn-theme'));
      
      // Options just toggle selection, do not advance.
      allOptions.forEach(opt => {
        opt.removeAttribute('onclick');
        const clone = opt.cloneNode(true);
        opt.parentNode.replaceChild(clone, opt);
        
        clone.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          // Toggle selection
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

      // --- 3. Fix Continuar Button ---
      let continuarButtons = allButtons.filter(el => {
         const text = el.textContent.trim().toLowerCase();
         const isOption = allOptions.includes(el);
         const isBack = backButtons.includes(el);
         const isPlay = el.innerHTML.includes('M8 5v14l11-7z');
         
         if (isOption || isBack || isPlay) return false;
         
         // If it has text like Continuar/Empezar/Start, or if it's a primary button
         if (text.includes('continuar') || text.includes('empezar') || text.includes('start') || el.tagName === 'BUTTON') {
             return true;
         }
         return false;
      });

      // If no Continuar button exists on this step, and it has options, inject one!
      if (continuarButtons.length === 0 && allOptions.length > 0) {
         const newBtn = document.createElement('button');
         newBtn.textContent = 'Continuar';
         newBtn.className = 'w-full py-4 text-white text-lg font-bold rounded-full mt-4 transition-transform shadow-[0_4px_14px_0_rgb(168,85,247,39%)] hover:shadow-[0_6px_20px_rgba(168,85,247,23%)] hover:bg-[rgba(168,85,247,0.9)] px-8 py-2 bg-[#a855f7] rounded-md text-white font-light transition duration-200 ease-linear';
         newBtn.style.marginTop = '20px';
         
         // Find a good place to append it (at the end of the step content)
         const contentDiv = stepEl.querySelector('.main-content') || stepEl.firstElementChild;
         if (contentDiv) {
             contentDiv.appendChild(newBtn);
             continuarButtons.push(newBtn);
         }
      }

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
          
          // Allow advance if:
          // 1. User selected something
          // 2. Or user typed something
          // 3. Or there are no options to select on this step (e.g. quote pages)
          if (hasSelection || hasInput || allOptions.length === 0) {
            clone.style.opacity = '0.7';
            clone.style.transform = 'scale(0.98)';
            setTimeout(goToNextStep, 150);
          } else {
            alert('Por favor, selecione uma opção ou preencha o campo para continuar.');
          }
        });
      });
      
    });
  });
</script>`;

html = html.replace(/<script>\s*window\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>/, newScript);

fs.writeFileSync('index.html', html, 'utf8');
console.log('SPA script fixed');

