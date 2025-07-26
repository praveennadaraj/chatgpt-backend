const axios = require('axios');
const Message = require('../models/Message');
const API_KEY = process.env.GEMINI_API_KEY;




const getMessage = async(req,res)=>{
 const { message='',sessionId='' } = req.body || {};
  try {
    
    const userMsg= await Message.create({ sessionId,type: "user", text: message });

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ parts: [{ text: message }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": API_KEY,
        }
      }
    );

    const botReply = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";

   
   const botMsg= await Message.create({sessionId, type: "bot", text: botReply });

    res.json({ reply: botReply, user: userMsg, bot: botMsg });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ error: "Failed to fetch reply" });
  }
}

const deleteMessage = async(req,res)=>{
  try{

    const {id=''}=req.params;
    await Message.findByIdAndDelete(id);
    return res.status(200).json({message:"message deleted"})
  }catch(error){
    res.status(500).json({ error: "Failed to delete message" });
  }
}


const getSessions = async (req, res) => {
  try {
    const sessions = await Message.aggregate([
      {
        $sort: { timestamp: 1 } 
      },
      {
        $group: {
          _id: "$sessionId",
          lastUpdated: { $max: "$timestamp" },
          firstMessage:{$first:"$text"},
          
        },
      },
      { $sort: { lastUpdated: -1 } },
    ]);
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};


const getSessionMessages = async (req, res) => {
  try {
    const { sessionId='' } = req.params;
    const messages = await Message.find({ sessionId }).sort({ timestamp: 1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: "Failed to load session messages" });
  }
};


const renameSession = async (req, res) => {
  try {
    const { sessionId='' } = req.params;
    const { newName ='' } = req.body || {};

    const firstMessage = await Message.findOneAndUpdate(
      { sessionId },
      { text: newName },
      { new: true }
    );

    if (!firstMessage) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ message: "Session renamed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to rename session" });
  }
};


module.exports = {
    getMessage,
    deleteMessage,
    getSessions,
    getSessionMessages,
    renameSession
   
}