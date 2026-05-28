document.addEventListener('DOMContentLoaded', function() {
    // Получаем необходимые элементы
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const togglePassword = document.getElementById('togglePassword');

    // Переключение между вкладками
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(`${tab}Tab`).classList.add('active');
        });
    });

    // Показать/скрыть пароль
    togglePassword.addEventListener('click', () => {
        const passwordInput = document.getElementById('registerPassword');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Проверка пароля на совпадение
    document.getElementById('registerPassword').addEventListener('input', function() {
        const password = this.value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                document.getElementById('registerConfirmPassword').style.borderColor = '#e74c3c';
            } else {
                document.getElementById('registerConfirmPassword').style.borderColor = '';
            }
        }
    });

    // Проверка на совпадение паролей
    document.getElementById('registerConfirmPassword').addEventListener('input', function() {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = this.value;

        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '';
            }
        }
    });

    // Загрузка пользователей при старте
    let users = JSON.parse(localStorage.getItem('gamekeysUsers')) || [];

    // Форма регистрации
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        // Проверка полей
        if (!name || !email || !password || !confirmPassword) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        if (password !== confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }

        // Проверка существования почты
        const emailExists = users.some(user => user.email === email);
        if (emailExists) {
            alert('Этот email уже зарегистрирован!');
            return;
        }

        // Добавляем нового пользователя
        users.push({ name, email, password });
        localStorage.setItem('gamekeysUsers', JSON.stringify(users));

        alert('Регистрация успешна!');
        switchToLoginTab();
    });

    // Форма входа
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        // Проверка полей
        if (!email || !password) {
            alert('Пожалуйста, введите email и пароль!');
            return;
        }

        // Поиск пользователя
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            // Сохраняем текущего пользователя в сессии
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert('Вы успешно вошли!');
            window.location.href = 'index.html';
        } else {
            alert('Неверный email или пароль!');
        }
    });

    // Переключение на вкладку входа
    function switchToLoginTab() {
        tabButtons[0].click();
    }
});