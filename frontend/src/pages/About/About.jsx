import React from 'react';
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/SVGs/brand.svg";
import goalsImage from "../../assets/Graphics/Electronic-invoice.svg";
import ceoImage from "../../assets/Graphics/mission.svg";
import amzLogo from "../../assets/SVGs/amazon.svg";
import msftLogo from "../../assets/SVGs/microsoft.svg";
import mshLogo from "../../assets/SVGs/meesho.svg";
import usmaniImage from "../../assets/Graphics/usmani.svg";
import urakhiImage from "../../assets/Graphics/urakhi.svg";
import usamrImage from "../../assets/Graphics/usamr.svg";
import ussorImage from "../../assets/Graphics/ussor.svg";
import rctLogo from "../../assets/SVGs/react.svg";
import rctpdfLogo from "../../assets/PNGs/reactPDF.png";
import bsLogo from "../../assets/SVGs/BS.svg";
import mngLogo from "../../assets/SVGs/mongo.svg";
import ndLogo from "../../assets/SVGs/node.svg";
import previousArrow from "../../assets/SVGs/arwcrl.svg";
import './About.css';

const About = () => {

    const navigate = useNavigate();
    const handleNavigateButtonClick = () => {
        navigate("/");
    };

    return (
        <div className="about-main">
            <Navbar onNavigate={handleNavigateButtonClick} />
            <FirstSection />
            <SecondSection />
            <ThirdSection />
            <FourthSection />
            <FifthSection />
        </div>
    );
};

const Navbar = ({ onNavigate }) => (

    <header className="p-0 m-0">

        <nav className="navbar fixed-top px-3">
            <div className="container-fluid p-0 m-0 align-items-center justify-content-between">

                <div className="d-flex align-items-center">
                    <img src={Logo} className="brand-logo" alt="Brand Logo" />
                </div>


                <a onClick={onNavigate} type="button" aria-label="Go back" className="btn brand-btn navigation-button">
                    <img src={previousArrow} alt="Previous page arrow" className="d-block mx-auto" height="28" width="28" />
                </a>

            </div>
        </nav>

    </header>

);

const FirstSection = () => (

    <div className="container-fluid abt-frst-section py-5">
        <div className="row justify-content-around align-items-center gy-5 py-5 px-lg-4">

            <div className="col-auto p-0">
                <div className="d-inline-block">
                    <img src={goalsImage} alt="Our Mission" className="abt-sections-img" />
                </div>
            </div>

            <div className="col-xl-7 col-lg-8 col-md-10 col-11 p-0 f-18">

                <div className="p-2 f-40 abt-sections-head">Our mission</div>

                <p className="p-2 abt-sections-txt">At Quick Invoice , our mission is to empower businesses by providing a comprehensive platform that simplifies the invoicing process. We enable users to create, manage, and customize invoices effortlessly. With features that allow you to share and email invoices directly, save them for future use, and download them in various formats. Our premium templates allow for easy customization, helping you maintain a professional appearance while saving you time and effort.</p>

                <blockquote className="blockquote mx-2 my-3 py-3">
                    <footer className="blockquote-footer">
                        <cite title="Team Quick Invoice" className="f-20">Team Quick Invoice</cite>
                    </footer>
                </blockquote>

            </div>

        </div>
    </div>

);

const SecondSection = () => (

    <div className="container-fluid abt-scnd-section py-5">
        <div className="row justify-content-around align-items-center gy-5 py-5 px-lg-4">

            <div className="col-xl-7 col-lg-8 col-md-10 col-11  p-0 f-18">

                <h1 className="p-2 f-40 abt-sections-head">Our Vision</h1>

                <p className="p-2 abt-sections-txt">    We envision a world where businesses can manage their invoicing effortlessly, allowing them to focus on growth and innovation. Our goal is to be the leading platform that transforms the invoicing landscape, making it accessible, efficient, and user-friendly for everyone involved. We aim to empower users with the tools they need to create, customize, and manage invoices seamlessly, fostering a more organized and productive financial environment.</p>

                <blockquote className="blockquote mx-2 my-3 py-3">
                    <footer className="blockquote-footer">
                        <cite title="Founder of Quick Invoice" className="f-20">Aamir Manikesh ( Founder )</cite>
                    </footer>
                </blockquote>

            </div>

            <div className="col-auto p-0">
                <div className="d-inline-block">
                    <img src={ceoImage} alt="Our Vision" className="abt-sections-img" />
                </div>
            </div>

        </div>
    </div>

);

const ThirdSection = () => (

    <div className="container-fluid abt-thrd-section py-5">

        <div className="text-center py-3 mb-5 f-40 abt-sections-head">Our Esteemed Clients</div>

        <div className="row justify-content-center align-items-center">
            {[amzLogo, msftLogo, mshLogo].map((clientLogo, index) => (
                <div className="col-auto p-0 abt-thrd-section-col" key={index}>
                    <img src={clientLogo} className="abt-thrd-section-img" alt={`Client ${index + 1}`} height="128" width="256" />
                </div>
            ))}
        </div>

    </div>

);

const FourthSection = () => (

    <div className="container-fluid abt-frth-section py-5">
        <div className="text-center f-40 abt-sections-head">Our Team</div>

        <div className="row justify-content-center align-items-center py-5 px-2 gy-5">

            {teamMembers.map(member => (

                <div className="col-xl-3" key={member.name}>

                    <div className="p-2=5">
                        <img src={member.image} alt={member.name} className="d-block abt-frth-section-img mx-auto" />
                    </div>

                    <h1 className="abt-frth-section-nm text-center py-2 f-28">{member.name}</h1>

                    <div className="abt-frth-section-field text-center f-20">{member.role}</div>

                    <div className="abt-frth-section-fieldmlgt text-center f-18">{member.email}</div>

                </div>

            ))}

        </div>
    </div>

);

const FifthSection = () => (

    <div className="container-fluid abt-thrd-section py-5">

        <h1 className="text-center py-3 mb-5 abt-sections-head">Technologies Behind Our System</h1>

        <div className="row justify-content-center align-items-center gap-5 py-4">
            {[rctLogo, rctpdfLogo, mngLogo, bsLogo, ndLogo].map((techLogo, index) => (
                <div className="col-auto p-0 abt-thrd-section-col" key={index}>
                    <img src={techLogo} alt={`Technology ${index + 1}`} height="110" width="125" />
                </div>
            ))}
        </div>

    </div>

);


const teamMembers = [
    {
        name: 'Yadav Manish',
        role: 'Full-Stack Developer, Team Leader',
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
        role: 'Database Administrator',
        email: 'sorathiya@gmail.com',
        image: ussorImage
    }
];

export default About;