const axios = require('axios');
const { authenticate } = require('../auth/authenticate');
const db = require('../database/dbConfig.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  let user = req.body
    user.password = bcrypt.hashSync(user.password, 8);
    console.log(user);

    db('users')
        .insert(user)
        .then(response => res.status(200).json(response))
        .catch(err => res.status(500).json({errMessage: "there as an error retrieving your resources, either you havent completed the form or that username is already taken..."}))

}

function login(req, res) {

  const { username, password } = req.body
    db('users')
        .where({ username })
        .first()
        .then(user => {
            if(bcrypt.compareSync(password, user.password)){
                const token = generateToken(user)
                res.status(200).json({
                    message: "welcome back!",
                    token
                });
            }else{
                res.status(401).json({message: "invalid credentials"})
            }
        })
        .catch(err => res.status(500).json({errMessage: "unable to log you in!"}))
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}


function generateToken(user){
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: '4h'
  };
  
  return jwt.sign(payload, secret, options)
}