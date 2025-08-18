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
import { ms } from 'zod/v4/locales';
import EmptyChat from './EmpyChat';
// const chat = [
//     { "name": "Me", "message": "Hi Rajesh, how are you?" },
//     { "name": "Rajesh", "message": "Hey! I'm good, how about you?" },
//     { "name": "Me", "message": "Doing well, just a bit tired from work." },
//     { "name": "Rajesh", "message": "Yeah, work has been hectic for me too." },
//     { "name": "Me", "message": "Did you complete the report for the client?" },
//     { "name": "Rajesh", "message": "Almost done. I just need to add the final figures." },
//     { "name": "Me", "message": "Cool. Want to meet for a coffee after work?" },
//     { "name": "Rajesh", "message": "Sure, sounds like a plan. 6 PM?" },
//     { "name": "Me", "message": "Perfect. Let’s meet at the usual café." },
//     { "name": "Rajesh", "message": "Alright, I’ll see you there." },
//     { "name": "Me", "message": "By the way, did you watch the match yesterday?" },
//     { "name": "Rajesh", "message": "Yes! What a game. The last-minute goal was insane." },
//     { "name": "Me", "message": "Absolutely! I jumped out of my seat." },
//     { "name": "Rajesh", "message": "Same here. The whole family was shouting!" },
//     { "name": "Me", "message": "Haha, sports bring everyone together." },
//     { "name": "Rajesh", "message": "True that. Are you coming to the office party?" },
//     { "name": "Me", "message": "Yes, I already RSVP’d. What about you?" },
//     { "name": "Rajesh", "message": "Yup, I’ll be there. Hoping for good food!" },
//     { "name": "Me", "message": "Me too! And maybe some music and games." },
//     { "name": "Rajesh", "message": "For sure. Let’s dance a bit this time!" },
//     { "name": "Me", "message": "Haha, only if you promise not to bail out." },
//     { "name": "Rajesh", "message": "Deal! I’m in this time." },
//     { "name": "Me", "message": "Okay then, it's a plan. Don’t be late." },
//     { "name": "Rajesh", "message": "Never! I’ll be there before you." },
//     { "name": "Me", "message": "We’ll see about that 😉" },
//     { "name": "Rajesh", "message": "Challenge accepted!" },
//     { "name": "Me", "message": "Haha, alright. Got to go now, meeting starting." },
//     { "name": "Rajesh", "message": "Okay buddy, talk later." },
//     { "name": "Me", "message": "Bye Rajesh!" },
//     { "name": "Rajesh", "message": "Bye! Have a great day!" }
// ]




const UserChats = ({ username, chatId, type }) => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState("");
    const [userName, setMyUserName] = useState("");
    const [messages, setLatestMessages] = useState([]);
    const searchParams = new URLSearchParams(window.location.search);
    const receiverId = searchParams.get('receiverId');
    const [chats, setChats] = useState([]);
    const token = useIdStore((state) => state.value);


    const loadMyProfile = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/myprofile', {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log("profile", response.data);
            setMyUserName(response.data.response.username);
            setUserId(response.data.response.id)
            return response;


        } catch (error) {
            console.log(error);

        }
    };



    useEffect(() => {
        loadMyProfile();
        console.log("i am id", userId);
        // 
        if (!userId) return;

        const socketInstance = io('http://localhost:3000', {
            autoConnect: false,
            query: { userId: userId || "akash" }
        });

        setSocket(socketInstance);
        socketInstance.connect();

        socketInstance.on('connect', () => {
            console.log('Connected to server');
        });

        socketInstance.on('typing', (data) => {
            console.log(data);
            alert("Typing");
        });

        socketInstance.on(userId, (msg) => {
            console.log('I received a message', msg);
            setLatestMessages((prevMessages) => [...prevMessages, msg]);
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from server');
        });


        return () => {
            console.log("Cleaning up socket...");
            socketInstance.disconnect();
        };

    }, [userId]);


    const sendMessage = () => {
        if (type.toString() == "group") {
            let msg = {

                senderId: userId.trim(),
                groupId: chatId.trim(),
                content: message.trim(),
                app: "CHATTERBOX"


            }
            socket.emit('group-message',
                msg




            )
            setLatestMessages((prevMessages) => [...prevMessages, msg]);



        }
        else {
            let msg = {

                senderId: userId.trim(),
                receiverId: chatId.trim(),
                content: message.trim(),
                app: "chatterbox"


            }

            socket.emit('chat-message',
                msg




            )
            setLatestMessages((prevMessages) => [...prevMessages, msg]);

        }


    }




        ;


    const filteredChats = (Array.isArray(messages) ? messages : [messages])
        .flat(Infinity)
        .filter(msg =>
            msg && typeof msg === 'object' && !Array.isArray(msg) &&
            (msg.senderId === chatId || msg.receiverId === chatId || msg.groupId === chatId)
        );









    return (
        <>


            {
                !chatId ? <EmptyChat /> :


                    <div className=' flex-col w-full hidden md:flex h-screen mb-5 rounded-2xl' style={{ backgroundImage: "url('https://res.cloudinary.com/dffepahvl/image/upload/v1754586400/brvblkicc5iuc7pvuwyv.avif')" }}>
                        <div className='flex flex-col h-full'>


                            <div className='min-h-[70px] w-full bg-white rounded-t-2xl flex-shrink-0'>
                                <div className='p-3 flex flex-row'>
                                    <img src={Avatar} alt="profileimage" className='h-[70px] w-[70px] rounded-full' />
                                    <div className='flex flex-col self-center'>
                                        <p className='font-semibold text-2xl'>{username ?? "ak"}</p>
                                        <p className='text-sm text-green-500'>Online</p>
                                    </div>
                                </div>
                            </div>


                            <div className='flex-1 overflow-y-auto px-2 py-2' style={{ maxHeight: 'calc(100vh - 140px)' }}>
                                {
                                    filteredChats.map((item, index) => (
                                        <div key={index} className={`flex flex-row w-fit p-4 rounded-2xl shadow-xl bg-white gap-2 mb-2 ${item.senderId === userId.trim() ? "justify-end ml-auto" : ""}`}>
                                            <div className='bg-white'>
                                                {item.senderId === userId.trim() ? <></> : <img src={Avatar} alt="profileimage" className='h-[50px] w-[50px] rounded-full bg-white' />}
                                            </div>
                                            <div className='self-start bg-white'>
                                                <p className='font-semibold'>{item.senderId === userId.trim() ? "You" : username}</p>
                                                <p className='max-w-[1000px]'>
                                                    {item.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>


                            <div className='bg-white flex flex-row items-center px-5 py-2 flex-shrink-0 rounded-b-2xl'>
                                <input
                                    type='text'
                                    placeholder='Send your Message'
                                    className='p-3 w-full bg-violet-50 md:min-h-[50px] rounded-lg'
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <FiSend size={30} className='ml-5 bg-violet-50 cursor-pointer p-1 rounded' onClick={sendMessage} />
                            </div>
                        </div>
                    </div>
            }


        </>


    );
};

export default UserChats;
