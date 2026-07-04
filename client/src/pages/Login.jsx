import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'; // <--- Toast Import

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const loadToast = toast.loading("Logging In..."); // Loading animation

      const { data } = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      // Data save karo
      localStorage.setItem('userInfo', JSON.stringify(data));

      toast.dismiss(loadToast); // Loading hatao
      toast.success("Login Successful! Welcome back! 🔓");
      setLoading(false);
      
      // Yahan hum 'navigate' ki jagah yeh use karenge taake Navbar refresh ho jaye
      window.location.href = '/studio'; 

    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Invalid Email or Password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-glam-black bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="bg-gray-900/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-700 shadow-2xl w-full max-w-md">
        
        <h2 className="text-4xl font-playfair font-bold text-center mb-2 text-white">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-8">Login to your Glam Mirror account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-black/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-glam-pink"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-black/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-glam-pink"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-glam-pink text-black font-bold py-3 rounded-xl hover:bg-glam-hot transition disabled:opacity-50"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <p className="text-gray-500 text-center mt-6 text-sm">
          Don't have an account? <Link to="/signup" className="text-glam-pink font-bold">Sign Up</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;