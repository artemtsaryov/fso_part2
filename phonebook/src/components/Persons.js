import React from 'react'
import Entry from './Entry'

const Persons = ({personsToShow, removeCallback}) => {
  return(
    <ul>
      {personsToShow.map(({id, name, number}) => <Entry key = {id} name = {name} number = {number} removeCallback = {() => removeCallback(id)}/>)}
    </ul>
  )
}

export default Persons