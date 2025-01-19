require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Contact = require('./models/contact')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }
  next(error)
}

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :wanted_data'))

morgan.token('wanted_data', function (req, res) { return JSON.stringify(req.body) })


app.get('/info', (request, response) => {
    const timestamp = new Date();
    Contact.countDocuments({}).then(sum => {
      response.send(
        `<p>Phonebooks has info for ${sum} people</p> 
        <p>${timestamp.toString()}</p>`)
    })

  })
  
app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})
  
app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Contact.findById(id).then(contact => {
      if(contact){
      response.json(contact)
      }
      else{
        response.status(404).end()
      }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Contact.findByIdAndDelete(id).then(result => {
      response.status(204).end()
    }).catch(error => next(error))
  
  })

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    console.log("log body ", body)
    /*
    if (!body.name || !body.number) {
        return response.status(400).json({ 
        error: 'Name or number missing' 
        })
    }
  */
    const person = new Contact({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedContact => {
      response.json(savedContact)
    }).catch(error  => next(error))
})  

app.put('/api/persons/:id', (request, response, next)=> {
  const {name, number} = request.body

  Contact.findByIdAndUpdate(request.params.id, {name, number}, 
    {new: true, runValidators: true, context: 'query'}).then(updatedContact => {
      if(updatedContact===null){
        response.status(410).end()
      }
      else{
      response.json(updatedContact)
      }
  }).catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})