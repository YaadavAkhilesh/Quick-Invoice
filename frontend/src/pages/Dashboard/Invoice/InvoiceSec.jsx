import React, { useState, useEffect, useCallback, memo } from 'react';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import InvoicePDF from '../Editor/Main/PDFEngine';
import api, { profileService } from "../../../services/api";
import deleteIcon from '../../../assets/SVGs/delete_sec.svg';

import './InvoiceSec.css';

const InvcSection = () => {
    const [query, setQuery] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);

    const [loadingInvoiceId, setLoadingInvoiceId] = useState(null);
    const [profileImage, setProfileImage] = useState('');
    const [vendorData, setVendorData] = useState(null);
    const [loadingVendor, setLoadingVendor] = useState(true);
    const [vendorError, setVendorError] = useState(null);

    // Fetch vendor data
    useEffect(() => {
        const fetchVendorData = async () => {
            setLoadingVendor(true);
            try {
                const response = await profileService.getProfile();
                console.log('Vendor data:', response);
                if (response && response.vendor) {
                    setVendorData(response.vendor);
                    const imageResponse = await profileService.getProfileImage(response.vendor.v_id);
                    if (imageResponse) {
                        setProfileImage(imageResponse);
                    }
                } else {
                    throw new Error("Vendor data not found.");
                }
            } catch (error) {
                setVendorError(error);
            } finally {
                setLoadingVendor(false);
            }
        };
        fetchVendorData();
    }, []);

    // Fetch invoices
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await api.get('/invoices');
                setInvoices(response.data);
                setFilteredInvoices(response.data);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };
        fetchInvoices();
    }, []);

    // Filter invoices based on search query
    useEffect(() => {
        filterInvoices();
    }, [query, invoices]);

    const handleChange = useCallback((e) => {
        setQuery(e.target.value);
    }, []);

    const filterInvoices = useCallback(() => {
        if (!query.trim()) {
            setFilteredInvoices(invoices);
            return;
        }

        const filtered = invoices.filter(invoice =>
            invoice.i_id.toLowerCase().includes(query.toLowerCase()) ||
            invoice.c_name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredInvoices(filtered);
    }, [query, invoices]);



    const handleDelete = useCallback(async (invoiceId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this invoice?');
        if (!confirmDelete) return;

        try {
            await api.delete(`/invoices/${invoiceId}`);
            setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.i_id !== invoiceId));
            alert('Invoice deleted successfully!');
        } catch (error) {
            console.error('Error deleting invoice:', error);
            alert('Failed to delete invoice');
        }
    }, []);

    const getVisibleFields = (invoice) => {

        const v_field_state = invoice.v_field_state || {};

        return {
            companyweblink: v_field_state.companyweblink || false, // Use the state from v_field_state
            companyownnm: v_field_state.companyownnm || false,
            companyidnum: v_field_state.companyidnum || false,
            customerAddress: !!invoice.c_address,
            customerTelephone: !!invoice.c_mobile,
            customerIdnum: !!invoice.c_tax_id,
            shippedFrom: !!invoice.shipped_from,
            shippingTo: !!invoice.shipping_to,
            tax: !!invoice.i_tax,
            discount: !!invoice.i_discount,
            cutoff: !!invoice.i_cutoff,
            taxrow: !!invoice.i_product_det_obj.some(item => item.tax),
            discountrow: !!invoice.i_product_det_obj.some(item => item.discount),
            shipCharge: !!invoice.i_shipping_charge,
            pymntmthd: !!invoice.i_payment_method,
            pymntNumber: !!invoice.i_payment_details?.number,
            pymntAcdetails: !!invoice.i_payment_details?.account,
            pymntid: !!invoice.i_payment_details?.id,
            signature: !!invoice.v_signature,
            notes: !!invoice.i_notes,
            termscon: !!invoice.i_terms,
            grndinword: v_field_state.grndinword || false,
        };

    };



    const transformInvoiceData = (invoice, vendorData) => {
        const {
            i_id,
            i_date,
            c_name,
            c_mail,
            c_mobile,
            c_address,
            c_tax_id,
            shipped_from,
            shipping_to,
            i_product_det_obj,
            i_total_amnt,
            i_tax,
            i_amnt_aft_tax,
            i_discount,
            i_shipping_charge,
            i_cutoff,
            i_notes,
            i_terms,
            i_payment_method,
            i_payment_details,
        } = invoice;

        return {
            company: {
                name: vendorData?.v_brand_name || '',
                address: vendorData?.v_address || '',
                email: vendorData?.v_mail || '',
                phone: vendorData?.v_telephone || '',
                companyweblink: vendorData?.v_website || '',
                companyownnm: vendorData?.v_name || '',
                companyidnum: vendorData?.v_business_code || '',
                logo: vendorData?.v_logo || null,
                signature: vendorData?.v_signature || '',
            },
            invoiceNumber: i_id,
            date: new Date(i_date).toISOString().split("T")[0],
            customer: {
                name: c_name || '',
                email: c_mail || '',
                address: c_address || '',
                phone: c_mobile || '',
                idnum: c_tax_id || '',
            },
            shipFrm: shipped_from || '',
            shipTo: shipping_to || '',
            items: i_product_det_obj.map(item => ({
                description: item.description || '',
                measurements: item.measurements || '',
                quantity: item.qty || 0,
                price: item.price || 0,
                taxrow: item.tax || 0,
                discountrow: item.discount || 0,
            })),
            subtotal: i_total_amnt || 0,
            tax: i_tax || 0,
            discount: i_discount || 0,
            cutoff: i_cutoff || 0,
            shipCharge: i_shipping_charge || 0,
            finalAmnt: i_amnt_aft_tax || 0,
            pymntmthd: i_payment_method || '',
            pymntAcdetails: i_payment_details?.account || '',
            pymntNumber: i_payment_details?.number || '',
            pymntid: i_payment_details?.id || '',
            notes: i_notes || '',
            trmscon: i_terms || '',
        };
    };

    const handleShareInvoice = async (invoice) => {
        try {

            const tempvisisble = getVisibleFields(invoice);
            console.log(tempvisisble);

            setLoadingInvoiceId(invoice.i_id);
            const transformedData = transformInvoiceData(invoice, vendorData); // Pass vendorData
            const visibleFields = getVisibleFields(invoice);

            console.log('transformedInvoiceData:', transformedData);
            console.log('visibleFields:', visibleFields);

            const pdfBlob = await pdf(
                <InvoicePDF
                    invoiceData={transformedData}
                    fieldsVisible={visibleFields}
                    profileImage={profileImage}
                />
            ).toBlob();

            const formData = new FormData();
            formData.append('email', invoice.c_mail);
            formData.append('pdf', pdfBlob, `invoice-${invoice.i_id}.pdf`);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            await api.post(`/invoices/${invoice.i_id}/send`, formData, config);
            alert('Invoice sent successfully to email!');
        } catch (error) {
            console.error('Error sharing invoice:', error);
            alert('Failed to share invoice');
        } finally {
            setLoadingInvoiceId(null);
        }
    };



    return (
        <div className="p-4">
            <div className="row p-0 m-0 w-100 justify-content-center my-4 b-rd-8 text-center">
                <div className="col-lg-6">
                    <div className="d-flex justify-content-center">
                        <input
                            type="text"
                            value={query}
                            onChange={handleChange}
                            placeholder="Search invoices ..."
                            aria-label="Search"
                            className="search-bar form-control px-5 f-18"
                        />
                    </div>
                </div>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Bill No</th>
                        <th>Customer name</th>
                        <th>Total Amount</th>
                        <th>Date Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInvoices.length === 0 ? (
                        <tr>
                            <td className="text-center fw-medium text-danger" colSpan={6}>
                                No invoices found ..
                            </td>
                        </tr>
                    ) : (
                        filteredInvoices.map((invoice, index) => {
                            const visibleFields = getVisibleFields(invoice);
                            const transformedInvoiceData = transformInvoiceData(invoice, vendorData);

                            return (
                                <tr key={invoice.i_id}>
                                    <td>{index + 1}</td>
                                    <td>{invoice.i_id}</td>
                                    <td>{invoice.c_name}</td>
                                    <td>{invoice.i_amnt_aft_tax}</td>
                                    <td>{new Date(invoice.i_date).toLocaleDateString()}</td>
                                    <td className="d-flex justify-content-center align-items-center gap-3">
                                        <button
                                            className="btn b-rd-8 btn-success px-4"
                                            onClick={() => handleShareInvoice(invoice)}
                                            disabled={loadingInvoiceId === invoice.i_id}
                                        >
                                            {loadingInvoiceId === invoice.i_id ? 'Sending...' : 'Share'}
                                        </button>

                                        <PDFDownloadLink
                                            document={<InvoicePDF invoiceData={transformedInvoiceData} fieldsVisible={visibleFields} profileImage={profileImage} />}
                                            fileName={`invoice-${invoice.i_id}.pdf`}
                                            className="btn b-rd-8 btn-warning px-4"
                                            style={{ textDecoration: 'none', color: 'white' }}
                                        >
                                            {({ loading }) => (loading ? 'Loading...' : 'Download')}
                                        </PDFDownloadLink>

                                        <img
                                            src={deleteIcon}
                                            role="button"
                                            onClick={() => handleDelete(invoice.i_id)}
                                            alt="Delete"
                                            height="38"
                                            width="38"
                                        />
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default memo(InvcSection);