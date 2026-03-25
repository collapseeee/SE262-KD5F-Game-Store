// Resources declaration
const express = require('express');
const bodyParser = require('body-parser');
const Auth = require('./controllers/auth');
const session = require('express-session');
const sessionStore = require('./models/session');
const path = require('path');
const { getWishlistByUserId, deleteFromWishlist, addToWishlist, getIsWishlisted } = require('./models/wishlist');
const { getCartByUserId, deleteFromCart, addToCart, getIsInCart, deleteCart } = require('./models/cart');
const { getUserByName } = require('./models/account');
const { getAllProduct, searchProduct, getProductById, getProductRequirementById, getSellerIdByProductId, addProduct, addGallery, addVideo, addSystemRequirements, addProductList, getRequirementsByProductId, getImagesByProductId, getVideosByProductId, deleteGalleryByImageId, getCategoriesByProductId, updateProduct, updateSystemRequirements, updateVideo, deleteProdcutListByProductId, renameCategory, deleteCategoryByCategoryId, getProductByIdForEdit, addCategory, deleteProductByProductId, getAllProductByUserId } = require('./models/product');
const { getAllCategory, hideCategory } = require('./models/category');
const { getProductImagesByProductId, getProductVideosByProductId } = require('./models/media');
const { addOrder, updateUserTotalSpend, updateUserTotalGame, updateUserTotalSale } = require('./models/checkout');
const multer = require('multer');
const Account = require('./models/account');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/picture');
    },
    filename: function (req, file, cb) {

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
const app = express();

// App setup
app.use(
    session({
        secret: 'my-secret-key',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60   // 1 hour
        }
    })
);

app.use(express.static('public'));
app.use(express.static('public/assets'));
app.use(express.static('node_modules'));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');


// Webpage endpoints

app.get('/', async (req, res) => {
    let games = await getAllProduct();
    if (games.length > 12) {
        games = games.slice(0, 12);
    }
    if (req.session.username || req.session.user_id) {
        const user = await getUserByName(req.session.username);
        const userWishlists = await getWishlistByUserId(user.user_id);
        const wishlistIds = userWishlists.map(item => item.product_id);
        const userCarts = await getCartByUserId(user.user_id);
        const cartIds = userCarts.map(item => item.product_id);
        res.render('index', {
            games: games,
            categories: await getAllCategory(),
            wishlists: wishlistIds,
            username: req.session.username,
            carts: cartIds,
            popupCarts: userCarts
        });
    } else {
        res.render('index', {
            categories: await getAllCategory(),
            games: games,
            username: null,
            wishlists: [],
            carts: [],
            popupCarts: []
        });
    }
});

app.get('/identification', (req, res) => {
    if (req.session.username || req.session.user_id) {
        if (req.session.role === 'b') {
            res.redirect('/');
        } else {
            res.redirect('/dashboard');
        }
    } else {
        res.render('identification');
    }
});

app.get('/register', (req, res) => {
    res.render('register');
});
app.get('/sellerInformation', async (req, res) => {
    try {
        if (req.session.username || req.session.user_id) {
            const user = await Account.getUserByName(req.session.username);
            res.render('seller/personalInformation', { seller: user });

        } else {
            res.render('/identification');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching seller info");
    }
});


app.get('/sellerLogin', (req, res) => {
    if (req.session.username || req.session.user_id) {
        res.redirect('/');
    } else {
        res.render('seller/login');
    }
});

app.get('/buyerLogin', (req, res) => {
    if (req.session.username || req.session.user_id) {
        res.redirect('/');
    } else {
        res.render('buyer/login');
    }
});

app.get('/account', async (req, res) => {
    if (req.session.username || req.session.user_id) {
        const user = await getUserByName(req.session.username);
        user.created_date = `${new Date(user.created_date).getDate()}/${new Date(user.created_date).getMonth() + 1}/${new Date(user.created_date).getFullYear()}`;
        const userCarts = await getCartByUserId(user.user_id);
        res.render('buyer/personalInformation', {
            // Data here
            categories: await getAllCategory(),
            user: user,
            popupCarts: userCarts
        });
    } else {
        res.redirect('/identification');
    }
});

// SEARCH PRODUCTS
app.get('/result', async (req, res) => {
    const user = await getUserByName(req.session.username);

    if (!user) res.redirect('/identification');

    const { gameName, categories, category } = req.query;
    let categoryArray = [];

    // Passing Input:
    const rawInput = category || categories;
    if (rawInput) {
        if (Array.isArray(rawInput)) {
            // It's already an array: ['1', '2']
            categoryArray = rawInput;
        } else if (typeof rawInput === 'string' && rawInput.includes(',')) {
            // It's a comma string: "1,2,3" -> turn into ['1', '2', '3']
            categoryArray = rawInput.split(',');
        } else {
            // It's a single value: "1" -> turn into ['1']
            categoryArray = [rawInput];
        }
    }

    // Search Operation
    const results = await searchProduct(gameName, (categoryArray.length > 0) ? categoryArray : null);

    // Matching categoryId with its name:
    const allCategories = await getAllCategory();
    let categoriesName = "All Categories"; // Default value if no category is selected for the search.
    if (categoryArray.length > 0) {
        const nameList = categoryArray.map(id => {
            const found = allCategories.find(c => c.category_id === Number(id));
            return found ? found.name : null;
        }).filter(Boolean);

        categoriesName = nameList.join(" | ");
    }

    // Get user wishlist and cart item to display differently in icon.
    const userWishlists = await getWishlistByUserId(user.user_id);
    const wishlistIds = userWishlists.map(item => item.product_id);
    const userCarts = await getCartByUserId(user.user_id);
    const cartIds = userCarts.map(item => item.product_id);
    res.render('buyer/searchResult', {
        categories: allCategories,
        games: results,
        // for displaying in result page
        searchedName: gameName || "All Games",
        searchedCategory: categoriesName,
        wishlists: wishlistIds,
        carts: cartIds,
        username: req.session.username,
        popupCarts: userCarts
    });
});

app.get('/product/:id', async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await getProductById(gameId);
        const user = await getUserByName(req.session.username);
        const images = await getProductImagesByProductId(gameId);
        const videos = await getProductVideosByProductId(gameId);
        const exportImages = images.map(image => image.image_url);
        const exportVideos = videos.map(video => {
            const url = video.video_url;
            if (url.includes('watch')) {
                return url.split('v=')[1];
            }
            if (url.includes('youtu.be')) {
                return url.split('/').pop();
            }
            return url;
        });
        const isWishlisted = await getIsWishlisted(user.user_id, gameId);
        const isInCart = await getIsInCart(user.user_id, gameId)
        const userCarts = await getCartByUserId(user.user_id);

        res.render('buyer/productDetail', {
            categories: await getAllCategory(),
            gameDetails: game,
            isWishlisted: isWishlisted,
            isInCart: isInCart,
            images: exportImages,
            videos: exportVideos,
            requirements: await getProductRequirementById(gameId),
            popupCarts: userCarts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("SERVER ERROR");
    }
});

// Cart page
app.get('/cart', async (req, res) => {
    const user = await getUserByName(req.session.username);
    if (!user) res.redirect('/identification');

    const userId = user.user_id;

    const cartData = await getCartByUserId(userId);
    const carts = Array.isArray(cartData) ? cartData : [];
    const exportedCarts = carts.map(cart => {
        const dateObj = new Date(cart.cart_date);

        const formattedDate = dateObj.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        return {
            product_id: cart.product_id,
            name: cart.name,
            price: cart.price,
            poster_url: cart.poster_url,
            categories: cart.categories,
            cart_date: formattedDate
        };
    });
    const userCarts = await getCartByUserId(user.user_id);
    res.render('buyer/shoppingCart', {
        games: exportedCarts,
        categories: await getAllCategory(),
        popupCarts: userCarts
    });
});

app.get('/login', (req, res) => {
    res.render('identification', {
        // Data here
    });
});

app.get('/register', (req, res) => {
    res.render('register', {
        // Data here
    });
});

app.get('/wishlist', async (req, res) => {
    if (req.session.username || req.session.user_id) {
        const user = await getUserByName(req.session.username);
        const wishlists = await getWishlistByUserId(user.user_id);
        const exportedWishlists = wishlists.map(wishlist => {
            return {
                product_id: wishlist.product_id,
                name: wishlist.name,
                price: wishlist.price,
                poster_url: wishlist.poster_url,
                categories: wishlist.categories,
                wishlist_date: `${new Date(user.created_date).getDate()}/${new Date(user.created_date).getMonth() + 1}/${new Date(user.created_date).getFullYear()}`
            };
        });
        const userCarts = await getCartByUserId(user.user_id);
        res.render('buyer/wishlist', {
            // Data here
            categories: await getAllCategory(),
            games: exportedWishlists,
            popupCarts: userCarts
        });
    } else {
        res.redirect('/identification');
    }

});
app.get('/contact', async (req, res) => {
    if (req.session.username || req.session.user_id) {
        const user = await getUserByName(req.session.username);
        const userCarts = await getCartByUserId(user.user_id);
        res.render('contact', {
            categories: await getAllCategory(),
            username: req.session.username,
            popupCarts: userCarts
        });
    } else {
        res.render('contact', {
            categories: await getAllCategory(),
            username: null,
            popupCarts: []
        });
    }
});

// API endpoints


app.post('/loginBuyer', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await Auth.loginBuyer(username, password);

        if (result) {
            req.session.username = result.username;
            req.session.user_id = result.user_id;
            req.session.role = 'b';
            req.session.save((err) => {
                if (err) {
                    throw new Error();
                }
                res.redirect('/');
            });
        } else {
            throw new Error();
        }
    } catch (error) {
        console.error(error);
        res.status(400).render('buyer/login', { error: 'Login failed. Username or password may be wrong.' });
    }
});

app.post('/loginSeller', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await Auth.loginSeller(username, password);
        if (result) {
            req.session.username = result.username;
            req.session.user_id = result.user_id;
            req.session.role = 'b';
            req.session.save((err) => {
                if (err) {
                    throw new Error();
                }
                res.redirect('/dashboard');
            });
        } else {
            throw new Error();
        }
    } catch (error) {
        console.error(error);
        res.status(400).render('seller/login', { error: 'Login failed. Username or password may be wrong.' });
    }
});

app.get('/signout', (req, res) => {
    const expired = req.query.expired;
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).send('Error during logout');
        } else {
            res.redirect(expired ? '/identification?expired=true' : '/');
        }
    });
});

app.delete('/api/account', async (req, res) => {
    try {
        const user = await getUserByName(req.session.username);
        await Account.deleteUserById(user.user_id);
        req.session.destroy(err => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error during delete account' });
            } else {
                res.status(200).json({ success: true, redirect: '/' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting account' });
    }
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const confirmPassword = req.body['confirm-password'];
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }
    const existingUser = await getUserByName(username);
    if (existingUser) {
        return res.status(400).render('register', { error: 'Username already exists', username });
    }
    const result = await Auth.signup(username, password, 'buyer', 'seller');
    if (result) {
        req.session.save((err) => {
            if (err) {
                throw new Error();
            }
            res.redirect('/');
        });
    } else {
        throw new Error();
    }
});

app.get('/api/product', async () => {
    // GET all products
});
// dashboard page for seller
app.get('/dashboard', async (req, res) => {
    try {
        if (req.session.username || req.session.user_id) {
            const games = await getAllProductByUserId(req.session.user_id);
            const categories = await getAllCategory();
            res.render('seller/dashboard', {
                // Data here
                categories: categories,
                games: games
            });
        } else {
            res.redirect('/identification');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching dashboard data");
    }
});
app.get('/api/product/add', (req, res) => {
    res.render('seller/product', {
        mode: 'add',
        product: {},
        min: {},
        rec: {},
        gallery: [],
        videos: [],
        currentCategories: []
    });
});

app.get('/api/product/edit/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await getProductByIdForEdit(productId);
        const categories = await getCategoriesByProductId(productId);
        const requirements = await getRequirementsByProductId(productId);
        const images = await getImagesByProductId(productId);
        const videoData = await getVideosByProductId(productId);
        if (!product) return res.status(404).send("Product not found");
        res.render('seller/product', {
            mode: 'edit',
            product: product,
            min: requirements.min,
            rec: requirements.rec,
            gallery: images,
            videoIds: videoData.map(v => v.video_id),  // [1, 2]
            videos: videoData.map(v => v.video_url), // ['url1', 'url2']
            currentCategories: categories.map(c => c.category_id)
        });
    }
    catch (err) {
        console.error("Error in Edit Route:", err);
        res.status(500).send("Internal Server Error");
    }
});
app.get('/api/categories', async (req, res) => {
    const categories = await getAllCategory();;
    res.json(categories);
});
app.post('/api/product/add', upload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'gallery_image[]', maxCount: 4 }
]),
    async (req, res) => {
        try {
            let categories = req.body['category[]'] || req.body.category || [];
            let cleanPath = null;
            if (req.files.poster && req.files.poster[0]) {

                cleanPath = req.files.poster[0].path.replace(/\\/g, '/').replace('public/assets', '');
            }
            const galleryFiles = req.files['gallery_image[]'] || [];
            const videoUrls = [req.body.videoUrl, req.body.videoUrl2].filter(url => url && url.trim() !== "");
            const { name, price, description } = req.body;
            const productId = await addProduct(name, description, price, cleanPath);
            if (!Array.isArray(categories)) {
                categories = [categories];
            }
            if (productId) {
                const categoryArray = Array.isArray(categories) ? categories : [categories];
                for (const categoryId of categoryArray) {
                    if (categoryId) await addProductList(productId, categoryId, req.session.user_id);
                }


                for (const file of galleryFiles) {
                    const cleanGalleryPath = file.path.replace(/\\/g, '/').replace('public/assets', '');
                    await addGallery(cleanGalleryPath, productId);
                }


                for (const video of videoUrls) {
                    await addVideo(video, productId);
                }
                await addSystemRequirements(productId, req.body);
                res.redirect('/dashboard');
            }
        }
        catch (err) {
            console.error(err);
            res.status(500).send('Error adding product');
        }
    });

app.put('/categories/:id', async (req, res) => {
    const targetId = parseInt(req.params.id);
    const newName = req.body.name;
    const categories = await getAllCategory(); // Assuming this returns an array of category objects
    const category = categories.find(cat => cat.category_id === targetId);
    if (category) {
        await renameCategory(targetId, newName); // Call the function to update the category name in the database
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Category not found' });
    }
});

app.put('/api/category/hide/:id', async (req, res) => {
    const categoryId = req.params.id;
    const result = await hideCategory(categoryId);
    res.json(result);
});

app.post(
    '/api/product/edit/:id',
    upload.fields([
        { name: 'poster', maxCount: 1 },
        { name: 'gallery_image[]', maxCount: 4 }
    ]),
    async (req, res) => {
        let categories = req.body['category[]'] || req.body.category;
        const categoryArray = Array.isArray(categories) ? categories : [categories];
        const productId = parseInt(req.params.id);
        const UpdateProduct = req.body;
        const posterFile = req.files.poster
            ? req.files.poster[0].filename
            : null;

        const galleryFiles = req.files['gallery_image[]'] || [];
        const videoIds = [req.body.videoId, req.body.videoId2];
        const videoUrls = [req.body.videoUrl, req.body.videoUrl2];
        try {

            await updateProduct(
                productId,
                UpdateProduct.name,
                UpdateProduct.description,
                UpdateProduct.price,
                posterFile
            );
            await deleteProdcutListByProductId(productId);

            await Promise.all(
                categoryArray.map(categoryId =>
                    addProductList(productId, categoryId, req.session.user_id)
                )
            );
            if (galleryFiles.length > 0) {
                for (const file of galleryFiles) {
                    const cleanPath = file.path.replace(/\\/g, '/').replace('public/assets', '');


                    await addGallery(cleanPath, productId);
                }
            }
            for (let i = 0; i < videoUrls.length; i++) {
                const url = videoUrls[i];
                const id = videoIds[i];
                if (url && url.trim() !== "" && id && id !== "") {
                    try {
                        await updateVideo(id, url);
                    } catch (error) {
                        console.error(`Error updating video ID ${id}:`, error);
                    }
                } else if (url && url.trim() !== "" && (!id || id === "")) {

                    await addVideo(url, productId);
                }
            }
            await updateSystemRequirements(productId, req.body);
            res.redirect('/dashboard');

        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false });
        }

    });

app.delete('/api/games/:id', async (req, res) => {
    const targetId = parseInt(req.params.id);
    try {
        await deleteProductByProductId(targetId);

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                success: false,
                message: 'This product cannot be deleted because it has already been purchased.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
app.delete('/categories/:id', async (req, res) => {
    const targetId = parseInt(req.params.id);
    try {
        await deleteCategoryByCategoryId(targetId);
        res.json({ success: true });
    }
    catch (err) {
        console.error(err);
    }
});
app.delete('/api/gallery/delete/:id', async (req, res) => {
    const imageId = parseInt(req.params.id);
    try {
        await deleteGalleryByImageId(imageId);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting gallery image');
    }
});
app.get('/api/image/:id', async (req, res) => {
    try {
        const data = await getProductImagesByProductId(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).send('SERVER ERROR');
        console.error(err);
    }
});
app.post('/api/addcategorie', async (req, res) => {
    await addCategory(req.body.name);
    try {
        res.json({ success: true });
    } catch (err) {
        res.status(500).send('SERVER ERROR');
        console.error(err);
    }
});

// Webstore APIs

app.post('/api/wishlist/:id', async (req, res) => {
    try {
        const product_id = req.params.id;
        const user = await getUserByName(req.session.username);
        const result = await addToWishlist(user.user_id, product_id);
        res.send(result);
    } catch (err) {
        res.status(500).send('SERVER ERROR');
        console.error(err);
    }
});

app.delete('/api/wishlist/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const user = await getUserByName(req.session.username);
        const result = await deleteFromWishlist(user.user_id, productId);
        res.send(result);
    } catch (err) {
        res.status(500).send('SERVER ERROR');
        console.error(err);
    }
});

app.post('/api/cart/:id', async (req, res) => {
    try {
        const product_id = req.params.id;
        const user = await getUserByName(req.session.username);
        const result = await addToCart(user.user_id, product_id);
        res.send(result);
    } catch (err) {
        res.status(500).send('SERVER ERROR');
        console.error(err);
    }
});

app.delete('/api/cart/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const user = await getUserByName(req.session.username);
        const result = await deleteFromCart(user.user_id, productId);
        res.send(result);
    } catch (err) {
        res.status(500).send('SERVER ERROR');
        console.error(err);
    }
});

app.post('/api/order', async (req, res) => {
    try {
        const user = await getUserByName(req.session.username);
        const userId = user.user_id;
        const cartItems = await getCartByUserId(userId);
        if (cartItems.length === 0) return res.status(400).send('Cart is empty');

        const productIds = cartItems.map(item => item.product_id);
        const { method, finalPrice, gameCount } = req.body;

        await addOrder(userId, productIds, method, finalPrice);

        await updateUserTotalSpend(userId, finalPrice);
        await updateUserTotalGame(userId, gameCount);

        for (const item of cartItems) {
            const sellerId = await getSellerIdByProductId(item.product_id);
            if (sellerId) {
                await updateUserTotalSale(sellerId, item.price);
            }
        }

        await deleteCart(userId);

        res.status(200).send('Order Processed Successfully');
    } catch (err) {
        res.status(500).send('SERVER ERROR');
        console.error(err);
    }
});

app.listen(3000, () => {
});
