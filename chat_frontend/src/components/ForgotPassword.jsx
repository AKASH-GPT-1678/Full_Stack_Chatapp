import React from 'react'
import RequestOTP from './RequestOTP';
import { OtpInput } from './OTPVerify';
import axios from 'axios';
import apiClient from '../utils/apiClient';
import { endpoint } from '../utils/apiClient';
const ForgotPassword = () => {
    const [email, setEmail] = React.useState('');
    const [otpVal , setOtpVal] = React.useState(null);
    const [someError, setSomeError] = React.useState(false);
    const [showOTP, setShowOTP] = React.useState(false);
    const endpoint = import.meta.env.VITE_BACKEND_ENDPOINT;
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setSomeError(true);
            return;
        };
        console.log(email);
        console.log(endpoint);
        try {
            const response = await apiClient.get(`/api/forgot-password/${email}`);
            const data = await response.data;
            console.log(data);
            if (data.message === 'OTP sent successfully') {
                setOtpVal(data.otp);
                setShowOTP(true);
            } else {
                setSomeError(true);
            }
        } catch (error) {
            console.error(error);
            setSomeError(true);
        }
    }
    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
            { showOTP ? <OtpInput otp={otpVal} /> : <RequestOTP handleSubmit={handleSubmit} setValue={setEmail} someError={someError} />}
        </div>
    )
}

export default ForgotPassword;
