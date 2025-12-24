/**
 * PrfSection Component
 *
 * Modern profile management section with edit functionality.
 * Optimized with React.memo for performance.
 */

import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Link } from "react-router-dom";

import { UserIconStyled , HomeWorkIcon , PersonIcon , PhoneIcon , EmailIcon , LocationIcon , BusinessIcon , ErrorIcon,renderIcon } from '../../../Components/icons/iconProvider';

import { profileService, BASE_URL } from "../../../services/api";
import "./PrfSection.css";

const usricon = renderIcon(UserIconStyled);

// Field icons mapping
const fieldIcons = {
  brandName: renderIcon(HomeWorkIcon,48),
  ownerName: renderIcon(PersonIcon,48),
  telephone: renderIcon(PhoneIcon,48),
  email: renderIcon(EmailIcon,48),
  address: renderIcon(LocationIcon,48),
  businessCode: renderIcon(BusinessIcon,48),
  businessType: renderIcon(BusinessIcon,48),
};

const InputField = memo(({ label, name, value, onChange, type = "text", required = false, error, icon }) => (
  <div className="mb-3">
    <label className="form-label f-1 fw-medium">{label}</label>
    <div className="input-group">
      {icon && <span className="input-group-text bg-light input-icon">{icon}</span>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-control f-18 ${error ? 'is-invalid' : ''}`}
        required={required}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
    {error && (
      <div className="invalid-feedback d-flex align-items-center">
        {renderIcon(ErrorIcon,22)}
        <span className="f-16">{error}</span>
      </div>
    )}
  </div>
));

const InfoCard = memo(({ label, value, icon }) => (
  <div className="d-flex align-items-center p-3 rounded info-card">
    <div className="me-3">
      {icon}
    </div>
    <div className="flex-grow-1">
      <div className="f-16 mb-1 info-card-key">{label}</div>
      <div className="f-18 info-card-value" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>{value}</div>
    </div>
  </div>
));

const ProfileForm = memo(({ formData, handleChange, handleSubmit, errors }) => (
  <form onSubmit={handleSubmit} noValidate>
    <div className="row g-3">
      {Object.keys(formData).map((key) => (
        <div key={key} className="col-12 col-xl-6">
          <InputField
            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            required
            error={errors[key]}
            icon={fieldIcons[key]}
            type={key === 'email' ? 'email' : key === 'telephone' ? 'tel' : 'text'}
          />
        </div>
      ))}
    </div>
  </form>
));

const PrfSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    brandName: "",
    ownerName: "",
    telephone: "",
    email: "",
    address: "",
    businessCode: "",
    businessType: "",
  });

  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(usricon);
  const [displayUsername, setDisplayUsername] = useState("");

  const fetchProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await profileService.getProfile();
      const vendorData = response?.vendor;

      if (!vendorData) {
        throw new Error('No vendor data available');
      }

      const mappedData = {
        brandName: vendorData.v_brand_name || '',
        ownerName: vendorData.v_name || '',
        telephone: vendorData.v_telephone || '',
        email: vendorData.v_mail || '',
        address: vendorData.v_address || '',
        businessCode: vendorData.v_business_code || '',
        businessType: vendorData.v_business_type || '',
      };

      setFormData(mappedData);
      setDisplayUsername(vendorData.v_username || '');

      // Fetch profile image
      if (vendorData.v_profile_image) {
        try {
          const imageResponse = await profileService.getProfileImage();
          if (imageResponse) {
            setProfileImage(imageResponse);
          } else {
            setProfileImage(usricon);
          }
        } catch (error) {
          console.error('Error fetching profile image:', error);
          setProfileImage(usricon);
        }
      } else {
        setProfileImage(usricon);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileImage(usricon);
      setIsLoading(false);
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handlePrfDetCancelBtn = useCallback(() => {
    setIsEditing(false);
    window.location.reload();
  }, []);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const response = await profileService.uploadProfileImage(file);
        if (response && response.success) {
          const imageUrl = `${BASE_URL}${response.imagePath}`;
          setProfileImage(imageUrl);
          console.log('Profile image updated successfully');
          window.location.reload();
          await fetchProfileData(); // Refresh profile data to ensure we have the latest image
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error updating profile image:', error);
        setErrors({ submit: 'Failed to update profile image. Please try again.' });
      }
    }
  }, [fetchProfileData]);

  const validate = useCallback(() => {
    const newErrors = {};
    const requiredFields = [
      "brandName", "ownerName", "telephone", "email", "address", "businessCode", "businessType"
    ];

    requiredFields.forEach((key) => {
      if (!formData[key]) newErrors[key] = `${key.replace(/([A-Z])/g, ' $1')} is required.`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (validate()) {
      try {
        const updatedData = {
          ...formData,
          profileImage: profileImage || null
        };
        await profileService.updateProfile(updatedData);
        setIsEditing(false);
        window.location.reload();
        await fetchProfileData(); // Reload profile data after saving changes
      } catch (error) {
        console.error('Error updating profile:', error);
        setErrors({ submit: 'Failed to update profile. Please try again.' });
      }
    }
  }, [formData, profileImage, validate, fetchProfileData]);

  const infoCards = useMemo(() => Object.keys(formData).map((key) => (
    <div key={key} className="col-12 col-xxl-4 col-xl-6">
      <InfoCard
        label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        value={formData[key]}
        icon={fieldIcons[key]}
      />
    </div>
  )), [formData]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (isLoading) {
    return (
      <div className="container-fluid p-3 h-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3">
      <div className="row prf-header m-0 p-0 g-0 mx-4">
        <div className="col-12">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center p-3 bg-white rounded">
            <div className="d-flex align-items-center gap-3">
              <div className="text-center">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: '128px', height: '128px', objectFit: 'cover' }}
                  crossOrigin="anonymous"
                  onError={(e) => { e.target.src = usricon; }}
                />
              </div>
              <div>
                <h5 className="mb-1 f-20 text-dark">{displayUsername}</h5>
                <p className="mb-0 f-16 text-muted">{formData.brandName}</p>
              </div>
            </div>
            <div className="d-flex gap-2">
              {isEditing && (
                <button
                  className="btn brand-btn f-18 mx-2"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  Change Logo
                </button>
              )}
              {isEditing ? (
                <>
                  <button className="btn btn-danger f-18 px-3" onClick={handleSubmit}>Save Changes</button>
                  <button className="btn btn-warning f-18 px-3" onClick={handlePrfDetCancelBtn}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="btn btn-success f-18 px-3" onClick={() => setIsEditing(true)}>Edit Profile</button>
                  <Link to="/FrgPass" className="btn btn-warning f-18 px-3 text-dark text-decoration-none">Change Password</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="bg-white rounded p-4">
            {isEditing ? (
              <ProfileForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                errors={errors}
              />
            ) : (
              <div className="row g-3">
                {infoCards}
              </div>
            )}
          </div>
        </div>
      </div>
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="d-none"
        id="file-upload"
      />
    </div>
  );
};

export default memo(PrfSection);
