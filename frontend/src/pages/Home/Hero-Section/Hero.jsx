import React from "react";
import HeroVideo from "../../../assets/Graphics/Brand_Hero.mp4";
import "./Hero.css";


const Hero = () => {
    return (
        <section className="container-fluid hero-container p-0">

            <div className="container-fluid hero-container-1 d-flex justify-content-around align-items-center text-center p-0">

                <div className="hero-text">
                    
                    <h2>
                        Elevate your product sales with
                        <br />
                        <span className="brand-stress">Quick Invoice</span>
                    </h2>
                    
                    <p className="hero-text-1 f-25 py-2">
                        Professional invoices tailored for your business
                    </p>
                    
                    <p className="hero-text-2 f-20">
Join the growing community of vendors who rely on Quick Invoice to simplify every step of their sales process. Our intuitive templates and automated customer‑detail capture let you focus on what matters most—selling your products—while we handle the paperwork. Experience faster invoicing, fewer errors, and a professional edge that keeps your business moving forward.
                    </p>
                
                </div>

            </div>


            <div className="container-fluid hero-container-2 p-0">
                <div className="container-fluid video-container d-flex justify-content-center align-items-center p-0">
                    <video autoPlay muted loop className="hero-video" aria-label="Product showcase video" playsInline>
                        <source src={HeroVideo} type="video/mp4" />
                        Your browser does not support the video tag
                    </video>
                </div>
            </div>
        
        </section>
    );
};

export default Hero;
