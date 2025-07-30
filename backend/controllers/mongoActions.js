import Message from "../models/messageModel.js";


async function saveMessage(senderId, receiverId, content, status, app) {
  if (!senderId || !receiverId || !content || !status || !app) {
    console.log("❌ Required fields missing");
    return null;
  }

  try {
    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      status,
      app
    });

    const message = await newMessage.save(); 

    console.log("✅ Message saved:", message);
    return message;

  } catch (error) {
    console.log("❌ Error saving message:", error);
    return null;
  }
}


async function getMessage() {


  const messages = await Message.find((err, messages) => {
    if (err) {
      console.log(err);
    }
  })
  console.log(messages);

  return messages;

}

async function checkPendingMessages(receiverId) {
  try {
    const pendingMessages = await Message.find({
      receiverId: receiverId,
      status: "pending"
    });

    if (pendingMessages.length === 0) {
      return null;  // ✅ No pending messages
    }

    return pendingMessages;  // ✅ Return messages if found
  } catch (err) {
    console.error("❌ Error fetching pending messages:", err);
    return null;  // ✅ Return null on error too
  }
}



async function updateStatus(receiverId) {
  const updated = await Message.updateMany(
    {
      receiverId: receiverId,
      status: "pending"
    },
    {
      $set: { status: "success" }
    }
  );

  console.log(`✅ Updated ${updated.modifiedCount} messages`);
}


export { saveMessage, getMessage, checkPendingMessages, updateStatus };