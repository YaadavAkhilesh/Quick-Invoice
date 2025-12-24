import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    UserIconStyled,
    BusinessIcon,
    PersonIcon,
    PhoneIcon,
    EmailIcon,
    LocationIcon,
    CheckCircleIcon,
    PasswordIcon,
    ArrowLeftIcon,
    renderSize,
    renderIcon,
} from "../../Components/icons/iconProvider";
import "./Registration.css";
import { authService } from "../../services/api";

const validateField = (name, value, password) => {
    switch (name) {
        case "username":
            if (!value) return "Username is required";
            if (value.length < 6 || value.length > 10)
                return "Username must be between 6 and 10 characters";
            if (!/^[a-zA-Z0-9_]+$/.test(value))
                return "Username can only contain letters, numbers, and underscore";
            return null;
        case "password":
            if (!value) return "Password is required";
            if (
                !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                    value
                )
            )
                return "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";
            if (value.length > 16) return "Password must not exceed 16 characters";
            return null;
        case "confirmPassword":
            if (!value) return "Please confirm your password";
            if (value !== password) return "Password does not match";
            return null;
        case "email":
            if (!value) return "Email is required";
            if (
                !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
            ) return "Invalid email format";
            return null;
        case "brandName":
            if (!value) return "Brand name is required";
            if (!/^[a-zA-Z\s.]+$/.test(value))
                return "Brand name can only contain letters, spaces, and dots";
            return null;
        case "ownerName":
            if (!value) return "Owner name is required";
            if (!/^[a-zA-Z\s]+$/.test(value))
                return "Owner name can only contain letters and spaces";
            return null;
        case "telephone":
            if (!value) return "Telephone is required";
            if (!/^\d{10}$/.test(value)) return "Telephone must be 10 digits";
            return null;
        case "businessCode":
            if (!value) return "Business code is required";
            if (!/^[0-9A-Z]{15}$/.test(value))
                return "Business code must be exactly 15 characters (numbers and uppercase letters only)";
            return null;
        case "address":
            if (!value) return "Address is required";
            return null;
        case "businessType":
            if (!value) return "Business type is required";
            return null;
        default:
            return null;
    }
};

const InputWithIcon = ({ icon, label, name, type, value, onChange, error }) => (
    <div className="col-12 mb-3">
        <label className="form-label fw-semibold" htmlFor={name}>
            {label}
        </label>
        <div className={`input-group ${error ? "is-invalid" : ""}`}>
            <span className="input-group-text bg-light">{icon}</span>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className={`form-control ${error ? "is-invalid" : ""}`}
                maxLength={type === "tel" ? 10 : undefined}
                onKeyPress={(e) => {
                    if (type === "tel" && !/[0-9]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
                aria-describedby={error ? `${name}-error` : undefined}
                aria-invalid={!!error}
            />
        </div>
        {error && (
            <div id={`${name}-error`} className="invalid-feedback d-flex align-items-center gap-1 mt-1">
                {/* <ErrorIcon sx={{color:'var(--brand-danger)',fontSize:24}} alt="Error icon"/> */}
                <span>{error}</span>
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
        otp: "",
    });

    const [profileImage, setProfileImage] = useState(() => {
        // Load base64 from localStorage on mount for persistence
        return localStorage.getItem("profileImage") || "";
    });

    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [timer, setTimer] = useState(30);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [emailChanged, setEmailChanged] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        } else if (timer === 0) {
            setIsTimerRunning(false);
            setTimer(30);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    // Update localStorage whenever profileImage changes
    useEffect(() => {
        if (profileImage) {
            localStorage.setItem("profileImage", profileImage);
        } else {
            localStorage.removeItem("profileImage");
        }
    }, [profileImage]);

    const handleBrndRdrct = () => {
        navigate("/");
    }

    const togglePasswordVisibility = () => setPasswordVisible((v) => !v);
    const toggleConfirmPasswordVisibility = () =>
        setConfirmPasswordVisible((v) => !v);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (!validTypes.includes(file.type)) {
                setErrors((prev) => ({ ...prev, profileImage: "Only JPG, JPEG or PNG allowed" }));
                event.target.value = "";
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, profileImage: "Max file size is 5MB" }));
                event.target.value = "";
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
                setErrors((prev) => ({ ...prev, profileImage: null }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "email") {
            setEmailChanged(true);
            setOtpVerified(false);
            setOtpSent(false);
            setFormData((prev) => ({ ...prev, otp: "" }));
        }

        const finalValue = name === "businessCode" ? value.toUpperCase() : value;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : finalValue,
        }));

        const error = validateField(name, finalValue, formData.password);
        setErrors((prev) => ({ ...prev, [name]: error }));

        if (name === "password") {
            const confirmError = validateField(
                "confirmPassword",
                formData.confirmPassword,
                finalValue
            );
            setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const handleSendOTP = async () => {
        if (emailChanged && formData.email) {
            setOtpSent(true);
            setIsTimerRunning(true);
            try {
                await authService.sendEmailOTP(formData.email);
                setErrors((prev) => ({ ...prev, email: null, otp: null }));
            } catch (error) {
                setErrors((prev) => ({
                    ...prev,
                    email: error.message || "Failed to send OTP",
                }));
            }
        }
    };

    const handleVerifyOTP = async () => {
        try {
            await authService.verifyEmailOTP(formData.email, formData.otp);
            setOtpVerified(true);
            setErrors((prev) => ({ ...prev, otp: null }));
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                otp: error.message || "Invalid OTP",
            }));
        }
    };

    const validateAll = () => {
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (
                [
                    "termsAccepted",
                    "otp",
                    "confirmPassword",
                    "password",
                    "username",
                    "businessType",
                    "businessCode",
                    "telephone",
                    "email",
                    "address",
                    "ownerName",
                    "brandName",
                ].includes(key)
            ) {
                const error = validateField(key, formData[key], formData.password || "");
                if (error) newErrors[key] = error;
            }
        });
        if (!formData.termsAccepted)
            newErrors.termsAccepted = "You must accept the terms and conditions.";
        if (!otpVerified) newErrors.email = "Please verify your email first";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateAll()) return;

        try {
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
                mobile: formData.telephone,
            };

            const response = await authService.register(registrationData);

            if (response.token) localStorage.setItem("token", response.token);

            if (response && profileImage) {
                try {
                    // Convert base64 image to Blob and upload
                    const base64Response = await fetch(profileImage);
                    const blob = await base64Response.blob();
                    const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
                    await authService.uploadProfileImage(file);
                } catch { }
            }

            navigate("/Dashboard");
        } catch (error) {
            const errorMsg = error.message.toLowerCase();
            const fieldErrors = {};

            if (errorMsg.includes("username already taken"))
                fieldErrors.username = "Username already taken";
            if (errorMsg.includes("email already exists"))
                fieldErrors.email = "Email already exists";
            if (errorMsg.includes("business code (gstin) already exists"))
                fieldErrors.businessCode = "Business Code already exists";

            setErrors((prev) => ({ ...prev, ...fieldErrors }));
        }
    };

    return (
        <div className="reg-container justify-content-center d-flex align-items-center flex-column">

            

            <form
                onSubmit={handleSubmit}
                noValidate
                className="reg-form p-5 w-100"
            >
                {/* <h1 className="mb-4 text-center fw-bold">Registration</h1> */}


                <div className="row g-0 reginfo-container p-0 justify-content-center align-items-stretch rounded-4">

                    <div className="col-6 reginfo-container-left">

                        {/* Business Profile Image Upload */}
                        <div className="row g-0 justify-content-between align-items-start mb-4 reginfo-container-left-header">
                            <div className="col-12 col-xxl-6 d-flex flex-column justify-content-center reginfo-container-left-header-brand">
                                <div className="f-30 fw-medium f-gray reg-form-title">Registration</div>
                                <Link to="/" className="brand-link f-18 ">
                                    {renderIcon(ArrowLeftIcon,24,'var(--brand-primary)')} Go Back
                                </Link>
                            </div>

                            <div className="col-12 col-xxl-6 d-flex flex-column reginfo-container-left-header-profile">

                                <label
                                    htmlFor="file-upload"
                                    className="profile-upload-label"
                                    style={{ cursor: "pointer" }}
                                    aria-label="Upload business profile image"
                                >
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt="Business Profile"
                                            className="rounded-circle"
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                objectFit: "cover",
                                                border: "1px solid var(--brand-secondary-outline-dark)",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="d-flex justify-content-center align-items-center rounded-circle"
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                fontSize: "3rem",
                                                fontWeight: "300",
                                                backgroundColor: "var(--brand-primary-low)",
                                                border: "var(--brand-secondary-outline) 1px solid",
                                                color: "var(--brand-primary)",
                                            }}
                                        >
                                            +
                                        </div>
                                    )}
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                                {errors.profileImage && (
                                    <div className="text-center text-danger small mt-4 d-flex justify-content-center align-items-center gap-1">
                                        <img src={erricon} alt="Error icon" width={14} height={14} />
                                        <span>{errors.profileImage}</span>
                                    </div>
                                )}
                                <label className="form-label fw-semibold mt-3" htmlFor="file-upload" style={{ textAlign: "center" }}>
                                    Profile Image
                                </label>
                                <small className="text-muted mt-1">
                                    Supported : JPG, JPEG, PNG
                                </small>
                            </div>
                        </div>
                        <InputWithIcon
                            icon={<BusinessIcon/>}
                            label="Brand Name"
                            name="brandName"
                            type="text"
                            value={formData.brandName}
                            onChange={handleChange}
                            error={errors.brandName}
                        />
                        <InputWithIcon
                            icon={<PersonIcon/>}
                            label="Owner Name"
                            name="ownerName"
                            type="text"
                            value={formData.ownerName}
                            onChange={handleChange}
                            error={errors.ownerName}
                        />
                        <InputWithIcon
                            icon={<PhoneIcon/>}
                            label="Telephone"
                            name="telephone"
                            type="tel"
                            value={formData.telephone}
                            onChange={handleChange}
                            error={errors.telephone}
                        />
                        <InputWithIcon
                            icon={<LocationIcon/>}
                            label="Address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleChange}
                            error={errors.address}
                        />
                        <InputWithIcon
                            icon={<BusinessIcon/>}
                            label="Business Code (GSTIN)"
                            name="businessCode"
                            type="text"
                            value={formData.businessCode}
                            onChange={handleChange}
                            error={errors.businessCode}
                        />

                        <div className="col-12 mb-3">
                            <label className="form-label fw-semibold" htmlFor="businessType">
                                Business Type
                            </label>
                            <select
                                id="businessType"
                                name="businessType"
                                value={formData.businessType}
                                onChange={handleChange}
                                className={`form-select ${errors.businessType ? "is-invalid" : ""}`}
                                aria-invalid={!!errors.businessType}
                                aria-describedby={errors.businessType ? "businessType-error" : undefined}
                            >
                                <option value="">Select</option>
                                {[
                                    // Professional Services (High-volume hourly billing)
                                    "Accounting & Bookkeeping",
                                    "Legal Services & Law Firms",
                                    "Management Consulting",
                                    "Tax Preparation & Advisory",
                                    "Audit & Assurance Services",

                                    // Creative & Digital Agencies (Project + retainer billing)
                                    "Digital Marketing Agency",
                                    "Advertising & Media Agency",
                                    "Web Development Agency",
                                    "Graphic Design Studio",
                                    "Content Marketing Agency",

                                    // IT & Software (Subscription + milestone billing)
                                    "Software Development",
                                    "SaaS & Cloud Services",
                                    "IT Consulting & Support",
                                    "Cybersecurity Services",
                                    "Mobile App Development",

                                    // Construction & Engineering (Milestone + progress billing)
                                    "Construction Contractor",
                                    "Civil Engineering",
                                    "Architectural Services",
                                    "Interior Design & Fitout",
                                    "Mechanical & Electrical Contractors",

                                    // Healthcare (Insurance + service billing)
                                    "Medical Practice/Clinic",
                                    "Dental Practice",
                                    "Pharmacy & Medical Supplies",
                                    "Diagnostic Services",
                                    "Veterinary Services",

                                    // Retail & E-commerce (Volume + subscription billing)
                                    "Retail Store Operations",
                                    "E-commerce Business",
                                    "Wholesale Distribution",
                                    "Franchise Operations",
                                    "POS & Inventory Management",

                                    // Professional Trades (Service call + materials billing)
                                    "Electrical Contractor",
                                    "Plumbing Services",
                                    "HVAC Services",
                                    "General Contracting",
                                    "Landscaping & Maintenance",

                                    // Hospitality (Recurring + event billing)
                                    "Restaurant & Food Services",
                                    "Hotel & Accommodation",
                                    "Event Management",
                                    "Catering Services",
                                    "Fitness & Wellness Centers",

                                    // Manufacturing (Production + inventory billing)
                                    "Manufacturing Operations",
                                    "Custom Fabrication",
                                    "Packaging & Labeling",
                                    "Industrial Supplies",
                                    "OEM Manufacturing",

                                    // Logistics & Transportation (Freight + mileage billing)
                                    "Freight Forwarding",
                                    "Courier & Delivery Services",
                                    "Warehousing & Storage",
                                    "Fleet Management",
                                    "Supply Chain Logistics",

                                    // Education & Training (Course + retainer billing)
                                    "Educational Institutions",
                                    "Corporate Training",
                                    "Online Learning Platforms",
                                    "Coaching & Tutoring",
                                    "Professional Certification",

                                    // Financial Services (Commission + fee billing)
                                    "Insurance Brokerage",
                                    "Financial Advisory",
                                    "Investment Management",
                                    "Real Estate Brokerage",
                                    "Mortgage Services"
                                ].map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            {errors.businessType && (
                                <div id="businessType-error" className="invalid-feedback mt-1">
                                    {errors.businessType}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-6 reginfo-container-right d-flex flex-column">

                        <div className="row align-items-center g-0">
                            <InputWithIcon
                                icon={<EmailIcon  />}
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                            />

                            {formData.email && !otpVerified && (
                                <div className="col-12 col-xxl-8 mb-3">
                                    {otpSent && (
                                        <>
                                            <input
                                                type="number"
                                                min="0"
                                                max="999999"
                                                className={`form-control mb-2 ${errors.otp ? "is-invalid" : ""}`}
                                                placeholder="Enter OTP"
                                                name="otp"
                                                value={formData.otp}
                                                onChange={handleChange}
                                                aria-invalid={!!errors.otp}
                                                aria-describedby={errors.otp ? "otp-error" : undefined}
                                            />
                                            {errors.otp && (
                                                <div id="otp-error" className="invalid-feedback mb-2">
                                                    {errors.otp}
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <div className="d-flex gap-2 flex-wrap">
                                        <button
                                            type="button"
                                            className="btn btn-warning flex-grow-1"
                                            onClick={handleSendOTP}
                                            disabled={isTimerRunning || !formData.email}
                                        >
                                            {isTimerRunning ? `Resend OTP in ${timer}s` : "Send OTP"}
                                        </button>
                                        {otpSent && (
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                onClick={handleVerifyOTP}
                                                disabled={!formData.otp}
                                            >
                                                Verify OTP
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {otpVerified && (
                                <div className="col-12 col-md-6 mt-2 text-success d-flex align-items-center gap-2">
                                    <CheckCircleIcon sx={{ color: 'var(--brand-success)', fontSize: 24 }} alt="Success icon" />
                                    <span>Email verified successfully !</span>
                                </div>
                            )}
                        </div>

                        {otpVerified && (
                            <div className="row mt-4 g-0">
                                <InputWithIcon
                                    icon={<UserIconStyled  />}
                                    label="Username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    error={errors.username}
                                />

                                <div className="col-12 mb-3">
                                    <label className="form-label fw-semibold" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light" aria-hidden="true">
                                            {renderIcon(PasswordIcon)}
                                        </span>
                                        <input
                                            id="password"
                                            type={passwordVisible ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                            aria-describedby={errors.password ? "password-error" : undefined}
                                            aria-invalid={!!errors.password}
                                        />
                                        <button
                                            type="button"
                                            className="input-group-text btn btn-pass-visibility input-group-text-right"
                                            onClick={togglePasswordVisibility}
                                            aria-label={passwordVisible ? "Hide password" : "Show password"}
                                        >
                                            {passwordVisible ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <div id="password-error" className="invalid-feedback d-block">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                <div className="col-12 mb-3">
                                    <label className="form-label fw-semibold" htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light" aria-hidden="true">
                                            {renderIcon(PasswordIcon)}
                                        </span>
                                        <input
                                            id="confirmPassword"
                                            type={confirmPasswordVisible ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""
                                                }`}
                                            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                                            aria-invalid={!!errors.confirmPassword}
                                        />
                                        <button
                                            type="button"
                                            className="input-group-text btn btn-pass-visibility input-group-text-right"
                                            onClick={toggleConfirmPasswordVisibility}
                                            aria-label={confirmPasswordVisible ? "Hide confirm password" : "Show confirm password"}
                                        >
                                            {confirmPasswordVisible ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <div id="confirmPassword-error" className="invalid-feedback d-block">
                                            {errors.confirmPassword}
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}

                        <div className="w-100 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="termsCheck"
                                name="termsAccepted"
                                checked={formData.termsAccepted}
                                onChange={handleChange}
                                aria-describedby={errors.termsAccepted ? "terms-error" : undefined}
                                aria-invalid={!!errors.termsAccepted}
                            />
                            <label className="form-check-label" htmlFor="termsCheck">
                                Agree with terms &amp; conditions
                            </label>
                            {errors.termsAccepted && (
                                <div id="terms-error" className="text-danger mt-1">
                                    {errors.termsAccepted}
                                </div>
                            )}
                        </div>

                        <div className="mt-auto d-flex flex-column justify-content-center align-items-end">
                            <button
                                type="submit"
                                className="btn btn-warning btn-lg px-5"
                                disabled={!formData.termsAccepted}
                            >
                                Register
                            </button>
                            <p className="text-end mt-3">
                                Already have an account?{" "}
                                <Link to="/Login" className="brand-link">
                                    Login
                                </Link>
                            </p>
                        </div>

                    </div>

                </div>

            </form>
        </div>
    );
};

export default Registration;
