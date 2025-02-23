import "./CallToAction.css";
import { Link } from "react-router-dom";
import CTOArrow from "../../../assets/PNGs/CTOArrow.png";

const CallToAction = () => {
    return (
        <section className="container-fluid cto-container p-0 py-4">
            <div className="row justify-content-around align-items-center p-0 m-0 py-4">

                <div className="col-12 col-xl-6 mx-auto cto-text">
                    <div>Start Streamlining Your invoicing Today !</div>
                    <p className="mt-2">
                        Join thousands of satisfied vendors who have transformed their invoicing process with Quick Invoice
                    </p>
                </div>

                <div className="col-12 col-xl-4 cto-button-container d-flex flex-column align-items-center">
                    <Link to="/Registration" className="btn brand-btn d-flex align-items-center justify-content-center py-2 px-4 gap-3 mx-auto">
                        Get started for free
                        <img src={CTOArrow} alt="cta-arrow" />
                    </Link>
                    {/* <button className="btn brand-btn d-flex align-items-center justify-content-center mx-auto py-2 px-4 gap-3">
                        Get started for free
                        <img src={CTOArrow} alt="cta-arrow" />
                    </button> */}
                </div>

            </div>
        </section>
    );
};

export default CallToAction;
