import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Dashbar from '../../Components/Dashbar/Dashbar';
import PrfSection from './prfsection/PrfSection';
import TmpltSection from './Templates/TmpltSec';
import InvcSection from './Invoice/InvoiceSec';
import Editor from './Editor/editor';
import './Dashboard.css';

const Dashboard = () => {
    const { section } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(section || 'PrfSection');
    const [templateId, setTemplateId] = useState(null);

    useEffect(() => {
        const newTab = section || 'PrfSection';
        setSelectedTab(newTab);

        // Handle state from location if available
        if (location.state) {
            const { selectedTab: newTabFromState, templateId: newTemplateId } = location.state;
            if (newTabFromState) {
                setSelectedTab(newTabFromState);
                // Only set template ID if coming directly from template edit
                if (newTabFromState === 'Editor' && newTemplateId && location.state.fromEdit) {
                    setTemplateId(newTemplateId);
                } else {
                    setTemplateId(null);
                }
            }
        }
    }, [location.state, section]);

    const renderContent = () => {
        switch (selectedTab) {
            case 'PrfSection':
                return <PrfSection />;
            case 'TmpltSection':
                return <TmpltSection />;
            case 'InvcSection':
                return <InvcSection />;
            case 'Editor':
                return <Editor templateId={templateId} />;
            default:
                return <PrfSection />;
        }
    };

    return (
        <div className="dashboard dash-fluid">
            <Dashbar />
            <div className="p-0 m-0">
                {renderContent()}
            </div>
        </div>
    );
};

export default Dashboard;
