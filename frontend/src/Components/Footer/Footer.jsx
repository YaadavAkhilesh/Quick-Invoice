/**
 * Footer Component
 *
 * Displays the application footer with logo, subscription form,
 * navigation links organized in sections, and copyright information.
 * Optimized for performance with React.memo and reusable components.
 */

import React, { memo } from 'react';
import './Footer.css';
import Logo from "../../assets/SVGs/brand.svg";

// Reusable component for footer navigation sections
const NavSection = ({ title, links }) => (
  <div className="footer-nav-con col-6 col-md-auto m-0 p-0 d-flex justify-content-center">
    <div>
      <div className="footer-nav-con-title p-2">{title}</div>
      <ul className="navbar-nav d-block">
        {links.map((link, index) => (
          <li key={index} className="nav-item">
            <a href={link.href || '#'} className="nav-link py-2">{link.text}</a>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Footer = () => {
  // Navigation data for footer sections
  const navSections = [
    {
      title: 'About us',
      links: [
        { text: 'Our story' },
        { text: 'Team' },
        { text: 'Contact us' },
        { text: 'Testimonials' }
      ]
    },
    {
      title: 'Services',
      links: [
        { text: 'Invoice generation' },
        { text: 'Template customization' },
        { text: 'Payment integration' },
        { text: 'Reporting tools' }
      ]
    },
    {
      title: 'Support',
      links: [
        { text: 'Contact us', href: '#' },
        { text: 'Help center', href: '#' },
        { text: 'Live chat', href: '#' },
        { text: 'Submit ticket', href: '#' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { text: 'Privacy policy', href: '#' },
        { text: 'Terms of services', href: '#' },
        { text: 'Copyright notice', href: '#' }
      ]
    }
  ];

  return (

        <footer className="footer-fluid w-100 m-0">
            <nav className="navbar sticky-bottom custom-footer p-0 m-0 py-0 flex-grow-1">

                <div className="container-fluid row p-0 py-4 m-0 justify-content-center align-items-center gap-4">

                    <div className="col-12 footer-brand-con p-0">
                        <div className="d-flex footer-brand-con-wrapper w-100 justify-content-center align-items-center">
                            <img src={Logo} alt="Quick Invoice" height="200" width="200" className="d-block" />
                            <div className="sub-news">
                                <form className="d-flex m-0 p-0">
                                    <input className="form-control me-2 mx-0 sub-news-input rounded-4 f-18" id="subscribe_id" type="email" placeholder="quickmail@gmail.com" />
                                    <button className="btn brand-btn px-3 f-18" type="submit">Subscribe</button>
                                </form>
                                <div className="sub-note px-2 py-3">*Subscribe to our notifier for important <br /> updates on products and features</div>
                            </div>
                        </div>
                    </div>


                    <div className="col-12 footer-nav-menu p-0 py-5">
                        <div className="row p-0 m-0 justify-content-around gap-4">
                            {navSections.map((section, index) => (
                                <NavSection key={index} title={section.title} links={section.links} />
                            ))}
                        </div>
                    </div>

                </div>

                <div className="copyright-fluid d-flex px-4 py-2 justify-content-between align-items-center">
                    <div>
                        <span className="copyright-text f-18">All Rights Reserved © 2025 Quick Invoice Pvt. Ltd.</span>
                    </div>
                    <div>
                        <a href="https://github.com/Sorathiya-Viral/Quick-Invoice" className="copyright-text f-18">
                            GitHub - Quick Invoice
                        </a>
                    </div>
                </div>

            </nav>
        </footer>

    );

};

export default memo(Footer);
