import React from 'react';
import { IoSettingsOutline } from "react-icons/io5";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import useIdStore from '../zustand';
import { ImCross } from "react-icons/im";
import { useEffect } from 'react';
import { TiTickOutline } from "react-icons/ti";
import Avatar from "../assets/image.png";
import { useRef } from 'react';
import UserChats from './UserChats';
import { IoArrowForwardCircle } from "react-icons/io5";
import { is } from 'zod/v4/locales';



const MainSideDisplay = () => {
    const DivRef = React.useRef(null);
    const [showOptions, setShowOptions] = React.useState(false);
    const [activeType, setActiveType] = React.useState("default");
    const [requests, setRequests] = React.useState([]);
    const [showRequests, setShowRequests] = React.useState(false);
    const [newGroup, setNewGroup] = React.useState(false);
    const [myContacts, setMyContacts] = React.useState([]);
    const [groupChat, setGroupChat] = React.useState(false);
    const [activeChat, setactiveChat] = React.useState("default");
    const [myUserName, setMyUserName] = React.useState('');
    const [profileImage, setProfileImage] = React.useState('');
    const [userId, setUserId] = React.useState('');
    const [addChat, setAddChat] = React.useState('');
    const [verified, setVerified] = React.useState(false);
    const [groups, setGroups] = React.useState([]);

    const token = useIdStore((state) => state.value);
    const endpoint = import.meta.env.VITE_BACKEND_ENDPOINT;
    const setIsLoggedIn = useIdStore((state) => state.setIsLoggedIn);
    const isLoggedIn = useIdStore((state) => state.isLoggedIn);


    const [items, setItems] = React.useState([]);


    function handleCheckboxChange(e, id) {
        if (e.target.checked) {

            setItems(prevItems => [
                ...prevItems,
                { id }
            ]);
        } else {

            setItems(prevItems => prevItems.filter(item => item.id !== id));
        }
    };



    const handleNewChat = () => {
        setShowOptions(!showOptions);
        DivRef.current.style.display = 'flex';
    };


    const addNewUser = async () => {

        try {
            const response = await axios.post(`${endpoint}/api/addcontactchatter`, { contactId: addChat.trim() }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log(response.data);
            if (response.data.message == 'Contact Added') {
                document.getElementById('addUser').innerHTML = "Request Sent";
                DivRef.current.style.display = 'none';

                window.location.reload();
            }
            return response;


        } catch (error) {
            console.log(error);

        }
    };




    const handleGroupPage = (id) => {
        setactiveChat(id);
        setGroupChat(true);

        const width = window.innerWidth;
        if (width < 500) {
            window.location.href = `/chat?receiverId=${id}`

        } else {

            return null;
        }


    };


    const handlecreateGroup = (members) => {
        localStorage.setItem('members', JSON.stringify(members));
        window.location.href = '/newgroup';

    };


    const loadMyProfile = async () => {
        try {
            const response = await axios.get(`${endpoint}/api/myprofile`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log("profile", response.data);
            setMyUserName(response.data.response.username);
            setUserId(response.data.response.id);
            setProfileImage(response.data.response.profileImage);
            setIsLoggedIn(true);


            return response;


        } catch (error) {
            console.log("error fetchingprofile", error);
            setIsLoggedIn(false);

            console.log(error);

        }
    };

    const checkForRequests = async () => {

        try {
            const data = await axios.get(`${endpoint}/api/checkrequestchatter`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log(data.data);

            console.log(data.data.data);
            setRequests(data.data.data);


        } catch (error) {
            console.log(error)

        }

    };

    async function getContacts() {
        try {
            const response = await axios.get(`${endpoint}/api/mycontactschatter`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log("dear contact", response.data);
            console.log(response.data.contacts);


            setMyContacts(response.data.contacts);

            return response.data;
        } catch (error) {
            console.error('Error fetching contacts:', error);
            throw error;
        }
    }

    const makeRequest = async (requestid) => {
        if (!requestid) {
            return
        }

        try {
            const response = await axios.put(`${endpoint}/api/acceptrequestchatter`, { requestId: requestid }, {
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
    const fetchUserGroups = async () => {

        const token = useIdStore.getState().value;

        try {
            const response = await axios.get(`${endpoint}/api/usergroups`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);

            console.log("My Groups:", response.data);
            setGroups(response.data.data);




        } catch (error) {
            console.error("Error fetching groups:", error.response?.data || error);
            return [];
        }
    };




    const activeContact = myContacts.filter(contact => contact.id === activeChat);
    const divRef = useRef(null);
    const handleChatPage = (id) => {
        setactiveChat(id);
        setGroupChat(false);

        const width = window.innerWidth;
        if (width < 500) {
            window.location.href = `/chat?receiverId=${id}&username=${activeContact[0]?.username || "deepedh"}`

        } else {

            return null;
        }


    };

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                divRef.current &&
                !divRef.current.contains(event.target)
            ) {
                setShowOptions(false); 
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    useEffect(() => {
        if (!isLoggedIn) {
            window.location.href = '/login';
        }


        checkForRequests();
        getContacts();
        loadMyProfile();
        fetchUserGroups();













    }, [verified]);

    const sortedContacts = new Set(myContacts);
    const contactsArray = Array.from(sortedContacts);
    const filterRequest = requests.filter((request) => request.ownerId !== userId);
    const activeGroup = [groups.find((group) => group.id === activeChat)];
    const commonProfile = 'https://res.cloudinary.com/dffepahvl/image/upload/v1754295798/pwoveg1fjurga2kudwk4.png';


    return (
        <div className='flex flex-row w-full bg-gray-200 p-8  gap-8 '>
            <div className='flex flex-col w-full min-w-[350px] md:min-w-[400px] md:max-w-[500px] p-3 min-h-screen bg-white rounded-2xl shadow-2xl'>

                <div className='flex flex-row justify-between max-w-[400px] xl:max-w-[500px] items-center'>
                    <div className='p-3 flex flex-row gap-2'>
                        <img src={profileImage || commonProfile} alt="profileimage" className='h-[60px] w-[60px] rounded-full' />

                        <div className='flex flex-col self-center' onClick={() => window.location.href = `/profile?id=${userId}`}>
                            <p className='font-semibold text-2xl'>{myUserName}</p>
                            <p>Account Info</p>
                        </div>
                    </div>
                    <div className='flex flex-row gap-3  p- relative'>
                        <IoSettingsOutline size={30} className='cursor-pointer' />
                        <BsThreeDotsVertical size={30} className='cursor-pointer' onClick={() => setShowOptions(!showOptions)} />
                        {
                            showOptions ? (
                                <div className='absolute top-10 right-0 z-40 bg-white p-3 min-w-[150px] lg:min-w-[200px]  rounded-xl shadow-2xl  space-y-4' ref={divRef}>
                                    <p className='font-semibold' onClick={handleNewChat}>New Chat</p>
                                    <p className='font-semibold cursor-pointer' onClick={() => setNewGroup(!newGroup)}>New Group</p>
                                    <p className='font-semibold cursor-pointer' onClick={() => setShowRequests(!showRequests)}>View Requests</p>
                                    <p onClick={() => window.location.href = '/login'}>Login</p>
                                </div>
                            ) : null
                        }
                    </div>
                </div>

                <div>
                    <div className='p-4 bg-gray-200 w-full rounded-3xl flex flex-row items-center min-h-[50px] justify-evenly'>
                        <p
                            className={`${activeType === "default" ? "px-6 rounded-2xl text-blue-500 bg-white py-2" : ""
                                } cursor-pointer font-bold text-gray-500 px-4 md:px-8 py-2`}
                            onClick={() => setActiveType("default")}
                        >
                            All
                        </p>

                        <p
                            className={`${activeType === "personal" ? "px-6 rounded-2xl text-blue-500 bg-white py-2" : ""
                                } cursor-pointer font-bold text-gray-500 px-4 md:px-8 py-2`}
                            onClick={() => setActiveType("personal")}
                        >
                            Personal
                        </p>

                        <p
                            className={`${activeType === "groups" ? " rounded-2xl text-blue-500 bg-white " : ""
                                } cursor-pointer font-bold text-gray-500  px-4 md:px-8 py-2`}
                            onClick={() => setActiveType("groups")}
                        >
                            Groups
                        </p>
                    </div>

                    <div>
                        <input type="text" className='w-full p-3 border-1 border-gray-400 mt-4  rounded-2xl' placeholder='Search' />
                    </div>

                    <div className='flex-col items-center justify-center hidden bg-white mt-8 transform duration-300  p-3 rounded-2xl' ref={DivRef}>
                        <p className='font-bold text-2xl'>Search for User</p>
                        <input type="text" className='w-full p-3 border-1 border-gray-400 mt-2  ' placeholder='add username to search' onChange={(e) => setAddChat(e.target.value)} />
                        <button className={`p-2 w-full bg-blue-500 text-white mt-2 cursor-pointer `} onClick={addNewUser} id='addUser'>New Chat</button>
                    </div>

                    {showRequests && filterRequest.length > 0 ? (
                        <div className='flex flex-col w-full mt-6'>
                            {filterRequest.map((request, index) => (
                                <div key={index} className='flex flex-row p-2 border-2 gap-2 items-center min-h-[50px]'>
                                    <div className='h-full rounded-full p-4 border-2'>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <p>
                                            {request.owner.username}
                                        </p>
                                    </div>
                                    <div className='flex flex-row items-center ml-6 gap-2'>
                                        <ImCross size={26} className='cursor-pointer' fill='red' />
                                        <TiTickOutline size={36} className='cursor-pointer' fill='green' onClick={() => makeRequest(request.id)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}


                    {(contactsArray.length > 0 || groups.length > 0) && (
                        <div className='mt-3 h-full relative'>


                            {contactsArray.length > 0 && myContacts.map((contact, index) => (
                                <div key={`contact-${index}`} className='flex flex-row min-h-[50px] relative  items-center cursor-pointer p-2  rounded-2xl hover:bg-gray-50' onClick={() => handleChatPage(contact.id)}>
                                    <img src={contact.profileImage ? contact.profileImage : commonProfile.toString()} alt={contact.username} className='rounded-full object-cover h-[60px] w-[70px] border border-gray-400' />

                                    <div className='flex flex-col ml-3 w-full'>
                                        <div className='flex flex-row justify-between'>
                                            <p className='font-bold self-start'>
                                                {contact.username}
                                            </p>

                                            {newGroup ? <input type='checkbox' className='flex flex-col accent-green-600  cursor-pointer self-center-safe p-2 h-[20px] w-[40px]' onChange={(e) => handleCheckboxChange(e, contact.id)} /> : <p className='font-semibold text-gray-400'>09:25 PM</p>}
                                        </div>
                                        <p className='mt-2'>
                                            Hey how are you doing
                                        </p>
                                    </div>
                                </div>
                            ))}


                            {groups.length > 0 && groups.map((contact, index) => (
                                <div key={`group-${index}`} className='flex flex-row min-h-[50px] relative  items-center cursor-pointer p-2  rounded-2xl hover:bg-gray-50' onClick={() => handleGroupPage(contact.id)}>
                                    <img src={contact.groupProfile ? contact.groupProfile : commonProfile.toString()} alt={contact.username} className='rounded-full object-cover h-[60px] w-[70px] border border-gray-400' />

                                    <div className='flex flex-col ml-3 w-full'>
                                        <div className='flex flex-row justify-between'>
                                            <p className='font-bold self-start'>
                                                {contact.groupName}
                                            </p>

                                            {newGroup ? <input type='checkbox' className='flex flex-col accent-green-600  cursor-pointer self-center-safe p-2 h-[20px] w-[40px]' onChange={(e) => handleCheckboxChange(e, contact.id)} /> : <p className='font-semibold text-gray-400'>09:25 PM</p>}
                                        </div>
                                        <p className='mt-2'>
                                            Hey how are you doing
                                        </p>
                                    </div>
                                </div>
                            ))}


                            {items.length > 0 && (
                                <IoArrowForwardCircle size={50} className='ml-auto cursor-pointer absolute  bottom-12 right-3.5' fill='green ' onClick={() => handlecreateGroup(items)} />
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className='w-full hidden sm:block'>
                {groupChat ? <UserChats username={activeGroup.length > 0 ? activeGroup[0].groupName : ""} chatId={activeGroup.length > 0 ? activeGroup[0].id : ""} type={"group"} />
                    : <UserChats username={activeContact.length > 0 ? activeContact[0].username : ""} chatId={activeContact.length > 0 ? activeContact[0].id : ""} type={"chat"} />}
            </div>
        </div>
    )
};

export default MainSideDisplay;
