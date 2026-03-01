// Resources declaration
const express = require('express');
const bodyParser = require('body-parser');
const Auth = require('./controllers/auth');

const app = express();

app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// Endpoints

app.get('/', (req, res) => {
    res.render('index', {
        // Data here
        categories: ['All Category', 'FPS', 'Soul-Like', 'Family'] // Mock-up Data
    });
});


app.listen(3000, () => {
    console.log("The server is listening at port 3000.");
});