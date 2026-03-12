const wishlistButton = document.body.querySelector('.wishlist-btn');

wishlistButton.addEventListener('click', event => {
    const icon = event.target.querySelector('i');
    if (icon.classList.contains('bi-heart')) {
        axios.post(`/api/wishlist/${document.body.dataset.gameId}`)
        icon.classList.remove('bi-heart');
        icon.classList.add('bi-heart-fill');
    } else {
        axios.delete(`/api/wishlist/${document.body.dataset.gameId}`);
        icon.classList.remove('bi-heart-fill');
        icon.classList.add('bi-heart');
    }
})