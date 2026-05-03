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

const galleryImages = document.querySelectorAll('.rug-tile img');

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

    const openModal = () => {
      const figure = image.closest('.rug-tile');
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
