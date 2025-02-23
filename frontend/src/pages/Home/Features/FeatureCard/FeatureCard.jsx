import React from "react";
import "./FeatureCard.css";

const FeatureCard = ({ src, title, description }) => {
    return (
        <div className="col-12 col-lg-5 col-md-6 col-xl-4">
            <div className="feature-card text-center rounded-2 px-3">

                <img src={src} alt={title} className="feature-card-img mb-4" />

                <div className="feature-card-title f-20 mb-3">{title}</div>

                <p className="feature-card-description f-16">{description}</p>

            </div>
        </div>

    );
};

export default FeatureCard;
