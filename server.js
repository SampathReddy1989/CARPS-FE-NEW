//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);

// Express CORS
app.all('*', function (req, res, next) {
    origin = req.get('Origin') || '*';
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Expose-Headers', 'Content-Length');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type'); // add the list of headers your site allows.
    if ('OPTIONS' == req.method) return res.send(200);
    next();
});

// Avoid SSL
app.use(function (req, res, next) {
    if (req.headers['x-forwarded-proto'] === 'https') {
        res.redirect('http://' + req.hostname + req.url);
    } else {
        next();
    }
});


// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/health-care-management-web'));


app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/health-care-management-web/index.html'));
});
