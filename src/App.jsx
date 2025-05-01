import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import QuizTechie from './components/QuizHome'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <QuizTechie/>
    </>
  )
}

export default App
