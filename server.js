// Resources declaration
const express = require('express');
const bodyParser = require('body-parser');
const Auth = require('./controllers/auth');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// Endpoints

app.get('/', (req, res) => {
    res.render('index', {
        // Data here
    });
});


app.listen(3000, () => {
    console.log("The server is listening at port 3000.");
});