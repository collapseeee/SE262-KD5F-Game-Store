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

checkoutBtn.addEventListener('click', (e) => {
    if (paymentContainer.style.display !== 'block') { // First click, show payment methods.
        cartHeaderSpan.style.color = '#fefefe7e'
        checkoutHeaderSpan.style.display = 'block';
        paymentContainer.style.display = 'block';
        couponContainer.style.display = 'none'
    } else { // Second click, continue payment.
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked');

        if (!selectedMethod) {
            alert("Please select a payment method before proceeding!");
            return;
        }

        const paymentTitle = document.getElementById('payment-popup-h1');
        const paymentMsg = document.getElementById('payment-popup-p');
        const paymentImg = document.getElementById('payment-popup-img');
        const totalPrice = document.getElementById('final-price-msg').innerHTML;

        if (selectedMethod.id == 'payment-qr') {
            paymentTitle.innerHTML = "Scan QR to pay";
            paymentMsg.innerHTML = `Your selected payment method is QR Payment. <br> Total amount: $${totalPrice}`;
            paymentImg.src = "/assets/qr-payment.jpg";
        } else if (selectedMethod.id == 'payment-truemoney') {
            paymentTitle.innerHTML = "Scan Truemoney to pay";
            paymentMsg.innerHTML = `Your selected payment method is QR Payment. <br> Total amount: $${totalPrice}`;
            paymentImg.src = "/assets/truemoney-payment.jpg";
        }

        paymentPopup.classList.add('active');
        paymentPopupOverlay.classList.add('active');
    }
});

paymentProceedBtn.addEventListener('click', (e) => {
    paymentPopup.classList.remove('active');
    paymentPopupOverlay.classList.remove('active');

    successPopup.classList.add('active');
    successPopupOverlay.classList.add('active');
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

// Promo code logic
const redeemBtn = document.getElementById('button-redeem');
const promoInput = document.getElementById('promo-input');
const finalPriceSpan = document.getElementById('final-price-msg');
const discountSpan = document.getElementById('discount-msg');
const discountRateSpan = document.getElementById('discount-rate-msg');
const totalAmountPopup = document.getElementById('payment-popup-price-p');
let currentTotal = finalPriceSpan.innerHTML;

redeemBtn.addEventListener('click', () => {
    const code = promoInput.value.trim().toLowerCase();

    if (code === "pisetkaidao".toLowerCase()) {
        const discountAmount = currentTotal * 0.05;
        currentTotal = currentTotal - discountAmount;

        // Update UI
        discountSpan.innerHTML = discountAmount.toFixed(2);
        finalPriceSpan.innerText = currentTotal.toFixed(2);
        discountRateSpan.innerHTML = "(5%)";
        totalAmountPopup.innerHTML = currentTotal.toFixed(2);

        promoInput.disabled = true;
        redeemBtn.disabled = true;
        
    } else {
        alert("Invalid Promo Code.");
    }
});