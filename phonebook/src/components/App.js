import React, {useState, useEffect} from 'react'
import axios from 'axios'
import personsService from '../services/persons'
import Filter from './Filter'
import Form from './Form'
import Persons from './Persons'
import Notification from './Notification'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [currentQuery, setCurrentQuery] = useState('')
  const [notification, setNotification] = useState({message: null, type: null})
  const [notificationCleanupTimeout, setNotificationCleanupTimeout] = useState(null)

  const showNotification = (message, type) => {
    setNotification({message: message, type: type})

    clearTimeout(notificationCleanupTimeout)
    setNotificationCleanupTimeout(setTimeout(() => {
      setNotification({message: null, type: null})
    }, 5000))
  }

  useEffect(() => {
    personsService.getAll()
      .then(allPersons => {
        setPersons(allPersons)
        showNotification('successfully loaded phonebook', 'success')
      })
  }, [])

  const personsToShow = persons.filter(p => p.name.toLowerCase().includes(currentQuery.toLowerCase()))

  const addNewPerson = (event) => {
    event.preventDefault()
    
    const person = persons.find(p => p.name === newName)
    if (person !== undefined) {
      if (person.number === newNumber) {
        showNotification(`${person.name} is already in phonebook with number ${person.number}`, 'success')
      }
      else {
        if (window.confirm(`Do you want to update phone number for ${person.name}?`)) {
          personsService.update({...person, number: newNumber})
            .then((updatedPerson) => {
              setPersons(persons.map(p => p.id === updatedPerson.id ? updatedPerson: p))
              showNotification(`${person.name} is now in phonebook with new number ${updatedPerson.number}`, 'success')
            })
            .catch (error => {
              if (error.response.status === 404) {
                showNotification(`Sorry, ${person.name} must have been removed from phonebook`, 'error')
                setPersons(persons.filter(p => p.id !== person.id))
              }
              else {
                showNotification(`Sorry, not able to update phone number of ${person.name}`, 'error')
              }
            })
        }
      }
      return
    }

    personsService.create({name: newName, number: newNumber})
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`${createdPerson.name} is now in phonebook with number ${createdPerson.number}`, 'success')
      })
      .catch (error => {
        showNotification(`Sorry, not able to add ${newName} to phonebook`, 'error')
      })
  }

  const removePerson = (id) => {

    const personToRemove = persons.find(p => p.id === id)

    if (window.confirm(`Do you want to remove ${personToRemove.name} from the phonebook?`)) {
      personsService.remove(id)
      .then(response => {
        setPersons(persons.filter(person => person.id !== id))
        showNotification(`${personToRemove.name} is removed from phonebook`, 'success')
      })
      .catch (error => {
        if (error.response.status === 404) {
          showNotification(`Sorry, ${personToRemove.name} must have been already removed from phonebook`, 'error')
          setPersons(persons.filter(person => person.id !== id))
        }
        else {
          showNotification(`Sorry, not able to remove ${personToRemove.name} from phonebook`, 'error')
        }
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message = {notification.message} type = {notification.type} />
      <Filter currentQuery = {currentQuery} callback = {event => setCurrentQuery(event.target.value)} />
      <h2>Numbers</h2>
      <Persons personsToShow = {personsToShow} removeCallback = {removePerson}/>
      <h2>Add new</h2>
      <Form submitCallback = {addNewPerson}
            newNameCallback = {event => setNewName(event.target.value)}
            newNumberCallback = {event => setNewNumber(event.target.value)}
            newName = {newName}
            newNumber = {newNumber}/>
    </div>
  )
}

export default App
