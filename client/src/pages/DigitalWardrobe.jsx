import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

function DigitalWardrobe() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myClothes, setMyClothes] = useState([]);
  
  // Filtering States
  const [filteredClothes, setFilteredClothes] = useState([]);
  const [outfitCombo, setOutfitCombo] = useState(null);
  
  // MOOD STATE (User ka mood kya hai?) ✨
  const [currentMood, setCurrentMood] = useState("Casual"); 

  // Upload States
  const [newItemFile, setNewItemFile] = useState(null);
  const [category, setCategory] = useState("Summer");
  const [clothingType, setClothingType] = useState("Top");
  const [occasion, setOccasion] = useState("Casual"); // Upload k liye
  const [uploading, setUploading] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState(null);
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const API_KEY = "0d57b76c59d991f9ec579bbbbd10e972"; 

  // --- 1. MAUSAM ---
  const fetchWeather = async (lat, lon) => {
    try {
      let url = lat 
        ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        : `https://api.openweathermap.org/data/2.5/weather?q=Lahore&units=metric&appid=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.cod === 200) setWeather(data);
      else loadDummyWeather();
      setLoading(false);
    } catch (error) { loadDummyWeather(); }
  };

  const loadDummyWeather = () => {
    setWeather({ name: "Lahore (Demo)", main: { temp: 10 }, weather: [{ main: "Clouds" }] });
    setLoading(false);
  };

  // --- 2. WARDROBE ---
  const fetchMyWardrobe = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/wardrobe/${user._id}`);
      setMyClothes(res.data);
    } catch (err) { console.error("Wardrobe Error:", err); }
  };

  useEffect(() => {
    fetchMyWardrobe();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(null, null)
      );
    } else { fetchWeather(null, null); }
  }, []);

  // --- 3. 🧠 SUPER SMART LOGIC (Weather + Mood) ---
  useEffect(() => {
    if (!weather || myClothes.length === 0) return;

    const temp = weather.main.temp;
    let targetCategory = temp < 18 ? "Winter" : "Summer";

    // FILTER LOGIC:
    // 1. Mausam Sahi ho (Winter/Summer)
    // 2. Mood Sahi ho (Casual/Party/Formal) <-- YEH ADD KIYA
    const validItems = myClothes.filter(item => 
      (item.category === targetCategory || item.category === "All Season") &&
      item.occasion === currentMood 
    );
    
    setFilteredClothes(validItems);

    // COMBO MAKER (Top + Bottom from Valid Items)
    const tops = validItems.filter(item => item.type === "Top");
    const bottoms = validItems.filter(item => item.type === "Bottom");

    if (tops.length > 0 && bottoms.length > 0) {
        const randomTop = tops[Math.floor(Math.random() * tops.length)];
        const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
        setOutfitCombo([randomTop, randomBottom]);
    } else {
        setOutfitCombo(null);
    }

  }, [weather, myClothes, currentMood]); // Jab Mood badle tab bhi chalo


  // --- 4. UPLOAD ---
  const handleUpload = async () => {
    if (!newItemFile || !user) return toast.error("Please login & select image");
    setUploading(true);
    const formData = new FormData();
    formData.append('image', newItemFile);
    try {
      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData);
      await axios.post('http://localhost:5000/api/wardrobe/add', {
        userId: user._id,
        image: uploadRes.data,
        category,
        type: clothingType,
        occasion, // New Field
        name: "My Cloth"
      });
      toast.success("Added to Wardrobe! ✅");
      fetchMyWardrobe();
      setNewItemFile(null);
      setUploading(false);
    } catch (err) {
      toast.error("Upload Failed");
      setUploading(false);
    }
  };

  const handleDelete = async (e, itemId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/wardrobe/delete/${itemId}`);
      toast.success("Deleted! 🗑️");
      fetchMyWardrobe(); 
    } catch (error) { toast.error("Error deleting"); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-glam-pink mb-2">MY DIGITAL WARDROBE</h1>
        <p className="text-gray-400">Where are you going today?</p>
      </div>

      {/* --- 🎭 MOOD SELECTOR (The New Feature) --- */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {["Casual", "Formal", "Party", "Sport"].map((mood) => (
            <button
                key={mood}
                onClick={() => setCurrentMood(mood)}
                className={`px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105 ${
                    currentMood === mood 
                    ? "bg-glam-pink text-black shadow-[0_0_15px_#ff007f]" 
                    : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-glam-pink"
                }`}
            >
                {mood === "Casual" && "☕"}
                {mood === "Formal" && "💼"}
                {mood === "Party" && "🎉"}
                {mood === "Sport" && "🏋️"} 
                <span className="ml-2">{mood}</span>
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* LEFT: RESULTS */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Weather Info */}
           {weather && (
             <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{weather.name}</h2>
                  <p className="text-3xl font-black text-white">{Math.round(weather.main.temp)}°C ({weather.weather[0].description})</p>
                </div>
                <div className="text-5xl">{weather.main.temp < 18 ? '❄️' : '☀️'}</div>
             </div>
           )}

           {/* ✨ MOOD BASED COMBO ✨ */}
           {outfitCombo ? (
            <div className="bg-gradient-to-r from-gray-900 to-black border border-glam-pink/50 p-6 rounded-2xl shadow-[0_0_20px_rgba(255,0,127,0.2)] relative overflow-hidden animate-fade-in">
                <div className="absolute top-0 right-0 bg-glam-pink text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                    ✨ {currentMood} Match
                </div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">🤖 Today's {currentMood} Look</h3>
                <div className="flex gap-4 items-center justify-center">
                    <div className="w-1/2 h-64 rounded-xl overflow-hidden border border-gray-700 bg-black flex flex-col">
                        <img src={`http://localhost:5000${outfitCombo[0].image}`} className="w-full h-full object-contain" alt="Top" onError={(e)=>{e.target.src="https://via.placeholder.com/150"}} />
                        <span className="bg-gray-800 text-center text-xs py-1">Top</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-500">+</div>
                    <div className="w-1/2 h-64 rounded-xl overflow-hidden border border-gray-700 bg-black flex flex-col">
                        <img src={`http://localhost:5000${outfitCombo[1].image}`} className="w-full h-full object-contain" alt="Bottom" onError={(e)=>{e.target.src="https://via.placeholder.com/150"}}/>
                        <span className="bg-gray-800 text-center text-xs py-1">Bottom</span>
                    </div>
                </div>
            </div>
           ) : (
             <div className="bg-gray-900/50 p-6 rounded-xl border border-dashed border-gray-700 text-center">
                <p className="text-gray-400">No {currentMood} outfit found for this weather.</p>
                <p className="text-sm text-gray-500">Upload more {currentMood} Tops & Bottoms!</p>
             </div>
           )}

           {/* LIST */}
           <div>
                <h3 className="text-xl font-bold mb-4 text-glam-pink border-l-4 border-glam-pink pl-3">
                    Your {currentMood} Collection
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredClothes.map((item) => (
                      <div key={item._id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 cursor-pointer group relative" onClick={() => setSelectedImage(item.image)}>
                          <button onClick={(e) => handleDelete(e, item._id)} className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-700 shadow-lg">🗑️</button>
                          <div className="h-40 bg-black flex items-center justify-center">
                              <img src={`http://localhost:5000${item.image}`} className="w-full h-full object-contain" onError={(e)=>{e.target.src="https://via.placeholder.com/150"}} />
                          </div>
                          <div className="bg-black/80 p-2 text-center text-xs font-bold flex justify-between px-2">
                              <span>{item.type}</span>
                              <span className="text-gray-400">{item.occasion}</span>
                          </div>
                      </div>
                  ))}
                </div>
           </div>
        </div>

        {/* RIGHT: UPLOAD */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-fit">
           <h3 className="text-xl font-bold mb-4">➕ Add New Item</h3>
           <div className="border-2 border-dashed border-gray-600 rounded-xl h-40 flex items-center justify-center mb-4 relative overflow-hidden bg-black/40">
              {newItemFile ? <img src={URL.createObjectURL(newItemFile)} className="w-full h-full object-contain" /> : <span className="text-gray-500">Select Image</span>}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setNewItemFile(e.target.files[0])} />
           </div>
           
           <div className="space-y-3">
               <div>
                 <label className="text-gray-400 text-xs block mb-1">Season</label>
                 <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 text-sm">
                   <option value="Summer">Summer</option>
                   <option value="Winter">Winter</option>
                   <option value="All Season">All Season</option>
                 </select>
               </div>
               <div>
                 <label className="text-gray-400 text-xs block mb-1">Type</label>
                 <select value={clothingType} onChange={(e) => setClothingType(e.target.value)} className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 text-sm">
                   <option value="Top">Top</option>
                   <option value="Bottom">Bottom</option>
                   <option value="Shoes">Shoes</option>
                 </select>
               </div>
               
               {/* OCCASION INPUT (New) */}
               <div>
                 <label className="text-glam-pink text-xs block mb-1 font-bold">Occasion (Mood)</label>
                 <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="w-full bg-gray-800 text-white p-2 rounded border border-glam-pink/50 text-sm focus:border-glam-pink">
                   <option value="Casual">Casual (Daily)</option>
                   <option value="Formal">Formal (Office/Meeting)</option>
                   <option value="Party">Party (Event/Eid)</option>
                   <option value="Sport">Sport (Gym)</option>
                 </select>
               </div>
           </div>

           <button onClick={handleUpload} disabled={uploading} className="w-full mt-4 bg-glam-pink text-black font-bold py-3 rounded-xl hover:bg-pink-600 transition">
             {uploading ? "Saving..." : "Save to Wardrobe"}
           </button>
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <img src={`http://localhost:5000${selectedImage}`} className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
}

export default DigitalWardrobe;