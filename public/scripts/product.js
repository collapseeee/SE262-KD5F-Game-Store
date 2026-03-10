const cards = document.querySelectorAll('.card');

cards.forEach((card) => {
    card.addEventListener('click', (event) => {
        if (event.target.id === 'add-to-cart') {
            event.preventDefault();
            const id = event.target.getAttribute('data-game-id');
            console.log('add to cart', id);
            return;
        }
        if (event.target.id === 'wishlist') {
            event.preventDefault();
            console.log('wishlist', event.target.dataset.gameId);
            return;
        }
        window.location.href = `/product/${event.target.dataset.gameId}`;
    });
});