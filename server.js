// Resources declaration
const express = require('express');
const bodyParser = require('body-parser');
const Auth = require('./controllers/auth');
const session = require('express-session');
const sessionStore = require('./models/session');


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

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

// Webpage endpoints

app.get('/', (req, res) => {
    console.log('Session before rendering:', req.session);
    if (req.session.username) {
        res.render('index', {

            username: req.session.username,
            role: req.session.role
        });
    } else {
        console.log('No user logged in, rendering identification page.');
        res.render('index', {
            categories: categories
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

let categories = ['All Category', 'FPS', 'Soul-Like', 'Family'] // Mock-up Data
app.get('/login', (req, res) => {
    res.render('identification', {
        // Data here
    });
});

app.get('/account', (req, res) => {
    res.render('personalInformation', {
        // Data here
    });
});

app.get('/result', (req, res) => {
    res.render('searchResult', {
        // Data here
    });
});

app.get('/productdetail', (req, res) => {
    res.render('productDetail', {
        // Data here
    });
});
app.get('/cart', (req, res) => {
    res.render('shoppingCart', {
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

app.get('/product', (req, res) => {
    // GET all products
})


app.listen(3000, () => {
    console.log('The server is listening at port 3000.');
});