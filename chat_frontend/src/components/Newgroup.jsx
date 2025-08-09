import React, { useState } from "react";
import useIdStore from "../zustand";
import axios from "axios";

export default function Newgroup() {
  const token = useIdStore((state) => state.value);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const createGroup = async () => {
    setLoading(true);
    setStatus("");


    let members = localStorage.getItem("members");
    try {
      members = members ? JSON.parse(members) : [];
    } catch {
      members = [];
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/creategroup",
        {
          groupName,
          description,
          isPublic: false,
          members,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setStatus("✅ Group created successfully!");
      console.log("Group created:", response.data);
    } catch (error) {
      setStatus(
        `❌ Error: ${error.response?.data?.message || "Something went wrong"}`
      );
      console.error("Error creating group:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create New Group</h1>

 
        <label className="block mb-2 font-semibold">Group Name</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Description */}
        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          rows={4}
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Create Button */}
        <button
          onClick={createGroup}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Group"}
        </button>

        {/* Status Message */}
        {status && (
          <p className="mt-4 text-center font-medium">{status}</p>
        )}
      </div>
    </div>
  );
}
