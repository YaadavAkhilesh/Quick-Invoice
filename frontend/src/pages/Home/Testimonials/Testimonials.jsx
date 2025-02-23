import React from "react";
import "./Testimonials.css";
import usrrw from "../../../assets/SVGs/usrprf.svg";
import usrrw1 from "../../../assets/SVGs/usrprf1.svg";
import usrrw2 from "../../../assets/SVGs/usrprf2.svg";
import usrrw3 from "../../../assets/SVGs/usrprf3.svg";
import strfill from "../../../assets/SVGs/star-fill.svg";
import strhlf from "../../../assets/SVGs/star-half.svg";
import strblnk from "../../../assets/SVGs/star.svg";

const Testimonials = () => {
    return (
        <div className="container-fluid tstmnl-container m-0 py-5 px-0">

            <h2 className="tstmnl-head text-center py-4">What Our Users Are Saying</h2>

            <div id="tstmnlCrousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="8000">

                <div className="carousel-inner">

                    <div className="carousel-item active">
                        <div className="tstmnl-card rounded-3 position-relative pt-5 mx-auto">

                            <div className="position-absolute top-0 start-50 translate-middle">
                                <img src={usrrw} alt="User" className="rounded-circle shadow tstmnl-img" />
                            </div>

                            <div className="text-center pt-5 px-4 p-md-5">
                                <p className="tstmnl-text f-18 pb-2 pb-md-5">
                                    Quick-Invoice has transformed the way I manage my billing. The customizable templates allow me to present my brand professionally, and the automated reminders ensure I never miss a payment. It's a game-changer for my business.
                                </p>
                            </div>

                            <div className="user-info px-3 py-3">
                                <div className="user-name d-flex flex-column">
                                    <h5 className="mb-0 f-16">Manish Yadav</h5>
                                    <p className="mb-0 f-15">Freelance Project Manager</p>
                                </div>
                            </div>

                            <div className="user-rate px-4 py-4">
                                <div className="d-flex gap-2">
                                    <img src={strfill} height="24px" width="24px" />
                                    <img src={strfill} height="24px" width="24px" />
                                    <img src={strfill} height="24px" width="24px" />
                                    <img src={strhlf} height="24px" width="24px" />
                                    <img src={strblnk} height="24px" width="24px" />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="carousel-item">
                        <div className="tstmnl-card rounded-3 position-relative pt-5 mx-auto">

                            <div className="position-absolute top-0 start-50 translate-middle">
                                <img src={usrrw2} alt="User" className="rounded-circle shadow tstmnl-img" />
                            </div>

                            <div className="text-center pt-5 px-4 p-md-5">
                                <p className="tstmnl-text f-18 pb-2 pb-md-5">
                                    Quick-Invoice has transformed the way I manage my billing. The customizable templates allow me to present my brand professionally, and the automated reminders ensure I never miss a payment. It's a game-changer for my business.
                                </p>
                            </div>

                            <div className="user-info px-3 py-3">
                                <div className="user-name d-flex flex-column">
                                    <h5 className="mb-0 f-16">Sorathiya Viral</h5>
                                    <p className="mb-0 f-15">Freelance Database Admin</p>
                                </div>
                            </div>

                            <div className="user-rate px-4 py-4">
                                <div className="d-flex gap-2">
                                    <img src={strfill} height="24px" width="24px" />
                                    <img src={strfill} height="24px" width="24px" />
                                    <img src={strfill} height="24px" width="24px" />
                                    <img src={strhlf} height="24px" width="24px" />
                                    <img src={strblnk} height="24px" width="24px" />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="carousel-item">
                        <div className="tstmnl-card rounded-3 position-relative pt-5 mx-auto">

                            <div className="position-absolute top-0 start-50 translate-middle">
                                <img src={usrrw3} alt="User" className="rounded-circle shadow tstmnl-img" />
                            </div>

                            <div className="text-center pt-5 px-4 p-md-5">
                                <p className="tstmnl-text f-18 pb-2 pb-md-5">
                                    Quick-Invoice has transformed the way I manage my billing. The customizable templates allow me to present my brand professionally, and the automated reminders ensure I never miss a payment. It's a game-changer for my business.
                                </p>
                            </div>

                            <div className="user-info px-3 py-3">
                                <div className="user-name d-flex flex-column">
                                    <h5 className="mb-0 f-16">Aamir Ameen</h5>
                                    <p className="mb-0 f-15">Freelance Frontend Developer</p>
                                </div>
                            </div>

                            <div className="user-rate px-4 py-4">
                                <div className="d-flex gap-2">
                                    <img src={strfill} height="24px" width="24px" />
                                    <img src={strfill} height="24px" width="24px" />
                                    <img src={strfill} height="24px" width="24px" />
                                    <img src={strhlf} height="24px" width="24px" />
                                    <img src={strblnk} height="24px" width="24px" />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="carousel-item">
                        <div className="tstmnl-card rounded-3 position-relative pt-5 mx-auto">

                            <div className="position-absolute top-0 start-50 translate-middle">
                                <img src={usrrw1} alt="User" className="rounded-circle shadow tstmnl-img" />
                            </div>

                            <div className="text-center pt-5 px-4 p-md-5">
                                <p className="tstmnl-text f-18 pb-2 pb-md-5">
                                    Quick-Invoice has transformed the way I manage my billing. The customizable templates allow me to present my brand professionally, and the automated reminders ensure I never miss a payment. It's a game-changer for my business.
                                </p>
                            </div>

                            <div className="user-info px-3 py-3">
                                <div className="user-name d-flex flex-column">
                                    <h5 className="mb-0 f-16">Akhilesh Yadav</h5>
                                    <p className="mb-0 f-15">Freelance Backend Developer</p>
                                </div>
                            </div>

                            <div className="user-rate px-4 py-4">
                                <div className="d-flex gap-2">
                                    <img src={strfill} height="24px" width="24px" />
                                    <img src={strfill} height="24px" width="24px" />
                                    <img src={strfill} height="24px" width="24px" />
                                    <img src={strhlf} height="24px" width="24px" />
                                    <img src={strblnk} height="24px" width="24px" />
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Testimonials;
