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
      <img src="" alt="">
    </div>
  `;
  document.body.appendChild(modal);

  const modalTitle = modal.querySelector('#image-modal-title');
  const modalImage = modal.querySelector('img');
  const closeButton = modal.querySelector('.image-modal-close');
  let activeTrigger = null;

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    if (activeTrigger) activeTrigger.focus();
    activeTrigger = null;
  };

  galleryImages.forEach((image) => {
    image.setAttribute('tabindex', '0');
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `Open larger image of ${image.alt}`);

    const figure = image.closest('.rug-tile');
    if (figure && !figure.querySelector('.rug-zoom-hint')) {
      const zoomHint = document.createElement('span');
      zoomHint.className = 'rug-zoom-hint';
      zoomHint.textContent = 'View larger';
      figure.appendChild(zoomHint);
    }

    const openModal = () => {
      const caption = figure ? figure.querySelector('figcaption') : null;
      activeTrigger = image;
      modalTitle.textContent = caption ? caption.textContent : image.alt;
      modalImage.src = image.currentSrc || image.src;
      modalImage.alt = image.alt;
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

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}
