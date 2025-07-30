import React from 'react';
import { IoSettingsOutline } from "react-icons/io5";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import useIdStore from '../zustand';
import { ImCross } from "react-icons/im";
import { useEffect } from 'react';
import { TiTickOutline } from "react-icons/ti";
import ChatPage from './ChatPage';
import UserChats from './UserChats';
import useTempStore from '../userzustand';

const MainSideDisplay = () => {
    const DivRef = React.useRef(null);
    const [showOptions, setShowOptions] = React.useState(false);
    const [requests, setRequests] = React.useState([]);
    const [showRequests, setShowRequests] = React.useState(false);
    const [myContacts, setMyContacts] = React.useState([]);
    const [activeChat, setactiveChat] = React.useState("default");
    const [addChat, setAddChat] = React.useState('');
    const token = useIdStore((state) => state.value);
    const endpoint = import.meta.env.VITE_BACKEND_ENDPOINT;
    const setUserId = useTempStore((state) => state.setTempData);
    const tempData = useTempStore((state) => state.tempData);


    const handleNewChat = () => {
        setShowOptions(!showOptions);
        DivRef.current.style.display = 'flex';
    };


    const addNewUser = async () => {

        try {
            const response = await axios.post('http://localhost:3000/api/addcontact', { contactId: addChat.trim() }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log(response.data);
            return response;


        } catch (error) {
            console.log(error);

        }
    };

    const checkForRequests = async () => {

        try {
            const data = await axios.get('http://localhost:3000/api/checkrequest', {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log(data.data.data);
            setRequests(data.data.data);


        } catch (error) {
            console.log(error)

        }

    };

    async function getContacts() {
        try {
            const response = await axios.get(`${endpoint}/mycontacts`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log(response.data.contacts);
            setMyContacts(response.data.contacts);
            setUserId(response.data.contacts[0].userId)
            return response.data;
        } catch (error) {
            console.error('Error fetching contacts:', error);
            throw error; // Optional: let caller handle it
        }
    }

    const makeRequest = async (requestid) => {
        if (!requestid) {
            return
        }

        try {
            const response = await axios.put('http://localhost:3000/api/acceptrequest', { requestId: requestid }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log(response.data);
            return response.data;

        } catch (error) {
            console.log(error);

        }

    };

    useEffect(() => {

        checkForRequests();
        getContacts();

    }, [])


    return (

        <div className='flex flex-row w-full'>
            <div className='flex flex-col md:min-w-[300px] lg:min-w-[400px] max-w-[400px] xl:min-w-[500px] p-3 '>


                <div className='flex flex-row justify-between max-w-[400px] xl:max-w-[500px] items-center'>
                    <div className='p-3 flex flex-row'>

                        <h1 className='outfit-bold text-3xl text-green-400'>ChatterBox</h1>
                    </div>
                    <div className='flex flex-row gap-3  p- relative'>
                        <IoSettingsOutline size={30} className='cursor-pointer' />
                        <BsThreeDotsVertical size={30} className='cursor-pointer' onClick={() => setShowOptions(!showOptions)} />
                        {

                            showOptions ? (
                                <div className='absolute top-10 right-0 z-40 bg-white p-3 min-w-[150px] lg:min-w-[200px]  border-2 border-gray-400 space-y-4'>
                                    <p className='font-semibold' onClick={handleNewChat}>New Chat</p>
                                    <p>New Chat</p>
                                    <p className='font-semibold cursor-pointer' onClick={() => setShowRequests(!showRequests)}>View Requests</p>
                                    <p>New Chat</p>

                                </div>

                            ) : null
                        }



                    </div>
                </div>

                <div>
                    <input type="text" className='w-full p-3 border-1 border-gray-400 mt-4  rounded-2xl' placeholder='Search' />
                </div>
                <div className='flex-col items-center justify-center hidden bg-white mt-8 transform duration-300  p-3 rounded-2xl' ref={DivRef}>
                    <p className='font-bold text-2xl'>Search for User</p>
                    <input type="text" className='w-full p-3 border-1 border-gray-400 mt-2  ' placeholder='add username to search' onChange={(e) => setAddChat(e.target.value)} />



                    <button className={`p-2 w-full bg-blue-500 text-white mt-2 cursor-pointer `} onClick={addNewUser}>New Chat</button>


                </div>
                {

                    showRequests && requests.length > 0 ? (
                        <div className='flex flex-col w-full mt-6'>
                            {requests.map((request, index) => (
                                <div key={index} className='flex flex-row p-2 border-2 gap-2 items-center min-h-[50px]'>
                                    <div className='h-full rounded-full p-4 border-2'>

                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <p>
                                            {request.senderName}
                                        </p>
                                        <p>{request.senderId
                                        }</p>

                                    </div>
                                    <div className='flex flex-row items-center ml-6 gap-2'>
                                        <ImCross size={26} className='cursor-pointer' fill='red' />
                                        <TiTickOutline size={36} className='cursor-pointer' fill='green' onClick={() => makeRequest(request._id)} />

                                    </div>


                                </div>

                            ))}
                        </div>

                    ) : (
                        <div>
                            <p>No requests</p>
                        </div>

                    )
                }
                {
                    myContacts.length > 0 ? (
                        <div>
                            {myContacts.map((contact, index) => (
                                <div key={index} className='flex flex-row min-h-[70px] border-2 items-center cursor-pointer p-2 rounded-2xl hover:bg-gray-50' onClick={() => setactiveChat(contact.contactUserId)}>
                                    <img src='https://res.cloudinary.com/dffepahvl/image/upload/v1753856887/ffssrmilcadfcna4q4kk.avif' alt={contact.username} className='rounded-full object-cover h-[80%] 
                                 max-w-[60px] border-1'/>

                                    <p className='ml-5 font-bold'>
                                        {contact.username}
                                    </p>
                                </div>
                            ))}

                        </div>

                    ) : (

                        <div className='flex flex-col mt-6'>
                            <p>No contacts</p>
                        </div>
                    )
                }
            </div>
            <div className='w-full border-2 p-4 h-screen'>
                <UserChats chatId={activeChat} />
            </div>
        </div>
    )
}

export default MainSideDisplay;
