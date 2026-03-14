const wishlistButton = document.body.querySelector('.wishlist-btn');

wishlistButton.addEventListener('click', event => {
    const icon = event.target.querySelector('i');
    if (icon.classList.contains('bi-heart')) {
        axios.post(`/api/wishlist/${document.body.dataset.gameId}`);
        icon.classList.remove('bi-heart');
        icon.classList.add('bi-heart-fill');
    } else {
        axios.delete(`/api/wishlist/${document.body.dataset.gameId}`);
        icon.classList.remove('bi-heart-fill');
        icon.classList.add('bi-heart');
    }
});

const leftArrow = document.body.querySelector('#left-arrow');
const rightArrow = document.body.querySelector('#right-arrow');
const mainImage = document.body.querySelector('#main-image > img');
const thumbnails = document.body.querySelectorAll('.thumb-item');
const images = document.body.dataset.images.split(',');
let imageIndex = 0;

const nextImage = () => {
    imageIndex++;
    if (imageIndex > images.length - 1) {
        thumbnails[thumbnails.length - 1].style.opacity = '0.6';
        imageIndex = 0;
        thumbnails[imageIndex].style.opacity = '0.85';
        mainImage.setAttribute('src', images[imageIndex])
        return;
    }
    mainImage.setAttribute('src', images[imageIndex])
    thumbnails[imageIndex - 1].style.opacity = '0.6';
    thumbnails[imageIndex].style.opacity = '0.85';
}
const prevImage = () => {
    imageIndex--;
    if (imageIndex < 0) {
        thumbnails[0].style.opacity = '0.6';
        imageIndex = thumbnails.length - 1;
        thumbnails[imageIndex].style.opacity = '0.85';
        mainImage.setAttribute('src', images[imageIndex])
        return;
    }
    mainImage.setAttribute('src', images[imageIndex])
    thumbnails[imageIndex + 1].style.opacity = '0.6';
    thumbnails[imageIndex].style.opacity = '0.85';
}

if (images[0] === '') {
    leftArrow.style.display = 'none';
    rightArrow.style.display = 'none';
    mainImage.setAttribute('src', 'https://placehold.co/600x400/8122C9/FEFEFE?text=No image available&font=ptsans')
} else {
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

    setInterval(nextImage, 7000);
}