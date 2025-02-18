import React, { useState } from 'react';
import './Signup.css';
import { RxCross1 } from 'react-icons/rx';
import { useForm } from "react-hook-form";
import OtpSubmit from '../Otp/Otp';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Signup = ({ setShowSignup, setShowLogin }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();
    const [otpCard, setOtpCard] = useState(false);
    const [data, setData] = useState({});

    const onSubmit = async (data) => {
        console.log(data);
        setData(data);  // Set form data for OTP verification
        try {
            const response = await axios.post('http://localhost:7000/api/users/sendotp', {
                email: data.email  // Send email to backend
            });
            if (response.data.success) {
                setOtpCard(true); // Show OTP input form if OTP sent successfully

                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Could not send OTP:', error);
            toast.error('Could not send OTP');
        }
    };

    const password = watch("password");  // To validate password confirmation

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <span onClick={() => setShowSignup(false)} className='cross'><RxCross1 /></span>
            {otpCard ? (
                <OtpSubmit 
                    data={data} 
                    setOtpCard={setOtpCard} 
                    setShowSignup={setShowSignup} 
                    setShowLogin={setShowLogin} 
                />
            ) : (
                <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-group">
                        <label htmlFor="name">Username:</label>
                        <input
                            type="text"
                            id="name"
                            className="input-field"
                            {...register("username", {
                                required: "Username is required",
                                minLength: { value: 5, message: "Username must be at least 5 characters" }
                            })}
                        />
                        {errors.username && <p className="error-messagee">{errors.username.message}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="eml">Email:</label>
                        <input
                            type="email"
                            id="eml"
                            className="input-field"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Please enter a valid email address"
                                }
                            })}
                        />
                        {errors.email && <p className="error-messagee">{errors.email.message}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="input-field"
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters." },
                                maxLength: { value: 16, message: "Password must not exceed 16 characters." },
                                validate: value => {
                                    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
                                    if (!regex.test(value)) {
                                        return "Password must include an uppercase letter, lowercase letter, number, and special character.";
                                    }
                                    return true;
                                }
                            })}
                        />
                        {errors.password && <p className="error-messagee">{errors.password.message}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="cpassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="cpassword"
                            className="input-field"
                            {...register("cpassword", {
                                required: "Confirm Password is required",
                                validate: value => value === password || "Passwords do not match",
                            })}
                        />
                        {errors.cpassword && <p className="error-messagee">{errors.cpassword.message}</p>}
                    </div>

                    <input
                        style={{ opacity: isSubmitting ? 0.5 : 1 }}
                        type="submit"
                        className="signup-button"
                        disabled={isSubmitting}
                        value={isSubmitting ? "Signing Up..." : "Sign Up"}
                    />
                </form>
            )}
        </div>
    );
};

export default Signup;
