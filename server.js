// Resources declaration
const express = require('express');
const bodyParser = require('body-parser');
const Auth = require('./controllers/auth');
const Account = require('./models/account');

const app = express();

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
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    Auth.signup(username, password)
        .then(() => {
            res.send("Signup successful");
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Error during signup");
        });
    
});



app.listen(3000, () => {
    console.log("The server is listening at port 3000.");
});