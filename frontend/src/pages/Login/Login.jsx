import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { PersonIcon, PasswordIcon, ErrorIcon, renderIcon } from '../../Components/icons/iconProvider';

import { authService } from "../../services/api";
import "./Login.css";

const InputField = ({ type, name, value, onChange, icon, placeholder }) => (

    <div className="my-3 form-input">
        <span className="input-group-text w-auto">
            {renderIcon(icon, 48, "var(--brand-secondary-dark-2)")}
            {/* <img src={icon} alt={`${name} icon`} height="48" width="48" className="mx-auto" /> */}
        </span>
        <input
            type={type}
            className="form-control passwd-frm-inpt f-18"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required
        />
    </div>

);

const Login = () => {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const handleNavigateButtonClick = () => {
        navigate("/");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Clear field-specific error only when user types in that field
        const newErrors = {};
        if (name === 'username' && !value) {
            newErrors.username = "Username is required.";
        }
        if (name === 'password' && !value) {
            newErrors.password = "Password is required.";
        }
        setErrors(prev => ({
            ...prev,
            [name]: newErrors[name],
            // Do NOT clear general error on every keystroke
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = "Username is required.";
        if (!formData.password) newErrors.password = "Password is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('[Login] Form submit initiated');
        
        if (!validate()) {
            console.log('[Login] Validation failed, aborting');
            return;
        }

        setIsLoading(true);
        console.log('[Login] Attempting login for user:', formData.username);

        try {
            const response = await authService.login(formData.username, formData.password);
            console.log('[Login] Login response:', response);
            
            if (response.token) {
                console.log('[Login] Token received, storing and navigating');
                localStorage.setItem('token', response.token);
                setErrors({});
                navigate("/");
            } else {
                console.log('[Login] No token in response');
                setErrors(prev => ({
                    ...prev,
                    general: 'Login failed: No token received'
                }));
            }
        } catch (error) {
            console.error("[Login] Login error caught:", error);
            const message = (error && (error.message || error.msg || error.error)) ||
                (typeof error === 'string' ? error : 'Invalid credentials');
            console.log('[Login] Setting error message:', message);
            setErrors(prev => ({
                ...prev,
                general: message
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className="container-fluid lg-fluid p-0 m-0 vh-100 vw-100">
            <div className="container-fluid lg-back-fluid d-flex justify-content-between align-items-center p-0 m-0 h-100 w-100">

                <div className="lgn-left-container h-100"></div>

                <div className="lgn-right-container h-100">

                    <div className="card p-0 m-0 lg-card">
                        <form onSubmit={handleSubmit} noValidate>

                            <div className="card-header py-4">
                                <div className="lg-title text-center">Login</div>
                            </div>

                            <div className="card-body py-2">

                                <InputField
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    error={errors.username}
                                    icon={PersonIcon}
                                    placeholder="Enter your username"
                                />

                                {errors.username && (
                                    <div className="invalid-feedback d-block d-flex align-items-center gap-1 mb-3">
                                        <ErrorIcon sx={{ color: 'var(--brand-error)', fontSize: 24 }} alt="Error icon" className="error-icon me-1" />
                                        <div className="f-15">{errors.username}</div>
                                    </div>
                                )}

                                <div className="my-3 input-group">
                                    <span className="input-group-text w-auto">
                                        {renderIcon(PasswordIcon, 48, "var(--brand-secondary-dark-2)")}
                                    </span>
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        className={`form-control f-18 passwd-frm-inpt ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        ref={inputRef}
                                        placeholder="Enter your password"
                                        required
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
                                    <div className="invalid-feedback d-block d-flex align-items-center gap-1 mb-3">
                                        <ErrorIcon sx={{ color: 'var(--brand-error)', fontSize: 24 }} alt="Error icon" className="error-icon me-1" />
                                        <div className="f-15">{errors.password}</div>
                                    </div>
                                )}

                                {errors.general && (
                                    <div className="invalid-feedback d-block d-flex align-items-center gap-1 mb-3">
                                        <ErrorIcon sx={{ color: 'var(--brand-error)', fontSize: 24 }} alt="Error icon" className="error-icon me-1" />
                                        <div className="f-15">{errors.general}</div>
                                    </div>
                                )}

                                <div className="d-flex align-items-center justify-content-end p-2 mt-3">
                                    <Link to="/FrgPass" className="text-decoration-none text-center" aria-label="Forgot password">Forgot Password ?</Link>
                                </div>

                            </div>

                            <div className="card-footer row m-0 d-flex align-items-center justify-content-around py-3 gy-2">
                                <button type="submit" className="btn brand-btn d-block px-5 f-18 col-sm-6 col-auto" aria-label="Login" disabled={isLoading}>
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </button>
                                <div className="text-center register-section col-sm-6 col-12">
                                    <p className="m-0">
                                        Not have an account? <br />
                                        <Link to="/Registration" className="brand-link text-center" aria-label="Register">Register</Link>
                                    </p>
                                </div>
                            </div>

                        </form>
                    </div>

                </div>

                <a onClick={handleNavigateButtonClick} type="button" aria-label="Go back" className="btn brand-btn position-absolute bottom-0 end-0 m-3 px-3">
                    Home
                </a>


            </div>
        </div>
    );
};

export default Login;