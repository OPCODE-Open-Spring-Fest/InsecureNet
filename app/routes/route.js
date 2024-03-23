const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(express.static(path.join(__dirname, "../public")));

const loginController = require(path.join(__dirname,"../controllers/loginController"));
const signupController = require(path.join(__dirname,"../controllers/signupController"));
const viewController = require(path.join(__dirname,"../controllers/viewControllers"));
const productController = require(path.join(__dirname,"../controllers/productController"));
require('dotenv').config();

router.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false
}));



router.get('/', viewController.productListView)
router.post('/search', productController.searchProducts)
router.get('/login', viewController.loginView)
router.post('/login', loginController.login)
router.get('/register', viewController.signUpView)
router.post('/register', signupController.signUp);
router.get('/forgotPass', viewController.forgotPassView)
router.post('/forgotPass', loginController.forgotPass)
router.post('/changePass', loginController.changePass)
router.post('/logout', loginController.logout)

module.exports = router;