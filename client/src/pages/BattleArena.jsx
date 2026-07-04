import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function BattleArena() {
  const [posts, setPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem('userInfo'));

  // --- 1. POSTS MANGWANA ---
  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts/all');
      const data = await res.json();
      if (res.ok) {
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // --- 2. LIKE LOGIC ---
  const handleLike = async (postId) => {
    if (!user) return toast.error("Please Login to Vote! 🔒");

    try {
      const res = await fetch(`http://localhost:5000/api/posts/like/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });

      if (res.ok) {
        fetchPosts(); 
        toast.success("Voted! 🔥");
      }
    } catch (error) {
      console.error("Like Error:", error);
    }
  };

  // --- 3. WINNER CALCULATION LOGIC (Automatic) 🏆 ---
  // Posts ki copy banao, Likes ke hisab se sort karo (High to Low), aur Top 3 nikalo
  const topWinners = [...posts].sort((a, b) => b.likes.length - a.likes.length).slice(0, 3);

  // --- 4. DUMMY UPLOAD ---
  const handleTestUpload = async () => {
    if (!user) return toast.error("Login karo bhai!");
    const dummyPost = {
      userId: user._id,
      username: user.name,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60",
      caption: "Testing my Eid Look! ✨"
    };
    try {
      await fetch('http://localhost:5000/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dummyPost)
      });
      toast.success("Look Posted! ⚔️");
      fetchPosts();
    } catch (error) { toast.error("Upload Failed"); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      
      {/* HEADER */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-glam-pink mb-4" style={{ fontFamily: "'Arial Black', sans-serif" }}>
          STYLE BATTLE ARENA ⚔️
        </h1>
        <p className="text-gray-400 text-xl">Vote for the Best Look of the Week!</p>
        <button onClick={handleTestUpload} className="mt-6 bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full border border-glam-pink text-sm">
          + Upload Test Look
        </button>
      </div>

      {/* --- 🏆 HALL OF FAME (TOP 3 WINNERS) --- */}
      {posts.length > 0 && (
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-yellow-400">👑 CURRENT LEADERS</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-end gap-6 md:gap-10">
            
            {/* 🥈 2nd Place */}
            {topWinners[1] && (
              <div className="relative w-full md:w-64 h-80 bg-gray-900 rounded-2xl border-2 border-gray-600 overflow-hidden transform hover:scale-105 transition">
                 <div className="absolute top-0 left-0 bg-gray-600 text-white font-bold px-4 py-1 rounded-br-lg z-10">#2</div>
                 <img src={topWinners[1].image} className="w-full h-full object-cover" alt="2nd" />
                 <div className="absolute bottom-0 w-full bg-black/70 p-2 text-center">
                    <p className="font-bold text-gray-300">{topWinners[1].username}</p>
                    <p className="text-sm">🔥 {topWinners[1].likes.length} Votes</p>
                 </div>
              </div>
            )}

            {/* 🥇 1st Place (Winner) - Bara Dikhayenge */}
            {topWinners[0] && (
              <div className="relative w-full md:w-80 h-96 bg-gray-900 rounded-2xl border-4 border-yellow-500 shadow-[0_0_50px_rgba(255,215,0,0.3)] overflow-hidden transform scale-110 z-20">
                 <div className="absolute top-0 left-0 bg-yellow-500 text-black font-black px-6 py-2 rounded-br-2xl z-10 text-xl">👑 WINNER</div>
                 <img src={topWinners[0].image} className="w-full h-full object-cover" alt="Winner" />
                 <div className="absolute bottom-0 w-full bg-black/80 p-4 text-center border-t border-yellow-500">
                    <p className="text-2xl font-black text-yellow-500">{topWinners[0].username}</p>
                    <p className="text-white text-lg font-bold">🔥 {topWinners[0].likes.length} Votes</p>
                 </div>
              </div>
            )}

            {/* 🥉 3rd Place */}
            {topWinners[2] && (
              <div className="relative w-full md:w-64 h-80 bg-gray-900 rounded-2xl border-2 border-orange-700 overflow-hidden transform hover:scale-105 transition">
                 <div className="absolute top-0 left-0 bg-orange-700 text-white font-bold px-4 py-1 rounded-br-lg z-10">#3</div>
                 <img src={topWinners[2].image} className="w-full h-full object-cover" alt="3rd" />
                 <div className="absolute bottom-0 w-full bg-black/70 p-2 text-center">
                    <p className="font-bold text-gray-300">{topWinners[2].username}</p>
                    <p className="text-sm">🔥 {topWinners[2].likes.length} Votes</p>
                 </div>
              </div>
            )}

          </div>
        </div>
      )}


      {/* --- ALL CONTESTANTS GRID --- */}
      <h3 className="text-2xl font-bold mb-6 border-l-4 border-glam-pink pl-4">All Entries</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-glam-pink transition shadow-lg">
            <div className="relative h-64">
              <img src={post.image} alt="Fashion" className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-white">{post.username}</h4>
                <p className="text-gray-500 text-xs truncate w-32">{post.caption}</p>
              </div>
              <button 
                onClick={() => handleLike(post._id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition ${
                  post.likes.includes(user?._id) ? 'bg-glam-pink text-white' : 'bg-gray-800 text-gray-300'
                }`}
              >
                <span>🔥</span> {post.likes.length}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default BattleArena;