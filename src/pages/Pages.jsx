import React from 'react'
import Home from './Home'
import Cuisine from './Cuisine'
import Searched from './Searched'
import Recipe from './Recipe'
import { Route, Routes, BrowserRouter, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Auth from "./Auth";
import Register from "./Register";
import Favorites from "./Favorites";
import UserProfile from "./UserProfile";

function Pages() {
  const location = useLocation();
  return (
    <AnimatePresence wait>
    <Routes location={location} key={location.pathname}>
        <Route path='/' element={<Home />} />
        <Route path='/recipes_cuisine/:type' element={<Cuisine />} />
        <Route path='/searched/:search' element={<Searched />} />
        <Route path='/recipe/:id' element={<Recipe />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<UserProfile />} />
    </Routes>
    </AnimatePresence>

  )
}

export default Pages