const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :wanted_data'))

morgan.token('wanted_data', function (req, res) { return JSON.stringify(req.body) })

let persons = [
      { 
        name: "Arto Hellas", 
        number: "040-123456",
        id: "1"
      },
      { 
        name: "Ada Lovelace", 
        number: "39-44-5323523",
        id: "2"
      },
      { 
        name: "Dan Abramov", 
        number: "12-43-234345",
        id: "3"
      },
      { 
        name: "Mary Poppendieck", 
        number: "39-23-6423122",
        id: "4"
      }
    ]


app.get('/info', (request, response) => {
    const size = persons.length
    const timestamp = new Date();
    response.send(
    `<p>Phonebooks has info for ${size} people</p> 
    <p>${timestamp.toString()}</p>`)
  })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
  
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const contact = persons.find(person => person.id === id)
    if(contact){
        response.json(contact)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(note => note.id !== id)
    response.status(204).end()
  })

const generateId = () => {
const value = Math.floor(Math.random()*1000)
return String(value)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ 
        error: 'Name or number missing' 
        })
    }

    if(persons.filter(person => person.name===body.name).length!==0){
        return response.status(400).json({
        error: 'Name already in contacts'
        })
    }

    let new_id = generateId()
    //Endless loop if more than 1000 contacts
    while(persons.filter(person => person.id === new_id).length !== 0){
        console.log("id already exists, generating new one")
        new_id = generateId()
    }

    const person = {
        name: body.name,
        number: body.number,
        id: new_id,
    }

    persons = persons.concat(person)
    response.json(person)
})  

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})