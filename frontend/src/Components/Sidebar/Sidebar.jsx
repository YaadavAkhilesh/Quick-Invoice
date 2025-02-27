import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import usricon from "../../assets/SVGs/usrprf.svg";
import tmplticon from "../../assets/SVGs/UI_2.svg";
import invcicon from "../../assets/SVGs/invoice_icon.svg";
import edtricon from "../../assets/SVGs/editor.svg";
import { profileService } from "../../services/api";

const Sidebar = ({ onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await profileService.getProfile();
        if (response?.vendor?.v_id) {
          const imageResponse = await profileService.getProfileImage(response.vendor.v_id);
          if (imageResponse) {
            setProfileImage(imageResponse);
          }
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
        setProfileImage('');
      }
    };
    fetchProfileImage();
  }, []);

  const items = [
    { 
      image: profileImage || usricon, 
      title: 'Account', 
      section: 'PrfSection',
      isProfileImage: true 
    },
    { image: tmplticon, title: 'Templates', section: 'TmpltSection' },
    { image: invcicon, title: 'Invoices', section: 'InvcSection' },
    { image: edtricon, title: 'Editor', section: 'Editor' }
  ];

  return (
    <aside className={`sidebar-fluid ${isHovered ? 'expanded' : ''} p-0`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <nav className="sidebar w-100 py-1">
        {items.map((item, index) => (
          <div key={index} className="sidebar-item d-flex justify-content-start align-items-center py-2 w-100 gap-2">
            <div className="p-0 m-0 sidebar-icon">
              <img 
                src={item.image} 
                alt={item.title} 
                className={`icon ${item.isProfileImage ? 'rounded-circle' : ''}`}
                height="36" 
                width="36"
                style={item.isProfileImage ? {
                  objectFit: 'cover',
                  backgroundColor: 'white',
                  border: '1px solid var(--brand-primary)'
                } : {}}
                crossOrigin={item.isProfileImage ? "anonymous" : undefined}
                onError={item.isProfileImage ? (e) => {
                  console.log('Sidebar profile image load error, falling back to default');
                  e.target.onerror = null;
                  e.target.src = usricon;
                } : undefined}
              />
            </div>

            <button
              className="btn sidebar-button text-start px-1 py-23 f-16 px-3 w-100"
              onClick={() => onSelect(item.section)}
            >
              <span className={`title ${isHovered ? 'show' : ''}`}>
                {item.title}
              </span>
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;