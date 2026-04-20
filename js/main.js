/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ===== MOBILE NAV ===== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===== HERO PARALLAX ===== */
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.15}px)`;
  }
}, { passive: true });

/* ===== LIGHTBOX ===== */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const galleryItems = document.querySelectorAll('.gallery-item');

let sectionItems = [];
let currentIndex = 0;

function openLightbox(clickedItem) {
  const section = clickedItem.closest('.masonry-grid');
  sectionItems = [...section.querySelectorAll('.gallery-item')];
  currentIndex = sectionItems.indexOf(clickedItem);
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
  setTimeout(() => {
    lbImg.src = sectionItems[currentIndex].dataset.src;
    lbImg.style.opacity = '1';
  }, 150);
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => openLightbox(item));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => navigate(-1));
lbNext.addEventListener('click', () => navigate(1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.style-card, .gallery-section, .about-grid, .contact-card, .section-title, .about-text p, .about-stats, .gallery-section-header');
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));
