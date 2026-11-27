/* «Показать полностью» для длинных блоков */

(function () {
    'use strict';

    const DEFAULT_MAX_HEIGHT = 120; // px — высота свёрнутого блока

    function initCollapsible(wrapper) {
        const content = wrapper.querySelector('.collapsible__content');
        const toggle = wrapper.querySelector('.collapsible__toggle');
        if (!content || !toggle) return;

        const limit = Number(wrapper.dataset.limit) || 200;
        const type = wrapper.dataset.type || 'text';

        // Проверяем, нужно ли сворачивать
        let needsCollapse = false;

        if (type === 'items') {
            const items = content.querySelectorAll('li');
            needsCollapse = items.length > limit;
        } else {
            const text = content.textContent.trim();
            needsCollapse = text.length > limit;
        }

        // Если не нужно — оставляем как есть, кнопку не показываем
        if (!needsCollapse) {
            toggle.hidden = true;
            return;
        }

        // Сворачиваем
        wrapper.classList.add('is-collapsed');
        content.style.maxHeight = DEFAULT_MAX_HEIGHT + 'px';
        toggle.hidden = false;
        toggle.textContent = 'Показать полностью';

        toggle.addEventListener('click', () => {
            const isCollapsed = wrapper.classList.contains('is-collapsed');

            if (isCollapsed) {
                // Раскрываем
                wrapper.classList.remove('is-collapsed');
                wrapper.classList.add('is-expanded');

                // Временно снимаем ограничение, чтобы измерить полную высоту
                content.style.maxHeight = 'none';
                const fullHeight = content.scrollHeight;
                content.style.maxHeight = DEFAULT_MAX_HEIGHT + 'px';

                // Запускаем анимацию до полной высоты
                requestAnimationFrame(() => {
                    content.style.maxHeight = fullHeight + 'px';
                });

                toggle.textContent = 'Свернуть';
            } else {
                // Сворачиваем
                wrapper.classList.remove('is-expanded');
                wrapper.classList.add('is-collapsed');

                content.style.maxHeight = DEFAULT_MAX_HEIGHT + 'px';
                toggle.textContent = 'Показать полностью';
            }
        });
    }

    // Инициализация всех блоков на странице
    document.querySelectorAll('[data-collapsible]').forEach(initCollapsible);
})();