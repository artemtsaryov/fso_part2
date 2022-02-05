import React from 'react'

const Note = ({ note, toggleImportanceCallback }) => {
  return (
    <li className = 'note'>
      {note.content}
      <button onClick = {() => toggleImportanceCallback(note.id)}>{note.important ? 'make not important' : 'make important'}</button>
    </li>
  )
}

export default Note