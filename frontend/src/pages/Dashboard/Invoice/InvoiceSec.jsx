import React, { useState, useEffect } from 'react';
import srchLogo from "../../../assets/SVGs/search.svg";
import './InvoiceSec.css';
import api from '../../../services/api';

const InvcSection = () => {
    const [query, setQuery] = useState('');
    const [invoices, setInvoices] = useState([]); // State to hold invoice data

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await api.get('/invoices'); // Fetching invoices from the backend
                setInvoices(response.data); // Setting the fetched invoices to state
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };
        fetchInvoices();
    }, []);

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const filteredInvoices = invoices.filter(invoice => 
            invoice.i_id.toLowerCase().includes(query.toLowerCase()) || 
            invoice.c_name.toLowerCase().includes(query.toLowerCase())
        );
        setInvoices(filteredInvoices); // Update the state with filtered invoices
    };

    const handleEdit = (invoiceId) => {
        // Redirect to the edit page or open a modal with invoice details
        window.location.href = `/edit-invoice/${invoiceId}`; // Adjust the path as needed
    };

    const handleDelete = async (invoiceId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this invoice?');
        if (confirmDelete) {
            try {
                await api.delete(`/invoices/${invoiceId}`); // Call the delete API
                setInvoices(invoices.filter(invoice => invoice.i_id !== invoiceId)); // Update state
                alert('Invoice deleted successfully!');
            } catch (error) {
                console.error('Error deleting invoice:', error);
                alert('Failed to delete invoice.');
            }
        }
    };

    return (
        <div className="m-3">
            <div className="row p-0 m-0 w-100 justify-content-center my-4">
                <div className="col-lg-6">
                    <form className="d-flex justify-content-center" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={query}
                            onChange={handleChange}
                            placeholder="Search..."
                            aria-label="Search"
                            className="form-control search-bar px-5"
                        />
                        <button type="submit" className="btn brand-btn brand-btn-search px-3">
                            <img src={srchLogo} alt="Search" height="28" width="28" />
                        </button>
                    </form>
                </div>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Bill No</th>
                        <th>Customer name</th>
                        <th>Final Amount</th>
                        <th>Date Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice, index) => (
                        <tr key={invoice.i_id}>
                            <td>{index + 1}</td>
                            <td>{invoice.i_id}</td>
                            <td>{invoice.c_name}</td>
                            <td>{invoice.i_amnt_aft_tax}</td>
                            <td>{new Date(invoice.i_date).toLocaleDateString()}</td>
                            <td className="d-flex justify-content-center align-items-center gap-3">
                                <button className="btn b-rd-8 btn-success px-4">Share</button>
                                <button className="btn b-rd-8 btn-warning px-4">Download</button>
                                <button className="btn b-rd-8 btn-danger px-4" onClick={() => handleDelete(invoice.i_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvcSection;