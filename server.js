require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const MOVIES = require('./movies.json')
const helmet = require('helmet')
const cors = require('cors')

const app = express()
console.log(process.env.API_TOKEN)

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
   console.log('validate bearer token middleware')
   // move to the next middleware
   const authToken = req.get('Authorization')
   const apiToken = process.env.API_TOKEN

   if (!authToken || authToken.split(' ')[1] !== apiToken) {
     return res.status(401).json({ error: 'Unauthorized request' })
   }
  next()
 })

 function handleGetMovie(req, res) {
    let response = MOVIES;

   if (req.query.genre) {
     const movie_Genre = req.query['genre'].charAt(0).toLowerCase() + req.query['genre'].slice(1)
     response = response.filter(movie => movie.genre.toLowerCase().includes(movie_Genre))
   }

   if (req.query.country) {
     const movie_Country = req.query['country'].charAt(0).toLowerCase() + req.query['country'].slice(1)
     response = response.filter(movie => movie.country.toLowerCase().includes(movie_Country))
   }
   if (req.query.averageVote) {
     const movie_averageVote = req.query['averageVote']
     response = response.filter(movie => movie.avg_vote >= movie_averageVote)
   }
   res.send(response)
 }

app.get('/movie', handleGetMovie)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
