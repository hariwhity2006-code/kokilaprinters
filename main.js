/*
  KOKILA PRINTERS - Static JS Setup
*/

// Page Loader
window.addEventListener('load',function(){
  setTimeout(function(){
    var l=document.getElementById('pageLoader');
    if(l){l.style.opacity='0';l.style.visibility='hidden';
    setTimeout(function(){l.style.display='none';},600);}
  },2500);
});

document.addEventListener('DOMContentLoaded', () => {

  // --- Utility ---
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  // --- 2. Active Nav Link Indicator ---
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a:not(.btn)');
  navLinks.forEach(link => {
    // Exact match or if at root and link is index.html
    const linkPath = new URL(link.href).pathname;
    if (currentPath === linkPath || (currentPath === '/' && linkPath.endsWith('index.html'))) {
      link.classList.add('active');
    }
  });

  // --- 3. Navbar Shrink on Scroll ---
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- 4. Mobile Menu Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });
  }

  // --- 5. Ripple Effect on Buttons ---
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      let x = e.clientX - e.target.getBoundingClientRect().left;
      let y = e.clientY - e.target.getBoundingClientRect().top;
      
      let ripples = document.createElement('span');
      ripples.className = 'ripple';
      ripples.style.left = x + 'px';
      ripples.style.top = y + 'px';
      this.appendChild(ripples);
      
      setTimeout(() => {
        ripples.remove();
      }, 600);
    });
  });

  // --- INTERACTIONS (DESKTOP ONLY) ---
  if (!isTouchDevice) {
    
    // A. Magnetic Button Effect
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Max 10px offset
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });

    // B. Tilt Card Effect & Glow Follow
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Glow
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Tilt (max 8 degrees)
        if (card.classList.contains('tilt-card')) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -8;
          const rotateY = ((x - centerX) / centerX) * 8;
          
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        }
      });
      card.addEventListener('mouseleave', () => {
        if (card.classList.contains('tilt-card')) {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
      });
    });

    // C. Particle Background (index.html Hero)
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let width, height;
      let particles = [];
      const particleCount = 60;

      function resize() {
        // Only set canvas size within its parent to avoid expanding
        width = canvas.parentElement.offsetWidth || window.innerWidth;
        height = canvas.parentElement.offsetHeight || 600;
        canvas.width = width;
        canvas.height = height;
      }

      class Particle {
        constructor() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = (Math.random() - 0.5) * 0.5;
          this.radius = 1.5;
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > width) this.vx *= -1;
          if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fill();
        }
      }

      function initParticles() {
        resize();
        particles = [];
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle());
        }
      }

      function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
          
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 120) {
              const opacity = 1 - (dist / 120);
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(animateParticles);
      }

      window.addEventListener('resize', resize);
      initParticles();
      animateParticles();
    }

  } else {
    // --- INTERACTIONS (MOBILE/TOUCH) ---
    // Scale on press Instead of tilt
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
      card.addEventListener('touchstart', () => {
        card.style.transform = 'scale(0.97)';
      }, {passive: true});
      card.addEventListener('touchend', () => {
        card.style.transform = 'scale(1)';
      });
    });
  }

  // --- 6. Typing Text Animation (index.html Hero) ---
  const typewriterElement = document.getElementById('heroTypewriter');
  if (typewriterElement) {
    const text1 = "Your Vision, Perfectly Printed.";
    const text2 = "Your Future, Perfectly Protected.";
    let isDeleting = false;
    let textIndex = 0;
    let charIndex = 0;

    function type() {
      const currentText = textIndex === 0 ? text1 : text2;
      
      if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = 60;
      if (isDeleting) typeSpeed /= 2; // delete faster

      if (!isDeleting && charIndex === currentText.length) {
        // Pause at end
        typeSpeed = 1500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % 2;
        typeSpeed = 500; // Pause before typing new word
      }

      setTimeout(type, typeSpeed);
    }
    
    // Start typing after loader finishes
    setTimeout(type, 1600);
  }

  // --- 7. Enhanced Scroll Reveal Animations ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger reveal
        entry.target.classList.add('is-visible');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translate(0, 0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right').forEach(el => {
    observer.observe(el);
  });

  // --- 8. Stats Counter (Refactored) ---
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statsStr = entry.target.getAttribute('data-value');
        const suffix = entry.target.getAttribute('data-suffix') || '';
        const targetNumber = parseInt(statsStr, 10);
        let currentNumber = 0;
        
        let increment = 1;
        if(targetNumber === 25000) increment = 500;
        else if(targetNumber === 25) increment = 1;
        else if(targetNumber === 1000) increment = 20;
        else if(targetNumber === 100) increment = 2;
        
        const timer = setInterval(() => {
          currentNumber += increment; 
          if (currentNumber >= targetNumber) {
            entry.target.textContent = targetNumber.toLocaleString() + suffix; // Add suffix on finish
            clearInterval(timer);
          } else {
            entry.target.textContent = currentNumber.toLocaleString();
          }
        }, 30); // fast count
        observer.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
  });

  // --- 9. Form Handlers ---
  
  // Contact Form (EmailJS Integration)
  const contactForm = document.getElementById('contactForm');
  if (contactForm && typeof emailjs !== 'undefined') {
    // TO ACTIVATE: Sign up at emailjs.com, create a Gmail service,
    // create a template with variables: {{from_name}}, {{phone}},
    // {{email}}, {{service}}, {{message}}, then replace the 3 
    // placeholder values above with your real IDs.
    emailjs.init("J5jwx6jxnbjFYiwEO");

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const statusDiv = document.getElementById('formStatus');
      const submitBtn = document.getElementById('submitBtn');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;

      const templateParams = {
        from_name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value,
        to_email: 'kokilaprinterskpm@gmail.com'
      };

      emailjs.send("service_yck4w5f", "template_m75bmuq", templateParams)
        .then(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          statusDiv.innerHTML = '<div style="padding: 1rem; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); color: #4ade80; border-radius: 8px; margin-top: 1rem;">✓ Message sent! We\'ll contact you within 24 hours.</div>';
          
          setTimeout(() => {
            statusDiv.innerHTML = '';
          }, 5000);
        })
        .catch((error) => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          statusDiv.innerHTML = '<div style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; border-radius: 8px; margin-top: 1rem;">✗ Failed to send. Please WhatsApp us directly.</div>';
          console.error("EmailJS Error:", error);
        });
    });
  }

  // Insurance Calculator Form (Simulated)
  const calcForm = document.getElementById('calcForm');
  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const type = document.getElementById('calcType').value;
      const yearStr = document.getElementById('calcYear').value;
      const resultDiv = document.getElementById('calcResult');
      
      let baseAmount = 0;
      
      switch(type) {
        case 'bike': baseAmount = 1200; break;
        case 'car': baseAmount = 8500; break;
        case 'bus': baseAmount = 35000; break;
        case 'auto': baseAmount = 6000; break;
        case 'jcb': baseAmount = 25000; break;
        case 'personal': baseAmount = 500; break;
        case 'family': baseAmount = 12000; break;
        default: baseAmount = 5000;
      }

      // Add simple random variance
      const variance = Math.floor(Math.random() * (baseAmount * 0.2));
      const estimate = baseAmount + variance;

      resultDiv.style.opacity = '1';
      resultDiv.innerHTML = `
        <div style="padding: 1.5rem; background: rgba(6, 182, 212, 0.1); border: 2px dashed rgba(6, 182, 212, 0.3); border-radius: 12px; margin-top: 2rem;">
          <h4 style="color: var(--cyan); margin-bottom: 0.5rem; font-family: monospace; text-transform: uppercase;">Estimated Premium</h4>
          <div style="font-size: 2.5rem; font-weight: bold; color: white;">₹${estimate.toLocaleString()} <span style="font-size: 1rem; color: var(--text-muted); font-weight: normal;">/ year</span></div>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">*This is an approximate value based on standard metrics. Please contact us for the exact quote.</p>
        </div>
      `;
    });
  }

});

// ===== PAGE-SPECIFIC BACKGROUND ANIMATIONS =====
(function() {
  var bgAnim = document.querySelector('.bg-animation');
  if (!bgAnim) return;
  var body = document.body;

  // --- HOME: Star Field ---
  if (body.classList.contains('page-home')) {
    // Twinkling stars
    for (var i = 0; i < 60; i++) {
      var star = document.createElement('div');
      var size = (Math.random() * 2 + 0.5);
      star.style.cssText = 'position:absolute;border-radius:50%;' +
        'background:white;' +
        'width:' + size + 'px;' +
        'height:' + size + 'px;' +
        'left:' + Math.random() * 100 + '%;' +
        'top:' + Math.random() * 100 + '%;' +
        'animation:twinkle ' + (Math.random() * 3 + 2) +
        's ease-in-out infinite alternate;' +
        'animation-delay:' + Math.random() * 4 + 's;' +
        'opacity:' + (Math.random() * 0.5 + 0.2) + ';';
      bgAnim.appendChild(star);
    }
    // Shooting stars
    for (var j = 0; j < 5; j++) {
      var shoot = document.createElement('div');
      shoot.style.cssText = 'position:absolute;' +
        'width:' + (Math.random() * 80 + 60) + 'px;' +
        'height:1px;' +
        'background:linear-gradient(90deg,white,transparent);' +
        'top:' + Math.random() * 60 + '%;' +
        'right:' + Math.random() * 30 + '%;' +
        'animation:shoot ' + (Math.random() * 2 + 3) +
        's linear infinite;' +
        'animation-delay:' + (j * 2) + 's;' +
        'opacity:0.6;transform:rotate(-35deg);';
      bgAnim.appendChild(shoot);
    }
  }

  // --- PRINTING: Ink Blobs ---
  if (body.classList.contains('page-printing')) {
    var colors = [
      'rgba(124,58,237,0.08)',
      'rgba(6,182,212,0.07)',
      'rgba(236,72,153,0.06)',
      'rgba(245,158,11,0.05)'
    ];
    // Diagonal lines overlay
    var lines = document.createElement('div');
    lines.className = 'ink-lines';
    bgAnim.appendChild(lines);
    // Ink blobs
    for (var b = 0; b < 8; b++) {
      var blob = document.createElement('div');
      var blobSize = Math.random() * 300 + 200;
      blob.style.cssText = 'position:absolute;border-radius:50%;' +
        'width:' + blobSize + 'px;' +
        'height:' + blobSize + 'px;' +
        'background:' + colors[b % colors.length] + ';' +
        'filter:blur(60px);' +
        'left:' + (Math.random() * 100) + '%;' +
        'top:' + (Math.random() * 100) + '%;' +
        'animation:inkFloat ' + (Math.random() * 10 + 15) +
        's ease-in-out infinite alternate;' +
        'animation-delay:-' + (Math.random() * 15) + 's;';
      bgAnim.appendChild(blob);
    }
  }

  // --- INSURANCE: Shield Pulse + Orbs ---
  if (body.classList.contains('page-insurance')) {
    // Floating shield SVGs
    var shieldSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>';
    for (var s = 0; s < 6; s++) {
      var shield = document.createElement('div');
      var shieldSize = Math.random() * 40 + 40;
      shield.innerHTML = shieldSVG;
      shield.style.cssText = 'position:absolute;' +
        'width:' + shieldSize + 'px;' +
        'height:' + shieldSize + 'px;' +
        'color:rgba(6,182,212,' + (Math.random() * 0.04 + 0.04) + ');' +
        'left:' + (Math.random() * 90 + 5) + '%;' +
        'top:' + (Math.random() * 90 + 5) + '%;' +
        'animation:shieldFloat ' + (Math.random() * 7 + 8) +
        's ease-in-out infinite alternate;' +
        'animation-delay:-' + (Math.random() * 10) + 's;';
      bgAnim.appendChild(shield);
    }
    // Glowing orbs
    var orbData = [
      { size: 500, color: 'rgba(6,182,212,0.08)', top: '-100px', left: '-100px', blur: 100, dur: 20 },
      { size: 400, color: 'rgba(37,99,235,0.06)', bottom: '-100px', right: '-100px', blur: 120, dur: 22 },
      { size: 300, color: 'rgba(20,184,166,0.05)', top: '50%', left: '50%', blur: 80, dur: 18, center: true }
    ];
    orbData.forEach(function(o) {
      var orb = document.createElement('div');
      orb.className = 'orb';
      var css = 'position:absolute;border-radius:50%;' +
        'width:' + o.size + 'px;height:' + o.size + 'px;' +
        'background:radial-gradient(circle,' + o.color + ',transparent 70%);' +
        'filter:blur(' + o.blur + 'px);' +
        'animation:orbPulse ' + o.dur + 's ease-in-out infinite alternate;';
      if (o.center) {
        css += 'top:50%;left:50%;transform:translate(-50%,-50%);';
      } else {
        if (o.top) css += 'top:' + o.top + ';';
        if (o.left) css += 'left:' + o.left + ';';
        if (o.bottom) css += 'bottom:' + o.bottom + ';';
        if (o.right) css += 'right:' + o.right + ';';
      }
      orb.style.cssText = css;
      bgAnim.appendChild(orb);
    });
  }

  // --- CONTACT: Corner Glow Orbs ---
  if (body.classList.contains('page-contact')) {
    var glows = [
      { size: 300, color: 'rgba(124,58,237,0.12)', blur: 80, top: '-80px', left: '-80px', dur: 6 },
      { size: 250, color: 'rgba(6,182,212,0.10)', blur: 80, top: '-60px', right: '-60px', dur: 7 },
      { size: 200, color: 'rgba(236,72,153,0.08)', blur: 60, bottom: '-50px', left: '-50px', dur: 5 },
      { size: 280, color: 'rgba(124,58,237,0.10)', blur: 90, bottom: '-70px', right: '-70px', dur: 8 }
    ];
    glows.forEach(function(g) {
      var glow = document.createElement('div');
      var css = 'position:absolute;border-radius:50%;' +
        'width:' + g.size + 'px;height:' + g.size + 'px;' +
        'background:radial-gradient(circle,' + g.color + ',transparent 70%);' +
        'filter:blur(' + g.blur + 'px);' +
        '--base-opacity:' + g.color.match(/[\d.]+(?=\))/)[0] + ';' +
        'animation:glowPulse ' + g.dur + 's ease-in-out infinite alternate;';
      if (g.top) css += 'top:' + g.top + ';';
      if (g.left) css += 'left:' + g.left + ';';
      if (g.bottom) css += 'bottom:' + g.bottom + ';';
      if (g.right) css += 'right:' + g.right + ';';
      glow.style.cssText = css;
      bgAnim.appendChild(glow);
    });
  }

})();
