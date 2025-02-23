import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/SVGs/brand.svg";
import paygtyLogo from "../../assets/SVGs/Razorpay.svg"
import previousArrow from "../../assets/SVGs/arwcrl.svg";
import "./Pricing.css";


const Pricing = () => {

    const navigate = useNavigate();
    const handleNavigateButtonClick = () => {
        navigate("/");
    };

    return (

        <div className="container-fluid vh-100 vw-100 p-0 prc-fluid">
            <div className="d-flex justify-content-center align-items-center h-100 w-100 p-0 m-0 prc-back-fluid">

                <div className="card prc-card">

                    <div className="card-header d-flex align-items-center justify-content-between">
                        <img src={Logo} className="brand-logo" alt="Brand Logo" />
                        <div className="prc-card-head-txt f-16">Term & Condition Apply *</div>
                        <a onClick={handleNavigateButtonClick} type="button" aria-label="Go back" className="btn brand-btn navigation-button">
                            <img src={previousArrow} alt="Previous page arrow" className="d-block mx-auto" height="28" width="28" />
                        </a>
                    </div>

                    <div className="card-body p-0 m-0">
                        <table className="table table-bordered prc-tbl m-0">
                            <thead>
                                <tr>
                                    <th>Features</th>
                                    <th>Free Plan</th>
                                    <th>Advanced Premium Plan</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Price</td>
                                    <td>Free</td>
                                    <td>$15 / year</td>
                                </tr>
                                <tr>
                                    <td>Number of Invoice Templates</td>
                                    <td>3</td>
                                    <td>Unlimited</td>
                                </tr>
                                <tr>
                                    <td>Customization Options</td>
                                    <td>Limited customization available</td>
                                    <td>Extensive customization capabilities</td>
                                </tr>
                                <tr>
                                    <td>Invoice Sharing</td>
                                    <td>✓</td>
                                    <td>✓</td>
                                </tr>
                                <tr>
                                    <td>Customer Support</td>
                                    <td>Community support via forums</td>
                                    <td>Priority support with dedicated account manager</td>
                                </tr>
                                <tr>
                                    <td>Analytics & Reporting</td>
                                    <td>Basic analytics features</td>
                                    <td>Comprehensive analytics with custom reporting options</td>
                                </tr>
                                <tr>
                                    <td>Access to New Invoice Templates</td>
                                    <td>No access</td>
                                    <td>✓</td>
                                </tr>
                                <tr>
                                    <td>Access to Specialized Templates</td>
                                    <td>No access</td>
                                    <td>✓</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <Link to="/Registration" type="button" className="btn brand-btn px-4" aria-label="Get Started" style={{ backgroundColor: 'var(--brand-success)', border: 'none', color: 'var(--brand-primary-dark)' }} >Get Started</Link>
                                    </td>
                                    <td>
                                        <button className="btn brand-btn px-4" style={{ backgroundColor: 'var(--brand-warning)', border: 'none', color: 'var(--brand-primary-dark)' }}>Advanced</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="card-footer d-flex align-items-center justify-content-between">
                        <div className="prc-card-head-txt f-16">Your Privacy Matters to Us</div>
                        <img src={paygtyLogo} alt="Secure Payment" height="22" width="auto" />
                    </div>

                </div>

            </div>
        </div>

    );
};

export default Pricing;