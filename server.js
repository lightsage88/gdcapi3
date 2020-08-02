'use strict'
require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

const app = express()
const { PORT, DATABASE_URL } = require('./config')
const { localStrategy, jwtStrategy } = require('./routes/strategies')

mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

app.use(express.static('public'))
passport.use(localStrategy)
passport.use(jwtStrategy)
app.use(morgan('common'))
app.use(express.json())
app.use(logErrors)
app.use(cors())
app.options('*', cors())


const usersRouter = require('./routes/users')
const catsRouter = require('./routes/cats')
const authRouter = require('./routes/auth')
app.use('/api/users', usersRouter)
app.use('/api/cats', catsRouter)
app.use('/api/auth', authRouter)

mongoose.connect(DATABASE_URL, {useNewUrlParser:true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

app.listen(PORT, () => {
  console.log(`Your server started on port ${PORT}`)
})

const logErrors = (err, req, res, next) => {
  console.error(err)
  return res.status(500).json({Error: 'Something went awry'})
}

module.exports = {app}