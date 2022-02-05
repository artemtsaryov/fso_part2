import React from 'react'

const Entry = ({id, name, number, removeCallback}) => {
  return (
    <li>
      {name} {number} <button onClick = {removeCallback}>remove</button>
    </li>
  )
}

export default Entry