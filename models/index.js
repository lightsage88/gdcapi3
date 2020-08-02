"use strict"
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const catSchema = mongoose.Schema({
  catID: {
      type: Number
  },
  age: {
      type: String
  },
  breeds: {
      type: Object
  },
  coat: {
      type: String
  },
  colors: {
      type: Object
  },
  description: {
      type:String
  },
  gender: {
      type: String
  },
  location: {
      type: String
  },
  name: {
      type: String,
      required: true
  },
  petfinderid: {
      type: String
  },
  photos: {
      type: Array
  },
  status:{
      type: String
  }
})

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type:String,
    required: true
  },
  authToken: {
    type: String
  },
  loggedIn: {
    type: Boolean
  },
  firstName: {
    type: String,
    required: true,
    default: ''
  },
  lastName: {
    type: String,
    required: true,
    default: ''
  },
  birthday: {
    type: Object,
    required: false
  },
  zodiacCombo:{
    type: Object
  },
  cats: [catSchema]
})

userSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    birthday: this.birthday || '',
    cats: this.cats || [],
    zodiacCombo: this.zodiacCombo || {},
    authToken: this.authToken || ''
  }
}

userSchema.methods.validatePassword = function(passwordStringBeingPassedIn){
  return bcrypt.compare(passwordStringBeingPassedIn, this.password)
}

userSchema.statics.hashPassword = function(passwordStringBeingPassedIn){
  return bcrypt.hash(passwordStringBeingPassedIn, 10)
}

userSchema.virtual("fullName").get(function(){
  return `${this.firstName} ${this.lastName}`.trim()
})

userSchema.virtual("mostRecentCharacter").get(function(){
  const characterObject =
    this.characterChoices.sort((a,b)=>{
      return b.date - a.date
    })[0] || {}

  return characterObject
})

const User = mongoose.model("User", userSchema)
const Cat = mongoose.model("Cat", catSchema)
module.exports = { User, Cat }
