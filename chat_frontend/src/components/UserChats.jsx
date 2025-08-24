import React from 'react';
import { FiSend } from "react-icons/fi";
import { useEffect, useState } from 'react';
import useTempStore from '../userzustand';
import { io } from 'socket.io-client';
import useIdStore from '../zustand';
import axios from 'axios';
import Avatar from "../assets/image.png";
import { saveMessage } from './chatDb';
import { getMessagesByReceiverId } from './chatDb';
import { fa, ms } from 'zod/v4/locales';

import EmptyChat from './EmpyChat';
import { initDB, saveChatMessage, getMessagesByContactId, storeMessage } from './messageDB';

const UserChats = ({ username, chatId, type }) => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState("");
    const [userName, setMyUserName] = useState("");
    const [messages, setLatestMessages] = useState([]);
    const [currentChatStaus, setCurrentChatStatus] = useState(false);
    const [oldChats, setOldChats] = useState([]);

    const token = useIdStore((state) => state.value);
    const endpoint = import.meta.env.VITE_BACKEND_ENDPOINT;
    const inputRef = React.useRef(null);


    const searchParams = new URLSearchParams(window.location.search);
    const receiverId = searchParams.get("receiverId");
    const finalChatId = window.innerWidth < 500 && receiverId ? receiverId : chatId;


    const loadMyProfile = async () => {
        try {
            const response = await axios.get(`${endpoint}/api/myprofile`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            setMyUserName(response.data.response.username);
            setUserId(response.data.response.id);
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    async function handleIncomingMessage(msg) {
        try {
            console.log("📩 Incoming message:", msg);
            await storeMessage(msg);
            setLatestMessages((prev) => [...prev, msg]);
        } catch (error) {
            console.error("❌ Failed to handle message:", error);
        }
    }

    useEffect(() => {
        loadMyProfile();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const socketInstance = io(`${endpoint}`, {
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
            handleIncomingMessage(msg);
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
        alert("Sending message");
        if (!finalChatId) return;

        if (type === "group") {
            let msg = {
                senderId: userId.trim(),
                groupId: finalChatId.trim(),
                content: message.trim(),
                app: "CHATTERBOX"
            };

            socket.emit('group-message', msg);

            initDB().then(() => {
                const saving = {
                    content: message.trim(),
                    groupId: finalChatId.trim(),
                    receiverId: "",
                    senderId: userId.trim(),
                    timestamp: new Date().toISOString(),
                    contactId: finalChatId
                };
                saveChatMessage(saving);
            });
            inputRef.current.value = "";

            setLatestMessages((prevMessages) => [...prevMessages, msg]);
        } else  {
            let msg = {
                senderId: userId.trim(),
                receiverId: finalChatId.trim(),
                content: message.trim(),
                app: "chatterbox"
            };

            socket.emit('chat-message', msg);

            initDB().then(() => {
                const saving = {
                    content: message.trim(),
                    groupId: "",
                    receiverId: finalChatId.trim(),
                    senderId: userId.trim(),
                    timestamp: new Date().toISOString(),
                    contactId: finalChatId
                };
                saveChatMessage(saving);
            });
            inputRef.current.value = "";

            setLatestMessages((prevMessages) => [...prevMessages, msg]);
        }
    };

    const filteredChats = (Array.isArray(messages) ? messages : [messages])
        .flat(Infinity)
        .filter(msg =>
            msg && typeof msg === 'object' && !Array.isArray(msg) &&
            (msg.senderId === finalChatId || msg.receiverId === finalChatId || msg.groupId === finalChatId)
        );

    useEffect(() => {
        const loadchats = async (idd) => {
            await initDB();
            const res = await getMessagesByContactId(idd);
            setOldChats(res);
        };

        const loadRedisStatus = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:3000/api/userstatus/${userId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const { verified } = response.data;
                setCurrentChatStatus(verified);
                return verified;
            } catch (error) {
                console.error("Error fetching user status:", error);
                setCurrentChatStatus(false);
                return false;
            }
        };

        if (finalChatId) {
            loadRedisStatus(finalChatId);
            loadchats(finalChatId);
        }
    }, [finalChatId]);

    return (
        <>
            {
                !finalChatId ? <EmptyChat /> :
                    <div className=' flex-col w-full  md:flex h-screen mb-5 rounded-2xl' style={{ backgroundImage: "url('https://res.cloudinary.com/dffepahvl/image/upload/v1754586400/brvblkicc5iuc7pvuwyv.avif')" }}>
                        <div className='flex flex-col h-full'>
                            <div className='min-h-[70px] w-full bg-white rounded-t-2xl flex-shrink-0'>
                                <div className='p-3 flex flex-row'>
                                    <img src={Avatar} alt="profileimage" className='h-[70px] w-[70px] rounded-full' />
                                    <div className='flex flex-col self-center'>
                                        <p className='font-semibold text-2xl'>{username ?? "ak"}</p>
                                        <p className={`text-sm ${currentChatStaus ? "text-green-500" : "text-red-500"}`}>{currentChatStaus ? "Online" : "Offline"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='flex-1 overflow-y-auto px-2 py-2' style={{ maxHeight: 'calc(100vh - 140px)' }}>
                                {oldChats &&
                                    oldChats.map((item, index) => (
                                        <div key={index} className={`flex flex-row w-fit p-4 rounded-2xl shadow-xl bg-white gap-2 mb-2 ${item.senderId === userId.trim() ? "justify-end ml-auto" : ""}`}>
                                            <div className='bg-white'>
                                                {item.senderId === userId.trim() ? <></> : <img src={Avatar} alt="profileimage" className='h-[50px] w-[50px] rounded-full bg-white' />}
                                            </div>
                                            <div className='self-start bg-white'>
                                                <p className='font-semibold'>{item.senderId === userId.trim() ? "You" : username}</p>
                                                <p className='max-w-[1000px]'>{item.content}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                                {
                                    filteredChats.map((item, index) => (
                                        <div key={index} className={`flex flex-row w-fit p-4 rounded-2xl shadow-xl bg-white gap-2 mb-2 ${item.senderId === userId.trim() ? "justify-end ml-auto" : ""}`}>
                                            <div className='bg-white'>
                                                {item.senderId === userId.trim() ? <></> : <img src={Avatar} alt="profileimage" className='h-[50px] w-[50px] rounded-full bg-white' />}
                                            </div>
                                            <div className='self-start bg-white'>
                                                <p className='font-semibold'>{item.senderId === userId.trim() ? "You" : username}</p>
                                                <p className='max-w-[1000px]'>{item.content}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className='bg-white flex flex-row items-center px-5 py-2 flex-shrink-0 rounded-b-2xl'>
                                <input
                                    type='text'
                                    placeholder='Send your Message'
                                    className='p-3 w-[90%] bg-violet-50 md:min-h-[50px] rounded-lg'
                                    onChange={(e) => setMessage(e.target.value)}
                                    ref={inputRef}
                                />
                                <FiSend size={50} className='ml-5  cursor-pointer p-1 rounded' onClick={sendMessage} />
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};

export default UserChats;
