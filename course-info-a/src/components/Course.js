import React from 'react'

const Course = ({course}) => {
    return (
    <div>
      <Header text = {course.name}/>
      <Content parts = {course.parts}/>
      <Total number = {course.parts.reduce((exercisesSum, part) => {
        return exercisesSum += part.exercises}, 0)
        }/>
    </div>
    )
  }
  
  const Header = ({text}) => <h2>{text}</h2>
  
  const Content = ({parts}) => {
    return (
    <div>
      {parts.map((part) => <Part key = {part.id} part = {part} /> )}
    </div>
    )
  }
  
  const Part = ({part}) => <p>{part.name} {part.exercises}</p>
  
  const Total = ({number}) => <p>Total of {number} exercises</p>

  export default Course