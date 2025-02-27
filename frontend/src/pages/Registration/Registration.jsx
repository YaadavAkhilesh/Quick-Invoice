import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import userIcon from "../../assets/SVGs/usrnm.svg";
import lockIcon from "../../assets/SVGs/passlock.svg";
import eyeCloseIcon from "../../assets/SVGs/eyeclose.svg";
import eyeOpenIcon from "../../assets/SVGs/eyeopen.svg";
import previousArrow from "../../assets/SVGs/arwcrl.svg";
import erricon from "../../assets/SVGs/error.svg";
import phoneIcon from "../../assets/SVGs/phone.svg";

import "./Registration.css";
import { authService } from "../../services/api";

const InputField = ({ label, name, type, value, onChange, error, prefix }) => (
    <div className="col-xl-4">
        <label className="form-label">{label}</label>
        {prefix ? (
            <div className="input-group">
                <div className="input-group-text">{prefix}</div>
                <input
                    type={type}
                    className={`form-control`}
                    name={name}
                    value={value}
                    onChange={onChange}
                />
            </div>
        ) : (
            <input
                type={type}
                className={`form-control`}
                name={name}
                value={value}
                onChange={onChange}
            />
        )}
        {error && (
            <div className="invalid-feedback d-block d-flex align-items-center gap-1 f-14 my-3">
                <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
                <div>{error}</div>
            </div>
        )}
    </div>
);

const Registration = () => {

    const [formData, setFormData] = useState({
        brandName: "",
        ownerName: "",
        telephone: "",
        email: "",
        address: "",
        businessType: "",
        businessCode: "",
        username: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
        otp: ""
    });

    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [profileImage, setProfileImage] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [timer, setTimer] = useState(30);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const navigate = useNavigate();

    // Timer effect
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

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

    const handleNavigateButtonClick = () => {
        navigate("/");
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setProfileImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Clear confirm password error when passwords match
        if (name === 'confirmPassword' || name === 'password') {
            if (name === 'confirmPassword' && value === formData.password) {
                setErrors(prev => ({ ...prev, confirmPassword: null }));
            } else if (name === 'password' && value === formData.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: null }));
            }
        }
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
            // Don't hide the OTP input even if sending fails
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const response = await authService.verifyEmailOTP(formData.email, formData.otp);
            setOtpVerified(true);
            setErrors(prev => ({ ...prev, otp: null }));
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                otp: error.message || "Invalid OTP"
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        const requiredFields = [
            { key: "brandName", message: "Brand name is required." },
            { key: "ownerName", message: "Owner name is required." },
            { key: "telephone", message: "Telephone is required." },
            { key: "email", message: "Email is required." },
            { key: "address", message: "Address is required." },
            { key: "businessType", message: "Business Type is required." },
            { key: "businessCode", message: "Business Code is required." },
            { key: "username", message: "Username is required." },
            { key: "password", message: "Password is required." }
        ];

        requiredFields.forEach(({ key, message }) => {
            if (!formData[key]) newErrors[key] = message;
        });

        // Email validation
        if (formData.email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "Please enter a valid email address";
            }
        }

        // Password validation
        if (formData.password) {
            if (formData.password.length < 8) {
                newErrors.password = "Password must be at least 8 characters long.";
            } else if (!/[A-Z]/.test(formData.password)) {
                newErrors.password = "Password must contain at least one uppercase letter.";
            } else if (!/[0-9]/.test(formData.password)) {
                newErrors.password = "Password must contain at least one number.";
            }
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required.";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        // Terms validation
        if (!formData.termsAccepted) {
            newErrors.termsAccepted = "You must accept the terms and conditions.";
        }

        setErrors(newErrors);
        // Return true if there are no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isPasswordValid = validate();

        if (!otpVerified) {
            setErrors(prev => ({
                ...prev,
                email: "Please verify your email first"
            }));
            return;
        }

        // Define isValid based on your validation logic
        const isValid = validate(formData); // Assuming validate is a function that checks for errors

        if (!isValid) {
            return; // Stop if there are any validation errors
        }

        try {
            // Transform the form data to match backend expectations
            const registrationData = {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                brand_name: formData.brandName,
                name: formData.ownerName,
                telephone: formData.telephone,
                address: formData.address,
                business_type: formData.businessType,
                gst_no: formData.businessCode,
                mobile: formData.telephone
            };

            // Only proceed with API call if password validation passes
            if (isPasswordValid) {
            // First register the user
            const response = await authService.register(registrationData);
            console.log("Registration successful:", response);

            // Store the JWT token
            if (response.token) {
                localStorage.setItem('token', response.token);
            }

            // If profile image exists, upload it
            if (profileImage) {
                try {
                    // Convert base64 to blob
                    const base64Response = await fetch(profileImage);
                    const blob = await base64Response.blob();

                    // Create file from blob
                    const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });

                    // Upload the profile image
                    await authService.uploadProfileImage(file);
                    console.log("Profile image uploaded successfully");
                } catch (imageError) {
                    console.error("Error uploading profile image:", imageError);
                }
            }

            // Redirect to Dashboard instead of login
            navigate("/Dashboard");
            }
        } catch (error) {
            console.error("Registration error:", error);

            // Handle specific error cases
            let errorMessage = error.message || "Registration failed. Please try again.";
            let fieldErrors = {};

            // Check for specific error messages from the backend
            const errorMsg = errorMessage.toLowerCase();
            console.log("Backend error message:", errorMsg); // Debug log

            // Handle multiple validation errors
            if (errorMsg.includes("username already taken")) {
                fieldErrors.username = "Username already taken";
            }
            if (errorMsg.includes("email already exists")) {
                fieldErrors.email = "Email already exists";
            }
            if (errorMsg.includes("business code (gstin) already exists")) {
                fieldErrors.businessCode = "Business Code (GSTIN) already exists";
            }
            // Also catch MongoDB duplicate key errors for business code
            if (errorMsg.includes("duplicate key error") && errorMsg.includes("v_business_code")) {
                fieldErrors.businessCode = "Business Code (GSTIN) already exists";
            }
            if (errorMsg.includes("telephone") ||
                errorMsg.includes("mobile") ||
                errorMsg.includes("phone") ||
                errorMsg.includes("contact")) {
                fieldErrors.telephone = "Telephone no is already exists";
            }

            // If no specific field errors were found, show a general error
            if (Object.keys(fieldErrors).length === 0) {
                fieldErrors.general = errorMessage;
            }

            // Set the errors
            setErrors(prevErrors => ({
                ...prevErrors,
                ...fieldErrors
            }));
        }
    };

    return (
        <div className="container-fluid reg-fluid vh-100 vw-100 m-0 p-0">
            <div className="container-fluid reg-back-fluid m-0 h-100 w-100">

                <div className="card h-100 reg-card w-100">
                    <form onSubmit={handleSubmit} noValidate>

                        <div className="sticky-top d-flex justify-content-center align-items-center py-3 register-top-bar">
                            <div className="rgn-title text-center">Registration</div>
                        </div>

                        <div className="card-body">

                            <div className="row my-5 gy-4 py-4 position-relative rounded-2 reg-row">

                                <div className="reg-row-head position-absolute w-auto px-2 py-1">Business Profile / Logo</div>

                                <div className="col-12">

                                    <div className="profile-circle">

                                        <label htmlFor="file-upload" className="add-logo-icon">
                                            {profileImage ? (
                                                <img id="profile-image" src={profileImage} alt="Profile" className="profile-img" />
                                            ) : (
                                                <span className="add-icon f-28">+</span>
                                            )}
                                        </label>

                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="file-input"
                                            accept="image/png, image/jpeg"
                                            onChange={handleFileChange}
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="row my-5 gy-4 py-4 position-relative rounded-2 reg-row">

                                <div className="reg-row-head position-absolute w-auto px-2 py-1">Business info</div>

                                {[
                                    { label: "Brand Name", name: "brandName", type: "text" },
                                    { label: "Owner Name", name: "ownerName", type: "text" },
                                    { label: "Telephone", name: "telephone", type: "tel", icon: phoneIcon },
                                    { label: "Email", name: "email", type: "email" },
                                    { label: "Address", name: "address", type: "text" },
                                    { label: "Business Code ( GSTIN )", name: "businessCode", type: "text" },
                                ].map((input) => (
                                    <InputField
                                        key={input.name}
                                        label={input.label}
                                        name={input.name}
                                        type={input.type}
                                        value={formData[input.name]}
                                        onChange={handleChange}
                                        error={errors[input.name]}
                                        prefix={input.icon ? <img src={input.icon} alt={`${input.name} icon`} width="28" height="28" className="mx-auto" /> : input.prefix}
                                    />
                                ))}

                                {/* Add OTP verification UI */}
                                {formData.email && !otpVerified && (
                                    <>
                                        <div className="col-xl-4 d-flex gap-2 align-items-center justify-content-center mt-2 flex-column">

                                            {otpSent && (
                                                <>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="1000000"
                                                        className={`form-control`}
                                                        placeholder="Enter OTP"
                                                        name="otp"
                                                        value={formData.otp}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.otp && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.otp}
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            <div className="row p-0 m-0 w-100 d-flex gap-2 align-items-center justify-content-center mt-2">
                                                <button
                                                    type="button"
                                                    className="col-sm-5 col-md-auto btn brand-btn px-4 snd-otp-btn b-rd-8"
                                                    onClick={handleSendOTP}
                                                    disabled={isTimerRunning || !formData.email}
                                                >
                                                    {isTimerRunning ? `Resend OTP in ${timer}s` : 'Send OTP'}
                                                </button>
                                                {otpSent && (

                                                    <button
                                                        type="button"
                                                        className="col-sm-5 col-md-3 btn brand-btn px-4 vrfy-otp-btn b-rd-8"
                                                        onClick={handleVerifyOTP}
                                                        disabled={!formData.otp}
                                                    >
                                                        Verify OTP
                                                    </button>
                                                )}

                                            </div>

                                        </div>
                                        {otpVerified && (
                                            <div className="text-success mt-2">
                                                Email verified successfully!
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="col-xl-6">

                                    <label className="form-label">Business Type</label>

                                    <select
                                        className="form-select"
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        {[
                                            "Freelancer",
                                            "Small business",
                                            "Consultant",
                                            "Contractor",
                                            "Ecommerce seller",
                                            "Eervice provider",
                                            "Nonprofit",
                                            "Event planner",
                                            "Creative professional",
                                            "Health wellness",
                                            "It professional",
                                            "Real-estate agent",
                                            "Marketing consultant",
                                            "Virtual assistant",
                                            "Craftsman artisan",
                                            "Subscription service",
                                            "Event vendor",
                                            "Other",
                                        ].map((type) => (
                                            <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                                        ))}

                                    </select>

                                    {errors.businessType && (
                                        <div className="invalid-feedback d-flex align-items-center gap-1 f-14 my-3">
                                            <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
                                            <div>{errors.businessType}</div>
                                        </div>
                                    )}

                                </div>

                            </div>

                            <div className="row mt-5 gy-4 py-4 position-relative rounded-2 reg-row">

                                <div className="reg-row-head position-absolute w-auto px-2 py-1">Business Account</div>

                                <InputField
                                    label="Username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    error={errors.username}
                                    prefix={<img src={userIcon} alt="Username icon" height="28" width="28" />}
                                />

                                <div className="col-xl-4">

                                    <label className="form-label">Password</label>

                                    <div className="passiconwrap d-flex p-0 m-0 position-relative">
                                        <span className="input-group-text">
                                            <img src={lockIcon} alt="Lock icon" width="28" height="28" className="mx-auto" />
                                        </span>
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            className="form-control form-control-pass"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <img
                                            role="button"
                                            aria-label="Toggle password visibility"
                                            onClick={togglePasswordVisibility}
                                            src={passwordVisible ? eyeOpenIcon : eyeCloseIcon}
                                            alt="Password visibility icon"
                                            className="password-visibility-icons position-absolute top-50 translate-middle"
                                            height="28"
                                            width="28"
                                        />
                                    </div>

                                    {errors.password && (
                                        <div className="invalid-feedback d-flex align-items-center gap-1 f-14 my-3">
                                            <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
                                            <div>{errors.password}</div>
                                        </div>
                                    )}

                                </div>

                                <div className="col-xl-4">

                                    <label className="form-label">Confirm Password</label>

                                    <div className="passiconwrap d-flex p-0 m-0 position-relative">
                                        <span className="input-group-text">
                                            <img src={lockIcon} alt="Lock icon" width="28" height="28" className="mx-auto" />
                                        </span>
                                        <input
                                            type={confirmPasswordVisible ? "text" : "password"}
                                            className="form-control"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                        <img
                                            role="button"
                                            aria-label="Toggle password visibility"
                                            onClick={toggleConfirmPasswordVisibility}
                                            src={confirmPasswordVisible ? eyeOpenIcon : eyeCloseIcon}
                                            alt="Password visibility icon"
                                            className="password-visibility-icons position-absolute top-50 translate-middle"
                                            height="28"
                                            width="28"
                                        />
                                    </div>

                                    {errors.confirmPassword && (
                                        <div className="invalid-feedback d-flex align-items-center gap-1 f-14 my-3">
                                            <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
                                            <div>{errors.confirmPassword}</div>
                                        </div>
                                    )}

                                </div>

                            </div>

                            <div className="form-check mb-1 d-flex align-items-center py-3 gap-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="termsCheck"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="termsCheck">
                                    Agree with terms & conditions
                                </label>
                            </div>

                            {errors.termsAccepted && (
                                <div className="invalid-feedback d-flex align-items-center gap-1 f-14 mt-2 mb-3">
                                    <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
                                    <div>{errors.termsAccepted}</div>
                                </div>
                            )}

                        </div>

                        <div className="card-footer row m-0 d-flex align-items-center justify-content-between py-3 gy-2 px-5 reg-foot-row">
                            <button type="submit" className="btn brand-btn d-block px-5 f-18 col-md-5 col-lg-4 col-xl-3 col-xxl-2" aria-label="Register">Register</button>
                            <div className="text-center col-md-5 col-lg-4 col-xl-3 col-xxl-3">
                                <p className="m-0">
                                    Already have an account? <br />
                                    <Link to="/Login" className="brand-link text-center" aria-label="Login">Login</Link>
                                </p>
                            </div>
                        </div>

                    </form>
                </div>

                <a onClick={handleNavigateButtonClick} type="button" aria-label="Go back" className="btn brand-btn position-absolute bottom-0 end-0 m-3 navigation-button w-auto">
                    <img src={previousArrow} alt="Previous page arrow" height="38" width="38" />
                </a>

            </div>
        </div>
    );
};

export default Registration;