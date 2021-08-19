const router = require("express").Router()

const authCheck = (req, res, next) => {
    if(!req.user) {
        // if user is not logged in
        res.redirect("/auth/login")
    } else {
        // if logged in
        next()
    }
}

router.get("/", authCheck, (req, res) => {
    //res.send(`you are logged in as ${req.user.username}`) // for testing
    // you can send extra info to your "view" by sending an object
    res.render("profile", {user: req.user})
})

module.exports = router