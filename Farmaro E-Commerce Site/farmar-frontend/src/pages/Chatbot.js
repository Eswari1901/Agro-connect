import React, { useState, useEffect, useRef } from "react";

function Chatbot({ products }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 💬 FLOATING BUTTON */}
      <div style={floatingBtn} onClick={() => setOpen(!open)}>
        💬
      </div>

      {open && (
        <ChatUI
          products={products}
          close={() => setOpen(false)}
        />
      )}
    </>
  );
}

function ChatUI({ products, close }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("");
  const bodyRef = useRef();

  // 🔄 AUTO SCROLL
  useEffect(() => {
    bodyRef.current?.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);

  // 🧠 SEND MESSAGE
  const sendMessage = async () => {
    if (!input) return;

    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("http://localhost:5000/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: input,
    language
  })
});

      const data = await res.json();

      // 🛒 PRODUCT MATCH
      const matchedProducts = products.filter((p) =>
        data.reply.toLowerCase().includes(p.name.toLowerCase())
      );

      setMessages((prev) => [
        ...prev,
        { text: data.reply, sender: "bot" },
        ...(matchedProducts.length > 0
          ? [{ products: matchedProducts, sender: "bot" }]
          : [])
      ]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "Server error. Try again later.", sender: "bot" }
      ]);
    }

    setInput("");
  };

  // 🌿 IMAGE UPLOAD
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setMessages((prev) => [
      ...prev,
      { text: "Analyzing plant image...", sender: "bot" }
    ]);

    try {
      const res = await fetch("http://localhost:5000/analyze", {
  method: "POST",
  body: formData
});

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { text: data.result, sender: "bot" }
      ]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "Image analysis failed.", sender: "bot" }
      ]);
    }
  };

  return (
    <div style={chatBox}>
      {/* HEADER */}
      <div style={header}>
        Farmaro AI 
        <span onClick={close} style={{ cursor: "pointer" }}>✖</span>
      </div>

      {/* BODY */}
      <div style={body} ref={bodyRef}>
        {/* LANGUAGE SELECT */}
        {!language && (
          <div style={{ marginBottom: "10px" }}>
            <p style={{ fontSize: "13px" }}>Choose Language:</p>

            <button
              style={langBtn}
              onClick={() => setLanguage("English")}
            >
              English
            </button>

            <button
              style={langBtn}
              onClick={() => setLanguage("Tamil")}
            >
              தமிழ்
            </button>
          </div>
        )}

        {/* MESSAGES */}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              marginBottom: "8px"
            }}
          >
            {msg.text && (
              <div style={bubble(msg.sender)}>
                {msg.text}
              </div>
            )}

            {/* PRODUCT SUGGESTIONS */}
            {msg.products &&
              msg.products.map((p) => (
                <div key={p.id} style={productCard}>
                  <img
                    src={p.images?.[0]}
                    alt=""
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "8px"
                    }}
                  />
                  <div>
                    <p>{p.name}</p>
                    <b>₹{p.price}</b>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div style={inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about plant issues..."
          style={inputStyle}
        />

        {/* IMAGE UPLOAD */}
        <label style={uploadBtn}>
          📷
          <input
            type="file"
            onChange={handleImage}
            style={{ display: "none" }}
          />
        </label>

        <button onClick={sendMessage} style={sendBtn}>
          ➤
        </button>
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const floatingBtn = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #2e7d32, #66bb6a)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  cursor: "pointer",
  boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
  animation: "float 3s ease-in-out infinite",
  zIndex: 999
};

const chatBox = {
  position: "fixed",
  bottom: "90px",
  right: "20px",
  width: "340px",
  height: "500px",
  backdropFilter: "blur(15px)",
  background: "rgba(184, 235, 139, 0.12)",
  borderRadius: "20px",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  overflow: "hidden",
  zIndex: 999
};

const header = {
  background: "rgba(46,125,50,0.9)",
  color: "#fff",
  padding: "12px",
  fontWeight: "600",
  display: "flex",
  justifyContent: "space-between"
};

const body = {
  flex: 1,
  padding: "10px",
  overflowY: "auto"
};

const inputBox = {
  display: "flex",
  padding: "10px",
  gap: "6px",
  background: "rgba(255,255,255,0.6)"
};

const inputStyle = {
  flex: 1,
  padding: "8px",
  borderRadius: "10px",
  border: "none",
  outline: "none"
};

const sendBtn = {
  background: "#2e7d32",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "10px",
  cursor: "pointer"
};

const uploadBtn = {
  background: "#e8f5e9",
  padding: "8px",
  borderRadius: "10px",
  cursor: "pointer"
};

const langBtn = {
  padding: "6px 12px",
  marginRight: "8px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.6)",
  background: "rgba(255,255,255,0.3)",
  cursor: "pointer"
};

const bubble = (sender) => ({
  background:
    sender === "user"
      ? "linear-gradient(135deg, #2e7d32, #66bb6a)"
      : "rgba(255,255,255,0.6)",
  color: sender === "user" ? "#fff" : "#333",
  padding: "8px 12px",
  borderRadius: "14px",
  display: "inline-block",
  maxWidth: "75%"
});

const productCard = {
  display: "flex",
  gap: "10px",
  background: "#f5f5f5",
  padding: "6px",
  borderRadius: "8px",
  marginTop: "5px"
};

export default Chatbot;