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
const { PORT, DATABASE_URL, JWT_SECRET, JWT_EXPIRY, PETFINDER_CLIENT_ID, PETFINDER_CLIENT_SECRET} = require('./config');

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

mongoose.connect(DATABASE_URL, {useNewUrlParser:true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))
app.use(express.json())

app.listen(PORT, () => {
  console.log(`Your server started on port ${PORT}`)
})

const logErrors = (err, req, res, next) => {
  console.error(err);
  return res.status(500).json({Error: 'Something went awry'});

}




app.use(logErrors);

let server;


function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject)=> {
        mongoose.connect(
            databaseUrl,
            {useNewUrlParser: true},
            err => {
                if(err) {
                    return reject(err);
                }
                server = app.listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
            }
        );
    });
}

function closeServer() {
    return mongoose.disconnect().then(()=> {
        return new Promise((resolve, reject) => {
            console.log('closing the server');
            server.close(err => {
                if(err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if(require.main === module) {
  runServer(`${process.env.DATABASE_URL}`).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer}