const cards = document.querySelectorAll('.card');

const username = document.body.querySelector('main').dataset.username;

cards.forEach((card) => {
    card.addEventListener('click', async (event) => {
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
                try {
                    await axios.post(`/api/cart/${id}`);
                    icon.classList.remove('bi-cart-plus');
                    icon.classList.add('bi-cart-plus-fill');
                    Notify.show('Added to cart!', 'success');
                } catch (err) {
                    Notify.show('Failed to add to cart', 'error');
                }
            } else {
                try {
                    await axios.delete(`/api/cart/${id}`);
                    icon.classList.remove('bi-cart-plus-fill');
                    icon.classList.add('bi-cart-plus');
                    Notify.show('Removed from cart', 'info');
                } catch (err) {
                    Notify.show('Failed to remove from cart', 'error');
                }
            }
            return;
        } else if (wishlistButton) {
            const icon = event.target.querySelector('i')
            if (icon.classList.contains('bi-heart')) {
                try {
                    await axios.post(`/api/wishlist/${event.target.dataset.gameId}`);
                    icon.classList.remove('bi-heart');
                    icon.classList.add('bi-heart-fill');
                    Notify.show('Added to wishlist!', 'success');
                } catch (err) {
                    Notify.show('Failed to add to wishlist', 'error');
                }
            } else {
                try {
                    await axios.delete(`/api/wishlist/${event.target.dataset.gameId}`);
                    icon.classList.remove('bi-heart-fill');
                    icon.classList.add('bi-heart');
                    Notify.show('Removed from wishlist', 'info');
                } catch (err) {
                    Notify.show('Failed to remove from wishlist', 'error');
                }
            }
            return;
        } else {
            window.location.href = `/product/${event.target.parentElement.dataset.gameId}`;
        }
    });
});
