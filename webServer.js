const express = require('express');
const app = express();
const config = require('./config.json');

const start = () => {
    app.use(express.static('public'));

    app.set("twig options", {
        allow_async: true,
        strict_variables: false
    });

    app.get('/', function (req, res) {
        res.render('index.html.twig', {message : "Hello World"});
    });

    app.listen(config.PORT, () => {
        console.log(`Server is running on http://127.0.0.1:${config.PORT}`);
    });
}

exports.start = start;