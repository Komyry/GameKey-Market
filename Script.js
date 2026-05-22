/**
 * Игральный магазин - JavaScript
 * Включает:
 * - Отображение игр
 * - Фильтрацию по жанрам/платформам/цене
 * - Поиск по содержимому
 * - Корзину покупок
 * - Окно оплаты
 */
document.addEventListener('DOMContentLoaded', () => {
    // ================== МОДЕЛЬ ДАННЫХ ==================
    const gamesData = [
        {
            id: 1,
            title: 'Cyberpunk 2077 Ultimate Edition',
            price: 2499,
            originalPrice: 3499,
            discount: 29,
            description: 'Оптимизированная версия культовой ролевой игры в киберпанке.',
            genres: ['RPG', 'Action', 'Sci-Fi'],
            platforms: ['PC', 'PS5', 'Xbox Series X|S'],
            image: 'https://via.placeholder.com/300x450?text=Cyberpunk+2077'
        },
        {
            id: 2,
            title: 'Stray',
            price: 999,
            originalPrice: null,
            discount: null,
            description: 'Игра про кота-робота в Министерстве Магии.',
            genres: ['Adventure', 'Puzzle', 'Indie'],
            platforms: ['PC', 'PS5', 'Xbox Series X|S'],
            image: 'https://via.placeholder.com/300x450?text=Stray'
        },
        // Дополнительные игры можно добавить здесь
        {
            id: 3,
            title: 'Hogwarts Legacy',
            price: 1499,
            originalPrice: 1999,
            discount: 25,
            description: 'Приключения в Волшебном мире Хогвартса.',
            genres: ['RPG', 'Action', 'Fantasy'],
            platforms: ['PC', 'PS5', 'Xbox Series X|S'],
            image: 'https://via.placeholder.com/300x450?text=Hogwarts+Legacy'
        },
        {
            id: 4,
            title: 'Forza Horizon 5',
            price: 1999,
            originalPrice: null,
            discount: null,
            description: 'Гонки по Мексике с открытым миром.',
            genres: ['Racing', 'Open World'],
            platforms: ['PC', 'PS5', 'Xbox Series X|S'],
            image: 'https://via.placeholder.com/300x450?text=Forza+Horizon+5'
        },
        {
            id: 5,
            title: 'Elden Ring',
            price: 1999,
            originalPrice: 2499,
            discount: 20,
            description: 'Демонология от FromSoftware.',
            genres: ['Action RPG', 'Dark Fantasy'],
            platforms: ['PC', 'PS5', 'Xbox Series X|S'],
            image: 'https://via.placeholder.com/300x450?text=Elden+Ring'
        }
    ];

    // ================== СОСТОЯНИЕ ==================
    let cart = [];
    const filters = {
        search: '',
        genres: [],
        platforms: [],
        maxPrice: 5000
    };

    // ================== DOM-ЭЛЕМЕНТЫ ==================
    const elements = {
        gameGrid: document.getElementById('gameGrid'),
        searchInput: document.getElementById('searchInput'),
        cartButton: document.querySelector('.cart-icon'),
        cartCount: document.getElementById('cartCount'),
        modalCart: document.getElementById('cartModal'),
        modalCartItems: document.getElementById('cartItems'),
        modalCartTotal: document.getElementById('cartTotal'),
        modalClose: document.querySelectorAll('.modal-close'),
        modalCheckout: document.getElementById('checkoutBtn'),
        modalPayment: document.getElementById('paymentModal'),
        paymentForm: document.getElementById('paymentForm'),
        paymentAmount: document.getElementById('paymentAmount'),
        filterGenres: document.querySelectorAll('input[name="genre"]'),
        filterPlatforms: document.querySelectorAll('input[name="platform"]'),
        filterPriceRange: document.getElementById('priceRange'),
        filterMaxPriceDisplay: document.getElementById('maxPrice')
    };

    // ================== РЕНДЕРИНГ ==================
    /**
     * Отображение списка игр
     * @param {Array} games - Массив игр для отображения
     */
    function renderGames(games) {
        elements.gameGrid.innerHTML = '';

        games.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <div class="game-image">
                    <img src="${game.image}" alt="${game.title}">
                </div>
                <div class="game-info">
                    <h3>${game.title}</h3>
                    <div class="price">
                        ${game.originalPrice ?
                            `<span class="original">${game.originalPrice} ₽</span>` :
                            ''}
                        <span class="current">${game.price} ₽</span>
                        ${game.discount ? `<span class="discount">${game.discount}%</span>` : ''}
                    </div>
                    <div class="game-tags">
                        ${game.genres.map(genre => `<span class="tag">${genre}</span>`).join('')}
                    </div>
                    <div class="game-platforms">
                        ${game.platforms.map(platform => `<span class="platform">${platform}</span>`).join('')}
                    </div>
                    <button class="add-to-cart" data-id="${game.id}">Купить</button>
                </div>
            `;

            elements.gameGrid.appendChild(card);
        });

        // Привязка обработчиков к кнопкам
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameId = parseInt(e.target.closest('.add-to-cart').dataset.id);
                addToCart(gameId);
            });
        });

        // Привязка обработчиков к карточкам (переход к деталям)
        elements.gameGrid.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const gameId = parseInt(e.target.closest('.add-to-cart').dataset.id);
                    showGameDetails(gameId);
                }
            });
        });
    }

    /**
     * Отображение деталей игры
     * @param {number} gameId - ID игры
     */
    function showGameDetails(gameId) {
        const game = gamesData.find(g => g.id === gameId);
        if (!game) return;

        const modal = document.createElement('div');
        modal.className = 'game-details-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">×</button>
                <div class="game-detail-image">
                    <img src="${game.image}" alt="${game.title}">
                </div>
                <div class="game-detail-info">
                    <h2>${game.title}</h2>
                    <div class="price">
                        ${game.originalPrice ?
                            `<span class="original">${game.originalPrice} ₽</span>` :
                            ''}
                        <span class="current">${game.price} ₽</span>
                        ${game.discount ? `<span class="discount">${game.discount}%</span>` : ''}
                    </div>
                    <div class="detail-description">${game.description}</div>
                    <div class="detail-tags">
                        <div class="genres">Жанры: ${game.genres.join(', ')}</div>
                        <div class="platforms">Платформы: ${game.platforms.join(', ')}</div>
                    </div>
                    <button class="buy-now" data-id="${game.id}">Купить</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.querySelector('.game-details-modal .modal-close').addEventListener('click', () => {
            modal.remove();
        });

        document.querySelector('.game-details-modal .buy-now').addEventListener('click', (e) => {
            addToCart(gameId);
            modal.remove();
        });
    }

    /**
     * Рендеринг корзины
     */
    function renderCart() {
        elements.modalCartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="item-info">
                    <h4>${item.title}</h4>
                    <p>${item.price} ₽ × ${item.quantity}</p>
                </div>
                <div class="item-controls">
                    <button class="remove-item" data-id="${item.id}">−</button>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                    <span class="item-total">${(item.price * item.quantity).toLocaleString()} ₽</span>
                </div>
            `;
            elements.modalCartItems.appendChild(cartItem);
        });

        // Привязка обработчиков
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameId = parseInt(e.target.closest('.remove-item').dataset.id);
                removeFromCart(gameId);
            });
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameId = parseInt(e.target.closest('.increase-quantity').dataset.id);
                increaseItemQuantity(gameId);
            });
        });
    }

    // ================== ЛОГИКА КОРЗИНЫ ==================
    /**
     * Добавление игры в корзину
     * @param {number} gameId - ID игры
     */
    function addToCart(gameId) {
        const game = gamesData.find(g => g.id === gameId);
        if (!game) return;

        const existingItem = cart.find(item => item.id === gameId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({...game, quantity: 1});
        }

        updateCartUI();
    }

    /**
     * Удаление игры из корзины
     * @param {number} gameId - ID игры
     */
    function removeFromCart(gameId) {
        const index = cart.findIndex(item => item.id === gameId);
        if (index > -1) {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            updateCartUI();
        }
    }

    /**
     * Увеличение количества игры в корзине
     * @param {number} gameId - ID игры
     */
    function increaseItemQuantity(gameId) {
        const index = cart.findIndex(item => item.id === gameId);
        if (index > -1) {
            cart[index].quantity += 1;
            updateCartUI();
        }
    }

    /**
     * Обновление UI корзины
     */
    function updateCartUI() {
        renderCart();
        updateCartTotal();
        updateCartCount();
    }

    /**
     * Подсчет общей суммы корзины
     */
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        elements.modalCartTotal.textContent = total.toLocaleString();
    }

    /**
     * Обновление счетчика корзины
     */
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        elements.cartCount.textContent = totalItems;
    }

    // ================== ФИЛЬТРЫ ==================
    /**
     * Применение фильтров
     */
    function applyFilters() {
        const filteredGames = gamesData.filter(game => {
            // Поиск по названию/описанию
            const searchMatch = game.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                               game.description.toLowerCase().includes(filters.search.toLowerCase());

            // Фильтр по жанрам
            const genreMatch = filters.genres.length === 0 ||
                              filters.genres.some(genre => game.genres.includes(genre));

            // Фильтр по платформам
            const platformMatch = filters.platforms.length === 0 ||
                                 filters.platforms.some(platform => game.platforms.includes(platform));

            // Фильтр по цене
            const priceMatch = game.price <= filters.maxPrice;

            return searchMatch && genreMatch && platformMatch && priceMatch;
        });

        renderGames(filteredGames);
    }

    /**
     * Обновление фильтров
     */
    function updateFilters() {
        filters.search = elements.searchInput.value;
        filters.genres = Array.from(elements.filterGenres)
            .filter(el => el.checked)
            .map(el => el.value);

        filters.platforms = Array.from(elements.filterPlatforms)
            .filter(el => el.checked)
            .map(el => el.value);

        filters.maxPrice = parseInt(elements.filterPriceRange.value);
        elements.filterMaxPriceDisplay.textContent = filters.maxPrice.toLocaleString();

        applyFilters();
    }

    // ================== ОПЛАТА ==================
    /**
     * Открытие окна оплаты
     */
    function openPaymentModal() {
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        elements.paymentAmount.value = total.toLocaleString();
        elements.modalPayment.style.display = 'flex';
    }

    // ================== ИНИЦИАЛИЗАЦИЯ ==================
    // Начальная отрисовка
    renderGames(gamesData);

    // Привязка событий
    elements.cartButton.addEventListener('click', () => {
        elements.modalCart.style.display = 'flex';
        updateCartUI();
    });

    elements.modalClose.forEach(button => {
        button.addEventListener('click', () => {
            elements.modalCart.style.display = 'none';
            elements.modalPayment.style.display = 'none';
        });
    });

    elements.modalCheckout.addEventListener('click', openPaymentModal);

    elements.paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Спасибо за покупку! Ваши ключи будут отправлены на почту.');
        cart = [];
        updateCartUI();
        elements.modalPayment.style.display = 'none';
    });

    // Фильтры
    elements.searchInput.addEventListener('input', () => {
        updateFilters();
    });

    elements.filterGenres.forEach(genre => {
        genre.addEventListener('change', updateFilters);
    });

    elements.filterPlatforms.forEach(platform => {
        platform.addEventListener('change', updateFilters);
    });

    elements.filterPriceRange.addEventListener('input', updateFilters);

    // Завершение работы
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            elements.modalCart.style.display = 'none';
            elements.modalPayment.style.display = 'none';
        }
    });
});
