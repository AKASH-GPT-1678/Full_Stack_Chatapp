import React from 'react'
import RequestOTP from './RequestOTP';

const ForgotPassword = () => {
    const [email, setEmail] = React.useState('');
    const [someError, setSomeError] = React.useState(false);
    const handleSubmit = () => { }
    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
            <RequestOTP handleSubmit={handleSubmit} setValue={setEmail} someError={someError} />
        </div>
    )
}

export default ForgotPassword;
