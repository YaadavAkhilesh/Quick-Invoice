/**
 * Dashbar Component
 *
 * Dashboard navigation bar with user profile menu.
 * Optimized with React.memo for performance.
 */

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { authService, profileService } from "../../services/api";
import Logo from "../../assets/SVGs/brand.svg";

import { ReceiptIcon, EditIcon, DocIcon, SettingRoundedIcon, HomeRoundedIcon, UserIconStyled, renderIcon } from '../../Components/icons/iconProvider';

import './Dashbar.css';

const usrprf = renderIcon(UserIconStyled);

const menuItems = [
    { to: "/Dashboard", icon: renderIcon(SettingRoundedIcon), label: "Update Profile" },
    { to: "/Dashboard/InvcSection", icon: renderIcon(ReceiptIcon), label: "My Invoices" },
    { to: "/Dashboard/TmpltSection", icon: renderIcon(DocIcon), label: "My Templates" },
    { to: "/Dashboard/Editor", icon: renderIcon(EditIcon), label: "Editor" }
];


const Dashbar = () => {
    const [showUsrprf, setshowUsrprf] = useState(false);
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState(usrprf);
    const menuRef = useRef(null);
    const usrprfRef = useRef(null);

    const navigate = useNavigate();

    // Fetch vendor profile data
    const fetchProfile = useCallback(async () => {
        try {
            const response = await profileService.getProfile();
            if (response?.vendor) {
                setUsername(response.vendor.v_brand_name || '');

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
            setProfileImage(usrprf);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleNavigateButtonClick = useCallback(() => {
        navigate("/");
    }, [navigate]);

    const handleBrndRdrct = useCallback(() => {
        navigate("/");
    }, [navigate]);

    const handleLogout = useCallback(() => {
        authService.logout();
        navigate('/login');
    }, [navigate]);

    const handleClickOutside = useCallback((event) => {
        if (
            menuRef.current && !menuRef.current.contains(event.target) &&
            usrprfRef.current && !usrprfRef.current.contains(event.target)
        ) {
            setshowUsrprf(false);
        }
    }, []);

    const handleResize = useCallback(() => {
        if (window.innerWidth >= 1400) {
            setshowUsrprf(false);
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

    const toggleUsrprfMenu = useCallback(() => {
        setshowUsrprf(prevState => !prevState);
    }, []);


    return (
        <header className="m-0">

            <nav className="navbar fixed-top px-3 dashbar">
                <div className="container-fluid p-0 m-0 align-items-center">

                    <div className="d-flex align-items-center">
                        <img src={Logo} className="brand-logo" alt="Brand Logo" onClick={handleBrndRdrct} />
                    </div>

                    <div className="d-flex gap-3 align-items-center">
                        <div className="f-20 text-center dashbar-usrnm">{username}</div>
                        <div ref={usrprfRef}>
                            <div className={`p-0 m-0 usrprf rounded-circle ${showUsrprf ? 'hover' : ''} position-relative`}>
                                <img
                                    src={profileImage || usrprf}
                                    alt="Profile"
                                    height="48px"
                                    width="48px"
                                    role="button"
                                    className="dshbar-prf-img rounded-circle p-0 m-0"
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
                        </div>
                    </div>

                </div>
            </nav>

            {showUsrprf && (

                <div className="container-xxl fixed-top p-0 usrprf-menu-container dashbar-usrprf-fluid mx-3" onMouseLeave={() => { setshowUsrprf(false); }}>
                    <div className="usrprf-menu g-0 px-3 py-3 b-rd-8">

                        {menuItems.map((item, index) => {
                            return (
                                <div key={index} className="py-1">
                                    <Link to={item.to} type="button" className="btn px-2 usrprf-menu-btn b-none d-flex justify-content-start align-items-center gap-2">
                                        {item.icon}
                                        <div className="f-18 usrprf-menu-btn-head">{item.label}</div>
                                    </Link>
                                </div>
                            );
                        })}

                        <hr />
                        <div className="d-flex justify-content-center align-items-center gap-2">
                            <button className="w-100 btn brand-btn lgbt f-18" onClick={handleLogout}>Logout</button>
                            <button className="btn hmbt" onClick={handleBrndRdrct}>
                                <HomeRoundedIcon sx={
                                    { color: "var(--brand-primary)", fontSize: 36 }
                                } />
                            </button>
                        </div>

                    </div>
                </div>

            )}


        </header>

    );
};

export default memo(Dashbar);
