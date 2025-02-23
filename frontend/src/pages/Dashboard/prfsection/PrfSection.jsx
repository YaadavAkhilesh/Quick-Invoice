import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import usricon from "../../../assets/SVGs/usrprf.svg";
import erricon from "../../../assets/SVGs/error.svg";
import { profileService } from "../../../services/api";
import "./PrfSection.css";

const InputField = ({ label, name, value, onChange, type = "text", required = false, error, prefix }) => (

  <div className="col-xxl-4 col-xl-3 col-lg-6 col-md-4">

    <div className="prfdet-head f-16 py-1">{label}</div>

    <div className={`input-group ${prefix ? 'input-group-prepend' : ''}`}>
      {prefix && <div className="input-group-text">{prefix}</div>}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        required={required}
      />

    </div>

    {error && (
      <div className="invalid-feedback d-flex align-items-center gap-1 f-14 my-3">
        <img src={erricon} alt="Error icon" className="error-icon me-1" height="15" width="15" />
        <div>{error}</div>
      </div>
    )}

  </div>

);

const ProfileForm = ({ formData, handleChange, handleSubmit, errors }) => (

  <form onSubmit={handleSubmit} className="w-100" noValidate>

    <div className="row p-0 m-0 gy-4">
      {Object.keys(formData).map((key) => (

        <InputField
          key={key}
          label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} // Convert camelCase to readable format
          name={key}
          value={formData[key]}
          onChange={handleChange}
          required
          error={errors[key]}
          type={key === 'email' ? 'email' : key === 'telephone' ? 'tel' : 'text'}
        />

      ))}
    </div>

  </form>

);

const PrfSection = () => {

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    brandName: "", // Will show v_name
    ownerName: "", // Will show v_username
    telephone: "",
    email: "",
    address: "",
    businessCode: "",
    businessType: "",
  });

  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState('');
  const [displayUsername, setDisplayUsername] = useState(""); // For username below profile pic

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await profileService.getProfile();
      
      // Get the vendor data from the response
      const vendorData = response?.vendor;
      console.log('Vendor Data from API:', vendorData);
      
      if (!vendorData) {
        throw new Error('No vendor data available');
      }

      // Map the vendor data to our form fields
      const mappedData = {
        brandName: vendorData.v_brand_name || '',
        ownerName: vendorData.v_name || '',
        telephone: vendorData.v_telephone || '',
        email: vendorData.v_mail || '',
        address: vendorData.v_address || '',
        businessCode: vendorData.v_business_code || '',
        businessType: vendorData.v_business_type || '',
      };
      
      console.log('Mapped Form Data:', mappedData);
      
      // Update the form with mapped data
      setFormData(mappedData);
      
      // Set username below profile picture
      setDisplayUsername(vendorData.v_username || '');

      try {
        // Try to fetch profile image
        const imageResponse = await profileService.getProfileImage(vendorData.v_id);
        if (imageResponse) {
          setProfileImage(imageResponse);
          console.log('Profile image loaded successfully');
        } else {
          console.log('No profile image found');
          setProfileImage(''); // Reset to default if no image
        }
      } catch (imageError) {
        console.error('Error fetching profile image:', imageError);
        setProfileImage(''); // Reset to default on error
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setIsLoading(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="prf-section h-100 w-100 b-rd-8 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Upload the file directly
        const response = await profileService.uploadProfileImage(file);
        if (response && response.success) {
          // Get the full image URL
          const imageUrl = `http://localhost:5000${response.imagePath}`;
          setProfileImage(imageUrl);
          console.log('Profile image updated successfully');
          
          // Refresh profile data to ensure we have the latest image
          await fetchProfileData();
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error updating profile image:', error);
        setErrors({ submit: 'Failed to update profile image. Please try again.' });
      }
    }
  };

  const validate = () => {

    const newErrors = {};
    const requiredFields = [
      "brandName", "ownerName", "telephone", "email", "address", "businessCode", "businessType"
    ];

    requiredFields.forEach((key) => {
      if (!formData[key]) newErrors[key] = `${key.replace(/([A-Z])/g, ' $1')} is required.`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const updatedData = {
          ...formData,
          profileImage: profileImage || null
        };
        await profileService.updateProfile(updatedData);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating profile:', error);
        setErrors({ submit: 'Failed to update profile. Please try again.' });
      }
    }
  };

  return (
    <div className="prf-section h-100 w-100 b-rd-8">

      <div className="row align-items-center prf-section-row p-0 m-0 justify-content-center pb-4">

        <div className="col-4 d-flex align-items-center flex-column gap-3">
          <img 
            src={profileImage || usricon} 
            alt="Profile" 
            height="128" 
            width="128" 
            className="d-block mx-auto rounded-circle"
            style={{ 
              objectFit: 'cover', 
              border: '2px solid var(--brand-primary)',
              backgroundColor: 'white'
            }}
            crossOrigin="anonymous"
            onError={(e) => {
              console.log('Image load error, falling back to default');
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = usricon;
            }}
          />
          <div className="prfdet-txt f-22">{displayUsername}</div>
        </div>

        <div className="col-8">

          {isEditing ? (
            <ProfileForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              errors={errors}
            />
          ) : (
            <div className="row p-0 m-0 gy-4">
              {Object.keys(formData).map((key) => (
                <div className="col-xxl-4 col-xl-3 col-lg-6 col-md-5" key={key}>
                  <div className="prfdet-head f-16 py-1">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                  <div className="prfdet-txt f-15">{formData[key]}</div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      <div className="row p-0 m-0 prf-section-action-row sticky-bottom">

        <div className="d-flex align-items-center justify-content-center py-2 gap-3">

          {isEditing ? (
            <>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="d-none"
                id="file-upload"
              />
              <button type="button" className="col-auto btn brand-btn f-18 px-4" onClick={() => document.getElementById('file-upload').click()} style={{ backgroundColor: 'var(--brand-warning)', border: 'none', color: 'var(--brand-primary-dark)' }}>Change Logo</button>
              <button type="submit" className="col-auto btn brand-btn f-18 px-4" onClick={handleSubmit} style={{ backgroundColor: 'var(--brand-error)', border: 'none', color: 'var(--brand-primary-dark)' }}>Save</button>
              <button className="col-auto btn brand-btn f-18 px-4" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button className="col-auto btn brand-btn f-18 px-4" onClick={() => setIsEditing(true)} style={{ backgroundColor: 'var(--brand-success)', border: 'none', color: 'var(--brand-primary-dark)' }}>Edit Details</button>
              <Link to="/FrgPass" className="col-auto btn brand-btn f-18 px-4" style={{ backgroundColor: 'var(--brand-warning)', border: 'none', color: 'var(--brand-primary-dark)' }} >Change Password</Link>
            </>
          )}

        </div>

      </div>

    </div>

  );
};

export default PrfSection;