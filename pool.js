require("dotenv").config()

const {Pool} = require("pg")

const pool = new Pool({
    user: process.env.poolUser,
    host: process.env.poolHost,
    database: process.env.poolDatabase,
    password: process.env.poolPassword,
    port: 5432,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000
})

module.exports = pool