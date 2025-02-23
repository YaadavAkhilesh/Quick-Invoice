import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import userIcon from "../../assets/SVGs/usrnm.svg";
import lockIcon from "../../assets/SVGs/passlock.svg";
import eyeCloseIcon from "../../assets/SVGs/eyeclose.svg";
import eyeOpenIcon from "../../assets/SVGs/eyeopen.svg";
import previousArrow from "../../assets/SVGs/arwcrl.svg";
import erricon from "../../assets/SVGs/error.svg";
import { authService } from "../../services/api";
import "./Login.css";

const InputField = ({ type, name, value, onChange, icon, placeholder }) => (
    
    <div className="my-3 form-input">
        <span className="input-group-text">
            <img src={icon} alt={`${name} icon`} height="38" width="38" className="mx-auto" />
        </span>
        <input
            type={type}
            className="form-control passwd-frm-inpt"
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
        rememberMe: false,
    });

    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

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

    const validate = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = "Username is required.";
        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter.";
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one number.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await authService.login(formData.username, formData.password);
                console.log('Login response:', response); // Debug log
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    navigate("/dashboard");
                }
            } catch (error) {
                console.error("Login error:", error);
                setErrors({
                    ...errors,
                    general: error.message || "Login failed. Please check your credentials."
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
                                    icon={userIcon}
                                    placeholder="Enter your username"
                                />
                                
                                {errors.username && (  // Error handling for username
                                    <div className="invalid-feedback d-flex align-items-center gap-1 mb-0">
                                        <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
                                        <div>{errors.username}</div>
                                    </div>
                                )}
                                
                                <div className="my-3 form-input">
                                    <span className="input-group-text">
                                        <img src={lockIcon} alt="Lock icon" width="38" height="38" className="mx-auto" />
                                    </span>
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        className="form-control passwd-frm-inpt"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        ref={inputRef}
                                        placeholder="Enter your password"
                                        required
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
                                    <div className="invalid-feedback d-flex align-items-center gap-1 mb-0">
                                        <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
                                        <div>{errors.password}</div>
                                    </div>
                                )}
                                
                                {errors.general && (
                                    <div className="invalid-feedback d-flex align-items-center gap-1 mb-0">
                                        <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
                                        <div>{errors.general}</div>
                                    </div>
                                )}
                                
                                <div className="password-management-container d-flex align-items-center justify-content-between p-2 mt-3">
                                    <div className="form-check d-flex align-items-center justify-content-center py-2 gap-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="rememberMe"
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleChange}
                                            aria-label="Remember me checkbox"
                                        />
                                        <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                                    </div>
                                    <Link to="/FrgPass" className="text-decoration-none text-center" aria-label="Forgot password">Forgot Password ?</Link>
                                </div>
                            
                            </div>
                            
                            <div className="card-footer row m-0 d-flex align-items-center justify-content-around py-3 gy-2">
                                <button type="submit" className="btn brand-btn d-block px-5 f-18 col-sm-6 col-auto" aria-label="Login">Login</button>
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
                
                <a onClick={handleNavigateButtonClick} type="button" aria-label="Go back" className="btn brand-btn position-absolute bottom-0 end-0 m-3 navigation-button w-auto">
                    <img src={previousArrow} alt="Previous page arrow" height="38" width="38" />
                </a>
            
            </div>
        </div>
    );
};

export default Login;