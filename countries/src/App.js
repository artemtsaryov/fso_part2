import React, {useEffect, useState} from 'react'
import axios from 'axios'

function App() {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [cca3Hint, setCca3Hint] = useState('')
  const [weather, setWeather] = useState({country: '', data: undefined})

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data)
      })
  }, [])

  let matchedCountries = []
  if (cca3Hint === '') {
    matchedCountries = countries.filter(country => {
      return country.name.common.toLowerCase().includes(query.toLowerCase())
    })
  }
  else {
    matchedCountries = [countries.find(country => country.cca3 === cca3Hint)]
  }

  useEffect(() => {
    if (matchedCountries.length === 1 && matchedCountries[0].cca3 !== weather.country) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${matchedCountries[0].capital[0]}&units=metric&appid=${process.env.REACT_APP_API_KEY}`)
        .then((response) => {
          setWeather({country: matchedCountries[0].cca3, data: response.data})
        })
      }
  })

  let output  
  if (matchedCountries.length === 0) {
    output = <p>No countries found</p>
  }
  else if (matchedCountries.length === 1) {   
    let weatherOuput = <p>The weather is not available</p>

    if (matchedCountries[0].cca3 === weather.country) {

      const windDegreeToDirection = (degree) => {
        const dict = [
          {direction: 'N', degree: 0},
          {direction: 'NE', degree: 45},
          {direction: 'E', degree: 90},
          {direction: 'SE', degree: 135},
          {direction: 'S', degree: 180},
          {direction: 'SW', degree: 225},
          {direction: 'W', degree: 270},
          {direction: 'NW', degree: 315},
          {direction: 'N', degree: 360}
        ]

        const windDirection = dict.reduce((current, elem) => {
          const newCurrent = current
          if (Math.abs(degree - elem.degree) < current.distance) {
            newCurrent.distance = Math.abs(degree - elem.degree)
            newCurrent.closest = elem.direction
          }
          return newCurrent
        }, {closest: 'N', distance: 360})

        return windDirection.closest
      }
      
      weatherOuput = 
      <div>
        <p>Temperature: {weather.data.main.temp} Celsius</p>
        <p>Wind: {weather.data.wind.speed} meter/sec ({windDegreeToDirection(weather.data.wind.deg)})</p>
      </div>
    }

    output = 
      <div>
        <h2>{matchedCountries[0].name.common}</h2>
        <p>Capital: {matchedCountries[0].capital[0] || 'No capital found'}</p>
        <p>Population: {matchedCountries[0].population}</p>
        <h3>Spoken languages</h3>
        <ul>
          {Object.entries(matchedCountries[0].languages).map(([key, value]) => <li key = {key}>{value} ({key})</li>)}
        </ul>
        <img src = {matchedCountries[0].flags.png} alt = 'No flag found'/>
        <h3>The weather in capital</h3>
        {weatherOuput}
      </div>  
  }
  else if (matchedCountries.length <= 10) {
    output = <ul>
      {matchedCountries.map(country => <li key = {country.cca3}>{country.name.common} <button onClick = {() => 
        setCca3Hint(country.cca3)}>Show</button></li>)}
    </ul>
  }
  else {
    output = <p>Too many results, please specify another filter</p>  
  }
  
  return (
    <>
      <div>
        find country: <input value = {query} onChange = {(event) => {
          setCca3Hint('')
          setQuery(event.target.value)
        }} />
      </div>
      <div>
        {output}
    </div>
   </>
  )
}

export default App
