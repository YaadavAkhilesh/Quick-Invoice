import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Navbar from '../../Components/Header/Header';
import feavai from "../../assets/SVGs/check_available.svg";
import feunavail from "../../assets/SVGs/check_unavailable.svg";
import warningIcon from "../../assets/SVGs/warning.svg";
// import { createSubscriptionOrder, verifyPayment } from '../../services/subscriptionService';
import "./Pricing.css";

const FEATURES = [
    { label: "Basic Features", free: true, premium: true },
    { label: "Customer Support", free: true, premium: true },
    { label: "Custom Templates", free: false, premium: true },
    { label: "Specialized Templates", free: false, premium: true }
];

const PlanCard = ({ planName, price, features, cta, highlight, ctaType }) => (
    <div
        className={`prc-plan-card ${highlight ? 'highlighted' : ''}`}
        style={{
            backgroundColor: highlight ? 'var(--brand-warning-low)' : 'var(--brand-success-low)'
        }}
    >
        {highlight && <div className="badge-popular">Popular</div>}
        <div className="prc-plan-title">
            {planName}
        </div>
        <div className="prc-plan-price">{price}</div>
        <div className="prc-features-list">
            {features.map(({ label, available }) => (
                <div className="prc-feature-row" key={label}>
                    <img
                        src={available ? feavai : feunavail}
                        alt={available ? "✓" : "✗"}
                        className="feature-availability-icon"
                    />
                    <span className="prc-feature-label">{label}</span>
                </div>
            ))}
        </div>
        <div className="mt-3">
            {ctaType === "link" ? (
                <Link to={cta.href} className="btn btn-success w-100 fw-semibold rounded-5">{cta.text}</Link>
            ) : (
                <button className="btn btn-warning w-100 fw-semibold rounded-5" onClick={cta.onClick}>{cta.text}</button>
            )}
        </div>
    </div>
);

const Pricing = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAdminKeyModal, setShowAdminKeyModal] = useState(false);
    const [adminKeyInput, setAdminKeyInput] = useState('');
    const [adminKeyError, setAdminKeyError] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage(null);
            setMessageType('');
        }, 3000);
    };

    // const loadRazorpay = () => {
    //     return new Promise((resolve) => {
    //         const script = document.createElement('script');
    //         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    //         script.onload = () => resolve(true);
    //         script.onerror = () => resolve(false);
    //         document.body.appendChild(script);
    //     });
    // };

    const handleSubscription = async () => {
        if (!isAuthenticated) {
            showMessage('Please login to subscribe to the premium plan!', 'error');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        // Directly show admin key modal and skip Razorpay entirely
        setShowAdminKeyModal(true);
    };


    const handleAdminKeySubmit = async () => {
        setAdminKeyError('');
        if (!adminKeyInput.trim()) {
            setAdminKeyError('Admin Subscription Key is required');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/subscription/activate-with-admin-key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ adminKey: adminKeyInput.trim() })
            });

            const data = await response.json();

            if (!response.ok) {
                setAdminKeyError(data.message || 'Invalid Admin Subscription Key');
                return;
            }

            showMessage(data.message || 'Subscription activated successfully!', 'success');
            setShowAdminKeyModal(false);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setAdminKeyError(err.message || 'Activation failed');
        }
    };

    return (
        <>
            <Navbar />
            <div className="prc-cards-wrapper">
                <PlanCard
                    planName="Free"
                    price="$0 / year"
                    features={FEATURES.map(f => ({ label: f.label, available: f.free }))}
                    cta={{ href: "/Registration", text: "Get Started" }}
                    highlight={false}
                    ctaType="link"
                />
                <PlanCard
                    planName="Premium"
                    price="$15 / year"
                    features={FEATURES.map(f => ({ label: f.label, available: f.premium }))}
                    cta={{ onClick: handleSubscription, text: "Buy Now" }}
                    highlight={true}
                    ctaType="button"
                />
            </div>

            {message && (
                <div className={`alert alert-${messageType} position-fixed bottom-0 end-0 m-3`} role="alert" style={{ zIndex: 1055 }}>
                    {message}
                </div>
            )}

            {showAdminKeyModal && (
                <div
                    className="modal fade show"
                    id="adminKeyModal"
                    tabIndex={-1}
                    aria-labelledby="adminKeyModalLabel"
                    aria-modal="true"
                    role="dialog"
                >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-danger" id="adminKeyModalLabel"><img src={warningIcon} alt="⚠️" height="34" width="34" className="m-0 p-0 ms-0 me-2"/>Payment Gateway Unavailable</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => setShowAdminKeyModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>We are currently unable to connect to Razorpay gateway due to technical issues. We apologize for the inconvenience.</p>
                                <p>Please enter the <strong>Admin Subscription Key</strong> below to activate your plan :</p>
                                <input
                                    type="password"
                                    className={`form-control ${adminKeyError ? 'is-invalid' : ''}`}
                                    placeholder="Enter Admin Subscription Key"
                                    value={adminKeyInput}
                                    onChange={e => setAdminKeyInput(e.target.value)}
                                    autoFocus
                                />
                                {adminKeyError && <div className="invalid-feedback">{adminKeyError}</div>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-warning" onClick={() => setShowAdminKeyModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-success" onClick={handleAdminKeySubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default Pricing;
