const cards = document.querySelectorAll('.card');

const username = document.body.querySelector('main').dataset.username;

cards.forEach((card) => {
    card.addEventListener('click', (event) => {
        event.preventDefault();
        const cartButton = event.target.closest('#add-to-cart');
        const wishlistButton = event.target.closest('#wishlist');
        if (username === '') {
            window.location.href = '/identification';
            return;
        }
        if (cartButton) {
            const icon = event.target.querySelector('i')
            const id = event.target.getAttribute('data-game-id');
            if (icon.classList.contains('bi-cart-plus')) {
                axios.post(`/api/cart/${id}`)
                icon.classList.remove('bi-cart-plus');
                icon.classList.add('bi-cart-plus-fill');
            } else {
                axios.delete(`/api/cart/${id}`);
                icon.classList.remove('bi-cart-plus-fill');
                icon.classList.add('bi-cart-plus');
            }
            return;
        } else if (wishlistButton) {
            const icon = event.target.querySelector('i')
            if (icon.classList.contains('bi-heart')) {
                axios.post(`/api/wishlist/${event.target.dataset.gameId}`)
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill');
            } else {
                axios.delete(`/api/wishlist/${event.target.dataset.gameId}`);
                icon.classList.remove('bi-heart-fill');
                icon.classList.add('bi-heart');
            }
            return;
        } else {
            window.location.href = `/product/${event.target.parentElement.dataset.gameId}`;
        }
    });
});
