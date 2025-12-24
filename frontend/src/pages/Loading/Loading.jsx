import React, { useEffect, useState } from 'react';
import brndlg from "../../assets/SVGs/brand.svg";
import './Loading.css'; // Import the CSS file

const Loading = ({ onLoadingComplete }) => {
    const [loadingPercentage, setLoadingPercentage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingPercentage(prev => {
                if (prev < 100) {
                    return prev + 1; // Increment the loading percentage
                } else {
                    clearInterval(interval);
                    document.body.classList.remove('loading'); // Show the body
                    setTimeout(() => onLoadingComplete(), 0); // Call the callback when loading is complete
                    return prev; // Return 100% if already complete
                }
            });
        }, 15); // Adjust the speed of loading here

        return () => clearInterval(interval); // Cleanup on unmount
    }, [onLoadingComplete]);

    return (
        <div className="loading-page">
            <div className="counter">
                <img src={brndlg} alt="Welcome to Quick Invoice .."  height="256" width="256"/>
                <p className="f-30">Loading ...</p>
                {/* <div className="f-28">{loadingPercentage}%</div> */}
                <hr style={{ width: `${loadingPercentage}%`, backgroundColor: 'var(--brand-primary)', border: 'none', height: '8px', borderRadius: '2px' }} />
            </div>
        </div>
    );
};

export default Loading;