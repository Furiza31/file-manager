const express = require('express');
const app = express();
const config = require('./config.json');
const Workspace = require('./workspace');
const workspace = new Workspace();

const start = () => {
    app.use(express.static('public'));

    app.set("twig options", {
        allow_async: true,
        strict_variables: false
    });

    app.get('/', (req, res) => {
        res.render('workspace.html.twig', {message : "Hello World"});
    });

    app.get('/setup/:cookie', (req, res) => {
        console.log(req.params.cookie);
    });

    app.listen(config.PORT, () => {
        console.log(`Server is running on http://127.0.0.1:${config.PORT}`);
    });
}

module.exports = {
    start,
    workspace
};