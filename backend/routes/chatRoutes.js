import express from "express";
import Conversation from "../models/Conversation.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Gemini
const apiKey = "AIzaSyD2j5MWuEFMb1uEofq_Ohmb0sKOWVhfd44";
if (!apiKey) {
  console.warn("Warning: GEMINI_API_KEY is not set. Set it in .env");
}
const genAI = new GoogleGenerativeAI(apiKey || "DUMMY_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SYSTEM_PRIME = `
You are "PathFinder", a helpful, non-judgmental career guidance assistant.
STRICT SCOPE: Only discuss career guidance, learning paths, resume/portfolio advice,
interview prep, skills to learn, job roles, salary ranges (approximate), industry trends,
college/major selection, and course recommendations. If the user asks outside this scope,
politely steer the conversation back to career guidance.

STYLE: Conversational, concise, and supportive. Avoid long monologues. Use bullet points if helpful.
DO NOT generate medical, legal, financial investment, or relationship advice.
DO NOT roleplay as anything other than a career coach.

do not use '*' in ur covo ur generated text should be well formated`;

function buildPrompt(history, userMsg) {
  const historyText = history.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join("\n");
  return `${SYSTEM_PRIME}\n\nConversation so far:\n${historyText}\n\nUSER: ${userMsg}\nBOT:`;
}
router.post("/chat", async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message are required" });
    }

    let convo = await Conversation.findOne({ userId });
    if (!convo) {
      convo = new Conversation({ userId, messages: [] });
    }

    
    convo.messages.push({ sender: "user", text: message });

    const SAFE_PREFIX = "I’m here to help with career guidance. ";
    const prompt = buildPrompt(convo.messages, message);
    const result = await model.generateContent(prompt);
    const botReplyRaw = result?.response?.text?.() || "I’m here to help with career guidance. Could you share a goal or role you’re considering?";
    
    var botReply = botReplyRaw.trim();
    botReply = botReply.replace(/\*/g, '');
    convo.messages.push({ sender: "bot", text: botReply });
    await convo.save();

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Something went wrong processing your request." });
  }
});

router.get("/history", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const convo = await Conversation.findOne({ userId });
    res.json({ messages: convo ? convo.messages : [] });
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;
