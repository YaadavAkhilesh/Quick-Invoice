import React from "react";
import Hero from "./Hero-Section/Hero";
import Features from "./Features/Features";
import Testimonials from "./Testimonials/Testimonials";
import CallToAction from "./CallToAction/CallToAction";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";


const Home = () => {
    return (
        <>
            <Header />
            <Hero />
            <Features />
            <Testimonials />
            <CallToAction />
            <Footer />
        </>
    )
}

export { Home };