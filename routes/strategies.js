'use strict'
require('dotenv').config()
const dotenv = require('dotenv')
let JWT_SECRET = dotenv.config()

const {Strategy: LocalStrategy} = require('passport-local')
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt')
const {User} = require('../models')
const localStrategy = new LocalStrategy((username, password, callback) => {
  let user
  User.findOne({username: username})
  .then(foundUser => {
    user = foundUser
    if(!user) {
      return Promise.reject({
        reason: 'LoginError',
        message: 'Incorrect username or password'
      })
    }
    return user.validatePassword(password)
  })
  .then(isValid => {
    if(!isValid) {
      return Promise.reject({
        reason: "LoginError",
        message: "Incorrect username or password"
      })
    }
    return callback(null, user)
  })
  .catch(err => {
      if(err.reason === 'LoginError') {
        return callback(null, false, err);
      }
      return callback(err, false)
  })
})

const jwtStrategy = new JwtStrategy({
  secretOrKey: JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy }