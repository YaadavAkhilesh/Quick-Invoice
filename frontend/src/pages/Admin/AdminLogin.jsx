import React, { useState } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { PersonIcon,PasswordIcon,ErrorIcon,renderIcon } from "../../Components/icons/iconProvider";
import "./AdminLogin.css";

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login(formData.username, formData.password);
      if (!result.success) {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="container-fluid admlg-fluid p-0 m-0 vh-100 vw-100">
      <div className="container-fluid d-flex justify-content-center align-items-center p-0 m-0 h-100 w-100">

        <div className="admlgn-left-container h-100">

          <div className="card p-0 m-0 admlg-card">
            <form onSubmit={handleSubmit} noValidate>
              <div className="card-header py-3">
                <div className="admlg-title text-center f-34">Admin Panel</div>
              </div>
              <div className="card-body py-2">
                <div className="my-3 form-input">
                  <span className="input-group-text">
                    {renderIcon(PersonIcon, 38)}
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Superuser"
                    required
                  />
                </div>
                <div className="my-3 form-input">
                  <span className="input-group-text">
                    {renderIcon(PasswordIcon, 38)}
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Superuser Password"
                    required
                  />
                </div>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {renderIcon(ErrorIcon, 28,'var(--brand-error)')}
                    <span>  </span>
                    {error}
                  </div>
                )}
              </div>
              <div className="card-footer py-3 text-center">
                <button type="submit" className="btn brand-btn btn-danger px-4" aria-label="Admin Login">
                  Log in
                </button>
              </div>
            </form>
          </div>

        </div>

        <div className="admlgn-right-container h-100"></div>

      </div>
    </div>
  );
};

export default AdminLogin;