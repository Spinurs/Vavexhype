const products = [
    { id: 1, name: "Camiseta Urban Vibes", category: "camisetas", price: 34.99, description: "Algodón 100% premium con estampado exclusivo", emoji: "👕" },
    { id: 2, name: "Sudadera Oversized Black", category: "sudaderas", price: 64.99, description: "Diseño oversized perfecto para tu estilo", emoji: "🖤" },
    { id: 3, name: "Pantalón Cargo Street", category: "pantalones", price: 79.99, description: "Estilo cargo con múltiples bolsillos", emoji: "👖" },
    { id: 4, name: "Hoodie Neon Pink", category: "sudaderas", price: 74.99, description: "Sudadera con capucha en rosa neón vibrante", emoji: "💗" },
    { id: 5, name: "Camiseta Oversized White", category: "camisetas", price: 39.99, description: "Camiseta blanca básica pero premium", emoji: "⚪" },
    { id: 6, name: "Gorro Beanie Urban", category: "accesorios", price: 24.99, description: "Gorro minimalista para cualquier outfit", emoji: "🧢" },
    { id: 7, name: "Chaqueta Denim Vintage", category: "sudaderas", price: 99.99, description: "Chaqueta vaquera con detalles vintage", emoji: "🧥" },
    { id: 8, name: "Cinturón Street Black", category: "accesorios", price: 29.99, description: "Cinturón de cuero genuino negro", emoji: "⬛" },
    { id: 9, name: "Pantalón Jogger Tech", category: "pantalones", price: 69.99, description: "Pantalón jogger con tecnología de tela", emoji: "⚡" },
    { id: 10, name: "Camiseta Tie Dye", category: "camisetas", price: 44.99, description: "Camiseta tie dye multicolor exclusiva", emoji: "🌈" },
    { id: 11, name: "Mochila Urban Backpack", category: "accesorios", price: 89.99, description: "Mochila con estilo urbano y funcional", emoji: "🎒" },
    { id: 12, name: "Sudadera Crop Top", category: "sudaderas", price: 54.99, description: "Sudadera corta tendencia 2024", emoji: "💛" }
];

let cart = [];
let currentFilter = 'all';
let searchTerm = '';

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    loadCartFromStorage();
});

function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    if (productsToRender.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: white;">No se encontraron prendas</p>';
        return;
    }

    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Añadir al Carrito</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

function filterByCategory(category) {
    currentFilter = category;
    updateFilterButtons();
    applyFilters();
}

function updateFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    const activeBtn = Array.from(filterBtns).find(btn => 
        btn.textContent.toLowerCase().includes(currentFilter === 'all' ? 'todo' : currentFilter)
    );
    if (activeBtn) activeBtn.classList.add('active');
}

function filterProducts() {
    searchTerm = document.getElementById('searchInput').value.toLowerCase();
    applyFilters();
}

function applyFilters() {
    let filtered = products;
    if (currentFilter !== 'all') filtered = filtered.filter(p => p.category === currentFilter);
    if (searchTerm) filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm)
    );
    renderProducts(filtered);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) { existingItem.quantity++; } 
    else { cart.push({...product, quantity: 1}); }
    saveCartToStorage();
    updateCart();
    showNotification('¡Prenda añadida al carrito!');
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    let html = '';
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `<div class="cart-item"><div class="cart-item-info"><h4>${item.name}</h4><p>$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p></div><button class="cart-item-remove" onclick="removeFromCart(${item.id})">Eliminar</button></div>`;
    });
    cartItems.innerHTML = html;
    cartTotal.textContent = '$' + total.toFixed(2);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCart();
    showNotification('Prenda eliminada del carrito');
}

function toggleCart() {
    document.getElementById('cartPanel').classList.toggle('active');
}

function saveCartToStorage() {
    localStorage.setItem('vavexhype_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('vavexhype_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCart();
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #ff006e 0%, #ff4081 100%); color: white; padding: 15px 20px; border-radius: 50px; z-index: 2000; font-weight: bold; animation: slideIn 0.3s ease-out; box-shadow: 0 5px 20px rgba(255, 0, 110, 0.4);`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }`;
document.head.appendChild(style);