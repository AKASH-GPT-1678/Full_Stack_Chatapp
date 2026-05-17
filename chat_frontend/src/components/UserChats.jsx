import React from 'react';
import { FiSend } from "react-icons/fi";
import { useEffect, useState } from 'react';
import useTempStore from '../userzustand';
import { io } from 'socket.io-client';
import useIdStore from '../zustand';
import axios from 'axios';
import Avatar from "../assets/image.png";

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
        } else {
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
                const response = await axios.get(`${endpoint}/api/userstatus/${userId}`, {
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
  {!finalChatId ? (
    <EmptyChat />
  ) : (
    <div
      className="flex h-screen w-full flex-col overflow-hidden rounded-2xl bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dffepahvl/image/upload/v1754586400/brvblkicc5iuc7pvuwyv.avif')",
      }}
    >
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b bg-white/90 px-5 py-4 backdrop-blur-md">
        <img
          src={Avatar}
          alt="profile"
          className="h-14 w-14 rounded-full object-cover"
        />

        <div>
          <p className="text-xl font-semibold">
            {username ?? "Akash"}
          </p>

          <p
            className={`text-sm font-medium ${
              currentChatStaus
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {currentChatStaus ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {/* OLD CHATS */}
        {oldChats &&
          oldChats.map((item, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                item.senderId === userId.trim()
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-lg ${
                  item.senderId === userId.trim()
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
              >
                <p className="text-sm font-semibold mb-1">
                  {item.senderId === userId.trim()
                    ? "You"
                    : username}
                </p>

                <p className="break-words">
                  {item.content}
                </p>
              </div>
            </div>
          ))}

        {/* LIVE CHATS */}
        {filteredChats.map((item, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              item.senderId === userId.trim()
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-lg ${
                item.senderId === userId.trim()
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              <p className="text-sm font-semibold mb-1">
                {item.senderId === userId.trim()
                  ? "You"
                  : username}
              </p>

              <p className="break-words">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MESSAGE INPUT */}
      <div className="border-t bg-white/90 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 rounded-xl border border-gray-300 bg-gray-100 p-4 outline-none focus:border-blue-500"
            onChange={(e) => setMessage(e.target.value)}
            ref={inputRef}
          />

          <button
            onClick={sendMessage}
            className="rounded-xl bg-blue-500 p-3 text-white transition hover:bg-blue-600"
          >
            <FiSend size={24} />
          </button>
        </div>
      </div>
    </div>
  )}
</>
    );
};

export default UserChats;
