const cards = document.querySelectorAll('.card');

const username = document.body.querySelector('main').dataset.username;

cards.forEach((card) => {
    card.addEventListener('click', (event) => {
        event.preventDefault();
        if (username === '') {
            window.location.href = '/identification';
            return;
        } else {
            if (event.target.id === 'add-to-cart') {
                const id = event.target.getAttribute('data-game-id');
                console.log('add to cart', id);
                return;
            }
            if (event.target.id === 'wishlist') {
                const svg = event.target.querySelector('use')
                if (svg.getAttribute('xlink:href') === 'bootstrap-icons.svg#heart') {
                    axios.post(`/api/wishlist/${event.target.dataset.gameId}`);
                    svg.setAttribute('xlink:href', 'bootstrap-icons.svg#heart-fill');
                } else {
                    axios.delete(`/api/wishlist/${event.target.dataset.gameId}`);
                    svg.setAttribute('xlink:href', 'bootstrap-icons.svg#heart')
                }
                return;
            }
            window.location.href = `/product/${event.target.dataset.gameId}`;
        }
    });
});
