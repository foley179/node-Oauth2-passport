require("dotenv").config()

const express = require('express')
const authRoutes = require("./routes/auth-routes")
const profileRoutes = require("./routes/profile-routes")
// only have to require passportSetup in to make sure it runs once (pulls it from the authRouter)
const passportSetup = require("./config/passport-setup")
const cookieSession = require("cookie-session")
const passport = require("passport")

const app = express()
app.use(cookieSession({
    // this creates the cookie to keep a session open, maxAge is how long the session will stay active, this equation is a day in milliseconds
    // the keys can take multiple args to choose from but this is the key used to encrypt the user.id we use to authenticate the user
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.cookie_key]
}))

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

// set up view engine
app.set("view engine", "ejs")

// setup routes
app.use("/auth", authRoutes)
app.use("/profile", profileRoutes)

//create home route
app.get("/", (req, res) => {
    res.render("home", {user: req.user})
})

app.listen(3000, () => {
    console.log("server listening on port 3000")
})