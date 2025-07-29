import React, { use, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import useIdStore from '../zustand';
const ChatPage = () => {


  const [socket, setSocket] = useState(null);
  const [receiverId, setReciverid] = useState("");
  const userId = useIdStore((state) => state.value);


  // useEffect(() => {

  //   const socket = io('http://localhost:3000', {
  //     autoConnect: true,
  //     query: {
  //       userId: userId
  //     }
  //   });

  //   setSocket(socket)

  //   socket.on('connect', () => {
  //     console.log('Connected to server');
  //   });


  //   socket.on('typing', (data) => {
  //     console.log(data);
  //     alert("Typing")

  //   });

  //   socket.on(userId.trim() , (msg) => {
  //     console.log(msg);
  //     console.log("received");
  //   })

  //   socket.on('disconnect', () => {
  //     console.log('Disconnected from server');


  //   })


  // }, []);



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
