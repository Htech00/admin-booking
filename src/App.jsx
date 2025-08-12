import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import HomePage from './pages/HomePage'
import { AuthProvider } from './context/AuthContext'


function App() {
  return (
    <AuthProvider>
      <Router >
        <Toaster position='top-center' />
        <Routes>
          <Route path='/' element={<HomePage />}  />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
    
  )
}

export default App
