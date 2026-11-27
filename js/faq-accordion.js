/* Аккордеон FAQ */

(function () {
    'use strict';

    const faq = document.getElementById('faq');
    if (!faq) return;

    faq.addEventListener('click', (e) => {
        const question = e.target.closest('.faq__question');
        if (!question) return;

        const item = question.closest('.faq__item');
        const answer = item.querySelector('.faq__answer');
        const isOpen = question.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            question.setAttribute('aria-expanded', 'false');
            answer.hidden = true;
            item.classList.remove('is-open');
        } else {
            question.setAttribute('aria-expanded', 'true');
            answer.hidden = false;
            item.classList.add('is-open');
        }
    });
})();