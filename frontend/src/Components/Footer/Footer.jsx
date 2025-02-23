import './Footer.css';
import Logo from "../../assets/SVGs/brand.svg";
import gthub from "../../assets/SVGs/github.svg";
import fcbk from "../../assets/SVGs/facebook.svg";
import lnkd from "../../assets/SVGs/linkedin.svg";
import dscrd from "../../assets/SVGs/discord.svg";
import sngle from "../../assets/SVGs/signal.svg";

const Footer = () => {

    return (

        <footer className="footer-fluid w-100 m-0">
            <nav className="navbar sticky-bottom custom-footer p-0 m-0 align-items-start py-0 flex-grow-1">

                <div className="container-fluid row p-0 m-0 justify-content-around align-items-start py-4">

                    <div className="col-12 col-xxl-auto footer-brand-con p-0">
                        <img src={Logo} alt="Quick Invoice" height="200" width="200" className="d-block mx-auto" />
                    </div>


                    <div className="col-12 col-xxl-auto footer-nav-menu-after-xxl">

                        <div className="d-flex gap-4 justify-content-center align-items-center py-4 px-0">

                            <a href="#" className="nav-link">
                                <img src={fcbk} alt="Facebook" className="footer-brand-social-link-img" />
                            </a>

                            <a href="#" className="nav-link">
                                <img src={sngle} alt="Twitter" className="footer-brand-social-link-img" />
                            </a>

                            <a href="#" className="nav-link">
                                <img src={lnkd} alt="LinkedIn" className="footer-brand-social-link-img" />
                            </a>

                            <a href="#" className="nav-link">
                                <img src={gthub} alt="Github" className="footer-brand-social-link-img" />
                            </a>

                            <a href="#" className="nav-link">
                                <img src={dscrd} alt="Github" className="footer-brand-social-link-img" />
                            </a>

                        </div>

                    </div>


                    <div className="col-12 col-xxl-7 footer-nav-menu p-0">
                        <div className="row p-0 m-0 justify-content-around">

                            <div className="footer-nav-con col-6 col-md-auto m-0 p-0 d-flex justify-content-center">
                                <div>

                                    <div className="footer-nav-con-title p-2">
                                        About us
                                    </div>

                                    <ul className="navbar-nav d-block">
                                        <li className="nav-item">
                                            <a className="nav-link py-1">Our story</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link py-1">Team</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link py-1">Contact us</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link py-1">Testimonials</a>
                                        </li>
                                    </ul>

                                </div>
                            </div>

                            <div className="footer-nav-con col-6 col-md-auto m-0 p-0 d-flex justify-content-center">
                                <div>

                                    <div className="footer-nav-con-title p-2">
                                        Services
                                    </div>

                                    <ul className="navbar-nav d-block">
                                        <li className="nav-item">
                                            <a className="nav-link py-1">Invoice generation</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link py-1">Template customization</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link py-1">Payment integration</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link py-1">Reporting tools</a>
                                        </li>
                                    </ul>

                                </div>
                            </div>

                            <div className="footer-nav-con col-6 col-md-auto m-0 p-0 d-flex justify-content-center">
                                <div>

                                    <div className="footer-nav-con-title p-2">
                                        Support
                                    </div>

                                    <ul className="navbar-nav d-block">
                                        <li className="nav-item">
                                            <a href="#" className="nav-link py-1">Contact us</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link py-1">Help center</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link py-1">Live chat</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link py-1">Submit ticket</a>
                                        </li>
                                    </ul>

                                </div>
                            </div>


                            <div className="footer-nav-con col-6 col-md-auto m-0 p-0 d-flex justify-content-center">
                                <div>

                                    <div className="footer-nav-con-title p-2">
                                        Legal
                                    </div>

                                    <ul className="navbar-nav d-block">
                                        <li className="nav-item">
                                            <a href="#" className="nav-link py-1">Privacy policy</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link py-1">Terms of services</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link py-1">Copyright notice</a>
                                        </li>
                                    </ul>

                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="col-12 col-xxl-auto footer-nav-menu-mail-link p-0">

                        <div className="sub-news d-block mx-auto">
                            <form className="d-flex m-0 p-0">
                                <input className="form-control me-2 mx-0 sub-news-input rounded-4" id="subscribe_id" type="email" placeholder="quickmail@gmail.com" />
                                <button className="btn brand-btn px-3 py-1" type="submit">Subscribe</button>
                            </form>
                        </div>

                        <div className="d-flex gap-4 justify-content-center align-items-center px-2 py-5">

                            <a href="#" className="nav-link">
                                <img src={fcbk} alt="Facebook" className="footer-brand-social-link-img" />
                            </a>

                            <a href="#" className="nav-link">
                                <img src={sngle} alt="Twitter" className="footer-brand-social-link-img" />
                            </a>

                            <a href="#" className="nav-link">
                                <img src={lnkd} alt="LinkedIn" className="footer-brand-social-link-img" />
                            </a>

                            <a href="#" className="nav-link">
                                <img src={gthub} alt="Github" className="footer-brand-social-link-img" />
                            </a>

                            <a href="#" className="nav-link">
                                <img src={dscrd} alt="Github" className="footer-brand-social-link-img" />
                            </a>

                        </div>

                    </div>

                </div>

                <div className="copyright-fluid d-flex px-4 py-2 justify-content-between align-items-center">
                    <div>
                        <span className="copyright-text f-18">All Rights Reserved © 2025 Quick Invoice Pvt. Ltd.</span>
                    </div>
                    <div>
                        <span className="help-num f-18">quickofficial@duck.com</span>
                    </div>
                </div>

            </nav>
        </footer>

    );

};

export { Footer };
