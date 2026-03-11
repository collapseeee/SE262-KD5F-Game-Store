const cards = document.querySelectorAll('.card');

const wishlistIcon = document.querySelectorAll('#wishlist>svg>use');

console.log(wishlistIcon);

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
            const svg = event.target.querySelector('use')
            if (svg.getAttribute('xlink:href') === 'bootstrap-icons.svg#heart') {
                svg.setAttribute('xlink:href', 'bootstrap-icons.svg#heart-fill');
                axios.post(`/api/wishlist/${event.target.dataset.gameId}`);
            } else {
                svg.setAttribute('xlink:href', 'bootstrap-icons.svg#heart')
                axios.delete(`/api/wishlist/${event.target.dataset.gameId}`).then(console.log("DELETED"));
            }
            return;
        }
        window.location.href = `/product/${event.target.dataset.gameId}`;
    });
});