/* Кнопка «Наверх» для прокрутки */

(function () {
    'use strict';

    const toTopBtn = document.getElementById('to-top');
    if (!toTopBtn) return;

    const SHOW_AFTER = 400; // px — после какой прокрутки показывать кнопку

    // Оптимизация: scroll-событие вызывается часто → throttle через requestAnimationFrame
    let ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;

        window.requestAnimationFrame(() => {
            const shouldShow = window.scrollY > SHOW_AFTER;
            toTopBtn.hidden = !shouldShow;
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Клик — плавный скролл вверх
    toTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Проверяем при загрузке (если страница открыта не с самого верха)
    onScroll();
})();