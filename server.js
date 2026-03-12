// Resources declaration
const express = require('express');
const bodyParser = require('body-parser');
const Auth = require('./controllers/auth');
const session = require('express-session');
const sessionStore = require('./models/session');
const { getAllProduct, searchProduct, getProductById, getProductRequirementById } = require('./models/product');
const { getAllCategory } = require('./models/category');
const { getImageByGameProductId } = require('./models/image');
const { getWishlistByUserId, deleteFromWishlist, addToWishlist, getIsWishlisted } = require('./models/wishlist');
const { getUserByName } = require('./models/account');

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
app.use(express.static('node_modules'));

app.use(express.json());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');


// Webpage endpoints

app.get('/', async (req, res) => {
    const games = await getAllProduct();
    if (req.session.username) {
        const user = await getUserByName(req.session.username);
        const userWishlists = await getWishlistByUserId(user.user_id);
        const wishlistIds = userWishlists.map(item => item.product_id);
        res.render('index', {
            games: games,
            categories: await getAllCategory(),
            wishlists: wishlistIds,
            username: req.session.username
        });
    } else {
        // Want to see ejs page change? edit here
        res.render('index', {
            categories: await getAllCategory(),
            games: await getAllProduct(),
            username: null,
            wishlists: []
        });
    }
});

app.get('/identification', (req, res) => {
    res.render('identification');
});

app.get('/register', (req, res) => {
    res.render('register');
})

app.get('/sellerLogin', (req, res) => {
    res.render('seller/login');
});

app.get('/buyerLogin', (req, res) => {
    res.render('buyer/login');
});

app.get('/account', async (req, res) => {
    if (req.session.username) {
        res.render('buyer/personalInformation', {
            // Data here
            categories: await getAllCategory()
        });
    } else {
        res.redirect('/identification');
    }
});

app.get('/dashboard', (req, res) => {
    res.render('seller/dashboard', {
        // Data here
        categories: categories,
        games: games
    });
});


// SEARCH PRODUCTS
app.get('/result', async (req, res) => {
    const { gameName, categories, category } = req.query;
    let filteredIds = ''

    if (category) {
        filteredIds += category;
    }
    // If the category is selected
    if (categories) {
        const [filterCategory] = Array.isArray(categories) ? [categories] : categories;
        // If multiple categories selected
        if (categories.length > 1) {
            filterCategory.forEach(categoryId => {
                filteredIds += categoryId + ',';
            });
            // Remove the last comma sign
            filteredIds = filteredIds.substring(0, filteredIds.length - 1)
        }
        if (categories.length === 1) {
            filteredIds = categories;
        }
    }
    const results = await searchProduct(gameName, filteredIds);

    res.render('buyer/searchResult', {
        games: results
    });
});

app.get('/product/:id', async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await getProductById(gameId);
        const user = await getUserByName(req.session.username);
        const isWishlisted = await getIsWishlisted(user.user_id, gameId);

        res.render('buyer/productDetail', {
            categories: await getAllCategory(),
            gameDetails: game,
            isWishlisted: isWishlisted,
            requirements: await getProductRequirementById(gameId)
        });
    } catch (error) {
        console.log(error)
        res.status(500).send("SERVER ERROR");
    }
});

app.get('/cart', async (req, res) => {
    // Mock data, Get data FROM Cart table WHERE userid = ...
    const games = [{
        name: "HELLDIVER 9",
        categories: ['Action', 'Shooter'],
        price: 999.99,
        added_date: Date.now()
    }, {
        name: "Mangophobia",
        categories: ['Horror'],
        price: 0.99,
        added_date: Date.now()
    }];
    if (req.session.username) {
        res.render('buyer/shoppingCart', {
            // Data here (Currently mock data)
            games: games,
            categories: await getAllCategory()
        });
    } else {
        res.redirect('/identification');
    }
});
app.get('/checkout', (req, res) => {
    res.render('checkout', {
        // Data here
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
    if (req.session.username) {
        const user = await getUserByName(req.session.username);
        res.render('buyer/wishlist', {
            // Data here
            categories: await getAllCategory(),
            games: await getWishlistByUserId(user.user_id)
        });
    } else {
        res.redirect('/identification');
    }

});
app.get('/contact', async (req, res) => {
    res.render('contact', {
        // Data here
        categories: await getAllCategory()
    });
});

// API endpoints


app.post('/loginBuyer', (req, res) => {
    const { username, password } = req.body;
    Auth.loginBuyer(username, password)
        .then(() => {
            req.session.username = username;
            console.log('Session after login:', req.session);
            return res.redirect('/');
        })
        .catch(error => {
            console.error(error);
            res.status(400).render('buyer/login', { error: 'Login failed. Username or password may be wrong.', username });
        });

});

app.post('/loginSeller', (req, res) => {
    const { username, password } = req.body;
    Auth.loginSeller(username, password)
        .then(() => {
            req.session.username = username;

            res.redirect('/');
            console.log('Session after login:', req.session);
        })
        .catch(error => {
            console.error(error);
            res.status(400).render('seller/login', { error: 'Login failed. Username or password may be wrong.', username });
        });

});

app.get('/signout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).send('Error during logout');
        } else {
            res.redirect('/');
        }
    });
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const confirmPassword = req.body['confirm-pasword'];
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }
    const existingUser = await getUserByName(username);
    if (existingUser) {
        return res.status(400).render('register', { error: 'Username already exists', username });
    }
    Auth.signup(username, password, 'buyer')
        .then(() => {
            req.session.username = username;

            res.redirect('/');
            console.log('Session after signup:', req.session);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error during signup');
        });

});

app.get('/api/product', async (req, res) => {
    // GET all products
});


app.delete('/categories/:id', (req, res) => {
    const targetId = parseInt(req.params.id);
    // ลบโดยการกรองเอาตัวที่ไม่ใช่ ID ที่ส่งมาเก็บไว้แทน
    categories = categories.filter(cat => cat.id !== targetId);
    res.json({ success: true });
    console.log(`Deleted category with ID: ${targetId}`);
});
app.put('/categories/:id', (req, res) => {
    const targetId = parseInt(req.params.id);
    const newName = req.body.name;
    const category = categories.find(cat => cat.id === targetId);
    if (category) {
        category.name = newName;
        res.json({ success: true });
        console.log(`Updated category with ID: ${targetId} to new name: ${category.name}`);
    } else {
        res.status(404).json({ success: false, message: 'Category not found' });
    }
});


app.delete('/api/games/:id', (req, res) => {
    const targetId = parseInt(req.params.id);
    games = games.filter(game => game.id !== targetId);
    res.json({ success: true });
    console.log(`Deleted game with ID: ${targetId}`);
});

app.get('/api/image/:id', async (req, res) => {
    try {
        const data = await getImageByGameProductId(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).send('SERVER ERROR');
        console.error(err);
    }
})

// Webstore APIs

app.post('/api/wishlist/:id', async (req, res) => {
    try {
        const product_id = req.params.id;
        const user = await getUserByName(req.session.username);
        const result = await addToWishlist(user.user_id, product_id)
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

app.listen(3000, () => {
    console.log('The server is listening at port 3000.');
});