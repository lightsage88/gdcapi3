let token
const axios = require('axios')
const express = require('express')
const router = express.Router()
const { PETFINDER_CLIENT_ID, PETFINDER_CLIENT_SECRET, PETFINDER_API_URL } = require('../config');

router.use(express.json())

const refreshPetFinderToken = () => {
  return axios({
    url: 'https://api.petfinder.com/v2/oauth2/token',
    method: 'POST',
    data: {
      "client_id": PETFINDER_CLIENT_ID,
      "grant_type":"client_credentials",
      "client_secret": PETFINDER_CLIENT_SECRET
    },
    headers: {
      "accept": "application/json"
    }
  })
  .then(response => {
    token = response.data.access_token;  
  }) 
  .catch(err => {
    console.error(err)
  })
}

router.post('/seekCats', (req,res) => {
  let {breed, coat, color, gender, age} = req.body
  axios({
    url: `${PETFINDER_API_URL}/animals?type=cat&breed=${breed}&coat=${coat}&color=${color}&gender=${gender}&age=${age}`,
    method: "GET",
    headers: {
      "accept": "application/json",
      "authorization" : `Bearer ${token}`
    }
  })
  .then(response => {
    res.send(response.data.animals)
  })
  .catch(err => {
      console.error(err)
  })
})

router.get('/catBreeds', (req, res) => {
  axios({
    url: `${PETFINDER_API_URL}/types/cat/breeds`,
    method: "GET",
    headers: {
      "accept": "application/json",
      "authorization": `Bearer ${token}`
    }
  })
  .then(response => {
    res.send(response.data)
  })
  .catch(err => {
    console.error(err)
  })
})

router.get('/catColorCoatSex', (req,res) => {
  axios({
    url: `${PETFINDER_API_URL}/types/cat`,
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    res.send(response.data.type)
  })
  .catch(err => {
    console.error(err)
  })
})

refreshPetFinderToken()

setInterval(() => {
  token = refreshPetFinderToken()
}, 39000)

module.exports = router