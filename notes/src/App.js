import React, {useState, useEffect} from 'react'
import noteService from './services/notes'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = (props) => {

  const [notes, setNotes] = useState([{content: 'fake note', date: '2022-02-04T09:11:00.000Z', important: false, id: 1000}])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(allNotes => {
        setNotes(allNotes)
      })
  }, [])

  const addNote = (event) => {
    event.preventDefault()

    const noteObject = {
      id: notes.length + 1,
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5
    }

    noteService
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id === id ? returnedNote : n))
      })
      .catch(error => {
        setErrorMessage(`Note '${note.content}' was already removed from server`)

        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

        setNotes(notes.filter(note => note.id !== id))
      })
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message = {successMessage} type = 'success' />
      <Notification message = {errorMessage} type = 'error' />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
            <Note key={note.id} note={note} toggleImportanceCallback = {toggleImportanceOf}/>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type='submit'>save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App





