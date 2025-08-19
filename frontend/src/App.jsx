import React from 'react'
import { Routes, Route } from 'react-router'
import Homepage from './pages/homepage'
import Createpage from './pages/createpage'
import Notepage from './pages/Notepage'
import { toast } from 'react-hot-toast'

const App = () => {
  return (
    <div data-theme = "forest">
      <Routes>
        <Route path="/" element = {<Homepage/>}/>
        <Route path="/create" element = {<Createpage/>}/>
        <Route path="/note/:id" element = {<Notepage/>}/>
      </Routes>

    </div>
  )
}

export default App