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
            } else if (event.target.id === 'wishlist') {
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
        }
    });
});
