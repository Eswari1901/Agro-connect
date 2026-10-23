const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 🔐 TOKEN
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, farmName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      farmName: role === "seller" ? farmName : null
    });

    res.json({
      token: generateToken(user._id),
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id),
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};