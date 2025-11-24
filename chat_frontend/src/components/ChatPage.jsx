import React, { use, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import useIdStore from '../zustand';
const ChatPage = () => {


  const [socket, setSocket] = useState(null);
  const [receiverId, setReciverid] = useState("");
  const userId = useIdStore((state) => state.value);




  const sendMessage = () => {
    socket.emit('chat-message',


      {

        senderId: userId.trim(),
        receiverId: receiverId.trim(),
        app: "whatsapp"


      }


    )
  }



  return (

    <div>

    </div>
  );
};

export default ChatPage;
