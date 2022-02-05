import React from 'react'

const Filter = ({currentQuery, callback}) => {
  return(
    <div>
      find: <input value = {currentQuery} onChange = {callback}/>
    </div>
  )
}


export default Filter