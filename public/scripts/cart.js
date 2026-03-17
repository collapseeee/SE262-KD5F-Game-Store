import { customConfirm } from "./customConfirm.js";

// Checkout popups logics
const cartHeaderSpan = document.getElementById('cart-header-span');
const checkoutHeaderSpan = document.getElementById('checkout-header-span');
const checkoutBtn = document.getElementById("button-checkout")
const couponContainer = document.getElementById('coupon-container');

const paymentContainer = document.getElementById("payment-container")
const paymentPopup = document.getElementById('payment-popup-container');
const paymentPopupOverlay = document.getElementById('payment-popup-overlay');
const paymentProceedBtn = document.getElementById('payment-popup-button-proceed');
const paymentCancelBtn = document.getElementById('payment-popup-button-cancel');

const successPopup = document.getElementById('success-popup-container');
const successPopupOverlay = document.getElementById('success-popup-overlay');
const successProceedBtn = document.getElementById('success-popup-button-proceed');

const backToCartBtn = document.getElementById('back-button');
const paymentTxt = document.getElementById('payment-text')

const cartContainer = document.querySelectorAll('.cart-container');

checkoutBtn.addEventListener('click', (e) => {
    if (cartContainer.length === 0) return;
    
    if (paymentContainer.style.display !== 'block') { // First click, show payment methods.
        cartHeaderSpan.style.color = '#fefefe7e'
        checkoutHeaderSpan.style.display = 'block';
        paymentContainer.style.display = 'block';
        couponContainer.style.display = 'none'
    } else { // Second click, continue payment.
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked');

        if (!selectedMethod) {
            paymentTxt.innerHTML = ('Please select a payment method before proceeding!');
            return;
        }

        const paymentTitle = document.getElementById('payment-popup-h1');
        const paymentMethod = document.getElementById('payment-popup-method');
        const paymentAmount = document.getElementById('payment-popup-amount');
        const paymentImg = document.getElementById('payment-popup-img');
        const totalPrice = document.getElementById('final-price-msg').innerHTML;
        paymentTxt.innerHTML = '';

        if (selectedMethod.id == 'payment-qr') {
            paymentTitle.innerHTML = "Scan QR to pay";
            paymentMethod.innerHTML = 'Your selected payment method is <br>QR Payment.';
            paymentAmount.innerHTML = `Total amount: $${totalPrice}`;
            paymentImg.src = "/assets/qr-payment.jpg";
        } else if (selectedMethod.id == 'payment-truemoney') {
            paymentTitle.innerHTML = "Scan Truemoney to pay";
            paymentMethod.innerHTML = 'Your selected payment method is <br>Truemoney.';
            paymentAmount.innerHTML = `Total amount: $${totalPrice}`;
            paymentImg.src = "/assets/truemoney-payment.jpg";
        }

        paymentPopup.classList.add('active');
        paymentPopupOverlay.classList.add('active');
    }
});

paymentProceedBtn.addEventListener('click', async (e) => {
    const methodId = document.querySelector('input[name="payment-method"]:checked').id;
    
    let dbMethod = 'promptpay'; // Defaults
    if (methodId === 'payment-qr') dbMethod = 'promptpay';
    if (methodId === 'payment-truemoney') dbMethod = 'truemoney';

    const finalPrice = document.getElementById('final-price-msg').innerText;
    const itemsCount = document.querySelectorAll('.cart-container').length;

    try {
        const response = await axios.post('/api/order', {
            method: dbMethod,
            totalPrice: parseFloat(finalPrice),
            gameCount: itemsCount
        });

        if (response.status === 200) {
            // UI Transition on Success
            paymentPopup.classList.remove('active');
            paymentPopupOverlay.classList.remove('active');

            successPopup.classList.add('active');
            successPopupOverlay.classList.add('active');
        }
    } catch (err) {
        console.error("Checkout failed:", err);
        paymentTxt.innerHTML = "Order recording failed. Please try again.";
    }
});

paymentCancelBtn.addEventListener('click', (e) => {
    paymentPopup.classList.remove('active');
    paymentPopupOverlay.classList.remove('active');
});

successProceedBtn.addEventListener('click', (e) => {
    successPopup.classList.remove('active');
    successPopupOverlay.classList.remove('active');
    window.location.href = '/';
    // Handle removing data from cart later on.
});

// Back to cart button
backToCartBtn.addEventListener('click', () => {
    paymentContainer.style.display = 'none';
    cartHeaderSpan.style.color = '#ffffff'
    checkoutHeaderSpan.style.display = 'none';
    couponContainer.style.display = 'block'
});

// Promo code logic
const redeemBtn = document.getElementById('button-redeem');
const promoInput = document.getElementById('promo-input');
const finalPriceSpan = document.getElementById('final-price-msg');
const discountSpan = document.getElementById('discount-msg');
const discountRateSpan = document.getElementById('discount-rate-msg');
const couponTxt = document.getElementById('coupon-text');
let currentTotal = finalPriceSpan.innerHTML;
let isDiscountApplied = false;

redeemBtn.addEventListener('click', () => {
    if (cartContainer.length === 0) return;

    const code = promoInput.value.trim().toLowerCase();

    if (isDiscountApplied) {
        couponTxt.innerHTML = 'Coupon has already redeemed!';
        return;
    }

    if (code === "pisetkaidao".toLowerCase()) {
        const discountAmount = currentTotal * 0.05;
        currentTotal = currentTotal - discountAmount;
        isDiscountApplied = true;

        // Update UI
        discountSpan.innerHTML = discountAmount.toFixed(2);
        finalPriceSpan.innerText = currentTotal.toFixed(2);
        discountRateSpan.innerHTML = "(5%)";
        

        promoInput.classList.add('disabled');
        redeemBtn.classList.add('disabled');
        
    } else {
        couponTxt.innerHTML = 'Invalid coupon!';
    }
});

// Remove Cart Item
const cartItems = document.querySelectorAll('.cart-container');

cartItems.forEach(item => {
    item.addEventListener('click', async (event) => {
        if (event.target.id === 'remove') {
            const confirmed = await customConfirm("Are you sure to delete this item from your cart?");

            if (confirmed) {
                axios.delete(`/api/cart/${event.target.dataset.itemId}`).then(() => location.reload());
            }
        }
    })
})