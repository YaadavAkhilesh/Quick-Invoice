import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { authService, profileService } from "../../services/api";
import Logo from "../../assets/SVGs/brand.svg";
import usrprf from "../../assets/SVGs/usrprf.svg";
import './Dashbar.css';


const Dashbar = () => {

    const [showUsrprf, setshowUsrprf] = useState(false);
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const menuRef = useRef(null);
    const usrprfRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch vendor profile when component mounts
        const fetchProfile = async () => {
            try {
                const response = await profileService.getProfile();
                if (response?.vendor) {
                    setUsername(response.vendor.v_username || '');
                    
                    // Try to fetch profile image
                    if (response.vendor.v_id) {
                        const imageResponse = await profileService.getProfileImage(response.vendor.v_id);
                        // console.log('Profile image URL:', imageResponse); // Debug log
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
        fetchProfile();
    }, []);

    const handleNavigateButtonClick = () => {
        navigate("/");
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const handleClickOutside = (event) => {
        if (
            menuRef.current && !menuRef.current.contains(event.target) &&
            usrprfRef.current && !usrprfRef.current.contains(event.target)
        ) {
            setshowUsrprf(false);
        }
    };

    const handleResize = () => {
        if (window.innerWidth >= 1400) {
            setshowUsrprf(false);
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

    const toggleUsrprfMenu = () => {
        setshowUsrprf(prevState => !prevState);
    }


    return (
        <header className="m-0">

            <nav className="navbar px-3 dashbar">
                <div className="container-fluid p-0 m-0 align-items-center">

                    <div className="d-flex align-items-center">
                        <img src={Logo} className="brand-logo" alt="Brand Logo" />
                    </div>

                    <div className="d-flex gap-3">
                        <div ref={usrprfRef}>
                            <button className={`btn p-0 m-0 usrprf ${showUsrprf ? 'hover' : ''} position-relative`} onClick={toggleUsrprfMenu}>
                                <img 
                                    src={profileImage || usrprf} 
                                    alt="Profile" 
                                    height="34" 
                                    width="34" 
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
                    </div>

                </div>
            </nav>

            {showUsrprf && (
                <div className="container-xxl fixed-top p-0 dashbar-usrprf-fluid p-0 b-rd-8" onMouseLeave={() => { setshowUsrprf(false); }}>
                    <div className="d-flex justify-content-between">

                        <div className="row g-0 p-0 w-100 dashbar-usrprf-menu">
                            <div className="col-12 dashbar-usrprf-menu-left b-rd-8 px-3">

                                <div className="f-18 text-center w-100 px-4 py-3 px-0">Hi, {username}</div>
                                <button className="d-block btn brand-btn mx-auto f-18 w-100 my-2" onClick={handleNavigateButtonClick}>Home</button>
                                <button className="d-block btn brand-btn mx-auto f-18 w-100 my-3" onClick={handleLogout}>Logout</button>

                            </div>
                        </div>

                    </div>
                </div>

            )}


        </header>

    );
};

export default Dashbar;