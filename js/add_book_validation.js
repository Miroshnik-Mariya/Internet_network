    (function () {
    'use strict';

    const form = document.getElementById('add-book-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    const fields = [
        {
            id: 'title',
            validate: (v) => {
                if (!v.trim()) return 'Введите название книги.';
                if (v.trim().length < 2) return 'Название должно содержать минимум 2 символа.';
                if (v.trim().length > 200) return 'Название не должно превышать 200 символов.';
                return '';
            },
        },
        {
            id: 'author',
            validate: (v) => {
                if (!v.trim()) return 'Введите автора книги.';
                if (v.trim().length < 3) return 'Имя автора должно содержать минимум 3 символа.';
                if (!/^[А-Яа-яЁёA-Za-z\s.\-]+$/.test(v.trim())) {
                    return 'Только буквы, пробелы, дефисы и точки.';
                }
                return '';
            },
        },
        {
            id: 'isbn',
            validate: (v) => {
                if (!v.trim()) return 'Введите ISBN.';
                if (!/^97[89]-\d-\d{2}-\d{6}-\d$/.test(v.trim())) {
                    return 'Неверный формат ISBN. Пример: 978-5-04-123456-7';
                }
                return '';
            },
        },
        {
            id: 'year',
            validate: (v) => {
                if (v === '') return 'Укажите год издания.';
                const n = Number(v);
                if (!Number.isInteger(n)) return 'Год должен быть целым числом.';
                if (n < 0 || n > 2026) return 'Год должен быть в диапазоне 0–2026.';
                return '';
            },
        },
        {
            id: 'price',
            validate: (v) => {
                if (v === '') return 'Укажите цену.';
                const n = Number(v);
                if (!Number.isFinite(n)) return 'Цена должна быть числом.';
                if (n < 1 || n > 100000) return 'Цена должна быть в диапазоне 1–100 000 ₽.';
                return '';
            },
        },
        {
            id: 'annotation',
            validate: (v) => {
                const t = v.trim();
                if (!t) return 'Введите аннотацию.';
                if (t.length < 20) return 'Аннотация должна содержать минимум 20 символов.';
                if (t.length > 2000) return 'Аннотация не должна превышать 2000 символов.';
                return '';
            },
        },
        {
            id: 'arrival',
            validate: (v) => {
                if (!v) return 'Укажите дату поступления.';
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const d = new Date(v + 'T00:00:00');
                if (isNaN(d.getTime())) return 'Некорректная дата.';
                if (d > today) return 'Дата не может быть в будущем.';
                return '';
            },
        },
    ];

    function setFieldState(id, errorMessage) {
        const input = document.getElementById(id);
        const field = input.closest('.form-field');
        const errorEl = document.getElementById(id + '-error');
        if (!field || !errorEl) return;

        if (errorMessage) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            errorEl.textContent = errorMessage;
            input.setAttribute('aria-invalid', 'true');
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            errorEl.textContent = '';
            input.setAttribute('aria-invalid', 'false');
        }
    }

    function validateField(fieldDef) {
        const input = document.getElementById(fieldDef.id);
        if (!input) return true;
        const error = fieldDef.validate(input.value);
        setFieldState(fieldDef.id, error);
        return error === '';
    }

    function validateAll() {
        let allValid = true;
        fields.forEach((f) => {
            if (!validateField(f)) allValid = false;
        });
        return allValid;
    }

    function updateSubmitState() {
        const allValid = fields.every((f) => {
            const input = document.getElementById(f.id);
            return input && f.validate(input.value) === '';
        });
        submitBtn.disabled = !allValid;
        if (allValid) {
            formStatus.textContent = 'Форма заполнена корректно — можно отправлять.';
            formStatus.classList.remove('is-error');
        } else {
            formStatus.textContent = '';
        }
        return allValid;
    }

    fields.forEach((f) => {
        const input = document.getElementById(f.id);
        if (!input) return;

        input.addEventListener('blur', () => {
            validateField(f);
            updateSubmitState();
        });

        input.addEventListener('input', () => {
            validateField(f);
            updateSubmitState();
        });

        input.addEventListener('invalid', (e) => e.preventDefault());
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateAll()) {
            formStatus.textContent = 'Пожалуйста, исправьте ошибки в форме.';
            formStatus.classList.add('is-error');
            const firstInvalid = form.querySelector('.form-field.is-invalid input, .form-field.is-invalid textarea');
            if (firstInvalid) firstInvalid.focus();
            return;
        }
        formStatus.textContent = 'Книга успешно прошла валидацию! (Демо: отправка не выполняется.)';
        formStatus.classList.remove('is-error');
        alert('Демонстрационная форма: книга не будет сохранена, так как это учебный пример. Спасибо!');
    });

    updateSubmitState();
})();