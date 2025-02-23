import React from "react";
import HeroVideo from "../../../assets/Graphics/video1.mp4";
import "./Hero.css";


const Hero = () => {
    console.log("Hero Component rendered");
    return (
        <section className="container-fluid hero-container p-0">

            <div className="container-fluid hero-container-1 d-flex justify-content-around align-items-center text-center p-0">

                <div className="hero-text">
                    
                    <h2>
                        Elevate your product sales with
                        <br />
                        <span className="brand-stress">Quick invoicing</span>
                    </h2>
                    
                    <p className="hero-text-1 f-24 py-2">
                        Professional invoices tailored for your business
                    </p>
                    
                    <p className="hero-text-2 f-18">
                        Join countless vendors who trust Quick Invoice to streamline their
                        sales process with easy-to-use templates and automated customer
                        details, you can focus on what you do best selling your products
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
