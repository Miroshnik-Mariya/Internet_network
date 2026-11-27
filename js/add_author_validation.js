(function () { 
    'use strict'; //строгий режим

    const form = document.getElementById('add-author-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    const fields = [
        {
            id: 'fullname',
            validate: (v) => {
                if (!v.trim()) return 'Введите имя автора.';
                if (v.trim().length < 3) return 'Имя автора должно содержать минимум 3 символа.';
                if (v.trim().length > 150) return 'Имя автора не должно превышать 150 символов.';
                if (!/^[А-Яа-яЁёA-Za-z\s.\-]+$/.test(v.trim())) {
                    return 'Только буквы, пробелы, дефисы и точки.';
                }
                return '';
            },
        },
        {
            id: 'country',
            validate: (v) => {
                if (!v.trim()) return 'Укажите страну.';
                if (v.trim().length < 2) return 'Название страны должно содержать минимум 2 символа.';
                if (!/^[А-Яа-яЁёA-Za-z\s\-]+$/.test(v.trim())) {
                    return 'Только буквы, пробелы и дефисы.';
                }
                return '';
            },
        },
        {
            id: 'penname',
            // Необязательное поле: если пустое — ок
            validate: (v) => {
                if (!v.trim()) return '';
                if (v.trim().length < 2) return 'Псевдоним должен содержать минимум 2 символа.';
                if (!/^[А-Яа-яЁёA-Za-z\s.\-]+$/.test(v.trim())) {
                    return 'Только буквы, пробелы, дефисы и точки.';
                }
                return '';
            },
        },
        {
            id: 'birthyear',
            validate: (v) => {
                if (v === '') return 'Укажите год рождения.';
                const n = Number(v);
                if (!Number.isInteger(n)) return 'Год должен быть целым числом.';
                if (n < 1000 || n > 2026) return 'Год должен быть в диапазоне 1000–2026.';
                return '';
            },
        },
        {
            id: 'deathyear',
            // Необязательное, но если заполнено — проверяем диапазон и сравнение с годом рождения
            validate: (v) => {
                if (v === '') return '';
                const n = Number(v);
                if (!Number.isInteger(n)) return 'Год должен быть целым числом.';
                if (n < 0 || n > 2026) return 'Год должен быть в диапазоне 0–2026.';

                // Проверка: год смерти не раньше года рождения
                const birthVal = document.getElementById('birthyear').value;
                if (birthVal !== '') {
                    const birth = Number(birthVal);
                    if (Number.isInteger(birth) && n < birth) {
                        return 'Год смерти не может быть раньше года рождения.';
                    }
                }
                return '';
            },
        },
        {
            id: 'genre',
            validate: (v) => {
                if (!v) return 'Выберите основной жанр.';
                return '';
            },
        },
        {
            id: 'biography',
            validate: (v) => {
                const t = v.trim();
                if (!t) return 'Введите биографию.';
                if (t.length < 30) return 'Биография должна содержать минимум 30 символов.';
                if (t.length > 2000) return 'Биография не должна превышать 2000 символов.';
                return '';
            },
        },
        {
            id: 'photo',
            // Необязательное: если пусто — ок; если заполнено — проверяем URL картинки
            validate: (v) => {
                const t = v.trim();
                if (!t) return '';
                if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(t)) {
                    return 'Ссылка должна вести на изображение JPG, PNG или WebP.';
                }
                return '';
            },
        },
    ];


    //добавляем сообщение об ошибке и класс ошибки (если нужно)
    function setFieldState(id, errorMessage) {
        const input = document.getElementById(id); // ищем инпут по id
        const field = input.closest('.form-field'); // ищем родителя
        const errorEl = document.getElementById(id + '-error');
        if (!field || !errorEl) return; // Выходим, если ошибки нет

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

        const error = fieldDef.validate(input.value); //функция проверки
        setFieldState(fieldDef.id, error); //показываем/скрываем ошибку

        return error === ''; //true, если ошибки нет.
    }



    //проверяем все поля через цикл
    function validateAll() {
        let allValid = true;
        fields.forEach((f) => { //пройдем по всем, даже если наткнулись на ошибку
            if (!validateField(f)) allValid = false;
        });
        return allValid;
    }


    //блокировка кнопки 
    function updateSubmitState() {
        const allValid = fields.every((f) => {
            const input = document.getElementById(f.id);
            return input && f.validate(input.value) === ''; //если валидация вернула пустую строку - все верно 
        });
        submitBtn.disabled = !allValid; //иначе кнопка отправки заблокированаи
        if (allValid) {
            formStatus.textContent = 'Форма заполнена корректно — можно отправлять.';
            formStatus.classList.remove('is-error');
        } else {
            formStatus.textContent = '';
        }
        return allValid;
    }


    //обработчик 
    fields.forEach((f) => {
        const input = document.getElementById(f.id);
        if (!input) return;


        //Пользователь ушёл из поля
        input.addEventListener('blur', () => {
            validateField(f);
            updateSubmitState();
        });




        //Пользователь вводит символ
        input.addEventListener('input', () => {
            validateField(f);
            updateSubmitState();
        });



        // Для select выбрал новый пункт
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', () => {
                validateField(f);
                updateSubmitState();
            });
        }

        // Браузер сам хочет показать ошибку
        input.addEventListener('invalid', (e) => e.preventDefault());
    });



    // Особая связь: при изменении года рождения перепроверяем год смерти
    const birthInput = document.getElementById('birthyear');
    const deathInput = document.getElementById('deathyear');
    if (birthInput && deathInput) {
        birthInput.addEventListener('input', () => {
            if (deathInput.value !== '') {
                const deathDef = fields.find(f => f.id === 'deathyear');
                if (deathDef) validateField(deathDef);
            }
            updateSubmitState();
        });
    }


    // отправка формы 
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // отменяем стандартную отправку (перезагрузку страницы).
        if (!validateAll()) {
            formStatus.textContent = 'Пожалуйста, исправьте ошибки в форме.';
            formStatus.classList.add('is-error');
            const firstInvalid = form.querySelector('.form-field.is-invalid input, .form-field.is-invalid textarea, .form-field.is-invalid select');
            if (firstInvalid) firstInvalid.focus();
            return;
        }
        formStatus.textContent = 'Автор успешно прошёл валидацию! (Демо: отправка не выполняется.)';
        formStatus.classList.remove('is-error');
        alert('Демонстрационная форма: автор не будет сохранён, так как это учебный пример. Спасибо!');
    });

    // кнопка серая (поля пусты) при перезагрузке страницы 
    updateSubmitState(); 
})();