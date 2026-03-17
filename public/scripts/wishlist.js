import { customConfirm } from "./customConfirm.js";

document.addEventListener('DOMContentLoaded', () => {

    const cartItems = document.querySelectorAll('.cart-container');
    console.log("Found item:", cartItems.length);

    cartItems.forEach(item => {
        item.addEventListener('click', async (event) => {
            console.log("Clicked:", event.target.id);

            if (event.target.id === 'remove') {
                const confirmed = await customConfirm("Are you sure to delete this item from your wishlist?");

                if (confirmed) {
                    axios.delete(`/api/wishlist/${event.target.dataset.itemId}`).then(() => location.reload());
                }
            }
        });
    });
});
// console.log(document.querySelectorAll('.cart-container'));