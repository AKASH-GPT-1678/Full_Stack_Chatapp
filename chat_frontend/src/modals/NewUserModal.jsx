import React from 'react';
import { ImCross } from 'react-icons/im';

const NewUserModal = ( {setNewUser , setAddChat , addNewUser}) => {
  return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 ">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative">
            <div className="bg-white p-3  rounded-full absolute -right-2 -top-4 cursor-pointer"
            onClick={()=>setNewUser(false)}
            
            
            >
              <ImCross size={20} className="" />
            </div>
            <h2 className="text-2xl font-bold text-center">Search User</h2>

            <input
              type="text"
              placeholder="Enter username..."
              className="mt-4 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
              onChange={(e) => setAddChat(e.target.value)}
            />

            <button
              onClick={addNewUser}
              className="mt-4 w-full rounded-lg bg-blue-500 p-3 text-white transition hover:bg-blue-600 cursor-pointer"
            >
              New Chat
            </button>
          </div>
        </div>
  )
}

export default NewUserModal
