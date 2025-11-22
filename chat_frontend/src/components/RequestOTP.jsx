import React from "react";

export default function RequestOTP({ handleSubmit, setValue, someError }) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Email */}
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      {/* Error */}
      {someError && (
        <p className="text-red-600">
          Something Went Wrong in Registration
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition mt-4 cursor-pointer"
      >
        Request OTP
      </button>

    </form>
  );
}
