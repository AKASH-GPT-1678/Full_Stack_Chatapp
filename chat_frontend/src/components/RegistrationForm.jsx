// RegistrationForm.tsx

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { useState } from "react";

const schema = z.object({
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email"),
    username: z.string().min(1, "Username is required"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});



export default function RegistrationForm() {
    const [someError, setSomeError] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const endpoint = import.meta.env.VITE_BACKEND_ENDPOINT;

    const onSubmit = async (data) => {
        console.log("Submitted Data:", data);
        const registerData = {
            fullName: data.fullName,
            email: data.email,
            app: "CHATTERBOX",
            username: data.username,
            phone: data.phone || "",    // in case phone is optional
            password: data.password

        };

        try {
            const response = await axios.post(`${endpoint}/api/register`, registerData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log(response.data);
            if (response.data.message == "User registered") {
                window.location.href = "/login";
            }
            return data;

        } catch (error) {
            console.log(error);
            setSomeError(true);

        }

    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <div>
                    <label className="block mb-1 font-medium">Full Name</label>
                    <input
                        {...register("fullName")}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        {...register("email")}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                {/* Username */}
                <div>
                    <label className="block mb-1 font-medium">Username</label>
                    <input
                        {...register("username")}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Choose a username"
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                </div>

             
                <div>
                    <label className="block mb-1 font-medium">Phone</label>
                    <input
                        {...register("phone")}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Optional phone number"
                    />
                </div>

                {/* Password */}
                <div className="relative">
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                        type="password"
                        {...register("password")}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password"
                    />
                    <div className="absolute top-3/4 right-3 transform -translate-y-1/2">
                        <FaEye size={20} />
                    </div>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                    Submit
                </button>
                {
                    someError && (
                        <p className="text-red-600">Something Went Wrong in Registration</p>
                    )
                }


                <div className="flex flex-row gap-2 items-center justify-center mt-2">
                    <p>Already have an Account?</p>
                    <a href="/login" className="font-medium text-blue-500">Login</a>

                </div>
            </form>
        </div>
    );
}
