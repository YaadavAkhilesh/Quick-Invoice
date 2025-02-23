import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import userIcon from "../../assets/SVGs/usrnm.svg";
import lockIcon from "../../assets/SVGs/passlock.svg";
import mailIcon from "../../assets/SVGs/mail2.svg";
import phoneIcon from "../../assets/SVGs/phone.svg";
import eyeCloseIcon from "../../assets/SVGs/eyeclose.svg";
import eyeOpenIcon from "../../assets/SVGs/eyeopen.svg";
import previousArrow from "../../assets/SVGs/arwcrl.svg";
import erricon from "../../assets/SVGs/error.svg";
import "./frgpass.css";

const InputField = ({ type, name, value, onChange, icon, showEyeIcon, toggleVisibility, placeholder }) => (

    <div className="my-3 form-input position-relative">

        <span className="input-group-text frgtpass-input-group-text">
            <img src={icon} alt={`${name} icon`} height="38" width="38" className="mx-auto" />
        </span>

        <input
            type={type}
            className={`form-control frgtpass-form-control`}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required
        />

        {showEyeIcon && (
            <img
                role="button"
                aria-label="Toggle password visibility"
                onClick={toggleVisibility}
                src={type === "password" ? eyeCloseIcon : eyeOpenIcon}
                alt="Password visibility icon"
                className="password-visibility-icons position-absolute top-50 end-0 translate-middle frgtpass-password-visibility-icons"
                height="28"
                width="28"
                style={{ cursor: 'pointer', zIndex: 1 }}
            />
        )}
    </div>

);

const FrgPass = () => {

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        rememberMe: false,
        otp: ""
    });

    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [timer, setTimer] = useState(30);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Timer effect for OTP
    useEffect(() => {
        let interval;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerRunning(false);
            setTimer(30);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    const handleNavigateButtonClick = () => {
        navigate("/");
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSendOTP = async () => {
        // Show UI immediately
        setOtpSent(true);
        setIsTimerRunning(true);
        
        try {
            await authService.sendEmailOTP(formData.email);
            setErrors(prev => ({ ...prev, email: null, otp: null }));
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                email: error.message || "Failed to send OTP"
            }));
        }
    };

    const handleVerifyOTP = async () => {
        try {
            await authService.verifyEmailOTP(formData.email, formData.otp);
            setOtpVerified(true);
            setErrors(prev => ({ ...prev, otp: null }));
            // Show password fields after OTP verification
            setShowPasswordFields(true);
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                otp: error.message || "Invalid OTP"
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        
        // Validate initial fields
        if (!formData.username) newErrors.username = "Username is required.";
        if (!formData.email) newErrors.email = "Email is required.";
        if (!formData.mobile) newErrors.mobile = "Mobile number is required.";
        
        // Only validate password fields when they are shown and OTP is verified
        if (showPasswordFields) {
            if (!formData.password) {
                newErrors.password = "Password is required.";
            } else if (formData.password.length < 8) {
                newErrors.password = "Password must be at least 8 characters long.";
            } else if (!/[A-Z]/.test(formData.password)) {
                newErrors.password = "Password must contain at least one uppercase letter.";
            } else if (!/[0-9]/.test(formData.password)) {
                newErrors.password = "Password must contain at least one number.";
            }
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = "Please confirm your password.";
            } else if (formData.confirmPassword !== formData.password) {
                newErrors.confirmPassword = "Passwords does not match.";
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                if (!otpVerified) {
                    // First step: Verify user details
                    const response = await authService.verifyForgotPassword(formData);
                    if (response.success) {
                        // Instead of showing password fields directly, we'll show OTP verification
                        setErrors({});
                    } else {
                        setErrors({
                            general: response.message || "Verification failed"
                        });
                    }
                } else {
                    // Final step: Update password
                    await authService.resetPassword(formData);
                    navigate('/login');
                }
            } catch (error) {
                console.error("Error:", error);
                setErrors({
                    general: error.message || "An error occurred. Please try again."
                });
            }
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

    return (
        <div className="container-fluid lg-fluid p-0 m-0 vh-100 vw-100">

            <div className="container-fluid lg-back-fluid d-flex justify-content-between align-items-center p-0 m-0 h-100 w-100">

                <div className="lgn-left-container h-100"></div>

                <div className="lgn-right-container h-100">

                    <div className="card p-0 m-0 lg-card">
                        <form onSubmit={handleSubmit} noValidate>

                            <div className="card-header py-2">
                                <div className="lg-title text-center frgtpass-title">Forgot Password</div>
                            </div>

                            <div className="card-body py-2">

                                {errors.general && (
                                    <div className="invalid-feedback d-flex align-items-center gap-1 mb-0">
                                        <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
                                        <div>{errors.general}</div>
                                    </div>
                                )}

                                <InputField
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    icon={userIcon}
                                    placeholder="Username"
                                />
                                {errors.username && (
                                    <div className="invalid-feedback d-flex align-items-center gap-1 mb-0">
                                        <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
                                        <div>{errors.username}</div>
                                    </div>
                                )}

                                <InputField
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon={mailIcon}
                                    placeholder="Email"
                                />
                                {errors.email && (
                                    <div className="invalid-feedback d-flex align-items-center gap-1 mb-0">
                                        <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
                                        <div>{errors.email}</div>
                                    </div>
                                )}

                                <InputField
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    icon={phoneIcon}
                                    placeholder="Mobile Number"
                                />
                                {errors.mobile && (
                                    <div className="invalid-feedback d-flex align-items-center gap-1 mb-0">
                                        <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
                                        <div>{errors.mobile}</div>
                                    </div>
                                )}

                                {/* Add OTP verification UI */}
                                {formData.email && !otpVerified && (
                                    <div className="my-3">
                                        <div className="d-flex gap-2 align-items-start">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={handleSendOTP}
                                                disabled={isTimerRunning || !formData.email}
                                            >
                                                {isTimerRunning ? `Resend OTP in ${timer}s` : 'Send OTP'}
                                            </button>
                                            
                                            {otpSent && (
                                                <>
                                                    <input
                                                        type="text"
                                                        className={`form-control w-25 ${errors.otp ? 'is-invalid' : ''}`}
                                                        placeholder="Enter OTP"
                                                        name="otp"
                                                        value={formData.otp}
                                                        onChange={handleChange}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-success"
                                                        onClick={handleVerifyOTP}
                                                        disabled={!formData.otp}
                                                    >
                                                        Verify OTP
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        {errors.otp && (
                                            <div className="invalid-feedback d-block">
                                                {errors.otp}
                                            </div>
                                        )}
                                        {otpVerified && (
                                            <div className="text-success mt-2">
                                                Email verified successfully!
                                            </div>
                                        )}
                                    </div>
                                )}

                                {showPasswordFields && otpVerified && (
                                    <>
                                        <InputField
                                            type={passwordVisible ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            icon={lockIcon}
                                            showEyeIcon={true}
                                            toggleVisibility={togglePasswordVisibility}
                                            ref={inputRef}
                                            placeholder={"New Password"}
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback d-flex align-items-center gap-1 mb-0">
                                                <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
                                                <div>{errors.password}</div>
                                            </div>
                                        )}

                                        <InputField
                                            type={confirmPasswordVisible ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            icon={lockIcon}
                                            showEyeIcon={true}
                                            toggleVisibility={toggleConfirmPasswordVisibility}
                                            ref={inputRef}
                                            placeholder={"Confirm New Password"}
                                        />
                                        {errors.confirmPassword && (
                                            <div className="invalid-feedback d-flex align-items-center gap-1 mb-0">
                                                <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
                                                <div>{errors.confirmPassword}</div>
                                            </div>
                                        )}
                                    </>
                                )}

                            </div>

                            <div className="card-footer row m-0 d-flex align-items-center justify-content-around py-3 gy-2 px-0">
                                <button type="submit" className="btn brand-btn d-block f-18 col-4" aria-label="Submit">Submit</button>
                                <div className="text-center register-section col-7">
                                    <p className="m-0">
                                        Remembered your password ?
                                        <Link to="/Login" className="brand-link text-center px-2" aria-label="Login">Login</Link>
                                    </p>
                                </div>
                            </div>

                        </form>
                    </div>

                </div>

                <a onClick={handleNavigateButtonClick} type="button" aria-label="Go back" className="btn brand-btn position-absolute bottom-0 end-0 m-3 navigation-button w-auto">
                    <img src={previousArrow} alt="Previous page arrow" height="38" width="38" />
                </a>

            </div>
        </div>
    );
};

export default FrgPass;