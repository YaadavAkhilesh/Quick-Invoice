/**
 * Header.jsx - Main header component for the Quick Invoice application
 * Handles navigation, user authentication, template selection menus, and responsive offcanvas menu for mobile devices
 */

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService, profileService } from "../../services/api";
import Logo from "../../assets/SVGs/brand.svg";
import { ReceiptIcon, TemplateIcon, DashboardIcon, HomeRoundedIcon, renderIcon } from '../icons/iconProvider';
import usrprf from "../../assets/SVGs/usrprf.svg";
import './Header.css';

// Template data for invoice templates - basic and advance categories
const basicTemplates = [
  { name: 'Simple', desc: 'Effortless invoice creation', color: '#41E1C140', infoColor: '#005B64', border: '#41E1C120' },
  { name: 'Classical', desc: 'Delivery invoice', color: '#415EE140', infoColor: '#002164', border: '#415EE120' },
  { name: 'Standard', desc: 'Reliable everyday tax invoice', color: '#E1416E40', infoColor: '#640014', border: '#E1416E20' }
];

const advanceTemplates = [
  { name: 'Elegant', desc: 'Timeless & Refined', color: '#de41e140', infoColor: '#420064', border: '#42006420' },
  { name: 'Professional', desc: 'Polished & Sophisticated', color: '#4CE14140', infoColor: '#426400', border: '#42640020' },
  { name: 'Custom', desc: 'Customizable templates that fit your business', color: '#415EE140', infoColor: '#002164', border: '#415EE120' }
];

// Reusable component for rendering template buttons in menus
const TemplateButton = ({ template, colClass = "col-md-6", headFont = "f-18", infoFont = "f-16", isEnd = false }) => (
  <div className={colClass} style={{ '--back-color': template.color, '--info-color': template.infoColor, '--box-border': template.border }}>
    <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
      <div className={`${isEnd ? 'templt-menu-end-btn-head' : 'templt-menu-right-btn-head'} ${headFont}`}>{template.name}</div>
      <div className={`${isEnd ? 'templt-menu-end-btn-info' : 'templt-menu-right-btn-info'} my-2 ${infoFont}`}>{template.desc}</div>
    </a>
  </div>
);

// Main Header component - manages navigation, user menus, and responsive design
const Header = () => {

  // Reusable Link component for login button styling
  const LgnLink = ({ to, children, className, ...props }) => {
    return (
      <Link to={to} className={`btn px-3 brand-btn b-none ${className}`} {...props}>
        {children}
      </Link>
    );
  };

  // State management for menu visibility and user data
  const [activeTab, setActiveTab] = useState('none');
  const [showMenu, setShowMenu] = useState(false);
  const [isOffcanOpen, setIsOffcanOpen] = useState(false);
  const [showOffcanRows, setshowOffcanRows] = useState(false);
  const [showUsrprf, setshowUsrprf] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(usrprf);

  // Refs for handling click outside detection on menus
  const menuRef = useRef(null);
  const templatesRef = useRef(null);
  const usrprfRef = useRef(null);
  const offcanRef = useRef(null);
  const navigate = useNavigate();

  const location = useLocation();

  const isActivePath = (path, exact = false) => {
    if (!path) return false;
    return exact ? location.pathname === path : location.pathname.startsWith(path);
  };

  const onNavigateBrandLogo = () => {
    navigate("/");
  }

  useEffect(() => {
    // Check if user is logged in & fetch profile data
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      fetchProfileData();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (profileImage && profileImage.startsWith('blob:')) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  // Fetch user profile data including username and profile image
  const fetchProfileData = useCallback(async () => {
    try {
      const response = await profileService.getProfile();
      if (response?.vendor) {
        setUsername(response.vendor.v_username || '');

        // Try to fetch profile image
        try {
          const imageResponse = await profileService.getProfileImage();
          if (imageResponse) {
            setProfileImage(imageResponse);
          } else {
            setProfileImage(usrprf);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setProfileImage(usrprf);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileImage(usrprf); // Reset to default on error
    }
  }, []);

  // Handle user logout: clear authentication token, reset user state, redirect to login page
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
    setProfileImage('');
    navigate('/login');
  }, [navigate]);

  const offcanToggle = useCallback(() => {
    setIsOffcanOpen(prevState => !prevState);
    setshowOffcanRows(false);
    setshowUsrprf(false);
    setShowMenu(false);
  }, []);

  const handleClickOutside = (event) => {
    if (
      menuRef.current && !menuRef.current.contains(event.target) &&
      templatesRef.current && !templatesRef.current.contains(event.target) &&
      usrprfRef.current && !usrprfRef.current.contains(event.target)
    ) {
      setShowMenu(false);
      setIsOffcanOpen(false);
      setshowOffcanRows(false);
      setActiveTab('none');
      setshowUsrprf(false);
    }
  };

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1400) {
      setIsOffcanOpen(false);
      setShowMenu(false);
      setshowOffcanRows(false);
      setActiveTab('none');
      setshowUsrprf(false);
    }
    if (window.innerWidth >= 768) {
      setshowOffcanRows(false);
      setActiveTab('none');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const offcanToggleRows = useCallback(() => {
    setshowOffcanRows(prevState => !prevState);
  }, [])

  const toggleUsrprfMenu = useCallback(() => {
    setShowMenu(false);
    setIsOffcanOpen(false);
    setshowUsrprf(prevState => !prevState);
  }, [])

  // Render the header component JSX structure
  return (
    <header className="m-0">

      {/* Fixed navbar with logo and navigation links */}
      <nav className="navbar fixed-top navbar-expand-xxl px-3">
        <div className="container-fluid p-0 m-0 align-items-center">

          <div className="d-flex align-items-center">
            <img src={Logo} className="brand-logo" alt="Brand Logo" onClick={onNavigateBrandLogo} />
          </div>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">

              <li className="nav-item" ref={templatesRef}>
                <a className={`nav-link ${showMenu ? 'hover' : ''}`} onMouseEnter={() => setShowMenu(true)}>Templates</a>
              </li>


              <li className="nav-item">
                <Link className={`nav-link ${isActivePath('/About') ? 'active' : ''}`} to="/About">About</Link>
              </li>

              <li className="nav-item">
                <Link className={`nav-link ${isActivePath('/Connect') ? 'active' : ''}`} to="/Connect">Connect us</Link>
              </li>

              <li className="nav-item">
                <Link className={`nav-link ${isActivePath('/Pricing') ? 'active' : ''}`} to="/Pricing">Pricing</Link>
              </li>

            </ul>
          </div>

          <div className="d-flex gap-3">
            {!isLoggedIn ? (
              <LgnLink to="/Login" className="lgbt f-18">Login</LgnLink>
            ) : (
              <div ref={usrprfRef} className='p-0 m-0'>
                <img
                  src={profileImage || usrprf}
                  alt="Profile"
                  height="48px"
                  width="48px"
                  role="button"
                  className={`rounded-circle p-0 m-0 usrprf ${showUsrprf ? 'hover' : ''}`}
                  style={{
                    objectFit: 'cover'
                  }}
                  crossOrigin="anonymous"
                  onClick={toggleUsrprfMenu}
                  onError={(e) => {
                    console.log('Small profile image load error, falling back to default');
                    e.target.onerror = null;
                    e.target.src = usrprf;
                  }}
                />
              </div>
            )}

            <button
              className={`navbar-toggler p-0 px-auto ${isOffcanOpen ? 'toggled' : ''}`} onClick={offcanToggle}
              type="button"
              data-bs-toggle="offcan"
              data-bs-target="#offcan"
              aria-controls="offcan"
              aria-expanded={isOffcanOpen}
              aria-label="offcanvase">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

        </div>
      </nav>

      {/* User profile dropdown menu when logged in */}
      {showUsrprf && isLoggedIn && (
        <div className="container-xxl fixed-top p-0 usrprf-menu-container mx-3" onMouseLeave={() => { setshowUsrprf(false); }}>
          <div className="usrprf-menu g-0 px-3 py-3 b-rd-8">


            <div className="f-18 text-center pb-3">✨ Welcome , {username} ☺️</div>

            <div className="py-1">
              <Link to="/Dashboard" type="button" className="btn px-3 w-100 usrprf-btn-links b-none d-flex justify-content-start align-items-center gap-2">
                {renderIcon(DashboardIcon, 34)}
                <div className="f-18 usrprf-btn-links-head">Dashboard</div>
              </Link>
            </div>

            <div className="py-1">
              <Link to="/Dashboard/InvcSection" type="button" className="btn px-3 w-100 usrprf-btn-links b-none d-flex justify-content-start align-items-center gap-2">
                {renderIcon(ReceiptIcon, 34)}
                <div className="f-18 usrprf-btn-links-head">My Invoices</div>
              </Link>
            </div>

            <div className="py-1">
              <Link to="/Dashboard/TmpltSection" type="button" className="btn px-3 w-100 usrprf-btn-links b-none d-flex justify-content-start align-items-center gap-2">
                {renderIcon(TemplateIcon, 34)}
                <div className="f-18 usrprf-btn-links-head">My Templates</div>
              </Link>
            </div>

            <hr />
            <div className="d-flex justify-content-center align-items-center gap-2">
              <button className="w-100 btn brand-btn lgbt f-18" onClick={handleLogout}>Logout</button>
              <button className="btn hmbt" onClick={onNavigateBrandLogo}>
                <HomeRoundedIcon sx={
                  { color: "var(--brand-primary)", fontSize: 36 }
                } />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Templates dropdown menu for desktop */}
      {showMenu && (
        <div className="container menu-container fixed-top p-0" ref={menuRef} onMouseEnter={() => { setShowMenu(true) }} onMouseLeave={() => { setShowMenu(false); setActiveTab('none') }}>
          <div className="d-flex justify-content-between menu-container-flex">

            <div className="templt-menu-left p-2 m-0">
              <div className="row justify-content-center align-items-center g-0 gap-2">

                <div className="col-12">
                  <a type="button" className={`btn px-3 text-start templt-menu-left-btn ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>
                    <div className="templt-menu-left-btn-head f-18">Basic</div>
                    <div className="templt-menu-left-btn-info my-2 f-16">Explore veriety of templates designed for effortless creation</div>
                  </a>
                </div>

                <div className="col-12">
                  <a type="button" className={`btn px-3 text-start templt-menu-left-btn ${activeTab === 'advance' ? 'active' : ''}`} onClick={() => setActiveTab('advance')}>
                    <div className="templt-menu-left-btn-head f-18">Advance</div>
                    <div className="templt-menu-left-btn-info my-2 f-16">Discover templates designed for sophisticated & creative creation</div>
                  </a>
                </div>

              </div>
            </div>

            <div className="templt-menu-right">

              <div className={`row p-0 m-0 templt-menu-right-def-row justify-content-center align-items-center text-center ${activeTab === 'none' ? 'show' : 'hide'}`}
                style={{ display: activeTab !== 'none' ? 'none' : '' }}>
                <div className="templt-menu-right-def-row-img w-100 h-100">

                </div>
              </div>

              <div className={`row p-0 m-0 g-2 px-2 b-rd-8 templt-menu-right-row ${activeTab === 'advance' ? 'show' : 'hide'}`}>
                {advanceTemplates.map((template, index) => (
                  <TemplateButton key={index} template={template} colClass={index === 2 ? "col-12" : "col-md-6"} isEnd={index === 2} />
                ))}
              </div>


              <div className={`row p-0 m-0 g-2 px-2 b-rd-8 templt-menu-right-row ${activeTab === 'basic' ? 'show' : 'hide'}`}>
                {basicTemplates.map((template, index) => (
                  <TemplateButton key={index} template={template} colClass={index === 2 ? "col-12" : "col-md-6"} />
                ))}
              </div>

            </div>

            <div className="templt-menu-end">
              <div className="row p-0 m-0 b-rd-8">

                <div className="col-12 p-0 m-0" style={{ '--back-color': '#6DCCFF40', '--info-color': '#003A64', '--box-border': '#003A6420' }}>
                  <Link to="/Dashboard" type="button" className="btn px-3 text-start templt-menu-end-btn w-100 h-100 d-flex flex-column justify-content-between b-none">
                    <div className="templt-menu-right-btn-head f-18">Use templates</div>
                    <div className="templt-menu-right-btn-info my-2 f-16">You can try these templates in your dashboard</div>
                    <div className="f-16 brand-link mt-auto">Try now</div>
                  </Link>
                </div>

              </div>
            </div>


          </div>
        </div>

      )}

      {/* Offcanvas menu for mobile and tablet devices */}
      <div className={`container-xl menu-container fixed-top p-0 offcan ${isOffcanOpen ? 'show' : ''}`} id="offcan" ref={offcanRef}>
        <div className="d-flex justify-content-between offcan-container-flex">

          <div className="offcan-menu-left p-0 m-0 d-flex flex-column">
            <div className="row justify-content-center align-items-center g-0 gap-3 p-3 offcan-menu-left-row-menu">

              <div className="col-12">
                <a type="button" className={`btn px-2 py-2 text-center w-100 offcan-menu-left-btn`} onClick={offcanToggleRows}>
                  <div className="offcan-menu-left-btn-head f-16">Templates</div>
                </a>

                {/* Offcanvas Templates Type - Mobile Version */}
                {showOffcanRows && (
                  <div className={`offcan--menu-left-mobi mt-3 ${showOffcanRows ? 'show' : 'hide'}`}>


                    <div className={`row p-0 m-0 g-2 px-2 b-rd-8 pb-2 offcan-menu-right-templt-row`}>

                      <div className="text-start px-2 offcan-tmplt-head f-16">
                        Basic
                      </div>

                      <div className="col-12 col-sm-6" style={{ '--back-color': '#41E1C140', '--info-color': '#005B64', '--box-border': '#41E1C120' }}>
                        <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                          <div className="templt-menu-right-btn-head f-16">Simple</div>
                          <div className="templt-menu-right-btn-info my-2 f-14">Effortless invoice creation</div>
                        </a>
                      </div>

                      <div className="col-12 col-sm-6" style={{ '--back-color': '#415EE140', '--info-color': '#002164', '--box-border': '#415EE120' }}>
                        <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                          <div className="templt-menu-right-btn-head f-16">Classical</div>
                          <div className="templt-menu-right-btn-info my-2 f-14">Delivery invoice</div>
                        </a>
                      </div>

                      <div className="col-12" style={{ '--back-color': '#E1416E40', '--info-color': '#640014', '--box-border': '#E1416E20' }}>
                        <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                          <div className="templt-menu-right-btn-head f-16">Standard</div>
                          <div className="templt-menu-right-btn-info my-2 f-14">Reliable everyday tax invoice</div>
                        </a>
                      </div>

                    </div>



                    <div className={`row p-0 m-0 g-2 px-2 b-rd-8 py-2 offcan-menu-right-templt-row`}>

                      <div className="text-start px-2 offcan-tmplt-head f-16">
                        Advance
                      </div>

                      <div className="col-12 col-sm-6" style={{ '--back-color': '#de41e140', '--info-color': '#420064', '--box-border': '#42006420' }}>
                        <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                          <div className="templt-menu-right-btn-head f-16">Elegant</div>
                          <div className="templt-menu-right-btn-info my-2 f-14">Timeless & Refined</div>
                        </a>
                      </div>

                      <div className="col-12 col-sm-6" style={{ '--back-color': '#4CE14140', '--info-color': '#426400', '--box-border': '#42640020' }}>
                        <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                          <div className="templt-menu-right-btn-head f-16">Professional</div>
                          <div className="templt-menu-right-btn-info my-2 f-14">Polished & Sophisticated</div>
                        </a>
                      </div>

                      <div className="col-12" style={{ '--back-color': '#6DCCFF40', '--info-color': '#003A64', '--box-border': '#003A6420' }}>
                        <Link to="/Dashboard" type="button" className="btn px-3 text-start templt-menu-end-btn w-100 h-100 rounded-2 b-none">
                          <div className="templt-menu-right-btn-head f-16">Try templates</div>
                          <div className="templt-menu-right-btn-info my-2 f-14">You can try customized templates in your dashboard</div>
                          <div className="f-14 brand-link">Try now</div>
                        </Link>
                      </div>

                    </div>


                  </div>
                )}

              </div>

              <div className="col-12">
                <Link to="/About" type="button" className="btn px-2 py-2 text-center w-100 offcan-menu-left-btn" >
                  <div className="offcan-menu-left-btn-head f-16">About</div>
                </Link>
              </div>

              <div className="col-12">
                <Link className={`btn px-2 py-2 text-center w-100 offcan-menu-left-btn`} to="/About">
                  <div className="offcan-menu-left-btn-head f-16">Connect us</div>
                </Link>
              </div>

              <div className="col-12">
                <Link to="/Pricing" type="button" className="btn px-2 py-2 text-center w-100 offcan-menu-left-btn" >
                  <div className="offcan-menu-left-btn-head f-16">Pricing</div>
                </Link>
              </div>

            </div>

            <div className="row m-0 p-3 justify-content-center offcan-menu-left-md-lgbt-row mt-auto gap-3" style={{ borderTop: '1px solid var(--brand-primary-outline)', backgroundColor: 'var(--brand-primary-light-2-trans)', backdropFilter: 'blur(28px)' }}>

              {!isLoggedIn ? (
                <Link to="/Login" className="btn brand-btn px-4 lgbt w-auto">Login</Link>
              ) : (
                <button className="btn py-2 px-4 brand-btn b-none offcan-lgbt w-auto f-16" onClick={handleLogout}>Logout</button>
              )}

            </div>

          </div>

          <div className="offcan-menu-right">

            <div className={`row p-0 m-0 offcan-menu-right-def-row justify-content-center align-items-center text-center ${showOffcanRows ? 'hide' : 'show'}`}
              style={{ display: showOffcanRows ? 'none' : '' }}>
              <div className="offcan-menu-right-def-row-img w-100 h-100">

              </div>
            </div>

            {/* Offcanvas Basic Templates */}
            {showOffcanRows && (
              <div className={`row p-0 m-0 g-2 px-2 b-rd-8 py-2 offcan-menu-right-templt-row ${showOffcanRows ? 'show' : 'hide'}`}>

                <div className="text-start px-2 offcan-tmplt-head f-16">
                  Basic
                </div>

                <div className="col-12 col-lg-5" style={{ '--back-color': '#41E1C140', '--info-color': '#005B64', '--box-border': '#41E1C120' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-right-btn-head f-16">Simple</div>
                    <div className="templt-menu-right-btn-info my-2 f-16">Effortless invoice creation</div>
                  </a>
                </div>

                <div className="col-12 col-lg-7" style={{ '--back-color': '#415EE140', '--info-color': '#002164', '--box-border': '#415EE120' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-right-btn-head f-16">Classical</div>
                    <div className="templt-menu-right-btn-info my-2 f-16">Delivery invoice</div>
                  </a>
                </div>

                <div className="col-12" style={{ '--back-color': '#E1416E40', '--info-color': '#640014', '--box-border': '#E1416E20' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-right-btn-head f-16">Standard</div>
                    <div className="templt-menu-right-btn-info my-2 f-16">Reliable everyday tax invoice</div>
                  </a>
                </div>

              </div>
            )}

            {/* Offcanvas Advance Templates */}
            {showOffcanRows && (
              <div className={`row p-0 m-0 g-2 px-2 b-rd-8 py-2 offcan-menu-right-templt-row`}>

                <div className="text-start px-2 offcan-tmplt-head f-16">
                  Advance
                </div>

                <div className="col-12 col-lg-5" style={{ '--back-color': '#de41e140', '--info-color': '#420064', '--box-border': '#42006420' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-right-btn-head f-16">Elegant</div>
                    <div className="templt-menu-right-btn-info my-2 f-16">Timeless & Refined</div>
                  </a>
                </div>

                <div className="col-12 col-lg-7" style={{ '--back-color': '#4CE14140', '--info-color': '#426400', '--box-border': '#42640020' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-right-btn-head f-16">Professional</div>
                    <div className="templt-menu-right-btn-info my-2 f-16">Polished & Sophisticated</div>
                  </a>
                </div>

                <div className="col-12" style={{ '--back-color': '#415EE140', '--info-color': '#002164', '--box-border': '#415EE120' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-end-btn-head f-16">Custom</div>
                    <div className="templt-menu-end-btn-info my-2 f-16">Customizable templates that fit your business</div>
                  </a>
                </div>

              </div>
            )}

            {/* Offcanvas Use Templates */}
            {showOffcanRows && (
              <div className={`row p-0 m-0  g-2 px-2 b-rd-8 py-2 offcan-menu-right-templt-row`}>

                <div className="text-start px-2 offcan-tmplt-head f-16">
                  Want to try ?
                </div>

                <div className="col-12" style={{ '--back-color': '#6DCCFF40', '--info-color': '#003A64', '--box-border': '#003A6420' }}>
                  <Link to="/Dashboard" type="button" className="btn px-3 text-start templt-menu-end-btn w-100 h-100 rounded-2 b-none">
                    <div className="templt-menu-right-btn-head f-16">Use templates</div>
                    <div className="templt-menu-right-btn-info my-2 f-16">You can try these templates in your dashboard</div>
                    <div className="f-14 brand-link mt-auto">Try now</div>
                  </Link>
                </div>

              </div>
            )}

          </div>


        </div>
      </div>


    </header>
  );
};

export default memo(Header);