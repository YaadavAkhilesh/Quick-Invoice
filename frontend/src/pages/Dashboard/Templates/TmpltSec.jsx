import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import deleteIcon from '../../../assets/SVGs/delete_sec.svg';
import './TmpltSec.css';


const TmpltSection = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFilteredTemplates] = useState([]);


    useEffect(() => {
        fetchTemplates();
    }, []);

    useEffect(() => {
        filterTemplates();
    }, [query, templates]);

    const fetchTemplates = async () => {
        try {
            const response = await api.get('/templates');
            if (response.data) {
                setTemplates(response.data);
                setFilteredTemplates(response.data);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
            alert('Failed to fetch templates');
        }
    };

    const handleChange = useCallback((e) => {
        setQuery(e.target.value);
    }, []);

    const filterTemplates = useCallback(() => {
        if (!query.trim()) {
            setFilteredTemplates(templates);
            return;
        }

        const filtered = templates.filter(template =>
            template.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredTemplates(filtered);
    }, [query, templates]);

    const handleEdit = useCallback((templateId) => {
        navigate('/Dashboard/Editor', {
            state: {
                selectedTab: 'Editor',
                templateId: templateId,
                fromEdit: true
            }
        });
    }, [navigate]);

    const handleDelete = useCallback(async (templateId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this template?');
        if (!confirmDelete) return;

        try {
            await api.delete(`/templates/${templateId}`);
            setTemplates(prev => prev.filter(t => t.t_id !== templateId));
            alert('Template deleted successfully!');
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('Failed to delete template');
        }
    }, []);





    return (
        <div className="p-4">
            <div className="row p-0 m-0 w-100 justify-content-center my-4 b-rd-8 text-center">
                <div className="col-lg-6">
                    <div className="d-flex justify-content-center">
                        <input
                            type="text"
                            value={query}
                            onChange={handleChange}
                            placeholder="Search templates..."
                            aria-label="Search"
                            className="form-control search-bar px-5 f-18"
                        />
                    </div>
                </div>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Template name</th>
                        <th>Date Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTemplates.map((template, index) => (
                        <tr key={template.t_id}>
                            <td>{index + 1}</td>
                            <td>{template.name}</td>
                            <td>{new Date(template.created_at).toLocaleDateString()}</td>
                            <td className="d-flex justify-content-center align-items-center gap-3">
                                <button
                                    className="btn b-rd-8 btn-warning px-4"
                                    onClick={() => handleEdit(template.t_id)}
                                >
                                    Use in Editor
                                </button>
                                <img
                                    src={deleteIcon}
                                    role="button"
                                    onClick={() => handleDelete(template.t_id)}
                                    alt="Delete"
                                    height="38"
                                    width="38"
                                />
                            </td>
                        </tr>
                    ))}
                    {filteredTemplates.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center fw-medium text-danger">No templates found ..</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default memo(TmpltSection);
