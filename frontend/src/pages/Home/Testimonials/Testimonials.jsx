import React from "react";
import "./Testimonials.css";
import usmaniImage from "../../../assets/Graphics/usmani.svg";
import urakhiImage from "../../../assets/Graphics/urakhi.svg";
import usamrImage from "../../../assets/Graphics/usamr.svg";
import ussorImage from "../../../assets/Graphics/ussor.svg";

import { StarBorderIcon, StarFullIcon, StarHalfIcon, renderIcon } from "../../../Components/icons/iconProvider.jsx";

// const StarFull = StarFullIcon;
// const StarHalf = StarHalfIcon;
// const StarBorder = StarBorderIcon;

const testimonialsData = [
    {
        img: usmaniImage,
        text: "Quick-Invoice has transformed the way I manage my billing. The customizable templates allow me to present my brand professionally, and the automated reminders ensure I never miss a payment. It's a game-changer for my business.",
        name: "Manish Yadav",
        role: "Freelance Project Manager",
        rating: [StarFullIcon, StarFullIcon, StarFullIcon, StarHalfIcon, StarBorderIcon]
    },
    {
        img: ussorImage,
        text: "As a database admin, I deal with complex data, but Quick-Invoice simplifies invoicing. The integration with my workflow is seamless, and the support team is fantastic. Highly recommend!",
        name: "Sorathiya Viral",
        role: "Freelance Database Admin",
        rating: [StarFullIcon, StarFullIcon, StarFullIcon, StarFullIcon, StarHalfIcon]
    },
    {
        img: usamrImage,
        text: "The user-friendly interface and quick setup made it easy to start invoicing immediately. Quick-Invoice has boosted my productivity and client satisfaction.",
        name: "Aamir Ameen",
        role: "Freelance Frontend Developer",
        rating: [StarFullIcon, StarFullIcon, StarFullIcon, StarFullIcon, StarBorderIcon]
    },
    {
        img: urakhiImage,
        text: "Reliable and efficient, Quick-Invoice handles all my backend invoicing needs. The automation features save me hours each week.",
        name: "Akhilesh Yadav",
        role: "Freelance Backend Developer",
        rating: [StarFullIcon, StarFullIcon, StarFullIcon, StarHalfIcon, StarBorderIcon]
    }
];

const Testimonials = () => {
    return (
        <div className="container-fluid tstmnl-container m-0 py-3 px-0">
            <h2 className="tstmnl-head text-center py-4">What Our Users Are Saying</h2>

            <div id="tstmnlCrousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="4000">
                <div className="carousel-indicators">
                    {testimonialsData.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            data-bs-target="#tstmnlCrousel"
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                            aria-current={index === 0 ? "true" : "false"}
                            aria-label={`Slide ${index + 1}`}
                        ></button>
                    ))}
                </div>

                <div className="carousel-inner">
                    {testimonialsData.map((testimonial, index) => (
                        <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                            <div className="tstmnl-card rounded-3 position-relative pt-5 mx-auto">
                                <div className="position-absolute top-0 start-50 translate-middle">
                                    <img src={testimonial.img} alt="User" className="rounded-circle tstmnl-img" />
                                </div>

                                <div className="text-center pt-5 px-4 p-md-5">
                                    <p className="tstmnl-text f-18 pb-2 pb-md-5">
                                        {testimonial.text}
                                    </p>
                                </div>

                                <div className="user-info px-3 py-3">
                                    <div className="user-name d-flex flex-column">
                                        <h5 className="mb-0 f-16 brand-link">{testimonial.name}</h5>
                                        <p className="mb-0 f-15">{testimonial.role}</p>
                                    </div>
                                </div>

                                <div className="user-rate px-4 py-4">
                                    <div className="d-flex gap-2">
                                        {testimonial.rating.map((star, i) => (
                                            <span key={i}>{renderIcon(star, 38, "var(--brand-primary)")}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="carousel-control-prev" type="button" data-bs-target="#tstmnlCrousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#tstmnlCrousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
};

export default Testimonials;