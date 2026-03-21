const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

exports.chatbot = async (req, res) => {
  try {
    const { message } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",  // ✅ FREE MODEL
      messages: [
        {
          role: "system",
          content: "You are a placement preparation assistant."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = chatCompletion.choices[0].message.content;

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Chatbot error" });
  }
};