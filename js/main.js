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

/* ===== GALLERY FILTER ===== */
const galleryCategoryCards = document.getElementById('galleryCategoryCards');
const galleryView = document.getElementById('galleryView');
const galleryBack = document.getElementById('galleryBack');

document.querySelectorAll('.gallery-filter-card').forEach(card => {
  card.addEventListener('click', () => {
    const target = card.dataset.target;
    galleryCategoryCards.hidden = true;
    galleryView.removeAttribute('hidden');
    document.querySelectorAll('#galleryView .gallery-section').forEach(sec => {
      sec.hidden = sec.id !== `sec-${target}`;
    });
    document.getElementById('galeria').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

galleryBack.addEventListener('click', () => {
  galleryView.setAttribute('hidden', '');
  galleryCategoryCards.removeAttribute('hidden');
  document.getElementById('galeria').scrollIntoView({ behavior: 'smooth', block: 'start' });
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

document.querySelectorAll('.masonry-grid').forEach(grid => {
  grid.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (item) openLightbox(item);
  });
});
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

/* ===== POPUP DESCUENTO 15% ===== */
const popup       = document.getElementById('discount-popup');
const popupClose  = document.getElementById('popupClose');
const discountForm = document.getElementById('discountForm');
const popupError  = document.getElementById('popupError');
const popupSuccess = document.getElementById('popupSuccess');
const popupCode   = document.getElementById('popupCode');
const popupCopy   = document.getElementById('popupCopy');

function openPopup() {
  if (localStorage.getItem('jcazt_popup_done')) return;
  popup.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('discountEmail').focus();
}
function closePopup() {
  popup.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

// Mostrar después de 8 segundos o al scroll al 40%
let popupShown = false;
setTimeout(() => { if (!popupShown) { popupShown = true; openPopup(); } }, 8000);
window.addEventListener('scroll', () => {
  if (popupShown || localStorage.getItem('jcazt_popup_done')) return;
  if (window.scrollY > document.body.scrollHeight * 0.4) {
    popupShown = true; openPopup();
  }
}, { passive: true });

popupClose.addEventListener('click', () => {
  localStorage.setItem('jcazt_popup_done', 'dismissed');
  closePopup();
});
popup.addEventListener('click', e => { if (e.target === popup) { localStorage.setItem('jcazt_popup_done', 'dismissed'); closePopup(); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !popup.hasAttribute('hidden')) { localStorage.setItem('jcazt_popup_done', 'dismissed'); closePopup(); } });

discountForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('discountEmail').value.trim();
  const btn = discountForm.querySelector('button[type="submit"]');

  popupError.hidden = true;
  btn.textContent = 'Guardando...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Error al registrar');

    popupCode.textContent = data.code || 'JCAZT15';
    discountForm.hidden = true;
    popupSuccess.hidden = false;
    localStorage.setItem('jcazt_popup_done', 'subscribed');
  } catch (err) {
    popupError.textContent = err.message || 'Hubo un error. Intenta de nuevo.';
    popupError.hidden = false;
    btn.textContent = 'Obtener descuento';
    btn.disabled = false;
  }
});

popupCopy.addEventListener('click', () => {
  navigator.clipboard.writeText(popupCode.textContent).then(() => {
    popupCopy.textContent = '¡Copiado!';
    popupCopy.classList.add('copied');
    setTimeout(() => { popupCopy.textContent = 'Copiar código'; popupCopy.classList.remove('copied'); }, 2000);
  });
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

/* ===== DYNAMIC GALLERY (Supabase) ===== */
const ALT_MAP = { 'jcazt-style': 'Jcazt Style', 'minis-fineline': 'Fine Line', 'conceptual': 'Conceptual', 'nuevo': 'Nuevo' };

async function loadGallery() {
  try {
    const res = await fetch('/api/images');
    if (!res.ok) return;
    const data = await res.json();
    for (const section of ['jcazt-style', 'minis-fineline', 'conceptual', 'nuevo']) {
      const images = data.images?.[section];
      if (!images || images.length === 0) continue;
      const grid = document.querySelector(`#sec-${section} .masonry-grid`);
      const countEl = document.querySelector(`#sec-${section} .section-count`);
      const cardCountEl = document.querySelector(`.gallery-filter-card[data-target="${section}"] .gfc-count`);
      if (!grid) continue;
      grid.innerHTML = images.map(img =>
        `<div class="gallery-item" data-section="${section}" data-src="${img.url}">` +
        `<img src="${img.url}" alt="${ALT_MAP[section]}" loading="lazy" />` +
        `<div class="gallery-overlay"><span>+</span></div></div>`
      ).join('');
      if (countEl) countEl.textContent = `${images.length} piezas`;
      if (cardCountEl) cardCountEl.textContent = `${images.length} piezas`;
    }
  } catch { /* keep static fallback */ }
}
loadGallery();
