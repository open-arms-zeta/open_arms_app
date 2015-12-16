var express = require('express');
var router = express.Router();

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('../');
});

router.get('/*', function(req,res){
    res.send(req.user);
});

module.exports = router;