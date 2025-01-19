const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const contactName = process.argv[3]
const contactNumber = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@hy-fullstack-osa3.ci6i7.mongodb.net/contactApp?retryWrites=true&w=majority&appName=hy-fullstack-osa3`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length===3) {
  findContacts()
}

if (process.argv.length===5){
  const contact = new Contact({
    name: contactName,
    number: contactNumber,
  })

  contact.save().then(() => {
    console.log('Added', contactName, 'number', contactNumber, 'to phonebook')
    mongoose.connection.close()
  })

}


function findContacts () {
  console.log('phonebook:')
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact.name, contact.number)
    })
    mongoose.connection.close()
  })
}
/*
Contact.find({}).then(result => {
  result.forEach(contact => {
    console.log(contact)
  })
  mongoose.connection.close()
})
  */