import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-glam-black to-glam-dark text-white flex items-center justify-between px-16">
      {/* Left Side: Text Content */}
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-2">
          <span className="h-1 w-10 bg-glam-pink rounded-full"></span>
          <p className="text-glam-pink uppercase tracking-widest text-sm font-bold">
            AI Powered Fashion
          </p>
        </div>

        <h1 className="text-7xl font-bold leading-tight font-playfair">
          Discover Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-glam-pink to-purple-400">
            Perfect Style
          </span>
        </h1>

        <p className="text-gray-400 text-xl leading-relaxed max-w-lg">
          Experience the future of fashion with our Virtual Try-On technology.
          Upload your photo, choose a dress, and see the magic happen instantly.
        </p>

        <div className="flex gap-4 pt-4">
          <Link to="/signup">
            <button className="bg-glam-pink text-black text-lg px-10 py-4 rounded-full font-bold hover:bg-glam-hot hover:text-white hover:shadow-[0_0_25px_rgba(255,105,180,0.6)] transition transform hover:-translate-y-1">
              Try it Now 🚀
            </button>
          </Link>

          <button className="border border-gray-600 text-white text-lg px-10 py-4 rounded-full font-bold hover:border-glam-pink hover:text-glam-pink transition">
            Watch Demo
          </button>
        </div>

        {/* Small Trust Badge */}
        <div className="pt-8 flex items-center gap-4 text-gray-500 text-sm">
          <p>Trusted by 1000+ Users</p>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-black"></div>
            <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-black"></div>
            <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-black"></div>
          </div>
        </div>
      </div>

      {/* Right Side: Image Box */}
<div className="w-1/3 relative">
    <div className="absolute -inset-4 bg-glam-pink/20 blur-3xl rounded-full"></div>
    <div className="relative w-full h-[600px] rounded-[40px] border border-gray-700 overflow-hidden shadow-2xl">
        {/* Real Image */}
        <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
            alt="Fashion Model" 
            className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />
        {/* Upar ek chota sa badge */}
        <div className="absolute bottom-5 left-5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-600">
            <p className="text-glam-pink text-sm font-bold">✨ AI Generated</p>
        </div>
    </div>
</div>
    </div>
  );
}

export default Home;
