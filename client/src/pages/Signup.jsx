import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'; // <--- Toast Import

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const loadToast = toast.loading("Creating Account...");

      await axios.post('http://localhost:5000/api/users/signup', {
        name,
        email,
        password,
      });

      toast.dismiss(loadToast);
      toast.success("Account Created! Please Login. 🎉");
      setLoading(false);
      
      navigate('/login');

    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Signup Failed!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-glam-black bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="bg-gray-900/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-700 shadow-2xl w-full max-w-md">
        
        <h2 className="text-4xl font-playfair font-bold text-center mb-2 text-white">Create Account</h2>
        <p className="text-gray-400 text-center mb-8">Join the fashion revolution</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-black/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-glam-pink"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-glam-pink text-black font-bold py-3 rounded-xl hover:bg-glam-hot transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-500 text-center mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-glam-pink font-bold">Log In</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;