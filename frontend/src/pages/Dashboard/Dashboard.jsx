import React, { useState } from 'react';
import Dashbar from '../../Components/Dashbar/Dashbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import PrfSection from './prfsection/PrfSection';
import TmpltSection from './Templates/TmpltSec';
import InvcSection from './Invoice/InvoiceSec';
import Editor from './Editor/editor';
import './Dashboard.css';

const Dashboard = () => {
    const [selectedTab, setSelectedTab] = useState('PrfSection');

    const renderContent = () => {
        switch (selectedTab) {
            case 'PrfSection':
                return <PrfSection />;
            case 'TmpltSection':
                return <TmpltSection />;
            case 'InvcSection':
                return <InvcSection />;
            case 'Editor':
                return <Editor />;
            default:
                return <PrfSection />;
        }
    };

    return (
        <div className="dashboard dash-fluid vh-100 vw-100 d-flex">
            <Dashbar />
            <Sidebar onSelect={setSelectedTab} />
            <div className="dash-content-fluid">
                {renderContent()}
            </div>
        </div>
    );
};

export default Dashboard;