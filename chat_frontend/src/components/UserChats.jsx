import React from 'react';
import { FiSend } from "react-icons/fi";
import { useEffect } from 'react';
import useTempStore from '../userzustand';
import { io } from 'socket.io-client';
import { useState } from 'react';
import useIdStore from '../zustand';
import axios from 'axios';
import Avatar from "../assets/image.png";
import { saveMessage } from './chatDb';
import { getMessagesByReceiverId } from './chatDb';
const chat = [
    { "name": "Me", "message": "Hi Rajesh, how are you?" },
    { "name": "Rajesh", "message": "Hey! I'm good, how about you?" },
    { "name": "Me", "message": "Doing well, just a bit tired from work." },
    { "name": "Rajesh", "message": "Yeah, work has been hectic for me too." },
    { "name": "Me", "message": "Did you complete the report for the client?" },
    { "name": "Rajesh", "message": "Almost done. I just need to add the final figures." },
    { "name": "Me", "message": "Cool. Want to meet for a coffee after work?" },
    { "name": "Rajesh", "message": "Sure, sounds like a plan. 6 PM?" },
    { "name": "Me", "message": "Perfect. Let’s meet at the usual café." },
    { "name": "Rajesh", "message": "Alright, I’ll see you there." },
    { "name": "Me", "message": "By the way, did you watch the match yesterday?" },
    { "name": "Rajesh", "message": "Yes! What a game. The last-minute goal was insane." },
    { "name": "Me", "message": "Absolutely! I jumped out of my seat." },
    { "name": "Rajesh", "message": "Same here. The whole family was shouting!" },
    { "name": "Me", "message": "Haha, sports bring everyone together." },
    { "name": "Rajesh", "message": "True that. Are you coming to the office party?" },
    { "name": "Me", "message": "Yes, I already RSVP’d. What about you?" },
    { "name": "Rajesh", "message": "Yup, I’ll be there. Hoping for good food!" },
    { "name": "Me", "message": "Me too! And maybe some music and games." },
    { "name": "Rajesh", "message": "For sure. Let’s dance a bit this time!" },
    { "name": "Me", "message": "Haha, only if you promise not to bail out." },
    { "name": "Rajesh", "message": "Deal! I’m in this time." },
    { "name": "Me", "message": "Okay then, it's a plan. Don’t be late." },
    { "name": "Rajesh", "message": "Never! I’ll be there before you." },
    { "name": "Me", "message": "We’ll see about that 😉" },
    { "name": "Rajesh", "message": "Challenge accepted!" },
    { "name": "Me", "message": "Haha, alright. Got to go now, meeting starting." },
    { "name": "Rajesh", "message": "Okay buddy, talk later." },
    { "name": "Me", "message": "Bye Rajesh!" },
    { "name": "Rajesh", "message": "Bye! Have a great day!" }
]




const UserChats = ({ chatId }) => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const userId = useTempStore((state) => state.tempData);
    const [messages, setMessages] = useState([]);
    const searchParams = new URLSearchParams(window.location.search);
    const receiverId = searchParams.get('receiverId');



    useEffect(() => {

        const socket = io('http://localhost:3000', {
            autoConnect: false,
            query: {
                userId: userId.trim()
            }
        });


        setSocket(socket);
        socket.connect();


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
            setMessages((prevMessages) => [...prevMessages, msg]);
            saveMessage(msg.senderId, msg.receiverId, msg.content, msg.createdAt);
            console.log("received");
        })

        socket.on('disconnect', () => {
            console.log('Disconnected from server');


        })


    }, [chatId]);



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

    const getMyChats = async () => {

        const messages = await getMessagesByReceiverId('688d01f947cdabcff591bcba');
        console.log(messages);
    };

    const filteredChats = messages.filter((message) => message.senderId === chatId.trim());




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
        <div className='flex flex-col w-full h-screen mb-5 rounded-2xl ' style={{ backgroundImage: "url('https://res.cloudinary.com/dffepahvl/image/upload/v1754586400/brvblkicc5iuc7pvuwyv.avif')" }}>


            <div>

                <div className='w-full h-full'>
                    <div className='min-h-[70px] w-full bg-white rounded-2xl'>
                        <div className='p-3 flex flex-row'>

                            <img src={Avatar} alt="profileimage" className='h-[70px] w-[70px] rounded-full' />


                            <div className='flex flex-col self-center'>
                                <p className='font-semibold text-2xl'>Akash Gupta</p>
                                <p className='text-sm text-green-500'>Online</p>
                            </div>
                        </div>


                    </div>
                    <div className='overflow-y-scroll max-h-screen w-full'>
                        {
                            chat.map((item, index) => (
                                <div key={index} className={`flex flex-row  w-fit p-4 rounded-2xl shadow-xl bg-white   gap-2 ${item.name === "Me" ? "justify-end ml-auto" : <></>}`}>
                                    <div className='bg-white' >
                                        {item.name === "Me" ? <></> : <img src={Avatar} alt="profileimage" className='h-[50px] w-[50px] rounded-full bg-white' />}
                                    </div>
                                    <div className='self-start bg-white'>
                                        <p className='font-semibold'>Akash gupta</p>
                                        <p className='max-w-[1000px]'>
                                            {item.message}
                                        </p>
                                    </div>

                                </div>
                            ))
                        }

                        <div className='sticky bottom-0 bg-white flex flex-row items-center px-5 py-2 z-10'>
                            <input
                                type='text'
                                placeholder='Send your Message'
                                className='p-3 w-full bg-violet-50 md:min-h-[50px]'
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <FiSend size={30} className='ml-5 bg-violet-50 cursor-pointer' onClick={sendMessage} />
                        </div>
                    </div>




                </div>


            </div>




        </div>
    );
};

export default UserChats;
