const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const { Client } = require("@gradio/client");

// Virtual Dress Try-On Function
const generateTryOn = async (req, res) => {
  try {
     // Frontend se human image aur dress image receive kar rahe hain
    const { personImage, dressImage } = req.body;
 // Check agar images missing hon
    if (!personImage) {
  return res.status(400).json({
    message: "Person image missing!"
  });
}

    // Path Fix
    const cleanPerson = personImage.replace(/^[\/\\]/, "");
    const cleanDress = dressImage
  ? dressImage.replace(/^[\\/]/, "")
  : null;
    const personPath = path.join(__dirname, '..', cleanPerson);
    const dressPath = cleanDress
  ? path.join(__dirname, '..', cleanDress)
  : null;

   if (
  !fs.existsSync(personPath) ||
  (dressPath && !fs.existsSync(dressPath))
) {
        return res.status(400).json({ message: "File server par nahi mili!" });
    }
    
let prompt = "";

if (dressImage) {
  prompt = `
You are a professional AI fashion stylist for 2026.

Analyze the uploaded person and outfit.

Give:
1. Outfit compatibility
2. Matching colors
3. Occasion suitability
4. Weather suitability
5. Accessories
6. Footwear
7. Fashion advice

Keep response stylish and concise.
`;
} else {
  prompt = `
You are a professional AI fashion stylist for 2026.

Analyze this person and suggest:

1. Best outfit colors
2. Hairstyle suggestions
3. Accessories
4. Fashion trends
5. Occasion styling
6. Weather based advice

Keep response stylish and modern.
`;
}
const base64Image = fs.readFileSync(personPath, {
  encoding: "base64",
});
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",

  messages: [
    {
      role: "system",
      content:
        "You are an expert AI fashion stylist for modern 2026 fashion trends.",
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: prompt,
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64Image}`,
          },
        },
      ],
    },
  ],

  max_tokens: 300,
});

const suggestion =
completion.choices[0].message.content;
  
return res.status(200).json({
  success: true,
  suggestion,
});
 

  } catch (error) {
    //Console me error print karna
    console.error("🔥 AI Error:", error.message);
    
    if (error.message.includes("429")) {
        // YEH GOOD NEWS HAI!
        console.log("✅ GOOD NEWS: Model Sahi hai! Bas Server Busy hai.");
        // Agar koi error aaye
        return res.status(429).json({ 
            message: "Model Sahi hai! Card lagane se yeh chal jayega (Error 429)." 
        });
    }
    // Error message frontend ko bhejna
    res.status(500).json({ message: "AI Generation Failed", error: error.message });
  }
};
// Function export kar rahe hain taa k routes me use ho sake
module.exports = { generateTryOn };

  const getSmartFashionSuggestion = async (req, res) => {

  try {

    const {
      personImage,
      dressImage,
      weather,
      occasion
    } = req.body;

   const model = "gemini-2.0-flash";

    let prompt = "";

    // ONLY USER IMAGE
    if (personImage && !dressImage) {

      prompt = `

You are a modern AI fashion stylist.

Analyze the uploaded person's image.

Detect:
- Gender
- Skin tone
- Face shape

Give ONLY short stylish bullet-point suggestions.

Include:
1. Best outfit colors
2. Hairstyle
3. Accessories
4. Weather styling tip
5. Fashion advice

IMPORTANT:
- Keep every point under 1 line
- Do NOT explain deeply
- Do NOT write paragraphs
- Do NOT ask questions

Current weather:
${weather}

Occasion:
${occasion}
`;
    }

    // USER + DRESS
    if (personImage && dressImage) {

      prompt = `
      
You are a modern AI stylist.

Analyze the uploaded person and outfit.

Give SHORT bullet-point suggestions only.

Include:
1. Outfit compatibility
2. Color matching
3. Occasion suitability
4. Weather suitability
5. Accessories
6. Footwear
7. Fashion advice

IMPORTANT:
- Keep every point under 1 line
- No paragraphs
- No long explanations
- Detect gender automatically

      `;
    }

  const result = await genAI.models.generateContent({
  model,
  contents: prompt,
});

const response = result.text;

    res.status(200).json({
      success: true,
      suggestion: response
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
module.exports = {
  generateTryOn,
  getSmartFashionSuggestion
};