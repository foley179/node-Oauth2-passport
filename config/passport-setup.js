require("dotenv").config("../.env")

const passport = require("passport")
const pool = require("../pool.js")

// convention to cap any strats
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy

passport.serializeUser((user, done) => {
    // done is like next in express, it passes onto the next func, 1st arg is an error (null here) 2nd is info to be sent to the next func
    done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
    // this deserialize recieves only the id from user.id from serialize (above)
    // retrieve the user
    const user = await pool.query(
        'SELECT * FROM ninjas_tut WHERE id = $1;', [id]
    )
    // pass the user to done
    done(null, user.rows[0])
})

passport.use(
    new GoogleStrategy({
        // options for the google strat 
        // callback url now requires full url not just the route, this should be HTTPS but it currently causes
        // an error due to no SSL certificate, lowered security to http for testing
        callbackURL: "http://localhost:3000/auth/google/redirect",
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }, async (accessToken, refreshToken, profile, done) => {
        // passport callback func
        /* google sends back an access token for manipulating the chosen account (must be sent if any changes want to made), a refresh token to refresh
            the access token when it times out (neither of these used in this project), the users profile with loads of info, and a func "done" */

        //console.log(profile) // this shows all the info sent from the users profile, used to find path to displayName, thumbnail etc

        // check if user exists
        const result = await pool.query(
            'SELECT * FROM ninjas_tut WHERE google_id = $1;',
            [profile.id]
        )
        if (result.rows.length === 0) {
            // create user if not exists
            const newUser = await pool.query(
                'INSERT INTO ninjas_tut (username, google_id, thumbnail) VALUES($1, $2, $3) RETURNING *;',
                [profile.displayName, profile.id, profile._json.picture]
            )
            // pass new user with done (to serialize i think)
            done(null, newUser.rows[0])
        } else {
            // log in user if exists
            // pass current user with done (to serialize i think)
            done(null, result.rows[0])
        }
    })
)