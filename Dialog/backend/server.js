const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Message = require("./models/Message");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/dialog", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

console.log("MongoDB connected");

// Send message
app.post("/api/send", async (req, res) => {
  const { sender, receiver, text } = req.body;

  if (!sender || !receiver || !text) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const message = new Message({ sender, receiver, text });
  await message.save();

  res.json({ success: true });
});

// Get chat history
app.get("/api/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
});

app.listen(3000, () => {
  console.log("Dialog backend running on http://localhost:3000");
});
