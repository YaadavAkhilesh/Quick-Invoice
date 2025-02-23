// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import userIcon from "../../assets/SVGs/usrnm.svg";
// import lockIcon from "../../assets/SVGs/passlock.svg";
// import eyeCloseIcon from "../../assets/SVGs/eyeclose.svg";
// import eyeOpenIcon from "../../assets/SVGs/eyeopen.svg";
// import erricon from "../../assets/SVGs/error.svg";
// import "./Registration.css";

// const Registration = () => {
//     const [formData, setFormData] = useState({
//         brandName: "",
//         ownerName: "",
//         telephone: "",
//         email: "",
//         address: "",
//         businessType: "",
//         businessCode: "",
//         username: "",
//         password: "",
//         confirmPassword: "",
//         termsAccepted: false,
//     });

//     const [errors, setErrors] = useState({});
//     const [passwordVisible, setPasswordVisible] = useState(false);
//     const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
//     const [profileImage, setProfileImage] = useState('');
//     const navigate = useNavigate();

//     const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
//     const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => setProfileImage(e.target.result);
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: type === "checkbox" ? checked : value,
//         }));
//     };

//     const validate = () => {
//         const newErrors = {};
//         if (!formData.brandName) newErrors.brandName = "Brand name is required.";
//         if (!formData.ownerName) newErrors.ownerName = "Owner name is required.";
//         if (!formData.telephone) newErrors.telephone = "Telephone is required.";
//         if (!formData.email) {
//             newErrors.email = "Email is required.";
//         } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             newErrors.email = "Email address is invalid.";
//         }
//         if (!formData.address) newErrors.address = "Address is required.";
//         if (!formData.businessType) newErrors.businessType = "Business Type is required.";
//         if (!formData.businessCode) newErrors.businessCode = "Business Code is required.";
//         if (!formData.username) newErrors.username = "Username is required.";
//         if (!formData.password) {
//             newErrors.password = "Password is required.";
//         } else if (formData.password.length < 8) {
//             newErrors.password = "Password must be at least 8 characters long.";
//         } else if (!/[A-Z]/.test(formData.password)) {
//             newErrors.password = "Password must contain at least one uppercase letter.";
//         } else if (!/[0-9]/.test(formData.password)) {
//             newErrors.password = "Password must contain at least one number.";
//         }
//         if (formData.password !== formData.confirmPassword) {
//             newErrors.confirmPassword = "Passwords do not match.";
//         }
//         if (!formData.termsAccepted) {
//             newErrors.termsAccepted = "You must accept the terms and conditions.";
//         }
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (validate()) {
//             console.log("Registration successful:", formData);
//             navigate("/success");
//         }
//     };

//     return (
//         <div className="container-fluid reg-fluid vh-100 vw-100 m-0 p-0">
//             <div className="container-fluid reg-back-fluid m-0 h-100 w-100">
//                 <div className="card h-100 reg-card w-100">
//                     <form onSubmit={handleSubmit} noValidate>
//                         <div className="sticky-top d-flex justify-content-center align-items-center py-3 register-top-bar">
//                             <div className="rgn-title text-center">Registration</div>
//                         </div>
//                         <div className="card-body">
//                             <div className="row my-5 gy-4 py-4 position-relative rounded-2 reg-row">
//                                 <div className="reg-row-head position-absolute w-auto px-2 py-1">Business Profile / Logo</div>
//                                 <div className="col-12">
//                                     <div className="profile-circle">
//                                         <label htmlFor="file-upload" className="add-logo-icon">
//                                             {profileImage ? (
//                                                 <img id="profile-image" src={profileImage} alt="Profile" className="profile-img" />
//                                             ) : (
//                                                 <span className="add-icon f-28">+</span>
//                                             )}
//                                         </label>
//                                         <input
//                                             type="file"
//                                             id="file-upload"
//                                             className="file-input"
//                                             accept="image/png, image/jpeg"
//                                             onChange={handleFileChange}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="row my-5 gy-4 py-4 position-relative rounded-2 reg-row">
//                                 <div className="reg-row-head position-absolute w-auto px-2 py-1">Business info</div>
//                                 {[
//                                     { label: "Brand Name", name: "brandName", type: "text" },
//                                     { label: "Owner Name", name: "ownerName", type: "text" },
//                                     { label: "Telephone", name: "telephone", type: "tel", prefix: "+91" },
//                                     { label: "Email", name: "email", type: "email" },
//                                     { label: "Address", name: "address", type: "text" },
//                                     { label: "Business Code", name: "businessCode", type: "text" },
//                                 ].map((input, index) => (
//                                     <div className="col-xl-4" key={index}>
//                                         <label className="form-label">{input.label}</label>
//                                         {input.prefix ? (
//                                             <div className="input-group">
//                                                 <div className="input-group-text">
//                                                     <div className="mx-auto">
//                                                         {input.prefix}
//                                                     </div>
//                                                 </div>
//                                                 <input
//                                                     type={input.type}
//                                                     className="form-control"
//                                                     placeholder=""
//                                                     name={input.name}
//                                                     value={formData[input.name]}
//                                                     onChange={handleChange}
//                                                 />
//                                             </div>
//                                         ) : (
//                                             <input
//                                                 type={input.type}
//                                                 className="form-control"
//                                                 placeholder=""
//                                                 name={input.name}
//                                                 value={formData[input.name]}
//                                                 onChange={handleChange}
//                                             />
//                                         )}
//                                         {errors[input.name] && (
//                                             <div className="invalid-feedback d-flex align-items-center gap-1 f-14 my-3">
//                                                 <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
//                                                 <div>{errors[input.name]}</div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}

//                                 <div className="col-xl-6">
//                                     <label className="form-label">Business Type</label>
//                                     <select
//                                         className="form-select"
//                                         name="businessType"
//                                         value={formData.businessType}
//                                         onChange={handleChange}
//                                     >
//                                         <option value="">Select</option>
//                                         {[
//                                             "freelancer",
//                                             "small_business",
//                                             "consultant",
//                                             "contractor",
//                                             "ecommerce_seller",
//                                             "service_provider",
//                                             "nonprofit",
//                                             "event_planner",
//                                             "creative_professional",
//                                             "health_wellness",
//                                             "it_professional",
//                                             "real_estate_agent",
//                                             "marketing_consultant",
//                                             "virtual_assistant",
//                                             "craftsman_artisan",
//                                             "subscription_service",
//                                             "event_vendor",
//                                             "other",
//                                         ].map((type) => (
//                                             <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
//                                         ))}
//                                     </select>
//                                     {errors.businessType && (
//                                         <div className="invalid-feedback d-flex align-items-center gap-1 f-14 my-3">
//                                             <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
//                                             <div>{errors.businessType}</div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="row mt-5 gy-4 py-4 position-relative rounded-2 reg-row">
//                                 <div className="reg-row-head position-absolute w-auto px-2 py-1">Business Account</div>
//                                 <div className="col-xl-4">
//                                     <label className="form-label">Username</label>
//                                     <div className="input-group">
//                                         <span className="input-group-text">
//                                             <img src={userIcon} alt="Username icon" height="28" width="28" className="mx-auto" />
//                                         </span>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             placeholder=""
//                                             name="username"
//                                             value={formData.username}
//                                             onChange={handleChange}
//                                         />
//                                     </div>

//                                     {errors.username && (
//                                         <div className="invalid-feedback d-flex align-items-center gap-1 f-14 my-3">
//                                             <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
//                                             <div>{errors.username}</div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="col-xl-4">
//                                     <label className="form-label">Password</label>
//                                     <div className="passiconwrap d-flex p-0 m-0 position-relative">
//                                         <span className="input-group-text">
//                                             <img src={lockIcon} alt="Lock icon" width="28" height="28" className="mx-auto" />
//                                         </span>
//                                         <input
//                                             type={passwordVisible ? "text" : "password"}
//                                             className="form-control form-control-pass"
//                                             placeholder=""
//                                             name="password"
//                                             value={formData.password}
//                                             onChange={handleChange}
//                                         />
//                                         <img
//                                             role="button"
//                                             aria-label="Toggle password visibility"
//                                             onClick={togglePasswordVisibility}
//                                             src={passwordVisible ? eyeOpenIcon : eyeCloseIcon}
//                                             alt="Password visibility icon"
//                                             className="password-visibility-icons position-absolute top-50 translate-middle"
//                                             height="28"
//                                             width="28"
//                                         />
//                                     </div>
//                                     {errors.password && (
//                                         <div className="invalid-feedback d-flex align-items-center gap-1 f-14 my-3">
//                                             <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
//                                             <div>{errors.password}</div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="col-xl-4">
//                                     <label className="form-label">Confirm Password</label>
//                                     <div className="passiconwrap d-flex p-0 m-0 position-relative">
//                                         <span className="input-group-text">
//                                             <img src={lockIcon} alt="Lock icon" width="28" height="28" className="mx-auto" />
//                                         </span>
//                                         <input
//                                             type={confirmPasswordVisible ? "text" : "password"}
//                                             className="form-control"
//                                             placeholder=""
//                                             name="confirmPassword"
//                                             value={formData.confirmPassword}
//                                             onChange={handleChange}
//                                         />
//                                         <img
//                                             role="button"
//                                             aria-label="Toggle password visibility"
//                                             onClick={toggleConfirmPasswordVisibility}
//                                             src={confirmPasswordVisible ? eyeOpenIcon : eyeCloseIcon}
//                                             alt="Password visibility icon"
//                                             className="password-visibility-icons position-absolute top-50 translate-middle"
//                                             height="28"
//                                             width="28"
//                                         />
//                                     </div>
//                                     {errors.confirmPassword && (
//                                         <div className="invalid-feedback d-flex align-items-center gap-1 f-14 my-3">
//                                             <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
//                                             <div>{errors.confirmPassword}</div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="form-check mb-4 d-flex align-items-center py-3 gap-2">
//                                 <input
//                                     type="checkbox"
//                                     className="form-check-input"
//                                     id="termsCheck"
//                                     name="termsAccepted"
//                                     checked={formData.termsAccepted}
//                                     onChange={handleChange}
//                                 />
//                                 <label className="form-check-label" htmlFor="termsCheck">
//                                     Agree with terms & conditions
//                                 </label>
//                             </div>
//                             {errors.termsAccepted && (
//                                 <div className="invalid-feedback d-flex align-items-center gap-1 f-14 my-3">
//                                     <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
//                                     <div>{errors.termsAccepted}</div>
//                                 </div>
//                             )}
//                         </div>
//                         <div className="card-footer row m-0 d-flex align-items-center justify-content-between py-3 gy-2 px-5 reg-foot-row">
//                             <button type="submit" className="btn brand-btn d-block px-5 f-18 col-md-5 col-lg-4 col-xl-3 col-xxl-2" aria-label="Register">Register</button>
//                             <div className="text-center col-md-5 col-lg-4 col-xl-3 col-xxl-3">
//                                 <p className="m-0">
//                                     Already have an account? <br />
//                                     <Link to="/Login" className="brand-link text-center" aria-label="Login">Login</Link>
//                                 </p>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Registration;