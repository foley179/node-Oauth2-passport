const router = require("express").Router()
const passport = require("passport")

// auth login
router.get("/login", (req, res) => {
    res.render("login", {user: req.user})
})

// auth logout
router.get("/logout", (req, res) => {
    // logout() handled by passport, it removes users id from the session cookie, a session cookie will still exist but it will have no personal info
    // in it, it will instead be basic anonymous viewers info
    req.logout()
    // then redirects back to homepage
    res.redirect("/")
})

// auth with google
router.get("/google", passport.authenticate("google", {
    // permissions that your app will ask google for
    scope: ["profile"]
}))

// callback route for google to redirect to
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    // the authenticate middleware sends the token recieved from the first authenticate (above) back to google to retrieve the profile info
    //res.send("you reached the callback uri") // for testing
    res.redirect("/profile")
})

module.exports = router