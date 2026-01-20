// Shopping cart array

// Funcionalidad para los enlaces de redes sociales
document.addEventListener('DOMContentLoaded', function () {
    const socialLinks = document.querySelectorAll('.cosmeticSocialLink');
    socialLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            alert('Vas a salir del sitio para visitar nuestra red social.');
        });
    });
});
let cart = [];

// Load cart from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartDisplay();
    
    // Event delegation for remove buttons
    document.getElementById('cart-items').addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const productName = e.target.getAttribute('data-product-name');
            // Find original product name (not escaped) from cart
            const cartItem = cart.find(item => escapeHtml(item.name) === productName);
            if (cartItem) {
                removeFromCart(cartItem.name);
            }
        }
    });
});

// Add item to cart
function addToCart(name, price) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    // Escape HTML to prevent XSS
    const escapedName = escapeHtml(name);
    showNotification(`${escapedName} añadido al carrito`);
}

// Remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartDisplay();
    // Escape HTML to prevent XSS
    const escapedName = escapeHtml(name);
    showNotification(`${escapedName} eliminado del carrito`);
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
        cartTotal.textContent = '0';
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        // Escape HTML to prevent XSS
        const escapedName = escapeHtml(item.name);
        
        itemsHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${escapedName}</div>
                    <div class="cart-item-price">€${item.price} x ${item.quantity} = €${itemTotal}</div>
                </div>
                <button class="remove-btn" data-product-name="${escapedName}">Eliminar</button>
            </div>
        `;
    });
    
    cartItems.innerHTML = itemsHTML;
    cartTotal.textContent = total.toFixed(2);
}

// Toggle cart modal
function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.toggle('active');
}

// Close cart when clicking outside
window.addEventListener('click', (event) => {
    const cartModal = document.getElementById('cart-modal');
    if (event.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    alert(`¡Gracias por tu compra!\n\nProductos: ${itemCount}\nTotal: €${total.toFixed(2)}\n\nEn breve recibirás un email de confirmación.`);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartDisplay();
    toggleCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('mobileShopCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('mobileShopCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Add animation styles once
let notificationStylesAdded = false;
function addNotificationStyles() {
    if (!notificationStylesAdded) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        notificationStylesAdded = true;
    }
}

// Show notification
function showNotification(message) {
    addNotificationStyles();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
