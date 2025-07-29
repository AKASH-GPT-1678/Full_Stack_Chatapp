import React from 'react';
import { IoSettingsOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
const MainSideDisplay = () => {
    const DivRef = React.useRef(null);
    const [showOptions, setShowOptions] = React.useState(false);

    const handleNewChat = () => {
        setShowOptions(!showOptions);
        DivRef.current.style.display = 'flex';
    }
    return (
        <div className='flex flex-col max-w-[400px] xl:max-w-[500px] p-3 '>
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
                                <p>New Chat</p>
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
                <input type="text" className='w-full p-3 border-1 border-gray-400 mt-2  ' placeholder='add username to search' />



                <button className='p-2 w-full bg-blue-500 text-white mt-2 cursor-pointer'>New Chat</button>


            </div>
        </div>
    )
}

export default MainSideDisplay
