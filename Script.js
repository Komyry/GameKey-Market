document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Корзина (массив объектов)
    let cart = [];

    // База данных игр (можно расширить)
    const games = {
        '1': { id: '1', name: 'Cyberpunk 2077', price: 1999, discount: 3499, image: 'https://via.placeholder.com/60x60?text=CYBER' },
        '2': { id: '2', name: 'The Witcher 3: Wild Hunt', price: 1499, discount: 2499, image: 'https://via.placeholder.com/60x60?text=WITCHER' },
        '3': { id: '3', name: 'Doom Eternal', price: 1299, discount: 2199, image: 'https://via.placeholder.com/60x60?text=DOOM' },
        '4': { id: '4', name: 'Grand Theft Auto V', price: 999, discount: 1999, image: 'https://via.placeholder.com/60x60?text=GTA' }
    };

    // Кнопки "В корзину" (добавляем слушатели событий)
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gameId = this.getAttribute('data-id');
            const game = games[gameId];

            // Проверяем, есть ли игра уже в корзине
            const existingItem = cart.find(item => item.id === gameId);

            if (existingItem) {
                alert('Игра уже в корзине!');
                return;
            }

            // Добавляем игру в корзину
            cart.push(game);
            updateCart();
        });
    });

    // Открытие/закрытие корзины
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'block';
        updateCart();
    });

    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });

    // Закрытие при клике на фон
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Очистка корзины (опционально: кнопка "Очистить")
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            alert('Спасибо за заказ!\nМы свяжемся с вами shortly.');
            cart = [];
            updateCart();
        } else {
            alert('Ваша корзина пуста!');
        }
    });

    // Обновление корзины (отображение товаров и суммы)
    function updateCart() {
        // Очистка контейнера товаров
        cartItemsContainer.innerHTML = '';

        // Подсчёт общей суммы
        let total = 0;
        cart.forEach(item => {
            total += item.price;
        });

        // Обновление отображения суммы и количества товаров
        cartTotal.textContent = total;
        cartCount.textContent = cart.length;

        // Добавление товаров в корзину
        if (cart.length > 0) {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" class="cart-item-image" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">${item.price} ₽</p>
                    </div>
                    <button class="remove-item" data-id="${item.id}">×</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });

            // Добавление слушателей для кнопок удаления
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const gameId = this.getAttribute('data-id');
                    cart = cart.filter(item => item.id !== gameId);
                    updateCart();
                });
            });
        } else {
            cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Корзина пуста</p>';
        }
    }
});
// -------- ДОБАВИТЬ В КОНЕЦ script.js --------
document.addEventListener('DOMContentLoaded', function() {
    // -------- Уже имеющийся код корзины --------
    // ... (всё, что было раньше)

    // -------- Новый код поиска игр --------
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const gameCards = document.querySelectorAll('.game-card');

    /**
     * Фильтрует игры по введённому запросу.
     */
    function filterGames() {
        const searchQuery = searchInput.value.toLowerCase();

        gameCards.forEach(card => {
            const gameName = card.querySelector('h3').textContent.toLowerCase();

            if (gameName.includes(searchQuery)) {
                card.classList.add('highlight');
                card.style.display = 'block';
            } else {
                card.classList.remove('highlight');
                card.style.display = 'none';
            }
        });
    }

    // -------- Слушатели событий --------
    searchButton.addEventListener('click', filterGames);

    // -------- Опционально: по клику вне поля скрыть результаты --------
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-bar')) {
            // Сброс поиска при клике вне поля
            searchInput.value = '';
            filterGames();
        }
    });
});

// Добавьте это в ваш существующий script.js
document.addEventListener('DOMContentLoaded', function() {
    // ... (ваш существующий код)

    // Проверка авторизации на главной странице
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('userName').textContent = `Привет, ${currentUser.name}!`;
        document.getElementById('userInfo').style.display = 'flex';
    }

    // Кнопка выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            alert('Вы вышли из аккаунта!');
            window.location.href = 'login.html';
        });
    }
});