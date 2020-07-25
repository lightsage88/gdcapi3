'use strict'
require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.options('*', cors())
const passport = require('passport')
const morgan = require('morgan')

const {localStrategy, jwtStrategy} = require('./routes/strategies')
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

app.use(express.static('public'))
passport.use(localStrategy)
passport.use(jwtStrategy)
app.use(morgan('common'))
app.use(express.json())


const usersRouter = require('./routes/users')
const catsRouter = require('./routes/cats')
const authRouter = require('./routes/auth')
app.use('/api/users', usersRouter)
app.use('/api/cats', catsRouter)
app.use('/api/auth', authRouter)

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))
app.use(express.json())

app.listen(3000, () => {
  console.log(`Your server started on port ${process.env.PORT}`)
})

module.exports = {app, runServer, closeServer};