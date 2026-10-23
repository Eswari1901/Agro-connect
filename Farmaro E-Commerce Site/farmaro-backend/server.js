require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const multer = require("multer");
const axios = require("axios");

const { GoogleGenAI } = require("@google/genai");

const connectDB= require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { protect, isSeller } = require("./middleware/authMiddleware");

const Order = require("./models/Order");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// DEBUG
app.use((req, res, next) => {
  console.log("API HIT:", req.method, req.url);
  next();
});

// ================= 💳 RAZORPAY =================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    res.json(order);
  } catch (err) {
    console.error("RAZORPAY ERROR:", err);
    res.status(500).json({ error: "Payment error" });
  }
});

// ================= 🤖 GEMINI =================
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// ================= 🧠 CACHE =================
const cache = {};

// ================= 🌦️ WEATHER =================
const getWeather = async (city = "Tamil Nadu") => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY}&units=metric`
    );
    return res.data;
  } catch {
    return null;
  }
};

// ================= 🧹 CLEAN =================
function cleanText(text) {
  return text.replace(/[#*`]/g, "").replace(/\n+/g, "\n").trim();
}

// ================= 🛒 PRODUCT MATCH =================
function recommendProducts(text, products = []) {
  return products.filter((p) =>
    text.toLowerCase().includes(p.name.toLowerCase())
  );
}

// ================= 🌿 CHAT =================
app.post("/chat", async (req, res) => {
  try {
    const { message, products = [] } = req.body;

    // 🔁 CACHE
    if (cache[message]) {
      return res.json({ reply: cache[message], products: [] });
    }

    const weather = await getWeather();

    const weatherInfo = weather
      ? `Temp ${weather.main.temp}°C, Humidity ${weather.main.humidity}%`
      : "";

    const prompt = `
You are a witty farming assistant. 

Context: ${weatherInfo}

Rules:
1. If the user's message is NOT about plants or agriculture, reply only with: "Ask about plants!"
2. If the plant is healthy, reply only with: "All good!"
3. For agricultural issues, provide a short, funny diagnosis using this exact format:

Problem: [Short name + funny remark]
Cause: [Simple explanation]
Solution: [Short fix + product suggestion if needed]

Use simple words. No symbols like asterisks or hashtags.

User: ${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [{ parts: [{ text: prompt }] }]
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleaned = cleanText(text);

    cache[message] = cleaned;

    const suggestedProducts = recommendProducts(cleaned, products);

    res.json({
      reply: cleaned,
      products: suggestedProducts
    });

  } catch (err) {
    console.error("CHAT ERROR:", err);

    if (err.status === 429) {
      return res.json({
        reply: "Server busy. Try again later."
      });
    }

    res.status(500).json({ reply: "AI error" });
  }
});

// ================= 📷 IMAGE =================
const upload = multer({ storage: multer.memoryStorage() });

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const base64 = req.file.buffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [
        {
          parts: [
            {
              text: "Identify plant issue, diagnose it and give solution in short and funny way, also suggest products if needed.if no issue found, say 'All good!'."
            },
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: base64
              }
            }
          ]
        }
      ]
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.json({ result: cleanText(text) });

  } catch (err) {
    console.error("IMAGE ERROR:", err);
    res.status(500).json({ result: "Image analysis failed" });
  }
});



// ================= 🛒 ORDER ROUTES =================

// CREATE ORDER
app.post("/orders", protect, async (req, res) => {
  try {
    const order = await Order.create({
      userId: req.user.id, // ✅ THIS FIXES USER MIXING
      items: req.body.items,
      total: req.body.total,
      status: "Placed"
    });

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Order error" });
  }
});

// GET USER ORDERS
app.get("/orders", protect, async (req, res) => {
  try {
    let orders;

    if (req.user.role === "seller") {
      orders = await Order.find(); // seller sees all
    } else {
      orders = await Order.find({ userId: req.user.id }); // ✅ ONLY THEIR ORDERS
    }

    res.json(orders);
  } catch {
    res.status(500).json({ msg: "Fetch error" });
  }
});
// ================= 🧑‍🌾 SELLER ROUTE =================

app.post("/seller/add-product", protect, isSeller, (req, res) => {
  res.json({ msg: "Seller product added" });
});

app.put("/orders/:id", protect, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, // ✅ TARGET ONLY ONE ORDER
      { status: req.body.status },
      { new: true }
    );

    res.json(order);
  } catch {
    res.status(500).json({ msg: "Update failed" });
  }
});




// ================= TEST =================
app.get("/", (req, res) => {
  res.send("🚀 Full Backend Running");
});

// ================= START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});