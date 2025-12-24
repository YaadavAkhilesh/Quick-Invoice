/**
 * Feature Card Component
 *
 * Displays individual feature with icon and title.
 * Optimized with React.memo for performance.
 */

import React, { memo } from "react";
import "./FeatureCard.css";

const FeatureCard = ({ src, title }) => {
    return (
        <div className="col-sm-6 col-lg-3 col-md-4 p-2">
            <div className="feature-card text-center rounded-3 p-0 w-100 p-3">
                <img src={src} alt={title} className="feature-card-img" />
                <div className="feature-card-title f-20 pt-2">{title}</div>
                {/* <p className="feature-card-description f-18">{description}</p> */}
            </div>
        </div>
    );
};

export default memo(FeatureCard);
