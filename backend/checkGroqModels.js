require("dotenv").config();   // ✅ ADD THIS
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function listModels() {
  try {
    const models = await groq.models.list();

    console.log("✅ AVAILABLE GROQ MODELS:\n");

    models.data.forEach((m) => {
      console.log(m.id);
    });

  } catch (err) {
    console.log("❌ ERROR:", err.message);
  }
}

listModels();