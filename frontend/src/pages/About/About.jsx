/**
 * About Page Component
 *
 * Displays company information including mission, vision, clients, team, and technologies.
 * Optimized for performance with React.memo and reusable components.
 */

import React, { memo } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from '../../Components/Header/Header';
import goalsImage from "../../assets/Graphics/Electronic-invoice.svg";
import ceoImage from "../../assets/Graphics/mission.svg";
import amzLogo from "../../assets/SVGs/amazon.svg";
import msftLogo from "../../assets/SVGs/microsoft.svg";
import mshLogo from "../../assets/PNGs/meesho.png";
import usmaniImage from "../../assets/Graphics/usmani.svg";
import urakhiImage from "../../assets/Graphics/urakhi.svg";
import usamrImage from "../../assets/Graphics/usamr.svg";
import ussorImage from "../../assets/Graphics/ussor.svg";
import rctLogo from "../../assets/SVGs/react.svg";
import rctpdfLogo from "../../assets/PNGs/reactPDF.png";
import bsLogo from "../../assets/SVGs/BS.svg";
import mngLogo from "../../assets/SVGs/mongo.svg";
import ndLogo from "../../assets/SVGs/node.svg";
import './About.css';

// Data arrays for dynamic content
const clientLogos = [msftLogo, amzLogo, mshLogo];
const techLogos = [rctLogo, rctpdfLogo, mngLogo, bsLogo, ndLogo];

const teamMembers = [
    {
        name: 'Yadav Manish',
        role: 'Project Manager',
        email: 'manishyadav@gmail.com',
        image: usmaniImage
    },
    {
        name: 'Yadav Akhilesh',
        role: 'Backend Developer',
        email: 'akhiyadav@gmail.com',
        image: urakhiImage
    },
    {
        name: 'Patel Aamir',
        role: 'Full-Stack Developer',
        email: 'aamirsafi@gmail.com',
        image: usamrImage
    },
    {
        name: 'Sorathiya',
        role: 'Database Administrator , Designer',
        email: 'sorathiya@gmail.com',
        image: ussorImage
    }
];

// Reusable section component for mission/vision
const Section = ({ image, title, text, caption, reverse = false }) => (
    <div className={`container-fluid ${reverse ? 'abt-scnd-section' : 'abt-frst-section'} py-5`}>
        <div className="row justify-content-around align-items-center gy-5 py-5 px-lg-4">
            {!reverse && (
                <div className="col-auto p-0">
                    <div className="d-inline-block">
                        <img src={image} alt={title} className="abt-sections-img" />
                    </div>
                </div>
            )}
            <div className="col-xl-7 col-lg-8 col-md-10 col-11 p-0 f-20">
                <div className="f-40 abt-sections-head py-2">{title}</div>
                <p className="abt-sections-txt">{text}</p>
                <span className="abt-sections-cap">{caption}</span>
            </div>
            {reverse && (
                <div className="col-auto p-0">
                    <div className="d-inline-block">
                        <img src={image} alt={title} className="abt-sections-img" />
                    </div>
                </div>
            )}
        </div>
    </div>
);

const About = () => {

    const navigate = useNavigate();
    const handleNavigateButtonClick = () => {
        navigate("/");
    };

    const handleNavigateHome = () => {
        navigate("/");
    }

    return (
        <div className="about-main">
            <Navbar onNavigate={handleNavigateButtonClick} onNavigateBrandLogo={handleNavigateHome} />
            <Section
                image={goalsImage}
                title="Our mission"
                text="At Quick Invoice , our mission is to empower businesses by providing a comprehensive platform that simplifies the invoicing process. We enable users to create, manage, and customize invoices effortlessly. With features that allow you to share and email invoices directly, save them for future use, and download them in various formats. Our premium templates allow for easy customization, helping you maintain a professional appearance while saving you time and effort."
                caption="－ Team , Quick Invoice"
            />
            <Section
                image={ceoImage}
                title="Our Vision"
                text="We envision a world where businesses can manage their invoicing effortlessly, allowing them to focus on growth and innovation. Our goal is to be the leading platform that transforms the invoicing landscape, making it accessible, efficient, and user-friendly for everyone involved. We aim to empower users with the tools they need to create, customize, and manage invoices seamlessly, fostering a more organized and productive financial environment."
                caption="－ CEO , Quick Invoice"
                reverse={true}
            />
            <ThirdSection />
            <FourthSection />
            <FifthSection />
        </div>
    );
};

// Clients section component
const ThirdSection = () => (
    <div className="container-fluid abt-thrd-section">
        <div className="text-center f-40 abt-sections-head py-5">Our Esteemed Clients</div>
        <div className="row justify-content-center align-items-center gap-5 py-5">
            {clientLogos.map((clientLogo, index) => (
                <div className="col-auto p-0 abt-thrd-section-col" key={index}>
                    <img src={clientLogo} className="abt-thrd-section-img" alt={`Client ${index + 1}`} height="96" width="96" />
                </div>
            ))}
        </div>
    </div>
);

// Team section component
const FourthSection = () => (
    <div className="container-fluid abt-frth-section py-5">
        <div className="text-center f-40 abt-sections-head">Meet Our Team</div>
        <div className="row justify-content-center align-items-center py-5 px-2 gy-5">
            {teamMembers.map(member => (
                <div className="col-xl-3 col-md-6" key={member.name}>
                    <div className="p-2">
                        <img src={member.image} alt={member.name} className="d-block abt-frth-section-img mx-auto" />
                    </div>
                    <h1 className="abt-frth-section-nm text-center py-2 f-24">{member.name}</h1>
                    <div className="abt-frth-section-field text-center f-20">{member.role}</div>
                    <div className="abt-frth-section-fieldmlgt text-center f-18">{member.email}</div>
                </div>
            ))}
        </div>
    </div>
);

// Technologies section component
const FifthSection = () => (
    <div className="container-fluid abt-thrd-section py-5">
        <h1 className="text-center py-3 mb-5 abt-sections-head f-40">Technologies Behind Our System</h1>
        <div className="row justify-content-center align-items-center gap-5 py-4">
            {techLogos.map((techLogo, index) => (
                <div className="col-auto p-0 abt-thrd-section-col" key={index}>
                    <img src={techLogo} alt={`Technology ${index + 1}`} height="110" width="125" />
                </div>
            ))}
        </div>
    </div>
);

export default memo(About);
