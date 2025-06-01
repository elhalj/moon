import cloudinary from "../lib/cloudnary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../model/message.model.js";
import User from "../model/user.model.js";

export const getUserForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterUser = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    res.status(200).json(filterUser);

  } catch (error) {
    console.log("error to getUserForSideBar", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
    try {
        const { id:userToChatId } = req.params;
        const myId = req.user._id;
        
        const message = await Message.find({ $or:[
            {
                senderId:myId, receiverId:userToChatId
            },
            {
                senderId:userToChatId, receiverId:myId
            }
        ] })

        res.status(200).json(message);
    } catch (error) {
        console.log("error to getMessage", ErrorEvent.message)
        res.status(500).json({message:"Internal server error"});
    }
}

export const handleTyping = async (req, res) => {
    try {
        const { isTyping } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            if(isTyping) {
                io.to(receiverSocketId).emit("userTyping", { userId: senderId });
            } else {
                io.to(receiverSocketId).emit("userStopTyping", { userId: senderId });
            }
        }

        res.status(200).json({ message: "Typing status updated" });
    } catch (error) {
        console.log("Error in handleTyping", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } =  req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save();

        // socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        // socket.io
        res.status(200).json(newMessage);

    } catch (error) {
        console.log("Error, cannot send message", error.message);
        res.status(500).json({message:"Internal server error"})
    }
}
