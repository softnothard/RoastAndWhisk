const separator = ';';
const ITEM_SEPARATOR = ':';

let cart = (function() {
    const cartString = localStorage.getItem('shoppingCart');
    if (!cartString) {
        return []; 
    }

    return cartString.split(separator).map((item) => {
        const [name, price, quantity] = item.split(ITEM_SEPARATOR);
        return { name, price: parseFloat(price), quantity: parseInt(quantity, 10) };
    });
})();

function saveCart() {
    const cartString = cart.map((item) => `${item.name}${ITEM_SEPARATOR}${item.price}${ITEM_SEPARATOR}${item.quantity}`).join(separator);
    localStorage.setItem('shoppingCart', cartString); 
}

function addToCart(product, quantity = 1) {
    const existingItem = cart.find(item => item.name === product.name);

    if (existingItem) {
        existingItem.quantity += parseInt(quantity, 10);
    } else {
        product.quantity = parseInt(quantity, 10);
        cart.push(product);
    }

    saveCart(); 
    updateCartDisplay(); 
}

function cartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

function updateCartDisplay() {
    const cartElement = document.getElementById('cart');
    if (!cartElement) return; 

    cartElement.innerHTML = ''; 

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerText = `${item.name} x ${item.quantity}: ₱${(item.price * item.quantity)}.00` + "______________";

        const removeButton = document.createElement('button');
        removeButton.innerText = "Remove";
        removeButton.onclick = () => removeFromCart(index);

        itemElement.appendChild(removeButton);
        cartElement.appendChild(itemElement);
    });

    
    const totalElement = document.createElement('div');
    totalElement.innerText = `Total: ₱${cartTotal()}`;
    cartElement.appendChild(totalElement);
}

function removeFromCart(index) {
    cart.splice(index, 1); 
    saveCart(); 
    updateCartDisplay(); 
}

function toggleCart() {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.style.display = (cartElement.style.display === 'none') ? 'block' : 'none';
    }
}

function proceedToCheckout() {
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerAddress = document.getElementById('customer-address').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const deliveryTime = document.getElementById('delivery-time').value;
    const paymentAmount = document.getElementById('payment-amount').value;

    if (!customerName || !customerEmail || !customerAddress || !customerPhone || !deliveryTime || !paymentAmount) {
        alert("Please complete all required fields before proceeding.");
        return;
    }
}

function generateReceipt(name, email, address, phone, deliveryTime, paymentAmount) {
    let receipt = `Name: ${name}\nEmail: ${email}\nAddress: ${address}\nContact Number: ${phone}\n\n`;
    receipt += "Items in Cart:\n";
    cart.forEach(item => {
        receipt += `${item.name} x ${item.quantity}: ₱${(item.price * item.quantity).toFixed(2)}\n`;
    });
    receipt += `\nTotal: ₱${cartTotal()}\nTransport Will Start At: ${deliveryTime}\nPayment Amount: ₱${paymentAmount}\nChange: ₱${(paymentAmount - cartTotal()).toFixed(2)}`;
    return receipt;
}

function selectTransportation(imgElement) {
    const transportation = imgElement.alt.split(' ')[0];
    alert(`Selected transportation: ${transportation}`);
}

function updateCheckoutPage() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = ''; 

    let total = 0;

    cart.forEach((item) => {
        const li = document.createElement('li');
        li.innerText = `${item.name} x ${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`;
        
        cartItems.appendChild(li);

        total += item.price * item.quantity; 
    });

    cartTotal.innerText = total.toFixed(2); 
}

updateCheckoutPage();