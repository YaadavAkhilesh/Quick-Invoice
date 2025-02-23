import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { authService, profileService } from "../../services/api";
import Logo from "../../assets/SVGs/brand.svg";
import usrprf from "../../assets/SVGs/usrprf.svg";
import lnkarw from "../../assets/SVGs/lnk_arrow.svg";
import './Header.css';

const Header = () => {

  const LgnLink = ({ to, children, className, ...props }) => {
    return (
      <Link to={to} className={`btn px-3 brand-btn b-none ${className}`} {...props}>
        {children}
      </Link>
    );
  };

  const [activeTab, setActiveTab] = useState('none');
  const [showMenu, setShowMenu] = useState(false);
  const [isOffcanOpen, setIsOffcanOpen] = useState(false);
  const [showOffcanRows, setshowOffcanRows] = useState(false);
  const [showUsrprf, setshowUsrprf] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const menuRef = useRef(null);
  const templatesRef = useRef(null);
  const usrprfRef = useRef(null);
  const offcanRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and fetch profile data
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    if (token) {
      fetchProfileData();
    }
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await profileService.getProfile();
      if (response?.vendor) {
        setUsername(response.vendor.v_username || '');
        
        // Try to fetch profile image
        if (response.vendor.v_id) {
          const imageResponse = await profileService.getProfileImage(response.vendor.v_id);
          console.log('Profile image URL:', imageResponse); // Debug log
          if (imageResponse) {
            setProfileImage(imageResponse);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileImage(''); // Reset to default on error
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
    setProfileImage('');
    navigate('/login');
  };

  const offcanToggle = () => {
    setIsOffcanOpen(prevState => !prevState);
    setshowOffcanRows(false);
    setshowUsrprf(false);
    setShowMenu(false);
  };

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

  const handleResize = () => {
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
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const offcanToggleRows = () => {
    setshowOffcanRows(prevState => !prevState);
  }

  const toggleUsrprfMenu = () => {
    setShowMenu(false);
    setIsOffcanOpen(false);
    setshowUsrprf(prevState => !prevState);
  }

  return (
    <header className="m-0">

      <nav className="navbar fixed-top navbar-expand-xxl px-3">
        <div className="container-fluid p-0 m-0 align-items-center">

          <div className="d-flex align-items-center">
            <img src={Logo} className="brand-logo" alt="Brand Logo" />
          </div>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">

              <li className="nav-item">
                <a className="nav-link" href="#">Invoices</a>
              </li>

              <li className="nav-item" ref={templatesRef}>
                <a className={`nav-link ${showMenu ? 'hover' : ''}`} href="#" onMouseEnter={() => setShowMenu(true)}>Templates</a>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/About">About</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/Pricing">Pricing</Link>
              </li>

            </ul>
          </div>

          <div className="d-flex gap-3">
            {!isLoggedIn ? (
              <LgnLink to="/Login" className="lgbt">Login</LgnLink>
            ) : (
              <div ref={usrprfRef}>
                <button className={`btn p-0 m-0 usrprf ${showUsrprf ? 'hover' : ''}`} onClick={toggleUsrprfMenu}>
                  <img 
                    src={profileImage || usrprf} 
                    alt="Profile" 
                    height="34px" 
                    width="34px" 
                    className="rounded-circle"
                    style={{ 
                      objectFit: 'cover',
                      backgroundColor: 'white',
                      border: '1px solid var(--brand-primary)'
                    }}
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.log('Small profile image load error, falling back to default');
                      e.target.onerror = null;
                      e.target.src = usrprf;
                    }}
                  />
                </button>
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

      {showUsrprf && isLoggedIn && (
        <div className="container-xxl menu-container fixed-top p-0 usrprf-menu-container" onMouseLeave={() => { setshowUsrprf(false); }}>
          <div className="d-flex justify-content-between menu-container-flex usrprf-menu-container-flex">

            <div className="templt-menu-left p-2 m-0 usrprf-menu-left">
              <div className="row justify-content-center align-items-center g-0 gap-2">

                <div className="col-12">
                  <img 
                    src={profileImage || usrprf} 
                    alt="Profile" 
                    height="128px" 
                    width="128px" 
                    className="d-block mx-auto mt-2 rounded-circle"
                    style={{ 
                      objectFit: 'cover',
                      backgroundColor: 'white',
                      border: '2px solid var(--brand-primary)'
                    }}
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.log('Large profile image load error, falling back to default');
                      e.target.onerror = null;
                      e.target.src = usrprf;
                    }}
                  />
                  <div className="f-18 text-center pt-3">{username}</div>
                  <button className="d-block btn py-1 px-5 brand-btn lgbt mx-auto my-2 f-18" onClick={handleLogout}>Logout</button>
                </div>

              </div>
            </div>

            <div className="templt-menu-right w-100 usrprf-menu-right">

              <div className={`row p-0 m-0 g-2 px-2 b-rd-8 templt-menu-right-row usrprf-menu-right-row`}>

                <div className="col-12 col-md-auto">
                  <Link type="button" className="brand-link btn px-3 w-100 usrprf-btn-links b-none d-flex justify-content-center align-items-center gap-2" to="/Dashboard">
                    <div className="f-18 usrprf-btn-links-head">Dashboard</div>
                    <img src={lnkarw} alt=">" height="24px" width="24px" />
                  </Link>
                </div>


                <div className="col-12 col-md-auto">
                  <a type="button" className="btn px-3 w-100 usrprf-btn-links b-none d-flex justify-content-center align-items-center gap-2">
                    <div className="f-18 usrprf-btn-links-head">My Invoices</div>
                    <img src={lnkarw} alt=">" height="24px" width="24px" />
                  </a>
                </div>


                <div className="col-12 col-md-auto">
                  <a type="button" className="btn px-3 w-100 usrprf-btn-links b-none d-flex justify-content-center align-items-center gap-2">
                    <div className="f-18 usrprf-btn-links-head">Templates</div>
                    <img src={lnkarw} alt=">" height="24px" width="24px" />
                  </a>
                </div>


                <div className="col-12 col-md-auto">
                  <a type="button" className="btn px-3 w-100 usrprf-btn-links b-none d-flex justify-content-center align-items-center gap-2" href="https://www.duck.ai/">
                    <div className="f-18 usrprf-btn-links-head">Ask ai</div>
                    <img src={lnkarw} alt=">" height="24px" width="24px" />
                  </a>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {showMenu && (
        <div className="container menu-container fixed-top p-0" ref={menuRef} onMouseEnter={() => { setShowMenu(true) }} onMouseLeave={() => { setShowMenu(false); setActiveTab('none') }}>
          <div className="d-flex justify-content-between menu-container-flex">

            <div className="templt-menu-left p-2 m-0">
              <div className="row justify-content-center align-items-center g-0 gap-2">

                <div className="col-12">
                  <a type="button" className={`btn px-4 text-start templt-menu-left-btn ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>
                    <div className="templt-menu-left-btn-head f-16">Basic</div>
                    <div className="templt-menu-left-btn-info my-2 f-15">Explore veriety of templates designed for effortless creation</div>
                  </a>
                </div>

                <div className="col-12">
                  <a type="button" className={`btn px-4 text-start templt-menu-left-btn ${activeTab === 'advance' ? 'active' : ''}`} onClick={() => setActiveTab('advance')}>
                    <div className="templt-menu-left-btn-head f-16">Advance</div>
                    <div className="templt-menu-left-btn-info my-2 f-15">Discover templates designed for sophisticated & creative creation</div>
                  </a>
                </div>

              </div>
            </div>

            <div className="templt-menu-right w-100">

              <div className={`row p-0 m-0 templt-menu-right-def-row justify-content-center align-items-center text-center ${activeTab === 'none' ? 'show' : 'hide'}`}
                style={{ display: activeTab !== 'none' ? 'none' : '' }}>
                <div className="templt-menu-right-def-row-img w-100 h-100">

                </div>
              </div>

              <div className={`row p-0 m-0 g-2 px-2 b-rd-8 templt-menu-right-row ${activeTab === 'advance' ? 'show' : 'hide'}`}>

                <div className="col-md-4" style={{ '--back-color': '#de41e140', '--info-color': '#420064', '--box-border': '#42006420' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-right-btn-head f-16">Elegant</div>
                    <div className="templt-menu-right-btn-info my-2 f-14">Timeless and Refined</div>
                    <div className="f-14 brand-link">Try now</div>
                  </a>
                </div>

                <div className="col-md-4" style={{ '--back-color': '#4CE14140', '--info-color': '#426400', '--box-border': '#42640020' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-right-btn-head f-16">Professional</div>
                    <div className="templt-menu-right-btn-info my-2 f-14">Polished and Sophisticated</div>
                    <div className="f-14 brand-link">Try now</div>
                  </a>
                </div>

              </div>


              <div className={`row p-0 m-0 g-2 px-2 b-rd-8 templt-menu-right-row ${activeTab === 'basic' ? 'show' : 'hide'}`}>

                <div className="col-md-4" style={{ '--back-color': '#41E1C140', '--info-color': '#005B64', '--box-border': '#41E1C120' }}>
                  <Link to="/helloTemplate" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-right-btn-head f-16">Simple</div>
                    <div className="templt-menu-right-btn-info my-2 f-14">Effortless invoice creation</div>
                    <div className="f-14 brand-link">Try now</div>
                  </Link>
                </div>

                <div className="col-md-4" style={{ '--back-color': '#415EE140', '--info-color': '#002164', '--box-border': '#415EE120' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-right-btn-head f-16">Classical</div>
                    <div className="templt-menu-right-btn-info my-2 f-14">Delivery invoice</div>
                    <div className="f-14 brand-link">Try now</div>
                  </a>
                </div>

                <div className="col-md-4" style={{ '--back-color': '#E1416E40', '--info-color': '#640014', '--box-border': '#E1416E20' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-right-btn-head f-16">Standard</div>
                    <div className="templt-menu-right-btn-info my-2 f-14">Reliable everyday tax invoice</div>
                    <div className="f-14 brand-link">Try now</div>
                  </a>
                </div>

              </div>

            </div>

            <div className="templt-menu-end">
              <div className="row p-0 m-0 b-rd-8">

                <div className="col-12 p-0 m-0" style={{ '--back-color': '#6DCCFF40', '--info-color': '#003A64', '--box-border': '#003A6420' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-end-btn w-100 h-100 d-flex flex-column justify-content-between b-none">
                    <div className="templt-menu-end-btn-head f-18">Custom</div>
                    <div className="templt-menu-end-btn-info my-2 f-15">Customizable templates that fit your business</div>
                    <div className="f-14 brand-link mt-auto">Try now</div>
                  </a>
                </div>

              </div>
            </div>


          </div>
        </div>

      )}


      <div className={`container-xl menu-container fixed-top p-0 offcan ${isOffcanOpen ? 'show' : ''}`} id="offcan" ref={offcanRef}>
        <div className="d-flex justify-content-between offcan-container-flex">

          <div className="offcan-menu-left p-0 m-0 d-flex flex-column">
            <div className="row justify-content-center align-items-center g-0 gap-3 p-3 offcan-menu-left-row-menu">

              <div className="col-12">
                <a type="button" className={`btn px-2 py-2 text-center w-100 offcan-menu-left-btn`}>
                  <div className="offcan-menu-left-btn-head f-16">Invoices</div>
                </a>
              </div>

              <div className="col-12">
                <a type="button" className={`btn px-2 py-2 text-center w-100 offcan-menu-left-btn`} onClick={offcanToggleRows}>
                  <div className="offcan-menu-left-btn-head f-16">Templates</div>
                </a>

                {showOffcanRows && (
                  <div className={`offcan--menu-left-mobi mt-3 ${showOffcanRows ? 'show' : 'hide'}`}>


                    <div className={`row p-0 m-0 g-2 px-2 b-rd-8 pb-2 offcan-menu-right-templt-row`}>

                      <div className="text-start px-2 offcan-tmplt-head f-16">
                        Simple templates
                      </div>

                      <div className="col-12 col-sm-6" style={{ '--back-color': '#41E1C140', '--info-color': '#005B64', '--box-border': '#41E1C120' }}>
                        <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                          <div className="templt-menu-right-btn-head f-16">Simple</div>
                          <div className="templt-menu-right-btn-info my-2 f-14">Effortless invoice creation</div>
                          <div className="f-14 brand-link">Try now</div>
                        </a>
                      </div>

                      <div className="col-12 col-sm-6" style={{ '--back-color': '#415EE140', '--info-color': '#002164', '--box-border': '#415EE120' }}>
                        <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                          <div className="templt-menu-right-btn-head f-16">Classical</div>
                          <div className="templt-menu-right-btn-info my-2 f-14">Delivery invoice</div>
                          <div className="f-14 brand-link">Try now</div>
                        </a>
                      </div>

                      <div className="col-12 col-sm-6" style={{ '--back-color': '#E1416E40', '--info-color': '#640014', '--box-border': '#E1416E20' }}>
                        <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                          <div className="templt-menu-right-btn-head f-16">Standard</div>
                          <div className="templt-menu-right-btn-info my-2 f-14">Reliable everyday tax invoice</div>
                          <div className="f-14 brand-link">Try now</div>
                        </a>
                      </div>

                    </div>



                    <div className={`row p-0 m-0 g-2 px-2 b-rd-8 py-2 offcan-menu-right-templt-row`}>

                      <div className="text-start px-2 offcan-tmplt-head f-16">
                        Advance templates
                      </div>

                      <div className="col-12 col-sm-6" style={{ '--back-color': '#de41e140', '--info-color': '#420064', '--box-border': '#42006420' }}>
                        <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                          <div className="templt-menu-right-btn-head f-16">Elegant</div>
                          <div className="templt-menu-right-btn-info my-2 f-14">Timeless and Refined</div>
                          <div className="f-14 brand-link">Try now</div>
                        </a>
                      </div>

                      <div className="col-12 col-sm-6" style={{ '--back-color': '#4CE14140', '--info-color': '#426400', '--box-border': '#42640020' }}>
                        <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                          <div className="templt-menu-right-btn-head f-16">Professional</div>
                          <div className="templt-menu-right-btn-info my-2 f-14">Polished and Sophisticated</div>
                          <div className="f-14 brand-link">Try now</div>
                        </a>
                      </div>

                    </div>



                    <div className={`row p-0 m-0  g-2 px-2 b-rd-8 py-2 offcan-menu-right-templt-row`}>

                      <div className="text-start px-2 offcan-tmplt-head f-16">
                        Customized templates
                      </div>

                      <div className="col-12" style={{ '--back-color': '#6DCCFF40', '--info-color': '#003A64', '--box-border': '#003A6420' }}>
                        <a type="button" className="btn px-3 text-start templt-menu-end-btn w-100 h-100 rounded-2 b-none">
                          <div className="templt-menu-end-btn-head f-16">Custom</div>
                          <div className="templt-menu-end-btn-info my-2 f-14">Customizable templates that fit your business</div>
                          <div className="f-14 brand-link">Try now</div>
                        </a>
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
                <Link to="/Pricing" type="button" className="btn px-2 py-2 text-center w-100 offcan-menu-left-btn" >
                  <div className="offcan-menu-left-btn-head f-16">Pricing</div>
                </Link>
              </div>

            </div>

            <div className="row m-0 p-3 justify-content-center offcan-menu-left-md-lgbt-row mt-auto gap-3" style={{ borderTop: '1px solid var(--brand-primary-outline)', backgroundColor: 'var(--brand-primary-light-2-trans)', backdropFilter: 'blur(28px)' }}>
              {/* <LgnLink to="/Login" className="lgbt">Login</LgnLink> */}
              <Link to="/Login" className="btn py-1 px-4 brand-btn b-none offcan-lgbt w-auto brand-link" aria-label="Login">Login</Link>

              <button className="btn py-1 px-4 brand-btn b-none offcan-lgbt w-auto">Logout</button>
            </div>

          </div>

          <div className="offcan-menu-right">

            <div className={`row p-0 m-0 offcan-menu-right-def-row justify-content-center align-items-center text-center ${showOffcanRows ? 'hide' : 'show'}`}
              style={{ display: showOffcanRows ? 'none' : '' }}>
              <div className="offcan-menu-right-def-row-img w-100 h-100">

              </div>
            </div>

            {showOffcanRows && (
              <div className={`row p-0 m-0 g-2 px-2 b-rd-8 py-2 offcan-menu-right-templt-row ${showOffcanRows ? 'show' : 'hide'}`}>

                <div className="text-start px-2 offcan-tmplt-head f-16">
                  Simple templates
                </div>

                <div className="col-12 col-lg-5" style={{ '--back-color': '#41E1C140', '--info-color': '#005B64', '--box-border': '#41E1C120' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-right-btn-head f-16">Simple</div>
                    <div className="templt-menu-right-btn-info my-2 f-14">Effortless invoice creation</div>
                    <div className="f-14 brand-link">Try now</div>
                  </a>
                </div>

                <div className="col-12 col-lg-7" style={{ '--back-color': '#415EE140', '--info-color': '#002164', '--box-border': '#415EE120' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-right-btn-head f-16">Classical</div>
                    <div className="templt-menu-right-btn-info my-2 f-14">Delivery invoice</div>
                    <div className="f-14 brand-link">Try now</div>
                  </a>
                </div>

                <div className="col-12 col-lg-5" style={{ '--back-color': '#E1416E40', '--info-color': '#640014', '--box-border': '#E1416E20' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-right-btn-head f-16">Standard</div>
                    <div className="templt-menu-right-btn-info my-2 f-14">Reliable everyday tax invoice</div>
                    <div className="f-14 brand-link">Try now</div>
                  </a>
                </div>

              </div>
            )}

            {showOffcanRows && (
              <div className={`row p-0 m-0 g-2 px-2 b-rd-8 py-2 offcan-menu-right-templt-row`}>

                <div className="text-start px-2 offcan-tmplt-head f-16">
                  Advance templates
                </div>

                <div className="col-12 col-lg-5" style={{ '--back-color': '#de41e140', '--info-color': '#420064', '--box-border': '#42006420' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-right-btn-head f-16">Elegant</div>
                    <div className="templt-menu-right-btn-info my-2 f-14">Timeless and Refined</div>
                    <div className="f-14 brand-link">Try now</div>
                  </a>
                </div>

                <div className="col-12 col-lg-7" style={{ '--back-color': '#4CE14140', '--info-color': '#426400', '--box-border': '#42640020' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-right-btn w-100">
                    <div className="templt-menu-right-btn-head f-16">Professional</div>
                    <div className="templt-menu-right-btn-info my-2 f-14">Polished and Sophisticated</div>
                    <div className="f-14 brand-link">Try now</div>
                  </a>
                </div>

              </div>
            )}

            {showOffcanRows && (
              <div className={`row p-0 m-0  g-2 px-2 b-rd-8 py-2 offcan-menu-right-templt-row`}>

                <div className="text-start px-2 offcan-tmplt-head f-16">
                  Customized templates
                </div>

                <div className="col-12" style={{ '--back-color': '#6DCCFF40', '--info-color': '#003A64', '--box-border': '#003A6420' }}>
                  <a type="button" className="btn px-3 text-start templt-menu-end-btn w-100 h-100 rounded-2 b-none">
                    <div className="templt-menu-end-btn-head f-16">Custom</div>
                    <div className="templt-menu-end-btn-info my-2 f-14">Customizable templates that fit your business</div>
                    <div className="f-14 brand-link">Try now</div>
                  </a>
                </div>

              </div>
            )}
          </div>


        </div>
      </div>


    </header>
  );
};

export default Header;
