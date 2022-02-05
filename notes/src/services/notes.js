import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  return axios
          .get(baseUrl)
          .then(response => {
            const fakeNote = {
              id: 1000,
              content: 'Fake note - try it',
              date: '2022-01-30T13:12:00:.000Z',
              important: true
            }
            return response.data.concat(fakeNote)
          })
}

const create = newObject => {
  return axios
          .post(baseUrl, newObject)
          .then(response => {
            return response.data
          })
}

const update = (id, object) => {
  return axios
          .put(`${baseUrl}/${id}`, object)
          .then(response => {
            return response.data
          })
}

export default { getAll , create, update }