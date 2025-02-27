import React, { useState } from 'react';
import srchLogo from "../../../assets/SVGs/search.svg";
import './TmpltSec.css';

const TmpltSection = () => {

    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
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
                        <th>Template name</th>
                        <th>Date Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Simple</td>
                        <td>30/02/2025</td>
                        <td className="d-flex justify-content-center align-items-center gap-3">
                            <button className="btn b-rd-8 btn-warning px-4">Edit</button>
                            <button className="btn b-rd-8 btn-danger px-4">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
};

export default TmpltSection;