// import { useState, useEffect, useRef } from "react";
// import { PDFDownloadLink } from '@react-pdf/renderer';
// import Logo from "../../../../assets/SVGs/brand.svg";
// import rmitemlg from "../../../../assets/SVGs/remove.svg";
// import InvoicePDF from './PDFEngine';
// import "./Engine.css";

// const Engine = () => {

//     const [selectedTemplate, setSelectedTemplate] = useState("simple");
//     const [isGenerateEnabled, setIsGenerateEnabled] = useState(false);
//     const [isPDFReady, setIsPDFReady] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const fileInputRef = useRef(null);
//     const [hasFieldVisibilityChanged, setHasFieldVisibilityChanged] = useState(false);


//     const [invoiceData, setInvoiceData] = useState({
//         company: {
//             name: "Quick Invoice Pvt. Ltd.",
//             address: "A/4-22, International Business Hub, Vesu / Surat, India - 325007",
//             email: "quickofficial@gmail.com",
//             phone: "+91 2345678912",
//         },
//         invoiceNumber: "IN001",
//         date: new Date().toISOString().split("T")[0],
//         customer: {
//             name: "",
//             email: "",
//             address: "",
//             phone: "",
//         },
//         shipFrm: "",
//         shipTo: "",
//         items: [{ description: "", measurements: "", quantity: 1, price: "", taxrow: 0, discountrow: 0 }],
//         subttl: "",
//         tax: "",
//         discount: "",
//         cutoff: "",
//         shipCharge: "",
//         finalAmnt: "",
//         pymntmthd: "",
//         pymntAcdetails: "",
//         pymntNumber: "",
//         pymntid: "",
//         notes: "",
//         trmscon: "",
//     });

//     const [visibleFields, setVisibleFields] = useState({
//         customerAddress: false,
//         customerTelephone: false,
//         shippedFrom: false,
//         shippingTo: false,
//         tax: false,
//         discount: false,
//         cutoff: false,
//         taxrow: false,
//         discountrow: false,
//         shipCharge: false,
//         pymntDetails: false,
//         pymntNumber: false,
//         pymntAcdetails: false,
//         pymntid: false,
//         signature: false,
//         notes: false,
//         termscon: false,
//         grndinword: false,
//     });

//     const fields = [
//         { key: 'shippedFrom', label: 'Shipped From' },
//         { key: 'tax', label: 'Tax' },
//         { key: 'taxrow', label: 'Tax ( Per item )' },
//         { key: 'shippingTo', label: 'Shipping To' },
//         { key: 'shipCharge', label: 'Shipping Charge' },
//         { key: 'notes', label: 'Notes' },
//         { key: 'customerTelephone', label: 'Customer Telephone' },
//         { key: 'customerAddress', label: 'Customer Address' },
//         { key: 'pymntDetails', label: 'Payment Details' },
//         { key: 'pymntNumber', label: 'Card/Cheque Number' },
//         { key: 'pymntAcdetails', label: 'Payment Account Details' },
//         { key: 'pymntid', label: 'Payment id / Transaction id / UPI id' },
//         { key: 'signature', label: 'Signature' },
//         { key: 'discount', label: 'Discount' },
//         { key: 'discountrow', label: 'Discount ( Per item )' },
//         { key: 'cutoff', label: 'Cutoff' },
//         { key: 'termscon', label: 'Terms & Condition' },
//         { key: 'grndinword', label: 'Total in Word' },
//     ];


//     const templateFields = {
//         simple: {
//             visible: {
//                 customerAddress: false,
//                 customerTelephone: false,
//                 shippedFrom: false,
//                 shippingTo: false,
//                 tax: false,
//                 discount: false,
//                 cutoff: false,
//                 taxrow: false,
//                 discountrow: false,
//                 shipCharge: false,
//                 pymntDetails: false,
//                 pymntNumber: false,
//                 pymntAcdetails: false,
//                 pymntid: false,
//                 signature: false,
//                 notes: false,
//                 termscon: false,
//                 grndinword: false,
//             },
//         },
//         taxInvoice: {
//             visible: {
//                 customerAddress: false,
//                 customerTelephone: false,
//                 shippedFrom: false,
//                 shippingTo: false,
//                 tax: true,
//                 discount: false,
//                 cutoff: false,
//                 taxrow: false,
//                 discountrow: false,
//                 shipCharge: false,
//                 pymntDetails: false,
//                 pymntNumber: false,
//                 pymntAcdetails: false,
//                 pymntid: false,
//                 signature: false,
//                 notes: false,
//                 termscon: false,
//                 grndinword: false,
//             },
//         },
//         deliveryInvoice: {
//             visible: {
//                 customerAddress: false,
//                 customerTelephone: false,
//                 shippedFrom: true,
//                 shippingTo: true,
//                 tax: false,
//                 discount: false,
//                 cutoff: false,
//                 taxrow: false,
//                 discountrow: false,
//                 shipCharge: false,
//                 pymntDetails: false,
//                 pymntNumber: false,
//                 pymntAcdetails: false,
//                 pymntid: false,
//                 signature: false,
//                 notes: false,
//                 termscon: false,
//                 grndinword: false,
//             },
//         },
//         professionalInvoice: {
//             visible: {
//                 customerAddress: false,
//                 customerTelephone: false,
//                 shippedFrom: false,
//                 shippingTo: false,
//                 tax: false,
//                 discount: true,
//                 cutoff: false,
//                 taxrow: true,
//                 discountrow: false,
//                 shipCharge: false,
//                 pymntDetails: true,
//                 pymntNumber: false,
//                 pymntAcdetails: false,
//                 pymntid: false,
//                 signature: true,
//                 notes: false,
//                 termscon: false,
//                 grndinword: false,
//             },
//         },
//         elegantInvoice: {
//             visible: {
//                 customerAddress: false,
//                 customerTelephone: false,
//                 shippedFrom: false,
//                 shippingTo: false,
//                 tax: false,
//                 discount: true,
//                 cutoff: false,
//                 taxrow: true,
//                 discountrow: false,
//                 shipCharge: true,
//                 pymntDetails: true,
//                 pymntNumber: false,
//                 pymntAcdetails: false,
//                 pymntid: false,
//                 signature: true,
//                 notes: false,
//                 termscon: false,
//                 grndinword: false,
//             },
//         },
//         custom: {
//             visible: {
//                 customerAddress: false,
//                 customerTelephone: false,
//                 shippedFrom: false,
//                 shippingTo: false,
//                 tax: false,
//                 discount: false,
//                 cutoff: false,
//                 taxrow: false,
//                 discountrow: false,
//                 shipCharge: false,
//                 pymntDetails: false,
//                 pymntNumber: false,
//                 pymntAcdetails: false,
//                 pymntid: false,
//                 signature: false,
//                 notes: false,
//                 termscon: false,
//                 grndinword: false,
//             },
//         },
//     };

//     const handleTemplateChange = (event) => {
//         const template = event.target.value;
//         setSelectedTemplate(template);
//         setVisibleFields(templateFields[template].visible);
//         setHasFieldVisibilityChanged(false); // Reset visibility change state
//     };

//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             console.log("Uploaded file:", file);
//         }
//     };

//     const handleFileButton = () => {
//         fileInputRef.current.click();
//     };

//     const addItem = () => {
//         setInvoiceData((prevData) => ({
//             ...prevData,
//             items: [...prevData.items, { description: "", measurements: "", quantity: 1, price: "", taxrow: 0, discountrow: 0 }],
//         }));
//         setIsEditing(true);
//     };

//     const removeItem = (index) => {
//         if (invoiceData.items.length > 1) {
//             setInvoiceData((prevData) => ({
//                 ...prevData,
//                 items: prevData.items.filter((_, i) => i !== index),
//             }));
//             setIsEditing(true);
//         }
//     };

//     const handleChange = (index, field, value) => {
//         setInvoiceData((prevData) => {
//             const updatedItems = [...prevData.items];
//             updatedItems[index][field] = value;
//             return { ...prevData, items: updatedItems };
//         });
//         setIsEditing(true);
//     };


//     const toggleField = (key) => {
//         // setVisibleFields((prev) => ({ ...prev, [key]: !prev[key] }));
//         setVisibleFields((prev) => {
//             const newVisibleFields = { ...prev, [key]: !prev[key] };
//             const anyFieldVisible = Object.values(newVisibleFields).some(value => value === true);
//             setHasFieldVisibilityChanged(anyFieldVisible); // Mark that a field has changed
//             return newVisibleFields;
//         });
//     };

//     useEffect(() => {
//         const isAllFieldsFilled =
//             invoiceData.customer.name !== "" &&
//             invoiceData.customer.email !== "" &&
//             invoiceData.items.every((item) => item.description && item.price);
//         setIsGenerateEnabled(isAllFieldsFilled);
//     }, [invoiceData]);

//     const calculateSubtotal = () => {
//         return invoiceData.items.reduce((sum, item) => {
//             const itemPrice = Number(item.price) || 0;
//             const itemTax = visibleFields.taxrow ? (itemPrice * (Number(item.taxrow) / 100)) : 0;
//             const itemDiscount = visibleFields.discountrow ? (itemPrice * (Number(item.discountrow) / 100)) : 0;
//             return sum + (item.quantity * (itemPrice + itemTax - itemDiscount));
//         }, 0).toFixed(2);
//     };

//     const calculateGrandTotal = () => {
//         const subtotal = Number(calculateSubtotal());
//         const taxAmount = invoiceData.tax ? (subtotal * (invoiceData.tax / 100)) : 0;
//         const shipCharge = Number(invoiceData.shipCharge) || 0;
//         const discountAmount = invoiceData.discount ? (subtotal * (invoiceData.discount / 100)) : 0;
//         const cutoff = Number(invoiceData.cutoff) || 0;
//         return (subtotal + taxAmount + shipCharge - discountAmount - cutoff).toFixed(2);
//     };

//     const handlePrepareInvoice = () => {
//         setIsPDFReady(true);
//         setIsEditing(false);
//     };

//     const numberToWords = (num) => {
//         const belowTwenty = [
//             "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
//             "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
//             "Eighteen", "Nineteen"
//         ];
//         const tens = [
//             "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
//         ];
//         const thousands = ["", "Thousand", "Million", "Billion"];

//         if (num < 0) return "Negative " + numberToWords(-num);
//         if (num === 0) return belowTwenty[0];

//         let words = '';
//         let i = 0;

//         while (num > 0) {
//             if (num % 1000 !== 0) {
//                 words = `${convertHundreds(num % 1000)} ${thousands[i]} ${words}`;
//             }
//             num = Math.floor(num / 1000);
//             i++;
//         }

//         return words.trim();
//     };

//     const convertHundreds = (num) => {
//         const belowTwenty = [
//             "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
//             "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
//             "Eighteen", "Nineteen"
//         ];
//         const tens = [
//             "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
//         ];

//         let words = '';

//         if (num > 99) {
//             words += `${belowTwenty[Math.floor(num / 100)]} Hundred `;
//             num %= 100;
//         }
//         if (num > 19) {
//             words += `${tens[Math.floor(num / 10)]} `;
//             num %= 10;
//         }
//         if (num > 0) {
//             words += `${belowTwenty[num]} `;
//         }

//         return words.trim();
//     };

//     const finalamntword = numberToWords(Number(calculateGrandTotal()));

//     const handleSaveTemplate = () => {
//         // Collect the names of the visible fields
//         const visibleFieldNames = fields
//             .filter(field => visibleFields[field.key]) // Check if the field is visible
//             .map(field => field.label); // Get the label of the visible field

//         // Print the visible field names
//         console.log("Visible Fields:", visibleFieldNames);
//         // setHasFieldVisibilityChanged(false); 
//     };

//     return (
//         <div className="invoice-container invc-container d-flex align-items-center justify-content-between p-0 v-100 h-100 m-3 position-relative">
//             <div className="invc p-4">
//                 <form noValidate>
//                     <header className="d-flex justify-content-between mb-5">
//                         <div className="brnd-det text-start">
//                             <div className="d-flex align-items-center justify-content-between w-100 gap-2">
//                                 <div className="brnd-logo">
//                                     <img src={Logo} alt="Brand Logo" height="86" width="86" />
//                                 </div>
//                                 <div className="brnd-nm f-34">{invoiceData.company.name}</div>
//                             </div>
//                         </div>
//                         <div className="invc-det text-end">
//                             <div className="invc-identity f-24">
//                                 <span className="sub-field">Invoice No : </span>{invoiceData.invoiceNumber}
//                             </div>
//                             <div className="invc-date f-24">
//                                 <span className="sub-field">Date : </span>{invoiceData.date}
//                             </div>
//                         </div>
//                     </header>

//                     <section className="mb-5">
//                         <div className="brnd-det text-start">
//                             <div className="brnd-addr mb-2">{invoiceData.company.address}</div>
//                             <div className="brnd-eml">
//                                 <span className="sub-field">Email : </span>{invoiceData.company.email}
//                             </div>
//                             <div className="brnd-tele">
//                                 <span className="sub-field">Phone : </span>{invoiceData.company.phone}
//                             </div>
//                         </div>
//                     </section>

//                     <section className="mt-4">
//                         <div className="cust-det text-start">
//                             <div className="cust-det-title f-18 mb-2">Bill to :</div>
//                             <div className="row p-0 m-0 justify-content-between gap-2">
//                                 <div className="col-12 cust-nm p-0">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         placeholder="Customer Name"
//                                         value={invoiceData.customer.name}
//                                         onChange={(e) => setInvoiceData({ ...invoiceData, customer: { ...invoiceData.customer, name: e.target.value } })}
//                                     />
//                                 </div>
//                                 <div className="col-12 cust-eml p-0">
//                                     <input
//                                         type="email"
//                                         className="form-control"
//                                         placeholder="Customer Email"
//                                         value={invoiceData.customer.email}
//                                         onChange={(e) => setInvoiceData({ ...invoiceData, customer: { ...invoiceData.customer, email: e.target.value } })}
//                                     />
//                                 </div>
//                                 {visibleFields.customerAddress && (
//                                     <div className="col-12 cust-eml p-0">
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             placeholder="Customer Address"
//                                             value={invoiceData.customer.address}
//                                             onChange={(e) => setInvoiceData({ ...invoiceData, customer: { ...invoiceData.customer, address: e.target.value } })}
//                                         />
//                                     </div>
//                                 )}
//                                 {visibleFields.customerTelephone && (
//                                     <div className="col-12 cust-eml p-0">
//                                         <input
//                                             type="tel"
//                                             maxLength="10"
//                                             className="form-control"
//                                             placeholder="Customer Contact"
//                                             value={invoiceData.customer.phone}
//                                             onChange={(e) => setInvoiceData({ ...invoiceData, customer: { ...invoiceData.customer, phone: e.target.value } })}
//                                         />
//                                     </div>
//                                 )}
//                                 {visibleFields.shippedFrom && (
//                                     <div className="col-5 cust-eml p-0 pt-2">
//                                         <div className="cust-det-title f-18 mb-2">Shipped From :</div>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             placeholder="Shipping From"
//                                             value={invoiceData.shipFrm}
//                                             onChange={(e) => setInvoiceData({ ...invoiceData, shipFrm: e.target.value })}
//                                         />
//                                     </div>
//                                 )}
//                                 {visibleFields.shippingTo && (
//                                     <div className="col-5 cust-eml p-0 pt-2">
//                                         <div className="cust-det-title f-18 mb-2">Shipping To :</div>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             placeholder="Shipping To"
//                                             value={invoiceData.shipTo}
//                                             onChange={(e) => setInvoiceData({ ...invoiceData, shipTo: e.target.value })}
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </section>

//                     <section className="mt-3">
//                         <table className="table table-bordered maintbl">
//                             <thead>
//                                 <tr>
//                                     <th>No</th>
//                                     <th>Description</th>
//                                     <th>Measurements</th>
//                                     <th>Quantity</th>
//                                     <th>Price</th>
//                                     {visibleFields.taxrow && <th>Tax</th>}
//                                     {visibleFields.discountrow && <th>Discount</th>}
//                                     <th>Total</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="table-group-divider">
//                                 {invoiceData.items.map((item, index) => (
//                                     <tr key={index} className="maintblrw">
//                                         <td>{index + 1}</td>
//                                         <td>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 placeholder="Item description"
//                                                 value={item.description}
//                                                 onChange={(e) => handleChange(index, "description", e.target.value)}
//                                             />
//                                         </td>
//                                         <td>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 placeholder="Measurements"
//                                                 value={item.measurements}
//                                                 onChange={(e) => handleChange(index, "measurements", e.target.value)}
//                                             />
//                                         </td>
//                                         <td>
//                                             <input
//                                                 type="number"
//                                                 className="form-control"
//                                                 min="1"
//                                                 max="100000000"
//                                                 value={item.quantity}
//                                                 onChange={(e) => handleChange(index, "quantity", Number(e.target.value))}
//                                             />
//                                         </td>
//                                         <td>
//                                             <input
//                                                 type="number"
//                                                 min="0"
//                                                 max="100000000"
//                                                 className="form-control"
//                                                 placeholder="Price"
//                                                 value={item.price}
//                                                 onChange={(e) => handleChange(index, "price", Number(e.target.value))}
//                                             />
//                                         </td>
//                                         {visibleFields.taxrow && (
//                                             <td>
//                                                 <input
//                                                     type="number"
//                                                     min="0"
//                                                     max="100"
//                                                     className="form-control"
//                                                     placeholder="Tax %"
//                                                     onChange={(e) => handleChange(index, "taxrow", Number(e.target.value))}
//                                                 />
//                                             </td>
//                                         )}
//                                         {visibleFields.discountrow && (
//                                             <td>
//                                                 <input
//                                                     type="number"
//                                                     min="0"
//                                                     max="100"
//                                                     className="form-control"
//                                                     placeholder="Discount %"
//                                                     onChange={(e) => handleChange(index, "discountrow", Number(e.target.value))}
//                                                 />
//                                             </td>
//                                         )}
//                                         <td className="text-center">{(item.quantity * (item.price || 0)).toFixed(2)}</td>
//                                         <td>
//                                             {invoiceData.items.length > 1 && (
//                                                 <img src={rmitemlg} alt="Remove Item" height="28" width="28" onClick={() => removeItem(index)} />
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                         <button type="button" className="btn brand-btn ad-itm-btn px-4 b-rd-8 m-0" onClick={addItem}>Add Item</button>
//                     </section>

//                     <section className="row d-flex justify-content-between align-items-start p-0 m-0 my-3 mt-5 gap-2">
//                         {visibleFields.pymntDetails && (
//                             <div className="col-xxl-auto px-0">
//                                 <table className="table table-bordered pymnt-table m-0">
//                                     <tbody>
//                                         <tr>
//                                             <th scope="row">Payment Method</th>
//                                             <td>
//                                                 <select
//                                                     className="form-select"
//                                                     value={invoiceData.pymntmthd}
//                                                     onChange={(e) => setInvoiceData({ ...invoiceData, pymntmthd: e.target.value })}
//                                                 >
//                                                     <option value="">Payment method</option>
//                                                     {[
//                                                         "Credit Card",
//                                                         "Debit Card",
//                                                         "Cash",
//                                                         "Check",
//                                                         "Mobile Payment App",
//                                                         "Digital Wallet",
//                                                         "Cryptocurrency",
//                                                         "Bank Transfer",
//                                                         "Buy Now, Pay Later",
//                                                         "Gift Card",
//                                                         "Payment Plan",
//                                                     ].map((method) => (
//                                                         <option key={method} value={method}>{method}</option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                         </tr>
//                                         {visibleFields.pymntNumber && (
//                                             <tr>
//                                                 <th scope="row">Card/Cheque Number</th>
//                                                 <td>
//                                                     <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         placeholder="Card/Cheque/Mobile/Bank/Account Number"
//                                                         value={invoiceData.pymntNumber}
//                                                         onChange={(e) => setInvoiceData({ ...invoiceData, pymntNumber: e.target.value })}
//                                                     />
//                                                 </td>
//                                             </tr>
//                                         )}
//                                         {visibleFields.pymntAcdetails && (
//                                             <tr>
//                                                 <th scope="row">Account Details</th>
//                                                 <td>
//                                                     <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         placeholder="Account Details"
//                                                         value={invoiceData.pymntAcdetails}
//                                                         onChange={(e) => setInvoiceData({ ...invoiceData, pymntAcdetails: e.target.value })}
//                                                     />
//                                                 </td>
//                                             </tr>
//                                         )}
//                                         {visibleFields.pymntid && (
//                                             <tr>
//                                                 <th scope="row">ID</th>
//                                                 <td>
//                                                     <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         placeholder="UPI / Transaction ID"
//                                                         value={invoiceData.pymntid}
//                                                         onChange={(e) => setInvoiceData({ ...invoiceData, pymntid: e.target.value })}
//                                                     />
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                         <div className="col-xxl-5 px-0 ms-auto">
//                             <table className="table table-bordered smry-table m-0 ms-auto">
//                                 <tbody>
//                                     <tr>
//                                         <th scope="row">Subtotal</th>
//                                         <td>{calculateSubtotal()}</td>
//                                     </tr>
//                                     {visibleFields.tax && (
//                                         <>
//                                             <tr>
//                                                 <th scope="row">Tax <br />%</th>
//                                                 <td>
//                                                     <input
//                                                         type="number"
//                                                         min="0"
//                                                         max="100"
//                                                         className="form-control"
//                                                         placeholder="Tax %"
//                                                         value={invoiceData.tax}
//                                                         onChange={(e) => setInvoiceData({ ...invoiceData, tax: Number(e.target.value) })}
//                                                     />
//                                                 </td>
//                                             </tr>
//                                             <tr>
//                                                 <th scope="row">Calculated Tax</th>
//                                                 <td>{(calculateSubtotal() * (invoiceData.tax / 100)).toFixed(2)}</td>
//                                             </tr>
//                                         </>
//                                     )}
//                                     {visibleFields.shipCharge && (
//                                         <tr>
//                                             <th scope="row">Shipping Charge</th>
//                                             <td>
//                                                 <input
//                                                     type="number"
//                                                     min="0"
//                                                     max="100000000"
//                                                     className="form-control"
//                                                     placeholder="Shipping Charge"
//                                                     value={invoiceData.shipCharge}
//                                                     onChange={(e) => setInvoiceData({ ...invoiceData, shipCharge: Number(e.target.value) })}
//                                                 />
//                                             </td>
//                                         </tr>
//                                     )}
//                                     {visibleFields.discount && (
//                                         <>
//                                             <tr>
//                                                 <th scope="row">Discount <br />%</th>
//                                                 <td>
//                                                     <input
//                                                         type="number"
//                                                         min="0"
//                                                         max="100"
//                                                         className="form-control"
//                                                         placeholder="Discount %"
//                                                         value={invoiceData.discount}
//                                                         onChange={(e) => setInvoiceData({ ...invoiceData, discount: Number(e.target.value) })}
//                                                     />
//                                                 </td>
//                                             </tr>
//                                             <tr>
//                                                 <th scope="row">Calculated Discount</th>
//                                                 <td>{(calculateSubtotal() * (invoiceData.discount / 100)).toFixed(2)}</td>
//                                             </tr>
//                                         </>
//                                     )}

//                                     {visibleFields.cutoff && (
//                                         <>
//                                             <tr>
//                                                 <th scope="row">Cutoff</th>
//                                                 <td>
//                                                     <input
//                                                         type="number"
//                                                         min="0"
//                                                         max="100000000"
//                                                         className="form-control"
//                                                         placeholder="Cutoff"
//                                                         value={invoiceData.cutoff}
//                                                         onChange={(e) => setInvoiceData({ ...invoiceData, cutoff: Number(e.target.value) })}
//                                                     />
//                                                 </td>
//                                             </tr>
//                                         </>
//                                     )}

//                                     <tr>
//                                         <th scope="row">Final Amount</th>
//                                         <td>{calculateGrandTotal()}</td>
//                                     </tr>
//                                     {visibleFields.grndinword && (
//                                         <tr>
//                                             <th scope="row">In word</th>
//                                             <td>{finalamntword}</td>
//                                         </tr>
//                                     )}

//                                 </tbody>
//                             </table>
//                         </div>
//                     </section>

//                     {visibleFields.notes && (
//                         <section className="row d-flex justify-content-start align-items-start p-0 m-0 my-3 mt-5">
//                             <div className="col-xxl-6 frm-nts-con px-0">
//                                 <label htmlFor="frm-nts" className="mb-2 f-18">Notes</label>
//                                 <textarea className="form-control frm-nts" placeholder="Leave a comment here" id="frm-nts" value={invoiceData.notes} onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}></textarea>
//                             </div>
//                         </section>
//                     )}

//                     <section className="row d-flex justify-content-between align-items-start p-0 m-0 my-3 mt-5 gap-2">
//                         {visibleFields.termscon && (
//                             <div className="col-xxl-6 frm-nts-con px-0">
//                                 <label htmlFor="frm-t&c" className="mb-2 f-18">Terms & Condition</label>
//                                 <textarea className="form-control frm-nts" placeholder="Terms & Condition" id="frm-t&c" value={invoiceData.trmscon} onChange={(e) => setInvoiceData({ ...invoiceData, trmscon: e.target.value })}></textarea>
//                             </div>
//                         )}
//                         {visibleFields.signature && (
//                             <div className="col-xxl-4 border border-dashed rounded p-4 text-center position-relative frm-sign-con" style={{ minHeight: '150px' }}>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={handleFileChange}
//                                     ref={fileInputRef}
//                                     style={{ display: 'none' }}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={handleFileButton}
//                                     className="btn brand-btn px-4 position-absolute top-50 start-50 translate-middle"
//                                     style={{ fontSize: '24px' }}
//                                 >
//                                     +
//                                 </button>
//                             </div>
//                         )}
//                     </section>

//                     <footer className="mt-5">
//                         <div className="ftr-det d-flex justify-content-between align-items-center">
//                             <div className="ftr-dis f-14">Payment due upon receipt. Thank you for your business!</div>
//                             <div className="ftr-brnd-mark f-14">Generated by Quick Invoice</div>
//                         </div>
//                     </footer>
//                 </form>
//             </div>

//             <div className="sidepnl d-flex gap-0 flex-column p-3">
//                 <div className="selcttemplt sidepnlsec py-3">
//                     <label className="form-label text-center">Select Template</label>
//                     <select className="form-select" name="selectTemplate" onChange={handleTemplateChange}>

//                         <option value="">Select</option>
//                         {Object.keys(templateFields).map((type) => (
//                             <option key={type} value={type}>{type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</option>
//                         ))}

//                         {/* <option value="">Select</option>
//                         {[
//                             "Simple Invoice",
//                             "Tax Invoice",
//                             "Delivery Invoice",
//                             "Professional Invoice",
//                             "Elegant Invoice",
//                             "Custom",
//                         ].map((type) => (
//                             <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
//                         ))} */}

//                     </select>
//                 </div>

//                 {/* Render fields based on selected template */}
//                 {selectedTemplate === "custom" ? (
//                     <div className="prmcustfield sidepnlsec p-0 m-0 py-3 pt-0">
//                         <div className="row justify-content-start align-items-center p-0 m-0 gy-3">
//                             {Object.keys(templateFields.custom.visible).map((key) => {
//                                 // Declare the field variable here
//                                 const field = fields.find(f => f.key === key);
//                                 return (
//                                     <div className="col-xxl-auto" key={key}>
//                                         <button
//                                             className="btn brand-btn b-rd-8 w-100 addoncustbtn"
//                                             onClick={() => toggleField(key)}
//                                         >
//                                             {field ? field.label : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                                         </button>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="prmcustfield sidepnlsec p-0 m-0 py-3 pt-0">
//                         {/* {Object.keys(templateFields[selectedTemplate].visible).map((key) => (
//                                 visibleFields[key] && (
//                                     <div key={key}>
//                                         {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                                     </div>
//                                 )
//                             ))} */}
//                     </div>
//                 )}


//                 {/* <div className="prmcustfield sidepnlsec p-0 m-0 py-3 pt-0">
//                     <div className="row justify-content-start align-items-center p-0 m-0 gy-3">
//                         {fields.map((field) => (
//                             <div className="col-xxl-auto" key={field.key}>
//                                 <button
//                                     className="btn brand-btn b-rd-8 w-100 addoncustbtn"
//                                     onClick={() => toggleField(field.key)}
//                                 >
//                                     {field.label}
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 </div> */}

//                 <div className="actionmenu py-3 d-flex flex-column justify-content-center align-items-center gap-2">
//                     <button className="btn brand-btn px-4" onClick={handleSaveTemplate} disabled={!hasFieldVisibilityChanged}>Save Template</button>
//                     <button className="btn brand-btn px-4">Save Invoice</button>
//                     <button className="btn brand-btn px-4" onClick={handlePrepareInvoice} disabled={!isGenerateEnabled}>Prepare Invoice</button>
//                     {!isEditing && isPDFReady && (
//                         <div className="hide-tooltip">
//                             <PDFDownloadLink document={<InvoicePDF invoiceData={invoiceData} fieldsVisible={visibleFields} />} fileName="invoice.pdf">
//                                 {({ loading, error }) => {
//                                     if (error) {
//                                         console.error("PDF generation error:", error);
//                                     }
//                                     return (
//                                         <button className="btn brand-btn px-4" disabled={loading}>
//                                             {loading ? 'Loading...' : 'Download Invoice'}
//                                         </button>
//                                     );
//                                 }}
//                             </PDFDownloadLink>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Engine;


import { useState, useEffect, useRef } from "react";
import { PDFDownloadLink } from '@react-pdf/renderer';
import Logo from "../../../../assets/SVGs/brand.svg";
import rmitemlg from "../../../../assets/SVGs/remove.svg";
import InvoicePDF from './PDFEngine';
import "./Engine.css";

const Engine = () => {
    const [selectedTemplate, setSelectedTemplate] = useState("simple");
    const [isGenerateEnabled, setIsGenerateEnabled] = useState(false);
    const [isPDFReady, setIsPDFReady] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);
    const [hasFieldVisibilityChanged, setHasFieldVisibilityChanged] = useState(false);

    const [invoiceData, setInvoiceData] = useState({
        company: {
            name: "Quick Invoice Pvt. Ltd.",
            address: "A/4-22, International Business Hub, Vesu / Surat, India - 325007",
            email: "quickofficial@gmail.com",
            phone: "+91 2345678912",
        },
        invoiceNumber: "IN001",
        date: new Date().toISOString().split("T")[0],
        customer: {
            name: "",
            email: "",
            address: "",
            phone: "",
        },
        shipFrm: "",
        shipTo: "",
        items: [{ description: "", measurements: "", quantity: 1, price: "", taxrow: 0, discountrow: 0 }],
        subttl: "",
        tax: "",
        discount: "",
        cutoff: "",
        shipCharge: "",
        finalAmnt: "",
        pymntmthd: "",
        pymntAcdetails: "",
        pymntNumber: "",
        pymntid: "",
        notes: "",
        trmscon: "",
    });

    const [visibleFields, setVisibleFields] = useState({
        customerAddress: false,
        customerTelephone: false,
        shippedFrom: false,
        shippingTo: false,
        tax: false,
        discount: false,
        cutoff: false,
        taxrow: false,
        discountrow: false,
        shipCharge: false,
        pymntDetails: false,
        pymntNumber: false,
        pymntAcdetails: false,
        pymntid: false,
        signature: false,
        notes: false,
        termscon: false,
        grndinword: false,
    });

    const fields = [
        { key: 'shippedFrom', label: 'Shipped From' },
        { key: 'tax', label: 'Tax' },
        { key: 'taxrow', label: 'Tax ( Per item )' },
        { key: 'shippingTo', label: 'Shipping To' },
        { key: 'shipCharge', label: 'Shipping Charge' },
        { key: 'notes', label: 'Notes' },
        { key: 'customerTelephone', label: 'Customer Telephone' },
        { key: 'customerAddress', label: 'Customer Address' },
        { key: 'pymntDetails', label: 'Payment Details' },
        { key: 'pymntNumber', label: 'Card/Cheque Number' },
        { key: 'pymntAcdetails', label: 'Payment Account Details' },
        { key: 'pymntid', label: 'Payment id / Transaction id / UPI id' },
        { key: 'signature', label: 'Signature' },
        { key: 'discount', label: 'Discount' },
        { key: 'discountrow', label: 'Discount ( Per item )' },
        { key: 'cutoff', label: 'Cutoff' },
        { key: 'termscon', label: 'Terms & Condition' },
        { key: 'grndinword', label: 'Total in Word' },
    ];

    const templateFields = {
        simple: { visible: { customerAddress: false, customerTelephone: false, shippedFrom: false, shippingTo: false, tax: false, discount: false, cutoff: false, taxrow: false, discountrow: false, shipCharge: false, pymntDetails: false, pymntNumber: false, pymntAcdetails: false, pymntid: false, signature: false, notes: false, termscon: false, grndinword: false } },
        taxInvoice: { visible: { customerAddress: false, customerTelephone: false, shippedFrom: false, shippingTo: false, tax: true, discount: false, cutoff: false, taxrow: false, discountrow: false, shipCharge: false, pymntDetails: false, pymntNumber: false, pymntAcdetails: false, pymntid: false, signature: false, notes: false, termscon: false, grndinword: false } },
        deliveryInvoice: { visible: { customerAddress: false, customerTelephone: false, shippedFrom: true, shippingTo: true, tax: false, discount: false, cutoff: false, taxrow: false, discountrow: false, shipCharge: false, pymntDetails: false, pymntNumber: false, pymntAcdetails: false, pymntid: false, signature: false, notes: false, termscon: false, grndinword: false } },
        professionalInvoice: { visible: { customerAddress: false, customerTelephone: false, shippedFrom: false, shippingTo: false, tax: false, discount: true, cutoff: false, taxrow: true, discountrow: false, shipCharge: false, pymntDetails: true, pymntNumber: false, pymntAcdetails: false, pymntid: false, signature: true, notes: false, termscon: false, grndinword: false } },
        elegantInvoice: { visible: { customerAddress: false, customerTelephone: false, shippedFrom: false, shippingTo: false, tax: false, discount: true, cutoff: false, taxrow: true, discountrow: false, shipCharge: true, pymntDetails: true, pymntNumber: false, pymntAcdetails: false, pymntid: false, signature: true, notes: false, termscon: false, grndinword: false } },
        custom: { visible: { customerAddress: false, customerTelephone: false, shippedFrom: false, shippingTo: false, tax: false, discount: false, cutoff: false, taxrow: false, discountrow: false, shipCharge: false, pymntDetails: false, pymntNumber: false, pymntAcdetails: false, pymntid: false, signature: false, notes: false, termscon: false, grndinword: false } },
    };

    const handleTemplateChange = (event) => {
        const template = event.target.value;
        setSelectedTemplate(template);
        setVisibleFields(templateFields[template].visible);
        setHasFieldVisibilityChanged(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Uploaded file:", file);
        }
    };

    const handleFileButton = () => {
        fileInputRef.current.click();
    };

    const addItem = () => {
        setInvoiceData((prevData) => ({
            ...prevData,
            items: [...prevData.items, { description: "", measurements: "", quantity: 1, price: "", taxrow: 0, discountrow: 0 }],
        }));
        setIsEditing(true);
    };

    const removeItem = (index) => {
        if (invoiceData.items.length > 1) {
            setInvoiceData((prevData) => ({
                ...prevData,
                items: prevData.items.filter((_, i) => i !== index),
            }));
            setIsEditing(true);
        }
    };

    const handleChange = (index, field, value) => {
        setInvoiceData((prevData) => {
            const updatedItems = [...prevData.items];
            updatedItems[index][field] = value;
            return { ...prevData, items: updatedItems };
        });
        setIsEditing(true);
    };

    const toggleField = (key) => {
        setVisibleFields((prev) => {
            const newVisibleFields = { ...prev, [key]: !prev[key] };
            const anyFieldVisible = Object.values(newVisibleFields).some(value => value === true);
            setHasFieldVisibilityChanged(anyFieldVisible);
            return newVisibleFields;
        });
    };

    useEffect(() => {
        const isAllFieldsFilled =
            invoiceData.customer.name !== "" &&
            invoiceData.customer.email !== "" &&
            invoiceData.items.every((item) => item.description && item.price);
        setIsGenerateEnabled(isAllFieldsFilled);
    }, [invoiceData]);

    const calculateSubtotal = () => {
        return invoiceData.items.reduce((sum, item) => {
            const itemPrice = Number(item.price) || 0;
            const itemTax = visibleFields.taxrow ? (itemPrice * (Number(item.taxrow) / 100)) : 0;
            const itemDiscount = visibleFields.discountrow ? (itemPrice * (Number(item.discountrow) / 100)) : 0;
            return sum + (item.quantity * (itemPrice + itemTax - itemDiscount));
        }, 0).toFixed(2);
    };

    const calculateGrandTotal = () => {
        const subtotal = Number(calculateSubtotal());
        const taxAmount = invoiceData.tax ? (subtotal * (invoiceData.tax / 100)) : 0;
        const shipCharge = Number(invoiceData.shipCharge) || 0;
        const discountAmount = invoiceData.discount ? (subtotal * (invoiceData.discount / 100)) : 0;
        const cutoff = Number(invoiceData.cutoff) || 0;
        return (subtotal + taxAmount + shipCharge - discountAmount - cutoff).toFixed(2);
    };

    const handlePrepareInvoice = () => {
        setIsPDFReady(true);
        setIsEditing(false);
    };

    const numberToWords = (num) => {
        const belowTwenty = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        const thousands = ["", "Thousand", "Million", "Billion"];

        if (num < 0) return "Negative " + numberToWords(-num);
        if (num === 0) return belowTwenty[0];

        let words = '';
        let i = 0;

        while (num > 0) {
            if (num % 1000 !== 0) {
                words = `${convertHundreds(num % 1000)} ${thousands[i]} ${words}`;
            }
            num = Math.floor(num / 1000);
            i++;
        }

        return words.trim();
    };

    const convertHundreds = (num) => {
        const belowTwenty = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

        let words = '';

        if (num > 99) {
            words += `${belowTwenty[Math.floor(num / 100)]} Hundred `;
            num %= 100;
        }
        if (num > 19) {
            words += `${tens[Math.floor(num / 10)]} `;
            num %= 10;
        }
        if (num > 0) {
            words += `${belowTwenty[num]} `;
        }

        return words.trim();
    };

    const finalamntword = numberToWords(Number(calculateGrandTotal()));

    const handleSaveTemplate = () => {
        const visibleFieldNames = fields
            .filter(field => visibleFields[field.key])
            .map(field => field.label);
        console.log("Visible Fields:", visibleFieldNames);
    };

    return (
        <div className="invoice-container invc-container d-flex align-items-center justify-content-between p-0 v-100 h-100 m-3 position-relative">
            <div className="invc p-4">
                <form noValidate>
                    <header className="d-flex justify-content-between mb-5">
                        <div className="brnd-det text-start">
                            <div className="d-flex align-items-center justify-content-between w-100 gap-2">
                                <div className="brnd-logo">
                                    <img src={Logo} alt="Brand Logo" height="86" width="86" />
                                </div>
                                <div className="brnd-nm f-34">{invoiceData.company.name}</div>
                            </div>
                        </div>
                        <div className="invc-det text-end">
                            <div className="invc-identity f-24">
                                <span className="sub-field">Invoice No : </span>{invoiceData.invoiceNumber}
                            </div>
                            <div className="invc-date f-24">
                                <span className="sub-field">Date : </span>{invoiceData.date}
                            </div>
                        </div>
                    </header>

                    <section className="mb-5">
                        <div className="brnd-det text-start">
                            <div className="brnd-addr mb-2">{invoiceData.company.address}</div>
                            <div className="brnd-eml">
                                <span className="sub-field">Email : </span>{invoiceData.company.email}
                            </div>
                            <div className="brnd-tele">
                                <span className="sub-field">Phone : </span>{invoiceData.company.phone}
                            </div>
                        </div>
                    </section>

                    <section className="mt-4">
                        <div className="cust-det text-start">
                            <div className="cust-det-title f-18 mb-2">Bill to :</div>
                            <div className="row p-0 m-0 justify-content-between gap-2">
                                <div className="col-12 cust-nm p-0">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Customer Name"
                                        value={invoiceData.customer.name}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, customer: { ...invoiceData.customer, name: e.target.value } })}
                                    />
                                </div>
                                <div className="col-12 cust-eml p-0">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Customer Email"
                                        value={invoiceData.customer.email}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, customer: { ...invoiceData.customer, email: e.target.value } })}
                                    />
                                </div>
                                {visibleFields.customerAddress && (
                                    <div className="col-12 cust-eml p-0">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Customer Address"
                                            value={invoiceData.customer.address}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, customer: { ...invoiceData.customer, address: e.target.value } })}
                                        />
                                    </div>
                                )}
                                {visibleFields.customerTelephone && (
                                    <div className="col-12 cust-eml p-0">
                                        <input
                                            type="tel"
                                            maxLength="10"
                                            className="form-control"
                                            placeholder="Customer Contact"
                                            value={invoiceData.customer.phone}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, customer: { ...invoiceData.customer, phone: e.target.value } })}
                                        />
                                    </div>
                                )}
                                {visibleFields.shippedFrom && (
                                    <div className="col-5 cust-eml p-0 pt-2">
                                        <div className="cust-det-title f-18 mb-2">Shipped From :</div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Shipping From"
                                            value={invoiceData.shipFrm}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, shipFrm: e.target.value })}
                                        />
                                    </div>
                                )}
                                {visibleFields.shippingTo && (
                                    <div className="col-5 cust-eml p-0 pt-2">
                                        <div className="cust-det-title f-18 mb-2">Shipping To :</div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Shipping To"
                                            value={invoiceData.shipTo}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, shipTo: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="mt-3">
                        <table className="table table-bordered maintbl">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Description</th>
                                    <th>Measurements</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    {visibleFields.taxrow && <th>Tax</th>}
                                    {visibleFields.discountrow && <th>Discount</th>}
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="table-group-divider">
                                {invoiceData.items.map((item, index) => (
                                    <tr key={index} className="maintblrw">
                                        <td>{index + 1}</td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Item description"
                                                value={item.description}
                                                onChange={(e) => handleChange(index, "description", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Measurements"
                                                value={item.measurements}
                                                onChange={(e) => handleChange(index, "measurements", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                min="1"
                                                max="100000000"
                                                value={item.quantity}
                                                onChange={(e) => handleChange(index, "quantity", Number(e.target.value))}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100000000"
                                                className="form-control"
                                                placeholder="Price"
                                                value={item.price}
                                                onChange={(e) => handleChange(index, "price", Number(e.target.value))}
                                            />
                                        </td>
                                        {visibleFields.taxrow && (
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="form-control"
                                                    placeholder="Tax %"
                                                    onChange={(e) => handleChange(index, "taxrow", Number(e.target.value))}
                                                />
                                            </td>
                                        )}
                                        {visibleFields.discountrow && (
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="form-control"
                                                    placeholder="Discount %"
                                                    onChange={(e) => handleChange(index, "discountrow", Number(e.target.value))}
                                                />
                                            </td>
                                        )}
                                        <td className="text-center">{(item.quantity * (item.price || 0)).toFixed(2)}</td>
                                        <td>
                                            {invoiceData.items.length > 1 && (
                                                <img src={rmitemlg} alt="Remove Item" height="28" width="28" onClick={() => removeItem(index)} />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" className="btn brand-btn ad-itm-btn px-4 b-rd-8 m-0" onClick={addItem}>Add Item</button>
                    </section>

                    <section className="row d-flex justify-content-between align-items-start p-0 m-0 my-3 mt-5 gap-2">
                        {visibleFields.pymntDetails && (
                            <div className="col-xxl-auto px-0">
                                <table className="table table-bordered pymnt-table m-0">
                                    <tbody>
                                        <tr>
                                            <th scope="row">Payment Method</th>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={invoiceData.pymntmthd}
                                                    onChange={(e) => setInvoiceData({ ...invoiceData, pymntmthd: e.target.value })}
                                                >
                                                    <option value="">Payment method</option>
                                                    {[
                                                        "Credit Card",
                                                        "Debit Card",
                                                        "Cash",
                                                        "Check",
                                                        "Mobile Payment App",
                                                        "Digital Wallet",
                                                        "Cryptocurrency",
                                                        "Bank Transfer",
                                                        "Buy Now, Pay Later",
                                                        "Gift Card",
                                                        "Payment Plan",
                                                    ].map((method) => (
                                                        <option key={method} value={method}>{method}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        {visibleFields.pymntNumber && (
                                            <tr>
                                                <th scope="row">Card/Cheque Number</th>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Card/Cheque/Mobile/Bank/Account Number"
                                                        value={invoiceData.pymntNumber}
                                                        onChange={(e) => setInvoiceData({ ...invoiceData, pymntNumber: e.target.value })}
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                        {visibleFields.pymntAcdetails && (
                                            <tr>
                                                <th scope="row">Account Details</th>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Account Details"
                                                        value={invoiceData.pymntAcdetails}
                                                        onChange={(e) => setInvoiceData({ ...invoiceData, pymntAcdetails: e.target.value })}
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                        {visibleFields.pymntid && (
                                            <tr>
                                                <th scope="row">ID</th>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="UPI / Transaction ID"
                                                        value={invoiceData.pymntid}
                                                        onChange={(e) => setInvoiceData({ ...invoiceData, pymntid: e.target.value })}
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="col-xxl-5 px-0 ms-auto">
                            <table className="table table-bordered smry-table m-0 ms-auto">
                                <tbody>
                                    <tr>
                                        <th scope="row">Subtotal</th>
                                        <td>{calculateSubtotal()}</td>
                                    </tr>
                                    {visibleFields.tax && (
                                        <>
                                            <tr>
                                                <th scope="row">Tax <br />%</th>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="form-control"
                                                        placeholder="Tax %"
                                                        value={invoiceData.tax}
                                                        onChange={(e) => setInvoiceData({ ...invoiceData, tax: Number(e.target.value) })}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Calculated Tax</th>
                                                <td>{(calculateSubtotal() * (invoiceData.tax / 100)).toFixed(2)}</td>
                                            </tr>
                                        </>
                                    )}
                                    {visibleFields.shipCharge && (
                                        <tr>
                                            <th scope="row">Shipping Charge</th>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100000000"
                                                    className="form-control"
                                                    placeholder="Shipping Charge"
                                                    value={invoiceData.shipCharge}
                                                    onChange={(e) => setInvoiceData({ ...invoiceData, shipCharge: Number(e.target.value) })}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                    {visibleFields.discount && (
                                        <>
                                            <tr>
                                                <th scope="row">Discount <br />%</th>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="form-control"
                                                        placeholder="Discount %"
                                                        value={invoiceData.discount}
                                                        onChange={(e) => setInvoiceData({ ...invoiceData, discount: Number(e.target.value) })}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Calculated Discount</th>
                                                <td>{(calculateSubtotal() * (invoiceData.discount / 100)).toFixed(2)}</td>
                                            </tr>
                                        </>
                                    )}
                                    {visibleFields.cutoff && (
                                        <tr>
                                            <th scope="row">Cutoff</th>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100000000"
                                                    className="form-control"
                                                    placeholder="Cutoff"
                                                    value={invoiceData.cutoff}
                                                    onChange={(e) => setInvoiceData({ ...invoiceData, cutoff: Number(e.target.value) })}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                    <tr>
                                        <th scope="row">Final Amount</th>
                                        <td>{calculateGrandTotal()}</td>
                                    </tr>
                                    {visibleFields.grndinword && (
                                        <tr>
                                            <th scope="row">In word</th>
                                            <td>{finalamntword}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {visibleFields.notes && (
                        <section className="row d-flex justify-content-start align-items-start p-0 m-0 my-3 mt-5">
                            <div className="col-xxl-6 frm-nts-con px-0">
                                <label htmlFor="frm-nts" className="mb-2 f-18">Notes</label>
                                <textarea className="form-control frm-nts" placeholder="Leave a comment here" id="frm-nts" value={invoiceData.notes} onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}></textarea>
                            </div>
                        </section>
                    )}

                    <section className="row d-flex justify-content-between align-items-start p-0 m-0 my-3 mt-5 gap-2">
                        {visibleFields.termscon && (
                            <div className="col-xxl-6 frm-nts-con px-0">
                                <label htmlFor="frm-t&c" className="mb-2 f-18">Terms & Condition</label>
                                <textarea className="form-control frm-nts" placeholder="Terms & Condition" id="frm-t&c" value={invoiceData.trmscon} onChange={(e) => setInvoiceData({ ...invoiceData, trmscon: e.target.value })}></textarea>
                            </div>
                        )}
                        {visibleFields.signature && (
                            <div className="col-xxl-4 border border-dashed rounded p-4 text-center position-relative frm-sign-con" style={{ minHeight: '150px' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                />
                                <button
                                    type="button"
                                    onClick={handleFileButton}
                                    className="btn brand-btn px-4 position-absolute top-50 start-50 translate-middle"
                                    style={{ fontSize: '24px' }}
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </section>

                    <footer className="mt-5">
                        <div className="ftr-det d-flex justify-content-between align-items-center">
                            <div className="ftr-dis f-14">Payment due upon receipt. Thank you for your business!</div>
                            <div className="ftr-brnd-mark f-14">Generated by Quick Invoice</div>
                        </div>
                    </footer>
                </form>
            </div>

            <div className="sidepnl d-flex gap-0 flex-column p-3">
                <div className="selcttemplt sidepnlsec py-3">
                    <label className="form-label text-center">Select Template</label>
                    <select className="form-select" name="selectTemplate" onChange={handleTemplateChange}>
                        <option value="">Select</option>
                        {Object.keys(templateFields).map((type) => (
                            <option key={type} value={type}>{type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</option>
                        ))}
                    </select>
                </div>

                {selectedTemplate === "custom" ? (
                    <div className="prmcustfield sidepnlsec p-0 m-0 py-3 pt-0">
                        <div className="row justify-content-start align-items-center p-0 m-0 gy-3">
                            {Object.keys(templateFields.custom.visible).map((key) => {
                                const field = fields.find(f => f.key === key);
                                return (
                                    <div className="col-xxl-auto" key={key}>
                                        <button
                                            className="btn brand-btn b-rd-8 w-100 addoncustbtn"
                                            onClick={() => toggleField(key)}
                                        >
                                            {field ? field.label : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="prmcustfield sidepnlsec p-0 m-0 py-3 pt-0">
                        {/* Render fields based on selected template */}
                    </div>
                )}

                <div className="actionmenu py-3 d-flex flex-column justify-content-center align-items-center gap-2">
                    <button className="btn brand-btn px-4" onClick={handleSaveTemplate} disabled={!hasFieldVisibilityChanged}>Save Template</button>
                    <button className="btn brand-btn px-4">Save Invoice</button>
                    <button className="btn brand-btn px-4" onClick={handlePrepareInvoice} disabled={!isGenerateEnabled}>Prepare Invoice</button>
                    {!isEditing && isPDFReady && (
                        <div className="hide-tooltip">
                            <PDFDownloadLink document={<InvoicePDF invoiceData={invoiceData} fieldsVisible={visibleFields} />} fileName="invoice.pdf">
                                {({ loading, error }) => {
                                    if (error) {
                                        console.error("PDF generation error:", error);
                                    }
                                    return (
                                        <button className="btn brand-btn px-4" disabled={loading}>
                                            {loading ? 'Loading...' : 'Download Invoice'}
                                        </button>
                                    );
                                }}
                            </PDFDownloadLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Engine;