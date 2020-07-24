'use strict'
require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

app.use(express.static('public'))
app.use(express.json())

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))
app.use(express.json())

app.listen(3000, () => {
  console.log(`Your server started on port ${process.env.PORT}`)
})

