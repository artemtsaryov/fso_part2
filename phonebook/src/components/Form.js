import React from 'react'

const Form = ({submitCallback, newNameCallback, newNumberCallback, newName, newNumber}) => {
  return(
    <form onSubmit={submitCallback}>
      <div>
        name: <input value = {newName} onChange = {newNameCallback}/>
      </div>
      <div>
        number: <input value = {newNumber} onChange = {newNumberCallback}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
} 

export default Form