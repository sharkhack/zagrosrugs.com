document.querySelectorAll('.menu-toggle').forEach((button) => {
  const nav = document.getElementById(button.getAttribute('aria-controls'));
  if (!nav) return;

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    button.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    nav.classList.toggle('is-open', !isOpen);
  });
});

// Load the site-wide Tawk.to live chat widget.
var Tawk_API = window.Tawk_API || {};
var Tawk_LoadStart = new Date();
(function () {
  var firstScript = document.getElementsByTagName('script')[0];
  var tawkScript = document.createElement('script');
  tawkScript.async = true;
  tawkScript.src = 'https://embed.tawk.to/6ab34fc39d49773440aba55d/1k366v4u9';
  tawkScript.charset = 'UTF-8';
  tawkScript.setAttribute('crossorigin', '*');
  firstScript.parentNode.insertBefore(tawkScript, firstScript);
})();

const galleryImages = document.querySelectorAll('.rug-tile img');
document.querySelectorAll('.size-group').forEach((sizeGroup) => {
  const rugCards = Array.from(sizeGroup.querySelectorAll('.rug-tile'));
  let nextRugNumber = rugCards.reduce((highest, card) => {
    const number = Number.parseInt(card.dataset.rugNumber, 10);
    return Number.isFinite(number) ? Math.max(highest, number) : highest;
  }, 0);

  rugCards.forEach((card) => {
    if (!card.dataset.rugNumber) {
      nextRugNumber += 1;
      card.dataset.rugNumber = String(nextRugNumber);
    }

    const caption = card.querySelector('figcaption');
    if (caption) {
      caption.textContent = caption.textContent.replace(/\bRug(?:\s*#?\s*\d+)?\b/i, `Rug #${card.dataset.rugNumber}`);
    }
  });
});

if (galleryImages.length) {
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'image-modal-title');
  modal.innerHTML = `
    <div class="image-modal-backdrop" data-close-modal></div>
    <div class="image-modal-panel">
      <button class="image-modal-close" type="button" aria-label="Close image">&times;</button>
      <h2 id="image-modal-title"></h2>
      <div class="image-modal-stage">
        <img src="" alt="">
        <button class="image-modal-nav image-modal-prev" type="button" aria-label="Previous photo">&#8249;</button>
        <button class="image-modal-nav image-modal-next" type="button" aria-label="Next photo">&#8250;</button>
      </div>
      <p class="image-modal-count" aria-live="polite"></p>
    </div>
  `;
  document.body.appendChild(modal);

  const modalTitle = modal.querySelector('#image-modal-title');
  const modalImage = modal.querySelector('img');
  const closeButton = modal.querySelector('.image-modal-close');
  const previousButton = modal.querySelector('.image-modal-prev');
  const nextButton = modal.querySelector('.image-modal-next');
  const imageCount = modal.querySelector('.image-modal-count');
  let activeTrigger = null;
  let activeImages = [];
  let activeImageIndex = 0;

  const showActiveImage = () => {
    const image = activeImages[activeImageIndex];
    if (!image) return;
    modalImage.src = image.currentSrc || image.src;
    modalImage.alt = image.alt;
    imageCount.textContent = activeImages.length > 1 ? `Photo ${activeImageIndex + 1} of ${activeImages.length}` : '';
    previousButton.hidden = activeImages.length < 2;
    nextButton.hidden = activeImages.length < 2;
  };

  const moveImage = (direction) => {
    if (activeImages.length < 2) return;
    activeImageIndex = (activeImageIndex + direction + activeImages.length) % activeImages.length;
    showActiveImage();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    if (activeTrigger) activeTrigger.focus();
    activeTrigger = null;
    activeImages = [];
  };

  galleryImages.forEach((image) => {
    const figure = image.closest('.rug-tile');
    const hasMorePhotos = figure && figure.querySelectorAll('img').length > 1;
    image.setAttribute('tabindex', '0');
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', hasMorePhotos ? `Open photo gallery of ${image.alt}` : `Open larger image of ${image.alt}`);

    if (figure && !figure.querySelector('.rug-zoom-hint')) {
      const zoomHint = document.createElement('span');
      zoomHint.className = 'rug-zoom-hint';
      zoomHint.textContent = figure.querySelectorAll('img').length > 1 ? 'View all photos' : 'View larger';
      figure.appendChild(zoomHint);
    }

    const openModal = () => {
      const caption = figure ? figure.querySelector('figcaption') : null;
      activeTrigger = image;
      modalTitle.textContent = caption ? caption.textContent : image.alt;
      activeImages = figure ? Array.from(figure.querySelectorAll('img')) : [image];
      activeImageIndex = Math.max(0, activeImages.indexOf(image));
      showActiveImage();
      modal.classList.add('is-open');
      document.body.classList.add('modal-open');
      closeButton.focus();
    };

    image.addEventListener('click', openModal);
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal();
      }
    });
  });

  modal.querySelectorAll('[data-close-modal], .image-modal-close').forEach((element) => {
    element.addEventListener('click', closeModal);
  });
  previousButton.addEventListener('click', () => moveImage(-1));
  nextButton.addEventListener('click', () => moveImage(1));

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'ArrowLeft') moveImage(-1);
    if (event.key === 'ArrowRight') moveImage(1);
  });
}
