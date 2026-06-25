const products = [
    { id: 1, name: "Afeitadora Eléctrica Pro", category: "afeitadoras", price: 199.99, description: "Afeitadora premium con tecnología de 5 cuchillas flotantes", emoji: "💈" },
    { id: 2, name: "Funda iPhone 15 Pro", category: "fundas", price: 79.99, description: "Funda de cuero genuino con protección total", emoji: "📱" },
    { id: 3, name: "Cable USB-C Premium", category: "cables", price: 49.99, description: "Cable de carga rápida con revestimiento de nylon", emoji: "🔌" },
    { id: 4, name: "Afeitadora Rotativa Deluxe", category: "afeitadoras", price: 249.99, description: "Sistema de afeitado rotativo de 3 cabezales con sensor", emoji: "💈" },
    { id: 5, name: "Funda Samsung Galaxy S24", category: "fundas", price: 74.99, description: "Protección elegante con diseño minimalista", emoji: "📱" },
    { id: 6, name: "Cargador Rápido 65W", category: "otros", price: 89.99, description: "Cargador de pared con tecnología de carga ultrarrápida", emoji: "🔋" },
    { id: 7, name: "Afeitadora Barba Premium", category: "afeitadoras", price: 159.99, description: "Especializada en recorte de barba con precisión", emoji: "💈" },
    { id: 8, name: "Funda AirPods Pro", category: "fundas", price: 39.99, description: "Funda protectora con carabina de metal", emoji: "🎧" },
    { id: 9, name: "Hub USB-C Multifunción", category: "otros", price: 129.99, description: "7 puertos: USB 3.0, HDMI, SD, Ethernet", emoji: "🔗" },
    { id: 10, name: "Afeitadora Viaje Compacta", category: "afeitadoras", price: 99.99, description: "Diseño portátil perfecto para viajeros", emoji: "✈️" },
    { id: 11, name: "Funda iPad Premium", category: "fundas", price: 119.99, description: "Funda inteligente con soporte multángulo", emoji: "📲" },
    { id: 12, name: "Cable Lightning Certificado", category: "cables", price: 44.99, description: "Cable MFi certificado por Apple de 2 metros", emoji: "⚡" }
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
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No se encontraron productos</p>';
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
        btn.textContent.toLowerCase().includes(currentFilter === 'all' ? 'todos' : currentFilter)
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
    showNotification('Producto añadido al carrito');
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
    showNotification('Producto eliminado del carrito');
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
    notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: #d4af37; color: #1a1a1a; padding: 15px 20px; border-radius: 3px; z-index: 2000; font-weight: bold; animation: slideIn 0.3s ease-out;`;
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