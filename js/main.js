/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ===== MOBILE NAV ===== */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});
navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menú');
}));

/* ===== HERO BG PARALLAX ===== */
const heroBgImg = document.querySelector('.hero-bg img');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    heroBgImg.style.transform = `scale(1.04) translateY(${window.scrollY * 0.12}px)`;
  }
}, { passive: true });

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ===== LIGHTBOX ===== */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');
const lbPrev   = document.getElementById('lbPrev');
const lbNext   = document.getElementById('lbNext');

let sectionItems = [], currentIndex = 0;

function openLightbox(item) {
  const grid = item.closest('.masonry-grid');
  sectionItems = [...grid.querySelectorAll('.gallery-item')];
  currentIndex = sectionItems.indexOf(item);
  lbImg.src = sectionItems[currentIndex].dataset.src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 300);
}

function navigate(dir) {
  currentIndex = (currentIndex + dir + sectionItems.length) % sectionItems.length;
  lbImg.style.opacity = '0';
  setTimeout(() => { lbImg.src = sectionItems[currentIndex].dataset.src; lbImg.style.opacity = '1'; }, 150);
}

document.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => openLightbox(item)));
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click',  () => navigate(-1));
lbNext.addEventListener('click',  () => navigate(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   navigate(-1);
  if (e.key === 'ArrowRight')  navigate(1);
});

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll(
  '.step, .style-card, .gallery-section, .call-offer-wrap, .about-grid, .faq-item, .cta-final-wrap, .gallery-section-header, .stats-bar'
);
revealEls.forEach(el => el.classList.add('reveal'));

new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' }).observe
? (() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => io.observe(el));
  })()
: revealEls.forEach(el => el.classList.add('visible'));
