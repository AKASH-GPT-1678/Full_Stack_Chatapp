// LoginForm.tsx

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { da } from "zod/v4/locales";
import { useState } from "react";
import axios from "axios";
import useIdStore from "../zustand";
import { FaEye } from "react-icons/fa";

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});



export default function LoginForm() {
    const [someError, setSomeError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const setIdValue = useIdStore((state) => state.setTokenValue);
    const setIsLoggedIn = useIdStore((state) => state.setIsLoggedIn);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });
    const endpoint = import.meta.env.VITE_BACKEND_ENDPOINT;


    const onSubmit = async (data) => {
        console.log("Login Data:", data);
        const loginData = {
            email: data.email,
            password: data.password
        };
        try {
            const response = await axios.post(`${endpoint}/api/login`, loginData, {
                headers: { "Content-Type": "application/json" }
            });

            console.log(response.data);

            // Update Zustand store
            setIdValue(response.data.token);

            // Only redirect if login was successful
            if (response.data.success === true) {
                setTimeout(() => {
                    setIsLoggedIn(true);
                    window.location.href = "/";
                }, 50);
            }

            return data;

        } catch (error) {
            console.error(error);
            setSomeError(true);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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


                <div className="relative">
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password"
                    />
                    <div className="absolute top-3/4 right-3 transform -translate-y-1/2">
                        <FaEye size={20} onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" />
                    </div>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>


                {
                    someError && (
                        <p className="text-red-600">Something Went Wrong in Registration</p>
                    )
                }

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition mt-4"
                >
                    Login
                </button>


                <p>Don't have an account? <a href="/register" className="text-blue-600 mt-2 hover:underline">Register</a></p>
            </form>
        </div>
    );
}
