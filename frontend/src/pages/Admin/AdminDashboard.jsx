import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from "../../assets/SVGs/brand.svg";
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import delIcon from "../../assets/SVGs/delete_sec.svg";
import "./AdminDashboard.css";

/**
 * AdminDashboard Component
 *
 * This component provides an administrative interface for managing users.
 * Features include:
 * - Viewing all registered users with their details
 * - Displaying active user count
 * - Deleting users from the system
 * - Automatic session management and logout
 * - Real-time user data updates every 30 seconds
 */
const AdminDashboard = () => {
    // Navigation hook for routing
    const navigate = useNavigate();

    // State management for users data
    const [users, setUsers] = useState([]);
    const [activeUsers, setActiveUsers] = useState(0);

    // Admin authentication context
    const { admin, logout } = useAdminAuth();







    /**
     * Fetches all users from the admin API endpoint
     * Updates the users state and calculates active users count
     * Handles authentication errors by logging out expired sessions
     */
    const fetchUsers = async () => {
        try {
            // Make API call to fetch users with admin token
            const response = await axios.get('http://localhost:5000/api/admin/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            // Validate response data structure
            if (response.data && response.data.success && Array.isArray(response.data.data)) {
                setUsers(response.data.data);
                // Count users who are currently logged in
                setActiveUsers(response.data.data.filter(user => user.isLoggedIn).length);
            } else {
                // Handle invalid data format
                setUsers([]);
                setActiveUsers(0);
                console.error('Invalid data format received:', response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);

            // Handle authentication errors
            if (error.response?.status === 401) {
                alert('Session expired. Please login again!');
                logout();
            } else {
                alert(error.response?.data?.message || 'Failed to fetch users');
            }

            // Reset state on error
            setUsers([]);
            setActiveUsers(0);
        }
    };

    /**
     * Handles user deletion with confirmation dialog
     * @param {string} userId - The ID of the user to delete
     */
    const handleDeleteUser = async (userId) => {
        // Confirm deletion with user
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            // Make API call to delete user
            await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            // Show success message and refresh user list
            alert('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    // Fetch users on component mount and set up auto-refresh every 30 seconds
    useEffect(() => {
        fetchUsers();
        const intervalId = setInterval(fetchUsers, 30000); // Refresh every 30 seconds
        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);

    /**
     * Handles admin logout
     * Clears session and redirects to admin login page
     */
    const handleLogout = () => {
        logout();
        console.log('Admin logged out. Clearing session...');
        navigate('/admin/login');
    };

    return (
        <div className="container-fluid p-0">
            {/* Navigation bar with logo and logout button */}
            <nav className="navbar fixed-top navbar-expand-xxl px-3 adm-navbar">
                <div className="container-fluid d-flex justify-content-between align-items-center p-0 m-0">
                    <img src={Logo} className="brand-logo" alt="Brand Logo" />
                    <div className="ms-auto">
                        <button className="btn brand-btn px-4" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>

            {/* Main content area */}
            <div className="container adm-content-fluid p-4">
                {/* Active users counter display */}
                <div className="adm-ttl-users text-center mx-auto mb-4 p-3">
                    <div className="adm-ttl-users-main px-5">
                        <div className="f-40 brand-link" style={{ fontWeight: '500' }}>{activeUsers}</div>
                        <div className="f-28">Users</div>
                    </div>
                </div>

                {/* Users table with responsive design */}
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="admheadrow">
                            <tr style={{ backgroundColor: '#4169e1' }}>
                                <th>Username</th>
                                <th>Owner</th>
                                <th>Email</th>
                                <th>Invoices Generated</th>
                                <th>Custom Templates</th>
                                <th>Subscription Plan</th>
                                <th>Subscription Due</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.brandName}</td>
                                    <td>{user.ownerName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.invoiceCount || 0}</td>
                                    <td>{user.templateCount}</td>
                                    <td>
                                        {/* Subscription plan badge with conditional styling */}
                                        <span style={{
                                            color: '#212f3d',
                                            fontWeight: 'bold',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            backgroundColor: user.subscriptionPlan === 'Premium' ? 'rgba(0, 255, 89, 0.36)' : 'rgba(0, 0, 0, 0.1)',
                                            fontSize: '0.9rem'
                                        }}>
                                            {user.subscriptionPlan || 'Free'}
                                        </span>
                                    </td>
                                    <td>
                                        {/* Format subscription end date or show N/A */}
                                        {user.subscriptionEndDate
                                            ? new Date(user.subscriptionEndDate).toLocaleDateString()
                                            : 'N/A'}
                                    </td>
                                    <td>
                                        {/* Delete user action button */}
                                        <img
                                            src={delIcon}
                                            alt="Delete Vendor"
                                            height="28"
                                            width="28"
                                            onClick={() => handleDeleteUser(user._id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;