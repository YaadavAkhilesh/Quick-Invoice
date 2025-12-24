import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import { PersonIcon, EmailIcon, PasswordIcon, renderIcon, CheckCircleIcon, ErrorIcon } from "../../Components/icons/iconProvider";
import "./frgpass.css";

const InputField = React.memo(({
    type,
    name,
    value,
    onChange,
    icon,
    showPasswordToggler = false,
    toggleVisibility,
    fieldPasswordVisible,
    placeholder,
    className = "",
    hasBeenTouched = false,
    error = ""
}) => (
    <div className="my-3 input-group">
        <span className="input-group-text frgtpass-input-group-text">
            {renderIcon(icon)}
        </span>
        <input
            type={type}
            className={`form-control frgtpass-form-control ${className}`}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required
            aria-invalid={!!error}
        />
        {showPasswordToggler && (
            <button
                type="button"
                className="input-group-text btn btn-pass-visibility input-group-text-right"
                onClick={toggleVisibility}
                aria-label={fieldPasswordVisible ? "Hide password" : "Show password"}
            >
                {fieldPasswordVisible ? "Hide" : "Show"}
            </button>
        )}
    </div>
));

const OTPInput = React.memo(({ value, onChange, error, hasBeenTouched }) => (
    <input
        type="number"
        min="0"
        max="1000000"
        className={`form-control ${error && hasBeenTouched ? 'is-invalid' : ''}`}
        placeholder="Enter One-time Password"
        name="otp"
        value={value}
        onChange={onChange}
        aria-invalid={error && hasBeenTouched}
    />
));

const ErrorMessage = ({ message, hasBeenTouched }) => (
    // If `hasBeenTouched` is undefined, treat it as true so general messages show.
    message && (hasBeenTouched === undefined || hasBeenTouched) ? (
        <div className="invalid-feedback d-block d-flex align-items-center gap-1 mb-3">
            <div>{message}</div>
        </div>
    ) : null
);

const SuccessMessage = () => (
    <div className="valid-feedback d-block d-flex align-items-center gap-2 text-success f-14 mt-2">
        {renderIcon(CheckCircleIcon, 20, 'var(--brand-success)')}
        <span className="f-16">Email verified successfully!</span>
    </div>
);

const FrgPass = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        otp: ""
    });
    const [touchedFields, setTouchedFields] = useState({
        username: false,
        email: false,
        mobile: false,
        password: false,
        confirmPassword: false,
        otp: false
    });
    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [timer, setTimer] = useState(30);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Timer effect
    useEffect(() => {
        let interval;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0) {
            setIsTimerRunning(false);
            setTimer(30);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    const showPasswordFields = otpVerified;

    // Validation functions
    const validateMobile = (value) => {
        if (!value) return "Mobile number is required.";
        if (value.length !== 10) return "Mobile number must be 10 digits";
        return "";
    };

    const validateEmail = (value) => {
        if (!value) return "Email is required.";
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
            return "Please enter a valid email address";
        }
        return "";
    };

    const validatePassword = (value) => {
        if (!value) return "Password is required.";
        if (value.length < 8) return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter.";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number.";
        if (!/[!@#$%^&*]/.test(value)) return "Password must contain at least one special character (!@#$%^&*).";
        if (value.length > 16) return "Password must not exceed 16 characters";
        return "";
    };

    const validateConfirmPassword = (value, password) => {
        if (!value) return "Please confirm your password.";
        if (value !== password) return "Password does not match.";
        return "";
    };

    // Memoized validation results - ONLY show errors for touched fields
    const fieldErrors = useMemo(() => ({
        username: touchedFields.username && !formData.username ? "Username is required." : "",
        email: touchedFields.email ? validateEmail(formData.email) : "",
        mobile: touchedFields.mobile ? validateMobile(formData.mobile) : "",
        password: touchedFields.password && showPasswordFields ? validatePassword(formData.password) : "",
        confirmPassword: touchedFields.confirmPassword && showPasswordFields ? validateConfirmPassword(formData.confirmPassword, formData.password) : "",
        otp: touchedFields.otp ? errors.otp || "" : ""
    }), [formData, touchedFields, showPasswordFields, errors.otp]);

    // Mark field as touched
    const markFieldTouched = useCallback((fieldName) => {
        setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    }, []);

    // Optimized change handler with touch tracking
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        let processedValue = value;

        // Mark field as touched on first change
        markFieldTouched(name);

        setErrors(prev => ({ ...prev, general: null }));

        // Mobile validation - force numeric and limit to 10 digits
        if (name === 'mobile') {
            processedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
        }
        // Email validation and OTP reset
        else if (name === 'email') {
            if (otpVerified) {
                setOtpVerified(false);
                setOtpSent(false);
                setFormData(prev => ({ ...prev, otp: '' }));
                setTouchedFields(prev => ({ ...prev, otp: false }));
            }
        }

        // Always set the processed value (allow empty string)
        setFormData(prev => ({ ...prev, [name]: processedValue }));
    }, [otpVerified, markFieldTouched]);

    const handleSendOTP = useCallback(async () => {
        markFieldTouched('email');

        const emailError = validateEmail(formData.email);
        if (emailError) {
            setTouchedFields(prev => ({ ...prev, email: true }));
            setErrors(prev => ({ ...prev, email: emailError }));
            return;
        }

        setErrors(prev => ({ ...prev, email: null, otp: null }));

        try {
            await authService.sendEmailOTP(formData.email);
            setOtpSent(true);
            setIsTimerRunning(true);
        } catch (error) {
            setOtpSent(false);
            setIsTimerRunning(false);
            setErrors(prev => ({
                ...prev,
                email: (error && error.message) || "Failed to send OTP!"
            }));
        }
    }, [formData.email, markFieldTouched]);

    const handleVerifyOTP = useCallback(async () => {
        markFieldTouched('otp');

        if (!formData.otp) {
            setErrors(prev => ({ ...prev, otp: 'Please enter the OTP.' }));
            return;
        }

        try {
            await authService.verifyEmailOTP(formData.email, formData.otp);
            setOtpVerified(true);
            setErrors(prev => ({ ...prev, otp: null }));
            setTouchedFields(prev => ({ ...prev, otp: true }));
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                otp: (error && error.message) || "Invalid OTP!"
            }));
        }
    }, [formData.email, formData.otp, markFieldTouched]);

    const checkAccountExists = useCallback(async (username, email, mobile) => {
        try {
            const response = await authService.checkAccount({ username, email, mobile });
            return response.exists;
        } catch (error) {
            console.error('Error checking account:', error);
            return false;
        }
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        // Mark all fields as touched on submit
        Object.keys(formData).forEach(field => markFieldTouched(field));

        setIsLoading(true);

        // Validate username and email synchronously
        if (!formData.username) {
            setErrors(prev => ({ ...prev, general: 'Please enter your username.' }));
            setIsLoading(false);
            return;
        }

        const emailErr = validateEmail(formData.email);
        if (emailErr) {
            setErrors(prev => ({ ...prev, general: 'Please enter a valid email address.' }));
            setIsLoading(false);
            return;
        }

        if (!otpVerified) {
            setErrors(prev => ({ ...prev, general: 'Please verify your email first.' }));
            setIsLoading(false);
            return;
        }

        const accountExists = await checkAccountExists(formData.username, formData.email, formData.mobile);
        if (accountExists) {
            setErrors(prev => ({ ...prev, general: null }));
        } else {
            setErrors(prev => ({ ...prev, general: 'Account not found with these details.' }));
        }
        setIsLoading(false);
    }, [formData.username, formData.email, formData.mobile, otpVerified, fieldErrors.email, checkAccountExists, markFieldTouched]);

    const handlePasswordReset = useCallback(async (e) => {
        e.preventDefault();
        markFieldTouched('password');
        markFieldTouched('confirmPassword');

        setIsLoading(true);

        if (!formData.password || !formData.confirmPassword || fieldErrors.password || fieldErrors.confirmPassword) {
            setErrors(prev => ({ ...prev, general: 'Please enter valid passwords.' }));
            setIsLoading(false);
            return;
        }

        try {
            await authService.resetPassword(formData);
            navigate('/login');
        } catch (error) {
            setErrors(prev => ({ ...prev, general: error.message || 'Failed to reset password' }));
        } finally {
            setIsLoading(false);
        }
    }, [formData, fieldErrors.password, fieldErrors.confirmPassword, navigate, markFieldTouched]);

    const togglePasswordVisibility = useCallback(() => {
        setPasswordVisible(prev => !prev);
    }, []);

    const toggleConfirmPasswordVisibility = useCallback(() => {
        setConfirmPasswordVisible(prev => !prev);
    }, []);

    return (
        <div className="container-fluid lg-fluid p-0 m-0 vh-100 vw-100">
            <div className="container-fluid lg-back-fluid d-flex justify-content-between align-items-center p-0 m-0 h-100 w-100">
                <div className="lgn-left-container h-100"></div>
                <div className="lgn-right-container h-100">
                    <div className="card p-0 m-0 lg-card">
                        <form
                            onSubmit={showPasswordFields ? handlePasswordReset : handleSubmit}
                            noValidate
                        >
                            <div className="card-header py-3">
                                <div className="f-30 fw-medium text-center frgtpass-title">Forgot Password</div>
                            </div>
                            <div className="card-body py-3">
                                <InputField
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    icon={PersonIcon}
                                    placeholder="Username"
                                    hasBeenTouched={touchedFields.username}
                                    error={fieldErrors.username}
                                    className={fieldErrors.username ? 'is-invalid' : ''}
                                />
                                <ErrorMessage message={fieldErrors.username} hasBeenTouched={touchedFields.username} />

                                <InputField
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon={EmailIcon}
                                    placeholder="Email"
                                    hasBeenTouched={touchedFields.email}
                                    error={fieldErrors.email}
                                    className={fieldErrors.email ? 'is-invalid' : ''}
                                />
                                <ErrorMessage message={fieldErrors.email} hasBeenTouched={touchedFields.email} />

                                {formData.email && !otpVerified && (
                                    <>
                                        <div className="my-3 justify-content-center">
                                            {otpSent && (
                                                <>
                                                    <OTPInput
                                                        value={formData.otp}
                                                        onChange={handleChange}
                                                        error={fieldErrors.otp}
                                                        hasBeenTouched={touchedFields.otp}
                                                    />
                                                    <ErrorMessage message={fieldErrors.otp} hasBeenTouched={touchedFields.otp} />
                                                </>
                                            )}
                                            <div className="row p-0 m-0 d-flex align-items-center justify-content-center gap-2 my-3">
                                                <button
                                                    type="button"
                                                    className="col-sm-5 col-md-auto btn brand-btn px-4 snd-otp-btn b-rd-8"
                                                    onClick={handleSendOTP}
                                                    disabled={isTimerRunning || !formData.email || !!fieldErrors.email}
                                                >
                                                    {isTimerRunning ? `Resend OTP in ${timer}s` : 'Send OTP'}
                                                </button>
                                                {otpSent && (
                                                    <button
                                                        type="button"
                                                        className="col-sm-5 col-md-3 btn brand-btn px-4 vrfy-otp-btn b-rd-8"
                                                        onClick={handleVerifyOTP}
                                                        disabled={!formData.otp || isLoading}
                                                    >
                                                        Verify OTP
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {otpVerified && <SuccessMessage />}

                                {showPasswordFields && (
                                    <>
                                        <InputField
                                            type={passwordVisible ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            icon={PasswordIcon}
                                            showPasswordToggler={true}
                                            toggleVisibility={togglePasswordVisibility}
                                            fieldPasswordVisible={passwordVisible}
                                            placeholder="New Password"
                                            hasBeenTouched={touchedFields.password}
                                            error={fieldErrors.password}
                                            className={fieldErrors.password ? 'is-invalid' : ''}
                                        />
                                        <ErrorMessage message={fieldErrors.password} hasBeenTouched={touchedFields.password} />

                                        <InputField
                                            type={confirmPasswordVisible ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            icon={PasswordIcon}
                                            showPasswordToggler={true}
                                            toggleVisibility={toggleConfirmPasswordVisibility}
                                            fieldPasswordVisible={confirmPasswordVisible}
                                            placeholder="Confirm Password"
                                            hasBeenTouched={touchedFields.confirmPassword}
                                            error={fieldErrors.confirmPassword}
                                            className={fieldErrors.confirmPassword ? 'is-invalid' : ''}
                                        />
                                        <ErrorMessage message={fieldErrors.confirmPassword} hasBeenTouched={touchedFields.confirmPassword} />
                                    </>
                                )}

                                <ErrorMessage message={errors.general} />
                            </div>
                            <div className="card-footer row m-0 d-flex align-items-center justify-content-around py-3 gy-2 px-2">
                                <button
                                    type="submit"
                                    className="btn brand-btn d-block f-18 col-4"
                                    disabled={isLoading}
                                    aria-label="Submit"
                                >
                                    {isLoading ? 'Processing...' : 'Submit'}
                                </button>
                                <div className="text-center register-section col-7">
                                    <p className="m-0">
                                        Remembered your password?
                                        <Link to="/Login" className="brand-link text-center px-2" aria-label="Login">
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <a
                    onClick={() => navigate("/")}
                    type="button"
                    aria-label="Go back"
                    className="btn brand-btn position-absolute bottom-0 end-0 m-3 px-3"
                >
                    Home
                </a>
            </div>
        </div>
    );
};

export default React.memo(FrgPass);
