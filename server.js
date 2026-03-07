// Resources declaration
const express = require('express');
const bodyParser = require('body-parser');
const Auth = require('./controllers/auth');
const session = require('express-session');
const sessionStore = require('./models/session');
const { getAllProduct, searchProduct } = require('./models/product');
const { getAllCategory } = require('./models/category');
const { getImageByGameProductId } = require('./models/image');

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

app.use(express.json());

app.use(express.static('node_modules/bootstrap'));
app.use(express.static('node_modules/bootstrap-icons'));
app.use(express.static('node_modules/bootstrap-multiselect'));
app.use(express.static('node_modules/jquery'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');


// Webpage endpoints

app.get('/', async (req, res) => {
    console.log('Session before rendering:', req.session);
    const games = await getAllProduct();
    const categories = await getAllCategory();
    console.log(games);
    if (req.session.username) {
        res.render('index', {

            username: req.session.username,
            role: req.session.role
        });
    } else {
        console.log('No user logged in, rendering identification page.');
        res.render('index', {
            categories: categories,
            games: games
        });
    }
});


app.post('/loginBuyer', (req, res) => {
    const { username, password, role } = req.body;
    Auth.loginBuyer(username, password, role)
        .then(() => {
            req.session.username = username;
            req.session.role = role;
            console.log('Session after login:', req.session);
            return res.redirect('/');
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error during login');
        });

});

app.post('/loginSeller', (req, res) => {
    const { username, password, role } = req.body;
    Auth.loginSeller(username, password, role)
        .then(() => {
            req.session.username = username;
            req.session.role = role;

            res.redirect('/');
            console.log('Session after login:', req.session);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error during login');
        });

});

app.post('/signup', (req, res) => {
    const { username, password, role } = req.body;
    Auth.signup(username, password, role)
        .then(() => {
            req.session.username = username;
            req.session.role = role;

            res.redirect('/');
            console.log('Session after signup:', req.session);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error during signup');
        });

});
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).send('Error during logout');
        } else {
            res.send('Logout successful');
            res.redirect('/');
        }



    });
});
app.get('/login', (req, res) => {
    res.render('identification', {
        // Data here
    });
});

app.get('/register', (req, res) => {
    res.render('register');
})

app.get('/account', (req, res) => {
    res.render('buyer/personalInformation', {
        // Data here
        categories: categories
    });
});

// SEARCH PRODUCTS
app.get('/result', async (req, res) => {
    const { gameName, categories } = req.query;
    let filteredIds = ''
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
    console.log(filteredIds)
    const results = await searchProduct(gameName, filteredIds);
    console.log(results);

    res.render('buyer/searchResult', {
        games: results
    });
});

app.get('/productdetail', (req, res) => {
    res.render('productDetail', {
        // Data here
    });
});
app.get('/cart', (req, res) => {
    res.render('buyer/shoppingCart', {
        // Data here
    });
});
app.get('/checkout', (req, res) => {
    res.render('checkout', {
        // Data here
    });
});
app.get('/wishlist', (req, res) => {

    // Get product where user.id = wishlist.user_id DISTINCT product_id
    const games = [{
        name: "HELLDIVER 2",
        categories: ['Action', 'Shooter'],
        price: 999.99,
        wishlisted_date: Date.now()
    }, {
        name: "Phasmophobia",
        categories: ['Horror'],
        price: 0.99,
        wishlisted_date: Date.now()
    }];

    res.render('buyer/wishlist', {
        // Data here
        categories: categories,
        games: games
    });
});
app.get('/contact', (req, res) => {

    res.render('contact', {
        // Data here
        categories: ['All Category', 'FPS', 'Soul-Like', 'Family']
    });
});

// API endpoints

app.get('/api/product', async (req, res) => {
    // GET all products
    try {
        const data = await getAllProduct();
        res.json(data);
    } catch (err) {
        res.status(500).send('SERVER ERROR');
        console.log(err)
    }
})

app.get('/api/image/:id', async (req, res) => {
    try {
        const data = await getImageByGameProductId(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).send('SERVER ERROR');
        console.error(err);
    }
})

app.listen(3000, () => {
    console.log('The server is listening at port 3000.');
});