document.addEventListener('DOMContentLoaded', () => {

  /* ===== Mobile nav toggle ===== */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ===== Header shadow on scroll ===== */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,0.06)' : 'none';
  });

  /* ===== Animated counters ===== */
  const counters = document.querySelectorAll('.count');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('fr-FR');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('fr-FR');
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ===== Reveal on scroll ===== */
  document.querySelectorAll('.card, .split-text, .split-visual, .calculator, .donation-box, .value-pill, .why-item, .gallery-item, .testimonial').forEach(el => {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ===== Meal calculator (Repas Orphelins) ===== */
  const mealRange = document.getElementById('mealRange');
  const mealCount = document.getElementById('mealCount');
  const mealTotal = document.getElementById('mealTotal');
  const mealDonateBtn = document.getElementById('mealDonateBtn');

  const updateMealCalc = () => {
    const value = mealRange.value;
    mealCount.textContent = value;
    mealTotal.textContent = value;
  };
  mealRange.addEventListener('input', updateMealCalc);
  updateMealCalc();

  mealDonateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const amount = mealRange.value;
    document.getElementById('projectSelect').value = 'orphelins';
    setDonationAmount(amount);
    document.getElementById('don').scrollIntoView({ behavior: 'smooth' });
  });

  /* ===== Donation tabs (ponctuel / mensuel) ===== */
  const donationTabs = document.querySelectorAll('.donation-tab');
  const donateFreq = document.getElementById('donateFreq');
  let currentFreq = 'ponctuel';

  donationTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      donationTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      currentFreq = tab.dataset.type;
      donateFreq.textContent = currentFreq === 'mensuel' ? '/ mois' : '';
    });
  });

  /* ===== Amount selection ===== */
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customAmount = document.getElementById('customAmount');
  const selectedAmount = document.getElementById('selectedAmount');

  function setDonationAmount(value) {
    selectedAmount.textContent = value;
    let matched = false;
    amountBtns.forEach(b => {
      const isMatch = b.dataset.amount === String(value);
      b.classList.toggle('active', isMatch);
      if (isMatch) matched = true;
    });
    if (!matched) customAmount.value = value;
  }
  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAmount.textContent = btn.dataset.amount;
      customAmount.value = '';
    });
  });

  customAmount.addEventListener('input', () => {
    if (customAmount.value) {
      amountBtns.forEach(b => b.classList.remove('active'));
      selectedAmount.textContent = customAmount.value;
    }
  });

  /* ===== Donate submit (placeholder — connect to payment provider) ===== */
  document.getElementById('donateSubmit').addEventListener('click', () => {
    const amount = selectedAmount.textContent;
    const project = document.getElementById('projectSelect').selectedOptions[0].text;
    alert(
      `Merci pour votre générosité !\n\nMontant : ${amount} € (${currentFreq === 'mensuel' ? 'mensuel' : 'ponctuel'})\nProjet : ${project}\n\nCeci est une démonstration : intégrez ici votre plateforme de paiement (HelloAsso, Stripe...) pour finaliser le don.`
    );
  });

  /* ===== "Rejoindre Min's 59" pre-fills contact subject ===== */
  const joinBtn = document.getElementById('joinBtn');
  joinBtn.addEventListener('click', () => {
    document.getElementById('subject').value = 'Devenir bénévole';
  });

  /* ===== Contact form ===== */
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formFeedback.textContent = 'Merci ! Votre message a bien été pris en compte (démonstration — reliez ce formulaire à un service d\'envoi d\'e-mails).';
    contactForm.reset();
  });

  /* ===== Footer year ===== */
  document.getElementById('year').textContent = new Date().getFullYear();

});
