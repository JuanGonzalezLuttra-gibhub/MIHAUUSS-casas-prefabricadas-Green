/* 
  Mihauss Casas Prefabricadas - Main JavaScript Logic
  Funcionalidades interactivas, animaciones y calculadora de presupuesto real.
*/

document.addEventListener('DOMContentLoaded', () => {
  initScrollEffects();
  initMobileMenu();
  initRevealAnimations();
  initAccordions();
  initCalculator();
  initContactForm();
  initMobileInteractions();
});

/* 1. Header Scroll & Active Links */
function initScrollEffects() {
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Scroll state header
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });
}

/* 2. Mobile Menu Toggle */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    
    // Simple bar animation
    const spans = toggleBtn.querySelectorAll('span');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none';
    spans[1].style.opacity = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
      const spans = toggleBtn.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });
}

/* 3. Intersection Observer for Scroll Reveals */
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal-el');
  
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* 4. Accordion Logic (Constructive System & Details) */
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');
      
      // Close all other items in the same container
      const parent = item.parentElement;
      parent.querySelectorAll('.accordion-item').forEach(child => {
        child.classList.remove('open');
        child.querySelector('.accordion-body').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        const body = item.querySelector('.accordion-body');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* 5. Budget Calculator */
function initCalculator() {
  const rangeArea = document.getElementById('calc-area');
  const labelArea = document.getElementById('calc-area-val');
  
  const checkProyecto = document.getElementById('check-proyecto');
  const checkEstudios = document.getElementById('check-estudios');
  const checkTerreno = document.getElementById('check-terreno');
  const selectPiscina = document.getElementById('select-piscina');
  const selectExteriores = document.getElementById('select-exteriores');
  
  const resultTotal = document.getElementById('calc-total');

  if (!rangeArea) return; // Guard clause

  // Event Listeners
  rangeArea.addEventListener('input', updateCalculator);
  checkProyecto.addEventListener('change', updateCalculator);
  checkEstudios.addEventListener('change', updateCalculator);
  checkTerreno.addEventListener('change', updateCalculator);
  selectPiscina.addEventListener('change', updateCalculator);
  selectExteriores.addEventListener('change', updateCalculator);

  function updateCalculator() {
    const area = parseInt(rangeArea.value);
    labelArea.textContent = area + ' m²';

    // Base Construction Cost: 2.350€/m2
    const baseCost = area * 2350;
    let total = baseCost;

    // Proyecto & Licencias: 195€/m2
    if (checkProyecto.checked) {
      total += (area * 195);
    }

    // Estudios previos e informes: 8.800€
    if (checkEstudios.checked) {
      total += 8800;
    }

    // Acompañamiento en adquisición del terreno: 5.400€
    if (checkTerreno.checked) {
      total += 5400;
    }

    // Piscina
    const piscinaVal = selectPiscina.value;
    if (piscinaVal === '6x3') {
      total += 32500; // 6 x 3,5m
    } else if (piscinaVal === '7x3') {
      total += 39300; // 7 x 3,5m
    } else if (piscinaVal === '8x4') {
      total += 43500; // 8 x 4m
    }

    // Acondicionamiento Exteriores (Estimated packages based on standard dimensions)
    const extVal = selectExteriores.value;
    if (extVal === 'basico') {
      // 50m² césped artificial + 30m² grava: 50*73 + 30*85 = 3650 + 2550 = 6200€
      total += 6200;
    } else if (extVal === 'medio') {
      // 100m² césped + 50m² hormigón impreso + 30m² grava: 100*73 + 50*210 + 30*85 = 7300 + 10500 + 2550 = 20350€
      total += 20350;
    } else if (extVal === 'completo') {
      // 150m² césped + 80m² hormigón + 50m² grava: 150*73 + 80*210 + 50*85 = 10950 + 16800 + 4250 = 32000€
      total += 32000;
    }

    // Format output
    resultTotal.textContent = new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(total);
  }

  // Initial calculation run
  updateCalculator();
}

/* 6. Multi-step Lead Qualification Wizard */
function initContactForm() {
  // ---- Config ----
  // IMPORTANT: Replace with the actual Formspree endpoint after registering at formspree.io
  // Example: 'https://formspree.io/f/xpwzqbdo'
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/info@casasprefabricadasmihauss.es';

  const TOTAL_STEPS = 4;

  // ---- State ----
  let currentStep = 1;
  const answers = { parcela: '', superficie: '', presupuesto: '' };

  // ---- DOM refs ----
  const progressBar   = document.getElementById('wizard-progress-bar');
  const stepIndicators = document.querySelectorAll('.wstep');
  const wizardForm    = document.getElementById('wizard-contact-form');
  const statusDiv     = document.getElementById('form-status');
  const submitBtn     = document.getElementById('wizard-submit-btn');

  if (!progressBar) return; // guard: not on this page

  // ---- Helpers ----
  function showStep(newStep, direction) {
    const current = document.getElementById('wizard-step-' + currentStep) ||
                    document.getElementById('wizard-step-success');
    if (current) {
      current.classList.remove('active');
      current.style.display = 'none';
    }

    currentStep = newStep;

    const next = newStep === 'success'
      ? document.getElementById('wizard-step-success')
      : document.getElementById('wizard-step-' + newStep);

    if (next) {
      next.style.display = 'block';
      // Restart animation
      next.classList.remove('active', 'anim-back');
      void next.offsetWidth; // reflow
      if (direction === 'back') next.classList.add('anim-back');
      next.classList.add('active');
    }

    updateProgress();

    // Populate summary when reaching step 4
    if (newStep === 4) populateSummary();
  }

  function populateSummary() {
    const elParcela     = document.getElementById('summary-parcela');
    const elSuperficie  = document.getElementById('summary-superficie');
    const elPresupuesto = document.getElementById('summary-presupuesto');
    if (elParcela)     elParcela.textContent     = answers.parcela     || '—';
    if (elSuperficie)  elSuperficie.textContent  = answers.superficie  || '—';
    if (elPresupuesto) elPresupuesto.textContent = answers.presupuesto || '—';
  }

  function updateProgress() {
    const numericStep = currentStep === 'success' ? TOTAL_STEPS : currentStep;
    const pct = (numericStep / TOTAL_STEPS) * 100;
    progressBar.style.width = Math.min(pct, 100) + '%';

    stepIndicators.forEach((dot) => {
      const dotStep = parseInt(dot.dataset.step);
      dot.classList.remove('active', 'completed');
      if (dotStep === numericStep) {
        dot.classList.add('active');
      } else if (dotStep < numericStep) {
        dot.classList.add('completed');
      }
    });

    // Hide step indicator on success
    const indicator = document.getElementById('wizard-steps-indicator');
    if (indicator) indicator.style.opacity = currentStep === 'success' ? '0' : '1';
  }

  function setHiddenFields() {
    const fParcela    = document.getElementById('hidden-parcela');
    const fSuperficie = document.getElementById('hidden-superficie');
    const fPresupuesto= document.getElementById('hidden-presupuesto');
    if (fParcela)     fParcela.value     = answers.parcela;
    if (fSuperficie)  fSuperficie.value  = answers.superficie;
    if (fPresupuesto) fPresupuesto.value = answers.presupuesto;
  }

  // ---- Wire up option buttons (steps 1-3) ----
  document.querySelectorAll('.wizard-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name  = btn.dataset.name;
      const value = btn.dataset.value;

      // Visual selected feedback (brief flash, then advance)
      btn.classList.add('selected');
      setTimeout(() => btn.classList.remove('selected'), 200);

      answers[name] = value;

      // Advance step
      if (currentStep < TOTAL_STEPS) {
        showStep(currentStep + 1, 'forward');
      }
    });
  });

  // ---- Back buttons ----
  [2, 3, 4].forEach((step) => {
    const backBtn = document.getElementById('wizard-back-' + step);
    if (backBtn) {
      backBtn.addEventListener('click', () => showStep(step - 1, 'back'));
    }
  });

  // ---- Step 4 form submit ----
  if (wizardForm) {
    wizardForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name  = document.getElementById('wiz-name').value.trim();
      const phone = document.getElementById('wiz-phone').value.trim();
      const email = document.getElementById('wiz-email').value.trim();

      // Basic validation
      if (!name || !phone || !email) {
        showStatus('error', 'Por favor, completa todos los campos.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showStatus('error', 'Introduce un email válido.');
        return;
      }

      // Set hidden qualification fields
      setHiddenFields();

      // Disable submit
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';

      try {
        const payload = {
          nombre:     name,
          telefono:   phone,
          email:      email,
          parcela:    answers.parcela,
          superficie: answers.superficie,
          presupuesto: answers.presupuesto,
          _subject:   'Nuevo lead cualificado – Mihauss Casas Prefabricadas'
        };

        const res = await fetch(FORMSPREE_ENDPOINT, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body:    JSON.stringify(payload)
        });

        if (res.ok) {
          showStep('success', 'forward');
          progressBar.style.width = '100%';
        } else {
          const data = await res.json().catch(() => ({}));
          showStatus('error', data.error || 'Error al enviar. Inténtalo de nuevo o llámanos.');
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Recibir estudio gratuito <svg viewBox="0 0 448 512" width="12" height="12" fill="currentColor" style="margin-left:8px"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg>';
        }
      } catch (err) {
        showStatus('error', 'No se pudo conectar. Revisa tu conexión o llámanos al 660 654 606.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Recibir estudio gratuito';
      }
    });
  }

  function showStatus(type, msg) {
    if (!statusDiv) return;
    statusDiv.className = 'form-status ' + type;
    statusDiv.textContent = msg;
    statusDiv.style.display = 'block';
  }

  // ---- Init progress ----
  updateProgress();
}

/* 7. Mobile Interactive Highlights (Scroll & Touch) */
function initMobileInteractions() {
  // Solo se ejecuta en pantallas <= 768px de ancho
  if (window.innerWidth > 768) return;

  const targets = document.querySelectorAll('.benefit-card, .review-card, .timeline-item, .faq-item, .wizard-option');

  // A. Iluminación por Scroll (añade .scroll-active cuando el elemento pasa por el centro de la pantalla)
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0,
      rootMargin: '-30% 0px -30% 0px' // Enfoca el 40% central de la pantalla
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-active');
        } else {
          entry.target.classList.remove('scroll-active');
        }
      });
    }, observerOptions);

    targets.forEach(target => observer.observe(target));
  } else {
    // Alternativa para navegadores que no soporten IntersectionObserver
    window.addEventListener('scroll', () => {
      const centerY = window.innerHeight / 2;
      targets.forEach(target => {
        const rect = target.getBoundingClientRect();
        if (rect.top <= centerY + 100 && rect.bottom >= centerY - 100) {
          target.classList.add('scroll-active');
        } else {
          target.classList.remove('scroll-active');
        }
      });
    });
  }

  // B. Iluminación al Toque (añade .active-touch al tocar y lo retira al levantar el dedo)
  targets.forEach(target => {
    target.addEventListener('touchstart', () => {
      target.classList.add('active-touch');
    }, { passive: true });

    target.addEventListener('touchend', () => {
      // Pequeño retardo para que la iluminación sea perceptible
      setTimeout(() => {
        target.classList.remove('active-touch');
      }, 150);
    }, { passive: true });

    target.addEventListener('touchcancel', () => {
      target.classList.remove('active-touch');
    }, { passive: true });
  });
}

