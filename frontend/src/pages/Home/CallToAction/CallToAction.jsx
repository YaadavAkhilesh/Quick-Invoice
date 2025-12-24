import "./CallToAction.css";
import { Link } from "react-router-dom";
import { ArrowRightIcon , renderIcon } from "../../../Components/icons/iconProvider";

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
                    <Link to="/Registration" className="btn brand-btn fw-medium f-18 d-flex align-items-center justify-content-center py-2 px-4 gap-3 mx-auto">
                        Get started for free
                        <ArrowRightIcon sx={{color:'var(--brand-primary-light-2)',fontSize:30}}/>
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default CallToAction;
