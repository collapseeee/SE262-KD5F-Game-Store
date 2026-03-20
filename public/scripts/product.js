const cards = document.querySelectorAll('.card');

const username = document.body.querySelector('main').dataset.username;

cards.forEach((card) => {
    card.addEventListener('click', async (event) => {
        event.preventDefault();
        const cartButton = event.target.closest('#add-to-cart');
        const wishlistButton = event.target.closest('#wishlist');

        const $bubbleContent = document.querySelector('.bubble-content');
        const gameName = card.querySelector('.game-name').innerText;
        const gamePoster = card.querySelector('.poster').src;
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

                    const emptyMsg = $bubbleContent.querySelector('p');
                    if (emptyMsg && emptyMsg.innerText === 'Empty Cart') $bubbleContent.innerHTML = '';

                    const newEntry = `
                        <div class="d-flex align-items-center mb-3 cart-item-${id}">
                            <div class="mini-poster-container me-3">
                                <img src="${gamePoster}" alt="poster">
                            </div>
                            <span class="game-name-text text-truncate">${gameName}</span>
                        </div>`;
                    $bubbleContent.insertAdjacentHTML('beforeend', newEntry);

                    Notify.show('Added to cart!', 'success');
                } catch (err) {
                    Notify.show('Failed to add to cart', 'error');
                }
            } else {
                try {
                    await axios.delete(`/api/cart/${id}`);
                    icon.classList.remove('bi-cart-plus-fill');
                    icon.classList.add('bi-cart-plus');

                    const $bubbleContent = document.querySelector('.bubble-content');
                    const itemToRemove = $bubbleContent.querySelector(`.cart-item-${id}`);
                    if (itemToRemove) itemToRemove.remove();
                    
                    if ($bubbleContent.children.length === 0) {
                        $bubbleContent.innerHTML = '<p class="text-center small opacity-50 mb-0">Empty Cart</p>';
                    }

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
            window.location.href = `/product/${event.target.closest('.card').dataset.gameId}`;
        }
    });
});
