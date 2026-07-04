import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <--- Import kiya

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Studio from './pages/Studio';
import BattleArena from './pages/BattleArena';
import DigitalWardrobe from './pages/DigitalWardrobe';

function App() {
  return (
    <Router>
      <div className="App font-sans">
        {/* Toast Notification Setup (Colors hmare theme k hisab se) */}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#ffb7c5', // Pink tick
                secondary: 'black',
              },
            },
          }}
        />
        
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/battle" element={<BattleArena />} />
          <Route path="/wardrobe" element={<DigitalWardrobe />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;