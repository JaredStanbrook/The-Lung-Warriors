var express = require('express');
var router = express.Router();
var login = require('../controller/authenticate/login');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* GET users listing. */
router.post('/login', function (req, res, next) {

    const username = req.body.username;
    let loginResult = login(username, req.body.password);

    if (loginResult) {
        res.render('users', {username: username}); /* If login is True */
    }
    else {
        res.render('index', {error: true});
    }
});

module.exports = router;