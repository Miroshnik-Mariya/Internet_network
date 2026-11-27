/*  Лайтбокс для увеличения обложки книги */

(function () {
    'use strict';

    const lightbox = document.getElementById('cover-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');

    if (!lightbox || !lightboxImg || !closeBtn) {
        console.warn('Лайтбокс: не найдены необходимые элементы.');
        return;
    }

    let lastFocusedEl = null;




    /*  Открытие лайтбокса */
    function openLightbox(src, alt, caption) {
        if (!src) return;

        lastFocusedEl = document.activeElement;

        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightboxCaption.textContent = caption || alt || '';

        lightbox.hidden = false;
        document.body.style.overflow = 'hidden'; // блокируем скролл фона

        // фокус внутрь модалки — на кнопку закрытия
        closeBtn.focus();
    }

    /* Закрытие лайтбокса  */
    function closeLightbox() {
        if (lightbox.hidden) return;

        lightbox.hidden = true;
        document.body.style.overflow = '';

        // возвращаем фокус туда, откуда открыли
        if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
            lastFocusedEl.focus();
        }
        lastFocusedEl = null;

        // очищаем src, чтобы не мигало старое изображение при следующем открытии
        setTimeout(() => {
            if (lightbox.hidden) lightboxImg.src = '';
        }, 250);
    }



    /*  клик по любой обложке в каталоге */
    document.addEventListener('click', (e) => {
        const cover = e.target.closest('.card__cover');
        if (!cover) return;

        // берём крупную версию, если есть data-full, иначе src
        const fullSrc = cover.dataset.full || cover.src;
        const alt = cover.alt || '';
        // подпись — название книги из карточки
        const card = cover.closest('.card');
        const titleEl = card ? card.querySelector('.card__title') : null;
        const caption = titleEl ? titleEl.textContent.trim() : alt;

        openLightbox(fullSrc, alt, caption);
    });

    /* Закрытие: крестик, клик по фону, Esc */
    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target.matches('[data-close-lightbox]')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.hidden) {
            closeLightbox();
        }
    });
})();