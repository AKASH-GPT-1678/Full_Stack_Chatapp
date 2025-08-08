import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const EmptyChat = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen h-full text-center px-4">
      <FaWhatsapp className="text-6xl text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-600">Chat App</h2>
      <p className="text-sm text-gray-500 mt-2 max-w-md">
        Send and receive messages without keeping your phone online.<br />
        Use the chat on up to 4 devices at the same time.
      </p>
      <p className="text-xs text-gray-400 mt-6">End-to-end encrypted</p>
    </div>
  );
};

export default EmptyChat;
