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

      if (continuarButtons.length > 0) {
        // Step HAS a Continuar button. Options do not advance, wait for Continuar.
        allOptions.forEach(opt => {
          opt.removeAttribute('onclick');
          const clone = opt.cloneNode(true);
          opt.parentNode.replaceChild(clone, opt);
          
          clone.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const stepText = stepEl.textContent.toLowerCase();
            const isMulti = stepText.includes('todas las que') || stepText.includes('todas as que') || stepText.includes('mais de uma');

            if (!isMulti) {
              // Unselect others for single-choice
              stepEl.querySelectorAll('.selected').forEach(current => {
                if (current !== clone) {
                  current.classList.remove('selected');
                  current.style.border = '';
                  current.style.backgroundColor = '';
                }
              });
              // Uncheck other radios/checkboxes
              stepEl.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
                  if (!clone.contains(input)) input.checked = false;
              });
            }

            if (clone.classList.contains('selected')) {
              clone.classList.remove('selected');
              clone.style.opacity = '1';
              clone.style.transform = 'scale(1)';
              clone.style.border = '';
              clone.style.backgroundColor = '';
              const input = clone.querySelector('input[type="radio"], input[type="checkbox"]');
              if (input) input.checked = false;
            } else {
              clone.classList.add('selected');
              clone.style.opacity = '0.9';
              clone.style.transform = 'scale(0.98)';
              clone.style.border = '2px solid #db2777'; // Pink 600
              clone.style.backgroundColor = '#fdf2f8'; // Pink 50
              const input = clone.querySelector('input[type="radio"], input[type="checkbox"]');
              if (input) input.checked = true;
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
            
            let canAdvance = false;
            let errorMsg = 'Por favor, selecione uma opção ou preencha o campo para continuar.';

            if (textInput) {
                // If there's a text input, it MUST be filled
                if (hasInput) {
                    canAdvance = true;
                } else {
                    errorMsg = 'Por favor, preencha o campo para continuar.';
                }
            } else {
                // No text input. We need either a selection or no options at all (e.g. quote pages)
                if (hasSelection || allOptions.length === 0) {
                    canAdvance = true;
                } else {
                    errorMsg = 'Por favor, selecione uma opção para continuar.';
                }
            }
            
            if (canAdvance) {
              clone.style.opacity = '0.7';
              clone.style.transform = 'scale(0.98)';
              setTimeout(goToNextStep, 150);
            } else {
              alert(errorMsg);
            }
          });
        });
      } else {
        // Step DOES NOT have a Continuar button. Clicking an option selects it (pink) and advances after 500ms!
        allOptions.forEach(opt => {
          opt.removeAttribute('onclick');
          const clone = opt.cloneNode(true);
          opt.parentNode.replaceChild(clone, opt);
          
          clone.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Unselect others for single-choice feel by querying the live DOM
            stepEl.querySelectorAll('.selected').forEach(current => {
              current.classList.remove('selected');
              current.style.border = '';
              current.style.backgroundColor = '';
            });
            
            clone.classList.add('selected');
            clone.style.opacity = '0.9';
            clone.style.transform = 'scale(0.98)';
            clone.style.border = '2px solid #db2777'; // Pink 600
            clone.style.backgroundColor = '#fdf2f8'; // Pink 50
            
            setTimeout(goToNextStep, 500);
          });
        });
      }

      // --- 4. Fix Sliders (Roleta de kg/peso/altura) ---
      stepEl.querySelectorAll('.swiper').forEach(swiperContainer => {
          const wrapper = swiperContainer.querySelector('.swiper-wrapper');
          if (!wrapper) return;
          
          wrapper.style.display = 'flex';
          wrapper.style.overflowX = 'auto';
          wrapper.style.scrollSnapType = 'x mandatory';
          wrapper.style.setProperty('transform', 'none', 'important');
          
          // Add a custom class for hiding scrollbars (we will inject the css once)
          wrapper.classList.add('custom-hide-scroll');
          
          const slides = Array.from(wrapper.querySelectorAll('.swiper-slide'));
          slides.forEach(slide => slide.style.scrollSnapAlign = 'center');
          
          // Find the big text element nearby (the text-4xl span)
          const bigText = swiperContainer.closest('div.relative, div.w-full').parentElement.querySelector('span.text-4xl');
          if (!bigText) return;
          
          // Set initial position based on active slide
          const activeSlide = wrapper.querySelector('.swiper-slide-active') || slides[Math.floor(slides.length / 2)];
          
          const updateSlider = () => {
             const wrapperCenter = wrapper.getBoundingClientRect().left + wrapper.offsetWidth / 2;
             let closestSlide = null;
             let minDiff = Infinity;
             
             slides.forEach(slide => {
                 const rect = slide.getBoundingClientRect();
                 const slideCenter = rect.left + rect.width / 2;
                 const diff = Math.abs(slideCenter - wrapperCenter);
                 if (diff < minDiff) {
                     minDiff = diff;
                     closestSlide = slide;
                 }
             });
             
             if (closestSlide) {
                 const index = slides.indexOf(closestSlide);
                 const firstSpan = wrapper.querySelector('.swiper-slide span');
                 if (firstSpan) {
                     const baseNum = parseInt(firstSpan.textContent, 10); 
                     const baseIndex = slides.indexOf(firstSpan.closest('.swiper-slide')); 
                     
                     if (!isNaN(baseNum) && baseIndex !== -1) {
                         const currentNum = baseNum + (index - baseIndex);
                         const small = bigText.querySelector('small');
                         bigText.innerHTML = currentNum + (small ? small.outerHTML : '');
                     }
                 }
             }
          };

          wrapper.addEventListener('scroll', updateSlider, { passive: true });

          // Ensure it scrolls to correct position when this step becomes visible
          const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting && activeSlide) {
                      setTimeout(() => {
                         const centerPos = activeSlide.offsetLeft - (wrapper.offsetWidth / 2) + (activeSlide.offsetWidth / 2);
                         wrapper.scrollLeft = centerPos;
                      }, 50);
                  }
              });
          });
          observer.observe(stepEl);
      });
      
    });
  });
</script>
<style>
.custom-hide-scroll::-webkit-scrollbar { display: none; }
.custom-hide-scroll { -ms-overflow-style: none; scrollbar-width: none; cursor: grab; }
.custom-hide-scroll:active { cursor: grabbing; }
</style>`;

html = html.replace(/<script>\s*window\.addEventListener\('DOMContentLoaded'[\s\S]*?(?:<\/script>\s*<style>[\s\S]*?<\/style>|<\/script>)/, newScript);

fs.writeFileSync('index.html', html, 'utf8');
console.log('SPA script fixed');

