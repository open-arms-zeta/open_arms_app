function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    else {
        console.log('redirect!');

        return res.send(false);
    }
}

module.exports = ensureAuthenticated;