import React from 'react';
import { FiSend } from "react-icons/fi";
import { useEffect } from 'react';
import useTempStore from '../userzustand';
import { io } from 'socket.io-client';
import { useState } from 'react';
import useIdStore from '../zustand';
import axios from 'axios';
// interface UserChatsProps {
//     chatId: string;
// }

const UserChats = ({ chatId }) => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const userId = useTempStore((state) => state.tempData);
    // const token = useIdStore((state) => state.value);


    useEffect(() => {

        const socket = io('http://localhost:3000', {
            autoConnect: true,
            query: {
                userId: userId.trim()
            }
        });

        setSocket(socket)

        socket.on('connect', () => {
            console.log('Connected to server');
        });


        socket.on('typing', (data) => {
            console.log(data);
            alert("Typing")

        });

        socket.on(userId, (msg) => {
            console.log(' i received a message');
            console.log(msg);
            console.log("received");
        })

        socket.on('disconnect', () => {
            console.log('Disconnected from server');


        })


    }, [chatId, chatId]);


    const sendMessage = () => {
        socket.emit('chat-message',


            {

                senderId: userId.trim(),
                receiverId: chatId.trim(),
                content: message.trim(),
                app: "chatterbox"


            }


        )
    }


    //     try {

    //         const pendingChats = await axios.get('http://localhost:3000/api/checkrequest', {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${token}`
    //             }
    //         });
    //         console.log(pendingChats.data);

    //     } catch (error) {
    //         console.log(error);


    //     }


    // };


    // useEffect(() => {
    //     getMyChats();
    // }, [chatId]);

    return (
        <div className='flex flex-col h-full mb-5 '>
            <h2>Chat ID: {chatId}</h2>
            <p>{userId}</p>

            <div className='mt-auto flex flex-row items-center align-bottom px-5'>
                <input type='text' placeholder='Send your Message' className='p-3 w-full bg-violet-50 md:min-h-[50px]' onChange={(e) => setMessage(e.target.value)} />
                <FiSend size={30} className='ml-5 bg-violet-50 cursor-pointer' onClick={sendMessage} />
            </div>

        </div>
    );
};

export default UserChats;
