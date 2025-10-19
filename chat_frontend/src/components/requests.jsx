import React from 'react';
import axios from 'axios';
import useIdStore from '../zustand';
import { TiTickOutline } from "react-icons/ti";
import { ImCross } from "react-icons/im";
const ShowRequests = ({ showRequests, filterRequest }) => {
    const token = useIdStore((state) => state.value);
    const endpoint = import.meta.env.VITE_BACKEND_ENDPOINT;
  
    const makeRequest = async (requestid ) => {
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
    const rejectRequest = async (requestid) => {
        if (!requestid) {
            return
        }

        try {
            const response = await axios.put(`${endpoint}/api/rejectrequestchatter`, { requestId: requestid }, {
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
    }
    return (
        <div>
            {showRequests && filterRequest.length > 0 ? (
                <div className="flex flex-col w-full mt-6 space-y-4">
                    {filterRequest.map((request, index) => (
                        <div
                            key={index}
                            className="flex flex-row items-center justify-between p-4 bg-white shadow-md rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200"
                        >
                        
                            <div className="flex items-center gap-4">
                                <img
                                    src={request.owner.imageUrl || "/default-avatar.png"}
                                    alt={request.owner.username}
                                    className="w-14 h-14 rounded-full object-cover border border-gray-300"
                                />
                                <div className="flex flex-col">
                                    <p className="text-lg font-semibold text-gray-800">
                                        {request.owner.username}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Request to join
                                    </p>
                                </div>
                            </div>

                            {/* Right side: actions */}
                            <div className="flex items-center gap-4">
                                <button
                                    className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition"
                                    onClick={() => rejectRequest(request.id)}
                                >
                                    <ImCross size={20} className="text-red-600" />
                                </button>
                                <button
                                    className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition"
                                    onClick={() => makeRequest(request.id)}
                                >
                                    <TiTickOutline size={28} className="text-green-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}


        </div>
    )
}

export default ShowRequests;
