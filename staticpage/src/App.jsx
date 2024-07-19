import React from 'react'
import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Body from './components/Body'
import Footer from './components/Footer'

/*
Design: Blackhawks red background color, maybe w logo.
header: img, div (name, pos, espn site)
body: Whatever stats desired
footer: socials
*/

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Ryan's hungover webpage!</h1>
      <div className = "content">
        <Header />
        <Body />
        <Footer />
      </div>
    </div>
  )
}

export default App
