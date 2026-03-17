const wishlistButton = document.body.querySelector('.wishlist-btn');

wishlistButton.addEventListener('click', async (event) => {
    const icon = event.target.querySelector('i');
    if (icon.classList.contains('bi-heart')) {
        try {
            await axios.post(`/api/wishlist/${document.body.dataset.gameId}`);
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill');
            Notify.show('Added to wishlist!', 'success');
        } catch (err) {
            Notify.show('Failed to add to wishlist', 'error');
        }
    } else {
        try {
            await axios.delete(`/api/wishlist/${document.body.dataset.gameId}`);
            icon.classList.remove('bi-heart-fill');
            icon.classList.add('bi-heart');
            Notify.show('Removed from wishlist', 'info');
        } catch (err) {
            Notify.show('Failed to remove from wishlist', 'error');
        }
    }
});

const cartButton = document.body.querySelector('.add-to-cart-btn');

cartButton.addEventListener('click', async (event) => {
    const icon = event.target.querySelector('i');
    if (icon.classList.contains('bi-cart-plus')) {
        try {
            await axios.post(`/api/cart/${document.body.dataset.gameId}`);
            icon.classList.remove('bi-cart-plus');
            icon.classList.add('bi-cart-plus-fill');
            Notify.show('Added to cart!', 'success');
        } catch (err) {
            Notify.show('Failed to add to cart', 'error');
        }
    } else {
        try {
            await axios.delete(`/api/cart/${document.body.dataset.gameId}`);
            icon.classList.remove('bi-cart-plus-fill');
            icon.classList.add('bi-cart-plus');
            Notify.show('Removed from cart', 'info');
        } catch (err) {
            Notify.show('Failed to remove from cart', 'error');
        }
    }
});

const leftArrow = document.body.querySelector('#left-arrow');
const rightArrow = document.body.querySelector('#right-arrow');
const mainImage = document.body.querySelector('#main-image > img');
const thumbnails = document.body.querySelectorAll('.thumb-item');
const dots = document.body.querySelectorAll('.dot');
const images = document.body.dataset.images.split(',');
let imageIndex = 0;

const nextImage = () => {
    imageIndex++;
    if (imageIndex > images.length - 1) {
        thumbnails[thumbnails.length - 1].style.opacity = '0.6';
        dots[thumbnails.length - 1].classList.remove('active');
        imageIndex = 0;
        thumbnails[imageIndex].style.opacity = '0.85';
        dots[imageIndex].classList.add('active');
        mainImage.setAttribute('src', images[imageIndex])
        return;
    }
    mainImage.setAttribute('src', images[imageIndex])
    thumbnails[imageIndex - 1].style.opacity = '0.6';
    dots[imageIndex - 1].classList.remove('active');
    thumbnails[imageIndex].style.opacity = '0.85';
    dots[imageIndex].classList.add('active');
}
const prevImage = () => {
    imageIndex--;
    if (imageIndex < 0) {
        thumbnails[0].style.opacity = '0.6';
        dots[0].classList.remove('active')
        imageIndex = thumbnails.length - 1;
        thumbnails[imageIndex].style.opacity = '0.85';
        dots[imageIndex].classList.add('active');
        mainImage.setAttribute('src', images[imageIndex])
        return;
    }
    mainImage.setAttribute('src', images[imageIndex])
    thumbnails[imageIndex + 1].style.opacity = '0.6';
    dots[imageIndex + 1].classList.remove('active');
    thumbnails[imageIndex].style.opacity = '0.85';
    dots[imageIndex].classList.add('active');
}

if (images[0] === '') {
    leftArrow.style.display = 'none';
    rightArrow.style.display = 'none';
    mainImage.setAttribute('src', 'https://placehold.co/600x400/8122C9/FEFEFE?text=No image available&font=ptsans')
} else {
    dots[0].classList.add('active');
    thumbnails[0].style.opacity = '0.85';
    mainImage.setAttribute('src', images[0]);
    leftArrow.addEventListener('click', (event) => {
        prevImage();
    });

    rightArrow.addEventListener('click', (event) => {
        nextImage()
    });

    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', event => {
            const targetIndex = event.target.dataset.index;
            thumbnails[imageIndex].style.opacity = '0.6';
            imageIndex = targetIndex;
            thumbnail.style.opacity = '0.85';
            mainImage.setAttribute('src', images[targetIndex]);
        });
    });

    dots.forEach((dot) => {
        dot.addEventListener('click', event => {
            const targetIndex = event.target.dataset.index;
            dots[imageIndex].classList.remove('active');
            imageIndex = targetIndex;
            dot.classList.add('active');
            mainImage.setAttribute('src', images[targetIndex]);
        })
    })

    setInterval(nextImage, 7000);
}