import React from 'react';
import Dashbar from '../../Components/Dashbar/Dashbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import PrfSection from './prfsection/PrfSection';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard dash-fluid vh-100 vw-100 d-flex">

            <Dashbar />

            <Sidebar />

            <div className="dash-content-fluid">
                <PrfSection />
            </div>

        </div>
    );
};

export default Dashboard;