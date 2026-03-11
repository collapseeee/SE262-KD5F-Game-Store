
const cartItems = document.querySelectorAll('.cart-container');

cartItems.forEach(item => {
    item.addEventListener('click', async (event) => {
        if (event.target.id === 'remove') {
            if (window.confirm(`Are you sure to delete this item from your wishlist?`) === true) {
                axios.delete(`/api/wishlist/${event.target.dataset.itemId}`).then(() => location.reload());
            }
        }
    })
})