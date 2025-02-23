import React from 'react'
import "./Features.css"
import FeatureCard from './FeatureCard/FeatureCard';
import featuresData from './FeatureCard/featuresData';

const Features = () => {

    return (
        <section className="container-fluid features-container py-5 p-0 px-3">

            <div className="features-text-container text-center my-3">
                <h3>Say <span className="catchy">Goodbye</span> to Invoicing Headaches</h3>
                <p className="f-20">Streamline your invoicing process with our powerful features</p>
            </div>

            <div className="row p-0 m-0 features-card-container justify-content-center align-items-center g-3">
                {featuresData.map(feature => (
                    <FeatureCard
                        key={feature.title}
                        src={feature.src}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </section>
    )
}

export default Features;
