// Resources declaration
const express = require('express');
const bodyParser = require('body-parser');
const Auth = require('./controllers/auth');

const app = express();

app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap'));
app.use(express.static('node_modules/bootstrap-icons'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// Webpage endpoints

app.get('/', (req, res) => {
    res.render('index', {
        // Data here
        categories: ['All Category', 'FPS', 'Soul-Like', 'Family'] // Mock-up Data
    });
});

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
    res.render('wishlist', {
        // Data here
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
    console.log("The server is listening at port 3000.");
});