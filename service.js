var express = require('express'),
    app = express(),
    session = require('express-session'),
    passport = require('./auth'),
    router = require('./router')(passport),
    helpers = require('./helpers');

app.use(session({
    resave: false,
    secret: helpers.guid(),
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

exports = module.exports = function (ssl) {
    if (ssl) {
        app.use(function (req, res, next) {
            if (!req.secure) {
                var port = helpers.env('PROXY_SSL_PORT', ''),
                    host = req.headers.host.replace(/[:]\d*/, port !== '' ? ':' + port : '');
                return res.redirect('https://' + host + req.url);
            }
            next();
        });
    }
    app.use(router);
    return app;
};