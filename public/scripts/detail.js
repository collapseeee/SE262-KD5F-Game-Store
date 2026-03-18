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
const mainVideo = document.body.querySelector('#main-image > iframe');
const thumbnails = document.body.querySelectorAll('.thumb-item');
const dots = document.body.querySelectorAll('.dot');

let images = document.body.dataset.images ? document.body.dataset.images.split(',') : [];
if (images[0] === '') images = [];
let videos = document.body.dataset.videos ? document.body.dataset.videos.split(',') : [];
if (videos[0] === '') videos = [];

const media = videos.concat(images);
let mediaIndex = 0;
let carouselInterval;

const renderMainMedia = () => {
    if (mediaIndex < videos.length) {
        mainImage.style.display = 'none';
        mainVideo.style.display = 'block';
        mainVideo.setAttribute('src', `https://www.youtube.com/embed/${videos[mediaIndex]}?autoplay=1`);
        clearInterval(carouselInterval);
    } else {
        mainVideo.style.display = 'none';
        mainVideo.setAttribute('src', '');
        mainImage.style.display = 'block';
        const imageIndex = mediaIndex - videos.length;
        mainImage.setAttribute('src', images[imageIndex]);

        clearInterval(carouselInterval);
        carouselInterval = setInterval(nextMedia, 7000);
    }
};

const nextMedia = () => {
    thumbnails[mediaIndex].style.opacity = '0.6';
    if (dots[mediaIndex]) dots[mediaIndex].classList.remove('active');

    mediaIndex++;
    if (mediaIndex > media.length - 1) {
        mediaIndex = 0;
    }

    thumbnails[mediaIndex].style.opacity = '0.85';
    if (dots[mediaIndex]) dots[mediaIndex].classList.add('active');

    renderMainMedia();
}

const prevMedia = () => {
    thumbnails[mediaIndex].style.opacity = '0.6';
    if (dots[mediaIndex]) dots[mediaIndex].classList.remove('active');

    mediaIndex--;
    if (mediaIndex < 0) {
        mediaIndex = media.length - 1;
    }

    thumbnails[mediaIndex].style.opacity = '0.85';
    if (dots[mediaIndex]) dots[mediaIndex].classList.add('active');

    renderMainMedia();
}

if (media.length === 0) {
    leftArrow.style.display = 'none';
    rightArrow.style.display = 'none';
    mainImage.setAttribute('src', 'https://placehold.co/600x400/8122C9/FEFEFE?text=No media available&font=ptsans')
} else {
    if (dots[0]) dots[0].classList.add('active');
    thumbnails[0].style.opacity = '0.85';

    renderMainMedia();

    leftArrow.addEventListener('click', prevMedia);
    rightArrow.addEventListener('click', nextMedia);

    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', event => {
            const targetIndex = parseInt(event.currentTarget.dataset.index);
            thumbnails[mediaIndex].style.opacity = '0.6';
            if (dots[mediaIndex]) dots[mediaIndex].classList.remove('active');

            mediaIndex = targetIndex;

            thumbnail.style.opacity = '0.85';
            if (dots[mediaIndex]) dots[mediaIndex].classList.add('active');

            renderMainMedia();
        });
    });

    dots.forEach((dot) => {
        dot.addEventListener('click', event => {
            const targetIndex = parseInt(event.currentTarget.dataset.index);
            if (dots[mediaIndex]) dots[mediaIndex].classList.remove('active');
            thumbnails[mediaIndex].style.opacity = '0.6';

            mediaIndex = targetIndex;

            dot.classList.add('active');
            thumbnails[mediaIndex].style.opacity = '0.85';

            renderMainMedia();
        });
    });
}