import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from '../../Components/Header/Header';
import api, { profileService } from "../../services/api";
import './connect.css';

const Connect = () => {
    const [vendorId, setVendorId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const checkUserLoggedIn = async () => {
            const profileData = await profileService.getProfile();
            if (!profileData || !profileData.vendor) {
                navigate("/login"); // Redirect to login if not logged in
            } else {
                setVendorId(profileData.vendor.v_id); // Set vendor ID
            }
        };

        checkUserLoggedIn();
    }, [navigate]);

    const handleNavigateButtonClick = () => {
        navigate("/");
    };

    const handleNavigateHome = () => {
        navigate("/");
    };

    return (
        <div className="about-main">
            <Navbar onNavigate={handleNavigateButtonClick} onNavigateBrandLogo={handleNavigateHome} />
            <SecondSection vendorId={vendorId} />
        </div>
    );
};

const SecondSection = ({ vendorId }) => {
    const [subject, setSubject] = useState('');
    const [problem, setProblem] = useState('');
    const [rating, setRating] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!subject || !problem || !rating || !contactInfo || !message) {
            setError("Please fill out all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/connect/connect-us", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    subject,
                    problem,
                    rating: parseInt(rating),
                    contactInfo,
                    message,
                    vendorId // Include vendor ID in the request
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Error submitting feedback");
                return;
            }

            setSuccess(data.message);
            setSubject('');
            setProblem('');
            setRating('');
            setContactInfo('');
            setMessage('');

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (err) {
            console.error("Error:", err);
            setError("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="container-fluid vh-100 vw-100 p-0 connect-fluid">
            <div className="row p-0 m-0 h-100 w-100 d-flex justify-content-center align-items-center gap-0 connect-fluid-row connect-fluid-form">
                <form onSubmit={handleSubmit} className="row p-4 b-rd-8 form connect-form col-lg-10 col-11">
                    <div className="mb-4 text-center brand-link f-34">
                        We value your feedback and here to assist you ..
                    </div>

                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    {success && <div className="alert alert-success" role="alert">{success}</div>}

                    <div className="col-6 mb-3">
                        <label htmlFor="subject" className="form-label">Subject</label>
                        <input type="text" id="subject" className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject of your message..." required />
                    </div>

                    <div className="col-6 mb-3">
                        <label htmlFor="contactInfo" className="form-label">Reach Out to Us</label>
                        <input
                            type="text"
                            id="contactInfo"
                            className="form-control"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            placeholder="Your email or phone number..."
                            required
                        />
                    </div>

                    <div className="col-12 mb-3">
                        <label htmlFor="problem" className="form-label">Description</label>
                        <textarea
                            id="problem"
                            className="form-control"
                            rows="3"
                            value={problem}
                            onChange={(e) => setProblem(e.target.value)}
                            placeholder="Describe your subject..."
                            required
                        />
                    </div>

                    <div className="col-12 mb-3">
                        <label htmlFor="rating" className="form-label">Rate Our Services</label>
                        <select
                            id="rating"
                            className="form-select"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            required
                        >
                            <option value="">Select a rating</option>
                            <option value="1">✦</option>
                            <option value="2">✦✦</option>
                            <option value="3">✦✦✦</option>
                            <option value="4">✦✦✦✦</option>
                            <option value="5">✦✦✦✦✦</option>
                        </select>
                    </div>


                    <div className="col-12 mb-3">
                        <label htmlFor="message" className="form-label">Your Message</label>
                        <textarea
                            id="message"
                            className="form-control"
                            rows="4"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            required
                        />
                    </div>

                    <div className="col-12">
                        <button
                            type="submit"
                            className="btn brand-btn px-4 f-20 b-rd-8"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Connect;