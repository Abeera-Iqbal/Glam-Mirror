import React, { useState } from 'react';
import axios from 'axios';
import ColorThief from 'color-thief-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Studio() {
  const [personImage, setPersonImage] = useState(null);
  const [dressImage, setDressImage] = useState(null);
  const [personFile, setPersonFile] = useState(null);
  const [dressFile, setDressFile] = useState(null);
  
  // Naya State: AI ka Result save karne ke liye 🖼️
  const [resultImage, setResultImage] = useState(null);

  // Analysis States
  const [analyzing, setAnalyzing] = useState(false);
  const [skinTone, setSkinTone] = useState(null);
  const [recommendedColors, setRecommendedColors] = useState([]);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // --- GUEST MODE CHECKER ---
  const checkGuestLimit = () => {
    const userInfo = localStorage.getItem('userInfo');
    const guestUsed = localStorage.getItem('guestTryUsed');

    if (userInfo) return true;

    if (guestUsed) {
        toast.error("Guest limit reached! Please Login to continue.");
        setTimeout(() => navigate('/login'), 2000);
        return false;
    }
    return true;
  };

  const analyzeSkinTone = (color) => {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    
    setAnalyzing(true);
    setTimeout(() => {
        if (r > b + 20) {
            setSkinTone('Warm / Dusky');
            setRecommendedColors([
                { name: 'Mustard', hex: '#E1AD01' },
                { name: 'Olive Green', hex: '#808000' },
                { name: 'Cream', hex: '#FFFDD0' },
                { name: 'Warm Red', hex: '#D21F3C' }
            ]);
        } else {
            setSkinTone('Cool / Fair');
            setRecommendedColors([
                { name: 'Royal Blue', hex: '#4169E1' },
                { name: 'Emerald', hex: '#50C878' },
                { name: 'Black', hex: '#000000' },
                { name: 'Lavender', hex: '#E6E6FA' }
            ]);
        }
        setAnalyzing(false);
        toast.success("Skin Tone Analyzed!", { icon: '🎨' });
    }, 1500);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'person') setPersonFile(file);
      if (type === 'dress') setDressFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'person') {
            setPersonImage(reader.result);
            setSkinTone(null); 
            setResultImage(null); // Nayi photo aye to purana result hatao
        }
        if (type === 'dress') {
            setDressImage(reader.result);
            setResultImage(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- 🌟 MAIN MAGIC FUNCTION ---
  const handleTryOn = async () => {
    const allowed = checkGuestLimit();
    if (!allowed) return;

  if (!personFile) {
  toast.error("Please upload your photo!");
  return;
}

    try {
        setLoading(true);
        setResultImage(null); // Purana result saaf karo
        const loadToast = toast.loading("Uploading images...");

        // 1. Person Image Upload
        const formData1 = new FormData();
        formData1.append('image', personFile);
        const res1 = await axios.post('http://localhost:5000/api/upload', formData1);
        const personPath = res1.data; // Server ne bataya kahan save hui

        // 2. Dress Image Upload
       let dressPath = null;

       if (dressFile) {
       const formData2 = new FormData();
       formData2.append('image', dressFile);
       const res2 = await axios.post('http://localhost:5000/api/upload',formData2);
       dressPath = res2.data;
}

        toast.success("Images Uploaded! Generating Look... ⏳", { id: loadToast });
        
        // 3. AI KO CALL KARO 🧠
      if  (personPath)  {
      const aiResponse = await axios.post('http://localhost:5000/api/ai/tryon',
      {
      personImage: personPath,
     dressImage: dressPath || null
      }
      );

     console.log("AI Result:", aiResponse.data);
    setSuggestion(aiResponse.data.suggestion);
    toast.success("Try-On Complete! ✨");
    

}
        setLoading(false);

    } catch (error) {
        console.error(error);
        toast.dismiss();
        toast.error("Generation Failed! Please try again.");
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-black text-white" style={{ fontFamily: "'Arial Black', sans-serif" }}>
                    VIRTUAL <span className="text-glam-pink">STUDIO</span>
                </h1>
                <p className="text-gray-400 mt-2">Upload photo & get AI styling tips</p>
            </div>

            {/* RIGHT SIDE: BATTLE BUTTON + MODE BADGE */}
            <div className="flex flex-col items-end gap-3">
                 {/* ⚔️ VISIT BATTLE BUTTON */}
                 <button 
                    onClick={() => navigate('/battle')}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-glam-pink text-white px-5 py-2 rounded-full font-bold hover:scale-105 transition duration-300 shadow-[0_0_15px_rgba(255,0,127,0.5)] text-sm"
                  >
                    <span>⚔️</span> Visit Battle Arena
                 </button>

                 <div className="bg-gray-800 px-4 py-1 rounded-full text-xs text-gray-400 border border-gray-600">
                    {localStorage.getItem('userInfo') ? "Mode: Premium User 👑" : "Mode: Guest (1 Free Try)"}
                 </div>
            </div>
        </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Col 1: Person Section */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 border-2 border-dashed border-gray-600 rounded-3xl p-4 flex flex-col items-center justify-center h-[400px] relative overflow-hidden">
                {personImage ? (
                    <>
 <img src={personImage} alt="Person" className="w-full h-full object-cover rounded-2xl z-10" />                       
                    </>
                ) : (
                    <div className="text-center text-gray-500"><div className="text-5xl mb-3">👤</div><p className="font-bold">Upload Your Photo</p></div>
                )}
                <input type="file" className="hidden" id="personUpload" onChange={(e) => handleImageUpload(e, 'person')} />
                <label htmlFor="personUpload" className="absolute bottom-4 z-20 bg-black/60 backdrop-blur px-6 py-2 rounded-full cursor-pointer hover:bg-glam-pink hover:text-black transition text-sm font-bold border border-gray-600">
                {personImage ? "Change Photo" : "Select Photo"}
                </label>
            </div>
            
            {/* Skin Tone Panel */}
            <div className="bg-gray-800/40 rounded-3xl p-5 border border-gray-700 min-h-[150px]">
                <h3 className="text-glam-pink font-bold flex items-center gap-2 mb-3">✨ AI Style Assistant</h3>
                {suggestion && (
  <div className="mt-4 bg-black/30 p-4 rounded-2xl text-sm text-gray-200 whitespace-pre-line border border-pink-500/20">
    {suggestion}
  </div>
)}
                {analyzing && <div className="text-sm text-gray-300 animate-pulse">⏳ Analyzing Tone...</div>}
                {skinTone && !analyzing && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between text-sm mb-4">
                            <span className="text-gray-400">Tone:</span>
                            <span className="font-bold px-2 rounded bg-gray-700">{skinTone}</span>
                        </div>
                        <div className="flex gap-3">
                            {recommendedColors.map((c, i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-600 shadow-lg" style={{backgroundColor: c.hex}} title={c.name}></div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          </div>

          {/* Col 2: Dress Section */}
          <div className="bg-gray-900/50 border-2 border-dashed border-gray-600 rounded-3xl p-4 flex flex-col items-center justify-center h-[550px] relative">
            {dressImage ? (
              <img src={dressImage} alt="Dress" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <div className="text-center text-gray-500"><div className="text-5xl mb-3">👗</div><p className="font-bold">Upload Dress Image</p></div>
            )}
            <input type="file" className="hidden" id="dressUpload" onChange={(e) => handleImageUpload(e, 'dress')} />
            <label htmlFor="dressUpload" className="absolute bottom-4 bg-black/60 backdrop-blur px-6 py-2 rounded-full cursor-pointer hover:bg-glam-pink hover:text-black transition text-sm font-bold border border-gray-600">
              {dressImage ? "Change Dress" : "Select Dress"}
            </label>
          </div>

          {/* Col 3: Result Section (UPDATED WITH BUTTONS) */}
          <div className="flex flex-col h-full">
            <div className="flex-grow bg-gradient-to-b from-gray-800 to-black border border-gray-700 rounded-3xl p-1 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,183,197,0.1)] overflow-hidden relative min-h-[400px]">
                
                {/* Agar Loading hai */}
                {loading && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border-4 border-glam-pink border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="animate-pulse text-glam-pink font-bold">Designing your look...</p>
                        <p className="text-xs text-gray-500 mt-2">This may take 15-20 seconds</p>
                    </div>
                )}

                {/* Agar Result aa gaya */}
                {resultImage ? (
                    <img src={resultImage} alt="Try On Result" className="w-full h-full object-cover rounded-2xl animate-fade-in" />
                ) : (
                    /* Placeholder */
                    <div className="text-center p-6">
                        <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">✨</div>
                        <p className="text-gray-400 font-playfair text-lg">Magic happens here</p>
                    </div>
                )}

            </div>
            
            {/* 🔥 POST TO BATTLE BUTTON (Sirf Result Aane par dikhega) */}
            {resultImage && (
                <button 
                  onClick={() => navigate('/battle')}
                  className="w-full mt-4 bg-yellow-500 text-black text-lg font-bold py-3 rounded-2xl hover:bg-yellow-400 transition shadow-lg flex items-center justify-center gap-2 animate-bounce"
                >
                  <span>🔥</span> POST TO BATTLE ARENA
                </button>
            )}

            <button 
                onClick={handleTryOn} 
                disabled={loading}
                className={`w-full mt-4 bg-glam-pink text-black text-xl font-bold py-4 rounded-2xl hover:bg-glam-hot transition shadow-[0_0_25px_rgba(255,183,197,0.5)] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
               {loading ? "Processing..." : "Try On Now 🚀"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Studio;