const userModel = require('../models/user-model');

async function addToCart(req, res, next) {
    try {
        if (!req.user || req.user === "unsigned") {
            let guestCart = [];
            try {
                guestCart = JSON.parse(decodeURIComponent(req.cookies.guestCart || "[]"));

            } catch (e) {
                guestCart = [];
            }
            res.locals.cart = guestCart;
            res.locals.user = "unsigned";
        } else {
            const user = await userModel.findOne({ username: req.user.username });
            res.locals.cart = user.cart || [];
            res.locals.user = req.user;
        }
        next();
    } catch (err) {
        console.error("AddToCart Middleware Error:", err);
        res.locals.cart = [];
        res.locals.user = req.user || "unsigned";
        next();
    }
}

module.exports = addToCart;
