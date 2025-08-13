import React, { useEffect, useRef, useState } from "react";
import { sendMessage, getHistory } from "../api";


export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Replace with real user identity in production
  const userId = "demo-user";

  useEffect(() => {
    (async () => {
      const res = await getHistory(userId);
      setMessages(res.data.messages || []);
      scrollToBottom();
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { sender: "user", text: input, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await sendMessage(userId, userMsg.text);
      const botMsg = { sender: "bot", text: res.data.reply, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      const botMsg = { sender: "bot", text: "Error: could not get a response.", timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <header style={{ textAlign: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>PathFinder • Career Guidance</h1>
        <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>Ask about roles, skills, roadmaps, interviews.</p>
      </header>

      <div
        ref={scrollRef}
        style={{
          height: 480,
          overflowY: "auto",
          background: "#0f172a",
          borderRadius: 16,
          padding: 16,
          border: "1px solid #1f2937",
          boxShadow: "0 4px 30px rgba(0,0,0,.2)",
    msOverflowStyle: "none", // IE and Edge
    scrollbarWidth: "none",  // Firefox
    overflowY: "scroll"
  
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "12px 0", display: "flex", justifyContent: m.sender === "user" ? "flex-end" : "flex-start" }}>
            <div
              style={{
                maxWidth: "70%",
                background: m.sender === "user" ? "#1f2937" : "#111827",
                padding: "10px 14px",
                borderRadius: 14,
                whiteSpace: "pre-wrap",
                lineHeight: 1.4,
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
                {m.sender === "user" ? "You" : "Bot"}
              </div>
              <div>{m.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ margin: "12px 0", display: "flex", justifyContent: "flex-start" }}>
            <div style={{ maxWidth: "70%", background: "#111827", padding: "10px 14px", borderRadius: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Bot</div>
              <div>Thinking…</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="e.g., How do I become a data analyst from BCA background?"
          rows={2}
          style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #1f2937", background: "#0b1020", color: "#e6e6e6" }}
        />
        <button onClick={handleSend} disabled={loading} style={{ padding: "0 18px", borderRadius: 12, cursor: "pointer" }}>
          Send
        </button>
      </div>
    </div>
  );
}
