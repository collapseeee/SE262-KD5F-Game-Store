// Resources declaration
const express = require('express');
const bodyParser = require('body-parser');
const Auth = require('./controllers/auth');
const Account = require('./models/account');
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
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// Endpoints

app.get('/', (req, res) => {
    res.render('index', {
        // Data here
    });
});

app.post('/loginBuyer', (req, res) => {
    const { username, password, role } = req.body;
    Auth.loginBuyer(username, password, role)
        .then(() => {
            req.session.username = username;
            req.session.role = role;
            res.send("Login successful");
            console.log("Session after login:", req.session);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Error during login");
        });
    
});

app.post('/loginSeller', (req, res) => {
    const { username, password, role } = req.body;
    Auth.loginSeller(username, password, role)
        .then(() => {
            req.session.username = username;
            req.session.role = role;
            res.send("Login successful");
            console.log("Session after login:", req.session);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Error during login");
        });
    
});

app.post('/signup', (req, res) => {
    const { username, password, role } = req.body;
    Auth.signup(username, password, role)
        .then(() => {
            req.session.username = username;
            req.session.role = role;
            res.send("Signup successful");
            console.log("Session after signup:", req.session);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Error during signup");
        });
    
});
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).send("Error during logout");
        } else {
            res.send("Logout successful");
            res.redirect('/');
        }
    });
});



app.listen(3000, () => {
    console.log("The server is listening at port 3000.");
});