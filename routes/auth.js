'use strict'
require('dotenv').config()
const router = express.Router()
const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const bodyParser = require('body-parser')
const { JWT_SECRET, JWT_EXPIRY } = require('../config')

router.use(bodyParser.json())

const localAuth = passport.authenticate('local', {session: false})

const createAuthToken = function(user) {
  return jwt.sign({user}, JWT_SECRET, {
    subject: String(user.username),
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  })
}

router.post('/login', localAuth, (req,res)=> {
  const user = req.user.serialize()
  const authToken = createAuthToken(String(req.user.username))
  res.json({authToken, user} || err)
})

router.post('/refreshToken', (req,res)=>{
  jwt.verify(req.body.token, JWT_SECRET, (err, decoded) => {
    if(!err && decoded) {
      const authToken = createAuthToken(req.body.username);
      res.json({authToken})
    } else {
      return res.status(401)
    }
  })
})

router.post('/jwtDecode', (req,res) => {
  jwt.verify(req.body.authToken, JWT_SECRET, (err, decoded) => {
    res.json(decoded)
  })
})

module.exports = router